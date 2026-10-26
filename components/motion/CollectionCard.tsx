"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { getImageProps } from "next/image";

type CollectionCardProps = {
  href: string;
  index: string;
  titulo: string;
  desc: string;
  img: string;
  /** Retraso de la caída, en ms (para escalonar entre columnas). */
  delay?: number;
};

/**
 * Card de colección con "caída" clip-path (referencia CANCAN).
 * La imagen cae de arriba a abajo (clip-path, --clip-fall); al terminar,
 * aparecen el overlay y el texto. Hover: zoom + overlay más oscuro.
 * Mecanismo por clases CSS (.in-view / .is-complete) — ver app/globals.css.
 * Respeta prefers-reduced-motion (muestra todo directo).
 */
export function CollectionCard({
  href,
  index,
  titulo,
  desc,
  img,
  delay = 0,
}: CollectionCardProps) {
  const figRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = figRef.current;
    const img = el?.querySelector("img");
    if (!el || !img) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // sin animación: la card ya es visible por defecto

    // Recién ahora (con JS) "armamos" la card para ocultarla y animar la caída.
    // Sin JS queda visible → mejor para SEO / accesibilidad / no-JS.
    el.classList.add("armed");

    let started = false;
    let inView = false;
    let loaded = img.complete && img.naturalWidth > 0;
    let startTimer = 0;
    let completeTimer = 0;
    let io: IntersectionObserver | undefined;

    // La caída SOLO arranca cuando la imagen ya cargó Y está en viewport:
    // así siempre se ve caer la imagen (nunca un fade sobre una card vacía).
    const maybeStart = () => {
      if (started || !inView || !loaded) return;
      started = true;
      startTimer = window.setTimeout(() => el.classList.add("in-view"), delay);
      // Overlay + texto entran recién cuando la foto terminó de caer (si no, el
      // overlay oscurecía la imagen a mitad de la caída). Duración = --clip-fall.
      const fallMs =
        parseFloat(getComputedStyle(el).getPropertyValue("--clip-fall")) * 1000 || 1300;
      completeTimer = window.setTimeout(
        () => el.classList.add("is-complete"),
        delay + fallMs - 120, // arranca apenas antes del final: empalme sin pausa
      );
    };

    const onLoad = () => {
      loaded = true;
      maybeStart();
    };
    if (!loaded) img.addEventListener("load", onLoad);

    // En el carrusel de mobile las cards de la derecha están fuera de cuadro en
    // horizontal: el disparo lo da el GRUPO (la fila entera), así caen juntas.
    const target = el.closest<HTMLElement>("[data-fall-group]") ?? el;
    const rect = target.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
      inView = true;
      maybeStart();
    } else {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            inView = true;
            maybeStart();
            io?.disconnect();
          }
        },
        { rootMargin: "0px 0px -10% 0px" },
      );
      io.observe(target);
    }

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(completeTimer);
      io?.disconnect();
      img.removeEventListener("load", onLoad);
    };
  }, [delay]);

  return (
    <Link href={href} className="clip-card group block">
      <figure ref={figRef} className="clip-figure">
        {/* <img> nativo a propósito: la "caída" clip-path está afinada sobre
            .clip-figure img en globals.css y el wrapper de next/image pelearía
            con ese layout. Migrar recién con las fotos reales. Ver audit. */}
        {/* Rendimiento: sigue siendo <img> nativo pero servido por el optimizador
            de next/image (AVIF/WebP al ancho de la card, no la foto cruda de
            1280px). Eager (la caída espera a que cargue) pero con prioridad baja
            para no competir con el hero. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          {...getImageProps({
            src: img,
            alt: "",
            width: 800,
            height: 1100, // .clip-figure es 8/11
            sizes: "(max-width: 639px) 80vw, (max-width: 767px) 46vw, 33vw",
            loading: "eager",
          }).props}
          alt=""
          fetchPriority="low"
          style={undefined}
        />
        <div className="clip-overlay" />
        <div className="clip-content">
          <span className="clip-index">{index}</span>
          <h3 className="clip-title">{titulo}</h3>
          <p className="clip-desc">{desc}</p>
          <span className="clip-cta">
            Ver colección
            <span aria-hidden="true">↗</span>
          </span>
        </div>
      </figure>
    </Link>
  );
}
