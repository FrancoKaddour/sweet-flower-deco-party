import "server-only";
import { and, count, desc, eq, gt, ilike, isNotNull, isNull, or, type SQL } from "drizzle-orm";
import { requireDb } from "@/db";
import { campaigns, subscribers } from "@/db/schema";
import { SEGMENTOS } from "@/content/newsletter";
import { condicionSegmento } from "./core";

/** Lecturas del panel de newsletter. */

export async function resumenClub() {
  const db = requireDb();
  const n = async (w: SQL | undefined) => (await db.select({ n: count() }).from(subscribers).where(w))[0]?.n ?? 0;
  const activo = eq(subscribers.estado, "activo");
  const [activos, nuevos30, usados, bajas] = await Promise.all([
    n(activo),
    n(and(activo, gt(subscribers.createdAt, new Date(Date.now() - 30 * 864e5)))),
    n(isNotNull(subscribers.codigoUsadoAt)),
    n(eq(subscribers.estado, "baja")),
  ]);
  const total = activos + bajas;
  return { activos, nuevos30, usados, bajas, conversion: total ? Math.round((usados / total) * 100) : 0 };
}

export type FiltroSuscriptores = { q?: string; estado?: "activo" | "baja" | "usados" | "sin-usar" };

export async function listarSuscriptores(f: FiltroSuscriptores) {
  const t = f.q?.trim();
  return requireDb()
    .select()
    .from(subscribers)
    .where(
      and(
        f.estado === "activo" || f.estado === "baja" ? eq(subscribers.estado, f.estado) : undefined,
        f.estado === "usados" ? isNotNull(subscribers.codigoUsadoAt) : undefined,
        f.estado === "sin-usar" ? and(eq(subscribers.estado, "activo"), isNull(subscribers.codigoUsadoAt)) : undefined,
        t
          ? or(ilike(subscribers.email, `%${t}%`), ilike(subscribers.nombre, `%${t}%`), ilike(subscribers.codigo, `%${t}%`))
          : undefined,
      ),
    )
    .orderBy(desc(subscribers.createdAt));
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
