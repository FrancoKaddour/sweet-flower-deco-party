import type { Metadata } from "next";
import { PageHeader } from "@/components/panel/PageHeader";
import { PanelButton } from "@/components/panel/PanelButton";
import { PanelReveal } from "@/components/panel/PanelReveal";
import { SinBase } from "@/components/panel/SinBase";
import { inputCls } from "@/components/panel/catalogo/campos";
import { EstadoSelect } from "@/components/panel/ventas/EstadoSelect";
import { FiltroEstados } from "@/components/panel/ventas/FiltroEstados";
import { Seguimiento } from "@/components/panel/ventas/Seguimiento";
import { Archivar } from "@/components/panel/ventas/Archivar";
import { hasDb } from "@/db";
import { requireStaff } from "@/lib/dal";
import { fechaCorta, linkWhatsApp } from "@/lib/panel/formato";
import { formatARS } from "@/modules/catalog/types";
import { conteos, listarInscripciones } from "@/modules/ventas/admin";
import { ESTADOS_INSCRIPCION, telefonoWhatsApp, type EstadoInscripcion } from "@/modules/ventas/estados";
import { EDICION_LABEL, EVENT_CUPO, EVENT_WHEN, PASES, preventaVigente } from "@/content/evento";

export const metadata: Metadata = { title: "Event Summit" };

const CONFIRMADOS = new Set(["seno", "pago", "asistio"]);

