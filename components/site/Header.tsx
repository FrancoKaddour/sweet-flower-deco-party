"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { startLenis, stopLenis } from "@/components/motion/SmoothScroll";
import { lockScroll } from "@/lib/scroll-lock";
import { MAIN_NAV, CONTACTO_LINK, CONTACTO_LINKS, WHATSAPP_HREF } from "@/content/site";
import { track } from "@/lib/analytics";

// Menú del Header = navegación principal + Contacto al final.
const NAV = [...MAIN_NAV, CONTACTO_LINK];
const INSTAGRAM_HREF =
  CONTACTO_LINKS.find((l) => l.label === "Instagram")?.href ??
  "https://www.instagram.com/sweetflowersdecoparty/";

// Páginas cuyo hero es OSCURO (video/foto): estimación INICIAL del tono (antes
// de la primera medición, p. ej. en el HTML servido). Después manda el detector.
const DARK_HERO_PATHS = ["/", "/event-summit"];

/* ---------------------------------------------------------------------------
 * Detector de fondo: el header invierte su color según lo que tiene DEBAJO.
 * "Tone" = color del TEXTO del header: "light" (marfil, sobre fondos oscuros)
 * o "dark" (tinta, sobre fondos claros).
 * 1) Se toma el elemento de la página bajo cada zona del header
 *    (document.elementsFromPoint, salteando el propio header y overlays).
 * 2) Subiendo por sus ancestros, gana lo primero que aparezca:
 *    data-theme="dark|light" de la sección → un fondo opaco calculado
 *    (luminancia) → un puente de color (ColorBridge, data-bridge-from/to).
 * Funciona con Lenis (que scrollea de forma nativa → dispara "scroll").
 * ------------------------------------------------------------------------- */
type Tone = "light" | "dark";
type Tones = { l: Tone; c: Tone; r: Tone; g: Tone };

/** Luminosidad perceptual (0–1) y alpha de un color CSS calculado. */
function readColor(css: string): { L: number; a: number } | null {
  const nums = (str: string) =>
    str
      .replace(/[^\d.\s/%-]/g, " ")
      .split(/[\s/]+/)
      .filter(Boolean)
      .map((n) => (n.endsWith("%") ? parseFloat(n) / 100 : parseFloat(n)));
  if (!css || css === "transparent") return null;
  const inner = css.slice(css.indexOf("(") + 1, css.lastIndexOf(")"));
  if (css.startsWith("oklab(") || css.startsWith("oklch(")) {
    const v = nums(inner);
    return { L: v[0] > 1 ? v[0] / 100 : v[0], a: v.length > 3 ? v[3] : 1 };
  }
  let rgb: number[];
  let a = 1;
  if (css.startsWith("rgb")) {
    const v = nums(inner);
    rgb = v.slice(0, 3).map((x) => x / 255);
    if (v.length > 3) a = v[3];
  } else if (css.startsWith("color(srgb")) {
    const v = nums(inner.replace("srgb", ""));
    rgb = v.slice(0, 3);
    if (v.length > 3) a = v[3];
  } else {
    return null;
  }
  const lin = rgb.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const Y = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  return { L: Math.cbrt(Y), a };
}

/** Resuelve cualquier valor de color (incluye var(--color-x)) a su color calculado. */
let colorProbe: HTMLSpanElement | null = null;
function resolveColor(value: string): string {
  if (!colorProbe) {
    colorProbe = document.createElement("span");
    colorProbe.style.display = "none";
    document.body.appendChild(colorProbe);
  }
  colorProbe.style.color = "";
  colorProbe.style.color = value;
  return getComputedStyle(colorProbe).color;
}

const toneFromL = (L: number): Tone => (L < 0.6 ? "light" : "dark");

