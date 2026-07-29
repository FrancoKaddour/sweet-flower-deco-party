import Link from "next/link";
import { PageHeader } from "@/components/panel/PageHeader";
import { PlugHint } from "@/components/panel/PlugHint";
import { StatCard } from "@/components/panel/StatCard";
import { PanelButton } from "@/components/panel/PanelButton";
import { PanelReveal } from "@/components/panel/PanelReveal";
import { SectionHeading } from "@/components/panel/SectionHeading";
import { ArrowLink } from "@/components/panel/ArrowLink";
import { ChipPago, ChipEnvio } from "@/components/panel/status";
import { Badge } from "@/components/panel/Badge";
import {
  getKpis,
  getAcciones,
  getMetricasClave,
  getActividad,
  getUltimasOrdenes,
} from "@/lib/panel/data";
import { formatARS } from "@/lib/panel/types";

// Inicio / Dashboard — "EL PULSO DEL NEGOCIO, HOY". El cockpit del panel: momento
// oscuro (botanical) con las 3 métricas clave en display, KPIs secundarios sobre
// superficies cálidas, últimas órdenes + requiere acción + actividad reciente.
// Server Component: lee los mocks en el server.

// Superficies cálidas rotativas para los KPIs secundarios (variedad de marca).
const SUPERFICIES = ["sage", "blush", "sand", "cloud"] as const;

