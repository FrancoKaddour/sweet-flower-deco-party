"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, asc, eq, isNull, max, ne } from "drizzle-orm";
import { del } from "@vercel/blob";
import { requireDb } from "@/db";
import { auditLog, categories, productImages, products } from "@/db/schema";
import { assertStaff } from "@/lib/dal";
import {
  categoriaSchema,
  erroresZod,
  productoSchema,
  type EstadoForm,
} from "./schemas";

/**
 * Server Actions del catálogo (panel). Cada una: 1) valida rol en el server,
 * 2) valida datos con zod, 3) escribe, 4) audita, 5) revalida el sitio.
 */

const ADMIN_EDIT = ["superadmin", "admin", "editor"] as const;
const SOLO_ADMIN = ["superadmin", "admin"] as const;

async function auditar(userId: string, accion: string, entidad: string, entidadId: string, datos?: object) {
  await requireDb()
    .insert(auditLog)
    .values({ userId, accion, entidad, entidadId, datos: (datos ?? null) as Record<string, unknown> | null });
}

/** Refresca las páginas públicas afectadas (inicio, catálogo, ficha). */
function revalidarSitio() {
  revalidatePath("/", "layout");
}

async function slugLibre(slug: string, excepto?: string) {
  const db = requireDb();
  let candidato = slug;
  for (let n = 2; n < 50; n++) {
    const [ya] = await db
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.slug, candidato), excepto ? ne(products.id, excepto) : undefined));
    if (!ya) return candidato;
    candidato = `${slug}-${n}`;
  }
  return `${slug}-${Date.now()}`;
}

/* ─────────────── Productos ─────────────── */

export async function guardarProducto(id: string | null, _prev: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const user = await assertStaff(ADMIN_EDIT);
  const raw = Object.fromEntries(fd);
  const parsed = productoSchema.safeParse({ ...raw, slug: raw.slug || raw.nombre });
  if (!parsed.success) return { ok: false, errores: erroresZod(parsed.error), mensaje: "Revisá los campos marcados." };
  const v = parsed.data;
  const db = requireDb();
  const slug = await slugLibre(v.slug, id ?? undefined);

  if (id) {
    await db
      .update(products)
      .set({ ...v, slug })
      .where(and(eq(products.id, id), isNull(products.deletedAt)));
    await auditar(user.id, "product.update", "product", id, v);
    revalidarSitio();
    return { ok: true, mensaje: "Cambios guardados.", id };
  }

  const [{ orden } = { orden: 0 }] = await db
    .select({ orden: max(products.orden) })
    .from(products)
    .where(eq(products.categoryId, v.categoryId))
    .then((r) => r.map((x) => ({ orden: (x.orden ?? 0) + 1 })));
  const [nuevo] = await db.insert(products).values({ ...v, slug, orden }).returning({ id: products.id });
  await auditar(user.id, "product.create", "product", nuevo.id, v);
  revalidarSitio();
  redirect(`/panel/productos/${nuevo.id}?creado=1`);
}

export async function alternarProducto(id: string, campo: "visible" | "destacado", valor: boolean) {
  const user = await assertStaff(ADMIN_EDIT);
  await requireDb().update(products).set({ [campo]: valor }).where(eq(products.id, id));
  await auditar(user.id, `product.${campo}`, "product", id, { [campo]: valor });
  revalidarSitio();
  revalidatePath("/panel/productos");
}

/** Borrado lógico (se puede recuperar desde la base; queda auditado). */
export async function borrarProducto(id: string) {
  const user = await assertStaff(SOLO_ADMIN);
  await requireDb().update(products).set({ deletedAt: new Date(), visible: false }).where(eq(products.id, id));
  await auditar(user.id, "product.delete", "product", id);
  revalidarSitio();
  redirect("/panel/productos?borrado=1");
}

