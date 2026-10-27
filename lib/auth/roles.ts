import type { Role } from "@/db/schema";

/**
 * Roles de staff definidos por env (PANEL_SUPERADMINS / PANEL_ADMINS /
 * PANEL_EDITORS, emails separados por coma). Sin dependencias de Auth.js para
 * poder usarlo en el DAL en cada request.
 */
const lista = (v?: string) =>
  (v ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

/** Rol de staff que corresponde a un email según las env vars (o null). */
export function rolDeStaff(email: string | null | undefined): Role | null {
  if (!email) return null;
  const e = email.toLowerCase();
  if (lista(process.env.PANEL_SUPERADMINS).includes(e)) return "superadmin";
  if (lista(process.env.PANEL_ADMINS).includes(e)) return "admin";
  if (lista(process.env.PANEL_EDITORS).includes(e)) return "editor";
  return null;
}

const RANGO: Record<Role, number> = { customer: 0, editor: 1, admin: 2, superadmin: 3 };

/**
 * Rol efectivo (S-09): el MENOR entre el guardado en la sesión y el que dicen
 * hoy las env vars. Sacar a alguien de PANEL_ADMINS le quita el acceso en el
 * próximo request, sin esperar a que vuelva a iniciar sesión.
 */
export function rolEfectivo(rolSesion: Role | undefined, email: string | null | undefined): Role {
  const env = rolDeStaff(email) ?? "customer";
  const ses = rolSesion ?? "customer";
  return RANGO[env] < RANGO[ses] ? env : ses;
}
