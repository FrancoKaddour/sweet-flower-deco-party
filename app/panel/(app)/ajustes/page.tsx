import type { Metadata } from "next";
import { PageHeader } from "@/components/panel/PageHeader";
import { PlugHint } from "@/components/panel/PlugHint";
import { PanelButton } from "@/components/panel/PanelButton";
import { DataTable, type Column } from "@/components/panel/DataTable";
import { Badge } from "@/components/panel/Badge";
import { getMockUsuarios, type Usuario } from "@/lib/panel/mock";

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

export default function AjustesPage() {
  // 🔌 GONZALO: reemplazá getMockUsuarios() por la query a Users (auth de Payload).
  // Esta vista es SOLO para admin: protegela por rol.
  const usuarios = getMockUsuarios();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
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

      <DataTable
        caption="Listado de usuarios del panel"
        columns={COLUMNS}
        rows={usuarios}
        getRowKey={(u) => u.id}
        emptyTitulo="Sin usuarios todavía"
        emptyDescripcion="Invitá a tu equipo y asignales un rol para que gestionen el panel."
      />
    </div>
  );
}
