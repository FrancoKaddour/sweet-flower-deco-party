import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/panel/PageHeader";
import { PlugHint } from "@/components/panel/PlugHint";
import { PanelReveal } from "@/components/panel/PanelReveal";
import { SectionHeading } from "@/components/panel/SectionHeading";
import { EmptyState } from "@/components/panel/EmptyState";
import { Badge } from "@/components/panel/Badge";
import { ArrowLink } from "@/components/panel/ArrowLink";
import { getContactoPorId } from "@/lib/panel/data";
import type { Contacto } from "@/lib/panel/types";

export const metadata: Metadata = { title: "Ficha de contacto" };

const ORIGEN_LABEL: Record<Contacto["origen"], string> = {
  compra: "Llegó por una compra",
  inscripcion: "Se anotó a un evento",
  lead: "Pidió un presupuesto",
  miembro: "Es miembro de la comunidad",
  newsletter: "Se suscribió al newsletter",
};

// Secciones del historial 360° — hoy vacías (los cruces se arman en el backend).
// Cada una explica QUÉ colección la alimenta y muestra un estado vacío editorial.
const HISTORIAL = [
  {
    id: "ordenes",
    eyebrow: "Compras",
    titulo: "Órdenes",
    coleccion: "Orders",
    descripcion: "Compras del storefront de esta persona, con pago y envío.",
  },
  {
    id: "inscripciones",
    eyebrow: "Eventos",
    titulo: "Inscripciones",
    coleccion: "EventRegistrations",
    descripcion: "Ediciones del Summit a las que se anotó.",
  },
  {
    id: "membresia",
    eyebrow: "Comunidad",
    titulo: "Membresía",
    coleccion: "Memberships",
    descripcion: "Plan y estado de su membresía en la comunidad.",
  },
  {
    id: "consultas",
    eyebrow: "A medida",
    titulo: "Consultas",
    coleccion: "Quotes",
    descripcion: "Presupuestos a medida que pidió desde el sitio.",
  },
] as const;

// Ficha 360° del contacto — CORAZÓN del CRM (ADR-014). Layout editorial de perfil:
// cabecera cálida con los datos + secciones de historial (una por colección que
// cuelga del Contact). Hoy el historial está vacío: se arma cruzando por contactId
// en el backend. Cada sección lo explica con SectionHeading + EmptyState.
export default async function ContactoDetallePage(
  props: PageProps<"/panel/contactos/[id]">,
) {
  const { id } = await props.params;
  // 🔌 GONZALO: getContactoPorId() vive en lib/panel/data.ts. Cambiá su cuerpo por
  // payload.findByID({ collection: "contacts", id }) para armar la ficha 360°.
  const contacto = await getContactoPorId(id);

  if (!contacto) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          seccion="Comunidad"
          titulo="Contacto no encontrado"
          descripcion="No encontramos este contacto en los datos mock."
        />
        <EmptyState
          titulo="Esta ficha no existe"
          descripcion="El contacto que buscás no está en los datos actuales. Puede que se haya dado de baja o que el enlace esté desactualizado."
          accion={
            <ArrowLink href="/panel/contactos">Volver a Comunidad</ArrowLink>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        seccion="Ficha 360°"
        titulo={contacto.nombre}
        descripcion={`${contacto.email} · alta ${contacto.creado}`}
      />

      <PlugHint coleccion="Contacts">
        Acá se arma la <strong>ficha 360°</strong> de la persona: cruzá{" "}
        <code className="font-mono">Orders</code>,{" "}
        <code className="font-mono">EventRegistrations</code>,{" "}
        <code className="font-mono">Memberships</code> y{" "}
        <code className="font-mono">Quotes</code> por{" "}
        <code className="font-mono">contactId</code> para llenar las secciones de
        abajo — compras, inscripciones, membresía y consultas a medida— en un solo
        lugar. Es lo que habilita segmentar campañas por comportamiento real.
      </PlugHint>

      {/* CABECERA DE PERFIL — momento cálido (sand) con datos + tags + opt-in. */}
      <PanelReveal
        as="section"
        aria-labelledby="perfil-heading"
        className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-sand"
      >
        <div className="flex flex-col gap-8 px-7 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-5">
              {/* Monograma editorial (inicial en display sobre botanical). */}
              <span
                aria-hidden="true"
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-botanical font-display text-[length:var(--text-step-3)] font-extrabold uppercase leading-none text-bone"
              >
                {contacto.nombre.trim().charAt(0) || "?"}
              </span>
              <div className="min-w-0">
                <h2
                  id="perfil-heading"
                  className="font-display text-[length:var(--text-step-2)] font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-ink"
                >
                  {contacto.nombre}
                </h2>
                <p className="mt-1 truncate text-[length:var(--text-step-0)] text-muted">
                  {contacto.email}
                </p>
              </div>
            </div>
            <Badge variant={contacto.optIn ? "success" : "danger"}>
              {contacto.optIn ? "Opt-in sí" : "Opt-in no"}
            </Badge>
          </div>

          {/* Datos clave en una lista de definición. */}
          <dl className="grid grid-cols-1 gap-6 border-t border-line pt-6 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <dt className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-muted">
                Origen
              </dt>
              <dd className="text-[length:var(--text-step-0)] font-medium text-ink">
                {ORIGEN_LABEL[contacto.origen]}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-muted">
                Alta
              </dt>
              <dd className="text-[length:var(--text-step-0)] font-medium text-ink">
                {contacto.creado}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-muted">
                Tags
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {contacto.tags.length > 0 ? (
                  contacto.tags.map((t) => (
                    <Badge key={t} variant="neutral">
                      {t}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted">—</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </PanelReveal>

      {/* HISTORIAL 360° — una sección por colección que cuelga del Contact. */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {HISTORIAL.map((h, i) => (
          <section
            key={h.id}
            aria-labelledby={`hist-${h.id}-heading`}
            className="flex flex-col gap-5"
          >
            <SectionHeading
              id={`hist-${h.id}-heading`}
              eyebrow={h.eyebrow}
              titulo={h.titulo}
            />
            <PanelReveal index={i}>
              <EmptyState
                titulo="Sin registros todavía"
                descripcion={h.descripcion}
              />
            </PanelReveal>
            <PlugHint coleccion={h.coleccion}>
              Traé los{" "}
              <code className="font-mono">{h.coleccion}</code> de esta persona con{" "}
              <code className="font-mono">
                where: {"{"} contact: {"{"} equals: id {"}"} {"}"}
              </code>{" "}
              y renderizalos acá en lugar del estado vacío.
            </PlugHint>
          </section>
        ))}
      </div>

      <ArrowLink href="/panel/contactos">Volver a Comunidad</ArrowLink>
    </div>
  );
}
