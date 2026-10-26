"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ImagenProducto } from "@/modules/catalog/types";

/**
 * Galería de la ficha: pista de fotos con scroll-snap (swipe nativo en
 * táctil), miniaturas sincronizadas, flechas en puntero fino y teclado.
 * En celular la foto se limita en alto para que precio y CTA se vean sin
 * scroll excesivo; en tablet/desktop se limita al alto de la ventana (la
 * columna es sticky).
 */
const marco =
  "relative aspect-square max-h-[52svh] w-full overflow-hidden rounded-[var(--radius-lg)] bg-sand sm:aspect-[4/5] sm:max-h-[64svh] md:max-h-[calc(100svh-9rem)] [@media(max-height:540px)_and_(orientation:landscape)]:max-h-[calc(100svh-6rem)]";

export function Galeria({ imagenes, nombre }: { imagenes: readonly ImagenProducto[]; nombre: string }) {
  const [activa, setActiva] = useState(0);
  const pista = useRef<HTMLDivElement>(null);
  const varias = imagenes.length > 1;

  // Sincroniza la miniatura activa con el swipe/scroll de la pista.
  useEffect(() => {
    const el = pista.current;
    if (!el || !varias) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
        setActiva(Math.min(imagenes.length - 1, Math.max(0, i)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, [varias, imagenes.length]);

  const ir = useCallback(
    (i: number) => {
      const el = pista.current;
      const n = (i + imagenes.length) % imagenes.length;
      setActiva(n);
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: n * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
    },
    [imagenes.length],
  );

  if (imagenes.length === 0) {
    return (
      <div className={`${marco} grid place-items-center text-[0.75rem] uppercase tracking-[0.16em] text-ink/40`}>
        Foto en camino
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className={marco}>
        <div
          ref={pista}
          className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-roledescription={varias ? "carrusel" : undefined}
          aria-label={varias ? `Fotos de ${nombre}` : undefined}
          tabIndex={varias ? 0 : undefined}
          onKeyDown={(e) => {
            if (!varias) return;
            if (e.key === "ArrowRight") {
              e.preventDefault();
              ir(activa + 1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              ir(activa - 1);
            }
          }}
        >
          {imagenes.map((img, i) => (
            <div
              key={img.url}
              className="relative h-full w-full shrink-0 snap-center snap-always"
              aria-hidden={varias && i !== activa ? true : undefined}
            >
              <Image
                src={img.url}
                alt={img.alt || nombre}
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {varias && (
          <>
            {/* Contador (útil en táctil, donde no hay flechas) */}
            <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-ink/70 px-3 py-1 text-[0.72rem] tabular-nums tracking-[0.08em] text-bone backdrop-blur-sm">
              {activa + 1} / {imagenes.length}
            </span>
            {/* Flechas solo con puntero fino (en táctil se desliza) */}
            <button
              type="button"
              onClick={() => ir(activa - 1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-bone/85 text-[1.2rem] text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-bone [@media(hover:hover)_and_(pointer:fine)]:grid"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => ir(activa + 1)}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-bone/85 text-[1.2rem] text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-bone [@media(hover:hover)_and_(pointer:fine)]:grid"
            >
              ›
            </button>
          </>
        )}
      </div>

      {varias && (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Miniaturas">
          {imagenes.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => ir(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === activa ? "true" : undefined}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border-2 transition-[opacity,border-color] md:h-24 md:w-[4.8rem] ${
                i === activa ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
