"use client";

import { useEffect, useRef } from "react";
import {
  balloonRed,
  balloonRed2,
  balloonBlack,
  house,
  type BrandShape,
} from "@/content/brandShapes";

/**
 * La casita del logo con tres globos atados (la firma de la transición de
 * página) que siguen al cursor con un resorte y se mecen solos. Es la única
 * isla client del footer (T-12). Solo corre mientras el footer está a la
 * vista; con reduced-motion queda quieta.
 */
const VB_W = 300;
const VB_H = 380;
// Ancla de los hilos: el techo de la casita.
const ANCLA = { x: 150, y: 236 };
const GLOBOS: { shape: BrandShape; color: string; x: number; y: number; h: number; fase: number }[] = [
  { shape: balloonRed, color: "var(--color-brand-red)", x: 62, y: 34, h: 128, fase: 0 },
  { shape: balloonBlack, color: "var(--color-bone)", x: 126, y: 0, h: 150, fase: 2.1 },
  { shape: balloonRed2, color: "var(--color-brand-red)", x: 196, y: 44, h: 136, fase: 4.2 },
];

function dims(shape: BrandShape, h: number) {
  const [, , w, hh] = shape.viewBox.split(" ").map(Number);
  return { w: (w / hh) * h, h };
}

export function FooterGlobos() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const grupos = Array.from(svg.querySelectorAll<SVGGElement>("[data-globo]"));
    const hilos = Array.from(svg.querySelectorAll<SVGPathElement>("[data-hilo]"));
    const estado = GLOBOS.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
    const cursor = { x: 0, y: 0 }; // desvío pedido (en unidades del viewBox)
    let visible = false;
    let raf = 0;
    const t0 = performance.now();

    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      const k = VB_W / r.width;
      const dx = (e.clientX - (r.left + r.width / 2)) * k;
      const dy = (e.clientY - (r.top + r.height * 0.3)) * k;
      cursor.x = Math.max(-46, Math.min(46, dx * 0.12));
      cursor.y = Math.max(-18, Math.min(18, dy * 0.06));
    };

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      GLOBOS.forEach((g, i) => {
        const s = estado[i];
        const sway = Math.sin(t * 0.9 + g.fase) * 6;
        const tx = cursor.x * (0.7 + i * 0.15) + sway;
        const ty = cursor.y + Math.cos(t * 0.7 + g.fase) * 3;
        s.vx = (s.vx + (tx - s.x) * 0.045) * 0.86;
        s.vy = (s.vy + (ty - s.y) * 0.045) * 0.86;
        s.x += s.vx;
        s.y += s.vy;
        const { w, h } = dims(g.shape, g.h);
        const rot = s.vx * 1.6 + sway * 0.3;
        grupos[i].setAttribute(
          "transform",
          `translate(${s.x.toFixed(2)} ${s.y.toFixed(2)}) rotate(${rot.toFixed(2)} ${g.x + w / 2} ${g.y + h * 0.4})`,
        );
        // Hilo: del pie del globo al techo, con una panza que acompaña.
        const px = g.x + w * 0.22 + s.x;
        const py = g.y + h + s.y;
        const cx = (px + ANCLA.x) / 2 - s.vx * 6;
        const cy = (py + ANCLA.y) / 2 + 6;
        hilos[i].setAttribute("d", `M${px.toFixed(1)} ${py.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ANCLA.x} ${ANCLA.y}`);
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

  const casa = dims(house, 150);
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-full w-auto overflow-visible"
      aria-hidden="true"
      focusable="false"
    >
      {GLOBOS.map((g, i) => {
        const { w, h } = dims(g.shape, g.h);
        return (
          <path
            key={`h${i}`}
            data-hilo=""
            d={`M${g.x + w * 0.22} ${g.y + h} L${ANCLA.x} ${ANCLA.y}`}
            stroke="var(--color-bone)"
            strokeOpacity="0.45"
            strokeWidth="1.2"
            fill="none"
          />
        );
      })}
      {GLOBOS.map((g, i) => {
        const { w, h } = dims(g.shape, g.h);
        return (
          <g key={i} data-globo="">
            <svg x={g.x} y={g.y} width={w} height={h} viewBox={g.shape.viewBox} overflow="visible">
              <path d={g.shape.d} fill={g.color} fillRule="evenodd" />
            </svg>
          </g>
        );
      })}
      <svg x={ANCLA.x - casa.w / 2} y={VB_H - 150} width={casa.w} height={150} viewBox={house.viewBox}>
        <path d={house.d} fill="var(--color-bone)" fillRule="evenodd" />
      </svg>
    </svg>
  );
}
