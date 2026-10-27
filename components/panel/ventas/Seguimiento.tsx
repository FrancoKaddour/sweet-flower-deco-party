"use client";

import { useActionState } from "react";
import { guardarSeguimiento, type TipoRegistro } from "@/modules/ventas/actions";
import { inputCls } from "@/components/panel/catalogo/campos";
import { PanelButton } from "@/components/panel/PanelButton";

/** Teléfono + nota interna (solo la ve el equipo). */
export function Seguimiento({
  tipo,
  id,
  telefono,
  nota,
}: {
  tipo: TipoRegistro;
  id: string;
  telefono: string | null;
  nota: string | null;
}) {
  const [estado, accion, pendiente] = useActionState(guardarSeguimiento.bind(null, tipo, id), null);
  return (
    <form action={accion} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-muted">Celular / WhatsApp</span>
        <input
          name="telefono"
          defaultValue={telefono ?? ""}
          inputMode="tel"
          placeholder="Ej. 11 5106 4010"
          className={inputCls}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-muted">Nota interna</span>
        <textarea
          name="notaInterna"
          defaultValue={nota ?? ""}
          rows={3}
          placeholder="Seña, fecha de entrega, lo que haga falta recordar…"
          className={`${inputCls} resize-y`}
        />
      </label>
      <div className="flex items-center gap-4">
        <PanelButton type="submit" variant="outline" disabled={pendiente}>
          {pendiente ? "Guardando…" : "Guardar"}
        </PanelButton>
        {estado && (
          <p role={estado.ok ? "status" : "alert"} className={estado.ok ? "text-ink" : "text-bordeaux"}>
            {estado.mensaje}
          </p>
        )}
      </div>
    </form>
  );
}
