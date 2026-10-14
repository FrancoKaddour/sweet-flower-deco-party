"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, ScrollTrigger, CustomEase, useGSAP } from "@/lib/gsap";
import { FadeUp } from "@/components/motion/FadeUp";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SwipeDots } from "@/components/ui/SwipeDots";

// TODO(contenido): productos, precios y fotos reales (ver docs/16_DECISIONS.md → 02_PRODUCTOS).
const PRODUCTOS = [
  { slug: "arco-floral",       nombre: "Arco floral",        material: "Hierro",  precio: "$ —" },
  { slug: "mesa-tribal",       nombre: "Mesa tribal",        material: "Madera",  precio: "$ —" },
  { slug: "panel-geometrico",  nombre: "Panel geométrico",   material: "MDF",     precio: "$ —" },
  { slug: "columna-romana",    nombre: "Columna romana",     material: "MDF",     precio: "$ —" },
  { slug: "funda-terciopelo",  nombre: "Funda de terciopelo",material: "Telas",   precio: "$ —" },
  { slug: "sosten-globos",     nombre: "Sostén de globos",   material: "Hierro",  precio: "$ —" },
  { slug: "arco-romano",       nombre: "Arco romano",        material: "Hierro",  precio: "$ —" },
  { slug: "cilindros",         nombre: "Set de cilindros",   material: "MDF",     precio: "$ —" },
  { slug: "bandeja-dorada",    nombre: "Bandeja dorada",     material: "Catering",precio: "$ —" },
  { slug: "torta-falsa",       nombre: "Base para torta",    material: "Catering",precio: "$ —" },
  { slug: "funda-sublimada",   nombre: "Funda sublimada",    material: "Telas",   precio: "$ —" },
  { slug: "panel-circular",    nombre: "Panel circular",     material: "MDF",     precio: "$ —" },
  { slug: "escalera-deco",     nombre: "Escalera deco",      material: "Madera",  precio: "$ —" },
  { slug: "marco-hexagonal",   nombre: "Marco hexagonal",    material: "Hierro",  precio: "$ —" },
  { slug: "mantel-saten",      nombre: "Mantel de satén",    material: "Telas",   precio: "$ —" },
  { slug: "mesa-ratona",       nombre: "Mesa ratona",        material: "Madera",  precio: "$ —" },
  { slug: "soporte-flores",    nombre: "Soporte de flores",  material: "Hierro",  precio: "$ —" },
  { slug: "letras-gigantes",   nombre: "Letras gigantes",    material: "MDF",     precio: "$ —" },
];

// Mobile: 2 páginas de 6 (grilla 2×3); las 6 restantes solo en md+.
const POR_PAGINA = 6;
const PAGINAS_MOBILE = 2;
const PAGINAS = Array.from({ length: Math.ceil(PRODUCTOS.length / POR_PAGINA) }, (_, i) =>
  PRODUCTOS.slice(i * POR_PAGINA, (i + 1) * POR_PAGINA),
);

// Misma "caída" que las colecciones del catálogo (CollectionCard): la foto cae
// de ARRIBA hacia ABAJO y asienta su escala en el mismo tiempo y curva
// (--clip-fall 1.3s, --ease-in-out-hard). Después entra el texto.
const FALL = 0.8; // más ágil que las colecciones: son 18 piezas chicas
// Orden de caída "desordenado" (posición 0..17 → turno) y variación de duración
// por card: todas caen al mismo disparo pero cada una con su tiempo.
const ORDER = [3, 11, 0, 14, 7, 2, 9, 5, 16, 1, 12, 6, 13, 4, 10, 17, 8, 15];
const DUR_VAR = [0.06, -0.08, 0.14, 0, -0.06, 0.1, -0.03, 0.08, -0.1];

/**
 * Sección DESTACADOS — vitrina de piezas individuales. Las fotos "caen" de
 * arriba a abajo (misma receta que las colecciones del catálogo) y después
 * entra el texto. Hover: zoom suave de la foto.
 */
