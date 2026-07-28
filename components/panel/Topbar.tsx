"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PANEL_NAV, esRutaActiva } from "@/components/panel/nav";
import { IconMenu } from "@/components/panel/icons";
import { USUARIO_SESION } from "@/lib/panel/mock";

// Topbar del panel: botón hamburguesa (mobile), título de la sección activa,
// usuario mock + logout mock. El título se deriva de la ruta activa vía PANEL_NAV.
// El botón de logout es UI (sin auth real): la aporta Payload.

type TopbarProps = {
  /** Abre el sidebar en mobile. */
  onOpenMenu: () => void;
};

export function Topbar({ onOpenMenu }: TopbarProps) {
  const pathname = usePathname();
  const seccion =
    PANEL_NAV.find((item) => esRutaActiva(item.href, pathname)) ?? PANEL_NAV[0];

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-line bg-bone/85 px-4 py-3 backdrop-blur-md md:px-8">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Abrir navegación"
        className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border border-line bg-cloud text-ink transition-colors hover:border-ink/30 lg:hidden"
      >
        <IconMenu />
      </button>

      <div className="min-w-0 flex-1">
        {/* Solo el label del módulo. La descripción la trae el PageHeader de cada
            página — no la duplicamos acá pegada. */}
        <p className="truncate text-[length:var(--text-step-0)] font-semibold text-ink">
          {seccion.label}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-right sm:block">
          <span className="block text-[length:var(--text-step--1)] font-medium text-ink">
            {USUARIO_SESION.nombre}
          </span>
          <span className="block text-[length:var(--text-step--1)] uppercase tracking-[0.1em] text-muted">
            {USUARIO_SESION.rol}
          </span>
        </span>
        {/* 🔌 GONZALO: logout real → cerrar la sesión de Payload y redirigir a /panel/login */}
        <Link
          href="/panel/login"
          className="inline-flex min-h-11 items-center rounded-[var(--radius-pill)] border border-line bg-cloud px-4 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink/30"
        >
          Salir
        </Link>
      </div>
    </header>
  );
}
