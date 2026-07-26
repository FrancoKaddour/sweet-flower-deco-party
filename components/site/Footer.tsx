"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { MAIN_NAV, CONTACTO_LINKS, INFO_LINKS } from "@/content/site";

// TODO(contenido): datos reales de contacto, redes y legales (ver docs).
// Footer oscuro premium — mood editorial cálido para Sweet Flowers Deco Party.
// Navegación y enlaces se centralizan en @/content/site.

// Segmento del marquee: se renderiza 2 veces dentro del track para el loop infinito.
function MarqueeSegment() {
  // El texto se repite 3 veces por copia para asegurar ancho > viewport.
  return (
    <span className="inline-flex shrink-0 items-center" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} className="inline-flex items-center">
          SWEET FLOWERS DECO PARTY&nbsp;
          <span className="footer-star inline-block text-champagne">✳</span>&nbsp;DECORACIÓN DE
          EVENTOS&nbsp;
          <span className="footer-star inline-block text-champagne">✳</span>&nbsp;
        </span>
      ))}
    </span>
  );
}

/**
 * Footer del sitio — marquee animado con GSAP, grilla de columnas y barra inferior.
 * Respeta prefers-reduced-motion (no anima el marquee si el usuario lo prefiere).
 */
export function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;
      // Si el usuario prefiere menos movimiento, no animamos el marquee.
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) return;
      // Desplaza el track un 50% (una copia completa) en loop continuo — bien lento.
      gsap.to(track, { xPercent: -50, ease: "none", duration: 70, repeat: -1 });
      // Los ✳ giran a la derecha (clockwise) en su lugar, de forma continua.
      gsap.to(".footer-star", {
        rotation: 360,
        ease: "none",
        duration: 6,
        repeat: -1,
      });
    },
    { scope: rootRef },
  );

  return (
    <footer
      ref={rootRef}
      data-theme="dark"
      className="w-full bg-ink text-bone"
    >
      {/* 1) Marquee gigante — dos copias en fila para el loop infinito */}
      <div className="overflow-hidden border-b border-bone/10 py-16 md:py-24">
        <div
          ref={trackRef}
          className="flex w-max whitespace-nowrap font-display text-[length:var(--text-step-6)] font-bold uppercase text-bone/90 md:text-[length:var(--text-step-7)]"
        >
          <MarqueeSegment />
          <MarqueeSegment />
        </div>
      </div>

      {/* 2) Grilla de columnas */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-10 px-6 py-16 md:grid-cols-4 md:px-10">
        {/* Marca */}
        <div className="col-span-2">
          <p className="font-display text-[length:var(--text-step-3)] font-bold uppercase leading-[0.9] text-bone">
            Sweet Flowers
          </p>
          <p className="mt-3 text-[length:var(--text-step--1)] text-muted">
            {/* TODO(contenido): bajada de marca */}
            Decoración de eventos · Argentina
          </p>
        </div>

        {/* Navegación */}
        <nav aria-label="Navegación del footer">
          <h4 className="mb-4 text-[length:var(--text-step--1)] uppercase tracking-wide text-champagne">
            Navegación
          </h4>
          <ul className="space-y-2">
            {MAIN_NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-bone/80 transition-colors hover:text-bone"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contacto */}
        <div>
          <h4 className="mb-4 text-[length:var(--text-step--1)] uppercase tracking-wide text-champagne">
            Contacto
          </h4>
          <ul className="space-y-2">
            {CONTACTO_LINKS.map((item) => (
              <li key={item.label}>
                {/* TODO(contenido): href real de contacto */}
                <a
                  href={item.href}
                  className="text-bone/80 transition-colors hover:text-bone"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Info / Legal */}
        <div>
          <h4 className="mb-4 text-[length:var(--text-step--1)] uppercase tracking-wide text-champagne">
            Info
          </h4>
          <ul className="space-y-2">
            {INFO_LINKS.map((item) => (
              <li key={item.label}>
                {/* TODO(contenido): páginas legales reales */}
                <a
                  href={item.href}
                  className="text-bone/80 transition-colors hover:text-bone"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3) Barra inferior */}
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 border-t border-bone/10 px-6 py-8 text-[length:var(--text-step--1)] text-muted md:px-10">
        <p>© 2026 Sweet Flowers Deco Party</p>

        <nav
          aria-label="Redes sociales"
          className="flex items-center gap-5 text-bone/70"
        >
          {/* Instagram */}
          <a
            href="#"
            aria-label="Instagram"
            className="transition-colors hover:text-bone"
          >
            {/* TODO(contenido): URL de Instagram */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx="12"
                cy="12"
                r="4"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href="#"
            aria-label="WhatsApp"
            className="transition-colors hover:text-bone"
          >
            {/* TODO(contenido): URL de WhatsApp */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M8.7 8.5c-.2 0-.5 0-.7.4-.2.4-.9 1-.9 2.1s.9 2.4 1 2.6c.2.2 1.8 2.9 4.5 3.9 2 .8 2.4.7 2.9.6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.2-.1-.1-.3-.2-.6-.4-.3-.2-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.7 1-.1.1-.3.2-.5.1-.3-.2-1.1-.4-2-1.3-.8-.7-1.3-1.5-1.4-1.8-.1-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5-.1-.2-.6-1.4-.8-1.8-.2-.4-.4-.4-.6-.4h-.2Z"
                fill="currentColor"
              />
            </svg>
          </a>

          {/* Email */}
          <a
            href="#"
            aria-label="Email"
            className="transition-colors hover:text-bone"
          >
            {/* TODO(contenido): dirección de email real */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="m4 7 8 6 8-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </nav>
      </div>
    </footer>
  );
}
