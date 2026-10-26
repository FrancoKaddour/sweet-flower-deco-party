"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { agregarImagen, borrarImagen, moverImagen } from "@/modules/catalog/actions";

type Img = { id: string; url: string; alt: string };

/**
 * Fotos del producto: subir varias (directo a Vercel Blob), ordenar y borrar.
 * La primera es la portada. Las fotos importadas del catálogo de WhatsApp
 * también se pueden reordenar o reemplazar.
 */
export function ImagenesProducto({ productId, nombre, imagenes }: { productId: string; nombre: string; imagenes: Img[] }) {
  const input = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, start] = useTransition();

  const subir = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    const lista = Array.from(files);
    for (const [i, f] of lista.entries()) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > 15 * 1024 * 1024) {
        setError(`"${f.name}" pesa más de 15 MB.`);
        continue;
      }
      setSubiendo(`Subiendo ${i + 1} de ${lista.length}…`);
      try {
        const ext = f.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const blob = await upload(`productos/${productId}.${ext}`, f, {
          access: "public",
          handleUploadUrl: "/api/panel/upload",
        });
        await agregarImagen(productId, blob.url, nombre);
      } catch (e) {
        setError((e as Error).message || "No se pudo subir la foto.");
      }
    }
    setSubiendo(null);
    if (input.current) input.current.value = "";
  };

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
              <div className="flex items-center justify-between gap-1 px-1 py-0.5">
                <div className="flex">
                  <button
                    type="button"
                    disabled={i === 0 || pendiente}
                    onClick={() => start(() => moverImagen(img.id, -1))}
                    className="grid h-11 w-10 place-items-center rounded-[var(--radius-sm)] text-ink hover:bg-bone disabled:opacity-30"
                    aria-label="Mover a la izquierda"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    disabled={i === imagenes.length - 1 || pendiente}
                    onClick={() => start(() => moverImagen(img.id, 1))}
                    className="grid h-11 w-10 place-items-center rounded-[var(--radius-sm)] text-ink hover:bg-bone disabled:opacity-30"
                    aria-label="Mover a la derecha"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  disabled={pendiente}
                  onClick={() => {
                    if (window.confirm("¿Borrar esta foto?")) start(() => borrarImagen(img.id));
                  }}
                  className="inline-flex min-h-11 items-center px-2 text-[0.7rem] uppercase tracking-[0.12em] text-bordeaux disabled:opacity-30"
                >
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[var(--radius-pill)] border border-ink/20 px-5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink max-sm:w-full text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-ink hover:border-ink/40">
          {subiendo ?? "Subir fotos"}
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="sr-only"
            disabled={Boolean(subiendo)}
            onChange={(e) => subir(e.target.files)}
          />
        </label>
        <span className="text-[length:var(--text-step--1)] text-muted">JPG, PNG o WEBP · hasta 15 MB · ideal vertical 4:5</span>
      </div>
      {error && (
        <p role="alert" className="text-[length:var(--text-step--1)] text-bordeaux">
          {error}
        </p>
      )}
    </div>
  );
}
