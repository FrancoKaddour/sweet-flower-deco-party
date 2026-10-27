import { WHATSAPP_HREF } from "@/content/site";
import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/ui/Button";

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
      <div className="mx-auto max-w-[87.5rem] text-center">
        {/* Statement gigante con mask-reveal palabra por palabra */}
        <RevealText
          as="h2"
          onScroll
          className="t-voz-display mx-auto max-w-[16ch] text-[length:min(var(--text-step-6),calc((100vw-3rem)/6))] text-ink md:text-[length:var(--text-step-7)]"
        >
          Contanos qué estás armando y te pasamos precio
        </RevealText>

        {/* Bajada */}
        <FadeUp y={50}>
          <p className="mx-auto mt-8 max-w-xl font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/70">
            Te responden Flor o Tobías por WhatsApp. Si ya sabés qué querés,
            armá el pedido desde el catálogo.
          </p>
        </FadeUp>

        {/* CTAs */}
        <FadeUp y={50}>
          <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-4">
            <Button href={WHATSAPP_HREF}>Escribinos por WhatsApp</Button>
            <Button href="/productos" variant="outline">
              Ver catálogo
            </Button>
          </div>
        </FadeUp>

        {/* Canales de contacto */}
        <FadeUp y={50}>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-1 text-[length:var(--text-step--1)] uppercase tracking-[0.1em] text-ink/70">
            <a
              href="https://www.instagram.com/sweetflowersdecoparty/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-ink"
            >
              Instagram
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
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
