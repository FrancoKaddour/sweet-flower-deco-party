/**
 * Esquema de la base (Postgres en Neon) — fuente única de la ESTRUCTURA.
 * Cambia solo por migraciones (`npm run db:generate` → `npm run db:migrate`).
 *
 * Convenciones (skill db-review):
 * - IDs texto (UUID) generados en la app; slugs únicos.
 * - Dinero en PESOS enteros (`integer`), nunca float.
 * - Fechas `timestamptz`; `createdAt`/`updatedAt` en todo; soft delete con `deletedAt`.
 * - FKs con onDelete explícito; CHECK para invariantes (precio ≥ 0).
 *
 * Fase 1: auth (Auth.js) + catálogo + auditoría.
 * Fase 2: pedidos del carrito, consultas del formulario e inscripciones al
 * Summit. Todo se sigue resolviendo por WhatsApp: estas tablas son el registro
 * para que el equipo haga el seguimiento desde el panel.
 */
import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());
const createdAt = () => timestamp("created_at", { withTimezone: true }).defaultNow().notNull();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date());

/* ───────────────────────────── Auth (Auth.js) ───────────────────────────── */

/** superadmin (Franco) · admin (Flor) · editor (Tobi) · customer (clientes del sitio). */
export const roleEnum = pgEnum("role", ["superadmin", "admin", "editor", "customer"]);
export type Role = (typeof roleEnum.enumValues)[number];
export const STAFF_ROLES: readonly Role[] = ["superadmin", "admin", "editor"];

export const users = pgTable(
  "users",
  {
    id: id(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("email_verified", { mode: "date", withTimezone: true }),
    image: text("image"),
    role: roleEnum("role").default("customer").notNull(),
    // Perfil del cliente (para que el pedido por WhatsApp salga completo).
    phone: text("phone"),
    city: text("city"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email), index("users_role_idx").on(t.role)],
);

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })],
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

/* ─────────────────────────────── Catálogo ─────────────────────────────── */

export const lineaEnum = pgEnum("linea", ["catering", "ambientacion"]);

export const categories = pgTable(
  "categories",
  {
    id: id(),
    slug: text("slug").notNull(),
    nombre: text("nombre").notNull(),
    linea: lineaEnum("linea").notNull(),
    tagline: text("tagline").notNull().default(""),
    descripcion: text("descripcion").notNull().default(""),
    /** Etiquetas cortas de "qué vas a encontrar". */
    incluye: jsonb("incluye").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    imagen: text("imagen"),
    orden: integer("orden").notNull().default(0),
    visible: boolean("visible").notNull().default(true),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("categories_slug_idx").on(t.slug)],
);

