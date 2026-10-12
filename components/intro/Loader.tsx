"use client";

/**
 * Loader de intro — método De Puydt / Villurcann (ver referencia depuydthaarden.be
 * y colaboracion/franco/prompt-loader-hero.docx). UNA sola timeline de GSAP
 * orquesta loader + video + hero. El estado inicial vive en CSS
 * (body[data-loader="true"], escrito en el HTML servido) → cero flash/hidratación.
 *
 * Concepto (exacto De Puydt):
 *   SWEET  ←  [ video ]  →  FLOWERS
 * "SWEET" y "FLOWERS" empiezan juntas y centradas (se lee "SWEET FLOWERS"); se
 * SEPARAN en horizontal (Sweet ←, Flowers →) y en el hueco central nace el video
 * (retrato 15×20rem, inclinado 7.5°). El nombre DESAPARECE y el video se expande
 * a pantalla completa. El nombre NO reaparece.
 *
 * Coreografía (tiempos/eases del doc):
 *   0.75s  aparecen "SWEET FLOWERS" juntas, centradas (gap chico).
 *   1.75s  data-expanded: se separan (gap chico → grande) y nace el video.
 *   2.75s  el nombre desaparece (0.25s).
 *   3.0→4.5s  el video crece a 100%×100%, rota a 0, el video interno baja a
 *          scale 1, entra overlay + hero.
 *   4.5s   onComplete → data-loader="false", lenis.start().
 */

import { useRef } from "react";
import { gsap, CustomEase, useGSAP } from "@/lib/gsap";
import { startLenis, stopLenis } from "@/components/motion/SmoothScroll";

const WORDS: [string, string] = ["Sweet", "Flowers"];

export function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const nameEl = root.current?.querySelector<HTMLElement>(".c-loader__name");
      if (!nameEl) return;

      // Guard StrictMode: la intro corre una sola vez por carga.
      if (document.body.getAttribute("data-loader") !== "true") return;

      const spans = nameEl.querySelectorAll<HTMLElement>("span");
      const media = document.querySelector<HTMLElement>(".c-hero__media");
      const mediaInner = document.querySelector<HTMLElement>(
        ".c-hero__media video, .c-hero__media-placeholder",
      );
      const overlay = document.querySelector<HTMLElement>(
        ".c-hero__media-overlay",
      );
      const heroContent = document.querySelector<HTMLElement>(
        ".c-hero__content",
      );
      const header = document.querySelector<HTMLElement>(".c-site-header");
      // El header y el contenido del hero entran juntos al final (como De Puydt).
      const revealFinal = [heroContent, header].filter(
        (el): el is HTMLElement => el !== null,
      );
      if (!media || !mediaInner) return;

      // Easing del doc.
      if (!gsap.parseEase("easeDefault")) {
        CustomEase.create("easeDefault", "0.4, 0, 0, 1");
      }

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // --- reduced-motion: saltar la intro, estado final directo ---------------
      if (reduce) {
        gsap.set(spans, { autoAlpha: 0 });
        gsap.set(media, {
          autoAlpha: 1,
          clearProps: "width,height,transform",
        });
        gsap.set(mediaInner, { scale: 1 });
        gsap.set(overlay, { autoAlpha: 1 });
        gsap.set(revealFinal, { autoAlpha: 1 });
        document.body.setAttribute("data-loader", "false");
        startLenis();
        return;
      }

      // Scroll bloqueado y en el top mientras corre la intro.
      stopLenis();
      window.scrollTo(0, 0);

      const tl = gsap.timeline({
        delay: 0.75,
        defaults: { ease: "easeDefault" },
        onComplete: () => {
          document.body.setAttribute("data-loader", "false");
          startLenis();
        },
      });

      tl
        // 1) "SWEET FLOWERS" aparece (juntas, sin stagger), gap chico.
        .to(spans, { autoAlpha: 1, duration: 0.5 })
        // 2) En t=1: se separan (transición CSS por data-expanded) y nace el video.
        .call(
          () => {
            nameEl.setAttribute("data-expanded", "true");
          },
          undefined,
          1,
        )
        // 3) El video (retrato) nace en el hueco central: scale 0.5→1, rota a 7.5°.
        .fromTo(
          media,
          { autoAlpha: 0, scale: 0.5 },
          { autoAlpha: 1, scale: 1, rotate: 7.5, duration: 1 },
          "<",
        )
        // 4) El nombre desaparece (no reaparece).
        .to(nameEl, { autoAlpha: 0, duration: 0.25 })
        // 5) El video crece a full, vuelve a recto; el video interno baja a scale 1;
        //    aparece el overlay. Simultáneos (1.5s).
        .to(media, {
          width: "100%",
          height: "100%",
          rotate: 0,
          duration: 1.5,
        })
        .to(mediaInner, { scale: 1, duration: 1.5 }, "<")
        .to(overlay, { autoAlpha: 1, duration: 1.5 }, "<")
        // 6) El contenido del hero Y el header entran juntos sobre el final de la
        //    expansión (nunca antes — regla De Puydt).
        .to(
          revealFinal,
          { autoAlpha: 1, duration: 0.6, immediateRender: false },
          "<+0.75",
        );
    },
    { scope: root },
  );

  return (
    <div ref={root} className="c-loader" aria-hidden="true">
      {/* Flex con column-gap que se abre: "SWEET" a la izquierda del hueco,
          "FLOWERS" a la derecha; el padding compensa para centrar el hueco. */}
      <div className="c-loader__name" data-expanded="false">
        <span>{WORDS[0]}</span>
        <span>{WORDS[1]}</span>
      </div>
    </div>
  );
}
