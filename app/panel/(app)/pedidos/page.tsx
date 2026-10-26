import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/panel/PageHeader";
import { PanelButton } from "@/components/panel/PanelButton";
import { SinBase } from "@/components/panel/SinBase";
import { inputCls } from "@/components/panel/catalogo/campos";
import { EstadoSelect } from "@/components/panel/ventas/EstadoSelect";
import { FiltroEstados } from "@/components/panel/ventas/FiltroEstados";
import { Paginacion } from "@/components/ui/Paginacion";
import { hasDb } from "@/db";
import { requireStaff } from "@/lib/dal";
import { fechaCorta } from "@/lib/panel/formato";
import { formatARS } from "@/modules/catalog/types";
import { conteos, listarPedidos } from "@/modules/ventas/admin";
import { ESTADOS_PEDIDO, type EstadoPedido } from "@/modules/ventas/estados";

export const metadata: Metadata = { title: "Pedidos" };

const POR_PAGINA = 25;

/** Rótulo de celda que sólo se ve en la vista de tarjetas (< md). */
const ETQ = "text-[0.7rem] uppercase tracking-[0.12em] text-muted md:hidden";

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string; pagina?: string }>;
}) {
  await requireStaff();
  const sp = await searchParams;
  const header = (
    <PageHeader
      seccion="Ventas"
      titulo="Pedidos"
      descripcion="Cada pedido que alguien arma en el carrito y manda por WhatsApp queda acá, con su código (ej. SF-7KQ4M) para encontrarlo en el chat."
    />
  );
  if (!hasDb()) return <div className="flex flex-col gap-8">{header}<SinBase /></div>;

  const estado = ESTADOS_PEDIDO.find((e) => e.v === sp.estado)?.v as EstadoPedido | undefined;
  const q = sp.q?.slice(0, 80);
  const [todos, c] = await Promise.all([listarPedidos({ q, estado }), conteos()]);
  const totalPaginas = Math.max(1, Math.ceil(todos.length / POR_PAGINA));
  const pagina = Math.min(Math.max(1, Number(sp.pagina) || 1), totalPaginas);
  const pedidos = todos.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  const hrefPagina = (n: number) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (estado) p.set("estado", estado);
    if (n > 1) p.set("pagina", String(n));
    const s = p.toString();
    return `/panel/pedidos${s ? `?${s}` : ""}`;
  };

  return (
    <div className="flex flex-col gap-8">
      {header}
      <FiltroEstados base="/panel/pedidos" activo={estado} opciones={ESTADOS_PEDIDO} conteos={c.pedidos} extra={{ q }} />
      <form className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]" role="search">
        {estado && <input type="hidden" name="estado" value={estado} />}
        <input name="q" type="search" enterKeyHint="search" autoCorrect="off" defaultValue={q} placeholder="Buscar por código, nombre o localidad…" className={inputCls} aria-label="Buscar" />
        <PanelButton type="submit" variant="outline">
          Buscar
        </PanelButton>
      </form>

      {/* Tabla en md+; en celular cada pedido es una tarjeta (sin scroll horizontal). */}
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-cloud md:overflow-x-auto">
        <table className={`w-full text-left text-[length:var(--text-step--1)] md:min-w-[640px] ${pedidos.length === 0 ? "hidden" : "max-md:block"}`}>
          <caption className="sr-only">Pedidos</caption>
          <thead className="border-b border-line text-[0.7rem] uppercase tracking-[0.1em] text-muted max-md:sr-only">
            <tr>
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 text-right font-medium">
                <span className="sr-only">Abrir</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line max-md:block">
            {pedidos.map((p) => {
              const unidades = p.items.reduce((t, i) => t + i.qty, 0);
              return (
                <tr
                  key={p.id}
                  className="hover:bg-bone/60 max-md:grid max-md:grid-cols-[minmax(0,1fr)_auto] max-md:items-center max-md:gap-x-4 max-md:gap-y-3 max-md:p-4"
                >
                  <td className="px-4 py-3 max-md:col-start-1 max-md:row-start-1 max-md:block max-md:p-0">
                    <Link href={`/panel/pedidos/${p.id}`} className="block">
                      <span className="block font-mono font-medium text-ink">{p.codigo}</span>
                      <span className="block text-muted">{fechaCorta(p.createdAt)}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 max-md:col-span-2 max-md:row-start-2 max-md:block max-md:p-0">
                    <span className="block font-medium text-ink max-md:text-[length:var(--text-step-0)]">{p.nombre ?? "Sin nombre"}</span>
                    <span className="block text-muted">
                      {[p.localidad, `${unidades} producto${unidades === 1 ? "" : "s"}`].filter(Boolean).join(" · ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums max-md:col-start-2 max-md:row-start-1 max-md:block max-md:p-0 max-md:font-medium max-md:text-ink">
                    <span className={`${ETQ} block`} aria-hidden="true">Total</span>
                    {formatARS(p.total)}
                    {p.hayConsultar && <span className="block text-muted">+ a consultar</span>}
                  </td>
                  <td className="px-4 py-3 max-md:col-start-1 max-md:row-start-3 max-md:block max-md:p-0">
                    <EstadoSelect tipo="pedido" id={p.id} valor={p.estado} opciones={ESTADOS_PEDIDO} etiqueta={`Estado del pedido ${p.codigo}`} />
                  </td>
                  <td className="px-4 py-3 text-right max-md:col-start-2 max-md:row-start-3 max-md:block max-md:p-0">
                    <Link
                      href={`/panel/pedidos/${p.id}`}
                      className="font-medium uppercase tracking-[0.08em] text-ink hover:text-bordeaux max-md:inline-flex max-md:min-h-11 max-md:items-center max-md:rounded-[var(--radius-pill)] max-md:border max-md:border-ink/20 max-md:px-5"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {pedidos.length === 0 && (
          <p className="px-4 py-12 text-center text-muted">
            {q || estado ? "No hay pedidos con esos filtros." : "Todavía no entró ningún pedido desde el carrito del sitio."}
          </p>
        )}
      </div>
      <Paginacion pagina={pagina} total={totalPaginas} href={hrefPagina} />
    </div>
  );
}
