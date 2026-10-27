"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, asc, count, eq, isNotNull, isNull, max, ne } from "drizzle-orm";
import { del } from "@vercel/blob";
import { z } from "zod";
import { requireDb } from "@/db";
import { auditLog, categories, productImages, products } from "@/db/schema";
import { assertStaff } from "@/lib/dal";
import { PERMISOS } from "@/modules/ventas/estados";
import { normalizarVariantes, type VarianteProducto } from "./types";
import { categoriaSchema, erroresZod, parsePrecio, productoSchema, type EstadoForm } from "./schemas";

/**
 * Server Actions del catálogo (panel). Cada una: 1) valida rol en el server
 * (PERMISOS, la misma tabla que muestra Ajustes), 2) valida datos con zod,
 * 3) escribe, 4) audita, 5) revalida el sitio.
 */

type Res = { ok: boolean; mensaje: string };

/** La columna todavía está tipada como string[] en db/schema.ts (pedido al frente A). */
type VariantesDb = typeof products.$inferInsert.variantes;
const aDb = (v: VarianteProducto[]) => v as unknown as VariantesDb;

async function auditar(userId: string, accion: string, entidad: string, entidadId: string, datos?: object) {
  const [r] = await requireDb()
    .insert(auditLog)
    .values({ userId, accion, entidad, entidadId, datos: (datos ?? null) as Record<string, unknown> | null })
    .returning({ id: auditLog.id });
  return r?.id;
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

/** Si hay variantes con precio, el precio del producto es el más bajo (types.ts). */
function precioConVariantes(precio: number | null, variantes: VarianteProducto[]): number | null {
  const ps = variantes.map((v) => v.precio).filter((x): x is number => x != null);
  return ps.length ? Math.min(...ps) : precio;
}

/* ─────────────── Productos ─────────────── */

export async function guardarProducto(id: string | null, _prev: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const user = await assertStaff(PERMISOS.productoEditar.roles);
  const raw = Object.fromEntries(fd);
  const parsed = productoSchema.safeParse({ ...raw, slug: raw.slug || raw.nombre });
  if (!parsed.success) return { ok: false, errores: erroresZod(parsed.error), mensaje: "Revisá los campos marcados." };
  const v = parsed.data;
  const datos = { ...v, precio: precioConVariantes(v.precio, v.variantes), variantes: aDb(v.variantes) };
  const db = requireDb();
  const slug = await slugLibre(v.slug, id ?? undefined);

  if (id) {
    await db
      .update(products)
      .set({ ...datos, slug })
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
  // P-16: un producto nuevo nace OCULTO; se publica cuando ya tiene foto.
  const [nuevo] = await db
    .insert(products)
    .values({ ...datos, visible: false, slug, orden })
    .returning({ id: products.id });
  await auditar(user.id, "product.create", "product", nuevo.id, v);
  revalidarSitio();
  redirect(`/panel/productos/${nuevo.id}?creado=1`);
}

const campoSchema = z.enum(["visible", "destacado"]);

export async function alternarProducto(id: string, campo: "visible" | "destacado", valor: boolean): Promise<Res> {
  const user = await assertStaff(PERMISOS.productoEditar.roles);
  const c = campoSchema.parse(campo);
  const v = z.boolean().parse(valor);
  const r = await requireDb()
    .update(products)
    .set({ [c]: v })
    .where(and(eq(products.id, id), isNull(products.deletedAt)))
    .returning({ nombre: products.nombre });
  if (!r.length) return { ok: false, mensaje: "No encontramos el producto." };
  await auditar(user.id, `product.${c}`, "product", id, { [c]: v });
  revalidarSitio();
  revalidatePath("/panel/productos", "layout");
  return { ok: true, mensaje: r[0].nombre };
}

/** A la papelera (borrado lógico): deja de verse y se puede restaurar. */
export async function borrarProducto(id: string) {
  const user = await assertStaff(PERMISOS.productoBorrar.roles);
  await requireDb().update(products).set({ deletedAt: new Date(), visible: false }).where(eq(products.id, id));
  await auditar(user.id, "product.delete", "product", id);
  revalidarSitio();
  redirect("/panel/productos?borrado=1");
}

/** Saca de la papelera. Vuelve OCULTO, para revisarlo antes de publicarlo. */
export async function restaurarProducto(id: string): Promise<Res> {
  const user = await assertStaff(PERMISOS.productoBorrar.roles);
  const r = await requireDb()
    .update(products)
    .set({ deletedAt: null, visible: false })
    .where(and(eq(products.id, id), isNotNull(products.deletedAt)))
    .returning({ nombre: products.nombre });
  if (!r.length) return { ok: false, mensaje: "Ese producto no está en la papelera." };
  await auditar(user.id, "product.restore", "product", id);
  revalidarSitio();
  revalidatePath("/panel/productos", "layout");
  return { ok: true, mensaje: `Restauraste "${r[0].nombre}". Quedó oculto: publicalo cuando lo revises.` };
}

export async function duplicarProducto(id: string) {
  const user = await assertStaff(PERMISOS.productoEditar.roles);
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
  // Las fotos se COMPARTEN con el original; borrarImagen no borra el archivo
  // mientras otro producto lo use (P-07).
  const imgs = await db.select().from(productImages).where(eq(productImages.productId, id));
  if (imgs.length)
    await db.insert(productImages).values(imgs.map((i) => ({ productId: nuevo.id, url: i.url, alt: i.alt, orden: i.orden })));
  await auditar(user.id, "product.duplicate", "product", nuevo.id, { desde: id });
  redirect(`/panel/productos/${nuevo.id}`);
}

/** Precio rápido desde la tabla (P-17). */
export async function cambiarPrecio(id: string, texto: string): Promise<Res & { precio?: number | null }> {
  const user = await assertStaff(PERMISOS.productoEditar.roles);
  const p = parsePrecio(String(texto ?? ""));
  if (!p.ok) return { ok: false, mensaje: p.error };
  const db = requireDb();
  const [prod] = await db.select().from(products).where(and(eq(products.id, id), isNull(products.deletedAt)));
  if (!prod) return { ok: false, mensaje: "No encontramos el producto." };
  if (normalizarVariantes(prod.variantes).some((v) => v.precio != null))
    return { ok: false, mensaje: "Tiene variantes con precio: cambialo desde la ficha del producto." };
  await db.update(products).set({ precio: p.valor }).where(eq(products.id, id));
  await auditar(user.id, "product.precio", "product", id, { antes: prod.precio, despues: p.valor });
  revalidarSitio();
  revalidatePath("/panel/productos");
  return { ok: true, mensaje: `Precio de "${prod.nombre}" guardado.`, precio: p.valor };
}

/* ─────────────── Aumento masivo por categoría (P-17 / idea wow 3) ─────────────── */

export type CambioPrecio = { id: string; nombre: string; antes: number; despues: number; variantes: number };

const redondear500 = (n: number) => Math.max(500, Math.round(n / 500) * 500);
const aumentoSchema = z.object({ categoria: z.string().min(1), pct: z.number().min(-50).max(200) });

async function calcularAumento(categoria: string, pct: number) {
  const db = requireDb();
  const filas = await db
    .select()
    .from(products)
    .where(and(eq(products.categoryId, categoria), isNull(products.deletedAt)))
    .orderBy(asc(products.orden), asc(products.nombre));
  const f = 1 + pct / 100;
  return filas
    .map((p) => {
      const vs = normalizarVariantes(p.variantes);
      const nuevasVs = vs.map((v) => ({ ...v, precio: v.precio != null && v.precio > 0 ? redondear500(v.precio * f) : v.precio }));
      const precio = p.precio != null && p.precio > 0 ? redondear500(p.precio * f) : p.precio;
      return { p, vs, nuevasVs, precio: precioConVariantes(precio, nuevasVs) };
    })
    .filter((x) => x.p.precio != null && x.p.precio > 0);
}

export async function previsualizarAumento(categoria: string, pct: number): Promise<{ ok: boolean; mensaje: string; cambios: CambioPrecio[] }> {
  await assertStaff(PERMISOS.preciosMasivos.roles);
  const a = aumentoSchema.safeParse({ categoria, pct });
  if (!a.success || a.data.pct === 0) return { ok: false, mensaje: "Elegí una categoría y un porcentaje (entre -50 y 200).", cambios: [] };
  const filas = await calcularAumento(a.data.categoria, a.data.pct);
  return {
    ok: true,
    mensaje: "",
    cambios: filas.map(({ p, precio, vs }) => ({ id: p.id, nombre: p.nombre, antes: p.precio ?? 0, despues: precio ?? 0, variantes: vs.filter((v) => v.precio != null).length })),
  };
}

export async function aplicarAumento(categoria: string, pct: number): Promise<Res & { auditId?: string }> {
  const user = await assertStaff(PERMISOS.preciosMasivos.roles);
  const a = aumentoSchema.safeParse({ categoria, pct });
  if (!a.success || a.data.pct === 0) return { ok: false, mensaje: "Porcentaje inválido." };
  const db = requireDb();
  const filas = await calcularAumento(a.data.categoria, a.data.pct);
  if (!filas.length) return { ok: false, mensaje: "No hay productos con precio en esa categoría." };
  for (let i = 0; i < filas.length; i += 20) {
    await Promise.all(
      filas.slice(i, i + 20).map(({ p, precio, nuevasVs }) =>
        db.update(products).set({ precio, variantes: aDb(nuevasVs) }).where(eq(products.id, p.id)),
      ),
    );
  }
  const auditId = await auditar(user.id, "product.precio.masivo", "category", a.data.categoria, {
    pct: a.data.pct,
    cambios: filas.map(({ p, vs }) => ({ id: p.id, precio: p.precio, variantes: vs })),
  });
  revalidarSitio();
  revalidatePath("/panel/productos", "layout");
  return { ok: true, mensaje: `Listo: ${filas.length} precios ${a.data.pct > 0 ? "subieron" : "bajaron"} ${Math.abs(a.data.pct)}%.`, auditId };
}

/** Vuelve los precios al estado anterior al aumento (desde el audit_log). */
export async function deshacerAumento(auditId: string): Promise<Res> {
  const user = await assertStaff(PERMISOS.preciosMasivos.roles);
  const db = requireDb();
  const [a] = await db.select().from(auditLog).where(and(eq(auditLog.id, auditId), eq(auditLog.accion, "product.precio.masivo")));
  if (!a?.datos) return { ok: false, mensaje: "No encontramos ese cambio." };
  const [ya] = await db
    .select({ n: count() })
    .from(auditLog)
    .where(and(eq(auditLog.accion, "product.precio.masivo.deshacer"), eq(auditLog.entidadId, auditId)));
  if ((ya?.n ?? 0) > 0) return { ok: false, mensaje: "Ese aumento ya se deshizo." };
  const cambios = (a.datos.cambios ?? []) as { id: string; precio: number | null; variantes: VarianteProducto[] }[];
  for (let i = 0; i < cambios.length; i += 20) {
    await Promise.all(
      cambios.slice(i, i + 20).map((c) => db.update(products).set({ precio: c.precio, variantes: aDb(c.variantes ?? []) }).where(eq(products.id, c.id))),
    );
  }
  await auditar(user.id, "product.precio.masivo.deshacer", "audit", auditId, { productos: cambios.length });
  revalidarSitio();
  revalidatePath("/panel/productos", "layout");
  return { ok: true, mensaje: `Volvieron los ${cambios.length} precios anteriores.` };
}

/** Orden dentro de la categoría (P-12): sube o baja un lugar. */
export async function moverProducto(id: string, dir: -1 | 1): Promise<Res> {
  const user = await assertStaff(PERMISOS.productoEditar.roles);
  const d = z.union([z.literal(-1), z.literal(1)]).parse(dir);
  const db = requireDb();
  const [p] = await db.select({ categoryId: products.categoryId }).from(products).where(eq(products.id, id));
  if (!p) return { ok: false, mensaje: "No encontramos el producto." };
  const todos = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.categoryId, p.categoryId), isNull(products.deletedAt)))
    .orderBy(asc(products.orden), asc(products.nombre));
  const i = todos.findIndex((x) => x.id === id);
  const j = i + d;
  if (i < 0 || j < 0 || j >= todos.length) return { ok: true, mensaje: "" };
  [todos[i], todos[j]] = [todos[j], todos[i]];
  await Promise.all(todos.map((x, k) => db.update(products).set({ orden: k }).where(eq(products.id, x.id))));
  await auditar(user.id, "product.orden", "product", id, { dir: d });
  revalidarSitio();
  revalidatePath("/panel/productos");
  return { ok: true, mensaje: "" };
}

