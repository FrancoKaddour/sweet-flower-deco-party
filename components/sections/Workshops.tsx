import Image from "next/image";
import { RevealText } from "@/components/motion/RevealText";
import { FadeUp } from "@/components/motion/FadeUp";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

/**
 * Sección WORKSHOPS en el inicio — bloque corto que lleva a /workshops.
 * (El collage cinematográfico pasó a ser la sección del Event Summit, arriba.)
 * Imagen en máscara de ARCO (identidad "EL ARCO"). Copy placeholder.
 */
export function Workshops() {
  return (
    <section
      id="workshops"
      data-theme="light"
      className="scroll-mt-24 bg-bone px-6 py-24 text-ink md:px-10 md:py-36"
    >
      <div className="mx-auto grid max-w-[87.5rem] items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <FadeUp y={50} className="lg:col-span-5">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[27.5rem] overflow-hidden rounded-t-full bg-sand">
            {/* TODO(contenido): foto real de un workshop */}
            <Image
              src="https://picsum.photos/seed/sfdp-home-workshops/900/1200"
              alt=""
              fill
              sizes="(max-width: 768px) 90vw, 440px"
              className="object-cover"
            />
          </div>
        </FadeUp>

        <div className="lg:col-span-6 lg:col-start-7">
          <Eyebrow className="mb-6">Workshops</Eyebrow>
          <RevealText
            as="h2"
            onScroll
            className="max-w-[16ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.92] tracking-[-0.01em] text-ink"
          >
            No es solo decoración, es un oficio
          </RevealText>
          <FadeUp y={30} delay={0.1}>
            <p className="mt-8 max-w-[44ch] text-[length:var(--text-step-0)] leading-relaxed text-ink/70">
              {/* TODO(contenido): bajada real */}
              Workshops presenciales para aprender a montar, diseñar y vender
              decoración de eventos con el método Sweet Flowers.
            </p>
            <Button href="/workshops" className="mt-8">
              Ver workshops
            </Button>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
