"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/evento/Countdown";
import {
  EVENT_DATE_ISO,
  finDePreventa,
  preventaVigente,
  siguientePreventa,
  cambioDePrecioLabel,
  EVENT_WHEN,
  EVENT_CTA_HREF,
  EDICION_LABEL,
  EVENT_HORARIO,
  EVENT_SEDE,
} from "@/content/evento";

/**
 * Hero editorial-cinematográfico del Sweet Flowers Event Summit.
 * Foto full-bleed con duotono cálido + grano, marcas de revista (nº de edición,
 * reglas finas), título gigante con mask-reveal (SplitText) y entrada escalonada.
 * Parallax scrubbed en el fondo. Respeta prefers-reduced-motion.
 */
const ars = (n: number) => `$${n.toLocaleString("es-AR")}`;

export function EventoHero() {
  const root = useRef<HTMLElement>(null);
  // Urgencia real (E-11): cuenta hasta el fin de la preventa vigente; cuando
  // no queda ninguna, vuelve a contar hasta el evento.
  const pv = preventaVigente();
  const sig = siguientePreventa();
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
      id="summit-hero"
      data-theme="dark"
      className="relative isolate flex h-svh min-h-[30rem] flex-col justify-end overflow-hidden bg-ink px-6 pb-[clamp(1.25rem,5svh,5rem)] pt-[max(4.75rem,11svh)] md:pt-[max(8.75rem,14svh)] [@media(max-height:520px)]:pt-[5rem] text-bone md:px-10 [@media(max-height:520px)]:min-h-0"
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
          className="mx-auto text-center font-display text-[length:min(var(--text-step-7),7.4svh,calc((100vw-3rem)/5.6)) [@media(max-height:600px)]:text-[length:min(6.2svh,calc((100vw-3rem)/5.6))]] font-extrabold uppercase leading-[0.84] sm:text-[length:min(var(--text-step-7),10svh,calc((100vw-4rem)/7))] lg:text-[length:min(var(--text-step-7),12svh)] tracking-[-0.03em] text-bone [overflow-wrap:anywhere] [text-wrap:balance]"
        >
          {/* Siempre "Sweet Flowers" arriba y "Event Summit" abajo (en celular
              cada renglón puede partirse en dos). */}
          <span className="block">Sweet Flowers</span>
          <span className="block">Event Summit</span>
        </h1>

        <div data-hero-reveal className="mx-auto mt-[clamp(0.75rem,3.5svh,3rem)] flex flex-col items-center text-center">
          {EVENT_DATE_ISO ? (
            <>
              <p className="mb-[clamp(0.25rem,1svh,0.75rem)] text-[0.7rem] uppercase tracking-[0.2em] text-bone/50 [@media(max-height:700px)]:hidden">
                {EDICION_LABEL}
              </p>
              <p className="font-display text-[length:min(var(--text-step-2),4.2svh)] font-extrabold uppercase leading-none text-champagne md:text-[length:min(var(--text-step-3),5svh)]">
                {EVENT_WHEN}
              </p>
              <p className="mb-[clamp(0.6rem,3svh,1.75rem)] mt-[clamp(0.25rem,1svh,0.625rem)] [@media(max-height:520px)]:hidden text-[0.7rem] uppercase tracking-[0.16em] text-bone/60">
                {EVENT_HORARIO} · {EVENT_SEDE}
              </p>
              {pv ? (
                <>
                  <p className="mb-[clamp(0.4rem,1.6svh,1rem)] font-display text-[length:min(var(--text-step-1),3.4svh)] font-semibold italic leading-none text-bone/85">
                    La {pv.nombre.charAt(0).toLowerCase() + pv.nombre.slice(1)} termina en
                  </p>
                  <Countdown
                    target={finDePreventa(pv).toISOString()}
                    label={`Tiempo que falta para que termine la ${pv.nombre.toLowerCase()}`}
                  />
                  <p className="mt-[clamp(0.5rem,2.4svh,1.5rem)] text-[length:var(--text-step--1)] leading-snug text-bone/70">
                    <span className="block text-[length:var(--text-step-0)] text-bone">
                      Pase General {ars(pv.precios.general)} · Pase VIP {ars(pv.precios.vip)}
                    </span>
                    {sig && (
                      <span className="block [@media(max-height:600px)]:hidden">
                        Desde el {cambioDePrecioLabel(pv)}: {ars(sig.precios.general)} y {ars(sig.precios.vip)}
                      </span>
                    )}
                  </p>
                </>
              ) : (
                <Countdown />
              )}
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
          <div className="mt-[clamp(0.75rem,3.5svh,2.25rem)] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:gap-x-10">
            <Button href={EVENT_CTA_HREF} variant="inverse">
              Quiero mi lugar
            </Button>
            <Button href="#pases" variant="outline" tone="light">
              Ver pases
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
