import { RevealText } from "@/components/motion/RevealText";

/**
 * Hero — centrado. Mask-reveal palabra por palabra al montar (patrón befesti, mood cálido).
 * Todo el copy es placeholder. Ver docs/05_CONTENT_STRATEGY.md §Home.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center gap-8 overflow-hidden px-6 py-28 text-center md:px-10">
      {/* Kicker */}
      <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-muted">
        Decoración de eventos
      </p>

      {/* Titular */}
      <RevealText
        as="h1"
        className="mx-auto max-w-[18ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-ink md:text-[length:var(--text-step-6)]"
      >
        {/* TODO(contenido): titular real de marca */}
        Creamos la escenografía de tus mejores momentos
      </RevealText>

      {/* Bajada */}
      <p className="mx-auto max-w-xl text-[length:var(--text-step-0)] leading-relaxed text-muted">
        {/* TODO(contenido) */}
        Piezas en hierro, MDF, madera y telas para transformar cualquier evento
        en una experiencia memorable.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href="/productos"
          className="inline-flex items-center rounded-[var(--radius-pill)] bg-ink px-7 py-3.5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-bone transition-transform duration-[400ms] ease-[var(--ease-out-expo)] hover:-translate-y-0.5"
        >
          Ver catálogo
        </a>
        <a
          href="#workshops"
          className="inline-flex items-center rounded-[var(--radius-pill)] border border-line px-7 py-3.5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-ink transition-colors duration-[400ms] hover:border-ink"
        >
          Próxima edición
        </a>
      </div>
    </section>
  );
}
