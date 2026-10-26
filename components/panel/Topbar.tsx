"use client";

import { salir } from "@/lib/auth/actions";
import { IconMenu } from "@/components/panel/icons";
import { ROL_LABEL, type UsuarioSesion } from "@/lib/panel/types";

// Topbar del panel — sobria (el peso editorial lo lleva el PageHeader de cada
// página, no la topbar). Botón hamburguesa (mobile) + fecha (es-AR) + usuario de
// sesión + logout. No duplica la descripción de la sección: eso vive en el PageHeader.

type TopbarProps = {
  /** Abre el sidebar en mobile. */
  onOpenMenu: () => void;
  /** Si el drawer mobile está abierto (para aria-expanded). */
  menuAbierto?: boolean;
  /** Usuario de la sesión activa (resuelto en el server). */
  sesion: UsuarioSesion;
};

// Fecha larga en es-AR ("martes, 29 de julio de 2026"), capitalizada.
function fechaHoy(corta = false): string {
  const f = new Intl.DateTimeFormat(
    "es-AR",
    corta
      ? { weekday: "short", day: "numeric", month: "short" }
      : { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  )
    .format(new Date())
    .replace(/\./g, "");
  return f.charAt(0).toUpperCase() + f.slice(1);
}

export function Topbar({ onOpenMenu, sesion, menuAbierto = false }: TopbarProps) {
  return (
    // Safe areas: en iPhone con notch (viewport-fit=cover) la barra respeta el
    // borde superior y los laterales en horizontal.
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-bone/85 pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-3 pl-[max(1rem,env(safe-area-inset-left))] backdrop-blur-md sm:gap-4 md:pr-[max(2rem,env(safe-area-inset-right))] md:pl-[max(2rem,env(safe-area-inset-left))] lg:pl-8">
      <button
        type="button"
        onClick={onOpenMenu}
        id="panel-menu-btn"
        aria-expanded={menuAbierto}
        aria-controls="panel-sidebar"
        aria-label="Abrir navegación"
        className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border border-line bg-cloud text-ink transition-colors hover:border-ink/30 lg:hidden"
      >
        <IconMenu />
      </button>

      <div className="min-w-0 flex-1">
        {/* Fecha del día en es-AR — contexto sobrio, sin competir con el H1. */}
        <p className="truncate text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-muted">
          {/* Corta en celular ("Vie 23 oct") para no truncar; larga desde sm. */}
          <span className="sm:hidden">{fechaHoy(true)}</span>
          <span className="max-sm:hidden">{fechaHoy()}</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-right sm:block">
          <span className="block text-[length:var(--text-step--1)] font-medium text-ink">
            {sesion.nombre}
          </span>
          <span className="block text-[length:var(--text-step--1)] uppercase tracking-[0.1em] text-muted">
            {ROL_LABEL[sesion.rol]}
          </span>
        </span>
        <form action={salir.bind(null, "/panel/login")}>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center rounded-[var(--radius-pill)] border border-line bg-cloud px-4 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink/30"
          >
            Salir
          </button>
        </form>
      </div>
    </header>
  );
}