export const products = pgTable(
  "products",
  {
    id: id(),
    slug: text("slug").notNull(),
    nombre: text("nombre").notNull(),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    /** Precio de catálogo en pesos (transferencia). null = "a consultar". */
    precio: integer("precio"),
    descripcion: text("descripcion").notNull().default(""),
    medidas: text("medidas"),
    variantes: jsonb("variantes").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    destacado: boolean("destacado").notNull().default(false),
    visible: boolean("visible").notNull().default(true),
    orden: integer("orden").notNull().default(0),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("products_slug_idx").on(t.slug),
    index("products_category_idx").on(t.categoryId, t.orden),
    index("products_visible_idx").on(t.visible).where(sql`${t.deletedAt} is null`),
    check("products_precio_check", sql`${t.precio} is null or ${t.precio} >= 0`),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: id(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    /** URL pública (Vercel Blob o /productos/… para las importadas). */
    url: text("url").notNull(),
    alt: text("alt").notNull().default(""),
    orden: integer("orden").notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [index("product_images_product_idx").on(t.productId, t.orden)],
);

/* ─────────────────────────────── Auditoría ─────────────────────────────── */

/** Quién cambió qué y cuándo (nivel plataforma seria). */
export const auditLog = pgTable(
  "audit_log",
  {
    id: id(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    accion: text("accion").notNull(), // "product.create", "product.update", …
    entidad: text("entidad").notNull(),
    entidadId: text("entidad_id"),
    datos: jsonb("datos").$type<Record<string, unknown>>(),
    createdAt: createdAt(),
  },
  (t) => [index("audit_log_entidad_idx").on(t.entidad, t.entidadId), index("audit_log_created_idx").on(t.createdAt)],
);

/* ───────────────────── Pedidos, consultas y Summit ───────────────────── */

/** Línea de pedido: snapshot del producto al momento de pedir. */
export type ItemPedido = { slug: string; nombre: string; precio: number | null; qty: number };

export const orderStatusEnum = pgEnum("order_status", [
  "nuevo",
  "confirmado",
  "en_produccion",
  "enviado",
  "entregado",
  "cancelado",
]);
export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];

/** Pedido armado en el carrito y enviado por WhatsApp. `codigo` viaja en el mensaje. */
export const orders = pgTable(
  "orders",
  {
    id: id(),
    codigo: text("codigo").notNull(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    nombre: text("nombre"),
    localidad: text("localidad"),
    nota: text("nota"),
    items: jsonb("items").$type<ItemPedido[]>().notNull(),
    total: integer("total").notNull(),
    hayConsultar: boolean("hay_consultar").default(false).notNull(),
    estado: orderStatusEnum("estado").default("nuevo").notNull(),
    telefono: text("telefono"),
    notaInterna: text("nota_interna"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("orders_codigo_idx").on(t.codigo),
    index("orders_estado_idx").on(t.estado),
    index("orders_created_idx").on(t.createdAt),
    check("orders_total_check", sql`${t.total} >= 0`),
  ],
);

export const inquiryStatusEnum = pgEnum("inquiry_status", ["nueva", "respondida", "archivada"]);
export type InquiryStatus = (typeof inquiryStatusEnum.enumValues)[number];

/** Consulta del formulario de contacto. */
export const inquiries = pgTable(
  "inquiries",
  {
    id: id(),
    tipo: text("tipo").notNull(),
    nombre: text("nombre").notNull(),
    email: text("email"),
    telefono: text("telefono"),
    mensaje: text("mensaje").notNull(),
    estado: inquiryStatusEnum("estado").default("nueva").notNull(),
    notaInterna: text("nota_interna"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [index("inquiries_estado_idx").on(t.estado), index("inquiries_created_idx").on(t.createdAt)],
);

export const registrationStatusEnum = pgEnum("registration_status", [
  "consulto",
  "seno",
  "pago",
  "asistio",
  "cancelado",
]);
export type RegistrationStatus = (typeof registrationStatusEnum.enumValues)[number];

/** Reserva de lugar al Event Summit (se cierra por WhatsApp). */
export const summitRegistrations = pgTable(
  "summit_registrations",
  {
    id: id(),
    codigo: text("codigo").notNull(),
    edicion: text("edicion").notNull(),
    pase: text("pase").notNull(), // "vip" | "general"
    nombre: text("nombre").notNull(),
    ciudad: text("ciudad"),
    formaPago: text("forma_pago"),
    mensaje: text("mensaje"),
    /** Precio de la preventa vigente al reservar (referencia, en pesos). */
    precioReferencia: integer("precio_referencia"),
    estado: registrationStatusEnum("estado").default("consulto").notNull(),
    telefono: text("telefono"),
    notaInterna: text("nota_interna"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("summit_registrations_codigo_idx").on(t.codigo),
    index("summit_registrations_estado_idx").on(t.estado),
    index("summit_registrations_edicion_idx").on(t.edicion),
  ],
);

export type DbCategory = typeof categories.$inferSelect;
export type DbProduct = typeof products.$inferSelect;
export type DbProductImage = typeof productImages.$inferSelect;
export type DbUser = typeof users.$inferSelect;
export type DbOrder = typeof orders.$inferSelect;
export type DbInquiry = typeof inquiries.$inferSelect;
export type DbSummitRegistration = typeof summitRegistrations.$inferSelect;
