/**
 * Seed inicial: carga en la base las categorías y los 179 productos del
 * catálogo de WhatsApp (con sus fotos de /public/productos). Idempotente:
 * si un slug ya existe, no lo pisa (las ediciones del panel quedan intactas).
 *
 *   npm run db:seed
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";
import { CATEGORIAS } from "../content/catalogo";
import { CATALOGO_WHATSAPP } from "../content/catalogo-whatsapp";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Falta DATABASE_URL (corré `vercel env pull .env.local`).");
  const db = drizzle(neon(url), { schema });
  const { categories, products, productImages } = schema;

  // Categorías
  const idPorSlug = new Map<string, string>();
  for (const [i, c] of CATEGORIAS.entries()) {
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
        destacado: Boolean(p.destacado),
        visible: true,
        orden: i,
      })
      .returning({ id: products.id });
    if (p.img) await db.insert(productImages).values({ productId: n.id, url: p.img, alt: p.nombre, orden: 0 });
    nuevos++;
  }
  console.log(`✓ ${nuevos} productos nuevos (de ${CATALOGO_WHATSAPP.length})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
