"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt, inArray, isNull, notInArray, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { accounts, auditLog, customerProfiles, orders, sessions, subscribers, summitRegistrations, users } from "@/db/schema";
import { getSession } from "@/lib/dal";
import { limitar } from "@/lib/rate-limit";
import { datosParaPrecargar, type PrecargaCliente } from "./datos";
import { perfilDesdeForm, perfilSchema, type CampoPerfil } from "./opciones";

/** Acciones de "Mi cuenta". La identidad sale SIEMPRE de la sesión. */

async function yo() {
  const s = await getSession().catch(() => null);
  return s?.user?.id && s.user.email ? { id: s.user.id, email: s.user.email.toLowerCase() } : null;
}

export type EstadoPerfil =
  | { ok: true; mensaje: string; t: number }
  | { ok: false; mensaje: string; errores: Partial<Record<CampoPerfil, string>>; t: number }
  | null;

export async function guardarPerfil(_prev: EstadoPerfil, fd: FormData): Promise<EstadoPerfil> {
  const t = Date.now();
  const u = await yo();
  if (!u || !db) return { ok: false, mensaje: "Tu sesión venció. Volvé a ingresar.", errores: {}, t };
  const p = perfilSchema.safeParse(perfilDesdeForm(fd));
  if (!p.success) {
    const errores: Partial<Record<CampoPerfil, string>> = {};
    for (const i of p.error.issues) {
      const k = String(i.path[0] ?? "") as CampoPerfil;
      if (k && !errores[k]) errores[k] = i.message;
    }
    const n = Object.keys(errores).length;
    return { ok: false, mensaje: n === 1 ? "Revisá el campo marcado." : `Revisá los ${n} campos marcados.`, errores, t };
  }
  if (!(await limitar(`perfil:${u.id}`, 30, 3600))) {
    return { ok: false, mensaje: "Guardaste muchas veces seguidas. Probá en un rato.", errores: {}, t };
  }
  try {
    const [previo] = await db.select({ privacidadAt: customerProfiles.privacidadAt }).from(customerProfiles).where(eq(customerProfiles.userId, u.id));
    const acepta = fd.get("privacidad") === "si";
    if (!previo?.privacidadAt && !acepta) {
      return { ok: false, mensaje: "Para guardar tus datos, aceptá el aviso de privacidad.", errores: { privacidad: "Marcá la casilla para guardar tus datos." }, t };
    }
    const v = p.data;
    const datos = { ...v, privacidadAt: previo?.privacidadAt ?? new Date() };
    await db.insert(customerProfiles).values({ userId: u.id, ...datos }).onConflictDoUpdate({ target: customerProfiles.userId, set: datos });
    // Copia corta en `users` (la ve el panel y el mail de bienvenida).
    await db
      .update(users)
      .set({ name: [v.nombre, v.apellido].filter(Boolean).join(" "), phone: v.telefono, city: v.localidad })
      .where(eq(users.id, u.id));
    revalidatePath("/cuenta");
    return { ok: true, mensaje: "Listo, guardamos tus datos.", t };
  } catch (e) {
    console.error("[cuenta] guardar perfil", e instanceof Error ? e.message : e);
    return { ok: false, mensaje: "No pudimos guardar ahora. Probá de nuevo en un momento.", errores: {}, t };
  }
}

/** Precarga del carrito y del formulario del Summit (null si no hay sesión). */
export async function misDatosParaPrecargar(): Promise<PrecargaCliente | null> {
  return datosParaPrecargar();
}

const codigosSchema = z.array(z.string().regex(/^SF-[2-9A-Z]{5}$/)).min(1).max(10);

/**
 * Pedidos hechos SIN sesión desde este dispositivo (el carrito guarda sus
 * códigos en localStorage): se vinculan a la cuenta al entrar a /cuenta. Solo
 * pedidos sin dueño de los últimos 30 días; rate limit por cuenta (los códigos
 * son aleatorios de 5 caracteres: adivinarlos es inviable con este límite).
 */
