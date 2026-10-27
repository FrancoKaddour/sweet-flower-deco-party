"use client";

import { useState } from "react";
import { aplicarAumento, deshacerAumento, previsualizarAumento, type CambioPrecio } from "@/modules/catalog/actions";
import { formatARS } from "@/modules/catalog/types";
import { useAccion, useToast } from "@/components/panel/Toast";
import { PanelButton } from "@/components/panel/PanelButton";
import { inputCls } from "./campos";

/**
 * "Precio por inflación en 1 minuto" (P-17 / idea wow 3): categoría + %,
 * vista previa con antes → después redondeado a $500, aplicar y deshacer.
 * Queda en Actividad.
 */
export function AumentoPrecios({ categorias }: { categorias: { id: string; nombre: string }[] }) {
  const [cat, setCat] = useState("");
  const [pct, setPct] = useState("10");
  const [cambios, setCambios] = useState<CambioPrecio[] | null>(null);
  const [pendiente, correr] = useAccion();
  const { avisar } = useToast();
  const n = Number(pct.replace(",", "."));
  const nombreCat = categorias.find((c) => c.id === cat)?.nombre ?? "";

  const ver = () =>
    correr(async () => {
      const r = await previsualizarAumento(cat, n);
      if (r.ok) setCambios(r.cambios);
      return r.ok ? { ok: true } : r;
    });

  const aplicar = () =>
    correr(async () => {
      const r = await aplicarAumento(cat, n);
      if (!r.ok) return r;
      setCambios(null);
      const auditId = r.auditId;
      avisar({ tipo: "ok", texto: r.mensaje, deshacer: auditId ? () => deshacerAumento(auditId) : undefined });
      return { ok: true };
    });

  return (
    <details className="group rounded-[var(--radius-lg)] border border-line bg-cloud">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block font-medium text-ink">Actualizar precios de una categoría</span>
          <span className="block text-[length:var(--text-step--1)] text-muted">Subí un porcentaje a todos los productos con precio, redondeado a $ 500.</span>
        </span>
        <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="flex flex-col gap-5 border-t border-line px-5 py-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_8rem_auto]">
          <label className="flex flex-col gap-1.5">
            <span className="text-[length:var(--text-step--1)] text-muted">Categoría</span>
            <select value={cat} onChange={(e) => (setCat(e.target.value), setCambios(null))} className={inputCls}>
              <option value="">Elegí una</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[length:var(--text-step--1)] text-muted">Porcentaje</span>
            <span className="relative">
              <input value={pct} onChange={(e) => (setPct(e.target.value), setCambios(null))} inputMode="decimal" className={`${inputCls} pr-8`} />
              <span aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">%</span>
            </span>
          </label>
          <div className="flex items-end">
            <PanelButton variant="outline" disabled={!cat || !n || pendiente} onClick={ver} className="w-full">
              Ver cómo queda
            </PanelButton>
          </div>
        </div>

        {cambios && (
          <div className="flex flex-col gap-4">
            {cambios.length === 0 ? (
              <p className="text-muted">No hay productos con precio en {nombreCat}.</p>
            ) : (
              <>
                <ul className="max-h-80 divide-y divide-line overflow-y-auto rounded-[var(--radius-md)] border border-line">
                  {cambios.map((c) => (
                    <li key={c.id} className="flex items-baseline justify-between gap-4 px-4 py-2.5 text-[length:var(--text-step--1)]">
                      <span className="min-w-0 truncate text-ink">
                        {c.nombre}
                        {c.variantes > 0 && <span className="text-muted"> · {c.variantes} variantes</span>}
                      </span>
                      <span className="shrink-0 tabular-nums">
                        <span className="text-muted line-through">{formatARS(c.antes)}</span>{" "}
                        <span className="font-medium text-ink">{formatARS(c.despues)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-3">
                  <PanelButton disabled={pendiente} onClick={aplicar}>
                    {pendiente ? "Aplicando…" : `Aplicar a ${cambios.length} productos`}
                  </PanelButton>
                  <span className="text-[length:var(--text-step--1)] text-muted">Al aplicar aparece un aviso con “Deshacer”. Queda anotado en Actividad.</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </details>
  );
}