function toneAt(x: number, y: number, header: HTMLElement): Tone | null {
  const stack = document.elementsFromPoint(x, y);
  const hit = stack.find(
    (el) =>
      !header.contains(el) &&
      el !== document.documentElement &&
      !(el as HTMLElement).closest?.("[data-header-ignore]"),
  );
  let el: Element | null = hit ?? document.body;
  // Spacers ya visitados: sin esto, un hijo pineado sin data-theme ni fondo
  // sube al spacer, vuelve a bajar al hijo… y el bucle no termina nunca
  // (congelaba /event-summit en "El camino hasta acá").
  const spacers = new Set<Element>();
  let guard = 0;
  while (el && el !== document.documentElement && guard++ < 32) {
    // Sección pineada por ScrollTrigger: el hueco que se ve es el pin-spacer;
    // el tono es el de la sección pineada (su primer hijo).
    if (
      el.classList.contains("pin-spacer") &&
      el.firstElementChild &&
      !spacers.has(el)
    ) {
      spacers.add(el);
      el = el.firstElementChild;
    }
    const theme = el.getAttribute("data-theme");
    if (theme === "dark") return "light";
    if (theme === "light") return "dark";
    const from = el.getAttribute("data-bridge-from");
    const to = el.getAttribute("data-bridge-to");
    if (from && to) {
      const r = el.getBoundingClientRect();
      const t = r.height ? (y - r.top) / r.height : 0;
      const c = readColor(resolveColor(t < 0.5 ? from : to));
      if (c) return toneFromL(c.L);
    }
    const bg = readColor(getComputedStyle(el).backgroundColor);
    if (bg && bg.a >= 0.5) return toneFromL(bg.L);
    el = el.parentElement;
  }
  return null;
}

