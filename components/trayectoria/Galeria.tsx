"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Foto } from "@/content/galerias";
import { Lightbox } from "./Lightbox";

/** Reparte las fotos en N columnas equilibrando la altura (masonry estable). */
function columnas(fotos: Foto[], n: number) {
  const cols: { foto: Foto; i: number }[][] = Array.from({ length: n }, () => []);
  const alto = new Array(n).fill(0);
  fotos.forEach((foto, i) => {
    const c = alto.indexOf(Math.min(...alto));
    cols[c].push({ foto, i });
    alto[c] += foto.h / foto.w;
  });
  return cols;
}

/**
 * Galería editorial: masonry de 3 columnas (2 en mobile) con parallax por
 * columna en sentidos opuestos y revelado con máscara al entrar. Click → visor
 * a pantalla completa. Respeta prefers-reduced-motion.
 */
export function Galeria({ fotos, titulo }: { fotos: Foto[]; titulo: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [abierta, setAbierta] = useState<number | null>(null);
  const tres = useMemo(() => columnas(fotos, 3), [fotos]);
  const dos = useMemo(() => columnas(fotos, 2), [fotos]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // Revelado: cada foto sube desde una máscara (clip-path) al entrar.
      el.querySelectorAll<HTMLElement>("[data-foto]").forEach((f) => {
        gsap.fromTo(
          f,
          { clipPath: "inset(18% 0% 0% 0%)", y: 60, autoAlpha: 0.001 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: f, start: "top 92%", once: true },
          },
        );
      });
      // Parallax por columna (solo desktop).
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        el.querySelectorAll<HTMLElement>("[data-col]").forEach((c) => {
          const v = Number(c.dataset.col);
          gsap.fromTo(
            c,
            { y: v * 80 },
            { y: v * -80, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [fotos.length] },
  );

  const tarjeta = ({ foto, i }: { foto: Foto; i: number }, sizes: string) => (
    <button
      key={i}
      type="button"
      data-foto
      onClick={() => setAbierta(i)}
      aria-label={`Ver foto ${i + 1} de ${fotos.length} en grande`}
      className="group relative block w-full overflow-hidden rounded-[var(--radius-md)] bg-ink/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
      style={{ aspectRatio: `${foto.w} / ${foto.h}` }}
    >
      <Image
        src={foto.src}
        alt={`${titulo} — foto ${i + 1}`}
        fill
        sizes={sizes}
        className={`object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06] ${foto.placeholder ? "grayscale" : ""}`}
      />
      {foto.placeholder && <div className="pointer-events-none absolute inset-0 bg-bordeaux/25 mix-blend-multiply" />}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-4 text-[0.7rem] uppercase tracking-[0.16em] text-bone opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
        <span>Ver ↗</span>
      </span>
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </button>
  );

  return (
    <div ref={root}>
      {/* Desktop: 3 columnas con parallax (la del medio va al revés) */}
      <div className="hidden grid-cols-3 items-start gap-6 md:grid lg:gap-8">
        {tres.map((col, c) => (
          <div key={c} data-col={c === 1 ? -1 : 1} className={`flex flex-col gap-6 lg:gap-8 ${c === 1 ? "mt-24" : ""}`}>
            {col.map((x) => tarjeta(x, "(max-width: 1400px) 33vw, 460px"))}
          </div>
        ))}
      </div>
      {/* Mobile: 2 columnas */}
      <div className="grid grid-cols-2 items-start gap-3 md:hidden">
        {dos.map((col, c) => (
          <div key={c} className={`flex flex-col gap-3 ${c === 1 ? "mt-10" : ""}`}>
            {col.map((x) => tarjeta(x, "50vw"))}
          </div>
        ))}
      </div>

      <Lightbox fotos={fotos} titulo={titulo} indice={abierta} onCambiar={setAbierta} />
    </div>
  );
}