export function Destacados() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = sectionRef.current?.querySelectorAll<HTMLElement>(".dest-card");
      if (!cards?.length) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return; // todo visible por defecto

      if (!gsap.parseEase("sfInOutHard")) {
        CustomEase.create("sfInOutHard", "0.77, 0, 0.175, 1"); // = --ease-in-out-hard
      }

      cards.forEach((card) => {
        const frame = card.querySelector<HTMLElement>(".dest-frame");
        const media = card.querySelector<HTMLElement>(".dest-media");
        const info = card.querySelector<HTMLElement>(".dest-info");
        gsap.set(frame, { clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(media, { scale: 1.12, transformOrigin: "50% 0%" });
        gsap.set(info, { autoAlpha: 0, y: 12 });
      });

      // UN solo disparo: al llegar a la grilla caen TODAS, cada una con su
      // propio tiempo (orden "desordenado" + duración distinta), misma curva →
      // la caída se siente uniforme pero viva, sin esperar el scroll por fila.
      const grid = sectionRef.current?.querySelector<HTMLElement>(".dest-grid");
      ScrollTrigger.create({
        trigger: grid,
        start: "top 85%",
        once: true,
        onEnter: () => {
          cards.forEach((card, i) => {
            const delay = ORDER[i % ORDER.length] * 0.03;
            const dur = FALL + DUR_VAR[i % DUR_VAR.length];
            const frame = card.querySelector(".dest-frame");
            const media = card.querySelector(".dest-media");
            const info = card.querySelector(".dest-info");
            gsap.to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: dur, ease: "sfInOutHard", delay });
            gsap.to(media, { scale: 1, duration: dur, ease: "sfInOutHard", delay });
            gsap.to(info, {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              delay: delay + dur - 0.15,
            });
          });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="destacados" className="bg-bone px-6 pb-24 pt-0 md:px-10 md:pb-32">
      <div className="mx-auto max-w-[87.5rem]">
        {/* Encabezado: título a la izquierda + CTA a la derecha */}
        <FadeUp
          y={80}
          className="mb-10 flex flex-col items-center gap-4 border-t border-ink/10 pt-10 text-center md:mb-14 md:flex-row md:items-end md:justify-between md:pt-14 md:text-left"
        >
          <div>
            {/* Continuación de "El catálogo" (Productos): misma sección visual,
                encabezado chico para no competir con el título de arriba. */}
            <Eyebrow className="mb-3">La tienda</Eyebrow>
            <h3 className="font-display text-[length:var(--text-step-2)] font-bold uppercase leading-[0.95] text-ink">
              {/* TODO(contenido): titular real */}
              Lo más pedido
            </h3>
          </div>
          <Link
            href="/productos"
            className="group inline-flex min-h-11 w-max items-center gap-2 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.1em] text-ink"
          >
            <span className="border-b border-ink pb-1">Ver toda la tienda</span>
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </FadeUp>

        {/* Grilla de productos — mobile: 2 páginas deslizables de 2×3 (12
            piezas; el resto en "Ver toda la tienda"). md+: grilla de 18.
            Las "páginas" usan md:contents → en desktop desaparecen y las cards
            quedan como hijos directos de la grilla. */}
        <div
          id="destacados-track"
          className="dest-grid -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-x-5 md:gap-y-10 md:overflow-visible md:px-0 lg:grid-cols-6 lg:gap-x-5 lg:gap-y-12 [&::-webkit-scrollbar]:hidden"
        >
          {PAGINAS.map((pagina, pi) => (
            <div
              key={pi}
              className={
                pi < PAGINAS_MOBILE
                  ? "grid w-full shrink-0 snap-start grid-cols-2 content-start gap-x-4 gap-y-8 md:contents"
                  : "hidden md:contents"
              }
            >
              {pagina.map((p) => (
                <Link key={p.slug} href="/productos" className="dest-card group block">
                  {/* Un-zoom hover: image lives at 1.05 scale, settles to 1 on hover */}
                  <div className="dest-frame relative aspect-[4/5] overflow-hidden rounded-[var(--radius-md)] bg-sand">
                   <div className="dest-media absolute inset-0">
                    <Image
                      src={`https://picsum.photos/seed/sfdp-dest-${p.slug}/700/880`}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 230px"
                      className="object-cover transition-transform duration-[800ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                    />
                   </div>
                    <span className="absolute right-2.5 top-2.5 grid h-8 w-8 translate-y-1 place-items-center rounded-full bg-ink text-[length:var(--text-step-0)] text-bone opacity-0 transition-all duration-300 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100">
                      ↗
                    </span>
                  </div>
    
                  <div className="dest-info mt-3 flex items-baseline justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[0.7rem] uppercase tracking-[0.12em] text-champagne">
                        {p.material}
                      </p>
                      <h3 className="font-display text-[length:var(--text-step-0)] font-bold uppercase leading-tight text-ink">
                        {p.nombre}
                      </h3>
                    </div>
                    {/* TODO(contenido): precio real */}
                    <p className="shrink-0 font-sans text-[length:var(--text-step--1)] text-ink">
                      {p.precio}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
        <SwipeDots forId="destacados-track" count={PAGINAS_MOBILE} label="Productos destacados" />
      </div>
    </section>
  );
}
