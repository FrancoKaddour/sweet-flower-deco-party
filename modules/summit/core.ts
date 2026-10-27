import "server-only";
import { after } from "next/server";
import { and, eq, gt, inArray, isNotNull, isNull, or, sql } from "drizzle-orm";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import { requireDb } from "@/db";
import { summitRegistrations, type DbSummitRegistration } from "@/db/schema";
import { BASE_URL, enviarEmail } from "@/lib/email/enviar";
import { correoEntradaSummit } from "@/lib/email/plantillas";
import { obtenerPago, type Pago } from "@/lib/mercadopago";
import { alertarEquipo } from "@/lib/alertas";
import { assertStaff } from "@/lib/dal";
import { chequearMonto } from "@/lib/reglas";
import { EDICION_LABEL, EVENT_CUPO, EVENT_HORARIO, EVENT_NAME, EVENT_SEDE, EVENT_WHEN, PASES } from "@/content/evento";

/**
 * Núcleo del cobro del Summit (ver docs/MERCADOPAGO.md):
 * - Al iniciar el pago se RESERVA el lugar 30 min (`reservaHasta`), contando y
 *   reservando en una sola sentencia SQL con aislamiento Serializable (neon-http
 *   no tiene transacciones interactivas). Vencida la reserva, el lugar se libera solo.
 * - Al llegar un pago aprobado se vuelve a mirar el cupo: si ya no hay lugar,
 *   queda en `pagoEstado = "sobrecupo"` y se avisa al equipo.
 * - El webhook nunca pisa "asistio"/"cancelado" y el mail de la entrada sale una
 *   sola vez (`entradaEnviadaAt`), con reintento en el cron diario.
 */

/** Minutos que se guarda el lugar mientras la persona paga (= vencimiento de la preferencia). */
export const RESERVA_MIN = 30;

/** Estados que ocupan un lugar del cupo (además de las reservas vigentes). */
export const OCUPAN_LUGAR = ["seno", "pago", "asistio"] as const;

/** Pagos con problemas para revisar a mano (filtro del panel). */
export const PAGOS_CON_PROBLEMAS = ["sobrecupo", "monto_invalido"] as const;

const t = summitRegistrations;

/** Condición "ocupa lugar": pagado/señado/asistió, o reserva de pago vigente. */
const ocupa = () =>
  and(
    isNull(t.deletedAt),
    eq(t.edicion, EDICION_LABEL),
    or(inArray(t.estado, [...OCUPAN_LUGAR]), and(eq(t.estado, "consulto"), gt(t.reservaHasta, sql`now()`))),
  );

/** Mismo criterio en SQL crudo (para las sentencias atómicas). $1 = edición. */
const OCUPA_SQL = `deleted_at IS NULL AND edicion = $1::text AND (estado IN ('seno','pago','asistio') OR (estado = 'consulto' AND reserva_hasta > now()))`;

export async function lugaresOcupados(): Promise<number> {
  const [r] = await requireDb().select({ n: sql<number>`count(*)::int` }).from(t).where(ocupa());
  return r?.n ?? 0;
}

/** Personas con el pago en curso ahora mismo (reservas vigentes sin pagar). */
export async function reservasEnCurso(): Promise<number> {
  const [r] = await requireDb()
    .select({ n: sql<number>`count(*)::int` })
    .from(t)
    .where(and(isNull(t.deletedAt), eq(t.edicion, EDICION_LABEL), eq(t.estado, "consulto"), gt(t.reservaHasta, sql`now()`)));
  return r?.n ?? 0;
}

export async function quedanLugares(): Promise<number> {
  return Math.max(0, EVENT_CUPO - (await lugaresOcupados()));
}

/* ───────────── Sentencias atómicas (Serializable + reintento) ───────────── */

async function atomica<T extends Record<string, unknown>>(texto: string, params: unknown[]): Promise<T[]> {
  // drizzle(neon(url)) expone el cliente de Neon en $client (el tipo Db no lo declara).
  const client = (requireDb() as unknown as { $client: NeonQueryFunction<false, false> }).$client;
  for (let intento = 0; ; intento++) {
    try {
      const [filas] = await client.transaction([client.query(texto, params)], { isolationLevel: "Serializable" });
      return filas as unknown as T[];
    } catch (e) {
      const code = (e as { code?: string }).code;
      if ((code === "40001" || code === "40P01") && intento < 4) {
        await new Promise((r) => setTimeout(r, 40 + Math.random() * 120 * (intento + 1)));
        continue;
      }
      throw e;
    }
  }
}

