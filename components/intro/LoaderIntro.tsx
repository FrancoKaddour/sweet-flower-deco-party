"use client";

/**
 * Intro del inicio — "el arco" (D-06, T-02, T-03).
 *
 *   SWEET  ⌒[ video ]  FLOWERS        (los globos del logo suben alrededor)
 *
 * 1. "SWEET FLOWERS" aparece por CSS (es el LCP: no espera a JS).
 * 2. Las palabras se separan y en el hueco se ARMA un arco (el producto de la
 *    marca): el video nace adentro, de abajo hacia arriba, como una arcada que
 *    se para en el piso. Los globos del logo suben con él.
 * 3. El arco se abre a pantalla completa y los globos se escapan hacia arriba
 *    — el mismo gesto con el que se retira la cortina de PageTransition.
 *
 * Reglas: una vez por sesión (sessionStorage `sf_intro`, leído por el script
 * inline de Loader.tsx antes del primer paint); nunca en navegación cliente a
 * "/"; cualquier input (pointer, tecla, rueda, touch) la acelera hasta el
 * final; arranca a los 0,3 s. Red de seguridad JS a los 8 s y CSS a los 10 s.
 */

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { startLenis, stopLenis } from "@/components/motion/SmoothScroll";
import {
  balloonRed,
  balloonRed2,
  balloonBlack,
  balloonBlack2,
  type BrandShape,
} from "@/content/brandShapes";

const WORDS: [string, string] = ["Sweet", "Flowers"];

// Globos alrededor del arco (en % del viewport). Mismas formas y colores que la
// transición de página.
const BALLOONS: { shape: BrandShape; color: string; left: string; top: string; h: string }[] = [
  { shape: balloonBlack, color: "var(--color-bone)", left: "8%", top: "58%", h: "clamp(6rem, 17vh, 12rem)" },
  { shape: balloonRed, color: "var(--color-brand-red)", left: "27%", top: "12%", h: "clamp(4.5rem, 12vh, 8rem)" },
  { shape: balloonBlack2, color: "var(--color-bone)", left: "68%", top: "10%", h: "clamp(4rem, 10vh, 7rem)" },
  { shape: balloonRed2, color: "var(--color-brand-red)", left: "86%", top: "56%", h: "clamp(7rem, 19vh, 13rem)" },
];

// Primer pathname visto en esta carga del documento. Si después cambia, hubo
// navegación cliente → al volver a "/" nunca hay intro (T-02 b). Sobrevive al
// doble montaje de StrictMode (mismo pathname).
let pathInicial: string | null = null;
let huboNavegacion = false;

function marcarIntroVista() {
  try {
    sessionStorage.setItem("sf_intro", "1");
  } catch {
    /* modo privado / storage bloqueado: la intro puede repetirse, nada más */
  }
}

