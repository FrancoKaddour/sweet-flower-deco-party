"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/panel/Sidebar";
import { Topbar } from "@/components/panel/Topbar";
import type { UsuarioSesion } from "@/lib/panel/types";

// Shell del panel: arma sidebar + topbar + área de contenido y coordina el estado
// del sidebar mobile (abrir/cerrar). Es la ÚNICA pieza cliente del layout; las
// páginas siguen siendo Server Components. Cierra el sidebar al cambiar de ruta y
// con Escape (a11y de teclado). La `sesion` llega ya resuelta desde el server.

export function PanelShell({
  children,
  sesion,
}: {
  children: React.ReactNode;
  sesion: UsuarioSesion;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Cerrar con Escape (sólo mobile: en desktop el sidebar es persistente).
  // El cierre al navegar lo hacen los propios links del Sidebar (onClose).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-dvh bg-bone lg:grid lg:grid-cols-[18rem_1fr]">
      <Sidebar open={open} onClose={() => setOpen(false)} sesion={sesion} />
      <div className="flex min-w-0 flex-col">
        <Topbar onOpenMenu={() => setOpen(true)} sesion={sesion} />
        <main
          id="panel-main"
          className="flex-1 px-4 py-8 md:px-8 md:py-10"
          tabIndex={-1}
        >
          <div key={pathname} className="panel-enter mx-auto w-full max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
