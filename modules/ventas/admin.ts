import "server-only";
import { and, count, desc, eq, ilike, isNull, or, type SQL } from "drizzle-orm";
import { requireDb } from "@/db";
import { inquiries, orders, summitRegistrations } from "@/db/schema";
import type { EstadoConsulta, EstadoInscripcion, EstadoPedido } from "./estados";

/** Consultas del panel: pedidos, consultas e inscripciones (solo lectura). */

function busqueda(q: string | undefined, ...cols: Parameters<typeof ilike>[0][]): SQL | undefined {
  const t = q?.trim();
  if (!t) return undefined;
  return or(...cols.map((c) => ilike(c, `%${t}%`)));
}

export async function listarPedidos(f: { q?: string; estado?: EstadoPedido }) {
  return requireDb()
    .select()
    .from(orders)
    .where(
      and(
        isNull(orders.deletedAt),
        f.estado ? eq(orders.estado, f.estado) : undefined,
        busqueda(f.q, orders.codigo, orders.nombre, orders.localidad),
      ),
    )
    .orderBy(desc(orders.createdAt));
}

export async function obtenerPedido(id: string) {
  const [p] = await requireDb()
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), isNull(orders.deletedAt)));
  return p ?? null;
}

export async function listarConsultas(f: { q?: string; estado?: EstadoConsulta }) {
  return requireDb()
    .select()
    .from(inquiries)
    .where(
      and(
        isNull(inquiries.deletedAt),
        f.estado ? eq(inquiries.estado, f.estado) : undefined,
        busqueda(f.q, inquiries.nombre, inquiries.email, inquiries.mensaje),
      ),
    )
    .orderBy(desc(inquiries.createdAt));
}

export async function listarInscripciones(f: { q?: string; estado?: EstadoInscripcion; pase?: string }) {
  return requireDb()
    .select()
    .from(summitRegistrations)
    .where(
      and(
        isNull(summitRegistrations.deletedAt),
        f.estado ? eq(summitRegistrations.estado, f.estado) : undefined,
        f.pase ? eq(summitRegistrations.pase, f.pase) : undefined,
        busqueda(f.q, summitRegistrations.codigo, summitRegistrations.nombre, summitRegistrations.ciudad),
      ),
    )
    .orderBy(desc(summitRegistrations.createdAt));
}

/** Conteos por estado (para las pestañas y el Inicio). */
export async function conteos() {
  const db = requireDb();
  const [p, c, i] = await Promise.all([
    db.select({ estado: orders.estado, n: count() }).from(orders).where(isNull(orders.deletedAt)).groupBy(orders.estado),
    db
      .select({ estado: inquiries.estado, n: count() })
      .from(inquiries)
      .where(isNull(inquiries.deletedAt))
      .groupBy(inquiries.estado),
    db
      .select({ estado: summitRegistrations.estado, pase: summitRegistrations.pase, n: count() })
      .from(summitRegistrations)
      .where(isNull(summitRegistrations.deletedAt))
      .groupBy(summitRegistrations.estado, summitRegistrations.pase),
  ]);
  const aMapa = (rows: { estado: string; n: number }[]) => {
    const m: Record<string, number> = {};
    for (const r of rows) m[r.estado] = (m[r.estado] ?? 0) + r.n;
    return m;
  };
  return { pedidos: aMapa(p), consultas: aMapa(c), inscripciones: aMapa(i), inscripcionesDetalle: i };
}

/** Conteos seguros para el Inicio/Sidebar: si la tabla todavía no existe, ceros. */
export async function conteosSeguros() {
  try {
    return await conteos();
  } catch {
    return { pedidos: {}, consultas: {}, inscripciones: {}, inscripcionesDetalle: [] } as Awaited<ReturnType<typeof conteos>>;
  }
}
