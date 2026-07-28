"use client";

import { useState } from "react";
import { PanelButton } from "@/components/panel/PanelButton";
import { SEGMENTOS_CONTACTOS } from "@/lib/panel/mock";

// "Nueva campaña" — disclosure con un form mock (asunto + cuerpo + segmento).
// No envía nada: es andamiaje. El envío real va por la API de Resend y SOLO a
// contactos con opt-in del segmento elegido.
//
// 🔌 GONZALO: al enviar, creá un EmailCampaign (estado borrador/enviada) y
// disparalo por Resend filtrando el segmento por consent.optIn = true.
export function NuevaCampana() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <PanelButton
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="form-nueva-campana"
        >
          {open ? "Cancelar" : "Nueva campaña"}
        </PanelButton>
      </div>

      {open ? (
        <form
          id="form-nueva-campana"
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-5 rounded-[var(--radius-md)] border border-line bg-cloud p-6"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="camp-asunto"
              className="text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-muted"
            >
              Asunto
            </label>
            <input
              id="camp-asunto"
              type="text"
              placeholder="Asunto del email…"
              className="min-h-11 rounded-[var(--radius-sm)] border border-line bg-bone px-4 text-[length:var(--text-step-0)] text-ink placeholder:text-muted focus:border-champagne focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="camp-segmento"
              className="text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-muted"
            >
              Segmento de contactos
            </label>
            <select
              id="camp-segmento"
              className="min-h-11 rounded-[var(--radius-sm)] border border-line bg-bone px-4 text-[length:var(--text-step-0)] text-ink focus:border-champagne focus:outline-none"
            >
              {SEGMENTOS_CONTACTOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="camp-cuerpo"
              className="text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-muted"
            >
              Cuerpo
            </label>
            <textarea
              id="camp-cuerpo"
              rows={6}
              placeholder="Escribí el contenido del email…"
              className="rounded-[var(--radius-sm)] border border-line bg-bone px-4 py-3 text-[length:var(--text-step-0)] text-ink placeholder:text-muted focus:border-champagne focus:outline-none"
            />
          </div>

          <p className="text-[length:var(--text-step--1)] text-muted">
            Se enviará <strong className="text-ink">solo a contactos con opt-in</strong>{" "}
            del segmento elegido (requisito legal).
          </p>

          <div className="flex flex-wrap justify-end gap-3">
            {/* 🔌 GONZALO: crear/enviar el EmailCampaign por Resend (hoy son mock). */}
            <PanelButton
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              title="Pendiente: guardar borrador"
            >
              Guardar borrador
            </PanelButton>
            <PanelButton
              type="submit"
              variant="solid"
              title="Pendiente: enviar campaña"
            >
              Enviar campaña
            </PanelButton>
          </div>
        </form>
      ) : null}
    </div>
  );
}
