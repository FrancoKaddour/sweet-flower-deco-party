"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { CLUB, DESCUENTO_BIENVENIDA, INTERESES } from "@/content/newsletter";
import { suscribirNewsletter, type EstadoSuscripcion } from "@/modules/newsletter/publico";

const campo =
  "w-full border-b border-bone/30 bg-transparent py-3 text-[length:var(--text-step-0)] text-bone placeholder:text-bone/45 transition-colors focus:border-champagne focus:outline-none";

export function NewsletterForm() {
  const [estado, accion, pendiente] = useActionState<EstadoSuscripcion, FormData>(suscribirNewsletter, null);
  const [copiado, setCopiado] = useState(false);

  if (estado?.ok && estado.tipo === "nuevo") {
    const copiar = async () => {
      try {
        await navigator.clipboard.writeText(estado.codigo);
        setCopiado(true);
      } catch {
        /* sin permiso de portapapeles: el código queda visible igual */
      }
    };
    return (
      <div role="status" className="rounded-[var(--radius-lg)] border border-champagne/40 bg-ink/25 p-8 md:p-10">
        <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-champagne">
          {estado.nombre ? `¡Bienvenida, ${estado.nombre.split(" ")[0]}!` : "¡Ya estás adentro!"}
        </p>
        <p className="mt-4 text-bone/85">Tu código de {DESCUENTO_BIENVENIDA}% para el primer pedido:</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <span className="rounded-[var(--radius-md)] border border-dashed border-champagne bg-bone px-5 py-3 font-mono text-[length:var(--text-step-2)] font-bold tracking-[0.12em] text-bordeaux">
            {estado.codigo}
          </span>
          <button
            type="button"
            onClick={copiar}
            className="text-[0.75rem] font-medium uppercase tracking-[0.14em] text-bone underline-offset-4 hover:underline"
          >
            {copiado ? "¡Copiado!" : "Copiar"}
          </button>
        </div>
        <p className="mt-5 text-[length:var(--text-step--1)] leading-relaxed text-bone/70">
          También te lo mandamos por mail. Mencionalo cuando nos mandes tu pedido por WhatsApp.
        </p>
        <Link
          href="/productos"
          className="mt-8 inline-flex items-center gap-2 border-b border-bone pb-1 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-bone"
        >
          Elegir mis piezas <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  if (estado?.ok) {
    return (
      <div role="status" className="rounded-[var(--radius-lg)] border border-champagne/40 bg-ink/25 p-8 md:p-10">
        <p className="font-display text-[length:var(--text-step-2)] font-bold uppercase leading-tight text-bone">
          {estado.tipo === "reactivado" ? "¡Qué bueno tenerte de vuelta!" : "¡Ya eras parte del club!"}
        </p>
        <p className="mt-4 text-bone/80">
          {estado.tipo === "reactivado"
            ? "Te mandamos de nuevo tu código de bienvenida por mail."
            : "Buscá tu código de bienvenida en tu mail (revisá también Promociones o Spam)."}
        </p>
      </div>
    );
  }

  return (
    <form action={accion} className="flex flex-col gap-6" aria-describedby="club-legal">
      <input type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label className="flex flex-col gap-1">
        <span className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-bone/60">Tu nombre</span>
        <input name="nombre" autoComplete="given-name" maxLength={80} placeholder="Opcional" className={campo} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-bone/60">Tu email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          maxLength={200}
          placeholder="nombre@email.com"
          aria-invalid={estado?.ok === false ? true : undefined}
          className={campo}
        />
      </label>

      <fieldset>
        <legend className="mb-3 text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-bone/60">
          Me interesa <span className="normal-case tracking-normal text-bone/40">(opcional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {INTERESES.map((i) => (
            <label key={i.v} className="cursor-pointer">
              <input type="checkbox" name="intereses" value={i.v} className="peer sr-only" />
              <span className="inline-flex min-h-10 items-center rounded-full border border-bone/30 px-4 text-[length:var(--text-step--1)] text-bone/80 transition-colors peer-checked:border-champagne peer-checked:bg-champagne peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-champagne">
                {i.l}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {estado?.ok === false && (
        <p role="alert" className="text-[length:var(--text-step--1)] text-champagne">
          {estado.mensaje}
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente}
        className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-bone px-8 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-champagne disabled:opacity-60"
      >
        {pendiente ? "Sumándote…" : `Quiero mi ${DESCUENTO_BIENVENIDA}%`}
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>
      <p id="club-legal" className="text-[length:var(--text-step--1)] leading-relaxed text-bone/55">
        {CLUB.legal}
      </p>
    </form>
  );
}
