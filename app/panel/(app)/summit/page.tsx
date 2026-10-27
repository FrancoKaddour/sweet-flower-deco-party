import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/panel/PageHeader";
import { PanelButton } from "@/components/panel/PanelButton";
import { PanelReveal } from "@/components/panel/PanelReveal";
import { SinBase } from "@/components/panel/SinBase";
import { inputCls } from "@/components/panel/catalogo/campos";
import { EstadoSelect } from "@/components/panel/ventas/EstadoSelect";
import { FiltroEstados } from "@/components/panel/ventas/FiltroEstados";
import { Seguimiento } from "@/components/panel/ventas/Seguimiento";
import { Archivar, Restaurar } from "@/components/panel/ventas/Archivar";
import { ReenviarEntrada } from "@/components/panel/summit/BotonesInscripcion";
import { Paginacion } from "@/components/ui/Paginacion";
import { Badge } from "@/components/panel/Badge";
import { hasDb } from "@/db";
import { requireStaff } from "@/lib/dal";
import { enmascararDni } from "@/lib/reglas";
import { fechaCorta, linkWhatsApp } from "@/lib/panel/formato";
import { modoPrueba, pagosHabilitados } from "@/lib/mercadopago";
import { formatARS } from "@/modules/catalog/types";
import { FILTROS_PAGO, conteos, edicionesInscripciones, listarInscripciones, resumenSummit, type FiltroPago } from "@/modules/ventas/admin";
import { ESTADOS_INSCRIPCION, puede, telefonoWhatsApp, type EstadoInscripcion } from "@/modules/ventas/estados";
import { EDICION_LABEL, EVENT_CUPO, EVENT_WHEN, PASES, tarifaVigente } from "@/content/evento";

export const metadata: Metadata = { title: "Event Summit" };

/** Estado del pago en Mercado Pago (lo actualiza solo el aviso de MP). */
const PAGO: Record<string, { l: string; v: "neutral" | "success" | "warning" | "danger" | "info" }> = {
  pendiente: { l: "MP: sin pagar", v: "neutral" },
  en_proceso: { l: "MP: en proceso", v: "warning" },
  aprobado: { l: "MP: pagado", v: "success" },
  rechazado: { l: "MP: rechazado", v: "danger" },
  devuelto: { l: "MP: devuelto", v: "danger" },
  sobrecupo: { l: "Sobrecupo: devolver o aceptar", v: "danger" },
  monto_invalido: { l: "Monto no coincide", v: "danger" },
};

