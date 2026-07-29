"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PANEL_NAV, esRutaActiva } from "@/components/panel/nav";
import { IconCerrar } from "@/components/panel/icons";
import { USUARIO_SESION } from "@/lib/panel/mock";

// Sidebar del panel — ancla oscura (ink) con texto bone, en el registro EDITORIAL
// del sitio (ver components/site/Header.tsx): wordmark "Sweet Flowers" en display,
// nav NUMERADA (01/02… en champagne) y labels en versalitas. El champagne va como
// TEXTO acá porque el fondo es oscuro (ink) — contraste OK (docs/06 §7).
//
// Estado activo: barra champagne a la izquierda + texto bone. En desktop es fija;
// en mobile se muestra como panel deslizable controlado por `open` (PanelShell).
// Nav semántico (<nav>, <ul>). Cada link es touch-target ≥44px.

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
        {/* Marca — wordmark display, como el Header del sitio. + cerrar (mobile) */}
        <div className="flex items-start justify-between px-7 pt-8 pb-6">
          <Link
            href="/panel"
            onClick={onClose}
            className="font-display text-[length:var(--text-step-2)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone"
            aria-label="Sweet Flowers — inicio del panel"
          >
            Sweet
            <br />
            Flowers
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar navegación"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-bone/70 transition-colors hover:text-bone lg:hidden"
          >
            <IconCerrar />
          </button>
        </div>

        <p className="px-7 pb-6 text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-champagne">
          Centro de operaciones
        </p>

        <nav className="flex-1 overflow-y-auto px-4">
          <ul className="flex flex-col gap-0.5">
            {PANEL_NAV.map((item, i) => {
              const activo = esRutaActiva(item.href, pathname);
              const numero = String(i + 1).padStart(2, "0");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={activo ? "page" : undefined}
                    className={`group relative flex min-h-11 items-center gap-3 rounded-[var(--radius-sm)] py-2.5 pl-4 pr-3 transition-colors duration-200 ${
                      activo
                        ? "bg-bone/[0.07] text-bone"
                        : "text-bone/60 hover:bg-bone/[0.04] hover:text-bone"
                    }`}
                  >
                    {/* Barra de acento champagne del ítem activo */}
                    <span
                      className={`absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-champagne transition-opacity duration-200 ${
                        activo ? "opacity-100" : "opacity-0"
                      }`}
                      aria-hidden="true"
                    />
                    {/* Numeración editorial 01/02… en champagne (como el Header) */}
                    <span
                      className={`shrink-0 font-sans text-[length:var(--text-step--1)] tabular-nums ${
                        activo
                          ? "text-champagne"
                          : "text-bone/40 group-hover:text-champagne/80"
                      }`}
                      aria-hidden="true"
                    >
                      {numero}
                    </span>
                    <span className="text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.12em]">
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sesión (mock) — pb-16 para no quedar tapado por el badge de dev de Next. */}
        <div className="mt-auto border-t border-bone/10 px-7 pt-6 pb-16">
          <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-bone/45">
            Sesión (mock)
          </p>
          <p className="mt-2 font-display text-[length:var(--text-step-1)] font-bold text-bone">
            {USUARIO_SESION.nombre}
          </p>
          <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-champagne">
            {USUARIO_SESION.rol}
          </p>
        </div>
      </aside>
    </>
  );
}
