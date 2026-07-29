import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/panel/PageHeader";
import { PlugHint } from "@/components/panel/PlugHint";
import { PanelButton } from "@/components/panel/PanelButton";
import { PanelReveal } from "@/components/panel/PanelReveal";
import { SectionHeading } from "@/components/panel/SectionHeading";
import { StatCard } from "@/components/panel/StatCard";
import { Toolbar } from "@/components/panel/Toolbar";
import { DataTable, type Column } from "@/components/panel/DataTable";
import { Badge } from "@/components/panel/Badge";
import { Tabs, type TabDef } from "@/components/panel/Tabs";
import { OptInToggle } from "@/components/panel/OptInToggle";
import { ChipMembresia } from "@/components/panel/status";
import {
  getContactos,
  getMiembros,
  getInscripciones,
} from "@/lib/panel/data";
import type { Contacto, Miembro, Inscripcion } from "@/lib/panel/types";

export const metadata: Metadata = { title: "Comunidad" };

const ORIGEN_LABEL: Record<Contacto["origen"], string> = {
  compra: "Compró",
  inscripcion: "Se anotó",
  lead: "Lead",
  miembro: "Miembro",
  newsletter: "Newsletter",
};

const COLS_CONTACTOS: Column<Contacto>[] = [
  {
    key: "nombre",
    header: "Contacto",
    cell: (c) => (
      // Fila clickeable → ficha 360° del contacto (ADR-014). El link va sobre el
      // nombre para no romper la semántica de la tabla (nada de <a> envolviendo <tr>).
      <Link
        href={`/panel/contactos/${c.id}`}
        className="group inline-flex flex-col rounded-[var(--radius-sm)] focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
        title={`Ver ficha de ${c.nombre}`}
      >
        <span className="block font-medium text-ink underline-offset-2 group-hover:underline">
          {c.nombre}
        </span>
        <span className="block text-[length:var(--text-step--1)] text-muted">
          {c.email}
        </span>
      </Link>
    ),
  },
  {
    key: "tags",
    header: "Tags",
    hideOnMobile: true,
    cell: (c) => (
      <span className="flex flex-wrap gap-1.5">
        {c.tags.map((t) => (
          <Badge key={t} variant="neutral">
            {t}
          </Badge>
        ))}
      </span>
    ),
  },
  {
    key: "origen",
    header: "Origen",
    hideOnMobile: true,
    cell: (c) => <span className="text-muted">{ORIGEN_LABEL[c.origen]}</span>,
  },
  {
    key: "optin",
    header: "Opt-in",
    align: "center",
    cell: (c) => (
      <div className="flex justify-center">
        <OptInToggle defaultOn={c.optIn} contactoLabel={c.nombre} />
      </div>
    ),
  },
  {
    key: "creado",
    header: "Creado",
    align: "right",
    hideOnMobile: true,
    cell: (c) => <span className="text-muted">{c.creado}</span>,
  },
];

const COLS_MIEMBROS: Column<Miembro>[] = [
  {
    key: "contacto",
    header: "Contacto",
    cell: (m) => <span className="font-medium">{m.contacto}</span>,
  },
  {
    key: "plan",
    header: "Plan",
    cell: (m) => <span className="text-muted">{m.plan}</span>,
  },
  {
    key: "estado",
    header: "Estado",
    cell: (m) => <ChipMembresia estado={m.estado} />,
  },
  {
    key: "desde",
    header: "Desde",
    align: "right",
    hideOnMobile: true,
    cell: (m) => <span className="text-muted">{m.desde}</span>,
  },
];

const INSCRIPCION_LABEL: Record<Inscripcion["estado"], string> = {
  anotado: "Anotado",
  confirmado: "Confirmado",
  asistio: "Asistió",
};

const COLS_INSCRIPCIONES: Column<Inscripcion>[] = [
  {
    key: "contacto",
    header: "Contacto",
    cell: (i) => <span className="font-medium">{i.contacto}</span>,
  },
  {
    key: "edicion",
    header: "Edición",
    cell: (i) => <span className="text-muted">{i.edicion}</span>,
  },
  {
    key: "estado",
    header: "Estado",
    cell: (i) => <Badge variant="info">{INSCRIPCION_LABEL[i.estado]}</Badge>,
  },
  {
    key: "fecha",
    header: "Fecha",
    align: "right",
    hideOnMobile: true,
    cell: (i) => <span className="text-muted">{i.fecha}</span>,
  },
];

