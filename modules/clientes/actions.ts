"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";
import { requireDb } from "@/db";
import { auditLog, customerProfiles, sessions, users } from "@/db/schema";
import { assertStaff } from "@/lib/dal";
import { PERMISOS } from "@/modules/ventas/estados";
import { perfilDesdeForm, perfilSchema, type CampoPerfil } from "@/modules/cuenta/opciones";

/** Panel → Clientes: editar datos y bloquear cuentas. Solo admins; todo queda auditado. */

export type EstadoEdicion =
  | { ok: true; mensaje: string; t: number }
  | { ok: false; mensaje: string; errores: Partial<Record<CampoPerfil, string>>; t: number }
  | null;

async function auditar(userId: string, accion: string, entidadId: string, datos?: object) {
  await requireDb()
    .insert(auditLog)
    .values({ userId, accion, entidad: "cliente", entidadId, datos: (datos ?? null) as Record<string, unknown> | null });
}

async function esCliente(id: string) {
  const [u] = await requireDb()
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(and(eq(users.id, id), eq(users.role, "customer"), isNull(users.deletedAt)));
  return u ?? null;
}

export async function editarCliente(id: string, _prev: EstadoEdicion, fd: FormData): Promise<EstadoEdicion> {
  const t = Date.now();
  const yo = await assertStaff(PERMISOS.clientes.roles);
  const c = await esCliente(id);
  if (!c) return { ok: false, mensaje: "No encontramos ese cliente.", errores: {}, t };
  const p = perfilSchema.safeParse(perfilDesdeForm(fd));
  if (!p.success) {
    const errores: Partial<Record<CampoPerfil, string>> = {};
    for (const i of p.error.issues) {
      const k = String(i.path[0] ?? "") as CampoPerfil;
      if (k && !errores[k]) errores[k] = i.message;
    }
    return { ok: false, mensaje: "Revisá los campos marcados.", errores, t };
  }
  const v = p.data;
  const db = requireDb();
  // El staff corrige datos: NO marca la aceptación de privacidad en nombre del cliente.
  await db.insert(customerProfiles).values({ userId: id, ...v }).onConflictDoUpdate({ target: customerProfiles.userId, set: v });
  await db
    .update(users)
    .set({ name: [v.nombre, v.apellido].filter(Boolean).join(" "), phone: v.telefono, city: v.localidad })
    .where(eq(users.id, id));
  await auditar(yo.id, "cliente.editar", id, { campos: Object.keys(v) });
  revalidatePath("/panel/clientes", "layout");
  return { ok: true, mensaje: "Guardamos los datos del cliente.", t };
}

/** Bloquea (o desbloquea) la cuenta. Al bloquear se cierran sus sesiones abiertas. */
export async function bloquearCliente(id: string, bloquear: boolean): Promise<{ ok: boolean; mensaje: string }> {
  const yo = await assertStaff(PERMISOS.clientes.roles);
  const c = await esCliente(id);
  if (!c) return { ok: false, mensaje: "No encontramos ese cliente." };
  const db = requireDb();
  await db.update(users).set({ bloqueadoAt: bloquear ? new Date() : null }).where(eq(users.id, id));
  if (bloquear) await db.delete(sessions).where(eq(sessions.userId, id));
  await auditar(yo.id, bloquear ? "cliente.bloquear" : "cliente.desbloquear", id, { email: c.email });
  revalidatePath("/panel/clientes", "layout");
  return {
    ok: true,
    mensaje: bloquear ? "Cuenta bloqueada: ya no puede ingresar." : "Cuenta desbloqueada: ya puede volver a ingresar.",
  };
}
