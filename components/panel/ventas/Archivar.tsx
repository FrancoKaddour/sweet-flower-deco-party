"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { archivarRegistro, restaurarRegistro, type TipoRegistro } from "@/modules/ventas/actions";
import { useAccion } from "@/components/panel/Toast";

/** Archivar con confirmación en dos pasos (sin diálogos del navegador) y "Deshacer". */
export function Archivar({ tipo, id, volverA }: { tipo: TipoRegistro; id: string; volverA?: string }) {
  const [seguro, setSeguro] = useState(false);
  const [pendiente, correr] = useAccion();
  const router = useRouter();
  if (!seguro)
    return (
      <button type="button" onClick={() => setSeguro(true)} className="inline-flex min-h-11 items-center text-[length:var(--text-step--1)] text-muted underline-offset-4 hover:text-bordeaux hover:underline">
        Archivar
      </button>
    );
  return (
    <span className="inline-flex flex-wrap items-center gap-x-4 text-[length:var(--text-step--1)]">
      <span className="text-muted">¿Seguro? Lo encontrás después en “Archivados”.</span>
      <button
        type="button"
        disabled={pendiente}
        onClick={() =>
          correr(
            async () => {
              const r = await archivarRegistro(tipo, id);
              if (r.ok && volverA) router.push(volverA);
              if (!r.ok) setSeguro(false);
              return r;
            },
            { deshacer: () => restaurarRegistro(tipo, id) },
          )
        }
        className="inline-flex min-h-11 items-center font-medium text-bordeaux hover:underline disabled:opacity-50"
      >
        {pendiente ? "Archivando…" : "Sí, archivar"}
      </button>
      <button type="button" onClick={() => setSeguro(false)} className="inline-flex min-h-11 items-center text-muted hover:text-ink">
        Cancelar
      </button>
    </span>
  );
}

export function Restaurar({ tipo, id }: { tipo: TipoRegistro; id: string }) {
  const [pendiente, correr] = useAccion();
  return (
    <button
      type="button"
      disabled={pendiente}
      onClick={() => correr(() => restaurarRegistro(tipo, id))}
      className="inline-flex min-h-11 items-center rounded-[var(--radius-pill)] border border-ink/20 px-5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-ink disabled:opacity-50"
    >
      {pendiente ? "Restaurando…" : "Restaurar"}
    </button>
  );
}
