"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { BENEFICIOS } from "@/content/membresia";

const CLIP_OCULTO = "inset(100% 0% 0% 0%)";
const CLIP_VISIBLE = "inset(0% 0% 0% 0%)";

/**
 * "ADENTRO" — beneficios con VENTANA DE ARCO (identidad El Arco).
 * Izquierda: índice editorial de beneficios (filas altas, hairlines).
 * Derecha: una ventana en forma de arco, sticky, cuya "vista" cambia con una
 * cortina LIGADA AL SCROLL (scrub): cada imagen sube desde abajo a medida que
 * su fila se acerca, y se retrae si scrolleás para arriba. La animación
 * acompaña el scroll en ambas direcciones — nunca "salta" ni se rompe.
 * Las capas se apilan por z-index (la vista i tapa a la i-1).
 * La fila activa se enciende; las demás bajan a 35%.
 * Reduced-motion: sin dimming ni cortinas (primera vista fija, filas plenas).
 */
export function BeneficiosVentana() {
  const root = useRef<HTMLElement>(null);
  const [activo, setActivo] = useState(0);

  // Cortinas scrubbed: la capa i se revela mientras la fila i se acerca al
  // centro. scrub:true → ida y vuelta perfecta con el scroll.
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const filas = gsap.utils.toArray<HTMLElement>(".bv-fila", el);
      const capas = gsap.utils.toArray<HTMLElement>(".bv-capa", el);

      filas.forEach((fila, i) => {
        // Estado activo de la fila (para el dimming).
        ScrollTrigger.create({
          trigger: fila,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActivo(i);
          },
        });

        // Cortina de la capa i (la 0 es la base, siempre visible).
        if (i > 0 && capas[i]) {
          gsap.fromTo(
            capas[i],
            { clipPath: CLIP_OCULTO },
            {
              clipPath: CLIP_VISIBLE,
              ease: "none",
              scrollTrigger: {
                trigger: fila,
                start: "top 85%",
                end: "top 40%",
                scrub: true,
              },
            },
          );
        }
      });
    },
    { scope: root },
  );

  // Dimming editorial: la fila activa plena, el resto en penumbra.
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const filas = gsap.utils.toArray<HTMLElement>(".bv-fila", el);
      filas.forEach((fila, i) => {
        gsap.to(fila, {
          opacity: i === activo ? 1 : 0.35,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    },
    { scope: root, dependencies: [activo] },
  );

  return (
    <section
      ref={root}
      data-theme="dark"
      className="bg-bordeaux px-6 py-24 text-bone md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Encabezado de la escena "adentro" */}
        <div className="mb-16 max-w-[52ch] md:mb-24">
          <p className="mb-5 text-[length:var(--text-step--1)] uppercase tracking-[0.2em] text-champagne">
            Ya estás adentro
          </p>
          <h2 className="font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-bone">
            {/* TODO(contenido): titular real */}
            Lo que cambia cuando entrás
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Índice de beneficios */}
          <div className="lg:col-span-7">
            {BENEFICIOS.map((b, i) => (
              <article
                key={b.titulo}
                className="bv-fila flex min-h-[38vh] flex-col justify-center border-t border-bone/15 py-10 lg:min-h-[52vh]"
              >
                <span className="font-display text-[length:var(--text-step--1)] tracking-[0.2em] text-champagne">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* TODO(contenido): beneficios reales de Flor (ADR-014). */}
                <h3 className="mt-3 max-w-[16ch] font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone [overflow-wrap:anywhere]">
                  {b.titulo}
                </h3>
                <p className="mt-4 max-w-[38ch] font-sans text-[length:var(--text-step-0)] leading-relaxed text-bone/70">
                  {b.desc}
                </p>
              </article>
            ))}
          </div>

          {/* Ventana del arco (sticky, desktop) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[10vh]">
              <div className="relative mx-auto aspect-[3/4.2] w-[min(100%,480px)] overflow-hidden rounded-t-full bg-ink/20">
                {BENEFICIOS.map((b, i) => (
                  <div
                    key={b.titulo}
                    className="bv-capa absolute inset-0"
                    // Apiladas en orden: la vista i tapa a la i-1. La cortina
                    // scrubbed (clip-path) decide cuánto de cada una se ve.
                    style={{
                      zIndex: i + 1,
                      clipPath: i === 0 ? CLIP_VISIBLE : CLIP_OCULTO,
                    }}
                  >
                    {/* TODO(contenido): foto real por beneficio. */}
                    <Image
                      src={`https://picsum.photos/seed/sfdp-mem-vista-${i}/700/1000`}
                      alt=""
                      fill
                      sizes="480px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-bordeaux/30 mix-blend-multiply" />
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-bone/45">
                La vista desde adentro
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
