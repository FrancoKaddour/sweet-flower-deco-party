import "server-only";
import { and, desc, eq, isNull, or } from "drizzle-orm";
import { db } from "@/db";
import { customerProfiles, orders, subscribers, summitRegistrations, users, type DbCustomerProfile } from "@/db/schema";
import { getSession } from "@/lib/dal";

/**
 * Lecturas de "Mi cuenta" (perfil, pedidos, inscripciones, club). Todas
 * reciben el id/email de la SESIÓN (nunca del navegador) y son best-effort:
 * si la base falla o falta la migración 0005, devuelven vacío y la página se
 * muestra igual.
 */

export async function perfilDe(userId: string): Promise<DbCustomerProfile | null> {
  if (!db) return null;
  try {
    const [p] = await db.select().from(customerProfiles).where(eq(customerProfiles.userId, userId));
    return p ?? null;
  } catch (e) {
    console.error("[cuenta] perfil", e instanceof Error ? e.message : e);
    return null;
  }
}

export async function pedidosDe(userId: string) {
  if (!db) return [];
  try {
    return await db
      .select({
        id: orders.id,
        codigo: orders.codigo,
        items: orders.items,
        total: orders.total,
        hayConsultar: orders.hayConsultar,
        estado: orders.estado,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(and(eq(orders.userId, userId), isNull(orders.deletedAt)))
      .orderBy(desc(orders.createdAt))
      .limit(50);
  } catch (e) {
    console.error("[cuenta] pedidos", e instanceof Error ? e.message : e);
    return [];
  }
}

/** Inscripciones vinculadas a la cuenta o hechas con el mismo email (el de la sesión ya está verificado). */
export async function inscripcionesDe(userId: string, email: string | null | undefined) {
  if (!db) return [];
  try {
    const porEmail = email ? eq(summitRegistrations.email, email.toLowerCase()) : undefined;
    return await db
      .select({
        id: summitRegistrations.id,
        codigo: summitRegistrations.codigo,
        edicion: summitRegistrations.edicion,
        pase: summitRegistrations.pase,
        estado: summitRegistrations.estado,
        pagoEstado: summitRegistrations.pagoEstado,
        precio: summitRegistrations.precioReferencia,
        reservaHasta: summitRegistrations.reservaHasta,
        createdAt: summitRegistrations.createdAt,
      })
      .from(summitRegistrations)
      .where(and(isNull(summitRegistrations.deletedAt), porEmail ? or(eq(summitRegistrations.userId, userId), porEmail) : eq(summitRegistrations.userId, userId)))
      .orderBy(desc(summitRegistrations.createdAt))
      .limit(20);
  } catch (e) {
    console.error("[cuenta] inscripciones", e instanceof Error ? e.message : e);
    return [];
  }
}

export async function clubDe(email: string | null | undefined) {
  if (!db || !email) return null;
  try {
    const [s] = await db
      .select({ estado: subscribers.estado, codigo: subscribers.codigo, usado: subscribers.codigoUsadoAt, confirmadoAt: subscribers.confirmadoAt })
      .from(subscribers)
      .where(eq(subscribers.email, email.toLowerCase()));
    return s ?? null;
  } catch {
    return null;
  }
}

/** Club ACTIVO y confirmado con código sin usar (lo que sirve para precargar el carrito). */
async function codigoClubVigente(email: string | null | undefined): Promise<string | null> {
  const c = await clubDe(email);
  return c && c.estado === "activo" && c.confirmadoAt && !c.usado ? c.codigo : null;
}

export type PrecargaCliente = {
  nombre: string;
  apellido: string;
  /** "Nombre Apellido" (o el nombre de Google si no completó el perfil). */
  nombreCompleto: string;
  email: string;
  telefono: string;
  dni: string;
  /** Localidad del perfil (o la ciudad vieja de `users`). */
  ciudad: string;
  /** "Localidad, Provincia" para el envío del carrito. */
  localidadEnvio: string;
  codigoClub: string;
};

/**
 * Datos para precargar el carrito y el formulario del Summit. Solo con sesión
 * (si no, null). Lo llaman las Server Actions de modules/cuenta/actions.ts.
 */
export async function datosParaPrecargar(): Promise<PrecargaCliente | null> {
  const s = await getSession().catch(() => null);
  const u = s?.user;
  if (!u?.id || !u.email || !db) return null;
  try {
    const [perfil, fila, codigoClub] = await Promise.all([
      perfilDe(u.id),
      db.select({ phone: users.phone, city: users.city, deletedAt: users.deletedAt }).from(users).where(eq(users.id, u.id)).then((r) => r[0]),
      codigoClubVigente(u.email),
    ]);
    if (fila?.deletedAt) return null;
    const nombre = perfil?.nombre ?? (u.name ?? "").split(" ")[0] ?? "";
    const apellido = perfil?.apellido ?? (perfil ? "" : (u.name ?? "").split(" ").slice(1).join(" "));
    const ciudad = perfil?.localidad ?? fila?.city ?? "";
    return {
      nombre,
      apellido,
      nombreCompleto: [nombre, apellido].filter(Boolean).join(" ") || u.name || "",
      email: u.email,
      telefono: perfil?.telefono ?? fila?.phone ?? "",
      dni: perfil?.dni ?? "",
      ciudad,
      localidadEnvio: [ciudad, perfil?.provincia && perfil.provincia !== ciudad ? perfil.provincia : null].filter(Boolean).join(", "),
      codigoClub: codigoClub ?? "",
    };
  } catch (e) {
    console.error("[cuenta] precarga", e instanceof Error ? e.message : e);
    return null;
  }
}

/** Todo lo que guardamos de la persona (derecho de acceso, Ley 25.326 art. 14). */
export async function exportarDatos(userId: string, email: string) {
  if (!db) return null;
  const [cuenta] = await db
    .select({ id: users.id, nombre: users.name, email: users.email, telefono: users.phone, ciudad: users.city, creada: users.createdAt })
    .from(users)
    .where(eq(users.id, userId));
  const [perfil, pedidos, inscripciones, club] = await Promise.all([
    perfilDe(userId),
    db
      .select({
        codigo: orders.codigo,
        fecha: orders.createdAt,
        estado: orders.estado,
        nombre: orders.nombre,
        localidad: orders.localidad,
        telefono: orders.telefono,
        nota: orders.nota,
        items: orders.items,
        total: orders.total,
        fechaEvento: orders.fechaEvento,
        pago: orders.pago,
        codigoClub: orders.codigoClub,
        origen: orders.origen,
      })
      .from(orders)
      .where(and(eq(orders.userId, userId), isNull(orders.deletedAt))),
    db
      .select({
        codigo: summitRegistrations.codigo,
        fecha: summitRegistrations.createdAt,
        edicion: summitRegistrations.edicion,
        pase: summitRegistrations.pase,
        nombre: summitRegistrations.nombre,
        email: summitRegistrations.email,
        telefono: summitRegistrations.telefono,
        dni: summitRegistrations.dni,
        ciudad: summitRegistrations.ciudad,
        estado: summitRegistrations.estado,
        pagoEstado: summitRegistrations.pagoEstado,
        precio: summitRegistrations.precioReferencia,
        consentimiento: summitRegistrations.consentAt,
      })
      .from(summitRegistrations)
      .where(and(isNull(summitRegistrations.deletedAt), or(eq(summitRegistrations.userId, userId), eq(summitRegistrations.email, email.toLowerCase())))),
    db
      .select({
        email: subscribers.email,
        nombre: subscribers.nombre,
        estado: subscribers.estado,
        intereses: subscribers.intereses,
        codigo: subscribers.codigo,
        consentimiento: subscribers.consentAt,
        confirmado: subscribers.confirmadoAt,
        baja: subscribers.bajaAt,
      })
      .from(subscribers)
      .where(eq(subscribers.email, email.toLowerCase())),
  ]);
  const perfilLimpio = perfil ? (({ userId: _u, ...r }) => (void _u, r))(perfil) : null;
  return {
    generado: new Date().toISOString(),
    responsable: "Sweet Flowers Deco Party",
    cuenta: cuenta ?? null,
    perfil: perfilLimpio,
    pedidos,
    inscripcionesSummit: inscripciones,
    club: club[0] ?? null,
  };
}
