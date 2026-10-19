"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/evento/Countdown";
import {
  EVENT_NAME,
  EVENT_DATE_ISO,
  EVENT_WHEN,
  EVENT_CTA_HREF,
  EDICION_LABEL,
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
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-ink px-6 pb-20 pt-32 text-bone md:px-10 md:pb-24"
    >
      {/* Fondo full-bleed con duotono + grano + parallax */}
      <div ref={bg} className="absolute inset-0 -z-10">
        {/* PLACEHOLDER: salón de evento con telas drapeadas y arañas (cuadro
            del video del hero). TODO(contenido): foto real del Summit montado. */}
        <Image
          src="/img/summit-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="evt-grain absolute inset-0" />
        {/* Scrims: oscurecen parejo y más abajo, donde va el texto */}
        <div className="absolute inset-0 bg-ink/45" style={{ backgroundColor: "color-mix(in srgb, var(--color-ink) 45%, transparent)" }} />
      </div>
      {/* Degradé FUERA del fondo con parallax: así el pie del hero siempre
          termina en tinta sólida y empalma sin corte con la sección siguiente. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-ink from-[4%] via-ink/55 to-ink/20"
      />

      {/* Título + próxima edición + CTAs — anclado abajo */}
      <div className="mx-auto w-full max-w-[87.5rem]">
        <h1
          ref={title}
          className="mx-auto text-center font-display text-[length:var(--text-step-7)] font-extrabold uppercase leading-[0.82] tracking-[-0.03em] text-bone [overflow-wrap:anywhere]"
        >
          {EVENT_NAME}
        </h1>

        <div data-hero-reveal className="mx-auto mt-12 flex flex-col items-center text-center">
          {EVENT_DATE_ISO ? (
            <>
              <p className="mb-3 text-[0.7rem] uppercase tracking-[0.2em] text-bone/50">
                {EDICION_LABEL} · Pre-preventa abierta
              </p>
              <p className="mb-6 font-display text-[length:var(--text-step-2)] font-extrabold uppercase leading-none text-champagne md:text-[length:var(--text-step-3)]">
                {EVENT_WHEN}
              </p>
              <Countdown />
            </>
          ) : (
            <>
              <p className="mb-3 text-[0.7rem] uppercase tracking-[0.2em] text-bone/50">
                Próxima edición · {EDICION_LABEL}
              </p>
              <p className="font-display text-[length:var(--text-step-2)] font-extrabold uppercase leading-none text-champagne md:text-[length:var(--text-step-3)]">
                {EVENT_WHEN}
              </p>
              <p className="mt-2.5 text-[0.7rem] uppercase tracking-[0.16em] text-bone/50">
                Fecha exacta a confirmar
              </p>
            </>
          )}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <Button href={EVENT_CTA_HREF} variant="inverse">
              Quiero mi lugar
            </Button>
            <Button href="#incluye" variant="outline" tone="light">
              Qué incluye
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
