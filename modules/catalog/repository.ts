import "server-only";
import { cache } from "react";
import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/db";
import { categories, productImages, products } from "@/db/schema";
import { CATEGORIAS } from "@/content/catalogo";
import { CATALOGO_WHATSAPP } from "@/content/catalogo-whatsapp";
import type { Categoria, Producto } from "./types";

/**
 * Repositorio del catálogo (patrón adapter — skill architecture-review).
 * Fuente: Postgres si hay DATABASE_URL; si no, el catálogo estático importado
 * de WhatsApp. La UI no sabe cuál está detrás → el sitio nunca se cae.
 */

/* ── Respaldo estático ── */
const estaticoCategorias = (): Categoria[] =>
  CATEGORIAS.map((c) => ({ ...c, id: c.slug, incluye: [...c.incluye] }));

const estaticoProductos = (): Producto[] =>
  CATALOGO_WHATSAPP.map((p) => ({
    id: p.slug,
    slug: p.slug,
    nombre: p.nombre,
    categoria: p.categoria,
    precio: p.precio,
    descripcion: p.descripcion,
    img: p.img,
    imagenes: p.img ? [{ url: p.img, alt: p.nombre }] : [],
    destacado: p.destacado,
  }));

/* ── Base ── */
const pad = (n: number) => String(n).padStart(2, "0");

async function productosDeBase(filtro: { categoriaId?: string; destacados?: boolean; slug?: string }) {
  if (!db) return [];
  const cats = await db.select().from(categories);
  const slugDeCat = new Map(cats.map((c) => [c.id, c.slug]));
  const rows = await db
    .select()
    .from(products)
    .where(
      and(
        isNull(products.deletedAt),
        eq(products.visible, true),
        filtro.categoriaId ? eq(products.categoryId, filtro.categoriaId) : undefined,
        filtro.destacados ? eq(products.destacado, true) : undefined,
        filtro.slug ? eq(products.slug, filtro.slug) : undefined,
      ),
    )
    .orderBy(asc(products.orden), asc(products.nombre));
  if (rows.length === 0) return [];
  const imgs = await db
    .select()
    .from(productImages)
    .where(inArray(productImages.productId, rows.map((r) => r.id)))
    .orderBy(asc(productImages.orden));
  const porProducto = new Map<string, { url: string; alt: string }[]>();
  for (const i of imgs) {
    const arr = porProducto.get(i.productId) ?? [];
    arr.push({ url: i.url, alt: i.alt });
    porProducto.set(i.productId, arr);
  }
  return rows.map<Producto>((r) => {
    const imagenes = porProducto.get(r.id) ?? [];
    return {
      id: r.id,
      slug: r.slug,
      nombre: r.nombre,
      categoria: slugDeCat.get(r.categoryId) ?? "",
      precio: r.precio,
      descripcion: r.descripcion,
      medidas: r.medidas,
      variantes: r.variantes,
      img: imagenes[0]?.url ?? null,
      imagenes,
      destacado: r.destacado,
    };
  });
}

/* ── API pública del repositorio ── */

export const getCategorias = cache(async (): Promise<Categoria[]> => {
  if (!db) return estaticoCategorias();
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.visible, true))
    .orderBy(asc(categories.orden));
  if (rows.length === 0) return estaticoCategorias(); // base vacía (antes del seed)
  return rows.map((c, i) => ({
    id: c.id,
    slug: c.slug,
    linea: c.linea,
    index: pad(i + 1),
    nombre: c.nombre,
    tagline: c.tagline,
    desc: c.descripcion,
    incluye: c.incluye,
    img: c.imagen ?? "",
  }));
});

export const getCategoria = cache(async (slug: string) =>
  (await getCategorias()).find((c) => c.slug === slug) ?? null,
);

export const getProductosDeCategoria = cache(async (slug: string): Promise<Producto[]> => {
  const cat = await getCategoria(slug);
  if (!cat) return [];
  // Si la categoría viene de la base (id ≠ slug), mandan los productos de la base
  // aunque estén vacíos; si no, el catálogo estático.
  const vieneDeBase = Boolean(db) && cat.id !== cat.slug;
  const lista = vieneDeBase
    ? await productosDeBase({ categoriaId: cat.id })
    : estaticoProductos().filter((p) => p.categoria === slug);
  // destacados primero
  return [...lista].sort((a, b) => Number(!!b.destacado) - Number(!!a.destacado));
});

export const getProducto = cache(async (categoria: string, slug: string): Promise<Producto | null> => {
  if (db) {
    const [p] = await productosDeBase({ slug });
    if (p) return p.categoria === categoria ? p : null;
  }
  return estaticoProductos().find((p) => p.slug === slug && p.categoria === categoria) ?? null;
});

export const getDestacados = cache(async (limite = 18): Promise<Producto[]> => {
  const desdeBase = db ? await productosDeBase({ destacados: true }) : [];
  const lista = desdeBase.length ? desdeBase : estaticoProductos().filter((p) => p.destacado);
  return lista.filter((p) => p.img).slice(0, limite * 3);
});

/** Todos los productos visibles (sitemap, estáticos). */
export const getTodosLosProductos = cache(async (): Promise<Producto[]> => {
  const desdeBase = db ? await productosDeBase({}) : [];
  return desdeBase.length ? desdeBase : estaticoProductos();
});

export const getRelacionados = cache(async (p: Producto, limite = 4) =>
  (await getProductosDeCategoria(p.categoria)).filter((x) => x.slug !== p.slug && x.img).slice(0, limite),
);
