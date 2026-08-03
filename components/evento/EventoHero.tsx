"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/evento/Countdown";
import {
  EVENT_NAME,
  EVENT_DATE_LABEL,
  EVENT_YEAR,
  EVENT_CUPO,
  EVENT_CTA_HREF,
  EDICION_NUMERO,
} from "@/content/evento";

/**
 * Hero editorial-cinematográfico del Sweet Flowers Event Summit.
 * Foto full-bleed con duotono cálido + grano, marcas de revista (nº de edición,
 * reglas finas), título gigante con mask-reveal (SplitText) y entrada escalonada.
 * Parallax scrubbed en el fondo. Respeta prefers-reduced-motion.
 */
export function EventoHero() {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const revealTargets =
        el.querySelectorAll<HTMLElement>("[data-hero-reveal]");

      if (reduce) {
        gsap.set([title.current, ...Array.from(revealTargets)], {
          autoAlpha: 1,
          y: 0,
        });
        return;
      }

      if (bg.current) {
        gsap.set(bg.current, { scale: 1.18 });
        gsap.to(bg.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      const run = () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (title.current) {
          const split = SplitText.create(title.current, {
            type: "words",
            mask: "words",
            wordsClass: "reveal-word",
          });
          gsap.set(title.current, { autoAlpha: 1 });
          tl.from(split.words, { yPercent: 115, duration: 1, stagger: 0.09 });
        }
        tl.from(
          revealTargets,
          { y: 26, autoAlpha: 0, duration: 0.8, stagger: 0.1 },
          "-=0.5",
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
      data-theme="dark"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-ink px-6 pb-14 pt-32 text-bone md:px-10 md:pb-16"
    >
      {/* Fondo full-bleed con duotono + grano + parallax */}
      <div ref={bg} className="absolute inset-0 -z-10">
        {/* TODO(contenido): foto/video real del summit montado. */}
        <Image
          src="https://picsum.photos/seed/sfdp-evento-hero/1920/2400"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-bordeaux/60 to-bordeaux/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-champagne/10 mix-blend-screen" />
        <div className="evt-grain absolute inset-0" />
        {/* Scrim general para el texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/50" />
      </div>

      {/* Franja editorial superior */}
      <div
        data-hero-reveal
        className="mx-auto flex w-full max-w-[1400px] items-center justify-between border-b border-bone/20 pb-5 text-[length:var(--text-step--1)] uppercase tracking-[0.2em] text-bone/70"
      >
        <span>Nº 0{EDICION_NUMERO}</span>
        {/* TODO(contenido): tagline real del summit */}
        <span className="hidden sm:inline">El encuentro del año</span>
        <span className="text-champagne">
          {EVENT_DATE_LABEL} · {EVENT_YEAR}
        </span>
      </div>

      {/* Bloque inferior */}
      <div className="mx-auto w-full max-w-[1400px]">
        <h1
          ref={title}
          className="mx-auto text-center font-display text-[length:var(--text-step-7)] font-extrabold uppercase leading-[0.82] tracking-[-0.03em] text-bone [overflow-wrap:anywhere]"
        >
          {EVENT_NAME}
        </h1>

        <div className="mt-10 flex flex-col gap-10 border-t border-bone/15 pt-8 lg:flex-row lg:items-end lg:justify-between">
          {/* Izquierda: bajada narrativa + escasez */}
          <div className="max-w-[40ch]">
            <p
              data-hero-reveal
              className="font-display text-[length:var(--text-step-2)] font-normal leading-[1.1] text-bone"
            >
              {/* TODO(contenido): frase real de qué es el summit */}
              Un día al año, la decoración de eventos se junta en un mismo lugar.
            </p>
            <p
              data-hero-reveal
              className="mt-5 text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-champagne"
            >
              Presencial · {EVENT_CUPO} lugares · siempre se agota
            </p>
          </div>

          {/* Derecha: countdown + CTA */}
          <div data-hero-reveal className="shrink-0">
            <p className="mb-4 text-[length:var(--text-step--1)] uppercase tracking-[0.2em] text-bone/50">
              Faltan
            </p>
            <Countdown />
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={EVENT_CTA_HREF} variant="inverse">
                Quiero mi lugar
              </Button>
              <Button
                href="#incluye"
                variant="outline"
                className="border-bone/30 text-bone"
              >
                Qué incluye
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
