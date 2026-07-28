import Link from "next/link";
import { PageHeader } from "@/components/panel/PageHeader";
import { PlugHint } from "@/components/panel/PlugHint";
import { StatCard } from "@/components/panel/StatCard";
import { PanelButton } from "@/components/panel/PanelButton";
import { getMockKpis, getMockAcciones } from "@/lib/panel/mock";

// Inicio / Métricas — resumen del negocio de un vistazo. Grilla de KPIs +
// lista "Requiere acción". Server Component: lee los mocks en el server.

export default function InicioPage() {
  // 🔌 GONZALO: reemplazá getMockKpis() por agregaciones sobre Orders/Products/
  // EventRegistrations/Contacts/Quotes (ver comentarios en lib/panel/mock.ts).
  const kpis = getMockKpis();
  // 🔌 GONZALO: reemplazá getMockAcciones() por Orders pendientes + Quotes nuevas.
  const acciones = getMockAcciones();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        titulo="Inicio"
        descripcion="El estado del negocio de un vistazo: ventas, órdenes, stock, comunidad y leads."
        accion={<PanelButton href="/panel/ventas">Ver órdenes</PanelButton>}
      />

      <PlugHint coleccion="Orders · Products · EventRegistrations · Contacts · Quotes">
        Estas tarjetas son agregaciones (counts/sumas) sobre varias colecciones.
        Cada <code className="font-mono">getMockX()</code> en{" "}
        <code className="font-mono">lib/panel/mock.ts</code> dice exactamente qué
        query las alimenta.
      </PlugHint>

      <section aria-labelledby="kpis-heading">
        <h2 id="kpis-heading" className="sr-only">
          Métricas principales
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {kpis.map((kpi) => (
            <StatCard
              key={kpi.id}
              label={kpi.label}
              valor={kpi.valor}
              delta={kpi.delta}
              tendencia={kpi.tendencia}
              ayuda={kpi.ayuda}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="acciones-heading">
        <h2
          id="acciones-heading"
          className="mb-4 font-display text-[length:var(--text-step-2)] font-bold tracking-tight text-ink"
        >
          Requiere acción
        </h2>
        <ul className="flex flex-col gap-3">
          {acciones.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-line bg-cloud px-5 py-4 transition-colors hover:border-champagne/60"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">
                    {item.titulo}
                  </span>
                  <span className="block truncate text-[length:var(--text-step--1)] text-muted">
                    {item.detalle}
                  </span>
                </span>
                <span className="shrink-0 text-[length:var(--text-step--1)] text-muted">
                  {item.cuando}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