export default async function ContactosPage() {
  // 🔌 GONZALO: Contacts es el CENTRO del CRM (ADR-014). Miembros e inscripciones
  // CUELGAN de un Contact. Cada get*() vive en lib/panel/data.ts: cambiás su cuerpo
  // por la query a su colección (contacts / memberships / event-registrations).
  const [contactos, miembros, inscripciones] = await Promise.all([
    getContactos(),
    getMiembros(),
    getInscripciones(),
  ]);

  // Resumen de segmentos — derivado de los datos (no es dato suelto): cuando
  // enchufes Payload, estas mismas funciones cambian y los conteos siguen reales.
  const conOptIn = contactos.filter((c) => c.optIn).length;
  const miembrosActivos = miembros.filter((m) => m.estado === "activa").length;
  const segmentos = [
    {
      id: "total",
      label: "Contactos",
      valor: String(contactos.length),
      tendencia: "neutral" as const,
      ayuda: "Toda persona del CRM: compradoras, leads, inscriptas y miembros.",
      superficie: "sage" as const,
    },
    {
      id: "optin",
      label: "Con opt-in",
      valor: String(conOptIn),
      tendencia: (conOptIn > 0 ? "sube" : "neutral") as "sube" | "neutral",
      ayuda: "Consintieron recibir email — son las que entran a campañas (legal).",
      superficie: "blush" as const,
    },
    {
      id: "miembros",
      label: "Miembros activos",
      valor: String(miembrosActivos),
      tendencia: "neutral" as const,
      ayuda: "Contactos con membresía vigente en la comunidad.",
      superficie: "sand" as const,
    },
    {
      id: "inscriptos",
      label: "Inscriptos",
      valor: String(inscripciones.length),
      tendencia: (inscripciones.length > 0 ? "sube" : "neutral") as
        | "sube"
        | "neutral",
      ayuda: "Anotados a la próxima edición del Summit desde el sitio.",
      superficie: "cloud" as const,
    },
  ];

  const tabs: TabDef[] = [
    {
      id: "contactos",
      label: "Contactos",
      content: (
        <div className="flex flex-col gap-6">
          <Toolbar
            buscarId="buscar-contactos"
            placeholderBuscar="Buscar por nombre, email o tag…"
            accion={
              // 🔌 GONZALO: exportar los Contacts filtrados a CSV (hoy self-href mock).
              <PanelButton
                href="/panel/contactos"
                title="Pendiente: exportar CSV"
              >
                Exportar CSV
              </PanelButton>
            }
          />
          <DataTable
            caption="Listado de contactos del CRM"
            columns={COLS_CONTACTOS}
            rows={contactos}
            getRowKey={(c) => c.id}
            emptyTitulo="Sin contactos todavía"
            emptyDescripcion="Cada compra, inscripción, lead o suscripción crea un contacto acá."
          />
        </div>
      ),
    },
    {
      id: "miembros",
      label: "Miembros",
      content: (
        <DataTable
          caption="Listado de miembros con membresía"
          columns={COLS_MIEMBROS}
          rows={miembros}
          getRowKey={(m) => m.id}
          emptyTitulo="Sin miembros todavía"
          emptyDescripcion="Los contactos con membresía activa van a aparecer acá."
        />
      ),
    },
    {
      id: "inscripciones",
      label: "Inscripciones",
      content: (
        <DataTable
          caption="Listado de inscripciones a eventos"
          columns={COLS_INSCRIPCIONES}
          rows={inscripciones}
          getRowKey={(i) => i.id}
          emptyTitulo="Sin inscripciones todavía"
          emptyDescripcion="Las anotaciones del formulario del sitio van a aparecer acá."
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        seccion="Comunidad"
        titulo="Comunidad"
        descripcion="El CRM: toda persona es un contacto con tags y opt-in. Miembros e inscripciones cuelgan de él."
      />

      <PlugHint coleccion="Contacts · Memberships · EventRegistrations">
        <strong>Contacts es el centro</strong> (ADR-014): órdenes, inscripciones,
        membresías y leads se relacionan a un contacto, no guardan el email suelto.
        El <strong>opt-in</strong> (con fecha y origen) es requisito legal para
        campañas — ver skill <em>legal-review</em>. Los indicadores de arriba se
        derivan de <code className="font-mono">getContactos()</code>,{" "}
        <code className="font-mono">getMiembros()</code> e{" "}
        <code className="font-mono">getInscripciones()</code>.
      </PlugHint>

      {/* Resumen de segmentos — mini-KPIs sobre superficies cálidas. */}
      <section aria-labelledby="segmentos-heading" className="flex flex-col gap-6">
        <SectionHeading
          id="segmentos-heading"
          eyebrow="La comunidad"
          titulo="Segmentos de un vistazo"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {segmentos.map((s, i) => (
            <PanelReveal key={s.id} index={i}>
              <StatCard
                label={s.label}
                valor={s.valor}
                tendencia={s.tendencia}
                ayuda={s.ayuda}
                superficie={s.superficie}
              />
            </PanelReveal>
          ))}
        </div>
      </section>

      {/* Fichas del CRM organizadas por vista (contactos / miembros / inscripciones). */}
      <section aria-labelledby="crm-heading" className="flex flex-col gap-6">
        <SectionHeading
          id="crm-heading"
          eyebrow="Fichas"
          titulo="El CRM completo"
        />
        <Tabs tabs={tabs} />
      </section>
    </div>
  );
}
