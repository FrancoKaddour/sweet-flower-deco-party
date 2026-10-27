"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { agregarImagen, borrarImagen, moverImagen } from "@/modules/catalog/actions";
import { useAccion, useToast } from "@/components/panel/Toast";
import { subirFoto } from "@/components/panel/subirImagen";

type Img = { id: string; url: string; alt: string };

/**
 * Fotos del producto: subir varias (se achican en el celular a 2400 px WEBP y
 * van directo a Vercel Blob, con progreso), ordenar y borrar. La primera es la portada.
 */
export function ImagenesProducto({ productId, nombre, imagenes }: { productId: string; nombre: string; imagenes: Img[] }) {
  const input = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState<{ i: number; n: number; pct: number } | null>(null);
  const [pendiente, correr] = useAccion();
  const { avisar } = useToast();
  const [borrando, setBorrando] = useState<string | null>(null);

  const subir = async (files: FileList | null) => {
    if (!files?.length) return;
    const lista = Array.from(files).filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    let ok = 0;
    for (const [i, f] of lista.entries()) {
      setSubiendo({ i: i + 1, n: lista.length, pct: 0 });
      try {
        const url = await subirFoto(`productos/${productId}`, f, (pct) => setSubiendo({ i: i + 1, n: lista.length, pct }));
        await agregarImagen(productId, url, nombre);
        ok++;
      } catch (e) {
        avisar({ tipo: "error", texto: (e as Error).message || `No se pudo subir "${f.name}".` });
      }
    }
    setSubiendo(null);
    if (input.current) input.current.value = "";
    if (ok) avisar({ tipo: "ok", texto: ok === 1 ? "Foto subida." : `${ok} fotos subidas.` });
  };

  const total = subiendo ? Math.round(((subiendo.i - 1) * 100 + subiendo.pct) / subiendo.n) : 0;

  return (
    <div className="flex flex-col gap-4">
      {imagenes.length === 0 ? (
        <p className="rounded-[var(--radius-md)] border border-dashed border-line px-4 py-8 text-center text-muted">
          Todavía no tiene fotos. La primera que subas va a ser la portada.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {imagenes.map((img, i) => (
            <li key={img.id} className="group relative overflow-hidden rounded-[var(--radius-md)] border border-line bg-cloud">
              <div className="relative aspect-[4/5] bg-sand">
                <Image src={img.url} alt={img.alt || nombre} fill sizes="(max-width: 640px) 50vw, 240px" className="object-cover" />
                {i === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-ink px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.12em] text-bone">
                    Portada
                  </span>
                )}
              </div>
              {borrando === img.id ? (
                <div className="flex flex-wrap items-center justify-between gap-1 px-2 py-1 text-[0.75rem]">
                  <span className="text-ink">¿Borrarla?</span>
                  <span className="flex">
                    <button type="button" disabled={pendiente} onClick={() => correr(() => borrarImagen(img.id))} className="inline-flex min-h-11 items-center px-2 font-medium text-bordeaux">
                      Sí
                    </button>
                    <button type="button" onClick={() => setBorrando(null)} className="inline-flex min-h-11 items-center px-2 text-muted">
                      No
                    </button>
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-1 px-1 py-0.5">
                  <div className="flex">
                    <button
                      type="button"
                      disabled={i === 0 || pendiente}
                      onClick={() => correr(() => moverImagen(img.id, -1))}
                      className="grid h-11 w-10 place-items-center rounded-[var(--radius-sm)] text-ink hover:bg-bone disabled:opacity-30"
                      aria-label={i === 1 ? "Usar como portada" : "Mover a la izquierda"}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      disabled={i === imagenes.length - 1 || pendiente}
                      onClick={() => correr(() => moverImagen(img.id, 1))}
                      className="grid h-11 w-10 place-items-center rounded-[var(--radius-sm)] text-ink hover:bg-bone disabled:opacity-30"
                      aria-label="Mover a la derecha"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="button"
                    disabled={pendiente}
                    onClick={() => setBorrando(img.id)}
                    className="inline-flex min-h-11 items-center px-2 text-[0.7rem] uppercase tracking-[0.12em] text-bordeaux disabled:opacity-30"
                  >
                    Borrar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <label className="relative inline-flex min-h-11 cursor-pointer items-center justify-center overflow-hidden rounded-[var(--radius-pill)] border border-ink/20 px-5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink max-sm:w-full text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-ink hover:border-ink/40">
          {subiendo && <span aria-hidden="true" className="absolute inset-y-0 left-0 bg-sand transition-[width]" style={{ width: `${total}%` }} />}
          <span className="relative">{subiendo ? `Subiendo ${subiendo.i} de ${subiendo.n} · ${subiendo.pct}%` : "Subir fotos"}</span>
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/heic"
            multiple
            className="sr-only"
            disabled={Boolean(subiendo)}
            onChange={(e) => subir(e.target.files)}
          />
        </label>
        <span className="text-[length:var(--text-step--1)] text-muted">Se achican solas antes de subir · ideal vertical 4:5</span>
        {subiendo && (
          <span role="status" className="sr-only">
            Subiendo foto {subiendo.i} de {subiendo.n}
          </span>
        )}
      </div>
    </div>
  );
}
