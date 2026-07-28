import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/panel/PageHeader";
import { PlugHint } from "@/components/panel/PlugHint";
import { Badge } from "@/components/panel/Badge";
import { getMockContactoPorId } from "@/lib/panel/mock";

export const metadata: Metadata = { title: "Ficha de contacto" };

// Ficha 360° del contacto — CORAZÓN del CRM (ADR-014). Hoy es un placeholder con
// datos mock por id: muestra el encabezado del contacto y un PlugHint que explica
// cómo se arma el historial cruzando las colecciones que cuelgan del Contact.
export default async function ContactoDetallePage(
  props: PageProps<"/panel/contactos/[id]">,
) {
  const { id } = await props.params;
  const contacto = getMockContactoPorId(id);
  const nombre = contacto?.nombre ?? "Contacto no encontrado";

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        titulo={nombre}
        descripcion={
          contacto
            ? `${contacto.email} · alta ${contacto.creado}`
            : "No encontramos este contacto en los datos mock."
        }
      />

      {contacto ? (
        <div className="flex flex-wrap items-center gap-2">
          {contacto.tags.map((t) => (
            <Badge key={t} variant="neutral">
              {t}
            </Badge>
          ))}
          <Badge variant={contacto.optIn ? "success" : "danger"}>
            {contacto.optIn ? "Opt-in sí" : "Opt-in no"}
          </Badge>
        </div>
      ) : null}

      <PlugHint coleccion="Contacts">
        Acá se arma la <strong>ficha 360°</strong> de la persona: cruzá{" "}
        <code className="font-mono">Orders</code>,{" "}
        <code className="font-mono">EventRegistrations</code>,{" "}
        <code className="font-mono">Memberships</code> y{" "}
        <code className="font-mono">Quotes</code> por{" "}
        <code className="font-mono">contactId</code> para ver todo el historial —
        compras, inscripciones, membresía y consultas a medida— en un solo lugar.
        Es lo que habilita segmentar campañas por comportamiento real.
      </PlugHint>

      <Link
        href="/panel/contactos"
        className="text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-muted underline-offset-2 hover:text-ink hover:underline"
      >
        ← Volver a Comunidad
      </Link>
    </div>
  );
}
