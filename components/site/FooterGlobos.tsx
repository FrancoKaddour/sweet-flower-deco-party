"use client";

import { useEffect, useRef } from "react";
import {
  balloonRed,
  balloonRed2,
  balloonBlack,
  balloonBlack2,
  house,
  type BrandShape,
} from "@/content/brandShapes";

/**
 * El isotipo del footer: la casita con sus 4 globos EXACTAMENTE como en el logo
 * (las formas de brandShapes comparten el sistema de coordenadas del logo, así
 * que dibujarlas juntas en este viewBox arma el isotipo tal cual, con los
 * hilos originales de cada globo — sin hilos agregados).
 *
 * Movimiento: cada globo se mece como un péndulo alrededor de la punta de su
 * propio hilo y se inclina un poco hacia el cursor. Solo corre con el footer a
 * la vista; con reduced-motion queda quieto.
 */
const LOGO_VB = "130 120 380 370";
const ROJO = "var(--color-brand-red)";
const GLOBOS: { shape: BrandShape; color: string; fase: number }[] = [
  { shape: balloonBlack, color: "var(--color-bone)", fase: 0 },
  { shape: balloonRed, color: ROJO, fase: 1.4 },
  { shape: balloonBlack2, color: "var(--color-bone)", fase: 2.8 },
  { shape: balloonRed2, color: ROJO, fase: 4.2 },
];

/** Punta del hilo (abajo al centro de la caja del globo) = punto de giro. */
function pivote(shape: BrandShape) {
  const [x, y, w, h] = shape.viewBox.split(" ").map(Number);
  return { x: x + w / 2, y: y + h };
}

export function FooterGlobos() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const grupos = Array.from(svg.querySelectorAll<SVGGElement>("[data-globo]"));
    const estado = GLOBOS.map(() => ({ a: 0, v: 0 }));
    let inclinacion = 0; // grados pedidos por el cursor
    let visible = false;
    let raf = 0;
    const t0 = performance.now();

    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / Math.max(1, window.innerWidth / 2);
      inclinacion = Math.max(-1, Math.min(1, dx)) * 7;
    };

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      GLOBOS.forEach((g, i) => {
        const s = estado[i];
        const objetivo = inclinacion + Math.sin(t * 0.9 + g.fase) * 3.5;
        s.v = (s.v + (objetivo - s.a) * 0.04) * 0.88;
        s.a += s.v;
        const p = pivote(g.shape);
        const bob = Math.sin(t * 0.7 + g.fase) * 2.5;
        grupos[i].setAttribute(
          "transform",
          `translate(0 ${bob.toFixed(2)}) rotate(${s.a.toFixed(2)} ${p.x} ${p.y})`,
        );
      });
      if (visible) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });
    io.observe(svg);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={LOGO_VB}
      className="h-full w-auto overflow-visible"
      aria-hidden="true"
      focusable="false"
    >
      <path d={house.d} fill="var(--color-bone)" fillRule="evenodd" />
      {GLOBOS.map((g, i) => (
        <g key={i} data-globo="">
          <path d={g.shape.d} fill={g.color} fillRule="evenodd" />
        </g>
      ))}
    </svg>
  );
}
