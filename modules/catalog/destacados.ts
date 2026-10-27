import { etiquetaPrecio, type Producto } from "./types";

// Selección para "Lo más pedido" del inicio: destacados con foto, categorías
// intercaladas (catering primero) para que la grilla no sea monótona.
const NOMBRE_CAT: Record<string, string> = {
  catering: "Catering",
  hierro: "Hierro",
  "fundas-y-telas": "Fundas",
  mdf: "MDF",
  madera: "Madera",
};
const ORDEN_CAT = ["catering", "hierro", "fundas-y-telas", "mdf", "madera"];

export type DestacadoItem = {
  slug: string;
  nombre: string;
  material: string;
  precio: string;
  img: string;
  href: string;
};

export function seleccionarDestacados(productos: readonly Producto[], max = 18): DestacadoItem[] {
  const grupos: Producto[][] = [];
  for (const p of productos) {
    if (!p.img) continue;
    const i = ORDEN_CAT.indexOf(p.categoria);
    (grupos[i < 0 ? ORDEN_CAT.length : i] ||= []).push(p);
  }
  return grupos
    .filter(Boolean)
    .flatMap((g) => g.map((p, k) => ({ p, k })))
    .sort((a, b) => a.k - b.k)
    .slice(0, max)
    .map(({ p }) => ({
      slug: p.slug,
      nombre: p.nombre,
      material: NOMBRE_CAT[p.categoria] ?? p.categoria,
      precio: etiquetaPrecio(p) ?? "A cotizar",
      img: p.img as string,
      href: `/productos/${p.categoria}/${p.slug}`,
    }));
}
