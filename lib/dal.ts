import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { STAFF_ROLES, type Role } from "@/db/schema";

/**
 * Data Access Layer de autorización — la defensa PRINCIPAL (skill auth-review).
 * Cada página y cada Server Action del panel llama a requireStaff(); el proxy
 * es solo un redirect optimista.
 */
export const getSession = cache(async () => auth());

export const requireUser = cache(async (volverA = "/cuenta") => {
  const s = await getSession();
  if (!s?.user?.id) redirect(`/ingresar?volver=${encodeURIComponent(volverA)}`);
  return s.user;
});

export async function requireStaff(roles: readonly Role[] = STAFF_ROLES) {
  const s = await getSession();
  if (!s?.user?.id) redirect("/panel/login");
  if (!roles.includes(s.user.role)) redirect("/panel/login?error=permiso");
  return s.user;
}

/** Igual que requireStaff pero para Server Actions/route handlers: tira error en vez de redirigir. */
export async function assertStaff(roles: readonly Role[] = STAFF_ROLES) {
  const s = await getSession();
  if (!s?.user?.id || !roles.includes(s.user.role)) {
    throw new Error("No autorizado");
  }
  return s.user;
}
