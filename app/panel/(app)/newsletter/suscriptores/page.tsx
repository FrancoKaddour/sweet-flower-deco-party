import type { Metadata } from "next";
import { PageHeader } from "@/components/panel/PageHeader";
import { PanelButton } from "@/components/panel/PanelButton";
import { Badge } from "@/components/panel/Badge";
import { SinBase } from "@/components/panel/SinBase";
import { inputCls } from "@/components/panel/catalogo/campos";
import { AvisoEnvio, TabsNewsletter } from "@/components/panel/newsletter/Comunes";
import { AltaSuscriptor, CodigoUsado, EstadoSuscriptor } from "@/components/panel/newsletter/Suscriptor";
import { Paginacion } from "@/components/ui/Paginacion";
import { hasDb } from "@/db";
import { requireStaff } from "@/lib/dal";
import { fechaCorta } from "@/lib/panel/formato";
import { paginarSuscriptores, type FiltroSuscriptores } from "@/modules/newsletter/admin";
import { INTERESES } from "@/content/newsletter";
import { puede } from "@/modules/ventas/estados";

export const metadata: Metadata = { title: "Suscriptores" };

const FILTROS: { v: NonNullable<FiltroSuscriptores["estado"]>; l: string }[] = [
  { v: "activo", l: "Activos (confirmaron)" },
  { v: "sin-confirmar", l: "Sin confirmar el mail" },
  { v: "sin-usar", l: "No usaron su código" },
  { v: "usados", l: "Usaron su código" },
  { v: "baja", l: "Bajas" },
];
const POR_PAGINA = 30;

/** Rótulo de celda que sólo se ve en la vista de tarjetas (< md). */
const ETQ = "text-[0.7rem] uppercase tracking-[0.12em] text-muted md:hidden";

