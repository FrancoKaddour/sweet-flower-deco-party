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
import { usePathname } from "next/navigation";
import { gsap, CustomEase, useGSAP } from "@/lib/gsap";
import { startLenis, stopLenis } from "@/components/motion/SmoothScroll";

const WORDS: [string, string] = ["Sweet", "Flowers"];

export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  // El Loader vive en el layout raíz (persiste entre navegaciones): se re-ejecuta
  // cada vez que se ENTRA al inicio (carga directa o navegación cliente desde
  // logo/menú/footer). En cualquier otra página se apaga.
  const pathname = usePathname();

  useGSAP(
    () => {
      const nameEl = root.current?.querySelector<HTMLElement>(".c-loader__name");
      if (!nameEl) return;

      if (pathname !== "/") {
        // Fuera del inicio no hay intro: estado final directo (header visible,
        // scroll libre). Evita que el loader quede "armado" y trabe la vuelta.
        document.body.setAttribute("data-loader", "false");
        document.body.removeAttribute("data-skip-intro"); // recarga en otra página
        startLenis();
        return;
      }
      // Recarga (F5): el script inline del layout marcó data-skip-intro → sin
      // intro, solo arrancamos el video (y sus frases). Vale una sola vez:
      // navegar después al inicio vuelve a mostrar la intro.
      if (document.body.getAttribute("data-skip-intro") === "true") {
        document.body.removeAttribute("data-skip-intro");
        document.body.setAttribute("data-loader", "false");
        startLenis();
        window.dispatchEvent(new Event("sf:hero-start"));
        return;
      }
      // Entrando al inicio: estado inicial del loader (antes del paint).
      document.body.setAttribute("data-loader", "true");
      nameEl.setAttribute("data-expanded", "false");

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
      // Estado final (sitio usable): lo usan reduced-motion, la falta de
      // elementos y la red de seguridad. Nunca queda el scroll bloqueado.
      const finish = () => {
        if (document.body.getAttribute("data-loader") === "false") return;
        gsap.set(spans, { autoAlpha: 0 });
        if (media) {
          gsap.set(media, {
            autoAlpha: 1,
            clearProps: "width,height,transform,borderRadius",
          });
        }
        if (mediaInner) gsap.set(mediaInner, { scale: 1 });
        if (overlay) gsap.set(overlay, { autoAlpha: 1 });
        gsap.set(revealFinal, { autoAlpha: 1 });
        document.body.setAttribute("data-loader", "false");
        startLenis();
        window.dispatchEvent(new Event("sf:hero-start"));
      };
      if (!media || !mediaInner) {
        finish();
        return;
      }

      // Easing del doc.
      if (!gsap.parseEase("easeDefault")) {
        CustomEase.create("easeDefault", "0.4, 0, 0, 1");
      }

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // --- reduced-motion: saltar la intro, estado final directo ---------------
      if (reduce) {
        finish();
        return;
      }

      // El video nace en el HUECO entre las palabras, no necesariamente en el
      // centro de la caja del hero: (1) con el bloque centrado, el hueco queda
      // corrido (anchoSWEET − anchoFLOWERS) / 2 en horizontal; (2) si el hero es
      // más alto que la pantalla (celular apaisado), su centro cae más abajo que
      // el del loader. Se mide al NACER (fuentes ya cargadas) y se vuelve a 0
      // al expandirse.
      let offset: { x: number; y: number } | null = null;
      const measure = () => {
        if (offset) return offset;
        offset = { x: 0, y: 0 };
        if (spans.length !== 2) return offset;
        const a = spans[0].getBoundingClientRect();
        const b = spans[1].getBoundingClientRect();
        const m = media.getBoundingClientRect();
        const mx = m.left + m.width / 2;
        const my = m.top + m.height / 2;
        const vertical = getComputedStyle(nameEl).flexDirection === "column";
        const holeX = vertical
          ? nameEl.getBoundingClientRect().left + nameEl.getBoundingClientRect().width / 2
          : (a.right + b.left) / 2;
        const holeY = vertical ? (a.bottom + b.top) / 2 : (a.top + a.bottom) / 2;
        offset = { x: holeX - mx, y: holeY - my };
        return offset;
      };

      // Scroll bloqueado y en el top mientras corre la intro.
      stopLenis();
      window.scrollTo(0, 0);

      // Red de seguridad: si la pestaña quedó en segundo plano o algo trabó la
      // timeline, a los 9s el sitio queda usable igual.
      // (Salta la timeline a su final → mismo estado que una intro completa.)
      let tlRef: gsap.core.Timeline | null = null;
      const safety = window.setTimeout(() => {
        if (tlRef) tlRef.progress(1);
        finish();
      }, 9000);

      // Si se llega al inicio con la cortina de PageTransition encima, la intro
      // espera a que la cortina se retire (si no, el nombre aparecía tapado).
      const curtain = document.querySelector<HTMLElement>(".c-pt");
      const curtainUp = !!curtain && getComputedStyle(curtain).visibility === "visible";

      const tl = gsap.timeline({
        delay: curtainUp ? 1.6 : 0.75,
        defaults: { ease: "easeDefault" },
        onComplete: () => {
          window.clearTimeout(safety);
          document.body.setAttribute("data-loader", "false");
          startLenis();
        },
      });

      tlRef = tl;
      tl
        // 1) "SWEET FLOWERS" aparece (juntas, sin stagger), gap chico.
        .to(spans, { autoAlpha: 1, duration: 0.5 })
        // 2) En t=1: se separan (transición CSS por data-expanded) y nace el video.
        .call(
          () => {
            nameEl.setAttribute("data-expanded", "true");
            // El video corre desde que nace (y con él las frases de HeroStory).
            window.dispatchEvent(new Event("sf:hero-start"));
          },
          undefined,
          1,
        )
        // 3) El video (retrato) nace en el hueco central: scale 0.5→1, rota a 7.5°.
        .fromTo(
          media,
          {
            autoAlpha: 0,
            scale: 0.5,
            borderRadius: 22,
            // El centrado (translate −50% −50% del CSS) se declara explícito:
            // si la caja mide un ancho fraccionario, GSAP lo leía como px y al
            // crecer a 100% el video quedaba corrido medio ancho.
            xPercent: -50,
            yPercent: -50,
            x: () => measure().x,
            y: () => measure().y,
          },
          {
            autoAlpha: 1,
            scale: 1,
            rotate: 7.5,
            borderRadius: 22,
            xPercent: -50,
            yPercent: -50,
            x: () => measure().x,
            y: () => measure().y,
            duration: 1,
            immediateRender: false,
          },
          "<",
        )
        // 4) El nombre desaparece (no reaparece).
        .to(nameEl, { autoAlpha: 0, duration: 0.25 })
        // 5) El video crece a full, vuelve a recto; el video interno baja a scale 1;
        //    aparece el overlay. Simultáneos (1.5s). Acá arranca el video (y con
        //    él las frases sincronizadas de HeroStory).
        .to(media, {
          width: "100%",
          height: "100%",
          rotate: 0,
          x: 0, // del hueco al centro, acompañando la expansión
          y: 0,
          borderRadius: 0, // las esquinas se enderezan acompañando la expansión
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

      return () => window.clearTimeout(safety);
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
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
