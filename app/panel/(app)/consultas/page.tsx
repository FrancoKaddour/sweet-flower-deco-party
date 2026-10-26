import type { Metadata } from "next";
import { PageHeader } from "@/components/panel/PageHeader";
import { PanelButton } from "@/components/panel/PanelButton";
import { SinBase } from "@/components/panel/SinBase";
import { inputCls } from "@/components/panel/catalogo/campos";
import { EstadoSelect } from "@/components/panel/ventas/EstadoSelect";
import { FiltroEstados } from "@/components/panel/ventas/FiltroEstados";
import { Seguimiento } from "@/components/panel/ventas/Seguimiento";
import { Archivar } from "@/components/panel/ventas/Archivar";
import { Paginacion } from "@/components/ui/Paginacion";
import { hasDb } from "@/db";
import { requireStaff } from "@/lib/dal";
import { fechaCorta, linkWhatsApp } from "@/lib/panel/formato";
import { conteos, listarConsultas } from "@/modules/ventas/admin";
import { ESTADOS_CONSULTA, telefonoWhatsApp, type EstadoConsulta } from "@/modules/ventas/estados";

export const metadata: Metadata = { title: "Consultas" };

const POR_PAGINA = 20;

export default async function ConsultasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string; pagina?: string }>;
}) {
  const user = await requireStaff();
  const sp = await searchParams;
  const header = (
    <PageHeader
      seccion="Consultas"
      titulo="Consultas"
      descripcion="Lo que la gente escribe en el formulario de contacto. También les llega por WhatsApp; acá queda el registro para no perder ninguna."
    />
  );
  if (!hasDb()) return <div className="flex flex-col gap-8">{header}<SinBase /></div>;

  const estado = ESTADOS_CONSULTA.find((e) => e.v === sp.estado)?.v as EstadoConsulta | undefined;
  const q = sp.q?.slice(0, 80);
  const [todas, c] = await Promise.all([listarConsultas({ q, estado }), conteos()]);
  const totalPaginas = Math.max(1, Math.ceil(todas.length / POR_PAGINA));
  const pagina = Math.min(Math.max(1, Number(sp.pagina) || 1), totalPaginas);
  const consultas = todas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  const hrefPagina = (n: number) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (estado) p.set("estado", estado);
    if (n > 1) p.set("pagina", String(n));
    const s = p.toString();
    return `/panel/consultas${s ? `?${s}` : ""}`;
  };
  const esAdmin = user.role === "admin" || user.role === "superadmin";

  return (
    <div className="flex flex-col gap-8">
      {header}
      <FiltroEstados base="/panel/consultas" activo={estado} opciones={ESTADOS_CONSULTA} conteos={c.consultas} extra={{ q }} />
      <form className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]" role="search">
        {estado && <input type="hidden" name="estado" value={estado} />}
        <input name="q" defaultValue={q} placeholder="Buscar por nombre, email o texto…" className={inputCls} aria-label="Buscar" />
        <PanelButton type="submit" variant="outline">
          Buscar
        </PanelButton>
      </form>

      {consultas.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-line bg-cloud px-4 py-12 text-center text-muted">
          {q || estado ? "No hay consultas con esos filtros." : "Todavía no entró ninguna consulta desde el formulario."}
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {consultas.map((k) => {
            const wa = telefonoWhatsApp(k.telefono);
            return (
              <li key={k.id} className="rounded-[var(--radius-lg)] border border-line bg-cloud p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                  <div className="min-w-0 flex-1 basis-56">
                    <p className="text-[0.7rem] uppercase tracking-[0.14em] text-champagne">
                      {k.tipo} · {fechaCorta(k.createdAt)}
                    </p>
                    <p className="mt-1 font-display text-[length:var(--text-step-1)] font-bold text-ink">{k.nombre}</p>
                    <p className="break-words text-[length:var(--text-step--1)] text-muted">
                      {[k.email, k.telefono].filter(Boolean).join(" · ") || "Sin datos de contacto (escribió por WhatsApp)"}
                    </p>
                  </div>
                  <EstadoSelect tipo="consulta" id={k.id} valor={k.estado} opciones={ESTADOS_CONSULTA} etiqueta={`Estado de la consulta de ${k.nombre}`} />
                </div>
                <p className="mt-4 max-w-[70ch] whitespace-pre-line break-words text-ink">{k.mensaje}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {wa && (
                    <PanelButton href={linkWhatsApp(wa, `¡Hola ${k.nombre.split(" ")[0]}! Te escribo de Sweet Flowers por tu consulta.`)} target="_blank">
                      WhatsApp
                    </PanelButton>
                  )}
                  {k.email && (
                    <PanelButton href={`mailto:${k.email}?subject=${encodeURIComponent("Tu consulta a Sweet Flowers")}`} variant="outline">
                      Email
                    </PanelButton>
                  )}
                  {esAdmin && <Archivar tipo="consulta" id={k.id} />}
                </div>
                <details className="group mt-5 border-t border-line pt-2">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-muted hover:text-ink [&::-webkit-details-marker]:hidden">
                    <span className="group-open:hidden">+ Nota interna{k.notaInterna ? " (tiene)" : ""}</span>
                    <span className="hidden group-open:inline">− Nota interna</span>
                  </summary>
                  <div className="mt-4">
                    <Seguimiento tipo="consulta" id={k.id} telefono={k.telefono} nota={k.notaInterna} />
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
      <Paginacion pagina={pagina} total={totalPaginas} href={hrefPagina} />
    </div>
  );
}
