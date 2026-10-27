"use server";

import { revalidatePath } from "next/cache";
import { and, count, eq, isNotNull, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import { requireDb } from "@/db";
import { auditLog, inquiries, orders, summitRegistrations } from "@/db/schema";
import { assertStaff } from "@/lib/dal";
import { enmascararDni } from "@/lib/reglas";
import { EDICION_LABEL, EVENT_CUPO, PASES } from "@/content/evento";
import { enviarEntradaSiFalta, puedeArchivarse, reenviarEntrada } from "@/modules/summit/core";
import { ESTADOS_CONSULTA, ESTADOS_INSCRIPCION, ESTADOS_PEDIDO, PERMISOS, puede } from "./estados";
import { coincide } from "./admin";

/** Acciones del panel sobre pedidos, consultas e inscripciones (staff). */

export type TipoRegistro = "pedido" | "consulta" | "inscripcion";
type Res = { ok: boolean; mensaje: string };

const TABLAS = { pedido: orders, consulta: inquiries, inscripcion: summitRegistrations } as const;
const ESTADOS = {
  pedido: ESTADOS_PEDIDO.map((e) => e.v) as string[],
  consulta: ESTADOS_CONSULTA.map((e) => e.v) as string[],
  inscripcion: ESTADOS_INSCRIPCION.map((e) => e.v) as string[],
};
const RUTAS = { pedido: "/panel/pedidos", consulta: "/panel/consultas", inscripcion: "/panel/summit" } as const;
const NOMBRE = { pedido: "Pedido", consulta: "Consulta", inscripcion: "Inscripción" } as const;

const tipoSchema = z.enum(["pedido", "consulta", "inscripcion"]);

async function auditar(userId: string, accion: string, entidad: string, entidadId: string, datos?: object) {
  await requireDb()
    .insert(auditLog)
    .values({ userId, accion, entidad, entidadId, datos: (datos ?? null) as Record<string, unknown> | null });
}

function refrescar(tipo: TipoRegistro) {
  revalidatePath(RUTAS[tipo], "layout");
  revalidatePath("/panel");
}

export async function cambiarEstado(tipo: TipoRegistro, id: string, estado: string): Promise<Res> {
  const user = await assertStaff(PERMISOS.estados.roles);
  const t = tipoSchema.parse(tipo);
  if (!ESTADOS[t].includes(estado)) return { ok: false, mensaje: "Estado inválido." };
  const tabla = TABLAS[t];
  // El enum de cada tabla ya fue validado arriba contra su propia lista.
  const r = await requireDb()
    .update(tabla)
    .set({ estado } as never)
    .where(and(eq(tabla.id, id), isNull(tabla.deletedAt)))
    .returning({ id: tabla.id });
  if (!r.length) return { ok: false, mensaje: "No lo encontramos (¿lo archivaron?)." };
  await auditar(user.id, `${t}.estado`, t, id, { estado });
  // P-31: pasar a "Pagó" a mano (transferencia) manda la entrada si nunca salió.
  let extra = "";
  if (t === "inscripcion" && estado === "pago") {
    const e = await enviarEntradaSiFalta(id);
    extra = e === "enviada" ? " Le mandamos la entrada por mail." : e === "fallo" ? " No salió el mail de la entrada: probá “Reenviar entrada”." : "";
  }
  refrescar(t);
  const lista: readonly { v: string; l: string }[] = t === "pedido" ? ESTADOS_PEDIDO : t === "consulta" ? ESTADOS_CONSULTA : ESTADOS_INSCRIPCION;
  const l = lista.find((x) => x.v === estado)?.l ?? estado;
  return { ok: true, mensaje: `${NOMBRE[t]}: ${l}.${extra}` };
}

const seguimientoSchema = z.object({
  telefono: z.string().trim().max(40).transform((v) => v || null),
  notaInterna: z.string().trim().max(3000).transform((v) => v || null),
});

export async function guardarSeguimiento(
  tipo: TipoRegistro,
  id: string,
  _prev: { ok: boolean; mensaje: string } | null,
  fd: FormData,
): Promise<{ ok: boolean; mensaje: string }> {
  const user = await assertStaff(PERMISOS.estados.roles);
  const t = tipoSchema.parse(tipo);
  const p = seguimientoSchema.safeParse({ telefono: fd.get("telefono") ?? "", notaInterna: fd.get("notaInterna") ?? "" });
  if (!p.success) return { ok: false, mensaje: "Revisá los datos (texto demasiado largo)." };
  const tabla = TABLAS[t];
  await requireDb().update(tabla).set(p.data).where(eq(tabla.id, id));
  await auditar(user.id, `${t}.seguimiento`, t, id);
  refrescar(t);
  return { ok: true, mensaje: "Guardado." };
}

/**
 * Archiva (soft delete). Solo admin. Las inscripciones pagas NO se archivan
 * (liberarían el lugar): se cancelan y se devuelve el pago a mano en MP (P-04).
 */
export async function archivarRegistro(tipo: TipoRegistro, id: string): Promise<Res> {
  const user = await assertStaff(PERMISOS.archivar.roles);
  const t = tipoSchema.parse(tipo);
  if (t === "inscripcion") {
    const ok = await puedeArchivarse(id);
    if (!ok.ok) return { ok: false, mensaje: ok.mensaje };
  }
  const tabla = TABLAS[t];
  await requireDb().update(tabla).set({ deletedAt: new Date() }).where(eq(tabla.id, id));
  await auditar(user.id, `${t}.archivar`, t, id);
  refrescar(t);
  return { ok: true, mensaje: `${NOMBRE[t]} archivada. La encontrás en “Archivados”.` };
}

/** Saca del archivo (P-19). */
export async function restaurarRegistro(tipo: TipoRegistro, id: string): Promise<Res> {
  const user = await assertStaff(PERMISOS.archivar.roles);
  const t = tipoSchema.parse(tipo);
  const tabla = TABLAS[t];
  const r = await requireDb()
    .update(tabla)
    .set({ deletedAt: null })
    .where(and(eq(tabla.id, id), isNotNull(tabla.deletedAt)))
    .returning({ id: tabla.id });
  if (!r.length) return { ok: false, mensaje: "No estaba archivado." };
  await auditar(user.id, `${t}.restaurar`, t, id);
  refrescar(t);
  return { ok: true, mensaje: `${NOMBRE[t]} restaurada.` };
}

/* ───────────── Summit: entrada y acreditación (P-05) ───────────── */

export async function reenviarEntradaPanel(id: string): Promise<Res> {
  const user = await assertStaff(PERMISOS.checkIn.roles);
  const r = await reenviarEntrada(id);
  if (r.ok) await auditar(user.id, "inscripcion.reenviar_entrada", "inscripcion", id);
  return r;
}

export type ResultadoCheckIn = {
  id: string;
  nombre: string;
  codigo: string;
  pase: string;
  estado: string;
  pagoEstado: string | null;
  dni: string;
  ciudad: string | null;
};

/** Busca por DNI, código (SUM-…) o nombre. Máximo 6 resultados. */
export async function buscarCheckIn(texto: string): Promise<{ ok: boolean; mensaje: string; resultados: ResultadoCheckIn[] }> {
  const user = await assertStaff(PERMISOS.checkIn.roles);
  const t = String(texto ?? "").trim().slice(0, 80);
  if (t.length < 2) return { ok: true, mensaje: "", resultados: [] };
  const si = summitRegistrations;
  const digitos = t.replace(/\D/g, "");
  const codigo = t.toUpperCase().replace(/\s/g, "");
  const filas = await requireDb()
    .select()
    .from(si)
    .where(
      and(
        isNull(si.deletedAt),
        eq(si.edicion, EDICION_LABEL),
        or(
          eq(si.codigo, codigo),
          digitos.length >= 6 ? sql`regexp_replace(coalesce(${si.dni}, ''), '\\D', '', 'g') = ${digitos}` : undefined,
          coincide(t, si.nombre, si.codigo),
        ),
      ),
    )
    .limit(6);
  const verDni = puede(user.role, "dniCompleto");
  return {
    ok: true,
    mensaje: filas.length ? "" : "No encontramos a nadie con ese DNI, código o nombre en esta edición.",
    resultados: filas.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      codigo: r.codigo,
      pase: PASES.find((p) => p.id === r.pase)?.nombre ?? r.pase,
      estado: r.estado,
      pagoEstado: r.pagoEstado,
      dni: verDni ? (r.dni ?? "") : enmascararDni(r.dni),
      ciudad: r.ciudad,
    })),
  };
}