export default async function SummitPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string; pase?: string }>;
}) {
  const user = await requireStaff();
  const sp = await searchParams;
  const pv = preventaVigente();
  const header = (
    <PageHeader
      seccion="Event Summit"
      titulo={`Summit · ${EDICION_LABEL}`}
      descripcion={`${EVENT_WHEN}. Cada reserva del formulario del sitio queda acá con su código (ej. SUM-4HXQ2), para seguirla hasta el pago.`}
      accion={<PanelButton href="/event-summit" target="_blank" variant="outline">Ver la página ↗</PanelButton>}
    />
  );
  if (!hasDb()) return <div className="flex flex-col gap-8">{header}<SinBase /></div>;

  const estado = ESTADOS_INSCRIPCION.find((e) => e.v === sp.estado)?.v as EstadoInscripcion | undefined;
  const pase = PASES.find((p) => p.id === sp.pase)?.id;
  const q = sp.q?.slice(0, 80);
  const [lista, c] = await Promise.all([listarInscripciones({ q, estado, pase }), conteos()]);

  const confirmados = (paseId?: string) =>
    c.inscripcionesDetalle.filter((r) => CONFIRMADOS.has(r.estado) && (!paseId || r.pase === paseId)).reduce((t, r) => t + r.n, 0);
  const interesados = c.inscripcionesDetalle.filter((r) => r.estado === "consulto").reduce((t, r) => t + r.n, 0);
  const ocupados = confirmados();
  const esAdmin = user.role === "admin" || user.role === "superadmin";

  return (
    <div className="flex flex-col gap-10">
      {header}

      <PanelReveal as="section" className="overflow-hidden rounded-[var(--radius-lg)] bg-botanical text-bone">
        <div className="flex flex-col gap-8 px-7 py-9 md:px-12 md:py-12">
          <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-champagne">
            ✧ {pv ? `${pv.nombre} · ${pv.hastaLabel}` : "Preventas cerradas"}
          </p>
          <dl className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
            {[
              { l: "Lugares confirmados", v: `${ocupados}/${EVENT_CUPO}`, a: "Señaron, pagaron o asistieron." },
              ...PASES.map((p) => ({ l: `Pase ${p.nombre}`, v: String(confirmados(p.id)), a: "Confirmados." })),
              { l: "Por cerrar", v: String(interesados), a: "Consultaron y falta la seña." },
            ].map((m) => (
              <div key={m.l} className="flex flex-col gap-2">
                <dt className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-bone/60">{m.l}</dt>
                <dd className="font-display text-[length:var(--text-step-5)] font-extrabold leading-[0.85] tabular-nums text-bone">{m.v}</dd>
                <p className="text-[length:var(--text-step--1)] text-bone/55">{m.a}</p>
              </div>
            ))}
          </dl>
          <div className="h-2 overflow-hidden rounded-full bg-bone/15" role="img" aria-label={`${ocupados} de ${EVENT_CUPO} lugares confirmados`}>
            <div className="h-full rounded-full bg-champagne" style={{ width: `${Math.min(100, (ocupados / EVENT_CUPO) * 100)}%` }} />
          </div>
        </div>
      </PanelReveal>

      <FiltroEstados base="/panel/summit" activo={estado} opciones={ESTADOS_INSCRIPCION} conteos={c.inscripciones} extra={{ q, pase }} />
      <form className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]" role="search">
        {estado && <input type="hidden" name="estado" value={estado} />}
        <input name="q" defaultValue={q} placeholder="Buscar por código, nombre o ciudad…" className={inputCls} aria-label="Buscar" />
        <select name="pase" defaultValue={pase ?? ""} className={inputCls} aria-label="Pase">
          <option value="">Todos los pases</option>
          {PASES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
        <PanelButton type="submit" variant="outline">
          Filtrar
        </PanelButton>
      </form>

      {lista.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-line bg-cloud px-4 py-12 text-center text-muted">
          {q || estado || pase ? "No hay reservas con esos filtros." : "Todavía no entró ninguna reserva desde el sitio."}
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-cloud">
          {lista.map((r) => {
            const wa = telefonoWhatsApp(r.telefono);
            const nombrePase = PASES.find((p) => p.id === r.pase)?.nombre ?? r.pase;
            return (
              <li key={r.id} className="p-5">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <div className="min-w-[10rem] flex-1">
                    <p className="font-medium text-ink">{r.nombre}</p>
                    <p className="text-[length:var(--text-step--1)] text-muted">
                      <span className="font-mono">{r.codigo}</span> · {fechaCorta(r.createdAt)}
                      {r.ciudad ? ` · ${r.ciudad}` : ""}
                    </p>
                  </div>
                  <div className="text-[length:var(--text-step--1)]">
                    <p className="font-medium uppercase tracking-[0.1em] text-ink">Pase {nombrePase}</p>
                    <p className="text-muted">
                      {r.precioReferencia != null ? formatARS(r.precioReferencia) : "Sin preventa"}
                      {r.formaPago ? ` · ${r.formaPago}` : ""}
                    </p>
                  </div>
                  <EstadoSelect tipo="inscripcion" id={r.id} valor={r.estado} opciones={ESTADOS_INSCRIPCION} etiqueta={`Estado de la reserva de ${r.nombre}`} />
                </div>
                {r.mensaje && <p className="mt-3 whitespace-pre-line text-[length:var(--text-step--1)] text-ink">“{r.mensaje}”</p>}
                <details className="group mt-3">
                  <summary className="cursor-pointer list-none text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-muted hover:text-ink">
                    <span className="group-open:hidden">+ Seguimiento{r.notaInterna ? " (tiene nota)" : ""}</span>
                    <span className="hidden group-open:inline">− Seguimiento</span>
                  </summary>
                  <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                    <Seguimiento tipo="inscripcion" id={r.id} telefono={r.telefono} nota={r.notaInterna} />
                    <div className="flex flex-wrap items-center gap-3">
                      {wa && (
                        <PanelButton href={linkWhatsApp(wa, `¡Hola ${r.nombre.split(" ")[0]}! Te escribo por tu reserva ${r.codigo} al Sweet Flowers Event Summit.`)} target="_blank">
                          WhatsApp
                        </PanelButton>
                      )}
                      {esAdmin && <Archivar tipo="inscripcion" id={r.id} />}
                    </div>
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
