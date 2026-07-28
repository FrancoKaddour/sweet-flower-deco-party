import type { Metadata } from "next";
import { PageHeader } from "@/components/panel/PageHeader";
import { PlugHint } from "@/components/panel/PlugHint";
import { PanelButton } from "@/components/panel/PanelButton";
import { Toolbar } from "@/components/panel/Toolbar";
import { DataTable, type Column } from "@/components/panel/DataTable";
import { ChipLead } from "@/components/panel/status";
import { getMockLeads, type Lead } from "@/lib/panel/mock";

export const metadata: Metadata = { title: "Consultas" };

const COLUMNS: Column<Lead>[] = [
  {
    key: "contacto",
    header: "Contacto",
    cell: (l) => <span className="font-medium">{l.contacto}</span>,
  },
  {
    key: "detalle",
    header: "Detalle",
    cell: (l) => <span className="text-muted">{l.detalle}</span>,
  },
  {
    key: "producto",
    header: "Producto",
    hideOnMobile: true,
    cell: (l) => <span className="text-muted">{l.producto}</span>,
  },
  {
    key: "estado",
    header: "Estado",
    cell: (l) => <ChipLead estado={l.estado} />,
  },
  {
    key: "fecha",
    header: "Fecha",
    align: "right",
    hideOnMobile: true,
    cell: (l) => <span className="text-muted">{l.fecha}</span>,
  },
  {
    key: "acciones",
    header: "Acciones",
    align: "right",
    cell: () => (
      // 🔌 GONZALO: cablear "Responder" a un email por Resend + update de estado.
      <PanelButton variant="ghost" className="px-3">
        Responder
      </PanelButton>
    ),
  },
];

export default function ConsultasPage() {
  // 🔌 GONZALO: reemplazá getMockLeads() por la query a Quotes/Leads (cuelga de
  // un Contact). Cada consulta a medida del sitio entra acá: no se pierde ninguna.
  const leads = getMockLeads();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        titulo="Consultas"
        descripcion='Bandeja de presupuestos "a medida". Es plata sobre la mesa: ninguno se pierde.'
      />

      <PlugHint coleccion="Quotes/Leads">
        Cada consulta de producto a medida del sitio crea/actualiza un{" "}
        <strong>Contact</strong> y entra a esta bandeja. Cablealo a{" "}
        <code className="font-mono">Quotes</code> con estados
        nuevo/en-curso/cotizado/cerrado.
      </PlugHint>

      <Toolbar
        buscarId="buscar-consultas"
        placeholderBuscar="Buscar por contacto o producto…"
      />

      <DataTable
        caption="Bandeja de presupuestos a medida"
        columns={COLUMNS}
        rows={leads}
        getRowKey={(l) => l.id}
        emptyTitulo="Sin consultas todavía"
        emptyDescripcion="Cuando alguien pida un presupuesto a medida, va a aparecer acá."
      />
    </div>
  );
}
