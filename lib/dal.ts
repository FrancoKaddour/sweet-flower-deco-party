import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { sessions, STAFF_ROLES, type Role } from "@/db/schema";
import { rolEfectivo } from "@/lib/auth/roles";
import { rutaSegura } from "@/lib/reglas";

/**
 * Data Access Layer de autorización — la defensa PRINCIPAL (skill auth-review).
 * Cada página y cada Server Action del panel llama a requireStaff(); el proxy
 * es solo un redirect optimista.
 *
 * S-09: el rol se revalida contra las env vars en CADA request (gana el menor)
 * y la sesión del staff dura 7 días deslizantes (la de clientes, 30).
 */
export const getSession = cache(async () => auth());

export const STAFF_SESION_DIAS = 7;

export const requireUser = cache(async (volverA = "/cuenta") => {
  const s = await getSession();
  if (!s?.user?.id) redirect(`/ingresar?volver=${encodeURIComponent(rutaSegura(volverA, "/cuenta"))}`);
  return s.user;
});

/** Recorta la sesión del staff a 7 días desde ahora (Auth.js la extiende a 30 al usarla). */
const recortarSesionStaff = cache(async () => {
  if (!db) return;
  try {
    const c = await cookies();
    const token = c.get("__Secure-authjs.session-token")?.value ?? c.get("authjs.session-token")?.value;
    if (!token) return;
    const tope = sql`now() + make_interval(days => ${STAFF_SESION_DIAS})`;
    await db
      .update(sessions)
      .set({ expires: tope })
      .where(and(eq(sessions.sessionToken, token), gt(sessions.expires, tope)));
  } catch (e) {
    console.error("[dal] sesión staff", e instanceof Error ? e.message : e);
  }
});

/** Usuario de la sesión con el rol EFECTIVO (sesión ∩ env vars). */
const usuarioConRol = cache(async () => {
  const s = await getSession();
  if (!s?.user?.id) return null;
  const role: Role = rolEfectivo(s.user.role, s.user.email);
  return { ...s.user, role };
});

export async function requireStaff(roles: readonly Role[] = STAFF_ROLES) {
  const u = await usuarioConRol();
  if (!u) redirect("/panel/login");
  if (!roles.includes(u.role)) redirect("/panel/login?error=permiso");
  await recortarSesionStaff();
  return u;
}

/** Igual que requireStaff pero para Server Actions/route handlers: tira error en vez de redirigir. */
export async function assertStaff(roles: readonly Role[] = STAFF_ROLES) {
  const u = await usuarioConRol();
  if (!u || !roles.includes(u.role)) {
    throw new Error("No autorizado");
  }
  await recortarSesionStaff();
  return u;
}