/** Acreditación: marca "Asistió" (solo si está paga) y devuelve cuántos hay adentro. */
export async function marcarAsistio(id: string, valor = true): Promise<Res & { adentro?: number; cupo?: number }> {
  const user = await assertStaff(PERMISOS.checkIn.roles);
  const si = summitRegistrations;
  const db = requireDb();
  const r = await db
    .update(si)
    .set({ estado: valor ? "asistio" : "pago" })
    .where(and(eq(si.id, id), isNull(si.deletedAt), eq(si.estado, valor ? "pago" : "asistio")))
    .returning({ nombre: si.nombre });
  if (!r.length) {
    const [x] = await db.select({ estado: si.estado }).from(si).where(eq(si.id, id));
    const msg =
      x?.estado === "asistio" && valor
        ? "Ya estaba acreditada."
        : x?.estado === "consulto" || x?.estado === "seno"
          ? "No figura como pagada: revisá el pago antes de dejarla pasar."
          : x?.estado === "cancelado"
            ? "Está cancelada."
            : "No la encontramos.";
    return { ok: false, mensaje: msg };
  }
  await auditar(user.id, valor ? "inscripcion.asistio" : "inscripcion.asistio_deshacer", "inscripcion", id);
  const [n] = await db
    .select({ n: count() })
    .from(si)
    .where(and(isNull(si.deletedAt), eq(si.edicion, EDICION_LABEL), eq(si.estado, "asistio")));
  refrescar("inscripcion");
  return { ok: true, mensaje: valor ? `${r[0].nombre}: acreditada.` : `${r[0].nombre}: se quitó la asistencia.`, adentro: n?.n ?? 0, cupo: EVENT_CUPO };
}
