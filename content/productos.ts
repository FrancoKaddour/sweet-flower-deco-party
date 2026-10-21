// CATÁLOGO DE PRODUCTOS — acá se cargan las piezas (fuente: catálogo de WhatsApp
// de Sweet Flowers, que tiene precios y medidas — §18 de docs/CONTENIDO_FLOR.md).
//
// CÓMO CARGAR UN PRODUCTO: copiá un bloque del ejemplo de abajo y completalo.
//   slug       → identificador único, en minúsculas y con guiones ("arco-extensible-2m")
//   categoria  → "catering" | "hierro" | "mdf" | "madera" | "fundas-y-telas"
//   precio     → precio de catálogo en pesos, SIN recargo (número, sin puntos). null = "Consultar"
//   medidas    → texto libre ("2 m alto × 1,5 m ancho")
//   variantes  → opcional (["Pintado", "Sin pintar"], colores, combos…)
//   img        → foto en /public/productos/<archivo>.jpg (o null mientras no haya)
//
// No hay pago en el sitio: el carrito arma el pedido y se envía por WhatsApp.

import { CATALOGO_WHATSAPP } from "./catalogo-whatsapp";

export type CategoriaSlug = "catering" | "hierro" | "mdf" | "madera" | "fundas-y-telas";

export type Producto = {
  slug: string;
  nombre: string;
  categoria: CategoriaSlug;
  precio: number | null;
  /** Texto del catálogo (medidas, variantes, precios de combos/pintado…). */
  descripcion?: string;
  medidas?: string;
  variantes?: readonly string[];
  img: string | null;
  /** Estaba en una colección destacada del catálogo de WhatsApp. */
  destacado?: boolean;
};

export { formatARS } from "@/modules/catalog/types";

// Productos = catálogo de WhatsApp (content/catalogo-whatsapp.ts).
export const PRODUCTOS: readonly Producto[] = CATALOGO_WHATSAPP;

/** Productos de una categoría: primero los destacados del catálogo. */
export const productosDe = (categoria: string) =>
  PRODUCTOS.filter((p) => p.categoria === categoria).sort(
    (a, b) => Number(!!b.destacado) - Number(!!a.destacado),
  );
