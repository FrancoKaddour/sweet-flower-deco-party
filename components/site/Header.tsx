"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

const NAV = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Workshops", href: "/evento" },
  { label: "Membresía", href: "/membresia" },
  { label: "Historia", href: "#historia" },
  { label: "Contacto", href: "#contacto" },
];

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

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
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

      {/* Menú overlay full-screen */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[60] flex flex-col bg-ink text-bone"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
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
