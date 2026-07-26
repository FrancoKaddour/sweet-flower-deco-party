"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { FadeUp } from "@/components/motion/FadeUp";

// Slides del grupo: 5 imágenes verticales superpuestas dentro de un track de ancho fijo.
// TODO(contenido): reemplazar por fotos reales de escenografías/eventos.
type Slide = {
  seed: number; // sufijo del seed picsum (sfdp-exp-N)
  w: number;
  h: number;
  className: string; // posición (left/top/bottom) + z-index dentro del grupo
};

const SLIDES: Slide[] = [
  { seed: 1, w: 340, h: 480, className: "left-0 bottom-0 z-[1]" },
  { seed: 2, w: 260, h: 340, className: "left-[250px] top-[20px] z-[3]" },
  { seed: 3, w: 320, h: 450, className: "left-[470px] bottom-[10px] z-[2]" },
  { seed: 4, w: 240, h: 320, className: "left-[740px] top-0 z-[4]" },
  { seed: 5, w: 340, h: 470, className: "left-[940px] bottom-0 z-[1]" },
  { seed: 6, w: 260, h: 350, className: "left-[1210px] top-[30px] z-[3]" },
  { seed: 7, w: 300, h: 420, className: "left-[1380px] bottom-[10px] z-[2]" },
];

// Tira mobile simple (block md:hidden) para que el celular no quede vacío.
const MOBILE_SEEDS = [1, 2, 3, 4];

// Ancho fijo del grupo (px) = período del loop (coincide con w-[1500px] del grupo).
const GROUP_WIDTH = 1500;

/**
 * Sección EXPERIENCIA — galería horizontal en movimiento (patrón L'Expérience de momoamo.com).
 *
 * 1) Bloque editorial superior-izquierda (título gigante + bajada).
 * 2) Galería: track flex con DOS copias idénticas del grupo de slides →
 *    autoplay lineal continuo por RAF/GSAP (xPercent −50, loop sin costura, ~80 px/s)
 *    + parallax vertical MUY sutil ligado al scroll (y: 40 → −40, scrub).
 * 3) Bloque editorial inferior-derecha.
 * Recetas: docs/07_MOTION_SYSTEM.md.
 */
