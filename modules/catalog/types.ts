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
  variantes?: readonly string[];
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
