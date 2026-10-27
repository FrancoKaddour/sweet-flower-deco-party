"use client";

/**
 * Transición entre páginas — la FIRMA de Sweet Flowers.
 *
 * Al tocar un link interno, una cortina de tinta sube desde abajo y por ella
 * flotan los globos del logo (rojos y marfil) alrededor de la casita. Cuando la
 * nueva página ya está montada, la cortina se va hacia arriba y los globos
 * siguen subiendo hasta salir de cuadro. Mismo lenguaje que el loader del
 * inicio (fondo oscuro, eases in-out duros) → todo el sitio se siente una pieza.
 *
 * Cómo intercepta: listener de click en fase de captura sobre <a> internos.
 * Hace preventDefault ANTES que next/link (que respeta defaultPrevented) y
 * navega con router.push apenas la cortina tapó la pantalla.
 *
 * Velocidad (T-04, meta ≤1,2 s hasta poder usar la página):
 *  - router.prefetch al apuntar/enfocar un link interno (y al click, para el
 *    tap en celular) → cuando la cortina termina de tapar, la ruta ya bajó.
 *  - El reveal arranca apenas cambia el pathname (no hay esperas fijas).
 *  - Dos versiones: CORTA (cortina + casita, 0,35 + 0,45 s) dentro de la misma
 *    sección (ficha↔ficha, landing↔landing) y COMPLETA con globos solo al
 *    cambiar de sección (inicio ↔ Summit ↔ productos ↔ páginas).
 *  - El push NO va al empezar a cubrir: con la ruta prefetcheada la página
 *    nueva se monta en ~1 frame y se vería el cambio por la franja todavía
 *    descubierta. El prefetch anticipado logra lo mismo sin ese salto.
 * Al terminar, el foco va al <h1> de la página nueva (T-15).
 * No intercepta: externos, target=_blank, teclas modificadoras, descargas,
 * anclas de la misma página, /panel, ni reduced-motion.
 */

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
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

/** Sección de una ruta: entre secciones va la transición completa (globos). */
function seccion(path: string): string {
  if (path === "/") return "inicio";
  const seg = path.split("/")[1] ?? "";
  if (seg === "event-summit" || seg === "productos" || seg === "cuenta" || seg === "ingresar") {
    return seg;
  }
  return "paginas"; // landings SEO, historia, contacto, legales
}

/** URL interna navegable con transición, o null (externos, panel, descargas…). */
function urlInterna(a: HTMLAnchorElement | null | undefined): URL | null {
  if (!a || !a.href) return null;
  if (a.target && a.target !== "_self") return null;
  if (a.hasAttribute("download") || a.dataset.noTransition !== undefined) return null;
  let url: URL;
  try {
    url = new URL(a.href, location.href);
  } catch {
    return null;
  }
  if (url.origin !== location.origin) return null;
  if (url.pathname.startsWith("/panel") || location.pathname.startsWith("/panel")) return null;
  if (url.pathname.startsWith("/api/")) return null;
  return url;
}

/** T-15: tras navegar, el foco va al título de la página nueva (sin scroll). */
function enfocarTitulo() {
  const h1 = document.querySelector<HTMLElement>("main h1") ?? document.querySelector<HTMLElement>("main");
  if (!h1) return;
  if (!h1.hasAttribute("tabindex")) h1.setAttribute("tabindex", "-1");
  h1.focus({ preventScroll: true });
}

// cubic-bezier(.77,0,.175,1) = quart in-out = "power3.inOut" de GSAP (sin CustomEase).
const EASE_CORTINA = "power3.inOut";

