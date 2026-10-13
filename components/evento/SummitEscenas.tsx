"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, CustomEase, useGSAP } from "@/lib/gsap";

/**
 * SummitEscenas — sección pineada de "escenas" del Summit.
 * Réplica (medida en vivo) del "c-services" de depuydthaarden.be, adaptada:
 *  · Pin de 750px de scroll POR escena (end = +750·N).
 *  · Índice = floor(progress·N). Al cambiar: la foto nueva (grande y chica) se
 *    pone encima (zIndex creciente) y se abre desde abajo (clip-path) con
 *    scale 1.25 → 1, 1.5s, ease cubic-bezier(0.19,1,0.22,1).
 *  · Títulos gigantes: el saliente yPercent → −125 + fade; el entrante desde
 *    +125. Barra de progreso = progress del pin (tween .2s linear).
 *  · Layout @1296: fotos grandes en la mitad izquierda a sangre; columna
 *    derecha (cols 8–12) con párrafo arriba (Cormorant itálica 22/1.1), foto
 *    3:2 centrada y contador "1 —— 5" abajo.
 * Contenido = placeholder del Summit (TODO(contenido): textos/fotos reales).
 */

const ESCENAS = [
  { titulo: "Charlas", seed: "charlas" },
  { titulo: "Escena", seed: "escena" },
  { titulo: "Comunidad", seed: "comunidad" },
  { titulo: "Proveedores", seed: "proveedores" },
  { titulo: "Networking", seed: "networking" },
] as const;

const TEXTO =
  "El Summit es más que charlas. Es la escena del año montada pieza por pieza, la comunidad que se encuentra, los proveedores que importan y las conversaciones que después se convierten en trabajo. Un día pensado entero, de la entrada al último brindis.";

const STEP = 750; // px de scroll por escena (como el original)

export function SummitEscenas() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const N = ESCENAS.length;
      const groups = Array.from(el.querySelectorAll<HTMLElement>("[data-escenas-imgs]"));
      const titles = Array.from(el.querySelectorAll<HTMLElement>("[data-escenas-titles] span"));
      const current = el.querySelector<HTMLElement>("[data-escenas-current]");
      const bar = el.querySelector<HTMLElement>("[data-escenas-bar]");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!gsap.parseEase("sfIntro")) CustomEase.create("sfIntro", "0.19, 1, 0.22, 1");

      // Estado inicial: la 1ª escena arriba; títulos fuera salvo el primero.
      groups.forEach((g) =>
        g.querySelectorAll<HTMLElement>("figure").forEach((f, i) => (f.style.zIndex = String(N - i))),
      );
      gsap.set(titles, { yPercent: 125, opacity: 0 });
      gsap.set(titles[0], { yPercent: 0, opacity: 1 });
      if (reduce) return;

      const state = { index: 0, z: N };

      const goTo = (next: number) => {
        groups.forEach((g) => {
          const fig = g.querySelectorAll<HTMLElement>("figure")[next];
          if (!fig) return;
          state.z += 1;
          fig.style.zIndex = String(state.z);
          gsap.fromTo(
            fig,
            { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", scale: 1.25 },
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", scale: 1, duration: 1.5, ease: "sfIntro", overwrite: true },
          );
        });
        const prev = titles[state.index];
        if (prev) {
          gsap.to(prev, {
            yPercent: -125,
            opacity: 0,
            duration: 1.5,
            ease: "sfIntro",
            overwrite: true,
            onComplete: () => {
              if (state.index !== titles.indexOf(prev)) gsap.set(prev, { yPercent: 125 });
            },
          });
        }
        gsap.fromTo(
          titles[next],
          { yPercent: 125, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.5, ease: "sfIntro", overwrite: true },
        );
        if (current) current.textContent = String(next + 1);
        state.index = next;
      };

      const st = ScrollTrigger.create({
        trigger: el,
        start: "clamp(top top)",
        end: `+=${STEP * N}`,
        pin: true,
        onUpdate: (self) => {
          const p = self.progress > 0.99 ? 1 : self.progress;
          if (bar) gsap.to(bar, { width: `${p * 100}%`, duration: 0.2, ease: "none", overwrite: true });
          const idx = Math.min(Math.floor((self.progress * STEP * N) / STEP), N - 1);
          if (idx !== state.index) goTo(idx);
        },
      });
      return () => st.kill();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-theme="dark"
      aria-label="Qué vas a vivir en el Summit"
      className="relative h-svh overflow-hidden bg-ink text-bone"
    >
      {/* Fotos grandes: mitad izquierda a sangre (mobile: fondo completo) */}
      <div data-escenas-imgs className="absolute inset-y-0 left-0 z-[1] w-full overflow-hidden md:w-1/2">
        {ESCENAS.map((e, i) => (
          <figure key={e.seed} className="absolute inset-0 m-0">
            <Image
              src={`https://picsum.photos/seed/sfdp-sm-esc-${e.seed}/1280/1920`}
              alt=""
              fill
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </figure>
        ))}
      </div>
      {/* Mobile: velo para leer el texto sobre la foto */}
      <div className="absolute inset-0 z-[1] bg-ink/60 md:hidden" aria-hidden="true" />

      {/* Columna derecha */}
      <div className="relative z-[2] h-full px-6 md:px-12">
        <div className="grid h-full grid-cols-12 gap-x-6">
          <div className="col-span-12 flex h-full flex-col md:col-span-5 md:col-start-8 2xl:col-span-3 2xl:col-start-9">
            <div className="flex-1 pt-24 md:pt-28">
              <p className="font-(family-name:--font-logo) text-[clamp(1.15rem,1.7vw,1.45rem)] italic leading-[1.1] text-bone">
                {TEXTO}
              </p>
            </div>

            <div data-escenas-imgs className="relative my-auto aspect-[3/2] overflow-hidden">
              {ESCENAS.map((e) => (
                <figure key={e.seed} className="absolute inset-0 m-0">
                  <Image
                    src={`https://picsum.photos/seed/sfdp-sm-esc-${e.seed}-b/960/640`}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 90vw, 40vw"
                    className="object-cover"
                  />
                </figure>
              ))}
            </div>

            <div className="flex flex-1 items-end pb-20 pt-10">
              <div className="flex w-full items-center gap-4 font-(family-name:--font-logo) text-2xl italic text-bone">
                <span data-escenas-current>1</span>
                <span className="relative h-px flex-1 bg-bone/25">
                  <span data-escenas-bar className="absolute left-0 top-0 h-px w-0 bg-bone" />
                </span>
                <span>{ESCENAS.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Títulos gigantes, centrados sobre todo */}
      <div
        data-escenas-titles
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 z-[3] h-[1.15em] -translate-y-1/2 text-center font-(family-name:--font-logo) text-[clamp(3rem,11.1vw,13rem)] font-light uppercase leading-[1.15]"
      >
        {ESCENAS.map((e) => (
          <span key={e.titulo} className="absolute inset-x-0 top-0 block">
            {e.titulo}
          </span>
        ))}
      </div>
      <h2 className="sr-only">Qué vas a vivir: {ESCENAS.map((e) => e.titulo).join(", ")}</h2>
    </section>
  );
}
