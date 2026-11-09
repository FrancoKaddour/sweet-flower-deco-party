"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  balloonRed,
  balloonRed2,
  balloonBlack,
  balloonBlack2,
  type BrandShape,
} from "@/content/brandShapes";

/**
 * FESTEJO — los globos del logo celebran una confirmación REAL (inscripción al
 * Summit pagada, suscripción al Club confirmada, consulta enviada). Mismo gesto
 * que el loader: la compra cierra con la imagen con la que abrió el sitio.
 *
 *  · "completa" (~4,5 s): suben desde abajo de la pantalla (escalonados, se
 *    enderezan al llegar), flotan a los costados del título y se sueltan hacia
 *    arriba hasta salir de cuadro.
 *  · "corta" (~2,5 s): dos globos chicos cruzan la tarjeta y se van por arriba.
 *
 * Reglas: decorativo (aria-hidden, sin eventos de puntero), en los márgenes
 * (nunca sobre el texto), una sola vez por confirmación (`clave` en
 * sessionStorage) y nada con reduced-motion.
 *
 * Uso: dentro de un contenedor `relative overflow-hidden`, ANTES del contenido
 * (que va `relative` → queda por encima).
 */

type Variante = "completa" | "corta";
type Tono = "oscuro" | "claro";

type Globo = {
  shape: BrandShape;
  /** "rojo" = rojo de marca; "neutro" = marfil (fondo oscuro) o tinta (claro). */
  color: "rojo" | "neutro";
  /** Posición/tamaño con clases estáticas (responsive). */
  className: string;
};

const COMPLETA: Globo[] = [
  // Derecha arriba / derecha medio / izquierda abajo / derecha abajo.
  // En celular van pegados a los bordes y más chicos.
  { shape: balloonRed, color: "rojo", className: "right-[3%] top-[12%] h-[clamp(4.5rem,12vh,8.5rem)] md:right-[14%]" },
  { shape: balloonBlack, color: "neutro", className: "right-[-2%] top-[40%] h-[clamp(5.5rem,16vh,11rem)] md:right-[4%]" },
  { shape: balloonRed2, color: "rojo", className: "left-[-1%] top-[72%] h-[clamp(4.5rem,13vh,9rem)] md:left-[0.5%]" },
  { shape: balloonBlack2, color: "neutro", className: "right-[10%] top-[74%] h-[clamp(3.5rem,9vh,6.5rem)] md:right-[22%]" },
];

const CORTA: Globo[] = [
  { shape: balloonRed, color: "rojo", className: "left-[5%] top-[30%] h-16" },
  { shape: balloonBlack2, color: "neutro", className: "right-[6%] top-[40%] h-14" },
];

// Orden de entrada "aleatorio" pero fijo (mismo festejo siempre).
const DEMORAS = [0.08, 0, 0.24, 0.16];
// Inclinación de llegada (±8°) y de reposo (±3°), signo alternado.
const GIRO_IN = [-8, 8, -8, 8];
const GIRO_REPOSO = [3, -3, 3, -3];
// Deriva lateral al soltarse (en vw).
const DERIVA = [3, 4, -4, -3];

const yaFestejado = (clave?: string) => {
  if (!clave) return false;
  try {
    return sessionStorage.getItem(`sf_festejo_${clave}`) === "1";
  } catch {
    return false;
  }
};
const marcarFestejado = (clave?: string) => {
  if (!clave) return;
  try {
    sessionStorage.setItem(`sf_festejo_${clave}`, "1");
  } catch {
    /* storage bloqueado: puede repetirse, nada más */
  }
};

export function FestejoGlobos({
  variante = "completa",
  tono = "oscuro",
  clave,
}: {
  variante?: Variante;
  tono?: Tono;
  /** Identifica la confirmación (p. ej. el código): no se repite al recargar. */
  clave?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [terminado, setTerminado] = useState(false);
  const globos = variante === "completa" ? COMPLETA : CORTA;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>("[data-globo]"));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || yaFestejado(clave)) {
        setTerminado(true);
        return;
      }
      marcarFestejado(clave);

      // Distancia hasta salir por abajo / por arriba del contenedor (px).
      const alto = () => el.offsetHeight;
      const desdeAbajo = (g: HTMLElement) => alto() - g.offsetTop + 20;
      const hastaArriba = (g: HTMLElement) => -(g.offsetTop + g.offsetHeight + 40);

      gsap.set(items, { transformOrigin: "50% 100%", autoAlpha: 1 });
      const tl = gsap.timeline({ onComplete: () => setTerminado(true) });

      if (variante === "completa") {
        items.forEach((g, i) => {
          const d = DEMORAS[i] ?? 0;
          tl
            // 1) Entrada: suben desde abajo y se enderezan al llegar.
            .fromTo(
              g,
              { y: () => desdeAbajo(g), rotate: GIRO_IN[i] },
              { y: 0, rotate: GIRO_REPOSO[i], duration: 1.25, ease: "power3.out" },
              0.15 + d,
            )
            // 2) Pausa: flotan, cada uno a su ritmo (péndulo + leve subida).
            .to(
              g,
              {
                rotate: -GIRO_REPOSO[i],
                y: -8,
                duration: 0.8 + i * 0.07,
                ease: "sine.inOut",
                yoyo: true,
                repeat: 1,
              },
              1.4 + d,
            )
            // 3) Salida: se sueltan hacia arriba y salen de cuadro.
            .to(
              g,
              {
                y: () => hastaArriba(g),
                x: `${DERIVA[i]}vw`,
                rotate: GIRO_IN[i] * 0.6,
                duration: 1.4,
                ease: "power2.in",
              },
              3.0 + d,
            );
        });
      } else {
        items.forEach((g, i) => {
          tl.fromTo(
            g,
            { y: () => desdeAbajo(g), rotate: GIRO_IN[i] },
            {
              y: () => hastaArriba(g),
              rotate: -GIRO_IN[i] * 0.5,
              duration: 2.3,
              ease: "sine.inOut",
            },
            0.1 + i * 0.18,
          );
        });
      }
    },
    { scope: root, dependencies: [] },
  );

  if (terminado) return null;

  const neutro = tono === "oscuro" ? "var(--color-bone)" : "var(--color-ink)";
  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {globos.map((g, i) => (
        <div
          key={i}
          data-globo
          // Nace oculto por CSS: sin JS (o con reduced-motion) nunca se ve.
          className={`invisible absolute opacity-0 ${g.className}`}
        >
          <svg viewBox={g.shape.viewBox} className="h-full w-auto">
            <path
              d={g.shape.d}
              fill={g.color === "rojo" ? "var(--color-brand-red)" : neutro}
              fillRule="evenodd"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
