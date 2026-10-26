"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Foto } from "@/content/galerias";
import { startLenis, stopLenis } from "@/components/motion/SmoothScroll";
import { lockScroll } from "@/lib/scroll-lock";

/**
 * Visor a pantalla completa sobre <dialog> nativo (foco atrapado, Esc cierra).
 * Flechas del teclado y swipe para navegar. En táctil hay además botones
 * anterior/siguiente abajo (al alcance del pulgar). Con el visor abierto se
 * pausa el scroll suave de la página.
 */
export function Lightbox({
  fotos,
  titulo,
  indice,
  onCambiar,
}: {
  fotos: Foto[];
  titulo: string;
  indice: number | null;
  onCambiar: (i: number | null) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const toque = useRef<number | null>(null);
  // <dialog> modal NO bloquea el scroll táctil de la página en iOS → lockScroll.
  const liberarScroll = useRef<(() => void) | null>(null);
  const liberar = () => {
    liberarScroll.current?.();
    liberarScroll.current = null;
    startLenis();
  };
  const abierto = indice !== null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) {
      d.showModal();
      stopLenis();
      if (!liberarScroll.current) liberarScroll.current = lockScroll();
    }
    if (!abierto && d.open) {
      d.close();
      liberar();
    }
  }, [abierto]);

  // Desmontaje con el visor abierto (p. ej. navegación): no dejar la página trabada.
  useEffect(() => () => {
    liberarScroll.current?.();
    liberarScroll.current = null;
  }, []);

  // Cierre por Esc / click afuera: el <dialog> ya se cerró solo → reanudar.
  const alCerrar = () => {
    liberar();
    onCambiar(null);
  };

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onCambiar(((indice ?? 0) + 1) % fotos.length);
      if (e.key === "ArrowLeft") onCambiar(((indice ?? 0) - 1 + fotos.length) % fotos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto, indice, fotos.length, onCambiar]);

  const foto = indice !== null ? fotos[indice] : null;
  const mover = (d: number) => indice !== null && onCambiar((indice + d + fotos.length) % fotos.length);

  return (
    <dialog
      ref={ref}
      aria-label={`Fotos de ${titulo}`}
      onClose={alCerrar}
      onClick={(e) => e.target === e.currentTarget && onCambiar(null)}
      onPointerDown={(e) => (toque.current = e.isPrimary ? e.clientX : null)}
      onPointerCancel={() => (toque.current = null)}
      onPointerUp={(e) => {
        if (toque.current === null) return;
        // Con la foto ampliada (pinch-zoom) el arrastre es para recorrerla, no para cambiar de foto.
        if ((window.visualViewport?.scale ?? 1) > 1.05) {
          toque.current = null;
          return;
        }
        const dx = e.clientX - toque.current;
        toque.current = null;
        if (Math.abs(dx) > 60) mover(dx < 0 ? 1 : -1);
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none overscroll-contain bg-ink/95 p-0 text-bone [touch-action:pan-y_pinch-zoom] backdrop:bg-ink/80 backdrop:backdrop-blur-sm"
    >
      {foto && (
        <div className="flex h-full flex-col pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
          <div className="flex items-center justify-between gap-4 px-5 py-3 md:px-8 md:py-4">
            <p className="min-w-0 truncate text-[0.75rem] uppercase tracking-[0.18em] text-bone/60">
              {titulo} · <span className="tabular-nums text-champagne">{String((indice ?? 0) + 1).padStart(2, "0")}</span>
              <span className="tabular-nums"> / {String(fotos.length).padStart(2, "0")}</span>
            </p>
            <button
              type="button"
              onClick={() => onCambiar(null)}
              aria-label="Cerrar"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-bone/25 text-[1.3rem] leading-none hover:border-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-champagne"
            >
              ×
            </button>
          </div>
          <div className="relative min-h-0 flex-1 px-4 pb-2 md:px-20 md:pb-6">
            <Image
              key={foto.src}
              src={foto.src}
              alt={`${titulo} — foto ${(indice ?? 0) + 1}`}
              fill
              sizes="100vw"
              className={`animate-[sfFade_.5s_ease] object-contain ${foto.placeholder ? "grayscale" : ""}`}
            />
            <button
              type="button"
              onClick={() => mover(-1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-bone/25 bg-ink/40 text-xl hover:border-bone md:grid"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => mover(1)}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-bone/25 bg-ink/40 text-xl hover:border-bone md:grid"
            >
              →
            </button>
          </div>
          {/* Táctil / angosto: navegación abajo, al alcance del pulgar */}
          <div className="flex items-center justify-center gap-6 px-5 pb-4 pt-2 md:hidden">
            <button
              type="button"
              onClick={() => mover(-1)}
              aria-label="Foto anterior"
              className="grid h-12 w-12 place-items-center rounded-full border border-bone/25 text-xl active:border-bone"
            >
              ←
            </button>
            <span className="text-[0.7rem] uppercase tracking-[0.18em] text-bone/45">Deslizá</span>
            <button
              type="button"
              onClick={() => mover(1)}
              aria-label="Foto siguiente"
              className="grid h-12 w-12 place-items-center rounded-full border border-bone/25 text-xl active:border-bone"
            >
              →
            </button>
          </div>
        </div>
      )}
      <style>{`@keyframes sfFade{from{opacity:0;transform:scale(.985)}to{opacity:1;transform:none}}`}</style>
    </dialog>
  );
}
