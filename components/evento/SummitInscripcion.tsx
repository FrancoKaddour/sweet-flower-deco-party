"use client";

import { useState } from "react";
import {
  EVENT_NAME,
  EDICION_LABEL,
  EVENT_WHEN,
  EVENT_WHATSAPP,
  PASES,
  preventaVigente,
} from "@/content/evento";
import { formatARS } from "@/content/productos";

/**
 * Inscripción al Summit — TODO por WhatsApp (sin pago en el sitio, oct-2026):
 * el formulario arma el mensaje con los datos y abre la línea de capacitaciones
 * para coordinar la reserva y el pago de la preventa 1 a 1.
 */
const FORMAS = ["Transferencia", "Link de Mercado Pago", "Tengo dudas antes de reservar"] as const;

export function SummitInscripcion() {
  const [enviado, setEnviado] = useState(false);
  const [pase, setPase] = useState<(typeof PASES)[number]["id"]>("vip");
  const pv = preventaVigente();
  const precio = pv?.precios[pase];

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const msg = [
      `¡Hola! Quiero reservar mi lugar en el ${EVENT_NAME} (${EDICION_LABEL}, ${EVENT_WHEN}).`,
      `Pase: ${PASES.find((p) => p.id === pase)?.nombre}${pv ? ` (${pv.nombre}, ${pv.hastaLabel})` : ""}`,
      `Nombre: ${f.get("nombre")}`,
      `Ciudad: ${f.get("ciudad")}`,
      `Cómo prefiero pagar: ${f.get("forma")}`,
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
      <form onSubmit={onSubmit} className="flex flex-col gap-6" aria-label="Reservar por WhatsApp">
        <fieldset className="flex flex-col gap-2">
          <legend className={`${label} mb-2`}>Pase</legend>
          <div className="grid grid-cols-2 gap-2">
            {PASES.map((p) => (
              <label
                key={p.id}
                className={`flex min-h-12 cursor-pointer items-center justify-center rounded-full border text-[0.75rem] uppercase tracking-[0.12em] transition-colors ${
                  pase === p.id ? "border-bone bg-bone text-ink" : "border-bone/30 text-bone hover:border-bone/70"
                }`}
              >
                <input
                  type="radio"
                  name="pase"
                  value={p.id}
                  checked={pase === p.id}
                  onChange={() => setPase(p.id)}
                  className="sr-only"
                />
                {p.nombre}
              </label>
            ))}
          </div>
          {precio && pv && (
            <p className="text-[length:var(--text-step--1)] text-bone/65">
              {pv.nombre} ({pv.hastaLabel}): {formatARS(precio.transferencia)} por transferencia ·{" "}
              {formatARS(precio.mp)} por link de Mercado Pago
            </p>
          )}
        </fieldset>
        <label className="flex flex-col gap-1">
          <span className={label}>Nombre y apellido</span>
          <input name="nombre" required autoComplete="name" className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={label}>Ciudad</span>
          <input name="ciudad" required autoComplete="address-level2" className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={label}>¿Cómo preferís pagar?</span>
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
          className="mt-2 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-bone px-6 text-[0.8rem] font-medium uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-champagne"
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