export default async function SuscriptoresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string; pagina?: string }>;
}) {
  const user = await requireStaff();
  const sp = await searchParams;
  const header = (
    <PageHeader
      seccion="Newsletter"
      titulo="Suscriptores"
      descripcion="Cuando alguien te pase su código por WhatsApp, buscalo acá y marcalo como usado: así sabés quién compró gracias al club. Quien no confirmó desde el mail no recibe campañas."
      accion={
        // eslint-disable-next-line @next/next/no-html-link-for-pages -- descarga de archivo
        <a
          href="/api/panel/newsletter/export"
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-pill)] border border-ink px-5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-ink hover:bg-ink hover:text-bone"
        >
          Descargar CSV
        </a>
      }
    />
  );
  if (!hasDb()) return <div className="flex flex-col gap-8">{header}<SinBase /></div>;

  const estado = FILTROS.find((f) => f.v === sp.estado)?.v;
  const q = sp.q?.slice(0, 80);
  const { filas, total, pagina, paginas: totalPaginas } = await paginarSuscriptores({ q, estado, pagina: Number(sp.pagina) || 1, porPagina: POR_PAGINA });
  const hrefPagina = (n: number) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (estado) p.set("estado", estado);
    if (n > 1) p.set("pagina", String(n));
    const s = p.toString();
    return `/panel/newsletter/suscriptores${s ? `?${s}` : ""}`;
  };
  const esAdmin = puede(user.role, "suscriptorBaja");

  return (
    <div className="flex flex-col gap-8">
      {header}
      <AvisoEnvio />
      <TabsNewsletter activa="suscriptores" />

      <form className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 md:grid-cols-[1fr_auto_auto]" role="search">
        <input name="q" type="search" enterKeyHint="search" autoCorrect="off" defaultValue={q} placeholder="Buscar por email, nombre o código (CLUB-…)" className={`${inputCls} col-span-2 md:col-span-1`} aria-label="Buscar" />
        <select name="estado" defaultValue={estado ?? ""} className={inputCls} aria-label="Filtro">
          <option value="">Todos</option>
          {FILTROS.map((f) => (
            <option key={f.v} value={f.v}>{f.l}</option>
          ))}
        </select>
        <PanelButton type="submit" variant="outline">Filtrar</PanelButton>
      </form>

      <p className="text-[length:var(--text-step--1)] text-muted">
        {total} persona{total === 1 ? "" : "s"}
        {totalPaginas > 1 && ` · página ${pagina} de ${totalPaginas}`}
      </p>

      {/* Tabla en md+; en celular cada persona es una tarjeta (sin scroll horizontal). */}
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-cloud md:overflow-x-auto">
        <table className={`w-full text-left text-[length:var(--text-step--1)] md:min-w-[640px] ${filas.length === 0 ? "hidden" : "max-md:block"}`}>
          <caption className="sr-only">Suscriptores del newsletter</caption>
          <thead className="border-b border-line text-[0.7rem] uppercase tracking-[0.1em] text-muted max-md:sr-only">
            <tr>
              <th className="px-4 py-3 font-medium">Persona</th>
              <th className="px-4 py-3 font-medium md:max-xl:hidden">Intereses</th>
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 text-center font-medium">Usado</th>
              <th className="px-4 py-3 font-medium">Alta</th>
              <th className="px-4 py-3 text-right font-medium"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line max-md:block">
            {filas.map((s) => (
              <tr
                key={s.id}
                className="hover:bg-bone/60 max-md:grid max-md:grid-cols-[minmax(0,1fr)_auto] max-md:items-center max-md:gap-x-4 max-md:gap-y-3 max-md:p-4"
              >
                <td className="px-4 py-3 max-md:col-span-2 max-md:block max-md:p-0">
                  <span className="block font-medium text-ink max-md:text-[length:var(--text-step-0)]">{s.nombre ?? "—"}</span>
                  <span className="block break-all text-muted">{s.email}</span>
                  {/* md–xl: la columna Intereses se oculta para que la tabla entre sin scroll; va acá. */}
                  {s.intereses.length > 0 && (
                    <span className="hidden text-muted md:max-xl:block">
                      {s.intereses.map((i) => INTERESES.find((x) => x.v === i)?.l ?? i).join(", ")}
                    </span>
                  )}
                  {(s.estado === "baja" || s.userId || !s.confirmadoAt) && (
                    <span className="mt-1.5 flex flex-wrap gap-1.5">
                      {s.estado === "baja" && <Badge variant="danger">Baja</Badge>}
                      {s.estado !== "baja" && !s.confirmadoAt && <Badge variant="warning">Sin confirmar</Badge>}
                      {s.userId && <Badge variant="info">Tiene cuenta</Badge>}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted max-md:col-span-2 max-md:row-start-3 max-md:block max-md:p-0 md:max-xl:hidden">
                  <span className={`${ETQ} block`} aria-hidden="true">Intereses</span>
                  {s.intereses.length ? s.intereses.map((i) => INTERESES.find((x) => x.v === i)?.l ?? i).join(", ") : "—"}
                </td>
                <td className="px-4 py-3 font-mono text-ink max-md:col-start-1 max-md:row-start-2 max-md:block max-md:p-0 max-md:text-[length:var(--text-step-0)]">
                  <span className={`${ETQ} block font-sans`} aria-hidden="true">Código</span>
                  {s.codigo}
                </td>
                <td className="px-4 py-3 text-center max-md:col-start-2 max-md:row-start-2 max-md:flex max-md:min-h-11 max-md:items-center max-md:gap-3 max-md:rounded-[var(--radius-md)] max-md:bg-bone/70 max-md:p-0 max-md:px-3">
                  <span className={ETQ} aria-hidden="true">Usado</span>
                  <CodigoUsado id={s.id} usado={Boolean(s.codigoUsadoAt)} codigo={s.codigo} />
                </td>
                <td className="px-4 py-3 text-muted max-md:col-start-1 max-md:row-start-4 max-md:block max-md:p-0">
                  <span className={`${ETQ} block`} aria-hidden="true">Alta</span>
                  {fechaCorta(s.createdAt)}
                  <span className="block text-[0.7rem] uppercase tracking-[0.1em]">{s.origen}</span>
                </td>
                <td className="px-4 py-3 text-right max-md:col-start-2 max-md:row-start-4 max-md:block max-md:p-0 max-md:empty:hidden">{esAdmin && <EstadoSuscriptor id={s.id} activo={s.estado === "activo"} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filas.length === 0 && (
          <p className="px-4 py-12 text-center text-muted">
            {q || estado ? "No hay nadie con esos filtros." : "Todavía no se sumó nadie. El formulario ya está en todas las páginas del sitio."}
          </p>
        )}
      </div>
      <Paginacion pagina={pagina} total={totalPaginas} href={hrefPagina} />

      <AltaSuscriptor />
    </div>
  );
}