export default async function InicioPage() {
  // 🔌 GONZALO: cada get*() vive en lib/panel/data.ts y hoy devuelve mock. Cuando
  // enchufes Payload, cambiás SOLO el cuerpo de esas funciones (no esta página):
  //   getMetricasClave → 3 agregaciones (ventas del mes, órdenes del mes, a despachar)
  //   getKpis          → agregaciones sobre Orders/Products/EventRegistrations/Contacts/Quotes
  //   getAcciones      → Orders pendientes + Quotes nuevas
  //   getUltimasOrdenes→ últimas Orders por fecha
  //   getActividad     → feed unificado de últimas altas
  const [metricas, kpis, acciones, ultimasOrdenes, actividad] = await Promise.all([
    getMetricasClave(),
    getKpis(),
    getAcciones(),
    getUltimasOrdenes(3),
    getActividad(),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        seccion="Cockpit"
        titulo="El pulso del negocio, hoy"
        descripcion="Ventas, órdenes, stock y comunidad de un vistazo. El centro de operaciones de Sweet Flowers."
        accion={<PanelButton href="/panel/ventas">Ver órdenes</PanelButton>}
      />

      <PlugHint coleccion="Orders · Products · EventRegistrations · Contacts · Quotes">
        Todo este dashboard son agregaciones (counts/sumas) sobre varias
        colecciones. Cada <code className="font-mono">getX()</code> en{" "}
        <code className="font-mono">lib/panel/data.ts</code> dice exactamente qué
        query lo alimenta.
      </PlugHint>

      {/* MOMENTO OSCURO — franja botanical con las 3 métricas clave en display. */}
      <section aria-labelledby="clave-heading">
        <PanelReveal
          as="section"
          className="overflow-hidden rounded-[var(--radius-lg)] bg-botanical text-bone"
        >
          <div className="flex flex-col gap-10 px-7 py-10 md:px-12 md:py-14">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-champagne">
                  ✧ Resumen del mes
                </p>
                <h2
                  id="clave-heading"
                  className="mt-3 max-w-[16ch] font-display text-[length:var(--text-step-3)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone md:text-[length:var(--text-step-4)]"
                >
                  Las tres cifras que importan
                </h2>
              </div>
              <ArrowLink href="/panel/ventas" tono="oscuro">
                Ir a ventas
              </ArrowLink>
            </div>

            <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
              {metricas.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col gap-2 border-t border-bone/15 pt-6 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:first:border-l-0 sm:first:pl-0"
                >
                  <dt className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-bone/60">
                    {m.label}
                  </dt>
                  <dd className="font-display text-[length:var(--text-step-6)] font-extrabold leading-[0.85] tracking-[-0.02em] text-bone">
                    {m.valor}
                  </dd>
                  <p className="text-[length:var(--text-step--1)] leading-relaxed text-bone/55">
                    {m.ayuda}
                  </p>
                </div>
              ))}
            </dl>
          </div>
        </PanelReveal>
      </section>

      {/* KPIs SECUNDARIOS — cards sobre superficies cálidas con glifo direccional. */}
      <section aria-labelledby="kpis-heading" className="flex flex-col gap-6">
        <SectionHeading
          id="kpis-heading"
          eyebrow="Indicadores"
          titulo="El resto del tablero"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {kpis.map((kpi, i) => (
            <PanelReveal key={kpi.id} index={i}>
              <StatCard
                label={kpi.label}
                valor={kpi.valor}
                delta={kpi.delta}
                tendencia={kpi.tendencia}
                ayuda={kpi.ayuda}
                superficie={SUPERFICIES[i % SUPERFICIES.length]}
              />
            </PanelReveal>
          ))}
        </div>
      </section>

      {/* Dos columnas: Últimas órdenes + Requiere acción. */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Últimas órdenes — mini-lista editorial. */}
        <section aria-labelledby="ordenes-heading" className="flex flex-col gap-6">
          <SectionHeading
            id="ordenes-heading"
            eyebrow="Ventas"
            titulo="Últimas órdenes"
            verTodoLabel="Ver todas"
            verTodoHref="/panel/ventas"
          />
          <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-md)] border border-line bg-cloud">
            {ultimasOrdenes.map((o, i) => (
              <PanelReveal as="li" key={o.id} index={i}>
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0">
                    <p className="font-display text-[length:var(--text-step-0)] font-bold text-ink">
                      #{o.id}
                    </p>
                    <p className="truncate text-[length:var(--text-step--1)] text-muted">
                      {o.comprador}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <ChipPago estado={o.estadoPago} />
                    <ChipEnvio estado={o.estadoEnvio} />
                  </div>
                  <p className="hidden shrink-0 text-right font-medium text-ink sm:block">
                    {formatARS(o.total)}
                  </p>
                </div>
              </PanelReveal>
            ))}
          </ul>
        </section>

        {/* Requiere acción — lista con arrow-links. */}
        <section aria-labelledby="acciones-heading" className="flex flex-col gap-6">
          <SectionHeading
            id="acciones-heading"
            eyebrow="Pendientes"
            titulo="Requiere acción"
          />
          <ul className="flex flex-col gap-3">
            {acciones.map((item, i) => (
              <PanelReveal as="li" key={item.id} index={i}>
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-line bg-cloud px-5 py-4 transition-colors duration-200 hover:border-champagne/60"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-ink">
                      {item.titulo}
                    </span>
                    <span className="block truncate text-[length:var(--text-step--1)] text-muted">
                      {item.detalle}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="text-[length:var(--text-step--1)] text-muted">
                      {item.cuando}
                    </span>
                    <span
                      aria-hidden="true"
                      className="inline-block text-ink transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </PanelReveal>
            ))}
          </ul>
        </section>
      </div>

      {/* Actividad reciente — feed que le da vida al cockpit. */}
      <section aria-labelledby="actividad-heading" className="flex flex-col gap-6">
        <SectionHeading
          id="actividad-heading"
          eyebrow="En vivo"
          titulo="Actividad reciente"
          verTodoLabel="Ver comunidad"
          verTodoHref="/panel/contactos"
        />
        <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-md)] border border-line bg-cloud">
          {actividad.map((a, i) => (
            <PanelReveal as="li" key={a.id} index={i}>
              <div className="flex items-center gap-4 px-5 py-4">
                <span className="w-24 shrink-0 text-[length:var(--text-step--1)] uppercase tracking-[0.1em] text-muted">
                  {a.cuando}
                </span>
                <span className="min-w-0 flex-1 truncate text-[length:var(--text-step-0)] text-ink">
                  {a.texto}
                </span>
                <span className="shrink-0">
                  <Badge variant="neutral">{a.tipo}</Badge>
                </span>
              </div>
            </PanelReveal>
          ))}
        </ul>
      </section>
    </div>
  );
}
