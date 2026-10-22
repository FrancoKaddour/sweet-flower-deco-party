"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { getSession } from "@/lib/dal";
import { INTERESES } from "@/content/newsletter";
import { suscribir } from "./core";

/** Acciones PÚBLICAS del newsletter (formulario del sitio, cuenta y baja). */

export type EstadoSuscripcion =
  | { ok: true; tipo: "nuevo"; codigo: string; nombre: string | null }
  | { ok: true; tipo: "existente" | "reactivado" }
  | { ok: false; mensaje: string; campo?: "email" }
  | null;

const esquema = z.object({
  email: z.email("Revisá el email.").max(200),
  nombre: z.string().trim().max(80).optional(),
  intereses: z.array(z.enum(INTERESES.map((i) => i.v) as [string, ...string[]])).max(3),
  web: z.string().max(0).optional(), // honeypot
});

export async function suscribirNewsletter(_prev: EstadoSuscripcion, fd: FormData): Promise<EstadoSuscripcion> {
  const p = esquema.safeParse({
    email: String(fd.get("email") ?? "").trim(),
    nombre: String(fd.get("nombre") ?? "") || undefined,
    intereses: fd.getAll("intereses").map(String),
    web: String(fd.get("web") ?? ""),
  });
  if (!p.success) {
    const err = p.error.issues[0];
    if (err?.path[0] === "web") return { ok: true, tipo: "existente" }; // bot: respuesta neutra
    return { ok: false, mensaje: err?.path[0] === "email" ? "Revisá el email." : "Revisá los datos.", campo: "email" };
  }
  if (!db) return { ok: false, mensaje: "No pudimos sumarte ahora. Probá en un rato." };
  try {
    const s = await getSession().catch(() => null);
    const { resultado, sub } = await suscribir({
      email: p.data.email,
      nombre: p.data.nombre,
      intereses: p.data.intereses,
      origen: "footer",
      userId: s?.user?.id ?? null,
    });
    if (resultado === "nuevo") return { ok: true, tipo: "nuevo", codigo: sub.codigo, nombre: sub.nombre };
    return { ok: true, tipo: resultado };
  } catch (e) {
    console.error("[newsletter] suscribir", e);
    return { ok: false, mensaje: "No pudimos sumarte ahora. Probá en un rato." };
  }
}

/** Desde "Mi cuenta": suscribirse con el email de la sesión. */
export async function suscribirDesdeCuenta(): Promise<void> {
  const s = await getSession();
  if (!s?.user?.id || !s.user.email || !db) return;
  await suscribir({ email: s.user.email, nombre: s.user.name, origen: "cuenta", userId: s.user.id });
  revalidatePath("/cuenta");
}

/** Desde "Mi cuenta": darse de baja. */
export async function bajaDesdeCuenta(): Promise<void> {
  const s = await getSession();
  if (!s?.user?.email || !db) return;
  await db
    .update(subscribers)
    .set({ estado: "baja", bajaAt: new Date() })
    .where(eq(subscribers.email, s.user.email.toLowerCase()));
  revalidatePath("/cuenta");
}

/** Baja con el token del link del mail. */
export async function darDeBaja(token: string): Promise<boolean> {
  if (!db || !token || token.length > 100) return false;
  const r = await db
    .update(subscribers)
    .set({ estado: "baja", bajaAt: new Date() })
    .where(eq(subscribers.token, token))
    .returning({ id: subscribers.id });
  return r.length > 0;
}