export type DatosReserva = {
  codigo: string;
  pase: string;
  nombre: string;
  email: string;
  telefono: string;
  dni: string;
  ciudad: string;
  precio: number;
  consentAt: Date;
};

/**
 * Crea la inscripción y reserva el lugar SOLO si queda cupo (una sentencia).
 * Devuelve el id, o null si no hay lugar.
 */
export async function reservarLugar(d: DatosReserva): Promise<{ id: string; reservaHasta: Date } | null> {
  const id = crypto.randomUUID();
  const filas = await atomica<{ id: string; reserva_hasta: string }>(
    `INSERT INTO summit_registrations
       (id, codigo, edicion, pase, nombre, email, telefono, dni, ciudad, forma_pago, precio_referencia,
        pago_estado, reserva_hasta, consent_at, estado, created_at, updated_at)
     SELECT $2::text, $3::text, $1::text, $4::text, $5::text, $6::text, $7::text, $8::text, $9::text, 'Mercado Pago'::text, $10::int,
        'pendiente'::text, now() + make_interval(mins => $11::int), $12::timestamptz, 'consulto'::registration_status, now(), now()
     WHERE (SELECT count(*) FROM summit_registrations WHERE ${OCUPA_SQL}) < $13::int
     RETURNING id, reserva_hasta`,
    [EDICION_LABEL, id, d.codigo, d.pase, d.nombre, d.email, d.telefono, d.dni, d.ciudad, d.precio, RESERVA_MIN, d.consentAt.toISOString(), EVENT_CUPO],
  );
  const f = filas[0];
  return f ? { id: f.id, reservaHasta: new Date(f.reserva_hasta) } : null;
}

/**
 * Deduplicación (S-06): si la misma persona (email + edición) tiene una reserva
 * vigente sin pago aprobado, se reutiliza en vez de crear otra fila.
 */
export async function reservaReutilizable(email: string): Promise<DbSummitRegistration | null> {
  const [r] = await requireDb()
    .select()
    .from(t)
    .where(
      and(
        isNull(t.deletedAt),
        eq(t.edicion, EDICION_LABEL),
        eq(t.email, email),
        eq(t.estado, "consulto"),
        inArray(t.pagoEstado, ["pendiente", "rechazado"]),
        gt(t.reservaHasta, sql`now()`),
        gt(t.createdAt, new Date(Date.now() - RESERVA_MIN * 60_000)),
      ),
    )
    .orderBy(sql`${t.createdAt} desc`)
    .limit(1);
  return r ?? null;
}

/* ───────────── Mail de la entrada ───────────── */

/** Corre `fn` después de responder (no demora al webhook ni a la página). */
function enSegundoPlano(fn: () => Promise<unknown>) {
  const seguro = () => fn().catch((e) => console.error("[summit] segundo plano", e instanceof Error ? e.message : e));
  try {
    after(seguro);
  } catch {
    void seguro(); // fuera de un request (scripts): best-effort
  }
}

function correoDe(r: DbSummitRegistration) {
  return correoEntradaSummit({
    base: BASE_URL,
    nombre: r.nombre,
    codigo: r.codigo,
    pase: PASES.find((p) => p.id === r.pase)?.nombre ?? r.pase,
    monto: r.precioReferencia ?? 0,
    evento: EVENT_NAME,
    edicion: EDICION_LABEL,
    fecha: EVENT_WHEN,
    horario: EVENT_HORARIO,
    sede: EVENT_SEDE,
  });
}

/**
 * Manda la entrada si todavía no salió. Reclama el envío con un UPDATE atómico
 * (`entradaEnviadaAt` null → now), así dos avisos simultáneos no mandan dos mails.
 * Si falla, lo libera para que lo reintente el cron y avisa al equipo.
 */
