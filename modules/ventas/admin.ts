import "server-only";
import { and, count, desc, eq, gt, inArray, isNotNull, isNull, lt, min, or, sql, sum, type Column, type SQL } from "drizzle-orm";
import { requireDb } from "@/db";
import { auditLog, inquiries, orders, summitRegistrations, users } from "@/db/schema";
import { EDICION_LABEL, EVENT_CUPO, PASES, finDePreventa, preventaVigente } from "@/content/evento";
import { PAGOS_CON_PROBLEMAS, lugaresOcupados, reservasEnCurso } from "@/modules/summit/core";
import type { EstadoConsulta, EstadoInscripcion, EstadoPedido } from "./estados";

/** Consultas del panel: pedidos, consultas e inscripciones (solo lectura). */

/* ───────────── Búsqueda sin acentos (P-13) ───────────── */

const CON_ACENTO = "áéíóúüñàèìòùäëïö";
const SIN_ACENTO = "aeiouunaeiouaeio";

/** "José Gómez" → "jose gomez" (y escapa los comodines de LIKE). */
export function normalizarBusqueda(q: string): string {
  return q
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[%_\\]/g, (m) => `\\${m}`);
}

/**
 * Condición "contiene" que ignora mayúsculas y acentos en los dos lados. Sin la
 * extensión unaccent: translate(lower(col)) en SQL + normalización en JS.
 */
export function coincide(q: string | undefined, ...cols: Column[]): SQL | undefined {
  const t = q?.trim().slice(0, 80);
  if (!t) return undefined;
  const patron = `%${normalizarBusqueda(t)}%`;
  return or(...cols.map((c) => sql`translate(lower(coalesce(${c}::text, '')), ${CON_ACENTO}, ${SIN_ACENTO}) like ${patron}`));
}

/* ───────────── Paginación en SQL (P-30) ───────────── */

export type Pagina = { pagina?: number; porPagina?: number };

function rango(total: number, p: Pagina, porDefecto = 25) {
  const porPagina = p.porPagina ?? porDefecto;
  const paginas = Math.max(1, Math.ceil(total / porPagina));
  const pagina = Math.min(Math.max(1, p.pagina ?? 1), paginas);
  return { porPagina, paginas, pagina, offset: (pagina - 1) * porPagina };
}

/* ───────────── Pedidos ───────────── */

export async function listarPedidos(f: { q?: string; estado?: EstadoPedido; archivados?: boolean } & Pagina) {
  const db = requireDb();
  const w = and(
    f.archivados ? isNotNull(orders.deletedAt) : isNull(orders.deletedAt),
    f.estado ? eq(orders.estado, f.estado) : undefined,
    coincide(f.q, orders.codigo, orders.nombre, orders.localidad),
  );
  const [t] = await db.select({ n: count() }).from(orders).where(w);
  const r = rango(t?.n ?? 0, f);
  const filas = await db.select().from(orders).where(w).orderBy(desc(orders.createdAt)).limit(r.porPagina).offset(r.offset);
  return { filas, total: t?.n ?? 0, pagina: r.pagina, paginas: r.paginas };
}

export async function obtenerPedido(id: string) {
  const [p] = await requireDb()
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), isNull(orders.deletedAt)));
  return p ?? null;
}

/* ───────────── Consultas ───────────── */

export async function listarConsultas(f: { q?: string; estado?: EstadoConsulta; archivados?: boolean } & Pagina) {
  const db = requireDb();
  const w = and(
    f.archivados ? isNotNull(inquiries.deletedAt) : isNull(inquiries.deletedAt),
    f.estado ? eq(inquiries.estado, f.estado) : undefined,
    coincide(f.q, inquiries.nombre, inquiries.email, inquiries.mensaje),
  );
  const [t] = await db.select({ n: count() }).from(inquiries).where(w);
  const r = rango(t?.n ?? 0, f, 20);
  const filas = await db.select().from(inquiries).where(w).orderBy(desc(inquiries.createdAt)).limit(r.porPagina).offset(r.offset);
  return { filas, total: t?.n ?? 0, pagina: r.pagina, paginas: r.paginas };
}

