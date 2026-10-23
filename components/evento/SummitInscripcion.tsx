"use client";

import { useActionState, useEffect, useState } from "react";
import { EVENT_NAME, EVENT_WHATSAPP, PASES, tarifaVigente, type PaseId } from "@/content/evento";
import { formatARS } from "@/content/productos";
import { iniciarPagoSummit, type EstadoPagoSummit } from "@/modules/summit/pago";

/** Evento para preseleccionar el pase desde las tarjetas de Pases. */
export const EVENTO_ELEGIR_PASE = "sf:elegir-pase";

/**
 * Inscripción al Summit con pago online (Mercado Pago Checkout Pro): elegís el
 * pase, completás tus datos y pagás como quieras (tarjeta, cuotas, débito o
 * efectivo). Al aprobarse el pago, tu lugar queda confirmado solo.
 */
export function SummitInscripcion() {
  const [pase, setPase] = useState<PaseId>("vip");
  const [estado, accion, pendiente] = useActionState<EstadoPagoSummit, FormData>(iniciarPagoSummit, null);
  const tarifa = tarifaVigente();
  const precio = tarifa.precios[pase];

  useEffect(() => {
    const elegir = (e: Event) => {
      const id = (e as CustomEvent<PaseId>).detail;
      if (PASES.some((p) => p.id === id)) setPase(id);
    };
    window.addEventListener(EVENTO_ELEGIR_PASE, elegir);
    return () => window.removeEventListener(EVENTO_ELEGIR_PASE, elegir);
  }, []);

  // Pago creado → al checkout de Mercado Pago.
  useEffect(() => {
    if (estado?.ok) window.location.assign(estado.url);
  }, [estado]);

  const field =
    "w-full border-b border-bone/30 bg-transparent py-3 text-[length:var(--text-step-0)] text-bone placeholder:text-bone/40 focus:border-champagne focus:outline-none aria-[invalid=true]:border-champagne";
  const label = "text-[0.7rem] uppercase tracking-[0.16em] text-bone/55";
  const error = estado && !estado.ok ? estado : null;
  const inv = (c: string) => (error?.campo === c ? true : undefined);
  const wa = `https://wa.me/${EVENT_WHATSAPP}?text=${encodeURIComponent(`¡Hola! Tengo una consulta sobre la inscripción al ${EVENT_NAME}.`)}`;

  return (
    <form action={accion} className="flex flex-col gap-6" aria-label="Inscripción y pago">
      <input type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

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
              <input type="radio" name="pase" value={p.id} checked={pase === p.id} onChange={() => setPase(p.id)} className="sr-only" />
              {p.nombre}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Precio vigente, bien grande */}
      <div className="flex items-baseline justify-between gap-4 border-y border-bone/15 py-5">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-champagne">{tarifa.nombre}</p>
          <p className="text-[length:var(--text-step--1)] text-bone/55">{tarifa.hastaLabel}</p>
        </div>
        <p className="font-display text-[length:var(--text-step-4)] font-extrabold leading-none tabular-nums">{formatARS(precio)}</p>
      </div>

      <label className="flex flex-col gap-1">
        <span className={label}>Nombre y apellido</span>
        <input name="nombre" required minLength={3} autoComplete="name" aria-invalid={inv("nombre")} className={field} />
      </label>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={label}>Email</span>
          <input name="email" type="email" required autoComplete="email" inputMode="email" aria-invalid={inv("email")} className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={label}>Celular</span>
          <input name="telefono" type="tel" required autoComplete="tel" inputMode="tel" placeholder="11 5555 5555" aria-invalid={inv("telefono")} className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={label}>DNI</span>
          <input name="dni" required inputMode="numeric" autoComplete="off" aria-invalid={inv("dni")} className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={label}>Ciudad</span>
          <input name="ciudad" required autoComplete="address-level2" aria-invalid={inv("ciudad")} className={field} />
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-[var(--radius-md)] border border-champagne/50 bg-champagne/10 px-4 py-3 text-[length:var(--text-step--1)] text-bone">
          {error.mensaje}
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente || Boolean(estado?.ok)}
        className="group mt-2 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-bone px-6 text-[0.8rem] font-medium uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-champagne disabled:opacity-70"
      >
        {pendiente || estado?.ok ? "Yendo a Mercado Pago…" : `Pagar ${formatARS(precio)}`}
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>
      <p className="text-center text-[length:var(--text-step--1)] leading-relaxed text-bone/55">
        Pagás seguro con Mercado Pago: tarjeta de crédito en cuotas, débito, dinero en cuenta o efectivo.
        ¿Dudas?{" "}
        <a href={wa} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-bone">
          Escribinos
        </a>
        .
      </p>
    </form>
  );
}