/* ─────────────── Imágenes ─────────────── */

const URL_BLOB = /^https:\/\/[a-z0-9.-]+\.public\.blob\.vercel-storage\.com\//i;

/** Registra una foto ya subida a Blob (la subida la hace el cliente vía /api/panel/upload). */
export async function agregarImagen(productId: string, url: string, alt: string) {
  const user = await assertStaff(PERMISOS.productoEditar.roles);
  if (!URL_BLOB.test(url)) throw new Error("URL de imagen inválida");
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

export async function borrarImagen(imagenId: string): Promise<Res> {
  const user = await assertStaff(PERMISOS.productoEditar.roles);
  const db = requireDb();
  const [img] = await db.select().from(productImages).where(eq(productImages.id, imagenId));
  if (!img) return { ok: false, mensaje: "Esa foto ya no está." };
  await db.delete(productImages).where(eq(productImages.id, imagenId));
  // P-07: el archivo se borra de Blob SOLO si ningún otro producto lo usa
  // (al duplicar, la copia comparte las fotos del original). Las importadas viven en /public.
  const [otros] = await db.select({ n: count() }).from(productImages).where(eq(productImages.url, img.url));
  if (img.url.includes(".blob.vercel-storage.com") && (otros?.n ?? 0) === 0) await del(img.url).catch(() => undefined);
  await auditar(user.id, "product.image.delete", "product", img.productId, { url: img.url, compartida: (otros?.n ?? 0) > 0 });
  revalidarSitio();
  revalidatePath(`/panel/productos/${img.productId}`);
  return { ok: true, mensaje: "Foto borrada." };
}

/** Mueve una foto una posición (la primera es la portada). */
export async function moverImagen(imagenId: string, dir: -1 | 1): Promise<Res> {
  const user = await assertStaff(PERMISOS.productoEditar.roles);
  const db = requireDb();
  const [img] = await db.select().from(productImages).where(eq(productImages.id, imagenId));
  if (!img) return { ok: false, mensaje: "Esa foto ya no está." };
  const todas = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, img.productId))
    .orderBy(asc(productImages.orden));
  const i = todas.findIndex((x) => x.id === imagenId);
  const j = i + dir;
  if (j < 0 || j >= todas.length) return { ok: true, mensaje: "" };
  [todas[i], todas[j]] = [todas[j], todas[i]];
  await Promise.all(todas.map((x, k) => db.update(productImages).set({ orden: k }).where(eq(productImages.id, x.id))));
  await auditar(user.id, "product.image.move", "product", img.productId, { url: img.url, portada: todas[0]?.id === imagenId });
  revalidarSitio();
  revalidatePath(`/panel/productos/${img.productId}`);
  return { ok: true, mensaje: j === 0 ? "Ahora es la portada." : "" };
}

/* ─────────────── Categorías ─────────────── */

export async function guardarCategoria(id: string | null, _prev: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const user = await assertStaff(PERMISOS.categorias.roles);
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

