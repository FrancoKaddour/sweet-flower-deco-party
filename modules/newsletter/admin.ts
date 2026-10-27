import "server-only";
import { and, count, desc, eq, gt, isNotNull, isNull, type SQL } from "drizzle-orm";
import { requireDb } from "@/db";
import { campaigns, subscribers } from "@/db/schema";
import { SEGMENTOS } from "@/content/newsletter";
import { condicionSegmento } from "./core";
import { coincide } from "@/modules/ventas/admin";

/** Lecturas del panel de newsletter. */

export async function resumenClub() {
  const db = requireDb();
  const n = async (w: SQL | undefined) => (await db.select({ n: count() }).from(subscribers).where(w))[0]?.n ?? 0;
  // Doble opt-in: "activo" cuenta solo a quien confirmó desde el mail.
  const activo = and(eq(subscribers.estado, "activo"), isNotNull(subscribers.confirmadoAt));
  const [activos, nuevos7, nuevos30, usados, bajas, sinConfirmar] = await Promise.all([
    n(activo),
    n(and(activo, gt(subscribers.createdAt, new Date(Date.now() - 7 * 864e5)))),
    n(and(activo, gt(subscribers.createdAt, new Date(Date.now() - 30 * 864e5)))),
    n(isNotNull(subscribers.codigoUsadoAt)),
    n(eq(subscribers.estado, "baja")),
    n(and(eq(subscribers.estado, "activo"), isNull(subscribers.confirmadoAt))),
  ]);
  const total = activos + bajas;
  return { activos, nuevos7, nuevos30, usados, bajas, sinConfirmar, conversion: total ? Math.round((usados / total) * 100) : 0 };
}

export type FiltroSuscriptores = { q?: string; estado?: "activo" | "baja" | "usados" | "sin-usar" | "sin-confirmar" };

function condSuscriptores(f: FiltroSuscriptores) {
  return and(
    f.estado === "activo" ? and(eq(subscribers.estado, "activo"), isNotNull(subscribers.confirmadoAt)) : undefined,
    f.estado === "baja" ? eq(subscribers.estado, "baja") : undefined,
    f.estado === "sin-confirmar" ? and(eq(subscribers.estado, "activo"), isNull(subscribers.confirmadoAt)) : undefined,
    f.estado === "usados" ? isNotNull(subscribers.codigoUsadoAt) : undefined,
    f.estado === "sin-usar" ? and(eq(subscribers.estado, "activo"), isNull(subscribers.codigoUsadoAt)) : undefined,
    coincide(f.q, subscribers.email, subscribers.nombre, subscribers.codigo),
  );
}

/** Todos los que cumplen el filtro (lo usa el export CSV del frente A). */
export async function listarSuscriptores(f: FiltroSuscriptores) {
  return requireDb().select().from(subscribers).where(condSuscriptores(f)).orderBy(desc(subscribers.createdAt));
}

/** Lista paginada en SQL (P-30) y búsqueda sin acentos (P-13). */
export async function paginarSuscriptores(f: FiltroSuscriptores & { pagina?: number; porPagina?: number }) {
  const db = requireDb();
  const w = condSuscriptores(f);
  const porPagina = f.porPagina ?? 30;
  const [t] = await db.select({ n: count() }).from(subscribers).where(w);
  const total = t?.n ?? 0;
  const paginas = Math.max(1, Math.ceil(total / porPagina));
  const pagina = Math.min(Math.max(1, f.pagina ?? 1), paginas);
  const filas = await db
    .select()
    .from(subscribers)
    .where(w)
    .orderBy(desc(subscribers.createdAt))
    .limit(porPagina)
    .offset((pagina - 1) * porPagina);
  return { filas, total, pagina, paginas };
}

export async function listarCampanas() {
  return requireDb().select().from(campaigns).orderBy(desc(campaigns.createdAt));
}

export async function obtenerCampana(id: string) {
  const [c] = await requireDb().select().from(campaigns).where(eq(campaigns.id, id));
  return c ?? null;
}

/** Cuántas personas hay en cada segmento (para elegir a quién mandar). */
export async function conteoSegmentos(): Promise<Record<string, number>> {
  const db = requireDb();
  const pares = await Promise.all(
    SEGMENTOS.map(async (s) => {
      const [r] = await db.select({ n: count() }).from(subscribers).where(condicionSegmento(s.v));
      return [s.v, r?.n ?? 0] as const;
    }),
  );
  return Object.fromEntries(pares);
}

export async function destinatarios(segmento: string) {
  return requireDb()
    .select({ email: subscribers.email, nombre: subscribers.nombre, codigo: subscribers.codigo, token: subscribers.token })
    .from(subscribers)
    .where(condicionSegmento(segmento));
}

/** S-27: quedó en "enviando" más de 10 minutos (la función se cortó). */
export function campanaTrabada(c: { estado: string; updatedAt: Date }): boolean {
  return c.estado === "enviando" && c.updatedAt.getTime() < Date.now() - 10 * 60_000;
}
