import type { Metadata } from "next";
import { PageHeader } from "@/components/panel/PageHeader";
import { PlugHint } from "@/components/panel/PlugHint";
import { DataTable, type Column } from "@/components/panel/DataTable";
import { ChipCampana } from "@/components/panel/status";
import { NuevaCampana } from "@/components/panel/NuevaCampana";
import { getMockCampanas, type Campana } from "@/lib/panel/mock";

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

export default function CampanasPage() {
  // 🔌 GONZALO: reemplazá getMockCampanas() por la query a EmailCampaigns. El
  // envío es por la API de Resend y SOLO a contactos con opt-in.
  const campanas = getMockCampanas();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        titulo="Campañas"
        descripcion="Email marketing propio: armá y enviá a segmentos de contactos con opt-in."
      />

      <PlugHint coleccion="EmailCampaigns">
        Herramienta mínima propia (no un ESP externo, ADR-014). Envío por la API
        de <strong>Resend</strong>, <strong>solo a contactos con opt-in</strong>{" "}
        del segmento. El form de abajo es mock: cablealo al crear/enviar el
        <code className="font-mono"> EmailCampaign</code>.
      </PlugHint>

      <NuevaCampana />

      <DataTable
        caption="Listado de campañas de email"
        columns={COLUMNS}
        rows={campanas}
        getRowKey={(c) => c.id}
        emptyTitulo="Sin campañas todavía"
        emptyDescripcion="Cuando armes tu primera campaña, va a aparecer acá con su estado."
      />
    </div>
  );
}
