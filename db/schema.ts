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
 * Fase 1: auth (Auth.js) + catálogo + auditoría. Pedidos, contactos, Summit,
 * newsletter y contenido se suman en las fases siguientes.
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

export type DbCategory = typeof categories.$inferSelect;
export type DbProduct = typeof products.$inferSelect;
export type DbProductImage = typeof productImages.$inferSelect;
export type DbUser = typeof users.$inferSelect;
