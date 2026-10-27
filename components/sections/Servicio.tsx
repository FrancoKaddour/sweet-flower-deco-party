"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { FadeUp } from "@/components/motion/FadeUp";
import { SwipeDots } from "@/components/ui/SwipeDots";
import { italica } from "@/components/ui/fuentes";

// D-08: montajes TERMINADOS y piezas en uso (fotos propias: Summit 2026,
// workshop de Río Cuarto y catálogo). Cada pie dice qué es la foto, sin
// inventar cifras. E-23: nada de "montaje llave en mano" (no confirmado).
const SLIDES = [
  {
    img: "/img/summit/lg/sum-06.webp",
    titulo: "Event Summit 2026",
    sub: "La escena de la primera edición, en La Rural.",
  },
  {
    img: "/productos/cat-eclipse-1m-comida.jpg",
    titulo: "Estantería Eclipse",
    sub: "De las piezas de catering que más salen.",
  },
  {
    img: "/img/rio-cuarto/rc-09.webp",
    titulo: "Mesa dulce en Río Cuarto",
    sub: "Workshop 04, julio de 2025.",
  },
  {
    img: "/productos/arco-con-rombo.jpg",
    titulo: "Arco con rombo",
    sub: "Hierro pintado, listo para vestir.",
  },
  {
    img: "/img/summit/lg/sum-16.webp",
    titulo: "Escenario del Summit",
    sub: "Globos, telón y pista para la pasarela.",
  },
  {
    img: "/img/rio-cuarto/rc-01.webp",
    titulo: "Armado en vivo",
    sub: "El salón del workshop de Río Cuarto.",
  },
] as const;

// Cómo trabajamos — SOLO datos confirmados (docs/CONTENIDO_FLOR.md §1, §5, §7).
// Sin numerales: no es una secuencia (D-10).
const FEATURES = [
  {
    titulo: "Fabricación propia",
    desc: "Hierro, catering, fundas y telas sublimadas, hechos en nuestro taller de Tortuguitas.",
  },
  {
    titulo: "Por encargo",
    desc: "Contá unos 20 días desde que confirmás. Cerramos la producción por semana.",
  },
  {
    titulo: "Envíos a todo el país",
    desc: "Por Vía Cargo, con 50 % de descuento en el envío. Donde no llega, Buspack, MD o FlechaBus.",
  },
  {
    titulo: "Asesoramiento por WhatsApp",
    desc: "Te responden Flor o Tobías, sin bots: colores, medidas y envío.",
  },
] as const;

/**
 * Sección SERVICIO — carrusel horizontal (scroll-snap nativo) + bloque editorial
 * + grilla de features. Sin librerías externas: las flechas usan scrollBy sobre
 * el track. Referencia: "Savoir-faire" de momoamo.com.
 */
