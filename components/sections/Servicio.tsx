"use client";

import { useRef } from "react";
import Image from "next/image";
import { FadeUp } from "@/components/motion/FadeUp";

// TODO(contenido): copy, títulos y fotos reales (ver docs/16_DECISIONS.md → 03_SERVICIO).
// Adaptación del bloque "Savoir-faire" de momoamo.com → mood premium editorial cálido.

// Slides del carrusel (scroll horizontal nativo + scroll-snap).
const SLIDES = [
  {
    seed: "sfdp-serv-1",
    titulo: "De 15 a 300 invitados",
    sub: "Un evento, una escenografía.",
  },
  {
    seed: "sfdp-serv-2",
    titulo: "Montaje a medida",
    sub: "Nos adaptamos a tu espacio.",
  },
  {
    seed: "sfdp-serv-3",
    titulo: "En todo el país",
    sub: "Llevamos la decoración a donde sea.",
  },
  {
    seed: "sfdp-serv-4",
    titulo: "Diseño & singularidad",
    sub: "Piezas que no se repiten.",
  },
  {
    seed: "sfdp-serv-5",
    titulo: "Producto propio",
    sub: "Hierro, madera y textil.",
  },
  {
    seed: "sfdp-serv-6",
    titulo: "Llave en mano",
    sub: "Del boceto al montaje.",
  },
] as const;

// Features de la grilla (4 columnas en desktop, 1 en mobile).
const FEATURES = [
  {
    titulo: "Selección de piezas",
    desc: "Curaduría de piezas únicas para cada estética.",
  },
  {
    titulo: "Escenografía a medida",
    desc: "Diseñamos la escena según tu espacio y tu historia.",
  },
  {
    titulo: "Montaje llave en mano",
    desc: "Del boceto al armado, nos ocupamos de todo.",
  },
  {
    titulo: "Producción propia",
    desc: "Fabricamos en hierro, MDF, madera y textil.",
  },
] as const;

/**
 * Sección SERVICIO — carrusel horizontal (scroll-snap nativo) + bloque editorial
 * + grilla de features. Sin librerías externas: las flechas usan scrollBy sobre
 * el track. Referencia: "Savoir-faire" de momoamo.com.
 */
export function Servicio() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Desplaza el carrusel un slide (desktop muestra 3 por vista → 1/3 del track).
  const scrollByStep = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const step = track.clientWidth / 3;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // Drag-to-scroll con mouse/pen (el touch usa el scroll nativo del navegador).
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return; // touch = swipe nativo
    const track = trackRef.current;
    if (!track) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: track.scrollLeft,
    };
    track.style.scrollSnapType = "none"; // sin snap mientras arrastro (suave)
    track.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft =
      drag.current.startScroll - (e.clientX - drag.current.startX);
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const track = trackRef.current;
    if (!track) return;
    track.style.scrollSnapType = ""; // restaura el snap → se acomoda al soltar
    try {
      track.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  return (
    <section
      id="servicio"
      className="relative w-full overflow-hidden bg-blush py-[64px] text-ink md:py-[120px]"
    >
      {/* 1) Encabezado centrado (dos líneas: quiebre antes de la marca) + flechas */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <FadeUp y={100}>
          <h2 className="mx-auto text-center font-display text-[length:var(--text-step-4)] font-bold uppercase leading-[0.92] text-ink sm:text-[length:var(--text-step-5)] md:text-[length:var(--text-step-6)]">
            {/* TODO(contenido): titular real */}
            Una fiesta
            <br />
            Sweet Flowers es…
          </h2>
        </FadeUp>

        <nav
          className="mt-8 hidden justify-center gap-3 md:flex"
          aria-label="Navegación del carrusel"
        >
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => scrollByStep(-1)}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-champagne transition-colors duration-300 ease-[var(--ease-out-expo)] hover:bg-champagne/10"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
              className="text-champagne"
            >
              <path
                d="M20 6 10 16l10 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => scrollByStep(1)}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-champagne transition-colors duration-300 ease-[var(--ease-out-expo)] hover:bg-champagne/10"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
              className="text-champagne"
            >
              <path
                d="M12 6l10 10-10 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </nav>
      </div>

      {/* 2) Carrusel — respeta los márgenes del sitio; scroll-snap + flechas + drag */}
      <div className="mx-auto mt-12 max-w-[1400px] px-6 md:px-10">
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          className="flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto pb-4 select-none [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        >
          {SLIDES.map((slide) => (
          <article
            key={slide.seed}
            className="group relative w-[78vw] shrink-0 snap-start overflow-hidden rounded-[var(--radius-md)] sm:w-[48%] md:w-[calc((100%-2rem)/3)]"
          >
            <Image
              src={`https://picsum.photos/seed/${slide.seed}/600/800`}
              alt=""
              width={600}
              height={800}
              draggable={false}
              sizes="(max-width: 639px) 78vw, (max-width: 767px) 48vw, 33vw"
              className="pointer-events-none h-[320px] w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 lg:h-[400px]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
            <header className="absolute bottom-4 left-4 max-w-[250px] md:bottom-6 md:left-6 md:max-w-[351px]">
              <h3 className="font-display text-[length:var(--text-step-1)] font-bold uppercase leading-[0.9] text-bone">
                {slide.titulo}
              </h3>
              <p className="font-sans text-[length:var(--text-step--1)] leading-snug text-bone">
                {slide.sub}
              </p>
            </header>
          </article>
          ))}
        </div>
      </div>

      {/* 3) Bloque grande centrado */}
      <div className="mx-auto mt-12 max-w-[1400px] px-6 md:my-[76px] md:px-10">
        <FadeUp y={100} className="mx-auto max-w-[900px] text-center">
          <h3 className="mb-6 font-display text-[length:var(--text-step-5)] font-bold uppercase leading-[0.9] text-ink md:text-[length:var(--text-step-6)]">
            {/* TODO(contenido): titular real */}
            El verdadero oficio de Sweet Flowers
          </h3>
          <p className="mx-auto max-w-[720px] font-display text-[length:var(--text-step-2)] font-normal leading-[1.05] text-ink md:text-[length:var(--text-step-3)]">
            {/* TODO(contenido): copy real */}
            No decoramos: creamos experiencias a medida. Escuchamos tu historia,
            imaginamos la escena y la construimos pieza por pieza, para que cada
            fiesta sea irrepetible.
          </p>
        </FadeUp>
      </div>

      {/* 4) Grilla de features */}
      <div className="mx-auto mt-8 grid max-w-[1400px] grid-cols-1 gap-12 px-6 md:mt-[76px] md:grid-cols-4 md:px-10">
        {FEATURES.map((feature, i) => (
          <FadeUp key={feature.titulo} y={50}>
            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              {/* Ícono: círculo con el número del feature */}
              <div className="grid h-10 w-10 place-items-center rounded-full border border-champagne text-[length:var(--text-step--1)] font-bold text-champagne">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h4 className="font-display text-[length:var(--text-step-2)] font-bold uppercase leading-[0.9] text-ink [overflow-wrap:anywhere]">
                {feature.titulo}
              </h4>
              <p className="mt-1 font-sans text-[length:var(--text-step-0)] leading-snug text-ink">
                {feature.desc}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
