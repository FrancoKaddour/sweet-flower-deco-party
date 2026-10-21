"use client";

import { useRef, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Paginacion } from "@/components/ui/Paginacion";
import type { Producto } from "@/modules/catalog/types";

/** Grilla de una categoría paginada en el navegador (24 por página). */
const POR_PAGINA = 24;

export function GrillaPaginada({ productos }: { productos: Producto[] }) {
  const [pagina, setPagina] = useState(1);
  const ancla = useRef<HTMLDivElement>(null);
  const total = Math.ceil(productos.length / POR_PAGINA);
  const visibles = productos.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const ir = (n: number) => {
    setPagina(n);
    ancla.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={ancla} className="scroll-mt-28">
      <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {visibles.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </div>
      {total > 1 && (
        <div className="mt-16 flex flex-col items-center gap-3">
          <Paginacion pagina={pagina} total={total} onChange={ir} />
          <p className="text-[length:var(--text-step--1)] text-ink/50">
            {(pagina - 1) * POR_PAGINA + 1}–{Math.min(pagina * POR_PAGINA, productos.length)} de {productos.length} productos
          </p>
        </div>
      )}
    </div>
  );
}
