import { PanelShell } from "@/components/panel/PanelShell";

// Layout del grupo (app): todas las vistas del panel que van dentro del shell
// (sidebar + topbar). El login vive en el grupo (auth), fuera de este layout.
export default function PanelAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PanelShell>{children}</PanelShell>;
}
