"use client";

import { startTransition, useActionState } from "react";
import Link from "next/link";
import { CLUB, DESCUENTO_BIENVENIDA, type Interes } from "@/content/newsletter";
import { suscribirNewsletter, type EstadoSuscripcion } from "@/modules/newsletter/publico";
import { Turnstile } from "@/components/captcha/Turnstile";

const campo =
  "w-full border-b border-bone/30 bg-transparent py-3 text-[length:var(--text-step-0)] text-bone placeholder:text-bone/45 transition-colors focus:border-champagne focus:outline-none";

/**
 * Formulario del Club con doble opt-in (S-13): la respuesta es siempre la misma
 * ("revisá tu mail") y el código llega recién al confirmar desde el mail.
 */
export function NewsletterForm({ interes, cta }: { interes?: Interes; cta?: string } = {}) {
  const [estado, accion, pendiente] = useActionState<EstadoSuscripcion, FormData>(suscribirNewsletter, null);
  // Con JS enviamos a mano: React 19 resetea el form tras la action y, ante un
  // error (email mal escrito), se borraba lo tipeado. action={accion} queda
  // para el envío sin JS.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    startTransition(() => accion(datos));
  };

  if (estado?.ok) {
    return (
      <div role="status" className="rounded-[var(--radius-lg)] border border-champagne/40 bg-ink/25 p-8 md:p-10">
        <p className="font-display text-[length:var(--text-step-2)] font-bold uppercase leading-tight text-bone">Revisá tu mail para confirmar</p>
        <p className="mt-4 text-bone/80">
          Te mandamos un link para confirmar tu suscripción. Cuando lo abras, te llega tu código de {DESCUENTO_BIENVENIDA}% para el primer pedido.
        </p>
        <p className="mt-4 text-[length:var(--text-step--1)] leading-relaxed text-bone/60">
          ¿No aparece en unos minutos? Buscalo en Promociones o Spam.
        </p>
      </div>
    );
  }

  const errorAcepto = estado?.ok === false && estado.campo === "acepto";

  return (
    <form action={accion} onSubmit={onSubmit} className="flex flex-col gap-6" aria-describedby="club-legal">
      <input type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label className="flex flex-col gap-1">
        <span className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-bone/60">Tu nombre</span>
        <input name="nombre" autoComplete="given-name" autoCapitalize="words" enterKeyHint="next" maxLength={80} placeholder="Opcional" className={campo} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-bone/60">Tu email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={200}
          placeholder="nombre@email.com"
          aria-invalid={estado?.ok === false && !errorAcepto ? true : undefined}
          className={campo}
        />
      </label>

      {/* Intereses: sin selector visible (pedido de Fran). En el Summit se
          manda "summit" igual, para segmentar. */}
      {interes && <input type="hidden" name="intereses" value={interes} />}

      {/* Consentimiento (Ley 25.326): obligatorio y registrado al confirmar. */}
      <label className="flex cursor-pointer items-start gap-3 text-[length:var(--text-step--1)] leading-relaxed text-bone/75">
        <input
          type="checkbox"
          name="acepto"
          value="si"
          required
          aria-invalid={errorAcepto ? true : undefined}
          className="mt-0.5 size-5 shrink-0 accent-[var(--color-champagne)]"
        />
        <span>
          Quiero recibir los mails del club. Leí la{" "}
          <Link href="/privacidad" className="underline decoration-bone/40 underline-offset-4 hover:decoration-champagne">
            política de privacidad
          </Link>
          .
        </span>
      </label>

      <Turnstile accion="newsletter" reiniciar={estado} />

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
        {pendiente ? "Enviando…" : (cta ?? `Quiero mi ${DESCUENTO_BIENVENIDA}%`)}
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>
      <p id="club-legal" className="text-[length:var(--text-step--1)] leading-relaxed text-bone/55">
        {CLUB.legal} Usamos tu email solo para el club; podés pedir acceso o baja cuando quieras.
      </p>
    </form>
  );
}
