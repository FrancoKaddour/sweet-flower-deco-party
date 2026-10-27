"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireDb } from "@/db";
import { auditLog, sessions, users } from "@/db/schema";
import { assertStaff } from "@/lib/dal";

/**
 * "Cerrar sesiones" (S-09): borra TODAS las sesiones abiertas de un email, en
 * todos sus dispositivos. Para cuando alguien deja el equipo o pierde el
 * celular. Solo superadmin/admin. (Para quitarle el rol de staff, además hay
 * que sacarlo de PANEL_* en Vercel; igual el DAL ya lo baja en el próximo request.)
 */
export async function cerrarSesionesDe(email: string): Promise<{ ok: boolean; mensaje: string }> {
  const yo = await assertStaff(["superadmin", "admin"]);
  const p = z.email().max(200).safeParse(String(email ?? "").trim().toLowerCase());
  if (!p.success) return { ok: false, mensaje: "Revisá el email." };
  const db = requireDb();
  const [u] = await db.select({ id: users.id }).from(users).where(eq(users.email, p.data));
  if (!u) return { ok: false, mensaje: "No hay ninguna cuenta con ese email." };
  const borradas = await db.delete(sessions).where(eq(sessions.userId, u.id)).returning({ t: sessions.sessionToken });
  await db.insert(auditLog).values({ userId: yo.id, accion: "sesiones.cerrar", entidad: "user", entidadId: u.id, datos: { cantidad: borradas.length } });
  return { ok: true, mensaje: borradas.length ? `Listo: se cerraron ${borradas.length} sesión(es).` : "No tenía sesiones abiertas." };
}
