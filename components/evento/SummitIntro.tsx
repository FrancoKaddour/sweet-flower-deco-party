"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, CustomEase, useGSAP } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { EVENT_NAME, EVENT_CTA_HREF } from "@/content/evento";

/**
 * SummitIntro — intro editorial debajo del hero del Summit.
 * Estructura y motion replicados (medidos en vivo) del "c-intro" de
 * depuydthaarden.be, adaptados a la marca (Cormorant + Hanken, paleta propia,
 * botón del sistema). Contenido = placeholder del Summit.
 *
 * Medidas de referencia @1920px: grilla 12 cols (gap 24, margen 48);
 * top-title 18.4px tracking .7em; titular 200px / lh .9 / light; texto 16px/1.65.
 * Motion: text-split por líneas (yPercent 120 → 0, 1.5s, stagger .05),
 * image-reveal (clip desde abajo + scale 1.15 → 1, 2s), ambos a "top 85%";
 * parallax scrubbeado: foto grande 0 → −50%, chica arriba 0 → −25%,
 * chica abajo 0 → −50%. Ease = cubic-bezier(0.19, 1, 0.22, 1).
 */

// Fotos reales de la 1ª edición. TODO(contenido): titular y texto definitivos.
const TITLE_LINES = ["Un día", "para todo", "el rubro"];
const BODY =
  "Una vez al año, la decoración de eventos se junta en un mismo lugar. Charlas de referentes, proveedores, comunidad y una escena montada por Sweet Flowers para que la vivas desde adentro. Presencial, con cupos contados — y siempre se agota.";
const IMG = {
  big: "/img/summit/lg/sum-07.webp",
  top: "/img/summit/lg/sum-11.webp",
  bottom: "/img/summit/lg/sum-23.webp",
};

export function SummitIntro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      if (!gsap.parseEase("sfIntro")) CustomEase.create("sfIntro", "0.19, 1, 0.22, 1");

      // 1) Text split (máscara por línea). data-type: "words" | "lines".
      document.fonts.ready.then(() => {
        el.querySelectorAll<HTMLElement>("[data-split]").forEach((t) => {
          const type = (t.dataset.split as "words" | "lines") || "words";
          SplitText.create(t, {
            type: "words, lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self[type], {
                yPercent: 120,
                stagger: 0.05,
                duration: 1.5,
                ease: "sfIntro",
                scrollTrigger: { trigger: t, start: "top 85%" },
              }),
          });
        });
      });

      // 2) Image reveal: clip desde el borde inferior + la foto asienta su escala.
      el.querySelectorAll<HTMLElement>("[data-reveal]").forEach((fig) => {
        const img = fig.querySelector("img");
        if (!img) return;
        gsap.fromTo(
          img,
          { scale: 1.15, clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
          {
            scale: 1,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 2,
            ease: "sfIntro",
            scrollTrigger: { trigger: fig, start: "top 85%" },
          },
        );
      });

      // 3) Parallax scrubbeado (solo desktop/tablet, como el original).
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        el.querySelectorAll<HTMLElement>("[data-parallax]").forEach((t) => {
          const end = parseFloat(t.dataset.parallax || "-20");
          gsap.fromTo(
            t,
            { yPercent: 0 },
            {
              yPercent: end,
              ease: "none",
              scrollTrigger: {
                trigger: t,
                start: "clamp(top bottom)",
                end: "clamp(bottom top)",
                scrub: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-theme="dark"
      className="bg-ink pb-20 pt-20 text-bone md:pt-40 xl:pt-80"
    >
      <div className="px-6 md:px-12">
        <div className="relative">
          {/* Cuerpo */}
          <div className="relative z-10">
            <div className="grid gap-y-10 text-center xl:gap-y-20">
              <span
                data-split="words"
                className="block text-[clamp(0.8rem,0.96vw,1.15rem)] uppercase tracking-[0.35em] text-champagne md:tracking-[0.7em]"
              >
                {EVENT_NAME}
              </span>
              <h2 className="font-(family-name:--font-logo) text-[clamp(3.4rem,10.42vw,12.5rem)] font-light uppercase leading-[0.9] text-bone">
                <span className="sr-only">{TITLE_LINES.join(" ")}</span>
                <span data-split="lines" aria-hidden="true" className="block">
                  {TITLE_LINES.map((l, i) => (
                    <span key={l}>
                      {l}
                      {i < TITLE_LINES.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </h2>
            </div>

            <div className="mt-20 grid grid-cols-12 items-center gap-x-6 gap-y-20">
              <div className="col-span-12 md:col-span-5 xl:col-span-3 xl:col-start-2">
                <p
                  data-split="lines"
                  className="text-center text-[1rem] leading-[1.65] text-bone md:text-left"
                >
                  {BODY}
                </p>
                <div className="mt-10 text-center md:mt-20 md:text-left">
                  <Button href={EVENT_CTA_HREF} tone="light">
                    Quiero mi lugar
                  </Button>
                </div>
              </div>

              <div className="col-span-10 col-start-2 md:col-span-6 md:col-start-7 xl:col-span-5 xl:col-start-7">
                <div data-parallax="-50">
                  <figure data-reveal className="relative aspect-[3/4] overflow-hidden">
                    <Image src={IMG.big} alt="" fill sizes="(max-width: 768px) 80vw, 40vw" className="object-cover" />
                  </figure>
                </div>
              </div>
            </div>
          </div>

          {/* Foto chica ARRIBA (detrás del titular) */}
          <div className="pointer-events-none absolute inset-x-0 -top-20 z-0 hidden md:block" data-parallax="-25">
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-4 md:col-span-3 xl:col-span-2 xl:col-start-2">
                <figure data-reveal className="relative aspect-[3/4] overflow-hidden">
                  <Image src={IMG.top} alt="" fill sizes="(max-width: 768px) 33vw, 15vw" className="object-cover" />
                </figure>
              </div>
            </div>
          </div>

          {/* Foto chica ABAJO */}
          <div className="relative" data-parallax="-50">
            <div className="grid grid-cols-12 gap-x-6">
              <div className="col-span-4 col-start-9 md:col-span-3 md:col-start-3">
                <figure data-reveal className="relative aspect-[3/4] overflow-hidden">
                  <Image src={IMG.bottom} alt="" fill sizes="(max-width: 768px) 33vw, 23vw" className="object-cover" />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
