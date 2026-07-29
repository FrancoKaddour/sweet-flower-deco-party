import type { Metadata } from "next";
import { PageHeader } from "@/components/panel/PageHeader";
import { PlugHint } from "@/components/panel/PlugHint";
import { PanelReveal } from "@/components/panel/PanelReveal";
import { SectionHeading } from "@/components/panel/SectionHeading";
import { DataTable, type Column } from "@/components/panel/DataTable";
import { ChipCampana } from "@/components/panel/status";
import { NuevaCampana } from "@/components/panel/NuevaCampana";
import { getCampanas } from "@/lib/panel/data";
import type { Campana } from "@/lib/panel/types";

export const metadata: Metadata = { title: "Campañas" };

const COLUMNS: Column<Campana>[] = [
  {
    key: "asunto",
    header: "Asunto",
    cell: (c) => <span className="font-medium">{c.asunto}</span>,
  },
  {
    key: "segmento",
    header: "Segmento",
    hideOnMobile: true,
    cell: (c) => <span className="text-muted">{c.segmento}</span>,
  },
  {
    key: "estado",
    header: "Estado",
    cell: (c) => <ChipCampana estado={c.estado} />,
  },
  {
    key: "enviados",
    header: "Enviados",
    align: "right",
    hideOnMobile: true,
    cell: (c) => c.enviados,
  },
  {
    key: "fecha",
    header: "Fecha",
    align: "right",
    hideOnMobile: true,
    cell: (c) => <span className="text-muted">{c.fecha}</span>,
  },
];

// Los tres pasos del envío — didáctico para Flor, editorial para el ojo.
const PASOS = [
  {
    id: "segmento",
    glifo: "01",
    titulo: "Elegís un segmento",
    detalle:
      "Todos con opt-in, inscriptos al Summit, compradores del mes o miembros activos.",
  },
  {
    id: "optin",
    glifo: "02",
    titulo: "Solo con opt-in",
    detalle:
      "El envío se filtra por consentimiento: quien no lo dio, no recibe (requisito legal).",
  },
  {
    id: "resend",
    glifo: "03",
    titulo: "Sale por Resend",
    detalle:
      "Herramienta propia mínima, sin ESP externo. El email se despacha por la API de Resend.",
  },
] as const;

export default async function CampanasPage() {
  // 🔌 GONZALO: getCampanas() vive en lib/panel/data.ts. Cambiá su cuerpo por la
  // query a EmailCampaigns. El envío es por la API de Resend y SOLO a opt-in.
  const campanas = await getCampanas();

  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        seccion="Marketing"
        titulo="Campañas"
        descripcion="Email marketing propio: armá y enviá a segmentos de contactos con opt-in."
      />

      <PlugHint coleccion="EmailCampaigns">
        Herramienta mínima propia (no un ESP externo, ADR-014). Envío por la API
        de <strong>Resend</strong>, <strong>solo a contactos con opt-in</strong>{" "}
        del segmento. El form de abajo es mock: cablealo al crear/enviar el
        <code className="font-mono"> EmailCampaign</code>.
      </PlugHint>

      {/* Cómo funciona — momento oscuro botanical con los 3 pasos del envío. */}
      <section aria-labelledby="como-funciona-heading">
        <PanelReveal
          as="section"
          className="overflow-hidden rounded-[var(--radius-lg)] bg-botanical text-bone"
        >
          <div className="flex flex-col gap-10 px-7 py-10 md:px-12 md:py-14">
            <div>
              <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-champagne">
                ✧ Cómo funciona
              </p>
              <h2
                id="como-funciona-heading"
                className="mt-3 max-w-[20ch] font-display text-[length:var(--text-step-3)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone md:text-[length:var(--text-step-4)]"
              >
                Del segmento al inbox, en tres pasos
              </h2>
            </div>

            <ol className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
              {PASOS.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col gap-3 border-t border-bone/15 pt-6 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:first:border-l-0 sm:first:pl-0"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-[length:var(--text-step-4)] font-extrabold leading-none tracking-[-0.02em] text-champagne"
                  >
                    {p.glifo}
                  </span>
                  <p className="font-display text-[length:var(--text-step-1)] font-bold text-bone">
                    {p.titulo}
                  </p>
                  <p className="text-[length:var(--text-step--1)] leading-relaxed text-bone/60">
                    {p.detalle}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </PanelReveal>
      </section>

      {/* Nueva campaña + historial. */}
      <section aria-labelledby="campanas-listado-heading" className="flex flex-col gap-6">
        <SectionHeading
          id="campanas-listado-heading"
          eyebrow="Historial"
          titulo="Campañas enviadas y borradores"
        />

        <NuevaCampana />

        <DataTable
          caption="Listado de campañas de email"
          columns={COLUMNS}
          rows={campanas}
          getRowKey={(c) => c.id}
          emptyTitulo="Sin campañas todavía"
          emptyDescripcion="Cuando armes tu primera campaña, va a aparecer acá con su estado."
        />
      </section>
    </div>
  );
}
