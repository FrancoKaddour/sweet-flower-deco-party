"use client";

import { useRef, useState } from "react";
import { alternarProducto, cambiarPrecio, moverProducto, restaurarProducto } from "@/modules/catalog/actions";
import { parsePrecio } from "@/modules/catalog/schemas";
import { formatARS } from "@/modules/catalog/types";
import { useAccion } from "@/components/panel/Toast";

/** Precio editable en la tabla (P-17): Enter o salir del campo guarda; Escape vuelve. */
export function PrecioInline({ id, nombre, precio, bloqueado }: { id: string; nombre: string; precio: number | null; bloqueado?: boolean }) {
  const [valor, setValor] = useState(precio == null ? "" : String(precio));
  const [guardado, setGuardado] = useState(precio);
  const [pendiente, correr] = useAccion();
  const ref = useRef<HTMLInputElement>(null);
  const p = parsePrecio(valor);
  const cambio = p.ok && p.valor !== guardado;

  if (bloqueado)
    return (
      <span className="tabular-nums" title="Tiene variantes con precio: se edita en la ficha">
        {precio != null ? `Desde ${formatARS(precio)}` : "A consultar"}
      </span>
    );

  const guardar = () => {
    if (!cambio) return;
    const anterior = guardado;
    correr(() => cambiarPrecio(id, valor), {
      ok: () => {
        setGuardado(p.ok ? p.valor : anterior);
        return `${nombre}: ${p.ok && p.valor != null ? formatARS(p.valor) : "a consultar"}`;
      },
      deshacer: async () => {
        await cambiarPrecio(id, anterior == null ? "" : String(anterior));
        setValor(anterior == null ? "" : String(anterior));
        setGuardado(anterior);
      },
    });
  };

  return (
    <span className="inline-flex flex-col items-end gap-0.5">
      <label className="sr-only" htmlFor={`precio-${id}`}>
        Precio de {nombre}
      </label>
      <input
        ref={ref}
        id={`precio-${id}`}
        value={valor}
        inputMode="numeric"
        placeholder="A consultar"
        disabled={pendiente}
        aria-invalid={!p.ok}
        onChange={(e) => setValor(e.target.value)}
        onBlur={guardar}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            ref.current?.blur();
          }
          if (e.key === "Escape") setValor(guardado == null ? "" : String(guardado));
        }}
        className={`min-h-11 w-32 rounded-[var(--radius-sm)] border bg-transparent px-2 text-right tabular-nums text-ink transition-colors focus:bg-cloud focus:outline-none md:min-h-9 ${
          !p.ok ? "border-bordeaux" : cambio ? "border-champagne" : "border-transparent hover:border-line focus:border-ink/40"
        }`}
      />
      {!p.ok ? (
        <span className="text-[0.7rem] text-bordeaux">Sin centavos</span>
      ) : cambio ? (
        <span className="text-[0.7rem] text-muted">Enter para guardar · {p.valor != null ? formatARS(p.valor) : "a consultar"}</span>
      ) : null}
    </span>
  );
}

/** ↑↓ dentro de la categoría (P-12). */
export function OrdenProducto({ id, nombre, primero, ultimo }: { id: string; nombre: string; primero: boolean; ultimo: boolean }) {
  const [pendiente, correr] = useAccion();
  const cls = "grid size-11 place-items-center rounded-[var(--radius-sm)] text-ink hover:bg-bone disabled:opacity-25 md:size-9";
  return (
    <span className="inline-flex">
      <button type="button" disabled={primero || pendiente} onClick={() => correr(() => moverProducto(id, -1))} aria-label={`Subir ${nombre}`} className={cls}>
        ↑
      </button>
      <button type="button" disabled={ultimo || pendiente} onClick={() => correr(() => moverProducto(id, 1))} aria-label={`Bajar ${nombre}`} className={cls}>
        ↓
      </button>
    </span>
  );
}

export function RestaurarProducto({ id }: { id: string }) {
  const [pendiente, correr] = useAccion();
  return (
    <button
      type="button"
      disabled={pendiente}
      onClick={() => correr(() => restaurarProducto(id))}
      className="inline-flex min-h-11 items-center rounded-[var(--radius-pill)] border border-ink/20 px-5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-ink disabled:opacity-50"
    >
      {pendiente ? "Restaurando…" : "Restaurar"}
    </button>
  );
}

/** P-16: CTA "Publicar" cuando el producto está oculto y ya tiene foto. */
export function PublicarProducto({ id, nombre }: { id: string; nombre: string }) {
  const [pendiente, correr] = useAccion();
  return (
    <button
      type="button"
      disabled={pendiente}
      onClick={() => correr(() => alternarProducto(id, "visible", true), { ok: `Publicaste "${nombre}". Ya se ve en el sitio.`, deshacer: () => alternarProducto(id, "visible", false) })}
      className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-pill)] bg-ink px-6 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-bone disabled:opacity-50 max-sm:w-full"
    >
      {pendiente ? "Publicando…" : "Publicar"}
    </button>
  );
}
