"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TRAYECTORIA, WORKSHOPS_REALIZADOS, EDICION_LABEL } from "@/content/evento";

/**
 * TRAYECTORIA: 7 workshops → 1ª edición del Summit → 2ª edición (pedido de
 * Flor, §18). Dos modos según la pantalla (sin flash: el layout es CSS puro):
 *  · Amplio (≥768px de ancho, ≥521px de alto, con motion): scroll HORIZONTAL
 *    pineado (GSAP): la sección se fija y el track se desplaza en X a medida
 *    que scrolleás en Y. Sincronizado con Lenis vía ScrollTrigger.
 *  · Carrusel (celular, celular horizontal o reduced-motion): título arriba y
 *    tarjetas en un carrusel nativo con scroll-snap (swipe con el dedo), sin
 *    secuestrar el scroll vertical.
 * gsap.matchMedia crea/destruye el pin al cruzar el corte (rotar, redimensionar).
 */
const AMPLIO = "(min-width: 768px) and (min-height: 521px) and (prefers-reduced-motion: no-preference)";

const CSS = `
.edc-head{display:none}
.edc-panel{height:100svh;display:flex;flex-direction:column;justify-content:center;overflow:hidden}
.edc-track{display:flex;align-items:center;gap:2rem;padding-inline:2.5rem}
.edc-intro{flex:none;width:40vw}
.edc-card{--w:44vw;flex:none;width:var(--w);height:min(68vh,calc(var(--w)*1.55))}
@media (min-width:1024px){.edc-intro{width:34vw}.edc-card{--w:26vw}}
@media (max-width:767px),(max-height:520px),(prefers-reduced-motion:reduce){
  .edc{padding-block:6rem 5rem}
  .edc-head{display:block;margin-bottom:2.5rem}
  .edc-intro{display:none}
  .edc-panel{height:auto;display:block;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scroll-padding-inline:1.5rem;overscroll-behavior-x:contain;scrollbar-width:none}
  .edc-panel::-webkit-scrollbar{display:none}
  .edc-track{width:max-content;align-items:stretch;gap:1rem;padding:0.5rem 1.5rem}
  .edc-card{width:min(76vw,max(20rem,26vw));height:auto;aspect-ratio:3/4;max-height:80svh;scroll-snap-align:start}
}
@media (max-height:520px){.edc{padding-block:5rem 3.5rem}.edc-head{margin-bottom:1.75rem}}
`;

function Intro({ titleId }: { titleId?: string }) {
  return (
    <>
      <Eyebrow className="mb-6">La trayectoria</Eyebrow>
      <h2
        id={titleId}
        className="font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone [overflow-wrap:anywhere] [text-wrap:balance]"
      >
        El camino hasta acá
      </h2>
      <p className="mt-6 max-w-[38ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-bone/70">
        {WORKSHOPS_REALIZADOS} workshops, una primera edición del Summit y
        ahora vamos por la {EDICION_LABEL}. Deslizá y entrá a cada encuentro.
      </p>
    </>
  );
}

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

      const mm = gsap.matchMedia();
      mm.add(AMPLIO, () => {
        const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);
        const tween = gsap.to(trackEl, {
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
        // Teclado: al tabular a una tarjeta fuera de cuadro, el navegador
        // scrollearía el panel (overflow hidden) y rompería el pin. En su
        // lugar se lleva el scroll vertical al punto donde esa tarjeta entra.
        const onFocus = (e: FocusEvent) => {
          const card = (e.target as HTMLElement).closest<HTMLElement>(".edc-card");
          const st = tween.scrollTrigger;
          panelEl.scrollLeft = 0;
          if (!card || !st) return;
          const objetivo = Math.min(distance(), Math.max(0, card.offsetLeft - window.innerWidth / 2 + card.offsetWidth / 2));
          window.scrollTo({ top: st.start + objetivo, behavior: "auto" });
        };
        panelEl.addEventListener("focusin", onFocus);
        return () => panelEl.removeEventListener("focusin", onFocus);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="trayectoria"
      data-theme="dark"
      aria-labelledby="trayectoria-h"
      className="edc scroll-mt-24 bg-ink text-bone"
    >
      <style>{CSS}</style>
      {/* Intro arriba (solo modo carrusel) */}
      <div className="edc-head px-6 md:px-10">
        <Intro titleId="trayectoria-h" />
      </div>
      <div ref={panel} className="edc-panel">
        <div ref={track} className="edc-track">
          {/* Intro como primer panel (solo modo pineado) */}
          <div className="edc-intro flex flex-col justify-center">
            <Intro />
          </div>

          {/* Etapas: workshops → 1ª edición → próxima */}
          {TRAYECTORIA.map((t, i) =>
            t.proxima ? (
              <a
                key={t.etapa}
                href="#inscripcion"
                className="edc-card group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] border border-champagne/40 bg-bordeaux p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne md:p-7"
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
                className="edc-card group relative overflow-hidden rounded-[var(--radius-lg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
              >
                {/* TODO(contenido): faltan fotos de los workshops 01–03, 05–07. */}
                <Image
                  src={t.foto ?? `https://picsum.photos/seed/sfdp-sede-${i}/900/1200`}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 76vw, (max-width: 1023px) 44vw, 26vw"
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
                  {(t.fecha || t.participantes) && (
                    <p className="mt-1 text-[length:var(--text-step--1)] text-bone/55">
                      {[t.fecha, t.participantes ? `${t.participantes} participantes` : null].filter(Boolean).join(" · ")}
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
