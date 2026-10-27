"use client";

import { useState } from "react";
import { borrarProducto, duplicarProducto } from "@/modules/catalog/actions";
import { useAccion } from "@/components/panel/Toast";

/** Duplicar / mandar a la papelera (confirmación en dos pasos, se puede restaurar). */
export function AccionesProducto({ id, nombre, puedeBorrar }: { id: string; nombre: string; puedeBorrar: boolean }) {
  const [pendiente, correr] = useAccion();
  const [seguro, setSeguro] = useState(false);
  const btn =
    "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-pill)] px-5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] disabled:opacity-50";
  return (
    <div className="grid grid-cols-1 gap-3 min-[400px]:flex min-[400px]:flex-wrap min-[400px]:items-center">
      <button type="button" disabled={pendiente} onClick={() => correr(() => duplicarProducto(id))} className={`${btn} border border-ink/20 text-ink`}>
        Duplicar
      </button>
      {puedeBorrar &&
        (seguro ? (
          <span className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[length:var(--text-step--1)]">
            <span className="text-ink">¿Mandar “{nombre}” a la papelera? Deja de verse en el sitio; se puede restaurar.</span>
            <button type="button" disabled={pendiente} onClick={() => correr(() => borrarProducto(id))} className={`${btn} bg-bordeaux text-bone`}>
              {pendiente ? "Moviendo…" : "Sí, a la papelera"}
            </button>
            <button type="button" onClick={() => setSeguro(false)} className="inline-flex min-h-11 items-center text-muted hover:text-ink">
              Cancelar
            </button>
          </span>
        ) : (
          <button type="button" disabled={pendiente} onClick={() => setSeguro(true)} className={`${btn} border border-bordeaux/30 text-bordeaux`}>
            Mandar a la papelera
          </button>
        ))}
    </div>
  );
}