export function Experiencia() {
  const sectionRef = useRef<HTMLElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const sectionEl = sectionRef.current;
      const figureEl = figureRef.current;
      const trackEl = trackRef.current;
      if (!sectionEl || !figureEl || !trackEl) return;

      const mm = gsap.matchMedia();

      // Solo animamos con movimiento permitido: sin autoplay ni parallax si reduce.
      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          // (a) Slider horizontal SEGÚN EL SCROLL (scrub): al bajar la galería
          // corre hacia la IZQUIERDA, al subir hacia la DERECHA. Loop infinito
          // SIN salto: el modifier "envuelve" x en [-GROUP_WIDTH, 0], y como hay
          // 2 copias idénticas del grupo el reciclado es perfectamente continuo.
          const marquee = gsap.to(trackEl, {
            x: -GROUP_WIDTH * 1.2, // recorrido suave; el wrap lo recicla infinitamente
            ease: "none",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top bottom",
              end: "bottom top",
              scrub: 2.5, // mucho más suave: sigue al scroll con inercia (nada agresivo)
            },
            modifiers: {
              x: gsap.utils.unitize(gsap.utils.wrap(-GROUP_WIDTH, 0)),
            },
          });

          // (b) Parallax vertical muy sutil ligado al scroll (profundidad).
          const parallax = gsap.fromTo(
            figureEl,
            { y: 40 },
            {
              y: -40,
              ease: "none",
              scrollTrigger: {
                trigger: sectionEl,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          return () => {
            marquee.scrollTrigger?.kill();
            marquee.kill();
            parallax.scrollTrigger?.kill();
            parallax.kill();
            ScrollTrigger.refresh();
          };
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="experiencia"
      ref={sectionRef}
      data-theme="dark"
      className="relative bg-botanical pb-[64px] pt-[64px] text-bone md:pb-[120px] md:pt-[98px]"
    >
      {/* 1) Bloque superior izquierda */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <FadeUp y={100} className="w-[770px] max-w-full text-left">
          {/* TODO(contenido): titular real de la sección. */}
          <h2 className="mb-6 font-display text-[length:var(--text-step-5)] font-bold uppercase leading-[0.9] text-bone md:text-[length:var(--text-step-6)]">
            Más que decoración,
            <br /> una experiencia
          </h2>
          {/* TODO(contenido): bajada real. */}
          <p className="font-display text-[length:var(--text-step-2)] font-normal leading-[1.05] text-bone md:text-[length:var(--text-step-3)]">
            Creamos escenografías que transforman cualquier evento en un
            recuerdo.
          </p>
        </FadeUp>
      </div>

      {/* 2) Galería en movimiento (desktop) */}
      <figure
        ref={figureRef}
        aria-hidden="true"
        className="my-8 hidden overflow-hidden md:my-12 md:block md:h-[560px]"
      >
        {/* Track: 2 copias idénticas del grupo → loop sin costura */}
        <div ref={trackRef} className="flex h-full">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="relative h-full w-[1500px] shrink-0"
            >
              {SLIDES.map((slide) => (
                <div
                  key={slide.seed}
                  className={`absolute ${slide.className}`}
                >
                  <Image
                    src={`https://picsum.photos/seed/sfdp-exp-${slide.seed}/${slide.w}/${slide.h}`}
                    alt=""
                    width={slide.w}
                    height={slide.h}
                    sizes={`${slide.w}px`}
                    className="rounded-[var(--radius-sm)] object-cover"
                    style={{ width: slide.w, height: slide.h }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </figure>

      {/* Tira simple visible solo en mobile */}
      <div className="my-8 block md:hidden">
        <div className="flex snap-x gap-3 overflow-x-auto px-6">
          {MOBILE_SEEDS.map((seed) => (
            <Image
              key={seed}
              src={`https://picsum.photos/seed/sfdp-exp-${seed}/600/800`}
              alt=""
              aria-hidden="true"
              width={600}
              height={800}
              sizes="70vw"
              className="aspect-[3/4] w-[70vw] shrink-0 snap-start rounded-[var(--radius-sm)] object-cover"
            />
          ))}
        </div>
      </div>

      {/* 3) Bloque inferior: imagen de apoyo (izq) + texto (der) — rellena el vacío */}
      <div className="mx-auto mt-12 grid max-w-[1400px] grid-cols-1 items-end gap-8 px-6 md:mt-[72px] md:grid-cols-[minmax(0,1fr)_minmax(0,860px)] md:gap-12 md:px-10">
        {/* Imagen de apoyo (solo desktop) */}
        <div className="hidden md:block">
          <Image
            src="https://picsum.photos/seed/sfdp-exp-6/500/640"
            alt=""
            aria-hidden="true"
            width={500}
            height={640}
            sizes="380px"
            className="aspect-[4/5] h-auto w-full max-w-[380px] rounded-[var(--radius-md)] object-cover"
          />
        </div>
        <FadeUp y={100} className="max-w-full text-left">
          {/* TODO(contenido): titular real. */}
          <h2 className="mb-4 font-display text-[length:var(--text-step-5)] font-bold uppercase leading-[0.9] text-bone md:text-[length:var(--text-step-6)]">
            El arte de crear
            <br /> momentos inolvidables
          </h2>
          {/* TODO(contenido): bajada real. */}
          <p className="mb-4 font-display text-[length:var(--text-step-2)] font-normal leading-[1.05] text-bone md:text-[length:var(--text-step-3)]">
            Cada pieza está pensada para sorprender.
          </p>
          {/* TODO(contenido): copy secundario real. */}
          <p className="font-sans text-[length:var(--text-step-0)] font-light leading-relaxed text-bone/70">
            Del primer boceto al último detalle, cuidamos cada textura, color y
            proporción para que la escenografía cuente tu historia y deje una
            marca que perdura mucho después de que la fiesta termina.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
