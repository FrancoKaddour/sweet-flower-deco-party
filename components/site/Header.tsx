"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { startLenis, stopLenis } from "@/components/motion/SmoothScroll";
import { MAIN_NAV, CONTACTO_LINK } from "@/content/site";

// Menú del Header = navegación principal + Contacto al final.
const NAV = [...MAIN_NAV, CONTACTO_LINK];

// Páginas cuyo hero es OSCURO (video/foto): ahí, arriba de todo, el header va
// en tono claro. En el resto (fondos marfil) va en tinta.
const DARK_HERO_PATHS = ["/", "/event-summit"];

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
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const mounted = useRef(false);

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

  const handleLogoHoverIn = () => {
    if (!scrolled) return;
    hoverTl.current?.play();
  };
  const handleLogoHoverOut = () => {
    if (!scrolled) return;
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

  // 2) Overlay: UNA timeline que va hacia adelante al abrir y en REVERSA al
  //    cerrar → el cierre es exactamente la inversa de la caída de pilares, y
  //    si se interrumpe a mitad (abrir/cerrar rápido) continúa desde donde está.
  //    "Cerrar" aparece recién cuando el pilar ya tapó el botón "Menú", y al
  //    cerrar desaparece justo cuando ese pilar se retira de esa posición.
  const PILLAR_DUR = 0.55;
  const PILLAR_STAGGER = 0.055;
  const PILLAR_EASE = "power4.inOut";

  const buildMenuTimeline = () => {
    const el = overlayRef.current;
    if (!el) return null;
    const links = el.querySelectorAll(".menu-link");
    const pillars = el.querySelectorAll<HTMLElement>(".menu-pillar");
    const fades = el.querySelectorAll(".menu-fade");
    const logo = el.querySelector(".menu-logo-img");
    const closeBtn = closeButtonRef.current;
    const menuBtn = menuButtonRef.current;

    // ¿En qué momento el pilar que está sobre el botón "Menú" termina de taparlo?
    // Se calcula con la posición real del botón → exacto en cualquier viewport.
    let tCover = PILLAR_DUR * 0.5;
    if (menuBtn && pillars.length) {
      const r = menuBtn.getBoundingClientRect();
      const idx = Math.min(
        pillars.length - 1,
        Math.max(0, Math.floor(((r.left + r.right) / 2 / window.innerWidth) * pillars.length)),
      );
      const target = Math.min(1, (r.bottom + 6) / window.innerHeight); // fracción de alto a cubrir
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
      // Pilares caen en cascada (dominó) — en reversa suben en el orden inverso.
      .fromTo(
        pillars,
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: PILLAR_DUR, ease: PILLAR_EASE, stagger: PILLAR_STAGGER },
        0,
      )
      // "Cerrar" nace recién cuando el botón "Menú" ya quedó tapado.
      .fromTo(
        closeBtn,
        { autoAlpha: 0, yPercent: 40 },
        { autoAlpha: 1, yPercent: 0, duration: 0.3, ease: "power3.out" },
        tCover,
      )
      // Links suben desde debajo de su máscara
      .fromTo(
        links,
        { yPercent: 110, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out", stagger: PILLAR_STAGGER },
        pillarsEnd - 0.35,
      )
      // Logo: reveal en máscara desde abajo
      .fromTo(
        logo,
        { yPercent: 105 },
        { yPercent: 0, duration: 0.9, ease: "expo.out" },
        pillarsEnd - 0.2,
      )
      // Hairlines + barra inferior
      .fromTo(
        fades,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5, ease: "power2.out" },
        pillarsEnd - 0.1,
      );

    tl.eventCallback("onComplete", () => {
      // Foco al primer elemento del diálogo, recién cuando es visible.
      closeBtn?.focus();
    });
    tl.eventCallback("onReverseComplete", () => {
      // Recién con el menú totalmente retirado se libera el scroll (sin saltos
      // de layout a mitad de la animación).
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      startLenis();
    });
    return tl;
  };

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!mounted.current) {
      gsap.set(el, { autoAlpha: 0 });
      mounted.current = true;
      return;
    }

    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      stopLenis();
      // Si estaba cerrándose, retoma desde ahí; si no, se arma de cero
      // (recalcula la posición del botón por si cambió el viewport).
      if (!menuTl.current || menuTl.current.progress() === 0) {
        menuTl.current?.kill();
        menuTl.current = buildMenuTimeline();
      }
      const tl = menuTl.current;
      if (!tl) return;
      if (reduce) tl.progress(1);
      else tl.timeScale(1).play();
    } else {
      const tl = menuTl.current;
      if (!tl) return;
      if (reduce) tl.progress(0);
      // Cierre = la misma coreografía en reversa, un poco más ágil.
      else tl.timeScale(1.3).reverse();
    }
    // buildMenuTimeline lee solo refs → no necesita ser dependencia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => { menuTl.current?.kill(); }, []);

  // 3) Gestión de foco: al abrir movemos el foco dentro del overlay y al
  //    cerrar lo devolvemos al botón "Menú" que lo disparó.
  //    No se ejecuta en el montaje inicial (mounted.current sigue en false).
  useEffect(() => {
    if (!mounted.current) return;
    const el = overlayRef.current;
    if (!el) return;

    if (open) {
      // Guardamos el elemento que tenía el foco (normalmente el botón "Menú").
      previousFocus.current = document.activeElement as HTMLElement | null;
      // El foco entra al overlay desde la timeline (onComplete), cuando
      // "Cerrar" ya es visible y focuseable.
    } else {
      // Al cerrar devolvemos el foco al botón que abrió el menú.
      (previousFocus.current ?? menuButtonRef.current)?.focus();
      previousFocus.current = null;
    }
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // 4) Focus trap: mientras el menú está abierto, Tab/Shift+Tab ciclan solo
  //    dentro del overlay (primer ↔ último elemento focusable).
  const onOverlayKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const el = overlayRef.current;
    if (!el) return;
    const focusables = Array.from(
      el.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey) {
      // Shift+Tab desde el primero → saltar al último.
      if (active === first || !el.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab desde el último → volver al primero.
      if (active === last || !el.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <>
      {/* Header fijo, color FIJO por ahora (sin adaptativo dark/light). Logo
          CENTRADO: arriba se ve el logo completo (casita + "Sweet Flowers /
          Deco Party"); al scrollear hace crossfade a solo la casita. */}
      <header
        data-tone={DARK_HERO_PATHS.includes(pathname) && !scrolled ? "light" : "dark"}
        className={`c-site-header fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] text-ink transition-[background-color,border-color,backdrop-filter] duration-600 ease-(--ease-out-quart) ${
          scrolled
            ? "border-ink/10 bg-bone/80 backdrop-blur-md"
            : "border-transparent bg-bone/0"
        } ${open ? "pointer-events-none" : ""}`}
      >
        <div
          className={`relative mx-auto grid max-w-360 grid-cols-[1fr_auto_1fr] items-center px-6 transition-[padding] duration-600 ease-(--ease-out-quart) md:px-10 ${
            scrolled ? "py-2.5" : "py-4"
          }`}
        >
          {/* Izquierda: EVENT SUMMIT (destacado, prioridad de la clienta) + CONTACTO */}
          <div className="flex items-center gap-7 justify-self-start">
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
            href="/"
            onMouseEnter={handleLogoHoverIn}
            onMouseLeave={handleLogoHoverOut}
            className="relative flex flex-col items-center justify-self-center gap-0.5"
            aria-label="Sweet Flowers Deco Party — inicio"
          >
            <span
              className={`relative block transition-[height] duration-600 ease-(--ease-out-quart) ${
                scrolled
                  ? "h-[clamp(2rem,3vw,2.5rem)]"
                  : "h-[clamp(3rem,5.5vw,4rem)]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo-mark-full.png"
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
             <span className="min-h-0 overflow-hidden">
              <span
                className={`flex flex-col items-center text-center leading-none transition-transform duration-600 ease-(--ease-out-quart) ${
                  scrolled ? "-translate-y-2" : "translate-y-0"
                }`}
              >
              <span
                className="whitespace-nowrap font-(family-name:--font-logo) text-[0.95rem] font-medium uppercase leading-none tracking-[0.08em] text-ink sm:text-[1.45rem] sm:tracking-[0.12em]"
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
          <div className="justify-self-end">
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

      {/* Menú overlay full-screen */}
      <div
        ref={overlayRef}
        id="menu-overlay"
        onKeyDown={onOverlayKeyDown}
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
          <div className={`mx-auto flex w-full max-w-360 items-center justify-end px-6 md:px-10 ${wasScrolled ? "pb-2.5 pt-[calc(env(safe-area-inset-top)+1rem)]" : "pb-4 pt-[calc(env(safe-area-inset-top)+3.25rem)]"}`}>
            <button
              type="button"
              ref={closeButtonRef}
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="invisible opacity-0 group -my-2 inline-flex min-h-11 items-center gap-2.5 py-2 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-bone/70 transition-colors hover:text-bone"
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
                      onClick={() => setOpen(false)}
                      className="menu-link group flex items-baseline gap-4 py-1 font-display text-(length:--text-step-4) font-extrabold uppercase leading-[1.05] text-bone/70 transition-colors duration-300 hover:text-bone md:text-(length:--text-step-5)"
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
            <div className="hidden items-end justify-end px-6 pb-8 md:flex md:px-10">
              <div className="overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/logo-mark-full.png"
                  alt=""
                  aria-hidden="true"
                  className="menu-logo-img block h-[clamp(9rem,18vw,16rem)] w-auto brightness-0 invert"
                />
              </div>
            </div>
          </div>

          {/* Barra inferior */}
          <div className="menu-fade mx-auto flex w-full max-w-360 flex-wrap items-center justify-between gap-4 border-t border-bone/10 px-6 py-6 text-[0.72rem] uppercase tracking-[0.12em] text-bone/50 md:px-10">
            <span>Decoración de eventos · Argentina</span>
            <span>Instagram · WhatsApp · Email</span>
          </div>
        </div>
      </div>
    </>
  );
}
