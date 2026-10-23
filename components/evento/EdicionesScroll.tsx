"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TRAYECTORIA, WORKSHOPS_REALIZADOS, EDICION_LABEL } from "@/content/evento";

/**
 * TRAYECTORIA: 7 workshops → 1ª edición del Summit → 2ª edición (pedido de
 * Flor, §18). Antes era "Escenarios que nos recibieron". — scroll HORIZONTAL pineado (patrón GSAP clásico):
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
    <section ref={root} id="trayectoria" data-theme="dark" className="scroll-mt-24 bg-ink text-bone">
      <div
        ref={panel}
        className="flex h-svh flex-col justify-center overflow-hidden motion-reduce:overflow-x-auto motion-reduce:[scrollbar-width:none] motion-reduce:[&::-webkit-scrollbar]:hidden"
      >
        <div
          ref={track}
          className="flex items-center gap-5 px-6 md:gap-8 md:px-10"
        >
          {/* Bloque de intro (primer panel) */}
          <div className="flex w-[82vw] shrink-0 flex-col justify-center sm:w-[56vw] md:w-[40vw] lg:w-[34vw]">
            <Eyebrow className="mb-6">La trayectoria</Eyebrow>
            <h2 className="font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone [overflow-wrap:anywhere]">
              El camino hasta acá
            </h2>
            <p className="mt-6 max-w-[38ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-bone/70">
              {WORKSHOPS_REALIZADOS} workshops, una primera edición del Summit y
              ahora vamos por la {EDICION_LABEL}. Deslizá y entrá a cada encuentro.
            </p>
          </div>

          {/* Etapas: workshops → 1ª edición → próxima */}
          {TRAYECTORIA.map((t, i) =>
            t.proxima ? (
              <a
                key={t.etapa}
                href="#inscripcion"
                className="group relative flex h-[62vh] w-[72vw] shrink-0 flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] border border-champagne/40 bg-bordeaux p-7 sm:w-[48vw] md:h-[68vh] md:w-[34vw] lg:w-[26vw]"
              >
                <div className="evt-grain pointer-events-none absolute inset-0" />
                <span className="relative text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-champagne">
                  {t.etapa}
                </span>
                <div className="relative">
                  <h3 className="font-display text-[length:var(--text-step-4)] font-bold uppercase leading-[0.9] text-bone">
                    {t.titulo}
                  </h3>
                  {t.detalle && (
                    <p className="mt-3 text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-bone/75">
                      {t.detalle}
                    </p>
                  )}
                  <span className="mt-8 inline-flex items-center gap-2 border-b border-bone pb-1 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-bone">
                    Reservá tu lugar
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </a>
            ) : (
              <Link
                key={t.etapa}
                href={t.slug ? `/event-summit/trayectoria/${t.slug}` : "/event-summit#trayectoria"}
                aria-label={`Ver ${t.etapa}: ${t.titulo}`}
                className="group relative h-[62vh] w-[72vw] shrink-0 overflow-hidden rounded-[var(--radius-lg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne sm:w-[48vw] md:h-[68vh] md:w-[34vw] lg:w-[26vw]"
              >
                {/* TODO(contenido): faltan fotos de los workshops 01–03, 05–07. */}
                <Image
                  src={t.foto ?? `https://picsum.photos/seed/sfdp-sede-${i}/900/1200`}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 72vw, (max-width: 768px) 48vw, (max-width: 1024px) 34vw, 26vw"
                  className="object-cover grayscale transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                />
                {/* Duotono cálido + grano — SOLO md+ (en iPhone el blend por frame
                    en el scrub hacía el scroll pastoso; mobile usa scrim simple). */}
                <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-ink via-bordeaux/60 to-bordeaux/30 mix-blend-multiply md:block" />
                <div className="pointer-events-none absolute inset-0 hidden bg-champagne/15 mix-blend-screen md:block" />
                <div className="evt-grain pointer-events-none absolute inset-0 hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-bordeaux/40 to-bordeaux/20 md:via-ink/20 md:to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-champagne">
                    {t.etapa}
                  </span>
                  <h3 className="mt-2 font-display text-[length:var(--text-step-3)] font-bold uppercase leading-[0.95] text-bone">
                    {t.titulo}
                  </h3>
                  {t.lugar && (
                    <p className="mt-1 text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-bone/70">
                      {t.lugar}
                    </p>
                  )}
                  <span className="mt-5 inline-flex items-center gap-2 border-b border-bone/60 pb-1 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-bone transition-colors duration-300 group-hover:border-champagne group-hover:text-champagne">
                    Ver el encuentro
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
                {/* Número calado de la etapa */}
                {t.numero && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-3 font-display text-[clamp(3rem,6vw,5.5rem)] font-extrabold leading-none text-transparent opacity-70 transition-opacity duration-500 [-webkit-text-stroke:1px_rgb(198_161_91/0.7)] group-hover:opacity-100"
                  >
                    {t.numero}
                  </span>
                )}
              </Link>
            ),
          )}

          {/* Espaciador final para que la última tarjeta respire */}
          <div className="w-6 shrink-0 md:w-10" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
