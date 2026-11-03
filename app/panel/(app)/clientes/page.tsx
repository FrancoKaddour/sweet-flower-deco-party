import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/panel/PageHeader";
import { PanelButton } from "@/components/panel/PanelButton";
import { Badge } from "@/components/panel/Badge";
import { SinBase } from "@/components/panel/SinBase";
import { inputCls } from "@/components/panel/catalogo/campos";
import { Paginacion } from "@/components/ui/Paginacion";
import { hasDb } from "@/db";
import { requireStaff } from "@/lib/dal";
import { fechaCorta } from "@/lib/panel/formato";
import { paginarClientes, provinciasConClientes, type FiltroClientes } from "@/modules/clientes/admin";
import { TIPOS_CLIENTE } from "@/modules/cuenta/opciones";
import { PERMISOS } from "@/modules/ventas/estados";

export const metadata: Metadata = { title: "Clientes" };

const ESTADOS: { v: NonNullable<FiltroClientes["estado"]>; l: string }[] = [
  { v: "con-perfil", l: "Con datos cargados" },
  { v: "sin-perfil", l: "Sin datos cargados" },
  { v: "bloqueados", l: "Bloqueados" },
];
const POR_PAGINA = 30;
const ETQ = "text-[0.7rem] uppercase tracking-[0.12em] text-muted md:hidden";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tipo?: string; provincia?: string; estado?: string; pagina?: string }>;
}) {
  await requireStaff(PERMISOS.clientes.roles);
  const sp = await searchParams;
  const header = (
    <PageHeader
      seccion="Clientes"
      titulo="Clientes"
      descripcion="Las personas que se crearon una cuenta en el sitio, con los datos que cargaron en su perfil. Son datos personales: no los compartas fuera del equipo."
    />
  );
  if (!hasDb()) return <div className="flex flex-col gap-8">{header}<SinBase /></div>;

  const q = sp.q?.slice(0, 80);
  const tipo = TIPOS_CLIENTE.find((t) => t.v === sp.tipo)?.v;
  const estado = ESTADOS.find((e) => e.v === sp.estado)?.v;
  const provincias = await provinciasConClientes();
  const provincia = provincias.includes(sp.provincia ?? "") ? sp.provincia : undefined;
  const { filas, total, pagina, paginas } = await paginarClientes({ q, tipo, provincia, estado, pagina: Number(sp.pagina) || 1, porPagina: POR_PAGINA });
  const hrefPagina = (n: number) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (tipo) p.set("tipo", tipo);
    if (provincia) p.set("provincia", provincia);
    if (estado) p.set("estado", estado);
    if (n > 1) p.set("pagina", String(n));
    const s = p.toString();
    return `/panel/clientes${s ? `?${s}` : ""}`;
  };

  return (
    <div className="flex flex-col gap-8">
      {header}

      <form className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_auto_auto_auto_auto]" role="search">
        <input
          name="q"
          type="search"
          enterKeyHint="search"
          autoCorrect="off"
          defaultValue={q}
          placeholder="Buscar por nombre, mail, celular, Instagram o localidad"
          className={`${inputCls} col-span-2 md:col-span-1`}
          aria-label="Buscar"
        />
        <select name="tipo" defaultValue={tipo ?? ""} className={inputCls} aria-label="Tipo de cliente">
          <option value="">Todos los tipos</option>
          {TIPOS_CLIENTE.map((t) => (
            <option key={t.v} value={t.v}>{t.l}</option>
          ))}
        </select>
        <select name="provincia" defaultValue={provincia ?? ""} className={inputCls} aria-label="Provincia">
          <option value="">Todas las provincias</option>
          {provincias.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select name="estado" defaultValue={estado ?? ""} className={inputCls} aria-label="Estado">
          <option value="">Todos</option>
          {ESTADOS.map((e) => (
            <option key={e.v} value={e.v}>{e.l}</option>
          ))}
        </select>
        <PanelButton type="submit" variant="outline">Filtrar</PanelButton>
      </form>

      <p className="text-[length:var(--text-step--1)] text-muted">
        {total} cliente{total === 1 ? "" : "s"}
        {paginas > 1 && ` · página ${pagina} de ${paginas}`}
      </p>

      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-cloud md:overflow-x-auto">
        <table className={`w-full text-left text-[length:var(--text-step--1)] md:min-w-[720px] ${filas.length === 0 ? "hidden" : "max-md:block"}`}>
          <caption className="sr-only">Clientes</caption>
          <thead className="border-b border-line text-[0.7rem] uppercase tracking-[0.1em] text-muted max-md:sr-only">
            <tr>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Zona</th>
              <th className="px-4 py-3 text-center font-medium">Pedidos</th>
              <th className="px-4 py-3 text-center font-medium">Summit</th>
              <th className="px-4 py-3 font-medium">Alta</th>
              <th className="px-4 py-3 text-right font-medium"><span className="sr-only">Abrir</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line max-md:block">
            {filas.map((c) => {
              const nombre = [c.nombre, c.apellido].filter(Boolean).join(" ") || c.name || "Sin nombre";
              return (
                <tr key={c.id} className="hover:bg-bone/60 max-md:grid max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-3 max-md:p-4">
                  <td className="px-4 py-3 max-md:col-span-2 max-md:block max-md:p-0">
                    <Link href={`/panel/clientes/${c.id}`} className="block font-medium text-ink hover:underline max-md:text-[length:var(--text-step-0)]">
                      {nombre}
                    </Link>
                    <span className="block break-all text-muted">{c.email}</span>
                    {c.telefono && <span className="block text-muted">{c.telefono}</span>}
                    {(c.bloqueadoAt || !c.tienePerfil) && (
                      <span className="mt-1.5 flex flex-wrap gap-1.5">
                        {c.bloqueadoAt && <Badge variant="danger">Bloqueado</Badge>}
                        {!c.tienePerfil && <Badge variant="warning">Sin datos</Badge>}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted max-md:block max-md:p-0">
                    <span className={`${ETQ} block`} aria-hidden="true">Tipo</span>
                    {TIPOS_CLIENTE.find((t) => t.v === c.tipoCliente)?.l ?? "—"}
                    {c.emprendimiento && <span className="block">{c.emprendimiento}</span>}
                  </td>
                  <td className="px-4 py-3 text-muted max-md:block max-md:p-0">
                    <span className={`${ETQ} block`} aria-hidden="true">Zona</span>
                    {[c.localidad, c.provincia].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-center tabular-nums max-md:block max-md:p-0 max-md:text-left">
                    <span className={`${ETQ} block`} aria-hidden="true">Pedidos</span>
                    {c.pedidos}
                  </td>
                  <td className="px-4 py-3 text-center tabular-nums max-md:block max-md:p-0 max-md:text-left">
                    <span className={`${ETQ} block`} aria-hidden="true">Summit</span>
                    {c.inscripciones}
                  </td>
                  <td className="px-4 py-3 text-muted max-md:block max-md:p-0">
                    <span className={`${ETQ} block`} aria-hidden="true">Alta</span>
                    {fechaCorta(c.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right max-md:col-span-2 max-md:p-0">
                    <PanelButton href={`/panel/clientes/${c.id}`} variant="outline">Ver ficha</PanelButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filas.length === 0 && (
          <p className="px-4 py-12 text-center text-muted">
            {q || tipo || provincia || estado ? "No hay clientes con esos filtros." : "Todavía no se registró ningún cliente."}
          </p>
        )}
      </div>
      <Paginacion pagina={pagina} total={paginas} href={hrefPagina} />
    </div>
  );
}