export default async function SummitPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string; pase?: string; pago?: string; edicion?: string; archivados?: string; pagina?: string }>;
}) {
  const user = await requireStaff();
  const sp = await searchParams;
  const pv = tarifaVigente();
  const header = (
    <PageHeader
      seccion="Event Summit"
      titulo={`Summit · ${EDICION_LABEL}`}
      descripcion={`${EVENT_WHEN}. Las inscripciones se pagan online con Mercado Pago: cuando el pago se aprueba pasan solas a "Pagó" y la persona recibe su entrada por mail.`}
      accion={
        <div className="flex flex-wrap gap-3">
          <PanelButton href="/panel/summit/check-in">Acreditar (check-in)</PanelButton>
          <PanelButton href="/event-summit" target="_blank" variant="outline">
            Ver la página ↗
          </PanelButton>
        </div>
      }
    />
  );
  if (!hasDb()) return <div className="flex flex-col gap-8">{header}<SinBase /></div>;

  const ediciones = await edicionesInscripciones();
  const edicion = ediciones.find((e) => e === sp.edicion) ?? EDICION_LABEL;
  const estado = ESTADOS_INSCRIPCION.find((e) => e.v === sp.estado)?.v as EstadoInscripcion | undefined;
  const pase = PASES.find((p) => p.id === sp.pase)?.id;
  const pago = FILTROS_PAGO.find((f) => f.v === sp.pago)?.v as FiltroPago | undefined;
  const archivados = sp.archivados === "1";
  const q = sp.q?.slice(0, 80);
  const [lista, c, s] = await Promise.all([
    listarInscripciones({ q, estado, pase, pago, edicion, archivados, pagina: Number(sp.pagina) || 1 }),
    conteos(edicion),
    resumenSummit(edicion),
  ]);
  const esAdmin = puede(user.role, "archivar");
  const verDni = puede(user.role, "dniCompleto");
  const pctCupo = Math.round((s.ocupados / EVENT_CUPO) * 100);
  const extra = { q, pase, edicion: edicion === EDICION_LABEL ? undefined : edicion };
  const href = (cambios: Record<string, string | undefined>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...extra, estado, pago, archivados: archivados ? "1" : undefined, ...cambios })) if (v) u.set(k, v);
    const t = u.toString();
    return `/panel/summit${t ? `?${t}` : ""}`;
  };

  return (
    <div className="flex flex-col gap-10">
      {header}

      {/* D-21 / P-09: vino #7A1218 (no el rojo logo) y textos chicos en bone pleno. */}
      <PanelReveal as="section" className="overflow-hidden rounded-[var(--radius-lg)] bg-bordeaux text-bone">
        <div className="flex flex-col gap-8 px-7 py-9 md:px-12 md:py-12">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[length:var(--text-step--1)] text-bone">
              <span className="text-champagne">✧</span> Precio de hoy: {pv.nombre} · VIP {formatARS(pv.precios.vip)} · General {formatARS(pv.precios.general)}
            </p>
            {pagosHabilitados() && modoPrueba() && (
              <span className="rounded-[var(--radius-pill)] bg-champagne px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-ink">Modo prueba</span>
            )}
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 xl:grid-cols-4">
            {[
              { l: "Recaudado", v: formatARS(s.recaudado), a: "Pagos aprobados en Mercado Pago." },
              { l: "Lugares libres", v: String(s.libres), a: `${s.ocupados} de ${EVENT_CUPO} ocupados (incluye pagos en curso).` },
              ...PASES.map((p) => ({ l: p.nombre, v: String(s.pases[p.id] ?? 0), a: "Inscriptos confirmados." })),
              { l: "Pendientes en MP", v: String(s.pendientesMP), a: "Pagando ahora o en proceso." },
            ].map((m) => (
              <div key={m.l} className="@container flex min-w-0 flex-col gap-2">
                <dt className="text-[length:var(--text-step--1)] text-bone">{m.l}</dt>
                <dd className="text-[length:min(var(--text-step-5),24cqi)] font-semibold leading-[0.9] tabular-nums text-bone [font-family:var(--font-logo)] [font-variant-numeric:lining-nums]">
                  {m.v}
                </dd>
                <p className="text-[length:var(--text-step--1)] text-bone/85">{m.a}</p>
              </div>
            ))}
          </dl>
          <div>
            <div className="h-2 overflow-hidden rounded-full bg-bone/20" role="img" aria-label={`${s.ocupados} de ${EVENT_CUPO} lugares ocupados (${pctCupo}%)`}>
              <div className={`h-full rounded-full ${s.sobrecupo ? "bg-botanical" : "bg-champagne"}`} style={{ width: `${Math.min(100, pctCupo)}%` }} />
            </div>
            {s.sobrecupo > 0 && (
              <p className="mt-3 rounded-[var(--radius-sm)] bg-bone px-3 py-2 text-[length:var(--text-step--1)] font-medium text-bordeaux">
                {pctCupo}% del cupo: hay {s.sobrecupo} lugar{s.sobrecupo === 1 ? "" : "es"} de más. Revisá “Pagos con problemas”.
              </p>
            )}
          </div>
        </div>
      </PanelReveal>

      {!pagosHabilitados() && (
        <p className="rounded-[var(--radius-md)] border border-champagne/50 bg-champagne/10 px-4 py-3 text-[length:var(--text-step--1)] text-ink">
          <strong>Pago online desactivado:</strong> falta un paso técnico (las credenciales de Mercado Pago): avisale a Franco. Mientras
          tanto el formulario del sitio avisa que escriban por WhatsApp.
        </p>
      )}

      <div className="flex flex-col gap-3">
        <FiltroEstados base="/panel/summit" activo={estado} opciones={ESTADOS_INSCRIPCION} conteos={c.inscripciones} extra={extra} />
        <nav aria-label="Filtros de pago y archivo" className="flex flex-wrap gap-2">
          {FILTROS_PAGO.map((f) => (
            <Link
              key={f.v}
              href={href({ pago: pago === f.v ? undefined : f.v, pagina: undefined })}
              aria-current={pago === f.v ? "page" : undefined}
              className={`inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-pill)] border px-4 text-[length:var(--text-step--1)] font-medium transition-colors ${pago === f.v ? "border-ink bg-ink text-bone" : "border-line bg-cloud text-muted hover:text-ink"}`}
            >
              {f.l}
              {f.v === "problemas" && s.problemas > 0 && <span className="rounded-full bg-bordeaux px-2 text-[0.72rem] text-bone">{s.problemas}</span>}
            </Link>
          ))}
          {esAdmin && (
            <Link
              href={href({ archivados: archivados ? undefined : "1", pagina: undefined })}
              aria-current={archivados ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-[var(--radius-pill)] border px-4 text-[length:var(--text-step--1)] font-medium ${archivados ? "border-ink bg-ink text-bone" : "border-line bg-cloud text-muted hover:text-ink"}`}
            >
              Archivados
            </Link>
          )}
        </nav>
      </div>

      <form className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_auto_auto_auto]" role="search">
        {estado && <input type="hidden" name="estado" value={estado} />}
        {pago && <input type="hidden" name="pago" value={pago} />}
        <input name="q" type="search" enterKeyHint="search" autoCorrect="off" defaultValue={q} placeholder="Buscar por código, nombre, DNI o ciudad…" className={`${inputCls} col-span-2 md:col-span-1`} aria-label="Buscar" />
        <select name="pase" defaultValue={pase ?? ""} className={inputCls} aria-label="Pase">
          <option value="">Todos los pases</option>
          {PASES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
        <select name="edicion" defaultValue={edicion} className={inputCls} aria-label="Edición">
          {ediciones.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <PanelButton type="submit" variant="outline" className="col-span-2 md:col-span-1">
          Filtrar
        </PanelButton>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[length:var(--text-step--1)] text-muted">
          {lista.total} inscripcion{lista.total === 1 ? "" : "es"}
          {archivados ? " archivadas" : ""}
          {lista.paginas > 1 && ` · página ${lista.pagina} de ${lista.paginas}`}
        </p>
        <a
          href={`/api/panel/summit/export${edicion === EDICION_LABEL ? "" : `?edicion=${encodeURIComponent(edicion)}`}`}
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-pill)] border border-ink px-5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-ink hover:bg-ink hover:text-bone"
        >
          Descargar lista (Excel)
        </a>
      </div>

      {lista.filas.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-line bg-cloud px-4 py-12 text-center text-muted">
          {q || estado || pase || pago || archivados ? "No hay inscripciones con esos filtros." : "Todavía no entró ninguna inscripción desde el sitio."}
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-cloud">
          {lista.filas.map((r) => {
            const wa = telefonoWhatsApp(r.telefono);
            const nombrePase = PASES.find((p) => p.id === r.pase)?.nombre ?? r.pase;
            const dni = r.dni ? (verDni ? r.dni : enmascararDni(r.dni)) : null;
            const pagada = r.estado === "pago" || r.estado === "asistio";
            return (
              <li key={r.id} className="p-5">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <div className="min-w-0 flex-1 basis-60">
                    <p className="font-medium text-ink">{r.nombre}</p>
                    <p className="text-[length:var(--text-step--1)] text-muted">
                      <span className="font-mono">{r.codigo}</span> · {fechaCorta(r.createdAt)}
                      {r.ciudad ? ` · ${r.ciudad}` : ""}
                    </p>
                    <p className="break-words text-[length:var(--text-step--1)] text-muted">
                      {[r.email, r.telefono, dni ? `DNI ${dni}` : null].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="text-[length:var(--text-step--1)]">
                    <p className="font-medium uppercase tracking-[0.1em] text-ink">{nombrePase}</p>
                    <p className="text-muted">
                      {r.precioReferencia != null ? formatARS(r.precioReferencia) : "—"}
                      {r.formaPago ? ` · ${r.formaPago}` : ""}
                    </p>
                    {r.pagoEstado && <Badge variant={PAGO[r.pagoEstado]?.v ?? "neutral"}>{PAGO[r.pagoEstado]?.l ?? r.pagoEstado}</Badge>}
                  </div>
                  {archivados ? (
                    <Restaurar tipo="inscripcion" id={r.id} />
                  ) : (
                    <EstadoSelect tipo="inscripcion" id={r.id} valor={r.estado} opciones={ESTADOS_INSCRIPCION} etiqueta={`Estado de la inscripción de ${r.nombre}`} />
                  )}
                </div>
                {r.mensaje && <p className="mt-3 whitespace-pre-line text-[length:var(--text-step--1)] text-ink">“{r.mensaje}”</p>}
                {!archivados && (
                  <details className="group mt-2">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-muted hover:text-ink [&::-webkit-details-marker]:hidden">
                      <span className="group-open:hidden">+ Seguimiento{r.notaInterna ? " (tiene nota)" : ""}</span>
                      <span className="hidden group-open:inline">− Seguimiento</span>
                    </summary>
                    <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                      <Seguimiento tipo="inscripcion" id={r.id} telefono={r.telefono} nota={r.notaInterna} />
                      <div className="flex flex-wrap items-center gap-3">
                        {pagada && <ReenviarEntrada id={r.id} email={r.email} />}
                        {wa && (
                          <PanelButton href={linkWhatsApp(wa, `¡Hola ${r.nombre.split(" ")[0]}! Te escribo por tu inscripción ${r.codigo} al Sweet Flowers Event Summit.`)} target="_blank">
                            WhatsApp
                          </PanelButton>
                        )}
                        {esAdmin && !pagada && <Archivar tipo="inscripcion" id={r.id} />}
                      </div>
                    </div>
                    {esAdmin && pagada && (
                      <p className="mt-3 text-[length:var(--text-step--1)] text-muted">
                        Está paga: no se archiva. Si hay que darla de baja, devolvé el pago en Mercado Pago y pasala a Cancelado.
                      </p>
                    )}
                  </details>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <Paginacion pagina={lista.pagina} total={lista.paginas} href={(n) => href({ pagina: n > 1 ? String(n) : undefined })} />
    </div>
  );
}
