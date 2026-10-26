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
 * Fotos reales de la 1ª edición. TODO(contenido): texto definitivo.
 */

const ESCENAS = [
  // Fotos reales de la 1ª edición: `img` = grande (vertical), `b` = chica (3:2).
  { titulo: "Charlas", seed: "charlas", img: "/img/summit/lg/sum-30.webp", b: "/img/summit/lg/sum-18.webp" },
  { titulo: "Escena", seed: "escena", img: "/img/summit/lg/sum-17.webp", b: "/img/summit/lg/sum-10.webp" },
  { titulo: "Comunidad", seed: "comunidad", img: "/img/summit/lg/sum-13.webp", b: "/img/summit/lg/sum-25.webp" },
  { titulo: "Proveedores", seed: "proveedores", img: "/img/summit/lg/sum-06.webp", b: "/img/summit/lg/sum-04.webp" },
  { titulo: "Networking", seed: "networking", img: "/img/summit/lg/sum-36.webp", b: "/img/summit/lg/sum-19.webp" },
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
      // Reduced-motion: el pin y el cambio de escena se mantienen (son
      // navegación, no decoración), pero los cambios son instantáneos.
      const dur = reduce ? 0 : 1.5;

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
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", scale: 1, duration: dur, ease: "sfIntro", overwrite: true },
          );
        });
        const prev = titles[state.index];
        if (prev) {
          gsap.to(prev, {
            yPercent: -125,
            opacity: 0,
            duration: dur,
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
          { yPercent: 0, opacity: 1, duration: dur, ease: "sfIntro", overwrite: true },
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
      {/* Fotos grandes: mitad izquierda a sangre. Modo compacto (celular o
          pantalla baja, p. ej. celular horizontal): fondo completo con velo y
          una sola columna → texto, título y contador sin superponerse.
          Variante de layout amplio: ≥768px de ancho Y ≥521px de alto. */}
      <div data-escenas-imgs className="absolute inset-y-0 left-0 z-[1] w-full overflow-hidden [@media(min-width:768px)_and_(min-height:521px)]:w-1/2">
        {ESCENAS.map((e, i) => (
          <figure key={e.seed} className="absolute inset-0 m-0">
            <Image
              src={e.img}
              alt=""
              fill
              priority={i === 0}
              sizes="(max-width: 900px) 100vw, 50vw"
              className="object-cover"
            />
          </figure>
        ))}
      </div>
      {/* Mobile: velo para leer el texto sobre la foto */}
      <div className="absolute inset-0 z-[1] bg-ink/60 [@media(min-width:768px)_and_(min-height:521px)]:hidden" aria-hidden="true" />

      {/* Columna derecha */}
      <div className="relative z-[2] h-full px-6 md:px-12">
        <div className="grid h-full grid-cols-12 gap-x-6">
          <div className="col-span-12 flex h-full flex-col [@media(min-width:768px)_and_(min-height:521px)]:col-span-5 [@media(min-width:768px)_and_(min-height:521px)]:col-start-8 [@media(min-width:1536px)_and_(min-height:521px)]:col-span-3 [@media(min-width:1536px)_and_(min-height:521px)]:col-start-9">
            <div className="pt-28 [@media(max-height:520px)]:pt-24 [@media(min-width:768px)_and_(min-height:521px)]:flex-1 [@media(min-width:768px)_and_(min-height:521px)]:pt-28">
              <p className="max-w-[60ch] font-(family-name:--font-logo) text-[clamp(1.15rem,1.7vw,1.45rem)] italic leading-[1.1] text-bone [@media(max-height:520px)]:text-[1.05rem]">
                {TEXTO}
              </p>
            </div>

            {/* Títulos gigantes. Compacto: en el flujo, centrados entre texto y
                contador. Amplio: absolutos, centrados sobre toda la sección. */}
            <div
              data-escenas-titles
              aria-hidden="true"
              className="pointer-events-none relative z-[3] my-auto h-[1.15em] w-full text-center font-(family-name:--font-logo) text-[clamp(2.2rem,min(12vw,20svh),6rem)] font-light uppercase leading-[1.15] [@media(min-width:768px)_and_(min-height:521px)]:absolute [@media(min-width:768px)_and_(min-height:521px)]:inset-x-0 [@media(min-width:768px)_and_(min-height:521px)]:top-1/2 [@media(min-width:768px)_and_(min-height:521px)]:my-0 [@media(min-width:768px)_and_(min-height:521px)]:-translate-y-1/2 [@media(min-width:768px)_and_(min-height:521px)]:text-[clamp(3rem,11.1vw,13rem)]"
            >
              {ESCENAS.map((e) => (
                <span key={e.titulo} className="absolute inset-x-0 top-0 block">
                  {e.titulo}
                </span>
              ))}
            </div>

            <div data-escenas-imgs className="relative isolate my-auto hidden aspect-[3/2] overflow-hidden [@media(min-width:768px)_and_(min-height:521px)]:block">
              {ESCENAS.map((e) => (
                <figure key={e.seed} className="absolute inset-0 m-0">
                  <Image
                    src={e.b}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 90vw, 40vw"
                    className="object-cover"
                  />
                </figure>
              ))}
            </div>

            <div className="flex items-end pb-24 pr-16 pt-6 [@media(max-height:520px)]:pb-6 [@media(min-width:768px)_and_(min-height:521px)]:flex-1 [@media(min-width:768px)_and_(min-height:521px)]:pb-20 [@media(min-width:768px)_and_(min-height:521px)]:pr-0 [@media(min-width:768px)_and_(min-height:521px)]:pt-10">
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

      <h2 className="sr-only">Qué vas a vivir: {ESCENAS.map((e) => e.titulo).join(", ")}</h2>
    </section>
  );
}