export async function enviarEntradaSiFalta(id: string): Promise<"enviada" | "ya" | "fallo" | "simulado"> {
  const db = requireDb();
  const [r] = await db
    .update(t)
    .set({ entradaEnviadaAt: new Date() })
    .where(and(eq(t.id, id), isNull(t.entradaEnviadaAt), isNull(t.deletedAt), isNotNull(t.email), inArray(t.estado, ["pago", "asistio"])))
    .returning();
  if (!r?.email) return "ya";
  const c = correoDe(r);
  const res = await enviarEmail({ to: r.email, subject: c.asunto, html: c.html, text: c.texto });
  if (res.ok) return "enviada";
  await db.update(t).set({ entradaEnviadaAt: null }).where(eq(t.id, id));
  if (res.simulado) return "simulado";
  await alertarEquipo("No salió el mail de una entrada del Summit", { Código: r.codigo, Nombre: r.nombre, "Qué pasa": "Se reintenta solo en el cron diario; también podés usar “Reenviar entrada” en el panel." }, "/panel/summit");
  return "fallo";
}

/** Cron diario: reintenta las entradas pagadas que no salieron. */
export async function reintentarEntradasPendientes(): Promise<{ enviadas: number; fallidas: number }> {
  const pendientes = await requireDb()
    .select({ id: t.id })
    .from(t)
    .where(and(isNull(t.deletedAt), eq(t.pagoEstado, "aprobado"), inArray(t.estado, ["pago", "asistio"]), isNull(t.entradaEnviadaAt), isNotNull(t.email)))
    .limit(50);
  let enviadas = 0;
  let fallidas = 0;
  for (const p of pendientes) {
    const r = await enviarEntradaSiFalta(p.id);
    if (r === "enviada") enviadas++;
    else if (r === "fallo") fallidas++;
  }
  return { enviadas, fallidas };
}

/**
 * Botón "Reenviar entrada" del panel (solo staff). Manda el mail aunque ya haya
 * salido antes (la persona lo perdió o cambió de casilla).
 */
export async function reenviarEntrada(inscripcionId: string): Promise<{ ok: boolean; mensaje: string }> {
  await assertStaff();
  const db = requireDb();
  const [r] = await db.select().from(t).where(and(eq(t.id, inscripcionId), isNull(t.deletedAt)));
  if (!r) return { ok: false, mensaje: "No encontramos la inscripción." };
  if (!r.email) return { ok: false, mensaje: "La inscripción no tiene email." };
  if (r.estado !== "pago" && r.estado !== "asistio") return { ok: false, mensaje: "Solo se reenvía la entrada de inscripciones pagadas." };
  const c = correoDe(r);
  const res = await enviarEmail({ to: r.email, subject: c.asunto, html: c.html, text: c.texto });
  if (res.simulado) return { ok: false, mensaje: "El envío de mails todavía no está activado (falta Resend)." };
  if (!res.ok) return { ok: false, mensaje: "No se pudo enviar. Probá de nuevo en un rato." };
  await db.update(t).set({ entradaEnviadaAt: new Date() }).where(eq(t.id, r.id));
  return { ok: true, mensaje: `Entrada reenviada a ${r.email}.` };
}

/**
 * ¿Se puede archivar? (P-04) Archivar libera el lugar, así que NO se archivan
 * inscripciones pagadas, señadas o con plata a resolver: primero se cancelan
 * (con la devolución hecha a mano en Mercado Pago).
 */
export async function puedeArchivarse(id: string): Promise<{ ok: true } | { ok: false; mensaje: string }> {
  const [r] = await requireDb().select({ estado: t.estado, pagoEstado: t.pagoEstado }).from(t).where(eq(t.id, id));
  if (!r) return { ok: false, mensaje: "No encontramos la inscripción." };
  if (r.estado === "pago" || r.estado === "asistio" || r.estado === "seno" || r.pagoEstado === "aprobado") {
    return { ok: false, mensaje: "Está paga: no se puede archivar. Si corresponde, devolvé el pago en Mercado Pago y pasala a Cancelado." };
  }
  if (r.pagoEstado === "sobrecupo" || r.pagoEstado === "monto_invalido") {
    return { ok: false, mensaje: "Tiene un pago a resolver (devolverlo o aceptarlo). Resolvelo antes de archivar." };
  }
  return { ok: true };
}

/* ───────────── Aplicar el estado de un pago ───────────── */

const ESTADO_PAGO: Record<Pago["status"], string> = {
  approved: "aprobado",
  authorized: "en_proceso",
  in_process: "en_proceso",
  pending: "pendiente",
  rejected: "rechazado",
  cancelled: "rechazado",
  refunded: "devuelto",
  charged_back: "devuelto",
};

const linkPanel = "/panel/summit";
const pesos = (n: number) => `$${Math.round(n).toLocaleString("es-AR")}`;

