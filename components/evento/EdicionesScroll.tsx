"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SEDES } from "@/content/evento";

/**
 * "Escenarios que nos recibieron" — scroll HORIZONTAL pineado (patrón GSAP clásico):
 * la sección se fija y el track se desplaza en X a medida que scrolleás en Y.
 * Sincronizado con Lenis vía ScrollTrigger (ver components/motion/SmoothScroll).
 * Reduced-motion: sin pin; el track queda como carrusel swipeable nativo.
 */
export function EdicionesScroll() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const trackEl = track.current;
      const panelEl = panel.current;
      if (!el || !trackEl || !panelEl) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const distance = () =>
        Math.max(0, trackEl.scrollWidth - window.innerWidth);

      gsap.to(trackEl, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => "+=" + distance(),
          pin: panelEl,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-theme="dark" className="bg-ink text-bone">
      <div
        ref={panel}
        className="flex h-dvh flex-col justify-center overflow-hidden motion-reduce:overflow-x-auto motion-reduce:[scrollbar-width:none] motion-reduce:[&::-webkit-scrollbar]:hidden"
      >
        <div
          ref={track}
          className="flex items-center gap-5 px-6 md:gap-8 md:px-10"
        >
          {/* Bloque de intro (primer panel) */}
          <div className="flex w-[82vw] shrink-0 flex-col justify-center sm:w-[56vw] md:w-[40vw] lg:w-[34vw]">
            <Eyebrow className="mb-6">7 ediciones</Eyebrow>
            <h2 className="font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone [overflow-wrap:anywhere]">
              {/* TODO(contenido): titular real */}
              Escenarios que nos recibieron
            </h2>
            <p className="mt-6 max-w-[38ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-bone/70">
              De Buenos Aires al interior, cada edición encontró su escena.
              Deslizá para recorrerlas.
            </p>
          </div>

          {/* Tarjetas de sedes */}
          {SEDES.map((sede, i) => (
            <article
              key={`${sede.lugar}-${i}`}
              className="group relative h-[62vh] w-[72vw] shrink-0 overflow-hidden rounded-[var(--radius-lg)] sm:w-[48vw] md:h-[68vh] md:w-[34vw] lg:w-[26vw]"
            >
              {/* TODO(contenido): foto real de la edición en esa sede. */}
              <Image
                src={`https://picsum.photos/seed/sfdp-sede-${i}/900/1200`}
                alt=""
                fill
                sizes="(max-width: 640px) 72vw, (max-width: 768px) 48vw, (max-width: 1024px) 34vw, 26vw"
                className="object-cover grayscale transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
              />
              {/* Duotono cálido + grano cinematográfico */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-bordeaux/60 to-bordeaux/30 mix-blend-multiply" />
              <div className="pointer-events-none absolute inset-0 bg-champagne/15 mix-blend-screen" />
              <div className="evt-grain pointer-events-none absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="font-display text-[length:var(--text-step--1)] tracking-[0.18em] text-champagne">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-[length:var(--text-step-3)] font-bold uppercase leading-[0.95] text-bone">
                  {sede.lugar}
                </h3>
                <p className="mt-1 text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-bone/70">
                  {sede.ciudad}
                </p>
              </div>
            </article>
          ))}

          {/* Espaciador final para que la última tarjeta respire */}
          <div className="w-6 shrink-0 md:w-10" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
