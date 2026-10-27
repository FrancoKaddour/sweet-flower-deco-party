"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, conFuentes } from "@/lib/gsap";
import { heroEnModoLiviano } from "@/components/sections/HeroMedia";

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
// Le hablan a la decoradora (E-22): solo datos confirmados (CONTENIDO_FLOR).
// Siempre DOS líneas cortas por frase (se leen de corrido, como una oración
// que avanza con el video). Cada frase entra y sale en un corte de toma.
const PHRASES: [string, string, number, number][] = [
  ["Las estructuras", "que arman tus eventos", 2.5, 10.1],
  ["Hierro, catering,", "fundas y telas", 10.9, 14.8],
  ["Hechas en Tortuguitas,", "por encargo", 15.5, 21.5],
  ["con envío", "a todo el país.", 22.2, 24.9],
  ["Vos armás la escena.", "Nosotros, las piezas.", 25.6, 29.1],
];
const DURATION = 30;
const IN_DUR = 0.9;
const IN_STAGGER = 0.06;
const OUT_DUR = 0.55;
const OUT_STAGGER = 0.04;

const FULL_TEXT = "Las estructuras que arman tus eventos";

export function HeroStory() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const el = root.current;
      const video = document.querySelector<HTMLVideoElement>(".c-hero__media video");
      if (!el || !video) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const phraseEls = el.querySelectorAll<HTMLElement>(".hero-phrase");
      const tl = gsap.timeline({ paused: true });
      tl.set({}, {}, DURATION); // largo exacto = video

      // El split espera a las fuentes (sin reflow) y queda dentro del contexto
      // de useGSAP (contextSafe) → se revierte en el cleanup.
      const armar = () => {
        phraseEls.forEach((p, i) => {
          const [, , tIn, tOut] = PHRASES[i];
          const split = SplitText.create(p, { type: "words", mask: "words", tag: "span", wordsClass: "reveal-word" });
          // Fuera de su ventana la frase queda OCULTA (autoAlpha 0): las tildes y
          // ascendentes de Cormorant asomaban por encima/debajo de la máscara
          // como rayitas sueltas. Además se corre 170% (no 110%) para que la
          // máscara (con aire, ver .hero-phrase en globals.css) no la deje ver.
          gsap.set(p, { autoAlpha: 0 });
          gsap.set(split.words, { yPercent: 170 });
          const outLen = OUT_DUR + OUT_STAGGER * (split.words.length - 1);
          tl.set(p, { autoAlpha: 0 }, 0)
            .set(p, { autoAlpha: 1 }, tIn)
            .fromTo(
              split.words,
              { yPercent: 170 },
              { yPercent: 0, duration: IN_DUR, ease: "expo.out", stagger: IN_STAGGER },
              tIn,
            )
            .to(
              split.words,
              { yPercent: -170, duration: OUT_DUR, ease: "power3.in", stagger: OUT_STAGGER },
              tOut - outLen,
            )
            .set(p, { autoAlpha: 0 }, tOut);
        });
        tl.time(tl.time()); // re-render en la posición actual
      };
      const cancelarFuentes = conFuentes(contextSafe ? contextSafe(armar) : armar);

      // Reloj propio (mismo guion de 30s, en loop) cuando NO hay video que mire:
      // modo liviano (ahorro de datos / red lenta → solo póster) o iOS en modo
      // bajo consumo, que rechaza play() aunque el video sea muted.
      let relojPropio = heroEnModoLiviano() || video.dataset.lite === "true";
      let started = false;

      // El video es el reloj. Solo se re-posiciona mientras el video corre
      // (pausado fuera de pantalla → cero trabajo por frame).
      const sync = () => {
        if (!video.paused) tl.time(video.currentTime % DURATION);
      };
      const usarRelojPropio = () => {
        gsap.ticker.remove(sync);
        relojPropio = true;
        started = true;
        tl.repeat(-1).play();
      };
      if (!relojPropio) gsap.ticker.add(sync);

      // iOS: muted/playsInline como PROPIEDADES justo antes de play() (el
      // atributo de React no alcanza en todas las versiones de Safari).
      const reproducir = () => {
        if (video.dataset.pausa) return; // el usuario lo pausó (HeroPausa)
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.play().catch((err: unknown) => {
          // Solo si el sistema NO deja reproducir (bajo consumo); un AbortError
          // (pausa/cambio de src a mitad de carga) no debe desenganchar el reloj.
          if ((err as { name?: string } | null)?.name === "NotAllowedError") usarRelojPropio();
        });
      };

      // Arranca cuando el video nace en el loader (evento del Loader, que corre
      // SIEMPRE al entrar al inicio — carga directa o navegación cliente).
      const start = () => {
        if (relojPropio) usarRelojPropio();
        else reproducir();
      };
      window.addEventListener("sf:hero-start", start, { once: true });
      // Si la intro ya terminó antes de montar (F5 sin intro), arrancar directo.
      if (document.body.getAttribute("data-loader") === "false") start();

      // Botón de pausa (T-08): congela también el reloj propio.
      const onPausa = (e: Event) => {
        const pausar = (e as CustomEvent<boolean>).detail;
        if (relojPropio) {
          if (pausar) tl.pause();
          else tl.play();
        }
      };
      window.addEventListener("sf:hero-pausa", onPausa);

      // Performance: fuera de pantalla, el video (o el reloj propio) se pausa.
      const onPlay = () => (started = true);
      video.addEventListener("play", onPlay);
      const io = new IntersectionObserver(([entry]) => {
        if (!started) return;
        if (relojPropio) {
          if (entry.isIntersecting && !video.dataset.pausa) tl.play();
          else tl.pause();
        } else if (entry.isIntersecting) reproducir();
        else video.pause();
      });
      io.observe(video);

      return () => {
        cancelarFuentes();
        gsap.ticker.remove(sync);
        window.removeEventListener("sf:hero-start", start);
        window.removeEventListener("sf:hero-pausa", onPausa);
        video.removeEventListener("play", onPlay);
        io.disconnect();
        tl.kill();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative w-full">
      {/* Texto completo para SEO y lectores; visible solo con reduced-motion. */}
      <h1 className="sr-only motion-reduce:not-sr-only motion-reduce:block motion-reduce:max-w-[14ch] motion-reduce:t-voz-display motion-reduce:text-[length:clamp(2.75rem,1.6rem+4.6vw,6.5rem)] [@media(max-height:500px)_and_(orientation:landscape)]:motion-reduce:text-(length:--text-step-4) motion-reduce:text-bone">
        {FULL_TEXT}
      </h1>

      {/* Frases cinéticas: todas apiladas en la misma celda. */}
      <div aria-hidden="true" className="grid justify-items-start motion-reduce:hidden">
        {PHRASES.map(([l1, l2]) => (
          <p
            key={l1}
            className="hero-phrase t-voz-display invisible col-start-1 row-start-1 self-end text-[length:min(2.6rem,calc((100vw-3rem)/9.8))] leading-[1.06] text-bone sm:text-[length:min(3.6rem,calc((100vw-4rem)/10))] md:text-[length:clamp(3rem,1.6rem+3.4vw,5.5rem)] [@media(max-height:500px)_and_(orientation:landscape)]:text-[clamp(1.6rem,8svh,2.3rem)]"
          >
            <span className="block whitespace-nowrap">{l1}</span>
            <span className="block whitespace-nowrap">{l2}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
