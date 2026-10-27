/**
 * Actualizaciones de datos de UNA SOLA VEZ, que se aplican en el deploy después
 * del seed (scripts/deploy-db.mjs). Cada una queda marcada en audit_log y no se
 * vuelve a correr, así nunca pisa lo que el equipo edite después en el panel.
 *
 * Para sumar una nueva: agregá un bloque a ACTUALIZACIONES con un id nuevo.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import * as schema from "../db/schema";
import { LIMPIEZA_CATALOGO } from "./catalogo-limpieza-2026-10-27";

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

/**
 * Limpieza editorial + variantes con precio (E-01/E-03/E-04, 27/10/2026).
 * Cada campo se pisa SOLO si en la base sigue igual al valor original del seed
 * (`antes`): lo que Flor ya editó en el panel queda intacto.
 * - precio + variantes van juntos: solo si el precio sigue siendo el original y
 *   el producto no tiene variantes cargadas.
 * - categoría: solo se mueve si hoy está en MDF/madera (piezas de hierro mal
 *   clasificadas) y nadie la cambió.
 */
async function limpiarCatalogo(db: Db) {
  const cats = await db.select({ id: categories.id, slug: categories.slug }).from(categories);
  const idDe = new Map(cats.map((c) => [c.slug, c.id]));
  const slugDe = new Map(cats.map((c) => [c.id, c.slug]));
  let tocados = 0;
  for (const fila of LIMPIEZA_CATALOGO) {
    const [p] = await db
      .select({
        id: products.id,
        nombre: products.nombre,
        precio: products.precio,
        descripcion: products.descripcion,
        medidas: products.medidas,
        variantes: products.variantes,
        categoryId: products.categoryId,
      })
      .from(products)
      .where(eq(products.slug, fila.slug));
    if (!p) continue;
    const { antes, despues } = fila;
    const set: Partial<typeof products.$inferInsert> = {};
    if (p.nombre === antes.nombre && despues.nombre !== p.nombre) set.nombre = despues.nombre;
    if (p.descripcion === antes.descripcion && despues.descripcion !== p.descripcion) set.descripcion = despues.descripcion;
    if ((p.medidas ?? null) === antes.medidas && despues.medidas && despues.medidas !== p.medidas) set.medidas = despues.medidas;
    const sinVariantes = !Array.isArray(p.variantes) || p.variantes.length === 0;
    if (p.precio === antes.precio && sinVariantes) {
      if (despues.variantes.length) set.variantes = despues.variantes as never;
      if (despues.precio !== p.precio) set.precio = despues.precio;
    }
    const catActual = slugDe.get(p.categoryId);
    const catNueva = idDe.get(despues.categoria);
    if (catNueva && catActual !== despues.categoria && (catActual === "mdf" || catActual === "madera")) {
      set.categoryId = catNueva;
    }
    if (Object.keys(set).length === 0) continue;
    await db.update(products).set(set).where(eq(products.id, p.id));
    tocados++;
  }
  console.log(`  ✓ catálogo limpio: ${tocados} producto(s) actualizados`);
}

/** Oculta (NO borra) categorías y sus productos. Para volver a mostrarlas: content/catalogo.ts. */
async function ocultarCategorias(db: Db, slugs: string[]) {
  const cats = await db
    .update(categories)
    .set({ visible: false })
    .where(inArray(categories.slug, slugs))
    .returning({ id: categories.id });
  if (!cats.length) return;
  const r = await db
    .update(products)
    .set({ visible: false })
    .where(and(inArray(products.categoryId, cats.map((c) => c.id)), eq(products.visible, true)))
    .returning({ id: products.id });
  console.log(`  ✓ ocultas: ${slugs.join(", ")} (${r.length} productos)`);
}

/** Marca como destacados (para "Lo más pedido" de la home). No desmarca nada. */
async function destacar(db: Db, slugs: string[]) {
  const r = await db
    .update(products)
    .set({ destacado: true })
    .where(and(inArray(products.slug, slugs), eq(products.destacado, false)))
    .returning({ id: products.id });
  console.log(`  ✓ ${r.length} destacado(s) nuevo(s)`);
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
  {
    // E-01/E-03/E-04 (frente C1): variantes con precio, precios cargados en los
    // "a consultar" que tenían precio escrito, descripciones sin precios/recargos
    // y con ortografía corregida, nombres prolijos. Datos: catalogo-limpieza-2026-10-27.ts.
    id: "2026-10-27-catalogo-limpio",
    correr: limpiarCatalogo,
  },
  {
    // E-09: Flor pidió no publicar MDF ni madera (CONTENIDO_FLOR §3). Se ocultan,
    // no se borran. Corre DESPUÉS de la limpieza, que pasó a "hierro" las piezas
    // de hierro que estaban mal clasificadas como madera/MDF.
    id: "2026-10-27-ocultar-mdf-madera",
    correr: (db) => ocultarCategorias(db, ["mdf", "madera"]),
  },
  {
    // "Lo más pedido" (home) con lo que Flor dice que más se vende (CONTENIDO_FLOR §3):
    // Eclipse, Arcoíris, Telonera, arcos extensibles, arcada de hierro común.
    id: "2026-10-27-destacados-mas-vendidos",
    correr: (db) =>
      destacar(db, [
        "estanteria-eclipse",
        "eclipse-xl",
        "arcoiris-4-estantes",
        "estructura-telonera",
        "arco-extensible-esencial",
        "arco-extensible-3x4-con-soporte",
        "arco-extensible-doble-barral",
        "arcada-de-hierro-95x2",
      ]),
  },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Falta DATABASE_URL");
  const db = drizzle(neon(url), { schema });
  for (const a of ACTUALIZACIONES) {
    const accion = `data.${a.id}`;
    // Se reclama el marcador ANTES de correr (índice único en audit_log): si dos
    // deploys corren a la vez, solo uno la aplica. Si falla, se libera.
    const r = await db
      .insert(auditLog)
      .values({ accion, entidad: "datos", entidadId: a.id })
      .onConflictDoNothing()
      .returning({ id: auditLog.id });
    if (!r.length) continue;
    console.log(`[actualizaciones] ${a.id}`);
    try {
      await a.correr(db);
    } catch (e) {
      await db.delete(auditLog).where(eq(auditLog.id, r[0].id));
      throw e;
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
