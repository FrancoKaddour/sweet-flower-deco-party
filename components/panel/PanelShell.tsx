"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/panel/Sidebar";
import { Topbar } from "@/components/panel/Topbar";
import { ToastProvider } from "@/components/panel/Toast";
import type { Pendientes, UsuarioSesion } from "@/lib/panel/types";

// Shell del panel: arma sidebar + topbar + área de contenido y coordina el estado
// del sidebar mobile (abrir/cerrar). Es la ÚNICA pieza cliente del layout; las
// páginas siguen siendo Server Components. Cierra el sidebar al cambiar de ruta y
// con Escape (a11y de teclado). La `sesion` llega ya resuelta desde el server.
//
// Drawer mobile (< lg): bloquea el scroll del fondo, deja el resto de la página
// `inert` (el foco queda dentro del drawer), lleva el foco al botón de cerrar al
// abrir y lo devuelve al botón de menú al cerrar. Si la ventana pasa a lg (rotar
// la tablet), se cierra solo.

const LG = "(min-width: 64rem)";

export function PanelShell({
  children,
  sesion,
  pendientes = {},
}: {
  children: React.ReactNode;
  sesion: UsuarioSesion;
  pendientes?: Pendientes;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const estabaAbierto = useRef(false);

  // Escape + cierre automático al pasar a desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mq = window.matchMedia(LG);
    const onMq = () => {
      if (mq.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  // Scroll lock del fondo + manejo de foco.
  useEffect(() => {
    if (open) {
      estabaAbierto.current = true;
      const html = document.documentElement;
      const prev = html.style.overflow;
      html.style.overflow = "hidden";
      document.getElementById("panel-sidebar-cerrar")?.focus();
      return () => {
        html.style.overflow = prev;
      };
    }
    if (estabaAbierto.current) {
      estabaAbierto.current = false;
      // Devolver el foco al botón que abrió el drawer.
      document.getElementById("panel-menu-btn")?.focus({ preventScroll: true });
    }
  }, [open]);

  return (
    <ToastProvider>
    <div data-area="panel" className="min-h-dvh bg-bone lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
      <Sidebar open={open} onClose={() => setOpen(false)} sesion={sesion} pendientes={pendientes} />
      <div className="flex min-w-0 flex-col" inert={open}>
        <Topbar onOpenMenu={() => setOpen(true)} menuAbierto={open} sesion={sesion} />
        <main
          id="panel-main"
          className="flex-1 pt-6 pr-[max(1rem,env(safe-area-inset-right))] pb-[max(3rem,calc(env(safe-area-inset-bottom)+2rem))] pl-[max(1rem,env(safe-area-inset-left))] focus:outline-none sm:pt-8 md:pt-10 md:pr-[max(2rem,env(safe-area-inset-right))] md:pl-[max(2rem,env(safe-area-inset-left))] lg:pl-10 lg:pr-[max(2.5rem,env(safe-area-inset-right))] 2xl:pl-14 2xl:pr-14"
          tabIndex={-1}
        >
          {/* Ancho de lectura cómodo: 72rem; en monitores muy anchos se abre un poco
              (las tablas lo aprovechan). En 4K el root font-size ya escala todo. */}
          <div key={pathname} className="panel-enter mx-auto w-full max-w-6xl min-[1800px]:max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
    </ToastProvider>
  );
}
