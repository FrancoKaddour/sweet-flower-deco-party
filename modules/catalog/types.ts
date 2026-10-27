// Dominio del catálogo — tipos que usa la UI. No dependen de la fuente de datos
// (base o catálogo estático): el repositorio traduce a estos tipos.

export type Linea = "catering" | "ambientacion";

export type Categoria = {
  id: string;
  slug: string;
  linea: Linea;
  /** "01", "02"… (orden visible). */
  index: string;
  nombre: string;
  tagline: string;
  desc: string;
  incluye: readonly string[];
  img: string;
};

export type ImagenProducto = { url: string; alt: string };

/**
 * FORMATO DE VARIANTES (acordado C1 ↔ B, 27/10) — así se guarda en
 * `products.variantes` (jsonb) y así lo edita el panel:
 *
 *   [{ "etiqueta": "Sin pintar", "precio": 312000 },
 *    { "etiqueta": "Pintado",    "precio": 420000 }]
 *
 * - `etiqueta`: texto corto que ve la clienta en el chip (≤ 60 caracteres),
 *   ej. "2,40 × 1,80 m", "Pintado", "Combo x3".
 * - `precio`: pesos por transferencia (entero) o null = "a cotizar".
 * - Si hay variantes, `Producto.precio` es el MÍNIMO de los precios de las
 *   variantes (sirve para ordenar y para "Desde $X").
 * - El orden del array es el orden de los chips; el primero es el elegido por defecto.
 * - Datos viejos (string[] tipo ["Blanco","Negro"]) se leen con
 *   `normalizarVariantes()` como { etiqueta, precio: null }.
 */
export type VarianteProducto = { etiqueta: string; precio: number | null };

/** Acepta el formato nuevo o el viejo (string[]) y devuelve VarianteProducto[]. */
export function normalizarVariantes(raw: unknown): VarianteProducto[] {
  if (!Array.isArray(raw)) return [];
  const out: VarianteProducto[] = [];
  for (const v of raw) {
    if (typeof v === "string") {
      const etiqueta = v.trim();
      if (etiqueta) out.push({ etiqueta, precio: null });
    } else if (v && typeof v === "object" && typeof (v as { etiqueta?: unknown }).etiqueta === "string") {
      const etiqueta = (v as { etiqueta: string }).etiqueta.trim();
      const pr = (v as { precio?: unknown }).precio;
      const precio = typeof pr === "number" && Number.isFinite(pr) && pr >= 0 ? Math.round(pr) : null;
      if (etiqueta) out.push({ etiqueta, precio });
    }
  }
  return out;
}

/** Rango de precios del producto considerando variantes. null si no hay ninguno. */
export function rangoDePrecio(p: Pick<Producto, "precio" | "variantes">): { min: number; max: number } | null {
  const precios = (p.variantes ?? []).map((v) => v.precio).filter((x): x is number => x != null);
  if (p.precio != null) precios.push(p.precio);
  if (precios.length === 0) return null;
  return { min: Math.min(...precios), max: Math.max(...precios) };
}

/** "$312.000" o "Desde $312.000" (si las variantes cambian el precio) o null (a cotizar). */
export function etiquetaPrecio(p: Pick<Producto, "precio" | "variantes">): string | null {
  const r = rangoDePrecio(p);
  if (!r) return null;
  return r.min === r.max ? formatARS(r.min) : `Desde ${formatARS(r.min)}`;
}

export type Producto = {
  id: string;
  slug: string;
  nombre: string;
  /** slug de la categoría */
  categoria: string;
  /** Pesos, precio de catálogo (transferencia). null = a consultar. */
  precio: number | null;
  descripcion?: string;
  medidas?: string | null;
  /**
   * Opciones del producto (medida, pintado/sin pintar, combo…), cada una con su
   * precio por transferencia. Ver `VarianteProducto`. Vacío/ausente = sin opciones.
   */
  variantes?: readonly VarianteProducto[];
  /** Foto principal (la primera de `imagenes`). */
  img: string | null;
  imagenes: readonly ImagenProducto[];
  destacado?: boolean;
};

export function formatARS(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Pieza de hierro (habilita los colores de hierro): categoría hierro o colores de hierro en la descripción. */
export function esHierro(p: Pick<Producto, "categoria" | "descripcion">): boolean {
  return p.categoria === "hierro" || /rosa gold/i.test(p.descripcion ?? "");
}