const frame = () =>
  new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

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

  // T-04: prefetch con intención (mouse encima o foco de teclado).
  useEffect(() => {
    const hechos = new Set<string>();
    const onIntent = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.("a");
      const url = urlInterna(a as HTMLAnchorElement | null);
      if (!url || url.pathname === location.pathname) return;
      const key = url.pathname + url.search;
      if (hechos.has(key)) return;
      hechos.add(key);
      try {
        router.prefetch(key);
      } catch {
        /* prefetch es una mejora: nunca rompe la navegación */
      }
    };
    document.addEventListener("pointerover", onIntent, { capture: true, passive: true });
    document.addEventListener("focusin", onIntent, true);
    return () => {
      document.removeEventListener("pointerover", onIntent, true);
      document.removeEventListener("focusin", onIntent, true);
    };
  }, [router]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const panel = el.querySelector<HTMLElement>(".c-pt__panel");
    const balloons = Array.from(el.querySelectorAll<HTMLElement>(".c-pt__balloon"));
    const mark = el.querySelector<HTMLElement>(".c-pt__mark");

    const terminar = (conFoco: boolean) => {
      gsap.killTweensOf([panel, mark, ...balloons]);
      gsap.set(el, { autoAlpha: 0 });
      busy.current = false;
      // El loader del inicio maneja su propio scroll lock.
      if (document.body.getAttribute("data-loader") !== "true") startLenis();
      if (conFoco) enfocarTitulo();
    };

    const onClick = async (e: MouseEvent) => {
      if (busy.current || e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      const url = urlInterna(a);
      if (!url) return;
      // Misma página (ancla o mismo path): que lo maneje el navegador / next.
      if (url.pathname === location.pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      e.preventDefault();
      busy.current = true;
      const href = url.pathname + url.search + url.hash;
      const corta = seccion(url.pathname) === seccion(location.pathname);
      try {
        router.prefetch(url.pathname + url.search); // tap sin hover: arranca ya
      } catch {
        /* no-op */
      }

      try {
        // --- 1) Cubrir ---------------------------------------------------------
        stopLenis();
        gsap.killTweensOf([panel, mark, ...balloons]);
        gsap.set(el, { autoAlpha: 1 });
        gsap.set(panel, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(mark, { autoAlpha: 0, scale: 0.85, y: 20 });
        balloons.forEach((b, i) =>
          gsap.set(b, { y: "70vh", rotate: i % 2 ? 8 : -8, autoAlpha: corta ? 0 : 1 }),
        );

        const tCover = performance.now();
        await new Promise<void>((resolve) => {
          const tl = gsap.timeline();
          if (corta) {
            tl.to(panel, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.35, ease: EASE_CORTINA, onComplete: resolve })
              .to(mark, { autoAlpha: 1, scale: 1, y: 0, duration: 0.3, ease: "power3.out" }, 0.1);
          } else {
            tl.to(panel, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: EASE_CORTINA, onComplete: resolve })
              .to(
                balloons,
                {
                  y: 0,
                  rotate: (i) => (i % 2 ? -3 : 3),
                  duration: 0.9,
                  ease: "power3.out",
                  stagger: { each: 0.06, from: "random" },
                },
                0.1,
              )
              .to(mark, { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.3);
          }
        });

        // --- 2) Navegar y esperar la página nueva ------------------------------
        const landed = new Promise<void>((resolve) => {
          arrived.current = resolve;
        });
        router.push(href, { scroll: false });
        await Promise.race([landed, new Promise((r) => setTimeout(r, 4000))]);
        // Un respiro mínimo para que los globos lleguen a verse (solo completa).
        if (!corta) {
          const falta = 750 - (performance.now() - tCover);
          if (falta > 0) await new Promise((r) => setTimeout(r, falta));
        }
        // Un frame para que la página nueva pinte debajo de la cortina.
        await frame();
        if (!url.hash) scrollToTopNow();

        // --- 3) Revelar ---------------------------------------------------------
        const conFoco = !url.hash;
        const tl = gsap.timeline({ onComplete: () => terminar(conFoco) });
        if (corta) {
          tl.to(mark, { autoAlpha: 0, y: -20, duration: 0.2, ease: "power2.in" }, 0).to(
            panel,
            { clipPath: "inset(0% 0% 100% 0%)", duration: 0.45, ease: EASE_CORTINA },
            0.05,
          );
        } else {
          tl.to(
            balloons,
            {
              y: "-115vh",
              rotate: (i) => (i % 2 ? 10 : -10),
              duration: 0.8,
              ease: "power2.in",
              stagger: { each: 0.04, from: "random" },
              overwrite: "auto",
            },
            0,
          )
            .to(mark, { autoAlpha: 0, y: -30, duration: 0.3, ease: "power2.in" }, 0)
            // El panel recorta a los globos: cuando termina, la página ya se usa.
            .to(panel, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.5, ease: EASE_CORTINA }, 0.08);
          // No esperar a que los globos (ya recortados) terminen de salir.
          tl.call(() => terminar(conFoco), [], 0.58);
          tl.eventCallback("onComplete", null);
        }
      } catch {
        terminar(false);
        location.assign(href);
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <div
      ref={root}
      data-header-ignore=""
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
