"use client";

import { useState } from "react";
import Image from "next/image";
import type { ImagenProducto } from "@/modules/catalog/types";

/** Galería de la ficha: foto grande + miniaturas (teclado y touch). */
export function Galeria({ imagenes, nombre }: { imagenes: readonly ImagenProducto[]; nombre: string }) {
  const [activa, setActiva] = useState(0);
  const actual = imagenes[activa];

  if (!actual) {
    return (
      <div className="grid aspect-[4/5] place-items-center rounded-[var(--radius-lg)] bg-sand text-[0.75rem] uppercase tracking-[0.16em] text-ink/40">
        Foto en camino
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-sand">
        <Image
          key={actual.url}
          src={actual.url}
          alt={actual.alt || nombre}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {imagenes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]" role="group" aria-label="Fotos del producto">
          {imagenes.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActiva(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === activa ? "true" : undefined}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border-2 transition-colors ${
                i === activa ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
