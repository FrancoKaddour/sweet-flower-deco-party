"use client";

import { useState } from "react";
import { cerrarSesionesDe } from "@/lib/auth/sesiones";
import { useAccion } from "@/components/panel/Toast";

/** "Cerrar sesiones" de una persona en todos sus dispositivos (S-09). Solo admin. */
export function CerrarSesiones({ email, esYo }: { email: string; esYo: boolean }) {
  const [seguro, setSeguro] = useState(false);
  const [pendiente, correr] = useAccion();
  if (!seguro)
    return (
      <button type="button" onClick={() => setSeguro(true)} className="inline-flex min-h-11 items-center text-[length:var(--text-step--1)] text-muted underline-offset-4 hover:text-bordeaux hover:underline">
        Cerrar sesiones
      </button>
    );
  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 text-[length:var(--text-step--1)]">
      <span className="text-muted">{esYo ? "¿Cerrar también esta sesión?" : "¿Cerrar sus sesiones en todos los dispositivos?"}</span>
      <button
        type="button"
        disabled={pendiente}
        onClick={() =>
          correr(async () => {
            const r = await cerrarSesionesDe(email);
            setSeguro(false);
            return r;
          })
        }
        className="inline-flex min-h-11 items-center font-medium text-bordeaux hover:underline disabled:opacity-50"
      >
        {pendiente ? "Cerrando…" : "Sí, cerrar"}
      </button>
      <button type="button" onClick={() => setSeguro(false)} className="inline-flex min-h-11 items-center text-muted hover:text-ink">
        No
      </button>
    </span>
  );
}