/**
 * Aplica el estado REAL de un pago (consultado a la API de Mercado Pago) a su
 * inscripción. Idempotente: MP reintenta los avisos y la vuelta del checkout
 * también sincroniza; nada se duplica.
 */
export async function aplicarPago(pago: Pago): Promise<DbSummitRegistration | null> {
  const ref = pago.external_reference;
  if (!ref || !/^[0-9a-f-]{36}$/i.test(ref)) return null;
  const db = requireDb();
  const [r] = await db.select().from(t).where(eq(t.id, ref));
  if (!r) return null;
  const pagoEstado = ESTADO_PAGO[pago.status] ?? "pendiente";
  const mpId = String(pago.id);

  // Pago para una inscripción archivada (S-08): no se toca, se avisa.
  if (r.deletedAt) {
    if (pagoEstado === "aprobado" && r.mpPaymentId !== mpId) {
      await db.update(t).set({ mpPaymentId: mpId }).where(eq(t.id, r.id));
      enSegundoPlano(() => alertarEquipo("Pago aprobado de una inscripción ARCHIVADA", { Código: r.codigo, Nombre: r.nombre, Monto: pesos(pago.transaction_amount), "Pago MP": mpId }, linkPanel));
    }
    return r;
  }

  if (pagoEstado === "aprobado") return aprobar(r, pago);

  if (pagoEstado === "devuelto") {
    if (r.mpPaymentId && r.mpPaymentId !== mpId) return r; // devolución de otro intento
    const [n] = await db.update(t).set({ pagoEstado, estado: "cancelado", mpPaymentId: mpId }).where(eq(t.id, ref)).returning();
    if (n && r.pagoEstado !== "devuelto") {
      enSegundoPlano(() => alertarEquipo("Pago devuelto / contracargo en el Summit", { Código: r.codigo, Nombre: r.nombre, "Pago MP": mpId }, linkPanel));
    }
    return n ?? r;
  }

  // Pendiente / en proceso / rechazado: no pisa un pago ya resuelto.
  if (r.pagoEstado === "aprobado" || r.pagoEstado === "sobrecupo" || r.pagoEstado === "monto_invalido" || r.pagoEstado === "devuelto") return r;
  const [n] = await db.update(t).set({ pagoEstado, mpPaymentId: mpId }).where(eq(t.id, ref)).returning();
  return n ?? r;
}

