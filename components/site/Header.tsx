"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { startLenis, stopLenis } from "@/components/motion/SmoothScroll";
import { MAIN_NAV, CONTACTO_LINK } from "@/content/site";

// Menú del Header = navegación principal + Contacto al final.
const NAV = [...MAIN_NAV, CONTACTO_LINK];

/**
 * Header fijo con:
 * 1) COLOR ADAPTATIVO — el texto se invierte (marfil/tinta) según el fondo de la
 *    sección que tiene detrás (lee data-theme="dark|light" en las secciones).
 * 2) MENÚ OVERLAY full-screen con reveal en máscara (GSAP), respeta reduced-motion.
 */
export function Header() {
  const [dark, setDark] = useState(false); // fondo oscuro detrás → header claro
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // ya no está en el tope → fondo frosted
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null); // botón "Menú" que abre
  const previousFocus = useRef<HTMLElement | null>(null); // foco previo a abrir
  const mounted = useRef(false);

  // 1) Color adaptativo: qué sección data-theme está bajo la línea del header.
  useEffect(() => {
    const LINE = 40; // px desde el top, dentro del header
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      const els = document.querySelectorAll<HTMLElement>("[data-theme]");
      let theme = "light";
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top <= LINE && r.bottom > LINE) {
          theme = el.dataset.theme ?? "light";
          break;
        }
      }
      setDark(theme === "dark");
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

  // 2) Animación del overlay al abrir/cerrar.
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const links = el.querySelectorAll(".menu-link");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!mounted.current) {
      gsap.set(el, { autoAlpha: 0 });
      gsap.set(links, { yPercent: 110, autoAlpha: 0 });
      mounted.current = true;
      return;
    }

    if (open) {
      document.body.style.overflow = "hidden";
      stopLenis(); // pausamos el scroll suave mientras el menú está abierto
      if (reduce) {
        gsap.set(el, { autoAlpha: 1 });
        gsap.set(links, { yPercent: 0, autoAlpha: 1 });
      } else {
        gsap
          .timeline()
          .to(el, { autoAlpha: 1, duration: 0.4, ease: "power2.out" })
          .to(
            links,
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.65,
              ease: "power3.out",
              stagger: 0.06,
            },
            "-=0.15",
          );
      }
    } else {
      document.body.style.overflow = "";
      startLenis(); // reanudamos el scroll suave al cerrar
      if (reduce) {
        gsap.set(el, { autoAlpha: 0 });
        gsap.set(links, { yPercent: 110, autoAlpha: 0 });
      } else {
        gsap
          .timeline()
          .to(links, {
            yPercent: -40,
            autoAlpha: 0,
            duration: 0.3,
            ease: "power2.in",
            stagger: 0.03,
          })
          .to(el, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, "-=0.15")
          .set(links, { yPercent: 110 });
      }
    }
  }, [open]);

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
      // Movemos el foco al primer elemento focusable del overlay.
      const focusables = el.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      focusables[0]?.focus();
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
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
          scrolled
            ? dark
              ? "border-bone/10 bg-ink/65 backdrop-blur-md"
              : "border-ink/10 bg-bone/70 backdrop-blur-md"
            : "border-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between px-6 transition-all duration-500 md:px-10 ${
            scrolled ? "py-4" : "py-6"
          } ${dark ? "text-bone" : "text-ink"}`}
        >
          <Link
            href="/"
            className="font-display text-[length:var(--text-step-1)] font-bold leading-none tracking-tight"
            aria-label="Sweet Flowers Deco Party — inicio"
          >
            Sweet&nbsp;Flowers
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="#contacto"
              className={`hidden rounded-[var(--radius-pill)] px-5 py-2.5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.1em] transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 sm:inline-flex ${
                dark ? "bg-bone text-ink" : "bg-ink text-bone"
              }`}
            >
              Contacto
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-controls="menu-overlay"
              className="group inline-flex items-center gap-2 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.14em]"
            >
              <span className="flex flex-col gap-[3px]">
                <span className="h-px w-5 bg-current transition-transform duration-300 group-hover:translate-x-0.5" />
                <span className="h-px w-5 bg-current" />
              </span>
              Menú
            </button>
          </div>
        </div>
      </header>

      {/* Menú overlay full-screen.
          Cuando está cerrado: aria-hidden + inert lo sacan del árbol de
          accesibilidad y del orden de tabulación, y pointer-events:none evita
          clicks fantasma. GSAP maneja la visibilidad (autoAlpha). */}
      <div
        ref={overlayRef}
        id="menu-overlay"
        onKeyDown={onOverlayKeyDown}
        className={`invisible fixed inset-0 z-[60] flex flex-col bg-ink text-bone opacity-0 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-6 md:px-10">
          <span className="font-display text-[length:var(--text-step-1)] leading-none tracking-tight">
            Sweet&nbsp;Flowers
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="inline-flex items-center gap-2 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.14em] text-bone/80 transition-colors hover:text-bone"
          >
            Cerrar
            <span aria-hidden="true" className="text-[length:var(--text-step-0)]">
              ✕
            </span>
          </button>
        </div>

        <nav className="flex flex-1 items-center px-6 md:px-10">
          <ul className="mx-auto w-full max-w-[1440px]">
            {NAV.map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="menu-link group flex items-baseline gap-5 py-1.5 font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[1.05] text-bone/70 transition-colors duration-300 hover:text-bone md:text-[length:var(--text-step-6)]"
                >
                  <span className="font-sans text-[length:var(--text-step--1)] font-normal text-champagne">
                    0{i + 1}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 py-8 text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-bone/60 md:px-10">
          {/* TODO(contenido): datos reales */}
          <span>Decoración de eventos · Argentina</span>
          <span>Instagram · WhatsApp · Email</span>
        </div>
      </div>
    </>
  );
}
