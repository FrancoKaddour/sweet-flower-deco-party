import type { Metadata } from "next";
import { PageHeader } from "@/components/panel/PageHeader";
import { PlugHint } from "@/components/panel/PlugHint";
import { PanelButton } from "@/components/panel/PanelButton";
import { PanelReveal } from "@/components/panel/PanelReveal";
import { SectionHeading } from "@/components/panel/SectionHeading";
import { DataTable, type Column } from "@/components/panel/DataTable";
import { Badge } from "@/components/panel/Badge";
import { getUsuarios } from "@/lib/panel/data";
import type { Usuario } from "@/lib/panel/types";

export const metadata: Metadata = { title: "Ajustes" };

const COLUMNS: Column<Usuario>[] = [
  {
    key: "email",
    header: "Email",
    cell: (u) => <span className="font-medium">{u.email}</span>,
  },
  {
    key: "rol",
    header: "Rol",
    cell: (u) => (
      <Badge variant={u.rol === "admin" ? "warning" : "info"}>
        {u.rol === "admin" ? "Admin" : "Editor"}
      </Badge>
    ),
  },
  {
    key: "acciones",
    header: "Acciones",
    align: "right",
    cell: (u) => (
      // 🔌 GONZALO: cablear editar rol / dar de baja (solo admin) sobre Users.
      <PanelButton
        variant="ghost"
        className="px-3"
        aria-label={`Editar ${u.email}`}
        title={`Pendiente: editar ${u.email}`}
      >
        Editar
      </PanelButton>
    ),
  },
];

export default async function AjustesPage() {
  // 🔌 GONZALO: getUsuarios() vive en lib/panel/data.ts. Cambiá su cuerpo por la
  // query a Users (auth de Payload). Esta vista es SOLO para admin: protegela por rol.
  const usuarios = await getUsuarios();

  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        seccion="Ajustes"
        titulo="Ajustes"
        descripcion="Usuarios y roles del panel. Solo administradores pueden gestionar staff."
        accion={
          // 🔌 GONZALO: alta de staff con invitación por email sobre Users (hoy self-href mock).
          <PanelButton href="/panel/ajustes" title="Pendiente: invitar usuario">
            Invitar usuario
          </PanelButton>
        }
      />

      <PlugHint coleccion="Users">
        Staff del panel con rol <strong>admin</strong> (todo) o{" "}
        <strong>editor</strong> (contenido, sin ajustes). Es la auth nativa de
        Payload. Protegé esta vista por rol admin — ver skill <em>auth-review</em>.
      </PlugHint>

      {/* Referencia de roles — dos tarjetas sobrias que explican qué puede cada uno. */}
      <section aria-labelledby="roles-heading" className="flex flex-col gap-6">
        <SectionHeading
          id="roles-heading"
          eyebrow="Permisos"
          titulo="Qué puede cada rol"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PanelReveal
            as="article"
            index={0}
            className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-line bg-sand p-6"
          >
            <div className="flex items-center gap-2">
              <Badge variant="warning">Admin</Badge>
            </div>
            <p className="text-[length:var(--text-step--1)] leading-relaxed text-muted">
              Acceso total: gestiona ventas, catálogo, comunidad, campañas,
              contenido y también <strong className="text-ink">este panel de ajustes</strong>{" "}
              (invitar staff y cambiar roles).
            </p>
          </PanelReveal>
          <PanelReveal
            as="article"
            index={1}
            className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-line bg-sage p-6"
          >
            <div className="flex items-center gap-2">
              <Badge variant="info">Editor</Badge>
            </div>
            <p className="text-[length:var(--text-step--1)] leading-relaxed text-muted">
              Trabaja el día a día: catálogo, comunidad, campañas y contenido.
              <strong className="text-ink"> No accede a Ajustes</strong> ni gestiona
              otros usuarios.
            </p>
          </PanelReveal>
        </div>
      </section>

      {/* Listado de staff. */}
      <section aria-labelledby="staff-heading" className="flex flex-col gap-6">
        <SectionHeading
          id="staff-heading"
          eyebrow="Equipo"
          titulo="Staff del panel"
        />
        <DataTable
          caption="Listado de usuarios del panel"
          columns={COLUMNS}
          rows={usuarios}
          getRowKey={(u) => u.id}
          emptyTitulo="Sin usuarios todavía"
          emptyDescripcion="Invitá a tu equipo y asignales un rol para que gestionen el panel."
        />
      </section>
    </div>
  );
}
