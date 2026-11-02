"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  TRAYECTORIA,
  WORKSHOPS_REALIZADOS,
  EDICION_LABEL,
} from "@/content/evento";
import { portadaDe } from "@/content/galerias";
import { gsap, ScrollTrigger, Observer, useGSAP } from "@/lib/gsap";
import { startLenis, stopLenis, saltarA } from "@/components/motion/SmoothScroll";

/**
 * TRAYECTORIA — scrollytelling con apilado de fotos, réplica del "Cynar
 * Spritz" (cynar.com) medido en vivo, adaptado al sistema de marca.
 *
 * Mecánica = la de Cynar, no un scrub: MÁQUINA DE ESTADOS POR GESTOS.
 *  · La sección es un wrapper alto (ESTADOS × 100svh) con un stage sticky
 *    100svh. Cuando el stage se traba (ScrollTrigger onEnter), el scroll se
 *    BLOQUEA (Lenis stop + Observer con preventDefault en wheel/touch) y cada
 *    gesto dispara UN paso con su animación COMPLETA (1s, power2.inOut ≈ el
 *    cubic-bezier(0.42,0,0.58,1) de Cynar) + lock de 850ms entre gestos.
 *    Nunca hay estados a medias: la animación siempre termina.
 *  · Estado 0 = intro. Estados 1..9 = las cartas cayendo (y 120vh → 0,
 *    scale 1.2 → 1). Gesto hacia arriba des-apila. En los extremos el scroll
 *    se libera solo (salto al borde del wrapper, sincronizado con Lenis).
 *  · Flechas / espacio / PageUp-Down también mueven pasos (teclado).
 *  · Cartas centradas en el MISMO punto; el desorden es la rotación estática
 *    (−8° a +8°, signo alternado — valores de la sección hermana de Cynar).
 *  · Reduced-motion: sin lock ni vuelos — el índice sigue al scroll y los
 *    cambios son instantáneos.
 */

const N = TRAYECTORIA.length; // 9 cartas
const ESTADOS = N + 1; // intro + 9

// Rotación estática por carta (la CTA va recta).
const GIROS = [-6, 4, -8, 6, -4, 8, -5, 5, 0] as const;

/** Pausa entre gestos (Cynar: 800ms). */
const LOCK_MS = 300;

/**
 * Un gesto = una carta. Los trackpads y las ruedas "con inercia" siguen
 * mandando eventos durante 1–2 s después de que el dedo se fue: eso hacía que
 * un solo scroll pasara varias cartas. Después de cada paso, el próximo solo
 * cuenta si hubo una PAUSA en los eventos (gesto nuevo) de al menos CALMA_MS.
 */
const CALMA_MS = 120;

/**
 * Ventana tras soltar el scroll en la que se ignoran re-activaciones EN LA
 * MISMA DIRECCIÓN del salto. El salto de liberación puede disparar callbacks
 * espurios de ScrollTrigger (p. ej. un refresh o un evento de scroll nativo
 * diferido): sin esta guardia, un onEnter espurio vuelve a trabar la sección
 * y tira el scroll al borde — bucle infinito. Es DIRECCIONAL a propósito: si
 * el usuario suelta abajo y enseguida scrollea hacia arriba (reingreso real
 * por el otro borde), la activación sí se permite.
 */
const GUARDIA_MS = 600;

const CSS = `
.tray-pill{animation:tray-pulso 2.2s ease-in-out infinite}
@keyframes tray-pulso{0%,100%{opacity:.55}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){.tray-pill{animation:none}}
`;

