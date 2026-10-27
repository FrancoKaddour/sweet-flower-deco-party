import { HeroMedia } from "@/components/sections/HeroMedia";
import { HeroStory } from "@/components/sections/HeroStory";
import { HeroPausa } from "@/components/sections/HeroPausa";
import { Button } from "@/components/ui/Button";

/**
 * Hero del inicio — le habla a la clienta real: decoradoras y organizadores de
 * eventos (E-22, texto de docs/auditoria/3-ecommerce.md §5.1). El video nace
 * dentro del arco de la intro (components/intro) y el contenido entra al final.
 * Composición editorial anclada abajo a la izquierda; pausa abajo a la derecha.
 */
export function Hero() {
  return (
    <section
      data-theme="dark"
      className="c-hero relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink px-6 pb-[max(5.5rem,10svh,calc(env(safe-area-inset-bottom)+5rem))] pt-40 md:px-10 md:pb-[11svh] md:pt-44 [@media(max-height:500px)_and_(orientation:landscape)]:pb-6 [@media(max-height:500px)_and_(orientation:landscape)]:pt-24"
    >
      <HeroMedia />

      <div className="c-hero__content relative z-10 mx-auto flex w-full max-w-[87.5rem] flex-col items-start gap-7 text-left [@media(max-height:500px)_and_(orientation:landscape)]:gap-3">
        <p className="max-w-[34ch] text-[length:var(--text-step-0)] leading-snug text-bone/85">
          Fabricantes para decoradoras y organizadores de eventos
        </p>

        {/* Titular cinético sincronizado con el video (h1 real para SEO) */}
        <HeroStory />

        <p className="max-w-[46ch] text-[length:var(--text-step-0)] leading-relaxed text-bone/80 [@media(max-height:500px)_and_(orientation:landscape)]:hidden">
          Arcos, arcadas, estanterías, alzadas, fundas y telas sublimadas.
          Fabricación propia en Tortuguitas, por encargo en unos 20 días y con
          envíos a todo el país.
        </p>

        <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
          <Button href="/productos" variant="inverse">Ver catálogo</Button>
          <Button href="/event-summit" variant="outline" tone="light">
            Event Summit 2027
          </Button>
        </div>
      </div>

      <HeroPausa />
    </section>
  );
}
