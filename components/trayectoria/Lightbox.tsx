"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Foto } from "@/content/galerias";

/**
 * Visor a pantalla completa sobre <dialog> nativo (foco atrapado, Esc cierra).
 * Flechas del teclado y swipe para navegar.
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
  const abierto = indice !== null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

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
      onClose={() => onCambiar(null)}
      onClick={(e) => e.target === e.currentTarget && onCambiar(null)}
      onPointerDown={(e) => (toque.current = e.clientX)}
      onPointerUp={(e) => {
        if (toque.current === null) return;
        const dx = e.clientX - toque.current;
        toque.current = null;
        if (Math.abs(dx) > 60) mover(dx < 0 ? 1 : -1);
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-bone backdrop:bg-ink/80 backdrop:backdrop-blur-sm"
    >
      {foto && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-5 py-4 md:px-8">
            <p className="text-[0.75rem] uppercase tracking-[0.18em] text-bone/60">
              {titulo} · <span className="tabular-nums text-champagne">{String((indice ?? 0) + 1).padStart(2, "0")}</span>
              <span className="tabular-nums"> / {String(fotos.length).padStart(2, "0")}</span>
            </p>
            <button
              type="button"
              onClick={() => onCambiar(null)}
              aria-label="Cerrar"
              className="grid h-11 w-11 place-items-center rounded-full border border-bone/25 text-[1.3rem] leading-none hover:border-bone"
            >
              ×
            </button>
          </div>
          <div className="relative min-h-0 flex-1 px-4 pb-4 md:px-20">
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
        </div>
      )}
      <style>{`@keyframes sfFade{from{opacity:0;transform:scale(.985)}to{opacity:1;transform:none}}`}</style>
    </dialog>
  );
}