/**
 * Header fijo con:
 * 1) LOGO CENTRADO — arriba se ve el logo completo (casita + "Sweet Flowers /
 *    Deco Party"); al scrollear hace crossfade a solo la casita y el fondo pasa
 *    a frosted. Color del header FIJO por ahora (sin adaptativo dark/light; el
 *    adaptativo quedó pendiente de rediseño — ver data-theme en las secciones).
 * 2) MENÚ OVERLAY full-screen con reveal en máscara (GSAP), respeta reduced-motion.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  // En el inicio, arriba de todo, el header va sobre el video oscuro del hero
  // → tono claro. Al scrollear (fondo frosted claro) o en otras páginas → tinta.
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false); // ya no está en el tope → frosted + logo chico
  const [wasScrolled, setWasScrolled] = useState(false); // scrolled en el momento de abrir el menú
  // Tono por zona (izquierda / logo / menú) + global (barra frosted al scrollear).
  const initialTone: Tone = DARK_HERO_PATHS.includes(pathname) ? "light" : "dark";
  const [tones, setTones] = useState<Tones>({
    l: initialTone,
    c: initialTone,
    r: initialTone,
    g: initialTone,
  });
  const headerRef = useRef<HTMLElement>(null);
  const zoneLeftRef = useRef<HTMLDivElement>(null);
  const zoneRightRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  // Libera el bloqueo de scroll del menú (lib/scroll-lock); null = no bloqueado.
  const liberarScroll = useRef<(() => void) | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Hover logo (solo cuando scrolled): "Sweet" ←, "Flowers" → desde el centro.
  const logoWrapRef = useRef<HTMLAnchorElement>(null);
  const sweetRef = useRef<HTMLSpanElement>(null);
  const flowersRef = useRef<HTMLSpanElement>(null);
  const hoverTl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (!sweetRef.current || !flowersRef.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Estado inicial: palabras invisibles, ligeramente comprimidas hacia el centro.
      gsap.set(sweetRef.current,   { autoAlpha: 0, x: 16 });
      gsap.set(flowersRef.current, { autoAlpha: 0, x: -16 });

      if (reduce) return;

      // Timeline pausada — .play() en hover in, .reverse() en hover out.
      // Interrupción sin saltos: reverse() continúa desde donde esté.
      hoverTl.current = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out", duration: 0.45, overwrite: "auto" } })
        .to(sweetRef.current,   { autoAlpha: 1, x: 0 }, 0)
        .to(flowersRef.current, { autoAlpha: 1, x: 0 }, 0);
    },
    { scope: logoWrapRef, dependencies: [] },
  );

  // Al volver al tope con el mouse todavía encima del logo, el hover se retira
  // (si no, quedaban "Sweet/Flowers" del hover + el logotipo completo a la vez).
  useEffect(() => {
    if (!scrolled) hoverTl.current?.reverse();
  }, [scrolled]);

  // Solo con mouse: en iOS el tap dispara un "mouseenter" emulado y el hover
  // quedaba pegado (nunca llega el mouseleave).
  const handleLogoHoverIn = (e: React.PointerEvent) => {
    if (!scrolled || e.pointerType !== "mouse") return;
    hoverTl.current?.play();
  };
  const handleLogoHoverOut = (e: React.PointerEvent) => {
    if (!scrolled || e.pointerType !== "mouse") return;
    hoverTl.current?.reverse();
  };

  // 1) Estado "scrolled": controla el fondo frosted y el crossfade del logo
  //    (completo arriba → solo casita al bajar). Color del header FIJO por ahora
  //    (sin adaptativo dark/light — pendiente de rediseño).
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // 1b) Detector de fondo (ver toneAt): mide bajo cada zona del header solo
  //     cuando hace falta — scroll/resize (1 vez por frame), cambio de ruta y
  //     refresh de ScrollTrigger (pins). Sin pulso periódico (T-01/D-03).
  useEffect(() => {
    let raf = 0;
    const setAll = (t: Tone) =>
      setTones((prev) =>
        prev.l === t && prev.c === t && prev.r === t && prev.g === t
          ? prev
          : { l: t, c: t, r: t, g: t },
      );
    const measure = () => {
      raf = 0;
      const header = headerRef.current;
      if (!header) return;
      const hr = header.getBoundingClientRect();
      const y = hr.top + hr.height / 2;
      // D-03: sobre el hero del inicio (video oscuro) el tono es SIEMPRE claro
      // mientras el hero siga debajo del header → determinista, no depende de
      // qué frame del video esté pasando.
      if (pathname === "/") {
        const hero = document.querySelector(".c-hero");
        if (hero && hero.getBoundingClientRect().bottom > y) {
          setAll("light");
          return;
        }
      }
      const zones = [zoneLeftRef.current, logoWrapRef.current, zoneRightRef.current];
      const res = zones.map((z) => {
        if (!z) return null;
        const r = z.getBoundingClientRect();
        if (!r.width) return null;
        const cx = Math.min(window.innerWidth - 1, Math.max(0, r.left + r.width / 2));
        return toneAt(cx, y, header);
      });
      const c = res[1] ?? res[0] ?? res[2];
      if (!c) return;
      const l = res[0] ?? c;
      const rr = res[2] ?? c;
      const lightVotes = [l, c, rr].filter((t) => t === "light").length;
      const g: Tone = lightVotes >= 2 ? "light" : "dark";
      setTones((prev) =>
        prev.l === l && prev.c === c && prev.r === rr && prev.g === g
          ? prev
          : { l, c, r: rr, g },
      );
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    schedule();
    // La página nueva termina de armarse (pins, imágenes) en el primer segundo.
    const timers = [120, 450, 1000, 1800].map((ms) => window.setTimeout(schedule, ms));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    ScrollTrigger.addEventListener("refresh", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ScrollTrigger.removeEventListener("refresh", schedule);
      timers.forEach((t) => window.clearTimeout(t));
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Con la barra frosted (scrolled) todo el header comparte el tono global.
  const toneL = scrolled ? tones.g : tones.l;
  const toneC = scrolled ? tones.g : tones.c;
  const toneR = scrolled ? tones.g : tones.r;

  // 2) Overlay: UNA timeline (ver buildMenuTimeline) que va hacia adelante al
  //    abrir y en REVERSA al cerrar. T-11: se arma en idle (después de montar,
  //    al cambiar el tamaño o el estado "scrolled") → el click solo hace play().
  const openRef = useRef(false);
  const liberarInert = useRef<(() => void) | null>(null);
  const everOpened = useRef(false);

  const construir = useCallback(() => {
    const el = overlayRef.current;
    if (!el) return null;
    // Abierto o a mitad de camino: no se toca la timeline en curso.
    if (openRef.current || (menuTl.current && menuTl.current.progress() > 0)) {
      return menuTl.current;
    }
    menuTl.current?.kill();
    menuTl.current = buildMenuTimeline(el, closeButtonRef.current, menuButtonRef.current, {
      // T-11: el bloqueo de scroll entra con el primer frame, no en el click.
      onStart: () => {
        if (!liberarScroll.current) liberarScroll.current = lockScroll();
      },
      onReverseComplete: () => {
        // Recién con el menú totalmente retirado se libera el scroll (sin
        // saltos de layout a mitad de la animación).
        gsap.set(el, { autoAlpha: 0 });
        liberarScroll.current?.();
        liberarScroll.current = null;
        startLenis();
      },
    });
    return menuTl.current;
  }, []);

  useEffect(() => {
    const ric: (cb: () => void) => number =
      typeof window.requestIdleCallback === "function"
        ? (cb) => window.requestIdleCallback(cb, { timeout: 1500 })
        : (cb) => window.setTimeout(cb, 200);
    const cic: (h: number) => void =
      typeof window.cancelIdleCallback === "function"
        ? (h) => window.cancelIdleCallback(h)
        : (h) => window.clearTimeout(h);
    let idle = 0;
    let t = 0;
    const programar = () => {
      cic(idle);
      idle = ric(() => {
        construir();
      });
    };
    programar();
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(programar, 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cic(idle);
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
    // scrolled cambia la posición del botón "Menú" → se rearma en idle.
  }, [construir, scrolled]);

  useEffect(() => {
    const el = overlayRef.current;
    if (el) gsap.set(el, { autoAlpha: 0 });
    return () => {
      menuTl.current?.kill();
      liberarScroll.current?.();
      liberarScroll.current = null;
      liberarInert.current?.();
      liberarInert.current = null;
    };
  }, []);

  // 3) Abrir / cerrar + foco (T-07). useLayoutEffect: corre apenas React sacó
  //    el `inert` del overlay, antes de pintar → el foco entra en "Cerrar" de
  //    inmediato (aunque visualmente aparezca después) y el resto de la página
  //    queda `inert` mientras el menú está abierto.
  useLayoutEffect(() => {
    const el = overlayRef.current;
    openRef.current = open;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (open) {
      everOpened.current = true;
      previousFocus.current = document.activeElement as HTMLElement | null;
      stopLenis();
      const tl = menuTl.current ?? construir();
      gsap.set(el, { autoAlpha: 1 });
      liberarInert.current?.();
      liberarInert.current = inertFondo(el);
      if (tl) {
        if (reduce) {
          if (!liberarScroll.current) liberarScroll.current = lockScroll();
          tl.progress(1);
        } else {
          tl.timeScale(1).play();
        }
      }
      closeButtonRef.current?.focus({ preventScroll: true });
    } else if (everOpened.current) {
      liberarInert.current?.();
      liberarInert.current = null;
      const tl = menuTl.current;
      if (tl) {
        if (reduce) {
          tl.progress(0);
          gsap.set(el, { autoAlpha: 0 });
          liberarScroll.current?.();
          liberarScroll.current = null;
          startLenis();
        } else {
          // Cierre = la misma coreografía en reversa, un poco más ágil.
          tl.timeScale(1.3).reverse();
        }
      }
      // Devolvemos el foco al botón que abrió el menú (sin scroll).
      (previousFocus.current ?? menuButtonRef.current)?.focus({ preventScroll: true });
      previousFocus.current = null;
    }
  }, [open, construir]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const cerrarMenu = useCallback(() => setOpen(false), []);

  // 4) Focus trap: Tab/Shift+Tab ciclan dentro del overlay (el resto ya está
  //    inert; esto evita que el foco se vaya a la barra del navegador).
  const onOverlayKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const el = overlayRef.current;
    if (!el) return;
    const focusables = Array.from(
      el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (e.shiftKey) {
      if (active === first || !el.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else if (active === last || !el.contains(active)) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  // T-07: si el foco llega a un link mientras el stagger todavía corre, se
  // completa la entrada → el link enfocado siempre se ve.
  const onOverlayFocus = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement;
    if (!t.classList.contains("menu-link")) return;
    const tl = menuTl.current;
    if (tl && !tl.reversed() && tl.progress() < 1) tl.progress(1);
    // El <li> es overflow-hidden: el foco pudo haberlo scrolleado.
    if (t.parentElement) t.parentElement.scrollTop = 0;
  }, []);

  return (
    <>
      {/* Header fijo, color FIJO por ahora (sin adaptativo dark/light). Logo
          CENTRADO: arriba se ve el logo completo (casita + "Sweet Flowers /
          Deco Party"); al scrollear hace crossfade a solo la casita. */}
      <header
        ref={headerRef}
        data-tone={tones.g}
        data-scrolled={scrolled ? "true" : "false"}
        className={`c-site-header fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] text-ink transition-[background-color,border-color,backdrop-filter] duration-600 ease-(--ease-out-quart) ${
          scrolled
            ? tones.g === "light"
              ? "border-bone/10 bg-ink/55 backdrop-blur-md"
              : "border-ink/10 bg-bone/80 backdrop-blur-md"
            : "border-transparent bg-bone/0"
        } ${open ? "pointer-events-none" : ""}`}
      >
        {/* D-03: degradé superior sutil sobre héroes oscuros (inicio, Summit) →
            el contraste del logo y de "Menú" no depende del frame del video. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-[calc(100%+3rem)] bg-linear-to-b from-ink/45 via-ink/15 to-transparent transition-opacity duration-600 ease-(--ease-out-quart) ${
            !scrolled && tones.g === "light" ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`relative mx-auto grid max-w-360 grid-cols-[1fr_auto_1fr] items-center px-6 transition-[padding] duration-600 ease-(--ease-out-quart) md:px-10 ${
            scrolled ? "py-2.5" : "py-4 [@media(max-height:30rem)]:py-2"
          }`}
        >
          {/* Izquierda: EVENT SUMMIT (destacado, prioridad de la clienta) + CONTACTO */}
          <div
            ref={zoneLeftRef}
            data-tone={toneL}
            className="flex items-center gap-5 justify-self-start sm:gap-7"
          >
            <Link
              href="/event-summit"
              className="group -my-2 inline-flex min-h-11 items-center gap-2.5 py-2 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink"
            >
              <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-champagne opacity-70 motion-safe:animate-ping" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-champagne" />
              </span>
              <span className="relative whitespace-nowrap">
                <span className="hidden sm:inline">Event </span>Summit
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-(--ease-out-expo) group-hover:origin-left group-hover:scale-x-100" />
              </span>
              <span className="hidden text-ink/70 md:inline">2027</span>
            </Link>
            <Link
              href={CONTACTO_LINK.href}
              className="group -my-2 hidden min-h-11 items-center gap-2 py-2 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink md:inline-flex"
            >
              {CONTACTO_LINK.label}
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:rotate-90"
              >
                <line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>

          {/* Centro: LOGO = isotipo + logotipo HTML */}
          <Link
            ref={logoWrapRef}
            data-tone={toneC}
            href="/"
            onPointerEnter={handleLogoHoverIn}
            onPointerLeave={handleLogoHoverOut}
            className="relative flex flex-col items-center justify-self-center gap-0.5"
            aria-label="Sweet Flowers Deco Party — inicio"
          >
            <span
              className={`relative block transition-[height] duration-600 ease-(--ease-out-quart) ${
                scrolled
                  ? "h-[clamp(2rem,3vw,2.5rem)]"
                  : "h-[clamp(3rem,5.5vw,4rem)] [@media(max-height:30rem)]:h-9"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo-mark-520.webp"
                alt="Sweet Flowers Deco Party"
                className="block h-full w-auto"
              />
              <span
                ref={sweetRef}
                aria-hidden="true"
                style={{ wordSpacing: "0.3em" }}
                className={`font-(family-name:--font-logo) pointer-events-none absolute bottom-0 right-full pr-2 whitespace-nowrap text-[1.15rem] font-medium uppercase leading-none tracking-[0.12em] text-ink ${
                  scrolled ? "" : "invisible"
                }`}
              >
                Sweet
              </span>
              <span
                ref={flowersRef}
                aria-hidden="true"
                className={`font-(family-name:--font-logo) pointer-events-none absolute bottom-0 left-full pl-2 whitespace-nowrap text-[1.15rem] font-medium uppercase leading-none tracking-[0.12em] text-ink ${
                  scrolled ? "" : "invisible"
                }`}
              >
                Flowers
              </span>
            </span>

            <span
              className={`grid transition-[grid-template-rows,opacity] duration-600 ease-(--ease-out-quart) ${
                scrolled ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
              }`}
            >
             <span className="min-h-0 w-max overflow-hidden">
              <span
                className={`flex flex-col items-center text-center leading-none transition-transform duration-600 ease-(--ease-out-quart) ${
                  scrolled ? "-translate-y-2" : "translate-y-0"
                }`}
              >
              <span
                className="whitespace-nowrap font-(family-name:--font-logo) text-[0.88rem] font-medium uppercase leading-none tracking-[0.06em] text-ink min-[360px]:text-[0.95rem] min-[360px]:tracking-[0.08em] sm:text-[1.45rem] sm:tracking-[0.12em] [@media(max-height:30rem)]:text-[1.05rem]"
                style={{ wordSpacing: "0.15em" }}
              >
                Sweet&nbsp;Flowers
              </span>
              <span className="mt-px text-[0.7rem] font-medium uppercase tracking-[0.13em] text-ink/70">
                Deco&nbsp;Party
              </span>
              </span>
             </span>
            </span>
          </Link>

          {/* Derecha: MENÚ — líneas animadas + texto */}
          <div ref={zoneRightRef} data-tone={toneR} className="justify-self-end">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => { setWasScrolled(scrolled); setOpen(true); }}
              aria-label="Abrir menú"
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-controls="menu-overlay"
              className="group -my-2 inline-flex min-h-11 items-center gap-2.5 py-2 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink"
            >
              Menú
              <span className="flex w-5 flex-col gap-1.5">
                <span className="block h-px w-5 bg-current transition-[width] duration-300 ease-(--ease-out-expo) group-hover:w-3" />
                <span className="block h-px w-3 bg-current transition-[width] duration-300 ease-(--ease-out-expo) group-hover:w-5" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Menú overlay full-screen (memoizado: no se re-renderiza con el scroll) */}
      <MenuOverlay
        open={open}
        wasScrolled={wasScrolled}
        onClose={cerrarMenu}
        onKeyDown={onOverlayKeyDown}
        onFocusCapture={onOverlayFocus}
        overlayRef={overlayRef}
        closeButtonRef={closeButtonRef}
      />
    </>
  );
}

type MenuOverlayProps = {
  open: boolean;
  wasScrolled: boolean;
  onClose: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onFocusCapture: (e: React.FocusEvent<HTMLDivElement>) => void;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
};

const MenuOverlay = memo(function MenuOverlay({
  open,
  wasScrolled,
  onClose,
  onKeyDown,
  onFocusCapture,
  overlayRef,
  closeButtonRef,
}: MenuOverlayProps) {
  return (
            <div
        ref={overlayRef}
        id="menu-overlay"
        onKeyDown={onKeyDown}
        onFocusCapture={onFocusCapture}
        className={`invisible fixed inset-0 z-60 flex flex-col overflow-hidden opacity-0 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        aria-hidden={!open}
        inert={!open}
      >
        {/* Pilares de fondo */}
        <div className="pointer-events-none absolute inset-0 flex" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            // -mr-[2px]: cada pilar se monta 2px sobre el siguiente → sin líneas
            // claras entre pilares (antialiasing subpíxel al escalar en mobile).
            <div key={i} className="menu-pillar -mr-[2px] flex-1 bg-ink last:mr-0" />
          ))}
        </div>

        {/* Contenido por encima de los pilares */}
        <div className="relative z-10 flex flex-1 flex-col text-bone">
          {/* Barra superior */}
          <div className={`mx-auto flex w-full max-w-360 items-center justify-end px-6 md:px-10 ${wasScrolled ? "pb-2.5 pt-[calc(env(safe-area-inset-top)+1rem)]" : "pb-4 pt-[calc(env(safe-area-inset-top)+3.25rem)] [@media(max-height:30rem)]:pb-2 [@media(max-height:30rem)]:pt-[calc(env(safe-area-inset-top)+0.75rem)]"}`}>
            <button
              type="button"
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Cerrar menú"
              className="opacity-0 group -my-2 inline-flex min-h-11 items-center gap-2.5 py-2 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-bone/70 transition-colors hover:text-bone"
            >
              Cerrar
              <span className="flex w-5 items-center justify-center">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:rotate-90">
                  <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                </svg>
              </span>
            </button>
          </div>

          {/* Cuerpo: links a la izquierda + logo abajo a la derecha */}
          <div className="mx-auto grid w-full max-w-360 min-h-0 flex-1 grid-cols-1 md:grid-cols-[1fr_auto]">
            <nav className="flex min-h-0 items-center overflow-y-auto overscroll-contain px-6 py-4 md:px-10">
              <ul className="w-full">
                {NAV.map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="menu-link group flex items-baseline gap-4 py-1 font-display text-(length:--text-step-4) font-extrabold uppercase leading-[1.05] text-bone/70 transition-colors duration-300 hover:text-bone md:text-(length:--text-step-5) [@media(max-height:30rem)]:text-(length:--text-step-3)"
                    >
                      <span className="font-sans text-(length:--text-step--1) font-normal text-champagne">
                        0{i + 1}
                      </span>
                      <span className={item.destacado ? "text-bone" : undefined}>{item.label}</span>
                      {item.destacado && item.meta && (
                        <span className="self-center rounded-full border border-champagne/60 px-2.5 py-1 font-sans text-[0.65rem] font-medium tracking-[0.14em] text-champagne">
                          {item.meta}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Logo — blanco limpio sobre fondo oscuro, abajo a la derecha */}
            <div className="hidden items-end justify-end px-6 pb-8 md:flex md:px-10 [@media(max-height:30rem)]:pb-4">
              <div className="overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/logo-mark-520.webp"
                  alt=""
                  aria-hidden="true"
                  className="menu-logo-img block h-[clamp(9rem,18vw,16rem)] w-auto brightness-0 invert [@media(max-height:30rem)]:h-[min(9rem,45svh)]"
                />
              </div>
            </div>
          </div>

          {/* Barra inferior */}
          <div className="menu-fade mx-auto flex w-full max-w-360 flex-wrap items-center justify-between gap-4 border-t border-bone/10 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 text-[0.72rem] [@media(max-height:30rem)]:hidden uppercase tracking-[0.12em] text-bone/50 md:px-10">
            <span>Decoración de eventos · Argentina</span>
            <ul className="-mx-2 flex items-center">
              <li>
                <a
                  href={INSTAGRAM_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-bone"
                >
                  Instagram<span className="sr-only"> (se abre en otra pestaña)</span>
                </a>
              </li>
              <li aria-hidden="true">·</li>
              <li>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("wa_contact_click", { origen: "menu" })}
                  className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-bone"
                >
                  WhatsApp<span className="sr-only"> (se abre en otra pestaña)</span>
                </a>
              </li>
              {/* TODO(contenido): Email cuando Flor confirme la casilla (sin mail confirmado no se muestra). */}
            </ul>
          </div>
        </div>
      </div>
  );
});

