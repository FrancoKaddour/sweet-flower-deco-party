import { HeroMedia } from "@/components/sections/HeroMedia";
import { HeroStory } from "@/components/sections/HeroStory";
import { Button } from "@/components/ui/Button";

/**
 * Hero — la caja del video (HeroMedia) ocupa todo el fondo. Al terminar el loader
 * (método Villurcann), el video nace chico en la franja central, crece a full y el
 * contenido editorial entra por encima (está oculto mientras corre el loader vía
 * body[data-loader="true"] .c-hero__content, y la timeline del Loader lo revela).
 *
 * Todo el copy es placeholder. Ver docs/05_CONTENT_STRATEGY.md §Home.
 */
export function Hero() {
  return (
    <section className="c-hero relative flex min-h-svh flex-col items-center justify-center gap-8 overflow-hidden px-6 pb-28 pt-40 md:justify-end md:pb-[12svh] text-center md:px-10 md:pt-44">
      {/* Media del hero (video + overlay). TODO(contenido): video real. */}
      <HeroMedia />

      {/* Contenido editorial, por encima del media */}
      <div className="c-hero__content relative z-10 flex flex-col items-center gap-8">
        {/* Kicker */}
        <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-bone/75">
          Decoración de eventos
        </p>

        {/* Titular cinético sincronizado con el video (h1 incluido, para SEO) */}
        <HeroStory />

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          <Button href="/productos" variant="inverse">Ver catálogo</Button>
          <Button href="#summit" variant="outline" tone="light">
            Próxima edición
          </Button>
        </div>
      </div>
    </section>
  );
}