export function LoaderIntro() {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      if (pathInicial === null) pathInicial = pathname;
      else if (pathname !== pathInicial) huboNavegacion = true;

      const nameEl = root.current?.querySelector<HTMLElement>(".c-loader__name");
      if (!nameEl) return;

      // Estado final directo: fuera del inicio, navegación cliente al inicio,
      // recarga o intro ya vista en la sesión (data-skip-intro del script inline).
      const sinIntro = () => {
        document.body.removeAttribute("data-skip-intro");
        document.body.setAttribute("data-loader", "false");
        startLenis();
        window.dispatchEvent(new Event("sf:hero-start"));
      };
      if (pathname !== "/") {
        document.body.removeAttribute("data-skip-intro");
        document.body.setAttribute("data-loader", "false");
        startLenis();
        return;
      }
      if (
        huboNavegacion ||
        document.body.getAttribute("data-skip-intro") === "true" ||
        document.body.getAttribute("data-loader") === "false"
      ) {
        sinIntro();
        return;
      }

      const spans = nameEl.querySelectorAll<HTMLElement>("span");
      const balloons = Array.from(
        root.current?.querySelectorAll<HTMLElement>(".c-loader__balloon") ?? [],
      );
      const media = document.querySelector<HTMLElement>(".c-hero__media");
      const mediaInner = document.querySelector<HTMLElement>(
        ".c-hero__media video, .c-hero__media-placeholder",
      );
      const overlay = document.querySelector<HTMLElement>(".c-hero__media-overlay");
      const heroContent = document.querySelector<HTMLElement>(".c-hero__content");
      const header = document.querySelector<HTMLElement>(".c-site-header");
      const revealFinal = [heroContent, header].filter(
        (el): el is HTMLElement => el !== null,
      );

      // Estado final (sitio usable). Nunca deja el scroll bloqueado.
      const finish = () => {
        if (document.body.getAttribute("data-loader") === "false") return;
        gsap.set(nameEl, { autoAlpha: 0 });
        gsap.set(balloons, { autoAlpha: 0 });
        if (media) {
          gsap.set(media, {
            autoAlpha: 1,
            clearProps: "width,height,transform,borderRadius,clipPath",
          });
        }
        if (mediaInner) gsap.set(mediaInner, { scale: 1 });
        if (overlay) gsap.set(overlay, { autoAlpha: 1 });
        gsap.set(revealFinal, { autoAlpha: 1 });
        marcarIntroVista();
        document.body.setAttribute("data-loader", "false");
        startLenis();
        window.dispatchEvent(new Event("sf:hero-start"));
      };
      if (!media || !mediaInner || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finish();
        return;
      }

      // El arco nace en el HUECO entre las palabras (con el bloque centrado, el
      // hueco queda corrido (anchoSWEET − anchoFLOWERS) / 2). Se mide al nacer.
      let offset: { x: number; y: number } | null = null;
      const measure = () => {
        if (offset) return offset;
        offset = { x: 0, y: 0 };
        if (spans.length !== 2) return offset;
        const a = spans[0].getBoundingClientRect();
        const b = spans[1].getBoundingClientRect();
        const m = media.getBoundingClientRect();
        const vertical = getComputedStyle(nameEl).flexDirection === "column";
        const n = nameEl.getBoundingClientRect();
        const holeX = vertical ? n.left + n.width / 2 : (a.right + b.left) / 2;
        const holeY = vertical ? (a.bottom + b.top) / 2 : (a.top + a.bottom) / 2;
        offset = { x: holeX - (m.left + m.width / 2), y: holeY - (m.top + m.height / 2) };
        return offset;
      };

      // En vertical, "FLOWERS" tiene que entrar siempre con aire a los costados.
      const ajustarNombre = () => {
        nameEl.style.fontSize = "";
        if (getComputedStyle(nameEl).flexDirection !== "column") return;
        const disponible = window.innerWidth * 0.86;
        const ancho = Math.max(...Array.from(spans, (s) => s.scrollWidth));
        if (ancho > disponible) {
          const fs = parseFloat(getComputedStyle(nameEl).fontSize);
          nameEl.style.fontSize = `${Math.floor(fs * (disponible / ancho))}px`;
        }
      };
      ajustarNombre();
      document.fonts?.ready.then(ajustarNombre);
      window.addEventListener("resize", ajustarNombre);

      stopLenis();
      window.scrollTo(0, 0);

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
        onComplete: () => {
          window.clearTimeout(safety);
          gsap.set(media, { clearProps: "clipPath" });
          document.body.setAttribute("data-loader", "false");
          startLenis();
        },
      });
      // Red de seguridad JS (pestaña en segundo plano, algo trabado).
      const safety = window.setTimeout(() => {
        tl.progress(1);
        finish();
      }, 8000);

      const r = () => `${(media.offsetWidth || 0) / 2}px`;
      tl
        // 1) Se separan las palabras; el video empieza a correr.
        .call(() => {
          nameEl.setAttribute("data-expanded", "true");
          marcarIntroVista();
          window.dispatchEvent(new Event("sf:hero-start"));
        })
        // 2) El arco se arma de abajo hacia arriba (la arcada se "para").
        .fromTo(
          media,
          {
            autoAlpha: 1,
            clipPath: "inset(100% 0% 0% 0%)",
            xPercent: -50,
            yPercent: -50,
            x: () => measure().x,
            y: () => measure().y,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            xPercent: -50,
            yPercent: -50,
            x: () => measure().x,
            y: () => measure().y,
            duration: 1.1,
            immediateRender: false,
          },
          0.05,
        )
        // 3) Los globos suben alrededor del arco.
        .fromTo(
          balloons,
          { autoAlpha: 1, y: "60vh", rotate: (i: number) => (i % 2 ? 8 : -8) },
          {
            y: 0,
            rotate: (i: number) => (i % 2 ? -3 : 3),
            duration: 1.25,
            ease: "power3.out",
            stagger: { each: 0.08, from: "random" },
          },
          0.2,
        )
        // 4) El nombre se va.
        .to(nameEl, { autoAlpha: 0, duration: 0.3 }, 1.35)
        // 5) El arco se abre a pantalla completa y los globos se escapan.
        .fromTo(
          media,
          { borderTopLeftRadius: r, borderTopRightRadius: r },
          {
            width: "100%",
            height: "100%",
            x: 0,
            y: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            duration: 1.4,
            immediateRender: false,
          },
          1.45,
        )
        .to(mediaInner, { scale: 1, duration: 1.4 }, "<")
        .to(overlay, { autoAlpha: 1, duration: 1.4 }, "<")
        .to(
          balloons,
          {
            y: "-120vh",
            rotate: (i: number) => (i % 2 ? 10 : -10),
            duration: 1.15,
            ease: "power2.in",
            stagger: { each: 0.06, from: "random" },
          },
          "<",
        )
        // 6) Header + contenido del hero, sobre el final de la apertura.
        .to(revealFinal, { autoAlpha: 1, duration: 0.6, immediateRender: false }, "<+0.75");

      // Arranque: 0,3 s (o después de la cortina de PageTransition).
      const curtain = document.querySelector<HTMLElement>(".c-pt");
      const curtainUp = !!curtain && getComputedStyle(curtain).visibility === "visible";
      const arranque = gsap.delayedCall(curtainUp ? 1.6 : 0.3, () => {
        tl.play();
      });

      // Salteable con cualquier input: acelera hasta el final (no corta).
      const saltear = () => {
        arranque.kill();
        if (!tl.isActive()) tl.play();
        tl.timeScale(6);
        quitarSaltos();
      };
      const EVENTOS = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
      const quitarSaltos = () =>
        EVENTOS.forEach((e) => window.removeEventListener(e, saltear));
      EVENTOS.forEach((e) => window.addEventListener(e, saltear, { passive: true }));

      return () => {
        window.clearTimeout(safety);
        arranque.kill();
        quitarSaltos();
        window.removeEventListener("resize", ajustarNombre);
      };
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="c-loader" aria-hidden="true">
      {BALLOONS.map((b, i) => (
        <div
          key={i}
          className="c-loader__balloon"
          style={{ left: b.left, top: b.top, height: b.h }}
        >
          <svg viewBox={b.shape.viewBox} className="h-full w-auto">
            <path d={b.shape.d} fill={b.color} fillRule="evenodd" />
          </svg>
        </div>
      ))}
      <div className="c-loader__name" data-expanded="false">
        <span>{WORDS[0]}</span>
        <span>{WORDS[1]}</span>
      </div>
    </div>
  );
}
