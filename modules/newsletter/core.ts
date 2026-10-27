import "server-only";
import { randomBytes } from "node:crypto";
import { and, eq, gt, isNotNull, isNull, or, sql, type SQL } from "drizzle-orm";
import { requireDb } from "@/db";
import { subscribers, users, type DbSubscriber } from "@/db/schema";
import { nuevoCodigo } from "@/lib/codigo";
import { BASE_URL, enviarEmail } from "@/lib/email/enviar";
import { correoBienvenidaClub, correoConfirmarClub } from "@/lib/email/plantillas";
import type { Segmento } from "@/content/newsletter";

/** Lógica central del newsletter (la usan el sitio, la cuenta y el panel). */

export const bajaUrl = (token: string) => `${BASE_URL}/newsletter/baja?t=${encodeURIComponent(token)}`;
export const bajaUrlUnClic = (token: string) => `${BASE_URL}/api/newsletter/baja?t=${encodeURIComponent(token)}`;

export async function enviarBienvenidaClub(s: Pick<DbSubscriber, "email" | "nombre" | "codigo" | "token">) {
  const c = correoBienvenidaClub({ base: BASE_URL, nombre: s.nombre, codigo: s.codigo, bajaUrl: bajaUrl(s.token) });
  return enviarEmail({ to: s.email, subject: c.asunto, html: c.html, text: c.texto, bajaUrl: bajaUrlUnClic(s.token) });
}

export const confirmarUrl = (token: string) => `${BASE_URL}/newsletter/confirmar?t=${encodeURIComponent(token)}`;

export async function enviarConfirmacionClub(email: string, tokenConfirmacion: string) {
  const c = correoConfirmarClub({ base: BASE_URL, confirmarUrl: confirmarUrl(tokenConfirmacion) });
  return enviarEmail({ to: email, subject: c.asunto, html: c.html, text: c.texto });
}

const nuevoToken = () => randomBytes(24).toString("base64url");

type Alta = {
  email: string;
  nombre?: string | null;
  origen: string;
  intereses?: string[];
  userId?: string | null;
  /**
   * true (default): el email ya está verificado o el consentimiento lo
   * constató el equipo (cuenta, panel) → entra directo y recibe el código.
   * false: formulario público → doble opt-in (S-13): solo se manda el mail de
   * confirmación; el código llega recién al confirmar.
   */
  confirmado?: boolean;
};

export type ResultadoAlta = "nuevo" | "reactivado" | "existente" | "pendiente";

/**
 * Alta o reactivación. Devuelve "nuevo" | "reactivado" | "existente" |
 * "pendiente" (doble opt-in: se mandó el mail para confirmar).
 * Nunca reactiva una baja sin confirmación desde el mail.
 */
export async function suscribir(a: Alta): Promise<{ resultado: ResultadoAlta; sub: DbSubscriber }> {
  const db = requireDb();
  const email = a.email.trim().toLowerCase();
  const confirmado = a.confirmado ?? true;
  let userId = a.userId ?? null;
  if (!userId) {
    const [u] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
    userId = u?.id ?? null;
  }
  const [ya] = await db.select().from(subscribers).where(eq(subscribers.email, email));

  if (ya) {
    const activoConfirmado = ya.estado === "activo" && ya.confirmadoAt != null;
    if (!confirmado) {
      // Público: no se toca nada de una suscripción confirmada (nadie puede
      // cambiarle el nombre ni reactivarla desde afuera).
      if (activoConfirmado) return { resultado: "existente", sub: ya };
      const [sub] = await db
        .update(subscribers)
        .set({ tokenConfirmacion: nuevoToken(), ...(ya.estado === "activo" ? { nombre: a.nombre?.trim() || ya.nombre, intereses: a.intereses ?? ya.intereses } : {}) })
        .where(eq(subscribers.id, ya.id))
        .returning();
      await enviarConfirmacionClub(sub.email, sub.tokenConfirmacion!);
      return { resultado: "pendiente", sub };
    }
    const intereses = [...new Set([...(ya.intereses ?? []), ...(a.intereses ?? [])])];
    if (!activoConfirmado) {
      const [sub] = await db
        .update(subscribers)
        .set({ estado: "activo", bajaAt: null, consentAt: new Date(), confirmadoAt: new Date(), intereses, nombre: a.nombre || ya.nombre, userId: ya.userId ?? userId })
        .where(eq(subscribers.id, ya.id))
        .returning();
      await enviarBienvenidaClub(sub);
      return { resultado: ya.estado === "baja" ? "reactivado" : "nuevo", sub };
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
        token: nuevoToken(),
        codigo: nuevoCodigo("CLUB"),
        confirmadoAt: confirmado ? new Date() : null,
        tokenConfirmacion: confirmado ? null : nuevoToken(),
      })
      .onConflictDoNothing()
      .returning();
    if (sub) {
      if (confirmado) {
        await enviarBienvenidaClub(sub);
        return { resultado: "nuevo", sub };
      }
      await enviarConfirmacionClub(sub.email, sub.tokenConfirmacion!);
      return { resultado: "pendiente", sub };
    }
    const [carrera] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    if (carrera) return { resultado: confirmado ? "existente" : "pendiente", sub: carrera };
  }
  throw new Error("No se pudo generar el código");
}

/**
 * Confirmación del doble opt-in (link del mail). Activa la suscripción (también
 * una baja que pidió volver), registra el consentimiento y manda el código.
 * Idempotente: confirmar dos veces no reenvía nada.
 */
export async function confirmarSuscripcion(token: string): Promise<DbSubscriber | null> {
  if (!token || token.length > 100) return null;
  const db = requireDb();
  const [sub] = await db
    .update(subscribers)
    .set({ estado: "activo", bajaAt: null, confirmadoAt: new Date(), consentAt: new Date() })
    .where(and(eq(subscribers.tokenConfirmacion, token), or(isNull(subscribers.confirmadoAt), eq(subscribers.estado, "baja"))))
    .returning();
  if (sub) {
    await enviarBienvenidaClub(sub);
    return sub;
  }
  const [ya] = await db.select().from(subscribers).where(eq(subscribers.tokenConfirmacion, token));
  return ya ?? null;
}

/** Condición SQL de cada segmento (siempre sobre suscriptos activos y CONFIRMADOS). */
export function condicionSegmento(seg: Segmento | string): SQL | undefined {
  const activo = and(eq(subscribers.estado, "activo"), isNotNull(subscribers.confirmadoAt))!;
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