export async function vincularPedidosDelDispositivo(codigos: unknown): Promise<number> {
  const u = await yo();
  const p = codigosSchema.safeParse(codigos);
  if (!u || !db || !p.success) return 0;
  if (!(await limitar(`vincular:${u.id}`, 5, 3600))) return 0;
  try {
    const r = await db
      .update(orders)
      .set({ userId: u.id })
      .where(
        and(
          inArray(orders.codigo, p.data),
          isNull(orders.userId),
          isNull(orders.deletedAt),
          gt(orders.createdAt, sql`now() - interval '30 days'`),
        ),
      )
      .returning({ id: orders.id });
    if (r.length) revalidatePath("/cuenta");
    return r.length;
  } catch (e) {
    console.error("[cuenta] vincular pedidos", e instanceof Error ? e.message : e);
    return 0;
  }
}

export type EstadoBaja = { ok: false; mensaje: string } | null;

/**
 * Baja de la cuenta (Ley 25.326, supresión). Borrado lógico + anonimización:
 * - la cuenta queda con email/nombre anónimos y `deletedAt`; se borran sus
 *   accesos (Google/email) y sesiones, y el perfil;
 * - los pedidos quedan para las estadísticas pero sin nombre, teléfono,
 *   localidad ni notas, y sin dueño;
 * - las inscripciones al Summit PAGAS se conservan (comprobante del cobro,
 *   obligación contable) sin el vínculo a la cuenta; las no pagas se anonimizan;
 * - el Club pasa a baja y se anonimiza.
 * Confirmación en dos pasos: el formulario solo aparece al tocar "Quiero
 * borrar mi cuenta" y hay que escribir BORRAR.
 */
export async function borrarMiCuenta(_prev: EstadoBaja, fd: FormData): Promise<EstadoBaja> {
  const u = await yo();
  if (!u || !db) return { ok: false, mensaje: "Tu sesión venció. Volvé a ingresar." };
  if (String(fd.get("confirmacion") ?? "").trim().toUpperCase() !== "BORRAR") {
    return { ok: false, mensaje: "Para confirmar, escribí BORRAR en mayúsculas." };
  }
  const anon = `baja-${u.id}@anonimo.invalid`;
  const pagas = ["pago", "asistio"] as const;
  const deLaPersona = or(eq(summitRegistrations.userId, u.id), eq(summitRegistrations.email, u.email));
  try {
    await db.batch([
      db
        .update(summitRegistrations)
        .set({ nombre: "Baja de cuenta", email: null, telefono: null, dni: null, ciudad: null, mensaje: null, userId: null })
        .where(
          and(
            deLaPersona,
            notInArray(summitRegistrations.estado, [...pagas]),
            or(isNull(summitRegistrations.pagoEstado), sql`${summitRegistrations.pagoEstado} <> 'aprobado'`),
          ),
        ),
      db.update(summitRegistrations).set({ userId: null }).where(eq(summitRegistrations.userId, u.id)),
      db.update(orders).set({ nombre: null, telefono: null, localidad: null, nota: null, userId: null }).where(eq(orders.userId, u.id)),
      db
        .update(subscribers)
        .set({ estado: "baja", bajaAt: new Date(), tokenConfirmacion: null, nombre: null, userId: null, email: sql`'baja-' || ${subscribers.id} || '@anonimo.invalid'` })
        .where(or(eq(subscribers.email, u.email), eq(subscribers.userId, u.id))),
      db.delete(customerProfiles).where(eq(customerProfiles.userId, u.id)),
      db.delete(accounts).where(eq(accounts.userId, u.id)),
      db.delete(sessions).where(eq(sessions.userId, u.id)),
      db
        .update(users)
        .set({ email: anon, name: null, image: null, phone: null, city: null, emailVerified: null, role: "customer", deletedAt: new Date() })
        .where(eq(users.id, u.id)),
      db.insert(auditLog).values({ userId: u.id, accion: "cuenta.baja", entidad: "user", entidadId: u.id, datos: { pedido: "titular" } }),
    ]);
  } catch (e) {
    console.error("[cuenta] baja", e instanceof Error ? e.message : e);
    return { ok: false, mensaje: "No pudimos borrar la cuenta ahora. Probá de nuevo o escribinos por WhatsApp." };
  }
  const c = await cookies();
  for (const n of ["authjs.session-token", "__Secure-authjs.session-token"]) c.delete(n);
  redirect("/ingresar?baja=1");
}