async function aprobar(r: DbSummitRegistration, pago: Pago): Promise<DbSummitRegistration> {
  const db = requireDb();
  const mpId = String(pago.id);
  const aprobadoEn = pago.date_approved ? new Date(pago.date_approved) : new Date();

  // Ya aplicado (reintento de MP o la vuelta del checkout): solo asegurar la entrada.
  if (r.pagoEstado === "aprobado") {
    if (r.mpPaymentId && r.mpPaymentId !== mpId) {
      // Pagó dos veces la misma inscripción (dos pestañas): la plata entró dos veces.
      enSegundoPlano(() => alertarEquipo("Pago DUPLICADO de una inscripción del Summit", { Código: r.codigo, Nombre: r.nombre, "Pago registrado": r.mpPaymentId, "Pago nuevo": mpId, "Qué hacer": "Devolver uno de los dos desde Mercado Pago." }, linkPanel));
    } else if (r.estado === "pago" || r.estado === "asistio") {
      enSegundoPlano(() => enviarEntradaSiFalta(r.id));
    }
    return r;
  }

  // Monto y moneda (S-03).
  const chequeo = chequearMonto(r.precioReferencia, pago);
  if (!chequeo.ok) {
    const [n] = await db.update(t).set({ pagoEstado: "monto_invalido", mpPaymentId: mpId, pagadoAt: aprobadoEn }).where(eq(t.id, r.id)).returning();
    enSegundoPlano(() =>
      alertarEquipo("Pago del Summit con monto o moneda que no coinciden", {
        Código: r.codigo,
        Nombre: r.nombre,
        Esperado: r.precioReferencia != null ? pesos(r.precioReferencia) : "sin precio",
        Cobrado: `${pago.transaction_amount} ${pago.currency_id ?? "?"}`,
        Motivo: chequeo.motivo,
        "Pago MP": mpId,
      }, linkPanel),
    );
    return n ?? r;
  }

  // Ya figuraba como pagada a mano (transferencia) o cancelada: no se pisa el
  // estado (P-03); se registra el pago y, si nunca salió, la entrada.
  if (r.estado === "pago" || r.estado === "asistio" || r.estado === "cancelado") {
    const [n] = await db
      .update(t)
      .set({ pagoEstado: "aprobado", mpPaymentId: mpId, pagadoAt: r.pagadoAt ?? aprobadoEn })
      .where(eq(t.id, r.id))
      .returning();
    if (r.estado === "cancelado") {
      enSegundoPlano(() => alertarEquipo("Pago aprobado de una inscripción CANCELADA", { Código: r.codigo, Nombre: r.nombre, "Pago MP": mpId, "Qué hacer": "Devolver el pago o reactivarla a mano." }, linkPanel));
    } else {
      enSegundoPlano(() => enviarEntradaSiFalta(r.id));
    }
    return n ?? r;
  }

  // consulto/seno → pago, SOLO si su reserva estaba vigente al aprobarse o si
  // todavía hay cupo (conteo y cambio en una sentencia).
  const filas = await atomica<{ id: string }>(
    `UPDATE summit_registrations SET estado = 'pago', pago_estado = 'aprobado', mp_payment_id = $3::text, pagado_at = $4::timestamptz, updated_at = now()
     WHERE id = $2::text AND deleted_at IS NULL AND estado IN ('consulto','seno') AND pago_estado IS DISTINCT FROM 'aprobado'
       AND (estado = 'seno' OR reserva_hasta >= $4::timestamptz
            OR (SELECT count(*) FROM summit_registrations WHERE ${OCUPA_SQL} AND id <> $2::text) < $5::int)
     RETURNING id`,
    [EDICION_LABEL, r.id, mpId, aprobadoEn.toISOString(), EVENT_CUPO],
  );
  const [act] = await db.select().from(t).where(eq(t.id, r.id));
  if (filas.length && act) {
    enSegundoPlano(async () => {
      await enviarEntradaSiFalta(act.id);
      await alertarEquipo("Nueva inscripción pagada al Summit", {
        Código: act.codigo,
        Nombre: act.nombre,
        Pase: PASES.find((p) => p.id === act.pase)?.nombre ?? act.pase,
        Monto: pesos(pago.transaction_amount),
        "Lugares ocupados": `${await lugaresOcupados()} de ${EVENT_CUPO}`,
      }, linkPanel);
    });
    return act;
  }
  if (act?.pagoEstado === "aprobado") return act; // otro aviso lo aplicó en paralelo

  // Sin lugar: sobrecupo (S-01). La plata entró: devolver o aceptar a mano.
  const [n] = await db
    .update(t)
    .set({ pagoEstado: "sobrecupo", mpPaymentId: mpId, pagadoAt: aprobadoEn })
    .where(and(eq(t.id, r.id), sql`${t.pagoEstado} is distinct from 'aprobado'`))
    .returning();
  enSegundoPlano(() =>
    alertarEquipo("SOBRECUPO: pagaron una entrada con el cupo lleno", {
      Código: r.codigo,
      Nombre: r.nombre,
      Monto: pesos(pago.transaction_amount),
      "Pago MP": mpId,
      "Qué hacer": "Devolver el pago desde Mercado Pago, o pasarla a Pagó a mano si se suma un lugar.",
    }, linkPanel),
  );
  return n ?? act ?? r;
}

/* ───────────── Sincronizar ───────────── */

const consultasRecientes = new Map<string, number>();

/**
 * Consulta un pago por id y lo aplica. `refEsperada` (vuelta del checkout,
 * S-07): solo se aplica si el pago es de ESA inscripción, y la misma consulta
 * no se repite antes de 10 s (recargas de la página).
 */
export async function sincronizarPago(paymentId: string, refEsperada?: string): Promise<DbSummitRegistration | null> {
  if (refEsperada) {
    const clave = `${paymentId}:${refEsperada}`;
    const ultima = consultasRecientes.get(clave) ?? 0;
    if (Date.now() - ultima < 10_000) return null;
    consultasRecientes.set(clave, Date.now());
    if (consultasRecientes.size > 500) consultasRecientes.clear();
  }
  const pago = await obtenerPago(paymentId);
  if (!pago) return null;
  if (refEsperada && pago.external_reference !== refEsperada) return null;
  return aplicarPago(pago);
}
