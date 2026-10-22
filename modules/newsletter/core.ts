import "server-only";
import { randomBytes } from "node:crypto";
import { and, eq, gt, isNotNull, isNull, sql, type SQL } from "drizzle-orm";
import { requireDb } from "@/db";
import { subscribers, users, type DbSubscriber } from "@/db/schema";
import { nuevoCodigo } from "@/lib/codigo";
import { BASE_URL, enviarEmail } from "@/lib/email/enviar";
import { correoBienvenidaClub } from "@/lib/email/plantillas";
import type { Segmento } from "@/content/newsletter";

/** Lógica central del newsletter (la usan el sitio, la cuenta y el panel). */

export const bajaUrl = (token: string) => `${BASE_URL}/newsletter/baja?t=${encodeURIComponent(token)}`;
export const bajaUrlUnClic = (token: string) => `${BASE_URL}/api/newsletter/baja?t=${encodeURIComponent(token)}`;

export async function enviarBienvenidaClub(s: Pick<DbSubscriber, "email" | "nombre" | "codigo" | "token">) {
  const c = correoBienvenidaClub({ base: BASE_URL, nombre: s.nombre, codigo: s.codigo, bajaUrl: bajaUrl(s.token) });
  return enviarEmail({ to: s.email, subject: c.asunto, html: c.html, text: c.texto, bajaUrl: bajaUrlUnClic(s.token) });
}

type Alta = {
  email: string;
  nombre?: string | null;
  origen: string;
  intereses?: string[];
  userId?: string | null;
};

/**
 * Alta o reactivación. Devuelve "nuevo" | "reactivado" | "existente".
 * En "nuevo" y "reactivado" manda el mail de bienvenida con el código.
 */
export async function suscribir(a: Alta): Promise<{ resultado: "nuevo" | "reactivado" | "existente"; sub: DbSubscriber }> {
  const db = requireDb();
  const email = a.email.trim().toLowerCase();
  let userId = a.userId ?? null;
  if (!userId) {
    const [u] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
    userId = u?.id ?? null;
  }
  const [ya] = await db.select().from(subscribers).where(eq(subscribers.email, email));

  if (ya) {
    const intereses = [...new Set([...(ya.intereses ?? []), ...(a.intereses ?? [])])];
    if (ya.estado === "baja") {
      const [sub] = await db
        .update(subscribers)
        .set({ estado: "activo", bajaAt: null, consentAt: new Date(), intereses, nombre: a.nombre || ya.nombre, userId: ya.userId ?? userId })
        .where(eq(subscribers.id, ya.id))
        .returning();
      await enviarBienvenidaClub(sub);
      return { resultado: "reactivado", sub };
    }
    const [sub] = await db
      .update(subscribers)
      .set({ intereses, nombre: ya.nombre || a.nombre || null, userId: ya.userId ?? userId })
      .where(eq(subscribers.id, ya.id))
      .returning();
    return { resultado: "existente", sub };
  }

  // Código y token únicos (reintento ante el improbable choque).
  for (let intento = 0; intento < 4; intento++) {
    const [sub] = await db
      .insert(subscribers)
      .values({
        email,
        nombre: a.nombre?.trim() || null,
        origen: a.origen,
        intereses: a.intereses ?? [],
        userId,
        token: randomBytes(24).toString("base64url"),
        codigo: nuevoCodigo("CLUB"),
      })
      .onConflictDoNothing()
      .returning();
    if (sub) {
      await enviarBienvenidaClub(sub);
      return { resultado: "nuevo", sub };
    }
    const [carrera] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    if (carrera) return { resultado: "existente", sub: carrera };
  }
  throw new Error("No se pudo generar el código");
}

/** Condición SQL de cada segmento (siempre sobre suscriptos activos). */
export function condicionSegmento(seg: Segmento | string): SQL | undefined {
  const activo = eq(subscribers.estado, "activo");
  const interes = (v: string) => sql`${subscribers.intereses} @> ${JSON.stringify([v])}::jsonb`;
  switch (seg) {
    case "codigo-sin-usar":
      return and(activo, isNull(subscribers.codigoUsadoAt));
    case "clientes":
      return and(activo, isNotNull(subscribers.codigoUsadoAt));
    case "interes-productos":
      return and(activo, interes("productos"));
    case "interes-summit":
      return and(activo, interes("summit"));
    case "interes-workshops":
      return and(activo, interes("workshops"));
    case "con-cuenta":
      return and(activo, isNotNull(subscribers.userId));
    case "nuevos-30":
      return and(activo, gt(subscribers.createdAt, new Date(Date.now() - 30 * 864e5)));
    default:
      return activo;
  }
}
