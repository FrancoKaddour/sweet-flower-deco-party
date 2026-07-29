import { PanelShell } from "@/components/panel/PanelShell";
import { getUsuarioSesion } from "@/lib/panel/data";

// Layout del grupo (app): todas las vistas del panel que van dentro del shell
// (sidebar + topbar). El login vive en el grupo (auth), fuera de este layout.
// Server Component: lee la sesión en el server y la baja al shell (cliente) por prop.
export default async function PanelAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔌 GONZALO: getUsuarioSesion() devuelve el usuario logueado (hoy mock, mañana
  // payload.auth). La sesión baja como prop al shell/sidebar/topbar.
  const sesion = await getUsuarioSesion();
  return <PanelShell sesion={sesion}>{children}</PanelShell>;
}
