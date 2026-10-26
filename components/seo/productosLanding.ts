import type { Producto } from "@/modules/catalog/types";
import type { Landing } from "@/content/seo/landings";

/** "Torre EIFFEL" → "torre eiffel" (sin tildes, minúsculas) para filtrar. */
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Productos REALES del catálogo que corresponden a una landing. Devuelve todos
 * los que coinciden (para el "desde $") y la selección a mostrar (con foto,
 * destacados primero).
 */
export function productosDeLanding(todos: readonly Producto[], l: Landing) {
  const f = l.productos;
  if (!f) return { todos: [] as Producto[], mostrar: [] as Producto[], desde: null as number | null };
  const re = f.re ? new RegExp(f.re, "i") : null;
  const ex = f.excluir ? new RegExp(f.excluir, "i") : null;
  const match = todos.filter(
    (p) =>
      (!f.cats || f.cats.includes(p.categoria)) &&
      (!re || re.test(norm(p.nombre))) &&
      (!ex || !ex.test(norm(p.nombre))),
  );
  const mostrar = [...match]
    .filter((p) => p.img)
    .sort((a, b) => Number(!!b.destacado) - Number(!!a.destacado))
    .slice(0, f.max ?? 8);
  const precios = match.map((p) => p.precio).filter((n): n is number => n != null && n > 0);
  return { todos: match, mostrar, desde: precios.length ? Math.min(...precios) : null };
}
