import Image from "next/image";
import { FadeUp } from "@/components/motion/FadeUp";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Sección HISTORIA / SOBRE FLOR — relato editorial de la fundadora.
 * Layout de dos columnas: retrato/ambiente a la izquierda (con imagen chica
 * superpuesta para textura editorial) y prosa cálida + firma a la derecha.
 * Ver docs/05_CONTENT_STRATEGY.md.
 */
export function Historia() {
  return (
    <section
      id="historia"
      data-theme="light"
      className="bg-bone px-6 py-24 text-ink md:px-10 md:py-32"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-2">
        {/* IZQUIERDA — imagen retrato/ambiente con detalle superpuesto */}
        <FadeUp y={50}>
          <div className="relative">
            {/* TODO(contenido): retrato real de Flor en su taller/evento. */}
            <Image
              src="https://picsum.photos/seed/sfdp-flor-1/800/1000"
              alt=""
              width={800}
              height={1000}
              sizes="(max-width: 768px) 100vw, 45vw"
              className="aspect-[4/5] h-auto w-full rounded-[var(--radius-md)] object-cover"
            />
            {/* Imagen chica superpuesta (oculta en mobile para no romper) */}
            {/* TODO(contenido): detalle del oficio (manos, piezas, textura). */}
            <Image
              src="https://picsum.photos/seed/sfdp-flor-2/500/500"
              alt=""
              width={500}
              height={500}
              sizes="192px"
              className="absolute -bottom-8 -right-6 hidden aspect-square w-40 rounded-[var(--radius-md)] object-cover shadow-[0_24px_60px_-28px_rgba(20,17,15,0.4)] ring-8 ring-bone lg:block lg:w-48"
            />
          </div>
        </FadeUp>

        {/* DERECHA — relato + firma */}
        <FadeUp y={100}>
          <Eyebrow className="mb-5">Nuestra historia</Eyebrow>
          <h2 className="font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-ink md:text-[length:var(--text-step-5)]">
            {/* TODO(contenido): titular real */}
            Detrás de cada evento, Flor
          </h2>

          {/* TODO(contenido): historia real de Flor (sueño → oficio → comunidad). */}
          <div className="mt-8 space-y-5 font-sans text-[length:var(--text-step-0)] leading-relaxed text-ink/80">
            <p>
              Sweet Flowers empezó como un sueño chiquito: una mesa, unas flores
              y las ganas de que cada celebración se sintiera única. Flor cosía,
              probaba y desarmaba hasta que cada pieza quedaba impecable, porque
              lo hecho a mano tiene una calidez que no se improvisa.
            </p>
            <p>
              Con los años, ese oficio artesanal se volvió un lenguaje propio:
              estructuras, telas y terminaciones pensadas al detalle, para que la
              escena hable sin gritar. Lo mejor de lo mejor, siempre puesto al
              servicio de la emoción del día.
            </p>
            <p>
              Hoy ese camino creció hasta el workshop y una comunidad de mujeres
              que se animan a crear en grande. Más que decorar eventos, Sweet
              Flowers forma, acompaña y deja algo que queda mucho después de que
              se apagan las luces.
            </p>
          </div>

          <p className="mt-10 font-display text-[length:var(--text-step-2)] text-ink">
            {/* TODO(contenido): firma real */}
            — Flor, fundadora
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
