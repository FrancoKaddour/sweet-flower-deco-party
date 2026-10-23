/**
 * Actualizaciones de datos de UNA SOLA VEZ, que se aplican en el deploy después
 * del seed (scripts/deploy-db.mjs). Cada una queda marcada en audit_log y no se
 * vuelve a correr, así nunca pisa lo que el equipo edite después en el panel.
 *
 * Para sumar una nueva: agregá un bloque a ACTUALIZACIONES con un id nuevo.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { and, eq, isNull, sql } from "drizzle-orm";
import * as schema from "../db/schema";

type Db = NeonHttpDatabase<typeof schema>;
const { auditLog, categories, productImages, products } = schema;

async function productoId(db: Db, slug: string) {
  const [p] = await db.select({ id: products.id, nombre: products.nombre }).from(products).where(eq(products.slug, slug));
  return p ?? null;
}

/** Pone estas fotos primero (la primera queda de portada). No duplica. */
async function portada(db: Db, slug: string, urls: string[]) {
  const p = await productoId(db, slug);
  if (!p) return console.log(`  · ${slug}: no existe, salteo`);
  const ya = new Set((await db.select({ url: productImages.url }).from(productImages).where(eq(productImages.productId, p.id))).map((r) => r.url));
  const nuevas = urls.filter((u) => !ya.has(u));
  if (!nuevas.length) return;
  await db
    .update(productImages)
    .set({ orden: sql`${productImages.orden} + ${nuevas.length}` })
    .where(eq(productImages.productId, p.id));
  await db.insert(productImages).values(nuevas.map((url, i) => ({ productId: p.id, url, alt: p.nombre, orden: i })));
  console.log(`  ✓ ${slug}: ${nuevas.length} foto(s) nueva(s) de portada`);
}

/** Agrega fotos al final de la galería. No duplica. */
async function extra(db: Db, slug: string, urls: string[]) {
  const p = await productoId(db, slug);
  if (!p) return console.log(`  · ${slug}: no existe, salteo`);
  const filas = await db.select({ url: productImages.url, orden: productImages.orden }).from(productImages).where(eq(productImages.productId, p.id));
  const ya = new Set(filas.map((r) => r.url));
  let orden = filas.reduce((m, r) => Math.max(m, r.orden), -1);
  const nuevas = urls.filter((u) => !ya.has(u));
  if (!nuevas.length) return;
  await db.insert(productImages).values(nuevas.map((url) => ({ productId: p.id, url, alt: p.nombre, orden: ++orden })));
  console.log(`  ✓ ${slug}: ${nuevas.length} foto(s) extra`);
}

async function moverACategoria(db: Db, slug: string, categoriaSlug: string) {
  const [c] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, categoriaSlug));
  if (!c) return;
  await db.update(products).set({ categoryId: c.id }).where(eq(products.slug, slug));
  console.log(`  ✓ ${slug} → ${categoriaSlug}`);
}

/** Oculta y archiva un producto que se reemplazó por otros. */
async function archivar(db: Db, slug: string) {
  const r = await db
    .update(products)
    .set({ deletedAt: new Date(), visible: false })
    .where(and(eq(products.slug, slug), isNull(products.deletedAt)))
    .returning({ id: products.id });
  if (r.length) console.log(`  ✓ ${slug} archivado`);
}

/** Carga precio y descripción solo si el producto todavía no tiene precio. */
async function precioSiFalta(db: Db, slug: string, precio: number, descripcion: string) {
  const r = await db
    .update(products)
    .set({ precio, descripcion })
    .where(and(eq(products.slug, slug), isNull(products.precio)))
    .returning({ id: products.id });
  if (r.length) console.log(`  ✓ ${slug}: precio ${precio}`);
}

const f = (n: string) => `/productos/${n}.jpg`;

const ACTUALIZACIONES: { id: string; correr: (db: Db) => Promise<void> }[] = [
  {
    // Fotos nuevas de catering que mandó Flor (22/10/2026).
    id: "2026-10-23-catering",
    correr: async (db) => {
      await portada(db, "alzada-16-lazos-espiralada", [f("cat-16-lazos")]);
      await portada(db, "estanteria-star", [f("cat-estanteria-star")]);
      await portada(db, "estanteria-sweet", [f("cat-estanteria-sweet")]);
      await portada(db, "mesas-isla", [f("cat-mesas-isla")]);
      await portada(db, "alzada-corona", [f("cat-alzada-corona")]);
      await portada(db, "alzada-hierro-con-pie-para-un-plato", [f("cat-alzada-de-pie")]);
      await portada(db, "alzadas-escandinavas-x3", [f("cat-alzadas-escandinavas")]);
      await portada(db, "eclipse-xl", [f("cat-eclipse-1m"), f("cat-eclipse-1m-comida")]);
      await portada(db, "estanteria-eclipse", [f("cat-estanteria-eclipse")]);
      await portada(db, "jaula", [f("cat-jaula")]);
      await moverACategoria(db, "jaula", "catering");
      await extra(db, "torre-nativa-60cm", [f("cat-exhibidores-gastronomicos")]);
      await extra(db, "prisma-x4", [f("cat-exhibidores-gastronomicos")]);
    },
  },
  {
    // Precios de Flor (23/10): "Gota, Luna y Torre" pasan a ser 3 productos; Órbita x3 con precio.
    id: "2026-10-23-precios-catering",
    correr: async (db) => {
      await archivar(db, "gota-luna-y-torre");
      await precioSiFalta(
        db,
        "orbita-x3",
        125000,
        "Combo de 3 alzadas circulares de hierro. Medidas: 30x25, 25x20 y 20x15cm. Sin maderas $125.000 · Con maderas $160.000.",
      );
    },
  },
  {
    id: "2026-10-23-precios-catering-2",
    correr: async (db) => {
      await precioSiFalta(db, "estanteria-s-60cm", 57000, "Estantería en S de hierro de 60cm. Sin estantes $57.000 · Con estantes $77.000.");
      await precioSiFalta(db, "bandeja-circular", 19500, "Bandeja circular de hierro. Precio sin maderas. Colores a elección: Blanco, Negro, Dorado, Plateado o Rosa Gold.");
      await precioSiFalta(db, "estanteria-capsula-60cm", 57000, "Estantería cápsula de hierro de 60cm. Sin maderas $57.000 · Con maderas $77.000.");
    },
  },
  {
    // Cápsula XL con precio y la misma foto que la de 60cm (la del café queda de segunda).
    id: "2026-10-23-precios-catering-3",
    correr: async (db) => {
      await precioSiFalta(db, "estanteria-capsula-xl", 72000, "Estantería cápsula XL de hierro. Sin maderas $72.000 · Con estantes $120.000.");
      await portada(db, "estanteria-capsula-xl", [f("cat-estanteria-capsula-60")]);
      await extra(db, "estanteria-capsula-xl", [f("cat-estanteria-capsula-xl")]);
      // La "Bandeja hierro doble círculo" es la misma que la bandeja circular nueva.
      await archivar(db, "bandeja-hierro-doble-circulo");
    },
  },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Falta DATABASE_URL");
  const db = drizzle(neon(url), { schema });
  for (const a of ACTUALIZACIONES) {
    const accion = `data.${a.id}`;
    const [hecha] = await db
      .select({ id: auditLog.id })
      .from(auditLog)
      .where(and(eq(auditLog.accion, accion), eq(auditLog.entidad, "datos")));
    if (hecha) continue;
    console.log(`[actualizaciones] ${a.id}`);
    await a.correr(db);
    await db.insert(auditLog).values({ accion, entidad: "datos", entidadId: a.id });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
