"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  etapa: string;
  titulo: string;
  lugar?: string;
  numero?: string;
  portada: string;
  placeholder?: boolean;
};

/**
 * Hero de cada workshop / edición: foto a sangre con duotono cálido + grano y
 * parallax, número gigante calado (outline) y título con mask-reveal.
 * Mismo lenguaje que EventoHero. Respeta prefers-reduced-motion.
 */
export function WorkshopHero({ etapa, titulo, lugar, numero, portada, placeholder }: Props) {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reveal = el.querySelectorAll<HTMLElement>("[data-reveal]");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([title.current, num.current, ...Array.from(reveal)], { autoAlpha: 1, y: 0 });
        return;
      }
      if (bg.current) {
        gsap.set(bg.current, { scale: 1.15 });
        gsap.to(bg.current, {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      }
      if (num.current) {
        gsap.to(num.current, {
          yPercent: -30,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      }
      const run = () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (num.current) tl.fromTo(num.current, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 1.4, ease: "expo.out" }, 0);
        if (title.current) {
          const split = SplitText.create(title.current, { type: "words", mask: "words" });
          gsap.set(title.current, { autoAlpha: 1 });
          tl.from(split.words, { yPercent: 115, duration: 1.05, stagger: 0.08 }, 0.15);
        }
        tl.from(reveal, { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, "-=0.6");
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
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-ink px-6 pb-16 pt-32 text-bone md:px-10 md:pb-20 [@media(max-height:520px)]:pb-10 [@media(max-height:520px)]:pt-28"
    >
      <div ref={bg} className="absolute inset-0 -z-10">
        <Image
          src={portada}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover ${placeholder ? "grayscale" : ""}`}
        />
        {placeholder && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-bordeaux/60 to-bordeaux/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-champagne/15 mix-blend-screen" />
          </>
        )}
        <div className="evt-grain absolute inset-0" />
        <div className="absolute inset-0" style={{ backgroundColor: "color-mix(in srgb, var(--color-ink) 40%, transparent)" }} />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-ink from-[3%] via-ink/50 to-ink/10" />

      {/* Número gigante calado */}
      {numero && (
        <span
          ref={num}
          aria-hidden="true"
          className="invisible pointer-events-none absolute -right-[2vw] top-[12vh] select-none font-display text-[clamp(8rem,min(32vw,60svh),30rem)] font-extrabold leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgb(198_161_91/0.55)]"
        >
          {numero}
        </span>
      )}

      <div className="relative mx-auto w-full max-w-[87.5rem]">
        <nav data-reveal aria-label="Migas" className="mb-7 flex flex-wrap items-center text-[0.7rem] uppercase tracking-[0.18em] text-bone/55 [@media(max-height:520px)]:mb-4">
          <Link href="/event-summit" className="inline-flex min-h-11 items-center hover:text-bone">Event Summit</Link>
          <span aria-hidden="true" className="mx-3 text-champagne">/</span>
          <Link href="/event-summit#trayectoria" className="inline-flex min-h-11 items-center hover:text-bone">Trayectoria</Link>
        </nav>
        <p data-reveal className="mb-6 text-[length:var(--text-step--1)] uppercase tracking-[0.22em] text-champagne [@media(max-height:520px)]:mb-4">
          ✧ {etapa}
        </p>
        <h1
          ref={title}
          className="invisible max-w-[12ch] font-display text-[length:min(var(--text-step-7),18svh,calc((100vw-3rem)/5.9))] font-extrabold uppercase leading-[0.82] tracking-[-0.03em] text-bone [overflow-wrap:anywhere] [text-wrap:balance]"
        >
          {titulo}
        </h1>
        {lugar && (
          <p data-reveal className="mt-8 text-[length:var(--text-step-1)] uppercase tracking-[0.12em] text-bone/75 [@media(max-height:520px)]:mt-5">
            {lugar}
          </p>
        )}
        <div data-reveal className="mt-14 flex items-center gap-4 text-[0.7rem] uppercase tracking-[0.2em] text-bone/50 [@media(max-height:520px)]:hidden">
          <span className="h-px w-16 bg-bone/30" aria-hidden="true" />
          Deslizá para ver el encuentro
        </div>
      </div>
    </section>
  );
}
