"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PANEL_NAV, esRutaActiva } from "@/components/panel/nav";
import { IconCerrar } from "@/components/panel/icons";
import { USUARIO_SESION } from "@/lib/panel/mock";

// Sidebar del panel — ancla oscura (ink) con texto bone. Estado activo por ruta
// con acento champagne. En desktop es fija; en mobile se muestra como panel
// deslizable controlado por `open` (lo maneja PanelShell). Nav semántico (<nav>,
// <ul>). Cada link es touch-target ≥44px.

type SidebarProps = {
  /** Sólo relevante en mobile: si el panel deslizable está abierto. */
  open: boolean;
  /** Cierra el panel mobile (al navegar o tocar el botón). */
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Scrim mobile */}
      <div
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-ink text-bone transition-transform duration-300 ease-[var(--ease-out-expo)] lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navegación del panel"
      >
        {/* Marca + cerrar (mobile) */}
        <div className="flex items-center justify-between px-6 py-6">
          <Link
            href="/panel"
            onClick={onClose}
            className="font-display text-[length:var(--text-step-1)] font-bold leading-none tracking-tight text-bone"
          >
            Sweet&nbsp;Flowers
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar navegación"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-bone/70 transition-colors hover:text-bone lg:hidden"
          >
            <IconCerrar />
          </button>
        </div>

        <p className="px-6 pb-4 text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-champagne">
          Centro de operaciones
        </p>

        <nav className="flex-1 overflow-y-auto px-3">
          <ul className="flex flex-col gap-1">
            {PANEL_NAV.map((item) => {
              const activo = esRutaActiva(item.href, pathname);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={activo ? "page" : undefined}
                    className={`group flex min-h-11 items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-[length:var(--text-step-0)] transition-colors duration-200 ${
                      activo
                        ? "bg-bone/10 text-bone"
                        : "text-bone/65 hover:bg-bone/5 hover:text-bone"
                    }`}
                  >
                    <span
                      className={`shrink-0 transition-colors ${
                        activo
                          ? "text-champagne"
                          : "text-bone/50 group-hover:text-bone/80"
                      }`}
                    >
                      <Icon />
                    </span>
                    <span className="font-medium">{item.label}</span>
                    {activo ? (
                      <span
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-champagne"
                        aria-hidden="true"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Usuario mock — pb extra para no quedar tapado por el badge de dev de Next (esquina inf. izq). */}
        <div className="mt-auto border-t border-bone/10 px-6 pt-5 pb-16">
          <p className="text-[length:var(--text-step--1)] text-bone/50">
            Sesión (mock)
          </p>
          <p className="mt-1 font-medium text-bone">{USUARIO_SESION.nombre}</p>
          <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.1em] text-champagne">
            {USUARIO_SESION.rol}
          </p>
        </div>
      </aside>
    </>
  );
}
