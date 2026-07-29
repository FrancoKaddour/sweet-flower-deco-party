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
 * Hero del Sweet Flowers Event Summit — momento oscuro cinematográfico.
 * 1) Foto de fondo con parallax scrubbed (se mueve más lento que el scroll).
 * 2) Timeline de entrada al montar: kicker → título (mask-reveal palabra x palabra
 *    con SplitText) → bajada, fecha, countdown y CTAs escalonados.
 * Respeta prefers-reduced-motion (todo visible, sin parallax ni desplazamientos).
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

      const revealTargets = el.querySelectorAll<HTMLElement>("[data-hero-reveal]");

      if (reduce) {
        gsap.set([title.current, ...Array.from(revealTargets)], {
          autoAlpha: 1,
          y: 0,
        });
        return;
      }

      // Parallax del fondo: escalado extra para que el desplazamiento no deje bordes.
      if (bg.current) {
        gsap.set(bg.current, { scale: 1.15 });
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
          tl.from(split.words, {
            yPercent: 110,
            duration: 0.9,
            stagger: 0.08,
          });
        }

        tl.from(
          revealTargets,
          { y: 28, autoAlpha: 0, duration: 0.8, stagger: 0.12 },
          "-=0.45",
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
      className="relative flex min-h-dvh flex-col justify-end overflow-hidden bg-ink px-6 pb-16 pt-32 text-bone md:px-10 md:pb-24"
    >
      {/* Fondo con parallax */}
      <div ref={bg} className="absolute inset-0 -z-10">
        {/* TODO(contenido): foto/video real del summit montado. */}
        <Image
          src="https://picsum.photos/seed/sfdp-evento-hero/1920/2400"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Velo para legibilidad del texto (gradiente cálido hacia la tinta). */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      </div>

      <div className="mx-auto w-full max-w-[1400px]">
        {/* Kicker */}
        <p
          data-hero-reveal
          className="mb-6 text-[length:var(--text-step--1)] uppercase tracking-[0.2em] text-champagne"
        >
          {EDICION_NUMERO}ª edición · Presencial · Argentina
        </p>

        {/* Título */}
        <h1
          ref={title}
          className="max-w-[16ch] font-display text-[length:var(--text-step-6)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-bone [overflow-wrap:anywhere] md:text-[length:var(--text-step-7)]"
        >
          {EVENT_NAME}
        </h1>

        {/* Bajada */}
        <p
          data-hero-reveal
          className="mt-8 max-w-[46ch] font-sans text-[length:var(--text-step-1)] leading-snug text-bone/80"
        >
          {/* TODO(contenido): frase real de qué es el summit */}
          Un día para las que hacen de la decoración de eventos un oficio.
          Formación, comunidad y la escena que soñás, en un mismo lugar.
        </p>

        {/* Fecha + cupo */}
        <div
          data-hero-reveal
          className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-bone/15 pt-8"
        >
          <p className="font-display text-[length:var(--text-step-3)] font-bold uppercase text-bone">
            {EVENT_DATE_LABEL}{" "}
            <span className="text-champagne">· {EVENT_YEAR}</span>
          </p>
          <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-bone/60">
            Cupos limitados · {EVENT_CUPO} lugares
          </p>
        </div>

        {/* Countdown */}
        <div data-hero-reveal className="mt-10">
          <Countdown />
        </div>

        {/* CTAs */}
        <div data-hero-reveal className="mt-10 flex flex-wrap items-center gap-3">
          <Button href={EVENT_CTA_HREF} variant="inverse">
            Reservar mi lugar
          </Button>
          <Button href="#incluye" variant="outline" className="border-bone/30 text-bone">
            Ver qué incluye
          </Button>
        </div>
      </div>
    </section>
  );
}
