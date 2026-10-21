import "server-only";
import { and, asc, count, desc, eq, ilike, inArray, isNull, or, sql } from "drizzle-orm";
import { requireDb } from "@/db";
import { categories, productImages, products } from "@/db/schema";

/** Consultas del PANEL (incluye ocultos; nunca los borrados). Solo staff las llama. */

export type FiltroProductos = {
  q?: string;
  categoria?: string;
  estado?: "visibles" | "ocultos" | "sin-foto" | "sin-precio" | "destacados";
};

export async function listarProductosPanel(f: FiltroProductos) {
  const db = requireDb();
  const conds = [isNull(products.deletedAt)];
  if (f.q) conds.push(or(ilike(products.nombre, `%${f.q}%`), ilike(products.descripcion, `%${f.q}%`))!);
  if (f.categoria) conds.push(eq(products.categoryId, f.categoria));
  if (f.estado === "visibles") conds.push(eq(products.visible, true));
  if (f.estado === "ocultos") conds.push(eq(products.visible, false));
  if (f.estado === "sin-precio") conds.push(isNull(products.precio));
  if (f.estado === "destacados") conds.push(eq(products.destacado, true));
  if (f.estado === "sin-foto")
    conds.push(sql`not exists (select 1 from ${productImages} where ${productImages.productId} = ${products.id})`);

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      nombre: products.nombre,
      precio: products.precio,
      visible: products.visible,
      destacado: products.destacado,
      updatedAt: products.updatedAt,
      categoria: categories.nombre,
      categoriaSlug: categories.slug,
    })
    .from(products)
    .innerJoin(categories, eq(categories.id, products.categoryId))
    .where(and(...conds))
    .orderBy(asc(categories.orden), asc(products.orden), asc(products.nombre));

  const ids = rows.map((r) => r.id);
  const portadas = ids.length
    ? await db
        .select({ productId: productImages.productId, url: productImages.url, orden: productImages.orden })
        .from(productImages)
        .where(inArray(productImages.productId, ids))
        .orderBy(asc(productImages.orden))
    : [];
  const portada = new Map<string, string>();
  for (const p of portadas) if (!portada.has(p.productId)) portada.set(p.productId, p.url);
  return rows.map((r) => ({ ...r, img: portada.get(r.id) ?? null }));
}

export async function obtenerProductoPanel(id: string) {
  const db = requireDb();
  const [p] = await db.select().from(products).where(and(eq(products.id, id), isNull(products.deletedAt)));
  if (!p) return null;
  const imagenes = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, id))
    .orderBy(asc(productImages.orden));
  return { ...p, imagenes };
}

export async function listarCategoriasPanel() {
  const db = requireDb();
  const rows = await db.select().from(categories).orderBy(asc(categories.orden));
  const conteos = await db
    .select({ categoryId: products.categoryId, n: count() })
    .from(products)
    .where(isNull(products.deletedAt))
    .groupBy(products.categoryId);
  const n = new Map(conteos.map((c) => [c.categoryId, c.n]));
  return rows.map((c) => ({ ...c, productos: n.get(c.id) ?? 0 }));
}

/** Métricas rápidas del catálogo para el Inicio del panel. */
export async function resumenCatalogo() {
  const db = requireDb();
  const [tot] = await db.select({ n: count() }).from(products).where(isNull(products.deletedAt));
  const [sinPrecio] = await db
    .select({ n: count() })
    .from(products)
    .where(and(isNull(products.deletedAt), isNull(products.precio)));
  const [sinFoto] = await db
    .select({ n: count() })
    .from(products)
    .where(
      and(
        isNull(products.deletedAt),
        sql`not exists (select 1 from ${productImages} where ${productImages.productId} = ${products.id})`,
      ),
    );
  const [ocultos] = await db
    .select({ n: count() })
    .from(products)
    .where(and(isNull(products.deletedAt), eq(products.visible, false)));
  const [destacados] = await db
    .select({ n: count() })
    .from(products)
    .where(and(isNull(products.deletedAt), eq(products.destacado, true)));
  const ultimos = await db
    .select({ id: products.id, nombre: products.nombre, updatedAt: products.updatedAt })
    .from(products)
    .where(isNull(products.deletedAt))
    .orderBy(desc(products.updatedAt))
    .limit(5);
  return {
    total: tot?.n ?? 0,
    sinPrecio: sinPrecio?.n ?? 0,
    sinFoto: sinFoto?.n ?? 0,
    ocultos: ocultos?.n ?? 0,
    destacados: destacados?.n ?? 0,
    ultimos,
  };
}
