"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { getSession } from "@/lib/dal";
import { INTERESES } from "@/content/newsletter";
import { ipCliente, limitar } from "@/lib/rate-limit";
import { CAMPO_CAPTCHA, MENSAJE_CAPTCHA, verificarCaptcha } from "@/lib/captcha";
import { confirmarSuscripcion, suscribir } from "./core";

/** Acciones PÚBLICAS del newsletter (formulario del sitio, cuenta y baja). */

/**
 * Respuesta NEUTRA (S-13): pase lo que pase (nuevo, ya suscripto, baja), el
 * formulario dice lo mismo — "revisá tu mail para confirmar" — así no se puede
 * averiguar quién está en la lista ni sacar códigos con emails inventados.
 */
export type EstadoSuscripcion = { ok: true } | { ok: false; mensaje: string; campo?: "email" | "acepto" } | null;

const esquema = z.object({
  email: z.email("Revisá el email.").max(200),
  nombre: z.string().trim().max(80).optional(),
  intereses: z.array(z.enum(INTERESES.map((i) => i.v) as [string, ...string[]])).max(3),
  acepto: z.literal("si", { message: "Para sumarte, aceptá recibir los mails del club." }),
  web: z.string().max(0).optional(), // honeypot
});

export async function suscribirNewsletter(_prev: EstadoSuscripcion, fd: FormData): Promise<EstadoSuscripcion> {
  const p = esquema.safeParse({
    email: String(fd.get("email") ?? "").trim(),
    nombre: String(fd.get("nombre") ?? "") || undefined,
    intereses: fd.getAll("intereses").map(String),
    acepto: String(fd.get("acepto") ?? ""),
    web: String(fd.get("web") ?? ""),
  });
  if (!p.success) {
    const err = p.error.issues[0];
    if (err?.path[0] === "web") return { ok: true }; // bot: respuesta neutra
    if (err?.path[0] === "acepto") return { ok: false, mensaje: err.message, campo: "acepto" };
    return { ok: false, mensaje: err?.path[0] === "email" ? "Revisá el email." : "Revisá los datos.", campo: "email" };
  }
  if (!db) return { ok: false, mensaje: "No pudimos sumarte ahora. Probá en un rato." };
  const email = p.data.email.toLowerCase();
  // Rate limit (S-12): por IP (se avisa) y por email destino (silencioso).
  const ip = await ipCliente();
  if (!(await limitar(`nl:ip:${ip}`, 6, 3600))) {
    return { ok: false, mensaje: "Hiciste muchos intentos seguidos. Probá de nuevo en un rato." };
  }
  if (!(await verificarCaptcha(fd.get(CAMPO_CAPTCHA), ip))) return { ok: false, mensaje: MENSAJE_CAPTCHA, campo: "email" };
  if (!(await limitar(`nl:email:${email}`, 3, 3600))) return { ok: true };
  try {
    const s = await getSession().catch(() => null);
    await suscribir({
      email,
      nombre: p.data.nombre,
      intereses: p.data.intereses,
      origen: "footer",
      userId: s?.user?.id ?? null,
      confirmado: false,
    });
    return { ok: true };
  } catch (e) {
    console.error("[newsletter] suscribir", e instanceof Error ? e.message : e);
    return { ok: false, mensaje: "No pudimos sumarte ahora. Probá en un rato." };
  }
}

/** Confirmación del doble opt-in desde el link del mail. */
export async function confirmarDesdeMail(token: string): Promise<boolean> {
  if (!db) return false;
  try {
    return Boolean(await confirmarSuscripcion(token));
  } catch (e) {
    console.error("[newsletter] confirmar", e instanceof Error ? e.message : e);
    return false;
  }
}

/** Desde "Mi cuenta": suscribirse con el email de la sesión. */
export async function suscribirDesdeCuenta(): Promise<void> {
  const s = await getSession();
  if (!s?.user?.id || !s.user.email || !db) return;
  // Email ya verificado por el ingreso (Google o link): entra confirmado.
  await suscribir({ email: s.user.email, nombre: s.user.name, origen: "cuenta", userId: s.user.id, confirmado: true });
  revalidatePath("/cuenta");
}

/** Desde "Mi cuenta": darse de baja. */
export async function bajaDesdeCuenta(): Promise<void> {
  const s = await getSession();
  if (!s?.user?.email || !db) return;
  await db
    .update(subscribers)
    .set({ estado: "baja", bajaAt: new Date(), tokenConfirmacion: null })
    .where(eq(subscribers.email, s.user.email.toLowerCase()));
  revalidatePath("/cuenta");
}

/** Baja con el token del link del mail. */
export async function darDeBaja(token: string): Promise<boolean> {
  if (!db || !token || token.length > 100) return false;
  const r = await db
    .update(subscribers)
    .set({ estado: "baja", bajaAt: new Date(), tokenConfirmacion: null })
    .where(eq(subscribers.token, token))
    .returning({ id: subscribers.id });
  return r.length > 0;
}
