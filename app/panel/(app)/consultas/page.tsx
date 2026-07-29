import type { Metadata } from "next";
import { PageHeader } from "@/components/panel/PageHeader";
import { PlugHint } from "@/components/panel/PlugHint";
import { PanelButton } from "@/components/panel/PanelButton";
import { PanelReveal } from "@/components/panel/PanelReveal";
import { SectionHeading } from "@/components/panel/SectionHeading";
import { StatCard } from "@/components/panel/StatCard";
import { Toolbar } from "@/components/panel/Toolbar";
import { DataTable, type Column } from "@/components/panel/DataTable";
import { ChipLead } from "@/components/panel/status";
import { getLeads } from "@/lib/panel/data";
import type { Lead } from "@/lib/panel/types";

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
    cell: (l) => (
      // 🔌 GONZALO: cablear "Responder" a un email por Resend + update de estado.
      <PanelButton
        variant="ghost"
        className="px-3"
        aria-label={`Responder consulta de ${l.contacto}`}
        title={`Pendiente: responder a ${l.contacto}`}
      >
        Responder
      </PanelButton>
    ),
  },
];

// Superficies cálidas rotativas para los mini-KPIs del embudo (variedad de marca).
const SUPERFICIES = ["sand", "blush", "sage", "cloud"] as const;

export default async function ConsultasPage() {
  // 🔌 GONZALO: getLeads() vive en lib/panel/data.ts. Cambiá su cuerpo por la query
  // a Quotes/Leads (cuelga de un Contact). Cada consulta a medida del sitio entra acá.
  const leads = await getLeads();

  // Resumen del embudo — se deriva de los leads (no es dato suelto): cuando
  // enchufes Quotes, getLeads() cambia y estos conteos siguen siendo reales.
  const nuevos = leads.filter((l) => l.estado === "nuevo").length;
  const enCurso = leads.filter((l) => l.estado === "en-curso").length;
  const cotizados = leads.filter((l) => l.estado === "cotizado").length;
  const resumen = [
    {
      id: "nuevos",
      label: "Sin responder",
      valor: String(nuevos),
      tendencia: (nuevos > 0 ? "baja" : "neutral") as "baja" | "neutral",
      ayuda: "Consultas nuevas que esperan una primera respuesta.",
    },
    {
      id: "en-curso",
      label: "En conversación",
      valor: String(enCurso),
      tendencia: "neutral" as const,
      ayuda: "Presupuestos abiertos, en ida y vuelta con la persona.",
    },
    {
      id: "cotizados",
      label: "Cotizados",
      valor: String(cotizados),
      tendencia: "neutral" as const,
      ayuda: "Con precio enviado, a la espera de confirmación.",
    },
  ];

  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        seccion="Consultas"
        titulo="Consultas"
        descripcion='Bandeja de presupuestos "a medida". Es plata sobre la mesa: ninguno se pierde.'
      />

      <PlugHint coleccion="Quotes/Leads">
        Cada consulta de producto a medida del sitio crea/actualiza un{" "}
        <strong>Contact</strong> y entra a esta bandeja. Cablealo a{" "}
        <code className="font-mono">Quotes</code> con estados
        nuevo/en-curso/cotizado/cerrado. Los mini-indicadores de arriba se derivan
        de <code className="font-mono">getLeads()</code>.
      </PlugHint>

      {/* Resumen del embudo — mini-KPIs sobre superficies cálidas. */}
      <section aria-labelledby="embudo-heading" className="flex flex-col gap-6">
        <SectionHeading
          id="embudo-heading"
          eyebrow="El embudo"
          titulo="Dónde está cada consulta"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {resumen.map((r, i) => (
            <PanelReveal key={r.id} index={i}>
              <StatCard
                label={r.label}
                valor={r.valor}
                tendencia={r.tendencia}
                ayuda={r.ayuda}
                superficie={SUPERFICIES[i % SUPERFICIES.length]}
              />
            </PanelReveal>
          ))}
        </div>
      </section>

      {/* Bandeja completa con toolbar. */}
      <section aria-labelledby="bandeja-heading" className="flex flex-col gap-6">
        <SectionHeading
          id="bandeja-heading"
          eyebrow="Bandeja"
          titulo="Todas las consultas"
        />

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
      </section>
    </div>
  );
}
