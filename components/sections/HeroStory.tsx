"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/**
 * HeroStory — frases cinéticas sincronizadas con el video del hero.
 *
 * El video (30s, transiciones en arco) es el reloj: una timeline GSAP pausada
 * de 30s se posiciona en cada frame en `video.currentTime`, así cada frase
 * entra (máscara desde abajo) y sale (hacia arriba) justo con su toma, y el
 * loop del video reinicia el texto sin desfasajes.
 *
 * El texto es HTML real (h1 para SEO/lectores), no quemado en el video.
 * Tiempos = cortes del video (ver docs: toma n empieza en SHOT_STARTS[n]).
 */

// [frase, entra (s), termina de salir (s)] — alineado a las tomas del video.
// El video arranca cuando nace en el loader; la 1ª frase espera a que el hero
// termine de expandirse (~2.3s después).
const PHRASES: [string, number, number][] = [
  ["Creamos la escenografía", 2.5, 5.8],
  ["de tus mejores momentos", 6.5, 10.1],
  ["Hierro, MDF, madera y telas", 10.9, 14.8],
  ["para transformar", 15.5, 17.8],
  ["cualquier evento", 18.5, 21.5],
  ["en una experiencia", 22.2, 24.9],
  ["memorable.", 25.6, 29.1],
];
const DURATION = 30;
const IN_DUR = 0.9;
const IN_STAGGER = 0.06;
const OUT_DUR = 0.55;
const OUT_STAGGER = 0.04;

const FULL_TEXT =
  "Creamos la escenografía de tus mejores momentos. Piezas en hierro, MDF, madera y telas para transformar cualquier evento en una experiencia memorable.";

export function HeroStory() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const video = document.querySelector<HTMLVideoElement>(".c-hero__media video");
      if (!el || !video) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const phraseEls = el.querySelectorAll<HTMLElement>(".hero-phrase");
      const tl = gsap.timeline({ paused: true });

      phraseEls.forEach((p, i) => {
        const [, tIn, tOut] = PHRASES[i];
        const split = SplitText.create(p, { type: "words", mask: "words" });
        gsap.set(p, { autoAlpha: 1 });
        gsap.set(split.words, { yPercent: 110 });
        const outLen = OUT_DUR + OUT_STAGGER * (split.words.length - 1);
        tl.fromTo(
          split.words,
          { yPercent: 110 },
          { yPercent: 0, duration: IN_DUR, ease: "expo.out", stagger: IN_STAGGER },
          tIn,
        ).to(
          split.words,
          { yPercent: -110, duration: OUT_DUR, ease: "power3.in", stagger: OUT_STAGGER },
          tOut - outLen,
        );
      });
      tl.set({}, {}, DURATION); // largo exacto = video

      // El video es el reloj.
      const sync = () => {
        tl.time(video.currentTime % DURATION);
      };
      gsap.ticker.add(sync);

      // Arranca cuando el video nace en el loader (evento del Loader, que corre
      // SIEMPRE al entrar al inicio — carga directa o navegación cliente).
      const start = () => {
        video.play().catch(() => {});
      };
      window.addEventListener("sf:hero-start", start, { once: true });

      // Performance: fuera de pantalla, el video se pausa.
      let started = false;
      const onPlay = () => (started = true);
      video.addEventListener("play", onPlay);
      const io = new IntersectionObserver(([entry]) => {
        if (!started) return;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
      io.observe(video);

      return () => {
        gsap.ticker.remove(sync);
        window.removeEventListener("sf:hero-start", start);
        video.removeEventListener("play", onPlay);
        io.disconnect();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative w-full">
      {/* Texto completo para SEO y lectores; visible solo con reduced-motion. */}
      <h1 className="sr-only motion-reduce:not-sr-only motion-reduce:mx-auto motion-reduce:block motion-reduce:max-w-[22ch] motion-reduce:font-display motion-reduce:text-(length:--text-step-4) motion-reduce:font-extrabold motion-reduce:uppercase motion-reduce:leading-[0.95] motion-reduce:text-bone">
        {FULL_TEXT}
      </h1>

      {/* Frases cinéticas: todas apiladas en la misma celda. */}
      <div aria-hidden="true" className="grid motion-reduce:hidden">
        {PHRASES.map(([text]) => (
          <p
            key={text}
            className="hero-phrase invisible text-balance col-start-1 row-start-1 mx-auto max-w-[16ch] self-center font-display text-(length:--text-step-5) font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-bone md:max-w-[18ch] md:text-[clamp(2.6rem,1.6rem+3.4vw,4.2rem)]"
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}
