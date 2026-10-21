import { PanelShell } from "@/components/panel/PanelShell";
import { requireStaff } from "@/lib/dal";
import type { RolStaff } from "@/lib/panel/types";

// Layout del grupo (app): todas las vistas del panel dentro del shell.
// requireStaff() valida sesión + rol en el server (sin sesión → /panel/login).
// Cada página y Server Action vuelve a validar (el layout no alcanza solo).
export default async function PanelAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireStaff();
  const sesion = {
    nombre: user.name ?? user.email ?? "Staff",
    email: user.email ?? "",
    rol: user.role as RolStaff,
  };
  return <PanelShell sesion={sesion}>{children}</PanelShell>;
}
