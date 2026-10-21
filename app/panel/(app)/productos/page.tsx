import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/panel/PageHeader";
import { PanelButton } from "@/components/panel/PanelButton";
import { Badge } from "@/components/panel/Badge";
import { SinBase } from "@/components/panel/SinBase";
import { Alternar } from "@/components/panel/catalogo/Alternar";
import { inputCls } from "@/components/panel/catalogo/campos";
import { Paginacion } from "@/components/ui/Paginacion";
import { hasDb } from "@/db";
import { requireStaff } from "@/lib/dal";
import { listarCategoriasPanel, listarProductosPanel, type FiltroProductos } from "@/modules/catalog/admin";
import { formatARS } from "@/modules/catalog/types";

export const metadata: Metadata = { title: "Productos" };

const ESTADOS: { v: NonNullable<FiltroProductos["estado"]>; l: string }[] = [
  { v: "visibles", l: "Visibles" },
  { v: "ocultos", l: "Ocultos" },
  { v: "destacados", l: "Destacados" },
  { v: "sin-foto", l: "Sin foto" },
  { v: "sin-precio", l: "Sin precio" },
];

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; estado?: string; borrado?: string; pagina?: string }>;
}) {
  await requireStaff();
  const sp = await searchParams;
  const header = (
    <PageHeader
      seccion="Catálogo"
      titulo="Productos"
      descripcion="Lo que se ve en el sitio: fotos, precios, descripción y categoría."
      accion={
        <div className="flex flex-wrap gap-3">
          <PanelButton href="/panel/productos/categorias" variant="outline">
            Categorías
          </PanelButton>
          <PanelButton href="/panel/productos/nuevo">Nuevo producto</PanelButton>
        </div>
      }
    />
  );
  if (!hasDb()) return <div className="flex flex-col gap-8">{header}<SinBase /></div>;

  const estado = ESTADOS.find((e) => e.v === sp.estado)?.v;
  const [todos, categorias] = await Promise.all([
    listarProductosPanel({ q: sp.q?.slice(0, 80), categoria: sp.cat, estado }),
    listarCategoriasPanel(),
  ]);
  // Paginación (25 por página). La página vive en la URL junto con los filtros.
  const POR_PAGINA = 25;
  const totalPaginas = Math.max(1, Math.ceil(todos.length / POR_PAGINA));
  const pagina = Math.min(Math.max(1, Number(sp.pagina) || 1), totalPaginas);
  const productos = todos.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  const hrefPagina = (n: number) => {
    const q = new URLSearchParams();
    if (sp.q) q.set("q", sp.q);
    if (sp.cat) q.set("cat", sp.cat);
    if (estado) q.set("estado", estado);
    if (n > 1) q.set("pagina", String(n));
    const s = q.toString();
    return `/panel/productos${s ? `?${s}` : ""}`;
  };

  return (
    <div className="flex flex-col gap-8">
      {header}
      {sp.borrado && (
        <p role="status" className="rounded-[var(--radius-md)] border border-line bg-cloud px-4 py-3 text-muted">
          Producto borrado.
        </p>
      )}

      {/* Filtros (GET → se pueden compartir/guardar como link) */}
      <form className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto_auto]" role="search">
        <input name="q" defaultValue={sp.q} placeholder="Buscar por nombre o descripción…" className={inputCls} aria-label="Buscar" />
        <select name="cat" defaultValue={sp.cat ?? ""} className={inputCls} aria-label="Categoría">
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} ({c.productos})
            </option>
          ))}
        </select>
        <select name="estado" defaultValue={estado ?? ""} className={inputCls} aria-label="Estado">
          <option value="">Todos</option>
          {ESTADOS.map((e) => (
            <option key={e.v} value={e.v}>
              {e.l}
            </option>
          ))}
        </select>
        <PanelButton type="submit" variant="outline">
          Filtrar
        </PanelButton>
      </form>

      <p className="text-[length:var(--text-step--1)] text-muted">
        {todos.length} producto{todos.length === 1 ? "" : "s"}
        {totalPaginas > 1 && ` · página ${pagina} de ${totalPaginas}`}
      </p>

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-cloud">
        <table className="w-full min-w-[640px] text-left text-[length:var(--text-step--1)]">
          <caption className="sr-only">Productos del catálogo</caption>
          <thead className="border-b border-line text-[0.7rem] uppercase tracking-[0.1em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 text-right font-medium">Precio</th>
              <th className="px-4 py-3 text-center font-medium">Visible</th>
              <th className="px-4 py-3 text-center font-medium">Destacado</th>
              <th className="px-4 py-3 text-right font-medium">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {productos.map((p) => (
              <tr key={p.id} className="hover:bg-bone/60">
                <td className="px-4 py-3">
                  <Link href={`/panel/productos/${p.id}`} className="flex items-center gap-3">
                    <span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-sand">
                      {p.img && <Image src={p.img} alt="" fill sizes="40px" className="object-cover" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.68rem] uppercase tracking-[0.12em] text-champagne">{p.categoria}</span>
                      <span className="block truncate font-medium text-ink">{p.nombre}</span>
                      {!p.img && <Badge variant="warning">Sin foto</Badge>}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {p.precio != null ? formatARS(p.precio) : <Badge variant="warning">A consultar</Badge>}
                </td>
                <td className="px-4 py-3 text-center">
                  <Alternar id={p.id} campo="visible" valor={p.visible} label={`Visible: ${p.nombre}`} />
                </td>
                <td className="px-4 py-3 text-center">
                  <Alternar id={p.id} campo="destacado" valor={p.destacado} label={`Destacado: ${p.nombre}`} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Link href={`/panel/productos/${p.id}`} className="font-medium uppercase tracking-[0.08em] text-ink hover:text-bordeaux">
                    Editar
                  </Link>
                  <Link
                    href={`/productos/${p.categoriaSlug}/${p.slug}`}
                    target="_blank"
                    className="ml-4 text-muted hover:text-ink"
                  >
                    Ver ↗
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {productos.length === 0 && <p className="px-4 py-10 text-center text-muted">No hay productos con esos filtros.</p>}
      </div>
      <Paginacion pagina={pagina} total={totalPaginas} href={hrefPagina} />
    </div>
  );
}