/* ───────────── Summit ───────────── */

const si = summitRegistrations;

/** Filtros de pago del Summit (P-10). */
export const FILTROS_PAGO = [
  { v: "mp-pendiente", l: "Pagos pendientes en MP" },
  { v: "problemas", l: "Pagos con problemas" },
] as const;
export type FiltroPago = (typeof FILTROS_PAGO)[number]["v"];

function condPago(p?: FiltroPago): SQL | undefined {
  if (p === "mp-pendiente") return and(inArray(si.estado, ["consulto", "seno"]), inArray(si.pagoEstado, ["en_proceso", "rechazado", "pendiente"]));
  if (p === "problemas") return inArray(si.pagoEstado, [...PAGOS_CON_PROBLEMAS]);
  return undefined;
}

export async function listarInscripciones(
  f: { q?: string; estado?: EstadoInscripcion; pase?: string; pago?: FiltroPago; edicion?: string; archivados?: boolean } & Pagina,
) {
  const db = requireDb();
  const w = and(
    f.archivados ? isNotNull(si.deletedAt) : isNull(si.deletedAt),
    eq(si.edicion, f.edicion ?? EDICION_LABEL),
    f.estado ? eq(si.estado, f.estado) : undefined,
    f.pase ? eq(si.pase, f.pase) : undefined,
    condPago(f.pago),
    coincide(f.q, si.codigo, si.nombre, si.ciudad, si.email, si.dni),
  );
  const [t] = await db.select({ n: count() }).from(si).where(w);
  const r = rango(t?.n ?? 0, f, 30);
  const filas = await db.select().from(si).where(w).orderBy(desc(si.createdAt)).limit(r.porPagina).offset(r.offset);
  return { filas, total: t?.n ?? 0, pagina: r.pagina, paginas: r.paginas };
}

/** Ediciones que tienen inscripciones (la actual siempre primero). */
export async function edicionesInscripciones(): Promise<string[]> {
  const rows = await requireDb().selectDistinct({ e: si.edicion }).from(si);
  return [EDICION_LABEL, ...rows.map((r) => r.e).filter((e) => e !== EDICION_LABEL).sort().reverse()];
}

/** Todas las inscripciones de una edición, para el CSV de acreditación. */
export async function inscripcionesParaExport(edicion = EDICION_LABEL) {
  return requireDb()
    .select()
    .from(si)
    .where(and(isNull(si.deletedAt), eq(si.edicion, edicion)))
    .orderBy(si.nombre);
}

/** Cifras del Summit (edición actual): recaudado, lugares, pendientes, asistencia. */
export async function resumenSummit(edicion = EDICION_LABEL) {
  const db = requireDb();
  const base = and(isNull(si.deletedAt), eq(si.edicion, edicion));
  const actual = edicion === EDICION_LABEL;
  const [porPase, [rec], [enProceso], [problemas], [adentro], ocupados, reservas] = await Promise.all([
    db
      .select({ pase: si.pase, n: count() })
      .from(si)
      .where(and(base, inArray(si.estado, ["seno", "pago", "asistio"])))
      .groupBy(si.pase),
    db.select({ total: sum(si.precioReferencia) }).from(si).where(and(base, eq(si.pagoEstado, "aprobado"), inArray(si.estado, ["pago", "asistio"]))),
    db.select({ n: count() }).from(si).where(and(base, eq(si.estado, "consulto"), eq(si.pagoEstado, "en_proceso"))),
    db.select({ n: count() }).from(si).where(and(base, inArray(si.pagoEstado, [...PAGOS_CON_PROBLEMAS]))),
    db.select({ n: count() }).from(si).where(and(base, eq(si.estado, "asistio"))),
    actual ? lugaresOcupados() : Promise.resolve(0),
    actual ? reservasEnCurso() : Promise.resolve(0),
  ]);
  const pases = Object.fromEntries(PASES.map((p) => [p.id, porPase.find((x) => x.pase === p.id)?.n ?? 0])) as Record<string, number>;
  const confirmados = Object.values(pases).reduce((a, b) => a + b, 0);
  const ocupadosReal = actual ? ocupados : confirmados;
  return {
    pases,
    confirmados,
    recaudado: Number(rec?.total ?? 0),
    ocupados: ocupadosReal,
    libres: Math.max(0, EVENT_CUPO - ocupadosReal),
    sobrecupo: Math.max(0, ocupadosReal - EVENT_CUPO),
    /** Checkouts abiertos con lugar reservado + pagos "en proceso" en MP. */
    pendientesMP: reservas + (enProceso?.n ?? 0),
    problemas: problemas?.n ?? 0,
    asistieron: adentro?.n ?? 0,
  };
}

