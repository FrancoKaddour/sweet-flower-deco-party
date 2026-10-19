"use client";

import { useState } from "react";
import {
  EVENT_NAME,
  EDICION_LABEL,
  EVENT_WHEN,
  EVENT_MP_LINK,
  EVENT_WHATSAPP,
} from "@/content/evento";

/**
 * Inscripción al Summit — lo que pidió Flor (§18):
 * 1) el que quiere pagar directo → botón de Mercado Pago (cuotas);
 * 2) el que quiere algo más personalizado → formulario que abre WhatsApp
 *    (línea de capacitaciones) con los datos ya escritos, para seguimiento 1 a 1.
 * Sin backend: el formulario arma el mensaje y abre wa.me.
 */
const FORMAS = ["Mercado Pago en cuotas", "Transferencia", "Tengo dudas antes de reservar"] as const;

export function SummitInscripcion() {
  const [enviado, setEnviado] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const msg = [
      `¡Hola! Quiero reservar mi lugar en el ${EVENT_NAME} (${EDICION_LABEL}, ${EVENT_WHEN}).`,
      `Nombre: ${f.get("nombre")}`,
      `Ciudad: ${f.get("ciudad")}`,
      `Cómo quiero reservar: ${f.get("forma")}`,
      f.get("mensaje") ? `Consulta: ${f.get("mensaje")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`https://wa.me/${EVENT_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    setEnviado(true);
  };

  const field =
    "w-full border-b border-bone/30 bg-transparent py-3 text-[length:var(--text-step-0)] text-bone placeholder:text-bone/40 focus:border-champagne focus:outline-none";
  const label = "text-[0.7rem] uppercase tracking-[0.16em] text-bone/55";

  return (
    <div className="flex flex-col gap-8">
      {EVENT_MP_LINK && (
        <div>
          <a
            href={EVENT_MP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-bone px-6 text-[0.8rem] font-medium uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-champagne"
          >
            Pagar con Mercado Pago
            <span aria-hidden="true">↗</span>
          </a>
          <p className="mt-3 text-center text-[length:var(--text-step--1)] text-bone/55">
            Pagás online y elegís las cuotas.
          </p>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-6" aria-label="Reservar por WhatsApp">
        {EVENT_MP_LINK && (
          <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-bone/55">
            O reservá con atención personalizada
          </p>
        )}
        <label className="flex flex-col gap-1">
          <span className={label}>Nombre y apellido</span>
          <input name="nombre" required autoComplete="name" className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={label}>Ciudad</span>
          <input name="ciudad" required autoComplete="address-level2" className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={label}>¿Cómo querés reservar?</span>
          <select name="forma" required defaultValue={FORMAS[0]} className={`${field} [&>option]:text-ink`}>
            {FORMAS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className={label}>Consulta (opcional)</span>
          <textarea name="mensaje" rows={2} className={`${field} resize-none`} />
        </label>
        <button
          type="submit"
          className="mt-2 flex min-h-14 w-full items-center justify-center gap-3 rounded-full border border-bone px-6 text-[0.8rem] font-medium uppercase tracking-[0.14em] text-bone transition-colors duration-300 hover:bg-bone hover:text-ink"
        >
          Reservar por WhatsApp
          <span aria-hidden="true">→</span>
        </button>
        <p className="text-center text-[length:var(--text-step--1)] text-bone/55" aria-live="polite">
          {enviado
            ? "Se abrió WhatsApp con tus datos: solo tenés que enviar el mensaje."
            : "Te abre WhatsApp con tus datos y te respondemos en persona."}
        </p>
      </form>
    </div>
  );
}
