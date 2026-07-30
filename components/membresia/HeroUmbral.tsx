"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP, ensureHopEase } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { MEMBRESIA_CTA_HREF } from "@/content/membresia";

// Arcos del umbral: alturas desparejas a propósito (ritmo de arcada real).
// TODO(contenido): fotos reales de la comunidad / eventos de miembros.
const ARCOS = [
  { seed: "sfdp-mem-arco-1", h: "h-[30vh] md:h-[36vh]" },
  { seed: "sfdp-mem-arco-2", h: "h-[44vh] md:h-[54vh]" },
  { seed: "sfdp-mem-arco-3", h: "h-[36vh] md:h-[44vh]" },
  { seed: "sfdp-mem-arco-4", h: "h-[26vh] md:h-[30vh]" },
] as const;

/**
 * HERO "EL UMBRAL" — identidad El Arco (docs/20_MOTION_REFERENCIAS_ANALISIS.md).
 * Coreografía de entrada:
 *  1. Hairlines de columna crecen (scaleY 0→1, power1.out, secuencial — unanime).
 *  2. Los arcos SE LEVANTAN desde el piso (yPercent 100→0 dentro de máscara,
 *     ease "hop" de chkstepan: arranca, se frena al medio, remata).
 *  3. El título gigante pisa los arcos: SplitText chars con dirección alternada
 *     por línea (y ±110%, receta literal de normalisboring).
 * Sin JS / reduced-motion: todo visible en estado final (nada se oculta en SSR).
 */
export function HeroUmbral() {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      ensureHopEase();
      const lines = el.querySelectorAll<HTMLElement>(".hu-line");
      const arcos = el.querySelectorAll<HTMLElement>(".hu-arco");
      const bajada = el.querySelectorAll<HTMLElement>("[data-hu-reveal]");

      const run = () => {
        const tl = gsap.timeline();

        // 1 · Hairlines (armamos recién acá → sin JS quedan visibles).
        tl.fromTo(
          lines,
          { scaleY: 0, transformOrigin: "top center" },
          { scaleY: 1, duration: 1.4, ease: "power1.out", stagger: 0.09 },
          0,
        );

        // 2 · Arcos levantándose del piso.
        tl.fromTo(
          arcos,
          { yPercent: 101 },
          { yPercent: 0, duration: 1.35, ease: "hop", stagger: 0.12 },
          0.15,
        );

        // 3 · Título: chars por línea con dirección alternada (NIB).
        if (title.current) {
          const split = SplitText.create(title.current, {
            type: "lines,chars",
            mask: "lines",
          });
          split.lines.forEach((line, i) => {
            const chars = (line as HTMLElement).querySelectorAll("div, span");
            tl.from(
              chars.length ? chars : line,
              {
                yPercent: i % 2 === 0 ? 110 : -110,
                duration: 0.65,
                ease: "power3.out",
                stagger: 0.04,
              },
              0.75 + i * 0.08,
            );
          });
        }

        // 4 · Bajada + CTAs.
        tl.from(
          bajada,
          { y: 20, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.05 },
          1.3,
        );
      };

      if (document.fonts?.status === "loaded") run();
      else document.fonts?.ready.then(run);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-theme="light"
      className="relative flex min-h-dvh flex-col justify-end overflow-hidden bg-bone px-6 pb-12 pt-28 text-ink md:px-10"
    >
      {/* Hairlines de columna (decorativas) */}
      <div aria-hidden="true" className="absolute inset-0">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="hu-line absolute bottom-0 top-0 w-px bg-ink/10"
            style={{ left: `${(i * 100) / 6}%` }}
          />
        ))}
      </div>

      {/* Kicker */}
      <p
        data-hu-reveal
        className="relative mb-8 text-[length:var(--text-step--1)] uppercase tracking-[0.2em] text-champagne"
      >
        La membresía de Sweet Flowers
      </p>

      {/* Arcada: los arcos se levantan dentro de máscaras */}
      <div className="relative flex items-end justify-center gap-3 md:gap-5">
        {ARCOS.map((a, i) => (
          <div
            key={a.seed}
            className={`w-[clamp(70px,19vw,240px)] overflow-hidden ${a.h} ${
              i === 3 ? "hidden sm:block" : ""
            }`}
          >
            <figure className="hu-arco relative h-full w-full overflow-hidden rounded-t-full bg-sand">
              {/* TODO(contenido): foto real */}
              <Image
                src={`https://picsum.photos/seed/${a.seed}/600/900`}
                alt=""
                fill
                sizes="(max-width: 768px) 22vw, 240px"
                className="object-cover"
              />
              {/* Tinte cálido para unificar placeholders */}
              <div className="pointer-events-none absolute inset-0 bg-bordeaux/25 mix-blend-multiply" />
            </figure>
          </div>
        ))}
      </div>

      {/* Título gigante: pisa los arcos y sangra del canvas */}
      <h1
        ref={title}
        className="relative z-10 -mt-[6vw] text-center font-display text-[clamp(3.6rem,16.5vw,15rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.04em] text-ink"
      >
        {/* TODO(contenido): validar el nombre "El Círculo" con Flor */}
        El Círculo
      </h1>

      {/* Bajada + CTAs + indicio del portal */}
      <div className="relative mt-10 flex flex-col items-start justify-between gap-8 border-t border-ink/10 pt-8 md:flex-row md:items-end">
        <p
          data-hu-reveal
          className="max-w-[40ch] font-sans text-[length:var(--text-step-1)] leading-snug text-ink/70"
        >
          {/* TODO(contenido): bajada real */}
          Un lugar adentro, todo el año. Comunidad, prioridad y el oficio
          compartido.
        </p>
        <div data-hu-reveal className="flex flex-wrap items-center gap-4">
          <Button href={MEMBRESIA_CTA_HREF}>Quiero entrar</Button>
          <span className="text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-ink/45">
            Se entra por el arco ↓
          </span>
        </div>
      </div>
    </section>
  );
}
