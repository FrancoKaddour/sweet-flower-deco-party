import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Sección CONTACTO — cierre de conversión (CTA final).
 * Statement gigante con mask-reveal, bajada, dupla de CTAs (WhatsApp + catálogo)
 * y canales de contacto. Fondo arena cálido, centrado editorial premium.
 * Ver docs/05_CONTENT_STRATEGY.md.
 */
export function Contacto() {
  return (
    <section
      id="contacto"
      data-theme="light"
      className="bg-bone px-6 py-28 text-ink md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] text-center">
        {/* Kicker */}
        <Eyebrow className="mb-6">Hablemos</Eyebrow>

        {/* Statement gigante con mask-reveal palabra por palabra */}
        <RevealText
          as="h2"
          onScroll
          className="mx-auto max-w-[18ch] font-display text-[length:var(--text-step-6)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-ink md:text-[length:var(--text-step-7)]"
        >
          {/* TODO(contenido): titular real */}
          Creemos algo inolvidable juntos
        </RevealText>

        {/* Bajada */}
        <FadeUp y={50}>
          <p className="mx-auto mt-8 max-w-xl font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/70">
            {/* TODO(contenido) */}
            Contanos tu evento y armamos la escenografía a tu medida.
          </p>
        </FadeUp>

        {/* CTAs */}
        <FadeUp y={50}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {/* TODO(contenido): link real de WhatsApp */}
            {/* TODO(contenido): link real de WhatsApp */}
            <Button href="#">Escribinos por WhatsApp</Button>
            <Button href="/productos" variant="outline">
              Ver catálogo
            </Button>
          </div>
        </FadeUp>

        {/* Canales de contacto */}
        <FadeUp y={50}>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-1 text-[length:var(--text-step--1)] uppercase tracking-[0.1em] text-muted">
            {/* TODO(contenido): URLs reales de cada canal */}
            <a
              href="#"
              className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-ink"
            >
              Instagram
            </a>
            <a
              href="#"
              className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-ink"
            >
              Email
            </a>
            <a
              href="#"
              className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-ink"
            >
              WhatsApp
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
