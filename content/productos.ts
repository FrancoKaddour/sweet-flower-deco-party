// CATÁLOGO DE PRODUCTOS — acá se cargan las piezas (fuente: catálogo de WhatsApp
// de Sweet Flowers, que tiene precios y medidas — §18 de docs/CONTENIDO_FLOR.md).
//
// CÓMO CARGAR UN PRODUCTO: copiá un bloque del ejemplo de abajo y completalo.
//   slug       → identificador único, en minúsculas y con guiones ("arco-extensible-2m")
//   categoria  → "catering" | "hierro" | "fundas-y-telas" | "pies-de-lampara"
//   precio     → precio de catálogo en pesos, SIN recargo (número, sin puntos). null = "Consultar"
//   medidas    → texto libre ("2 m alto × 1,5 m ancho")
//   variantes  → opcional (["Pintado", "Sin pintar"], colores, combos…)
//   img        → foto en /public/productos/<archivo>.jpg (o null mientras no haya)
//   mpLink     → link de pago de Mercado Pago de ese producto (opcional)
//
// El precio con Mercado Pago se CALCULA (no se carga): precio / (1 − 0,15) ≈ +17,6 %.

export type Producto = {
  slug: string;
  nombre: string;
  categoria: "catering" | "hierro" | "fundas-y-telas" | "pies-de-lampara";
  precio: number | null;
  medidas?: string;
  variantes?: readonly string[];
  img: string | null;
  mpLink?: string | null;
};

export const RECARGO_MP = 0.15;

/** Precio con Mercado Pago: catálogo / (1 − 15 %). */
export function precioMP(precio: number): number {
  return Math.round(precio / (1 - RECARGO_MP));
}

export function formatARS(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

export const PRODUCTOS: readonly Producto[] = [
  // EJEMPLO (borrar al cargar los reales):
  // {
  //   slug: "exhibidor-eclipse",
  //   nombre: "Exhibidor Eclipse",
  //   categoria: "catering",
  //   precio: 85000,
  //   medidas: "60 cm diámetro",
  //   variantes: ["Dorado", "Blanco"],
  //   img: "/productos/exhibidor-eclipse.jpg",
  //   mpLink: null,
  // },
];

export const productosDe = (categoria: string) =>
  PRODUCTOS.filter((p) => p.categoria === categoria);
