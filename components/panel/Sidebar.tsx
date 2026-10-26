"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PANEL_NAV, esRutaActiva } from "@/components/panel/nav";
import { IconCerrar } from "@/components/panel/icons";
import { ROL_LABEL, type Pendientes, type UsuarioSesion } from "@/lib/panel/types";

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
  /** Usuario de la sesión activa (resuelto en el server). */
  sesion: UsuarioSesion;
  /** Contadores de cosas por atender. */
  pendientes: Pendientes;
};

// ¿Estamos en lg+ (sidebar persistente)? En el server asumimos que sí: así el
// HTML inicial nunca queda `inert` en desktop (en mobile el drawer arranca
// fuera de pantalla igual).
const LG = "(min-width: 64rem)";
const suscribir = (cb: () => void) => {
  const mq = window.matchMedia(LG);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const esDesktop = () => window.matchMedia(LG).matches;

export function Sidebar({ open, onClose, sesion, pendientes }: SidebarProps) {
  const pathname = usePathname();
  const desktop = useSyncExternalStore(suscribir, esDesktop, () => true);
  // Cerrado en mobile = fuera de pantalla: que no reciba foco ni lo lean los lectores.
  const oculto = !desktop && !open;

  return (
    <>
      {/* Scrim mobile */}
      <div
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="panel-sidebar"
        inert={oculto}
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,86vw)] flex-col overflow-y-auto overscroll-contain bg-ink pl-[env(safe-area-inset-left)] text-bone transition-[translate,box-shadow] duration-300 ease-[var(--ease-out-expo)] [scrollbar-width:thin] lg:sticky lg:top-0 lg:h-dvh lg:w-auto lg:translate-x-0 lg:shadow-none motion-reduce:transition-none ${
          open ? "translate-x-0 shadow-2xl shadow-ink/40" : "-translate-x-full"
        }`}
        aria-label="Navegación del panel"
      >
        {/* Marca — wordmark display, como el Header del sitio. + cerrar (mobile) */}
        <div className="flex items-start justify-between px-7 pt-[max(2rem,env(safe-area-inset-top))] pb-6 max-lg:pt-[max(1.25rem,env(safe-area-inset-top))]">
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
            id="panel-sidebar-cerrar"
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

        <nav className="flex-1 px-4">
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
                    className={`group relative flex min-h-12 items-center gap-3 lg:min-h-11 rounded-[var(--radius-sm)] py-2.5 pl-4 pr-3 transition-colors duration-200 ${
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
                    {item.pendientes && (pendientes[item.pendientes] ?? 0) > 0 && (
                      <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-champagne px-1.5 text-[0.7rem] font-semibold tabular-nums text-ink">
                        <span className="sr-only">Pendientes: </span>
                        {pendientes[item.pendientes]}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sesión — pb-16 para no quedar tapado por el badge de dev de Next. */}
        <div className="mt-auto border-t border-bone/10 px-7 pt-6 pb-[max(4rem,calc(env(safe-area-inset-bottom)+1.5rem))] max-lg:mt-6">
          <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-bone/45">
            Sesión
          </p>
          <p className="mt-2 font-display text-[length:var(--text-step-1)] font-bold text-bone">
            {sesion.nombre}
          </p>
          <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-champagne">
            {ROL_LABEL[sesion.rol]}
          </p>
        </div>
      </aside>
    </>
  );
}