export function EdicionesScroll() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const intro = el.querySelector<HTMLElement>("[data-tray-intro]");
      const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-tray-card]"));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const pintar = (idx: number, dur: number) => {
        if (intro) gsap.to(intro, { autoAlpha: idx === 0 ? 1 : 0, duration: dur, ease: "power3.out", overwrite: true });
        cards.forEach((c, i) => {
          const visible = i < idx;
          gsap.to(c, {
            y: visible ? 0 : "120vh",
            scale: visible ? 1 : 1.2,
            autoAlpha: visible ? 1 : 0,
            duration: dur,
            ease: "power3.out",
            overwrite: true,
          });
        });
      };

      const indiceDesdeScroll = () => {
        const r = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        if (total <= 0) return 0;
        const p = Math.min(Math.max(-r.top / total, 0), 1);
        return Math.round(p * N);
      };

      const bordes = () => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        return { top, bottom: top + el.offsetHeight - window.innerHeight };
      };

      // ── Reduced-motion: sin lock — el índice sigue al scroll, instantáneo ──
      if (reduce) {
        const state = { index: -1 };
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onUpdate: () => {
            const idx = indiceDesdeScroll();
            if (idx === state.index) return;
            state.index = idx;
            pintar(idx, 0);
          },
        });
        return () => st.kill();
      }

      // ── Máquina de estados por gestos ─────────────────────────────────────
      const state = { index: 0, busy: false };
      let activo = false;
      // Último gesto encolado mientras corre el lock (1 = baja, -1 = sube).
      let pendiente: 1 | -1 | 0 = 0;
      // Escudo de reentrada: activar/soltar saltan el scroll, y ese salto
      // dispara callbacks de ScrollTrigger SINCRÓNICOS (Lenis emite "scroll"
      // al instante). Mientras normalizan, los callbacks se ignoran.
      let normalizando = false;
      // Guardia post-liberación: bloquea re-activaciones espurias en la misma
      // dirección del salto (ver GUARDIA_MS).
      let ultimoSoltar = { t: -Infinity, dir: 0 as 1 | -1 | 0 };

      // Gestos: cada evento actualiza el reloj; un paso solo arranca si el
      // evento anterior quedó lejos (pausa = gesto nuevo) — ver CALMA_MS.
      let ultimoEvento = -Infinity;
      let esperarGestoNuevo = false;
      const gesto = (dir: 1 | -1) => {
        const ahora = performance.now();
        const pausa = ahora - ultimoEvento;
        ultimoEvento = ahora;
        if (esperarGestoNuevo) {
          if (state.busy || pausa < CALMA_MS) return; // inercia del mismo gesto
          esperarGestoNuevo = false;
        }
        mover(dir);
      };
      const obs = Observer.create({
        target: window,
        type: "wheel,touch",
        preventDefault: true,
        tolerance: 8,
        onDown: () => gesto(1),
        onUp: () => gesto(-1),
      });
      obs.disable();

      const onKey = (e: KeyboardEvent) => {
        if (!activo) return;
        if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
          e.preventDefault();
          mover(1);
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          mover(-1);
        }
      };

      function mover(dir: 1 | -1) {
        const next = state.index + dir;
        // SALIDA EN LOS EXTREMOS: nunca la traga el lock de animación. Si
        // estás en la última carta (o en la intro) y scrolleás, salís SIEMPRE
        // — aunque la animación anterior siga corriendo. Sin esto, scrollear
        // rápido te dejaba atrapado: cada gesto caía en el lock de 850ms y
        // la sección nunca liberaba.
        if (next < 0) return soltar(-1);
        if (next > N) return soltar(1);
        // De a UNA carta: mientras corre la animación (1 s) no se encola nada.
        if (state.busy) return;
        esperarGestoNuevo = true;
        ejecutar(dir);
      }

      function ejecutar(dir: 1 | -1) {
        state.busy = true;
        state.index += dir;
        pintar(state.index, 0.65);
        window.setTimeout(() => {
          state.busy = false;
          if (!activo) {
            pendiente = 0;
            return;
          }
          const d = pendiente;
          pendiente = 0;
          if (d) mover(d);
        }, LOCK_MS);
      }

      function activar(desde: 1 | -1) {
        if (activo || normalizando) return;
        // Guardia post-liberación: solo bloquea re-activaciones en la MISMA
        // dirección del salto (espurias). El reingreso real por el otro
        // borde (dirección opuesta) siempre se permite.
        if (
          performance.now() - ultimoSoltar.t < GUARDIA_MS &&
          ultimoSoltar.dir === desde
        ) {
          return;
        }
        // Sincronizar con la posición real (p. ej. refresh a mitad de sección)
        // y normalizar el scroll al borde: como el stage es sticky, el salto
        // es invisible. El escudo evita que los callbacks de ScrollTrigger
        // que dispara el salto nos desactiven a mitad de camino.
        state.index = indiceDesdeScroll();
        pintar(state.index, 0);
        const b = bordes();
        normalizando = true;
        saltarA(desde === 1 ? b.top : b.bottom);
        normalizando = false;
        activo = true;
        // La inercia del scroll con el que llegaste no cuenta como gesto.
        esperarGestoNuevo = true;
        ultimoEvento = performance.now();
        stopLenis();
        document.documentElement.setAttribute("data-scroll-trabado", "");
        obs.enable();
        window.addEventListener("keydown", onKey);
      }

      function desactivar() {
        if (!activo || normalizando) return;
        activo = false;
        document.documentElement.removeAttribute("data-scroll-trabado");
        obs.disable();
        window.removeEventListener("keydown", onKey);
        startLenis();
      }

      function soltar(dir: 1 | -1) {
        const b = bordes();
        ultimoSoltar = { t: performance.now(), dir };
        pendiente = 0;
        // ORDEN CRÍTICO: Lenis primero. Si saltamos con Lenis frenado, su
        // target interno queda viejo y al reanudar nos TIRA PARA ATRÁS (la
        // sección se "re-bloquea" sola). Con Lenis corriendo, saltarA mueve
        // el scroll y su target interno juntos.
        normalizando = true;
        startLenis();
        saltarA(dir === 1 ? b.bottom + 2 : b.top - 2);
        normalizando = false;
        desactivar();
      }

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onEnter: () => activar(1),
        onEnterBack: () => activar(-1),
        onLeave: () => desactivar(),
        onLeaveBack: () => desactivar(),
      });
      // Carga con el scroll restaurado dentro de la sección.
      if (st.isActive) activar(indiceDesdeScroll() > N / 2 ? -1 : 1);

      return () => {
        desactivar();
        obs.kill();
        st.kill();
      };
    },
    { scope: root },
  );

  return (
    <section
      id="trayectoria"
      ref={root}
      data-theme="dark"
      aria-labelledby="trayectoria-h"
      className="relative bg-ink text-bone"
      style={{ height: `${ESTADOS * 100}svh` }}
    >
      <style>{CSS}</style>

      {/* STAGE sticky: lo que se ve mientras dura la sección */}
      <div className="sticky top-0 h-svh min-h-[30rem] overflow-hidden">
        {/* Fondo fijo + velo de tinta (grano de la casa) */}
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/img/summit/lg/sum-35.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/60" />
          <div className="evt-grain absolute inset-0" />
        </div>

        {/* INTRO (estado 0) */}
        <div
          data-tray-intro
          className="pointer-events-none absolute inset-0 z-[3] flex flex-col items-center justify-center px-6 text-center"
        >
          <Eyebrow className="mb-[clamp(0.5rem,2svh,1.5rem)]">La trayectoria</Eyebrow>
          <h2
            id="trayectoria-h"
            className="font-display text-[length:min(var(--text-step-5),7svh)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone [text-wrap:balance]"
          >
            El camino hasta acá
          </h2>
          <p className="mx-auto mt-[clamp(0.5rem,2svh,1.5rem)] max-w-[44ch] font-sans text-[length:var(--text-step--1)] leading-relaxed text-bone/70 md:text-[length:var(--text-step-0)]">
            {WORKSHOPS_REALIZADOS} workshops, una primera edición del Summit y
            ahora vamos por la {EDICION_LABEL}. La historia se va apilando:
            scrolleá y mirá.
          </p>
          <span className="tray-pill mt-[clamp(1rem,4svh,2.5rem)] inline-flex items-center gap-2 rounded-full border border-bone/30 px-4 py-2 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-bone/80">
            Seguí scrolleando <span aria-hidden="true">↓</span>
          </span>
        </div>

        {/* LA PILA — todas las cartas centradas en el mismo punto */}
        <div className="pointer-events-none absolute inset-0 z-[2] flex items-start justify-center pt-[10svh] md:items-center md:pt-0">
          {TRAYECTORIA.map((t, i) => {
            const href = t.proxima
              ? "#inscripcion"
              : `/event-summit/trayectoria/${t.slug}`;
            return (
              <div key={t.etapa} data-tray-card className="absolute translate-y-[120vh] opacity-0">
                {/* La carta nace OCULTA por CSS (clases de arriba): si el JS
                    todavía no corrió — o un hot-reload borró los estilos
                    inline — nunca se ve la pila entera amontonada. GSAP pisa
                    estas clases con estilos inline al pintar. */}
                {/* El giro va en el wrapper interno: GSAP es dueño del transform
                    del elemento animado y lo pisaría. */}
                <div style={{ transform: `rotate(${GIROS[i] ?? 0}deg)` }}>
                  {t.proxima ? (
                    <Link
                      href={href}
                      aria-label={`${t.etapa}: ${t.titulo}. Reservá tu lugar`}
                      className="pointer-events-auto relative block w-[min(86vw,24rem)] overflow-hidden rounded-[var(--radius-lg)] border border-champagne/40 bg-bordeaux p-7 shadow-[0_24px_60px_rgba(0,0,0,0.5)] outline-none ring-champagne focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink md:w-[min(48vw,44rem)] md:p-9 [@media(max-height:540px)]:w-[min(58svh,20rem)]"
                    >
                      <div className="evt-grain pointer-events-none absolute inset-0" />
                      <span className="relative text-[0.68rem] uppercase tracking-[0.18em] text-champagne md:text-[0.78rem]">
                        {t.etapa}
                      </span>
                      <span className="mt-20 block font-display text-[length:var(--text-step-4)] font-bold uppercase leading-[0.92] text-bone md:mt-28">
                        {t.titulo}
                      </span>
                      {t.detalle && (
                        <span className="mt-3 block text-[0.68rem] uppercase tracking-[0.14em] text-bone/75 md:text-[0.78rem]">
                          {t.detalle}
                        </span>
                      )}
                      <span className="mt-8 inline-flex items-center gap-2 border-b border-bone pb-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-bone md:text-[0.78rem]">
                        Reservá tu lugar <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  ) : (
                    <Link
                      href={href}
                      aria-label={`Ver ${t.etapa}: ${t.titulo}`}
                      className="pointer-events-auto block w-[min(86vw,24rem)] rounded-[2px] bg-bone p-3 pb-4 text-ink shadow-[0_24px_60px_rgba(0,0,0,0.5)] outline-none ring-champagne focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink md:w-[min(48vw,44rem)] md:p-3.5 md:pb-5 [@media(max-height:540px)]:w-[min(58svh,20rem)]"
                    >
                      {/* Apaisada (4:3, como los assets de Cynar) */}
                      <span className="relative block aspect-[4/3] w-full">
                        <Image
                          src={t.foto ?? portadaDe(t.slug ?? "", t.foto).src}
                          alt=""
                          fill
                          loading="eager"
                          sizes="(max-width: 767px) 86vw, 48vw"
                          className="object-cover"
                        />
                      </span>
                      <span className="mt-3 block text-[0.62rem] uppercase tracking-[0.18em] text-champagne-ink md:text-[0.7rem]">
                        {t.etapa}
                      </span>
                      <span className="mt-0.5 block font-display text-[length:var(--text-step-1)] font-bold uppercase leading-[0.95] md:text-[length:var(--text-step-2)]">
                        {t.titulo}
                      </span>
                      {(t.lugar || t.fecha) && (
                        <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.12em] text-ink/60 md:text-[0.7rem]">
                          {[t.lugar, t.fecha].filter(Boolean).join(" · ")}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumen para lectores de pantalla */}
      <p className="sr-only">
        Recorrido: {TRAYECTORIA.map((t) => `${t.etapa} (${t.titulo})`).join(", ")}.
      </p>
    </section>
  );
}
