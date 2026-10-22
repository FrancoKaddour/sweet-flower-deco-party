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
import { listarSuscriptores, type FiltroSuscriptores } from "@/modules/newsletter/admin";
import { INTERESES } from "@/content/newsletter";

export const metadata: Metadata = { title: "Suscriptores" };

const FILTROS: { v: NonNullable<FiltroSuscriptores["estado"]>; l: string }[] = [
  { v: "activo", l: "Activos" },
  { v: "sin-usar", l: "No usaron su código" },
  { v: "usados", l: "Usaron su código" },
  { v: "baja", l: "Bajas" },
];
const POR_PAGINA = 30;

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
      descripcion="Cuando alguien te pase su código por WhatsApp, buscalo acá y marcalo como usado: así sabés quién compró gracias al club."
      accion={
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
  const todos = await listarSuscriptores({ q, estado });
  const totalPaginas = Math.max(1, Math.ceil(todos.length / POR_PAGINA));
  const pagina = Math.min(Math.max(1, Number(sp.pagina) || 1), totalPaginas);
  const filas = todos.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  const hrefPagina = (n: number) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (estado) p.set("estado", estado);
    if (n > 1) p.set("pagina", String(n));
    const s = p.toString();
    return `/panel/newsletter/suscriptores${s ? `?${s}` : ""}`;
  };
  const esAdmin = user.role === "admin" || user.role === "superadmin";

  return (
    <div className="flex flex-col gap-8">
      {header}
      <AvisoEnvio />
      <TabsNewsletter activa="suscriptores" />

      <form className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]" role="search">
        <input name="q" defaultValue={q} placeholder="Buscar por email, nombre o código (CLUB-…)" className={inputCls} aria-label="Buscar" />
        <select name="estado" defaultValue={estado ?? ""} className={inputCls} aria-label="Filtro">
          <option value="">Todos</option>
          {FILTROS.map((f) => (
            <option key={f.v} value={f.v}>{f.l}</option>
          ))}
        </select>
        <PanelButton type="submit" variant="outline">Filtrar</PanelButton>
      </form>

      <p className="text-[length:var(--text-step--1)] text-muted">
        {todos.length} persona{todos.length === 1 ? "" : "s"}
        {totalPaginas > 1 && ` · página ${pagina} de ${totalPaginas}`}
      </p>

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-cloud">
        <table className="w-full min-w-[760px] text-left text-[length:var(--text-step--1)]">
          <caption className="sr-only">Suscriptores del newsletter</caption>
          <thead className="border-b border-line text-[0.7rem] uppercase tracking-[0.1em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Persona</th>
              <th className="px-4 py-3 font-medium">Intereses</th>
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 text-center font-medium">Usado</th>
              <th className="px-4 py-3 font-medium">Alta</th>
              <th className="px-4 py-3 text-right font-medium"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filas.map((s) => (
              <tr key={s.id} className="hover:bg-bone/60">
                <td className="px-4 py-3">
                  <span className="block font-medium text-ink">{s.nombre ?? "—"}</span>
                  <span className="block text-muted">{s.email}</span>
                  {s.estado === "baja" && <Badge variant="danger">Baja</Badge>}
                  {s.userId && <Badge variant="info">Tiene cuenta</Badge>}
                </td>
                <td className="px-4 py-3 text-muted">
                  {s.intereses.length ? s.intereses.map((i) => INTERESES.find((x) => x.v === i)?.l ?? i).join(", ") : "—"}
                </td>
                <td className="px-4 py-3 font-mono text-ink">{s.codigo}</td>
                <td className="px-4 py-3 text-center">
                  <CodigoUsado id={s.id} usado={Boolean(s.codigoUsadoAt)} codigo={s.codigo} />
                </td>
                <td className="px-4 py-3 text-muted">
                  {fechaCorta(s.createdAt)}
                  <span className="block text-[0.7rem] uppercase tracking-[0.1em]">{s.origen}</span>
                </td>
                <td className="px-4 py-3 text-right">{esAdmin && <EstadoSuscriptor id={s.id} activo={s.estado === "activo"} />}</td>
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
