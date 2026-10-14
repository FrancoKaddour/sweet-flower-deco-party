"use client";

/**
 * Transición entre páginas — la FIRMA de Sweet Flowers.
 *
 * Al tocar un link interno, una cortina de tinta sube desde abajo y por ella
 * flotan los globos del logo (rojos y marfil) alrededor de la casita. Cuando la
 * nueva página ya está montada, la cortina se va hacia arriba y los globos
 * siguen subiendo hasta salir de cuadro. Mismo lenguaje que el loader del
 * inicio (fondo oscuro, eases sfInOutHard) → todo el sitio se siente una pieza.
 *
 * Cómo intercepta: listener de click en fase de captura sobre <a> internos.
 * Hace preventDefault ANTES que next/link (que respeta defaultPrevented) y
 * navega con router.push cuando la cortina tapó la pantalla.
 * No intercepta: externos, target=_blank, teclas modificadoras, descargas,
 * anclas de la misma página, /panel, ni reduced-motion.
 */

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, CustomEase } from "@/lib/gsap";
import { scrollToTopNow, stopLenis, startLenis } from "@/components/motion/SmoothScroll";
import {
  balloonRed,
  balloonRed2,
  balloonBlack,
  balloonBlack2,
  house,
  type BrandShape,
} from "@/content/brandShapes";

// Globos: forma, color y posición (en % del viewport) alrededor de la casita.
const BALLOONS: { shape: BrandShape; color: string; left: string; top: string; h: string }[] = [
  { shape: balloonBlack, color: "var(--color-bone)", left: "24%", top: "36%", h: "clamp(9rem, 22vh, 15rem)" },
  { shape: balloonRed, color: "#ed1c24", left: "37%", top: "12%", h: "clamp(6.5rem, 15vh, 10rem)" },
  { shape: balloonBlack2, color: "var(--color-bone)", left: "60%", top: "18%", h: "clamp(6rem, 13vh, 8.5rem)" },
  { shape: balloonRed2, color: "#ed1c24", left: "70%", top: "40%", h: "clamp(10rem, 24vh, 16rem)" },
];

function Shape({ shape, color, className, style }: {
  shape: BrandShape;
  color: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox={shape.viewBox} className={className} style={style} aria-hidden="true">
      <path d={shape.d} fill={color} fillRule="evenodd" />
    </svg>
  );
}

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  // Se resuelve cuando cambia el pathname (la nueva página ya montó).
  const arrived = useRef<(() => void) | null>(null);

  useEffect(() => {
    arrived.current?.();
    arrived.current = null;
  }, [pathname]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!gsap.parseEase("sfInOutHard")) CustomEase.create("sfInOutHard", "0.77, 0, 0.175, 1");

    const panel = el.querySelector<HTMLElement>(".c-pt__panel");
    const balloons = Array.from(el.querySelectorAll<HTMLElement>(".c-pt__balloon"));
    const mark = el.querySelector<HTMLElement>(".c-pt__mark");

    const onClick = async (e: MouseEvent) => {
      if (busy.current || e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a || !a.href) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download") || a.dataset.noTransition !== undefined) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname.startsWith("/panel") || location.pathname.startsWith("/panel")) return;
      // Misma página (ancla o mismo path): que lo maneje el navegador / next.
      if (url.pathname === location.pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      e.preventDefault();
      busy.current = true;
      const href = url.pathname + url.search + url.hash;

      // --- 1) Cubrir ---------------------------------------------------------
      stopLenis();
      gsap.killTweensOf([panel, mark, ...balloons]);
      gsap.set(el, { autoAlpha: 1 });
      gsap.set(panel, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(mark, { autoAlpha: 0, scale: 0.85, y: 20 });
      balloons.forEach((b, i) =>
        gsap.set(b, { y: "70vh", rotate: i % 2 ? 8 : -8, autoAlpha: 1 }),
      );

      await new Promise<void>((resolve) => {
        gsap
          .timeline({ onComplete: resolve })
          .to(panel, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "sfInOutHard" })
          .to(
            balloons,
            {
              y: 0,
              rotate: (i) => (i % 2 ? -3 : 3),
              duration: 1,
              ease: "power3.out",
              stagger: { each: 0.07, from: "random" },
            },
            0.15,
          )
          .to(mark, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.4);
      });

      // --- 2) Navegar y esperar la página nueva ------------------------------
      const landed = new Promise<void>((resolve) => {
        arrived.current = resolve;
      });
      router.push(href, { scroll: false });
      await Promise.race([landed, new Promise((r) => setTimeout(r, 4000))]);
      // Un frame para que la página nueva pinte debajo de la cortina.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (!url.hash) scrollToTopNow();

      // --- 3) Revelar: la cortina se va arriba, los globos se escapan --------
      gsap
        .timeline({
          onComplete: () => {
            gsap.set(el, { autoAlpha: 0 });
            busy.current = false;
            // El loader del inicio maneja su propio scroll lock.
            if (document.body.getAttribute("data-loader") !== "true") startLenis();
          },
        })
        .to(balloons, {
          y: "-115vh",
          rotate: (i) => (i % 2 ? 10 : -10),
          duration: 1.2,
          ease: "power2.in",
          stagger: { each: 0.06, from: "random" },
        })
        .to(mark, { autoAlpha: 0, y: -30, duration: 0.4, ease: "power2.in" }, 0.1)
        .to(panel, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "sfInOutHard" }, 0.35);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <div
      ref={root}
      className="c-pt pointer-events-none invisible fixed inset-0 z-[200] opacity-0"
      aria-hidden="true"
    >
      <div className="c-pt__panel absolute inset-0 overflow-hidden bg-ink">
        {BALLOONS.map((b, i) => (
          <div
            key={i}
            className="c-pt__balloon absolute"
            style={{ left: b.left, top: b.top, height: b.h }}
          >
            <Shape shape={b.shape} color={b.color} className="h-full w-auto" />
          </div>
        ))}
        <div className="c-pt__mark absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Shape shape={house} color="var(--color-bone)" className="h-[clamp(6.5rem,18vh,11rem)] w-auto" />
        </div>
      </div>
    </div>
  );
}