export function Servicio() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Mobile: el carrusel arranca CENTRADO en un slide del medio → hay fotos
  // para deslizar a izquierda y a derecha (no solo hacia la derecha).
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !window.matchMedia("(max-width: 639px)").matches) return;
    const slides = track.querySelectorAll<HTMLElement>("article");
    const mid = slides[Math.floor((slides.length - 1) / 2)];
    if (!mid) return;
    const prevSnap = track.style.scrollSnapType;
    track.style.scrollSnapType = "none";
    const m = mid.getBoundingClientRect();
    const t = track.getBoundingClientRect();
    track.scrollLeft += m.left - t.left - (track.clientWidth - m.width) / 2;
    requestAnimationFrame(() => {
      track.style.scrollSnapType = prevSnap;
    });
  }, []);

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
      data-theme="light"
      className="relative w-full overflow-hidden bg-blush py-[4rem] text-ink md:py-[7.5rem]"
    >
      {/* 1) Encabezado a la izquierda + flechas a la derecha */}
      <div className="mx-auto flex max-w-[87.5rem] items-end justify-between gap-8 px-6 md:px-10">
        <FadeUp y={60}>
          <h2 className="t-voz-display max-w-[14ch] text-[length:var(--text-step-5)] text-ink md:text-[length:var(--text-step-6)]">
            Así se ven las piezas armadas
          </h2>
        </FadeUp>

        <nav
          className="hidden shrink-0 gap-3 md:flex"
          aria-label="Navegación del carrusel"
        >
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => scrollByStep(-1)}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-ink/25 transition-colors duration-300 ease-[var(--ease-out-expo)] hover:border-ink"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
              className="text-ink"
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
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-ink/25 transition-colors duration-300 ease-[var(--ease-out-expo)] hover:border-ink"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
              className="text-ink"
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
      <div className="mx-auto mt-12 max-w-[87.5rem] px-6 md:px-10">
        {/* Mobile: el track sangra hasta los bordes (-mx-6 + px-6) → asoman
            las fotos vecinas y se entiende que se desliza. */}
        <div
          ref={trackRef}
          id="servicio-track"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          className="-mx-6 flex cursor-grab snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto overscroll-x-contain px-6 pb-4 select-none md:mx-0 md:scroll-px-0 md:px-0 [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        >
          {SLIDES.map((slide) => (
          <article
            key={slide.img}
            className="group relative w-[78vw] max-w-[24rem] shrink-0 snap-center overflow-hidden rounded-[var(--radius-md)] sm:w-[calc((100%-1rem)/2)] sm:max-w-none sm:snap-start md:w-[calc((100%-2rem)/3)]"
          >
            <Image
              src={slide.img}
              alt={`${slide.titulo}. ${slide.sub}`}
              width={600}
              height={800}
              draggable={false}
              sizes="(max-width: 639px) 78vw, (max-width: 767px) 48vw, 33vw"
              className="pointer-events-none aspect-[3/4] h-auto max-h-[70svh] w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 md:aspect-auto md:h-[20rem] lg:h-[25rem]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-ink/80" />
            <header className="absolute bottom-4 left-4 max-w-[15.625rem] md:bottom-6 md:left-6 md:max-w-[21.9375rem]">
              <h3 className="t-voz-display text-[length:var(--text-step-2)] text-bone">
                {slide.titulo}
              </h3>
              <p className="font-sans text-[length:var(--text-step--1)] leading-snug text-bone">
                {slide.sub}
              </p>
            </header>
          </article>
          ))}
        </div>
        <SwipeDots forId="servicio-track" count={SLIDES.length} label="Servicios" />
      </div>

      {/* 3) Cómo trabajamos — a la izquierda, voz display + bajada itálica */}
      <div className="mx-auto mt-16 max-w-[87.5rem] px-6 md:mt-[6rem] md:px-10">
        <FadeUp y={60} className="grid gap-6 md:grid-cols-12 md:items-end">
          <h3 className="t-voz-display max-w-[15ch] text-[length:var(--text-step-5)] text-ink md:col-span-7 md:text-[length:var(--text-step-6)]">
            Del taller a tu evento, sin intermediarios
          </h3>
          <p className={`${italica.className} t-voz-cita max-w-[30ch] text-[length:var(--text-step-2)] leading-[1.2] text-ink/80 md:col-span-5`}>
            Lo que pedís lo fabricamos nosotros, lo despachamos nosotros y, si
            tenés dudas, te contestamos nosotros.
          </p>
        </FadeUp>
      </div>

      {/* 4) Cómo trabajamos — 4 datos confirmados, con filete arriba */}
      <div className="mx-auto mt-12 grid max-w-[87.5rem] grid-cols-1 gap-10 px-6 sm:grid-cols-2 md:mt-16 md:px-10 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <FadeUp key={feature.titulo} y={40}>
            <div className="border-t border-ink/20 pt-5">
              <h4 className="t-voz-display text-[length:var(--text-step-2)] text-ink">
                {feature.titulo}
              </h4>
              <p className="mt-3 max-w-[34ch] text-[length:var(--text-step-0)] leading-snug text-ink/80">
                {feature.desc}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
