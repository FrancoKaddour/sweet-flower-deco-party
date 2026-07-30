"use client";

import { useState } from "react";

// Tipos de consulta → ayudan a rutear el lead (producto / a medida / evento).
const TIPOS = [
  "Producto del catálogo",
  "Presupuesto a medida",
  "El evento (Summit)",
  "Otra consulta",
] as const;
type Tipo = (typeof TIPOS)[number];

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const inputBase =
  "mt-2 w-full border-b border-line bg-transparent pb-3 font-sans text-[length:var(--text-step-0)] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink";
const labelBase =
  "text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-ink/60";

/**
 * Formulario de contacto / captura de lead. Client Component: validación en vivo
 * y estado de éxito. La persistencia real (colección de leads) la conecta Gonzalo
 * vía Server Action / route handler — ver TODO(backend). Hoy muestra éxito
 * optimista sin guardar, para no fingir un envío que aún no existe.
 */
export function ContactForm() {
  const [tipo, setTipo] = useState<Tipo>(TIPOS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nombre = String(data.get("nombre") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const mensaje = String(data.get("mensaje") ?? "").trim();

    const errs: Record<string, string> = {};
    if (!nombre) errs.nombre = "Contanos tu nombre.";
    if (!EMAIL_RE.test(email)) errs.email = "Ingresá un email válido.";
    if (!mensaje) errs.mensaje = "Escribinos un mensaje.";

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = document.getElementById(Object.keys(errs)[0]);
      first?.focus();
      return;
    }

    // TODO(backend): enviar el lead a la colección de Payload (Server Action /
    // route handler) — tarea de Gonzalo. Por ahora, éxito optimista sin persistir.
    setDone(true);
  };

  if (done) {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-line bg-cloud p-10"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-[length:var(--text-step-1)] text-bone">
          ✓
        </span>
        <h3 className="font-display text-[length:var(--text-step-3)] font-bold uppercase leading-[0.95] text-ink">
          ¡Gracias! Te respondemos pronto
        </h3>
        <p className="max-w-[42ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/70">
          Recibimos tu mensaje. Flor o Tobías se van a poner en contacto a la
          brevedad para ayudarte con tu evento.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      {/* Tipo de consulta */}
      <fieldset>
        <legend className={labelBase}>Tu consulta es sobre</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <label key={t} className="cursor-pointer">
              <input
                type="radio"
                name="tipo"
                value={t}
                checked={tipo === t}
                onChange={() => setTipo(t)}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-11 items-center rounded-[var(--radius-pill)] border border-line px-5 text-[length:var(--text-step--1)] text-ink/70 transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-bone peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-champagne">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Nombre + Email */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className={labelBase}>
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            placeholder="Cómo te llamás"
            aria-invalid={!!errors.nombre}
            aria-describedby={errors.nombre ? "nombre-error" : undefined}
            className={inputBase}
          />
          {errors.nombre && (
            <p id="nombre-error" className="mt-2 text-[length:var(--text-step--1)] text-bordeaux">
              {errors.nombre}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className={labelBase}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputBase}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-[length:var(--text-step--1)] text-bordeaux">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* WhatsApp (opcional) */}
      <div>
        <label htmlFor="telefono" className={labelBase}>
          WhatsApp <span className="normal-case tracking-normal text-ink/40">(opcional)</span>
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          autoComplete="tel"
          placeholder="Por si preferís que te escribamos"
          className={inputBase}
        />
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="mensaje" className={labelBase}>
          Contanos tu evento
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={4}
          placeholder="Qué necesitás, para cuándo y dónde. Cuanto más nos cuentes, mejor te ayudamos."
          aria-invalid={!!errors.mensaje}
          aria-describedby={errors.mensaje ? "mensaje-error" : undefined}
          className={`${inputBase} resize-none`}
        />
        {errors.mensaje && (
          <p id="mensaje-error" className="mt-2 text-[length:var(--text-step--1)] text-bordeaux">
            {errors.mensaje}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="inline-flex min-h-11 w-max items-center gap-2 rounded-[var(--radius-pill)] bg-ink px-8 py-3.5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-bone transition-transform duration-[400ms] ease-[var(--ease-out-expo)] hover:-translate-y-0.5"
      >
        Enviar consulta
      </button>
    </form>
  );
}