/* ───────────── Conteos (pestañas, Inicio, sidebar) ───────────── */

export async function conteos(edicion = EDICION_LABEL) {
  const db = requireDb();
  const [p, c, i, atender] = await Promise.all([
    db.select({ estado: orders.estado, n: count() }).from(orders).where(isNull(orders.deletedAt)).groupBy(orders.estado),
    db
      .select({ estado: inquiries.estado, n: count() })
      .from(inquiries)
      .where(isNull(inquiries.deletedAt))
      .groupBy(inquiries.estado),
    db
      .select({ estado: si.estado, pase: si.pase, n: count() })
      .from(si)
      .where(and(isNull(si.deletedAt), eq(si.edicion, edicion)))
      .groupBy(si.estado, si.pase),
    // P-10: el badge ya no cuenta "empezó sin pagar" (checkouts abandonados),
    // solo lo que pide una acción: pagos con problemas o rechazados/en proceso de las últimas 48 h.
    db
      .select({ n: count() })
      .from(si)
      .where(
        and(
          isNull(si.deletedAt),
          eq(si.edicion, EDICION_LABEL),
          or(
            inArray(si.pagoEstado, [...PAGOS_CON_PROBLEMAS]),
            and(eq(si.estado, "consulto"), inArray(si.pagoEstado, ["en_proceso", "rechazado"]), gt(si.updatedAt, new Date(Date.now() - 48 * 3600e3))),
          ),
        ),
      ),
  ]);
  const aMapa = (rows: { estado: string; n: number }[]) => {
    const m: Record<string, number> = {};
    for (const r of rows) m[r.estado] = (m[r.estado] ?? 0) + r.n;
    return m;
  };
  return { pedidos: aMapa(p), consultas: aMapa(c), inscripciones: aMapa(i), inscripcionesDetalle: i, inscripcionesAtender: atender[0]?.n ?? 0 };
}

/** Conteos seguros para el Inicio/Sidebar: si la tabla todavía no existe, ceros. */
export async function conteosSeguros() {
  try {
    return await conteos();
  } catch {
    return { pedidos: {}, consultas: {}, inscripciones: {}, inscripcionesDetalle: [], inscripcionesAtender: 0 } as Awaited<ReturnType<typeof conteos>>;
  }
}

/* ───────────── Inicio: números del negocio (P-06) ───────────── */

/** Medianoche de hoy en Argentina. */
export function inicioDeHoyAR(ahora = new Date()): Date {
  const d = new Date(ahora.getTime() - 3 * 3600e3).toISOString().slice(0, 10);
  return new Date(`${d}T00:00:00-03:00`);
}

