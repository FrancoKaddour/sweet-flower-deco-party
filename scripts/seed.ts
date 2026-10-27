/**
 * Seed inicial: carga en la base las categorías y los 179 productos del
 * catálogo de WhatsApp (con sus fotos de /public/productos).
 *
 * Corre UNA sola vez en la vida de la base (S-26): queda marcado en audit_log
 * ("seed.catalogo", entidad "datos"). Si la base ya tiene productos, solo se
 * marca y no se carga nada: así un producto al que el panel le cambió el slug
 * (o que se borró) nunca "resucita" con el slug viejo.
 *
 *   npm run db:seed          (FORZAR_SEED=1 para cargar lo que falte igual)
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, count, eq } from "drizzle-orm";
import * as schema from "../db/schema";
import { CATEGORIAS, CATEGORIAS_OCULTAS } from "../content/catalogo";
import { CATALOGO_WHATSAPP } from "../content/catalogo-whatsapp";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Falta DATABASE_URL (corré `vercel env pull .env.local`).");
  const db = drizzle(neon(url), { schema });
  const { auditLog, categories, products, productImages } = schema;

  const MARCA = "seed.catalogo";
  const [hecho] = await db
    .select({ id: auditLog.id })
    .from(auditLog)
    .where(and(eq(auditLog.accion, MARCA), eq(auditLog.entidad, "datos")));
  const forzar = process.env.FORZAR_SEED === "1";
  if (hecho && !forzar) return console.log("✓ seed ya aplicado antes: no se toca el catálogo");
  const [{ n: hayProductos }] = await db.select({ n: count() }).from(products);
  if (hayProductos > 0 && !forzar) {
    await db.insert(auditLog).values({ accion: MARCA, entidad: "datos", entidadId: "catalogo" }).onConflictDoNothing();
    return console.log(`✓ la base ya tiene ${hayProductos} productos: marco el seed como hecho y no cargo nada`);
  }

  // Categorías
  const idPorSlug = new Map<string, string>();
  // MDF y madera se crean OCULTAS (E-09, CONTENIDO_FLOR §3); ver content/catalogo.ts.
  const ocultas = new Set(CATEGORIAS_OCULTAS.map((c) => c.slug));
  for (const [i, c] of [...CATEGORIAS, ...CATEGORIAS_OCULTAS].entries()) {
    const [existe] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, c.slug));
    if (existe) {
      idPorSlug.set(c.slug, existe.id);
      continue;
    }
    const [n] = await db
      .insert(categories)
      .values({
        slug: c.slug,
        nombre: c.nombre,
        linea: c.linea,
        tagline: c.tagline,
        descripcion: c.desc,
        incluye: [...c.incluye],
        imagen: c.img,
        orden: i,
        visible: !ocultas.has(c.slug),
      })
      .returning({ id: categories.id });
    idPorSlug.set(c.slug, n.id);
  }
  console.log(`✓ ${idPorSlug.size} categorías`);

  // Productos
  let nuevos = 0;
  for (const [i, p] of CATALOGO_WHATSAPP.entries()) {
    const categoryId = idPorSlug.get(p.categoria);
    if (!categoryId) continue;
    const [existe] = await db.select({ id: products.id }).from(products).where(eq(products.slug, p.slug));
    if (existe) continue;
    const [n] = await db
      .insert(products)
      .values({
        slug: p.slug,
        nombre: p.nombre,
        categoryId,
        precio: p.precio,
        descripcion: p.descripcion ?? "",
        medidas: p.medidas ?? null,
        // { etiqueta, precio }[] (modules/catalog/types.ts). El cast es porque
        // db/schema.ts todavía tipa la columna como string[] (pedido al frente A).
        variantes: [...(p.variantes ?? [])] as never,
        destacado: Boolean(p.destacado),
        visible: !ocultas.has(p.categoria),
        orden: i,
      })
      .returning({ id: products.id });
    if (p.img) await db.insert(productImages).values({ productId: n.id, url: p.img, alt: p.nombre, orden: 0 });
    nuevos++;
  }
  console.log(`✓ ${nuevos} productos nuevos (de ${CATALOGO_WHATSAPP.length})`);
  await db.insert(auditLog).values({ accion: MARCA, entidad: "datos", entidadId: "catalogo" }).onConflictDoNothing();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
