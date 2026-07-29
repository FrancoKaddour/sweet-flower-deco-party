import type { Metadata } from "next";
import { PageHeader } from "@/components/panel/PageHeader";
import { PlugHint } from "@/components/panel/PlugHint";
import { PanelReveal } from "@/components/panel/PanelReveal";
import { SectionHeading } from "@/components/panel/SectionHeading";
import { ArrowLink } from "@/components/panel/ArrowLink";
import { Toolbar } from "@/components/panel/Toolbar";
import { DataTable, type Column } from "@/components/panel/DataTable";
import { ChipPago, ChipEnvio } from "@/components/panel/status";
import { getOrdenes, getMetricasClave } from "@/lib/panel/data";
import { formatARS, type Orden } from "@/lib/panel/types";

export const metadata: Metadata = { title: "Órdenes" };

const COLUMNS: Column<Orden>[] = [
  {
    key: "id",
    header: "Orden",
    cell: (o) => <span className="font-medium">#{o.id}</span>,
  },
  {
    key: "comprador",
    header: "Comprador",
    hideOnMobile: true,
    cell: (o) => <span className="text-muted">{o.comprador}</span>,
  },
  {
    key: "total",
    header: "Total",
    align: "right",
    cell: (o) => formatARS(o.total),
  },
  {
    key: "pago",
    header: "Pago",
    cell: (o) => <ChipPago estado={o.estadoPago} />,
  },
  {
    key: "envio",
    header: "Envío",
    cell: (o) => <ChipEnvio estado={o.estadoEnvio} />,
  },
  {
    key: "fecha",
    header: "Fecha",
    align: "right",
    hideOnMobile: true,
    cell: (o) => <span className="text-muted">{o.fecha}</span>,
  },
];

export default async function VentasPage() {
  // 🔌 GONZALO: getOrdenes()/getMetricasClave() viven en lib/panel/data.ts y hoy
  // devuelven mock. Cambiá SOLO su cuerpo por la query a Orders (cuelga de un
  // Contact). El estado de PAGO es SOLO LECTURA (lo fija el webhook de Mercado
  // Pago); el de ENVÍO sí es editable.
  const [ordenes, metricas] = await Promise.all([
    getOrdenes(),
    getMetricasClave(),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        seccion="Ventas"
        titulo="Órdenes"
        descripcion="Ventas del storefront: total, estado de pago (solo lectura) y de envío."
      />

      <PlugHint coleccion="Orders">
        Cada <code className="font-mono">Order</code> cuelga de un{" "}
        <code className="font-mono">Contact</code> (ADR-014): ese cruce es el que
        habilita campañas tipo <em>&ldquo;compradores del último mes&rdquo;</em>.
        El <strong>estado de pago</strong> lo fija el{" "}
        <strong>webhook de Mercado Pago</strong> — nunca se edita a mano acá (es
        solo lectura). El <strong>estado de envío</strong> sí es editable: cablealo
        a un update sobre <code className="font-mono">Orders</code>. La franja de
        resumen sale de{" "}
        <code className="font-mono">getMetricasClave()</code>.
      </PlugHint>

      {/* MOMENTO OSCURO — franja bordeaux con el resumen del período de ventas. */}
      <section aria-labelledby="resumen-ventas-heading">
        <PanelReveal
          as="section"
          className="overflow-hidden rounded-[var(--radius-lg)] bg-bordeaux text-bone"
        >
          <div className="flex flex-col gap-10 px-7 py-10 md:px-12 md:py-14">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-champagne">
                  ✧ Resumen del período
                </p>
                <h2
                  id="resumen-ventas-heading"
                  className="mt-3 max-w-[18ch] font-display text-[length:var(--text-step-3)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone md:text-[length:var(--text-step-4)]"
                >
                  Cómo viene el mes
                </h2>
              </div>
              <ArrowLink href="/panel" tono="oscuro">
                Ver cockpit
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

      {/* Listado de órdenes con su encabezado editorial + toolbar. */}
      <section aria-labelledby="ordenes-listado-heading" className="flex flex-col gap-6">
        <SectionHeading
          id="ordenes-listado-heading"
          eyebrow="Bandeja"
          titulo="Todas las órdenes"
        />

        <Toolbar
          buscarId="buscar-ordenes"
          placeholderBuscar="Buscar por orden o comprador…"
        />

        <DataTable
          caption="Listado de órdenes de venta"
          columns={COLUMNS}
          rows={ordenes}
          getRowKey={(o) => o.id}
          emptyTitulo="Sin órdenes todavía"
          emptyDescripcion="Cuando alguien compre en el sitio, la orden va a aparecer acá."
        />
      </section>
    </div>
  );
}
