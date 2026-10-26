"use client";

import { useTransition } from "react";
import { borrarProducto, duplicarProducto } from "@/modules/catalog/actions";

/** Duplicar / borrar (con confirmación). Borrar es lógico y queda auditado. */
export function AccionesProducto({ id, nombre, puedeBorrar }: { id: string; nombre: string; puedeBorrar: boolean }) {
  const [pendiente, start] = useTransition();
  const btn =
    "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-pill)] px-5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] disabled:opacity-50";
  return (
    <div className="grid grid-cols-1 gap-3 min-[400px]:flex min-[400px]:flex-wrap">
      <button type="button" disabled={pendiente} onClick={() => start(() => duplicarProducto(id))} className={`${btn} border border-ink/20 text-ink`}>
        Duplicar
      </button>
      {puedeBorrar && (
        <button
          type="button"
          disabled={pendiente}
          onClick={() => {
            if (window.confirm(`¿Borrar "${nombre}"? Deja de verse en el sitio.`)) start(() => borrarProducto(id));
          }}
          className={`${btn} border border-bordeaux/30 text-bordeaux`}
        >
          Borrar producto
        </button>
      )}
    </div>
  );
}
