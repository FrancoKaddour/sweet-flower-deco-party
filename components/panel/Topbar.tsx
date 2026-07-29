"use client";

import Link from "next/link";
import { IconMenu } from "@/components/panel/icons";
import type { UsuarioSesion } from "@/lib/panel/types";

// Topbar del panel — sobria (el peso editorial lo lleva el PageHeader de cada
// página, no la topbar). Botón hamburguesa (mobile) + fecha (es-AR) + usuario de
// sesión + logout. No duplica la descripción de la sección: eso vive en el PageHeader.

type TopbarProps = {
  /** Abre el sidebar en mobile. */
  onOpenMenu: () => void;
  /** Usuario de la sesión activa (resuelto en el server). */
  sesion: UsuarioSesion;
};

// Fecha larga en es-AR ("martes, 29 de julio de 2026"), capitalizada.
function fechaHoy(): string {
  const f = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  return f.charAt(0).toUpperCase() + f.slice(1);
}

export function Topbar({ onOpenMenu, sesion }: TopbarProps) {
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
        {/* Fecha del día en es-AR — contexto sobrio, sin competir con el H1. */}
        <p className="truncate text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-muted">
          {fechaHoy()}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-right sm:block">
          <span className="block text-[length:var(--text-step--1)] font-medium text-ink">
            {sesion.nombre}
          </span>
          <span className="block text-[length:var(--text-step--1)] uppercase tracking-[0.1em] text-muted">
            {sesion.rol}
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