/* ---------------------------------------------------------------------------
 * Timeline del menú: caída de pilares en cascada (en reversa suben en orden
 * inverso). Todo con opacity (no visibility) → "Cerrar" y los links son
 * enfocables desde el primer instante (T-07).
 * ------------------------------------------------------------------------- */
const PILLAR_DUR = 0.55;
const PILLAR_STAGGER = 0.055;
const PILLAR_EASE = "power4.inOut";

function buildMenuTimeline(
  el: HTMLElement,
  closeBtn: HTMLElement | null,
  menuBtn: HTMLElement | null,
  cb: { onStart: () => void; onReverseComplete: () => void },
): gsap.core.Timeline {
  const links = el.querySelectorAll(".menu-link");
  const pillars = el.querySelectorAll<HTMLElement>(".menu-pillar");
  const fades = el.querySelectorAll(".menu-fade");
  const logo = el.querySelector(".menu-logo-img");

  // ¿En qué momento el pilar que está sobre el botón "Menú" termina de taparlo?
  // Se calcula con la posición real del botón → exacto en cualquier viewport.
  let tCover = PILLAR_DUR * 0.5;
  if (menuBtn && pillars.length) {
    const r = menuBtn.getBoundingClientRect();
    const idx = Math.min(
      pillars.length - 1,
      Math.max(0, Math.floor(((r.left + r.right) / 2 / window.innerWidth) * pillars.length)),
    );
    const target = Math.min(1, (r.bottom + 6) / window.innerHeight);
    const ease = gsap.parseEase(PILLAR_EASE);
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (ease(mid) < target) lo = mid;
      else hi = mid;
    }
    tCover = idx * PILLAR_STAGGER + hi * PILLAR_DUR;
  }
  const pillarsEnd = (pillars.length - 1) * PILLAR_STAGGER + PILLAR_DUR;

  const tl = gsap.timeline({ paused: true });
  tl.set(el, { autoAlpha: 1 }, 0)
    .fromTo(
      pillars,
      { scaleY: 0, transformOrigin: "top center" },
      { scaleY: 1, duration: PILLAR_DUR, ease: PILLAR_EASE, stagger: PILLAR_STAGGER },
      0,
    );
  // "Cerrar" nace recién cuando el botón "Menú" ya quedó tapado.
  if (closeBtn) {
    tl.fromTo(
      closeBtn,
      { opacity: 0, yPercent: 40 },
      { opacity: 1, yPercent: 0, duration: 0.3, ease: "power3.out" },
      tCover,
    );
  }
  tl.fromTo(
    links,
    { yPercent: 110, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: PILLAR_STAGGER },
    pillarsEnd - 0.35,
  );
  if (logo) {
    tl.fromTo(logo, { yPercent: 105 }, { yPercent: 0, duration: 0.9, ease: "expo.out" }, pillarsEnd - 0.2);
  }
  tl.fromTo(fades, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, pillarsEnd - 0.1);
  tl.eventCallback("onStart", cb.onStart);
  tl.eventCallback("onReverseComplete", cb.onReverseComplete);
  return tl;
}

/**
 * Deja `inert` todo lo que no sea el overlay (hermanos en cada nivel hasta el
 * <body>: main, footer, el resto del header, flotantes). Devuelve cómo deshacerlo.
 */
function inertFondo(keep: Element): () => void {
  const tocados: Element[] = [];
  let node: Element = keep;
  while (node.parentElement && node !== document.body) {
    const parent: HTMLElement = node.parentElement;
    for (const sib of Array.from(parent.children)) {
      if (sib === node || sib.hasAttribute("inert")) continue;
      if (/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT|NEXT-ROUTE-ANNOUNCER)$/.test(sib.tagName)) continue;
      sib.setAttribute("inert", "");
      tocados.push(sib);
    }
    node = parent;
  }
  return () => tocados.forEach((n) => n.removeAttribute("inert"));
}
