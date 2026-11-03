import "server-only";
import { and, count, desc, eq, isNotNull, isNull, sql, type SQL } from "drizzle-orm";
import { requireDb } from "@/db";
import { customerProfiles, orders, subscribers, summitRegistrations, users } from "@/db/schema";
import { coincide } from "@/modules/ventas/admin";

/**
 * Panel → Clientes: cuentas de clientes (role = customer) con su perfil de
 * compra. Solo admins (PERMISOS.clientes). Las cuentas dadas de baja por la
 * persona (deletedAt, anonimizadas) no se listan.
 */
export type FiltroClientes = {
  q?: string;
  tipo?: string;
  provincia?: string;
  estado?: "con-perfil" | "sin-perfil" | "bloqueados";
  pagina?: number;
  porPagina?: number;
};

function condiciones(f: FiltroClientes): SQL | undefined {
  const c: (SQL | undefined)[] = [eq(users.role, "customer"), isNull(users.deletedAt)];
  c.push(
    coincide(
      f.q,
      users.email,
      users.name,
      customerProfiles.nombre,
      customerProfiles.apellido,
      customerProfiles.telefono,
      customerProfiles.instagram,
      customerProfiles.emprendimiento,
      customerProfiles.localidad,
    ),
  );
  if (f.tipo) c.push(sql`${customerProfiles.tipoCliente}::text = ${f.tipo}`);
  if (f.provincia) c.push(eq(customerProfiles.provincia, f.provincia));
  if (f.estado === "con-perfil") c.push(isNotNull(customerProfiles.userId));
  if (f.estado === "sin-perfil") c.push(isNull(customerProfiles.userId));
  if (f.estado === "bloqueados") c.push(isNotNull(users.bloqueadoAt));
  return and(...c);
}

export async function paginarClientes(f: FiltroClientes) {
  const db = requireDb();
  const w = condiciones(f);
  const porPagina = f.porPagina ?? 30;
  const [t] = await db
    .select({ n: count() })
    .from(users)
    .leftJoin(customerProfiles, eq(customerProfiles.userId, users.id))
    .where(w);
  const total = t?.n ?? 0;
  const paginas = Math.max(1, Math.ceil(total / porPagina));
  const pagina = Math.min(Math.max(1, f.pagina ?? 1), paginas);
  const filas = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
      bloqueadoAt: users.bloqueadoAt,
      nombre: customerProfiles.nombre,
      apellido: customerProfiles.apellido,
      telefono: customerProfiles.telefono,
      tipoCliente: customerProfiles.tipoCliente,
      emprendimiento: customerProfiles.emprendimiento,
      localidad: customerProfiles.localidad,
      provincia: customerProfiles.provincia,
      tienePerfil: sql<boolean>`${customerProfiles.userId} is not null`,
      pedidos: sql<number>`(select count(*)::int from ${orders} where ${orders.userId} = ${users.id} and ${orders.deletedAt} is null)`,
      inscripciones: sql<number>`(select count(*)::int from ${summitRegistrations} where ${summitRegistrations.userId} = ${users.id} and ${summitRegistrations.deletedAt} is null)`,
    })
    .from(users)
    .leftJoin(customerProfiles, eq(customerProfiles.userId, users.id))
    .where(w)
    .orderBy(desc(users.createdAt))
    .limit(porPagina)
    .offset((pagina - 1) * porPagina);
  return { filas, total, pagina, paginas };
}

/** Ficha completa: cuenta + perfil + historial. */
export async function obtenerCliente(id: string) {
  const db = requireDb();
  const [u] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, id), eq(users.role, "customer"), isNull(users.deletedAt)));
  if (!u) return null;
  const [perfil] = await db.select().from(customerProfiles).where(eq(customerProfiles.userId, id));
  const pedidos = await db
    .select({ id: orders.id, codigo: orders.codigo, total: orders.total, estado: orders.estado, createdAt: orders.createdAt })
    .from(orders)
    .where(and(eq(orders.userId, id), isNull(orders.deletedAt)))
    .orderBy(desc(orders.createdAt));
  const inscripciones = await db
    .select({
      id: summitRegistrations.id,
      edicion: summitRegistrations.edicion,
      pase: summitRegistrations.pase,
      estado: summitRegistrations.estado,
      createdAt: summitRegistrations.createdAt,
    })
    .from(summitRegistrations)
    .where(and(eq(summitRegistrations.userId, id), isNull(summitRegistrations.deletedAt)))
    .orderBy(desc(summitRegistrations.createdAt));
  const [club] = await db
    .select({ codigo: subscribers.codigo, estado: subscribers.estado, confirmadoAt: subscribers.confirmadoAt })
    .from(subscribers)
    .where(eq(subscribers.email, u.email.toLowerCase()));
  return { usuario: u, perfil: perfil ?? null, pedidos, inscripciones, club: club ?? null };
}

/** Provincias que tienen al menos un cliente (para el filtro). */
export async function provinciasConClientes(): Promise<string[]> {
  const rows = await requireDb()
    .selectDistinct({ p: customerProfiles.provincia })
    .from(customerProfiles)
    .where(isNotNull(customerProfiles.provincia));
  return rows.map((r) => r.p as string).sort((a, b) => a.localeCompare(b, "es"));
}
