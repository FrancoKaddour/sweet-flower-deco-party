"use client";

import { useActionState, useOptimistic, useTransition } from "react";
import { agregarSuscriptor, cambiarEstadoSuscriptor, marcarCodigo, type EstadoCampanaForm } from "@/modules/newsletter/actions";
import { inputCls } from "@/components/panel/catalogo/campos";
import { PanelButton } from "@/components/panel/PanelButton";

/** Interruptor "código usado" (se valida por WhatsApp). */
export function CodigoUsado({ id, usado, codigo }: { id: string; usado: boolean; codigo: string }) {
  const [opt, setOpt] = useOptimistic(usado);
  const [, start] = useTransition();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={opt}
      aria-label={`Código ${codigo} usado: ${opt ? "sí" : "no"}`}
      onClick={() =>
        start(async () => {
          setOpt(!opt);
          await marcarCodigo(id, !opt);
        })
      }
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${opt ? "bg-ink" : "bg-line"}`}
    >
      <span className={`inline-block size-5 rounded-full bg-cloud shadow transition-transform ${opt ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export function EstadoSuscriptor({ id, activo }: { id: string; activo: boolean }) {
  const [pendiente, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pendiente}
      onClick={() => start(() => cambiarEstadoSuscriptor(id, activo ? "baja" : "activo"))}
      className="inline-flex min-h-11 items-center text-[length:var(--text-step--1)] text-muted underline-offset-4 hover:text-ink hover:underline disabled:opacity-50"
    >
      {activo ? "Dar de baja" : "Reactivar"}
    </button>
  );
}

export function AltaSuscriptor() {
  const [estado, accion, pendiente] = useActionState<EstadoCampanaForm, FormData>(agregarSuscriptor, null);
  return (
    <form action={accion} className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-cloud p-5">
      <p className="font-medium text-ink">Agregar a mano</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input name="email" type="email" required placeholder="email@ejemplo.com" aria-label="Email" className={inputCls} />
        <input name="nombre" placeholder="Nombre (opcional)" aria-label="Nombre" className={inputCls} />
      </div>
      <label className="flex cursor-pointer items-start gap-3 py-1 text-[length:var(--text-step--1)] text-muted">
        <input type="checkbox" name="consentimiento" className="mt-0.5 size-5 shrink-0 accent-[var(--color-ink)]" />
        La persona me pidió recibir novedades (por WhatsApp, en persona, etc.).
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <PanelButton type="submit" variant="outline" disabled={pendiente}>
          {pendiente ? "Agregando…" : "Agregar"}
        </PanelButton>
        {estado && <p role="status" className={estado.ok ? "text-botanical" : "text-bordeaux"}>{estado.mensaje}</p>}
      </div>
    </form>
  );
}