export async function resumenNegocio() {
  const db = requireDb();
  const hace7 = new Date(Date.now() - 7 * 864e5);
  const hace30 = new Date(Date.now() - 30 * 864e5);
  const hoy = inicioDeHoyAR();
  const vale = sql`${orders.estado}::text not in ('cancelado', 'iniciado')`;
  const [[p7], [pHoy], [cons], [consViejas], top, pagadosHoy, summit] = await Promise.all([
    db.select({ n: count(), monto: sum(orders.total) }).from(orders).where(and(isNull(orders.deletedAt), vale, gt(orders.createdAt, hace7))),
    db.select({ n: count(), monto: sum(orders.total) }).from(orders).where(and(isNull(orders.deletedAt), vale, gt(orders.createdAt, hoy))),
    db.select({ n: count(), vieja: min(inquiries.createdAt) }).from(inquiries).where(and(isNull(inquiries.deletedAt), eq(inquiries.estado, "nueva"))),
    db
      .select({ n: count() })
      .from(inquiries)
      .where(and(isNull(inquiries.deletedAt), eq(inquiries.estado, "nueva"), lt(inquiries.createdAt, new Date(Date.now() - 864e5)))),
    db.execute(sql`
      select i->>'nombre' as nombre, i->>'slug' as slug, sum(coalesce((i->>'qty')::int, 0))::int as unidades, count(distinct o.id)::int as pedidos
      from ${orders} o, jsonb_array_elements(o.items) i
      where o.deleted_at is null and o.created_at > ${hace30} and o.estado::text <> 'cancelado'
      group by 1, 2 order by unidades desc, pedidos desc limit 5`),
    db
      .select({ pase: si.pase, n: count() })
      .from(si)
      .where(and(isNull(si.deletedAt), eq(si.edicion, EDICION_LABEL), eq(si.pagoEstado, "aprobado"), gt(si.pagadoAt, hoy)))
      .groupBy(si.pase),
    resumenSummit(),
  ]);
  const filasTop = ((top as unknown as { rows?: unknown[] }).rows ?? (top as unknown as unknown[])) as {
    nombre: string;
    slug: string;
    unidades: number;
    pedidos: number;
  }[];
  const pv = preventaVigente();
  const diasPreventa = pv ? Math.max(0, Math.ceil((finDePreventa(pv).getTime() - Date.now()) / 864e5)) : null;
  return {
    pedidos7: { n: p7?.n ?? 0, monto: Number(p7?.monto ?? 0) },
    pedidosHoy: { n: pHoy?.n ?? 0, monto: Number(pHoy?.monto ?? 0) },
    consultas: { n: cons?.n ?? 0, masVieja: cons?.vieja ?? null, masDe24h: consViejas?.n ?? 0 },
    top: filasTop,
    inscriptosHoy: Object.fromEntries(pagadosHoy.map((r) => [r.pase, r.n])) as Record<string, number>,
    summit,
    preventa: pv ? { nombre: pv.nombre, dias: diasPreventa ?? 0, hasta: pv.hastaLabel } : null,
  };
}

/* ───────────── Actividad del panel (P-24) ───────────── */

export async function listarActividad(f: { persona?: string; entidad?: string } & Pagina) {
  const db = requireDb();
  const w = and(
    sql`${auditLog.entidad} <> 'datos'`,
    f.persona ? eq(auditLog.userId, f.persona) : undefined,
    f.entidad ? eq(auditLog.entidad, f.entidad) : undefined,
  );
  const [t] = await db.select({ n: count() }).from(auditLog).where(w);
  const r = rango(t?.n ?? 0, f, 40);
  const filas = await db
    .select({
      id: auditLog.id,
      accion: auditLog.accion,
      entidad: auditLog.entidad,
      entidadId: auditLog.entidadId,
      datos: auditLog.datos,
      createdAt: auditLog.createdAt,
      nombre: users.name,
      email: users.email,
    })
    .from(auditLog)
    .leftJoin(users, eq(users.id, auditLog.userId))
    .where(w)
    .orderBy(desc(auditLog.createdAt))
    .limit(r.porPagina)
    .offset(r.offset);
  const personas = await db
    .selectDistinct({ id: users.id, nombre: users.name, email: users.email })
    .from(auditLog)
    .innerJoin(users, eq(users.id, auditLog.userId));
  return { filas, total: t?.n ?? 0, pagina: r.pagina, paginas: r.paginas, personas };
}
