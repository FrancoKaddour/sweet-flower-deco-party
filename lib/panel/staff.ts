import "server-only";
import { asc, inArray } from "drizzle-orm";
import { db } from "@/db";
import { users, STAFF_ROLES } from "@/db/schema";
import type { RolStaff } from "@/lib/panel/types";

export type MiembroStaff = {
  email: string;
  nombre: string | null;
  imagen: string | null;
  rol: RolStaff;
  /** true si ya entró al panel al menos una vez. */
  ingreso: boolean;
};

function lista(v?: string) {
  return (v ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Equipo del panel: los emails habilitados por configuración (PANEL_*) cruzados
 * con los usuarios que ya ingresaron. Los permisos se definen por configuración
 * del deploy, no desde la UI (más seguro: nadie se puede auto-promover).
 */
export async function listarStaff(): Promise<MiembroStaff[]> {
  const config: { email: string; rol: RolStaff }[] = [
    ...lista(process.env.PANEL_SUPERADMINS).map((email) => ({ email, rol: "superadmin" as const })),
    ...lista(process.env.PANEL_ADMINS).map((email) => ({ email, rol: "admin" as const })),
    ...lista(process.env.PANEL_EDITORS).map((email) => ({ email, rol: "editor" as const })),
  ];
  const vistos = new Set<string>();
  const unicos = config.filter((c) => (vistos.has(c.email) ? false : (vistos.add(c.email), true)));

  let enDb: { email: string; name: string | null; image: string | null }[] = [];
  if (db && unicos.length) {
    try {
      enDb = await db
        .select({ email: users.email, name: users.name, image: users.image })
        .from(users)
        .where(inArray(users.role, [...STAFF_ROLES]))
        .orderBy(asc(users.email));
    } catch {
      enDb = [];
    }
  }
  const porEmail = new Map(enDb.map((u) => [u.email.toLowerCase(), u]));
  return unicos.map((c) => {
    const u = porEmail.get(c.email);
    return { email: c.email, rol: c.rol, nombre: u?.name ?? null, imagen: u?.image ?? null, ingreso: !!u };
  });
}