export async function duplicarProducto(id: string) {
  const user = await assertStaff(ADMIN_EDIT);
  const db = requireDb();
  const [p] = await db.select().from(products).where(eq(products.id, id));
  if (!p) return;
  const slug = await slugLibre(`${p.slug}-copia`);
  const { id: _omit, createdAt: _c, updatedAt: _u, deletedAt: _d, ...resto } = p;
  void _omit; void _c; void _u; void _d;
  const [nuevo] = await db
    .insert(products)
    .values({ ...resto, slug, nombre: `${p.nombre} (copia)`, visible: false })
    .returning({ id: products.id });
  const imgs = await db.select().from(productImages).where(eq(productImages.productId, id));
  if (imgs.length)
    await db.insert(productImages).values(imgs.map((i) => ({ productId: nuevo.id, url: i.url, alt: i.alt, orden: i.orden })));
  await auditar(user.id, "product.duplicate", "product", nuevo.id, { desde: id });
  redirect(`/panel/productos/${nuevo.id}`);
}

/* ─────────────── Imágenes ─────────────── */

/** Registra una foto ya subida a Blob (la subida la hace el cliente vía /api/panel/upload). */
export async function agregarImagen(productId: string, url: string, alt: string) {
  const user = await assertStaff(ADMIN_EDIT);
  if (!/^https:\/\/[a-z0-9.-]+\.public\.blob\.vercel-storage\.com\//i.test(url)) throw new Error("URL de imagen inválida");
  const db = requireDb();
  const [{ m } = { m: -1 }] = await db
    .select({ m: max(productImages.orden) })
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .then((r) => r.map((x) => ({ m: x.m ?? -1 })));
  await db.insert(productImages).values({ productId, url, alt: alt.slice(0, 200), orden: m + 1 });
  await auditar(user.id, "product.image.add", "product", productId, { url });
  revalidarSitio();
  revalidatePath(`/panel/productos/${productId}`);
}

export async function borrarImagen(imagenId: string) {
  const user = await assertStaff(ADMIN_EDIT);
  const db = requireDb();
  const [img] = await db.select().from(productImages).where(eq(productImages.id, imagenId));
  if (!img) return;
  await db.delete(productImages).where(eq(productImages.id, imagenId));
  // Solo se borra el archivo si está en Blob (las importadas viven en /public).
  if (img.url.includes(".blob.vercel-storage.com")) await del(img.url).catch(() => undefined);
  await auditar(user.id, "product.image.delete", "product", img.productId, { url: img.url });
  revalidarSitio();
  revalidatePath(`/panel/productos/${img.productId}`);
}

/** Mueve una foto una posición (la primera es la portada). */
export async function moverImagen(imagenId: string, dir: -1 | 1) {
  await assertStaff(ADMIN_EDIT);
  const db = requireDb();
  const [img] = await db.select().from(productImages).where(eq(productImages.id, imagenId));
  if (!img) return;
  const todas = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, img.productId))
    .orderBy(asc(productImages.orden));
  const i = todas.findIndex((x) => x.id === imagenId);
  const j = i + dir;
  if (j < 0 || j >= todas.length) return;
  [todas[i], todas[j]] = [todas[j], todas[i]];
  await Promise.all(todas.map((x, k) => db.update(productImages).set({ orden: k }).where(eq(productImages.id, x.id))));
  revalidarSitio();
  revalidatePath(`/panel/productos/${img.productId}`);
}

/* ─────────────── Categorías ─────────────── */

export async function guardarCategoria(id: string | null, _prev: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const user = await assertStaff(SOLO_ADMIN);
  const raw = Object.fromEntries(fd);
  const parsed = categoriaSchema.safeParse({ ...raw, slug: raw.slug || raw.nombre });
  if (!parsed.success) return { ok: false, errores: erroresZod(parsed.error), mensaje: "Revisá los campos." };
  const db = requireDb();
  const [dup] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(and(eq(categories.slug, parsed.data.slug), id ? ne(categories.id, id) : undefined));
  if (dup) return { ok: false, errores: { slug: "Ya existe una categoría con ese enlace." } };
  if (id) {
    await db.update(categories).set(parsed.data).where(eq(categories.id, id));
    await auditar(user.id, "category.update", "category", id, parsed.data);
  } else {
    const [{ m } = { m: 0 }] = await db
      .select({ m: max(categories.orden) })
      .from(categories)
      .then((r) => r.map((x) => ({ m: (x.m ?? 0) + 1 })));
    const [n] = await db.insert(categories).values({ ...parsed.data, orden: m }).returning({ id: categories.id });
    await auditar(user.id, "category.create", "category", n.id, parsed.data);
  }
  revalidarSitio();
  revalidatePath("/panel/productos/categorias");
  return { ok: true, mensaje: "Categoría guardada." };
}
