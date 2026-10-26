"use client";

import { useOptimistic, useTransition } from "react";
import { cambiarEstado, type TipoRegistro } from "@/modules/ventas/actions";
import type { Tono } from "@/modules/ventas/estados";

const TONO: Record<Tono, string> = {
  neutral: "border-line bg-bone text-muted",
  success: "border-botanical/30 bg-botanical/10 text-botanical",
  warning: "border-champagne/50 bg-champagne/15 text-ink",
  danger: "border-bordeaux/30 bg-bordeaux/10 text-bordeaux",
  info: "border-ink/15 bg-ink/5 text-ink",
};

/** Selector de estado inline (pill) con respuesta optimista. */
export function EstadoSelect({
  tipo,
  id,
  valor,
  opciones,
  etiqueta,
}: {
  tipo: TipoRegistro;
  id: string;
  valor: string;
  opciones: readonly { v: string; l: string; tono: Tono }[];
  etiqueta: string;
}) {
  const [opt, setOpt] = useOptimistic(valor);
  const [pendiente, start] = useTransition();
  const actual = opciones.find((o) => o.v === opt) ?? opciones[0];
  return (
    <select
      aria-label={etiqueta}
      value={opt}
      disabled={pendiente}
      onChange={(e) => {
        const nuevo = e.target.value;
        start(async () => {
          setOpt(nuevo);
          await cambiarEstado(tipo, id, nuevo);
        });
      }}
      // < md: 44px de alto y 16px de texto (iOS hace zoom en selects < 16px); en
      // desktop vuelve a la pill compacta de la tabla.
      className={`min-h-11 max-w-full cursor-pointer appearance-none rounded-[var(--radius-pill)] border py-1.5 pl-4 pr-8 text-[length:var(--text-step-0)] font-medium leading-none md:min-h-9 md:pl-3 md:pr-7 md:text-[length:var(--text-step--1)] transition-opacity disabled:opacity-60 bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23777' stroke-width='1.5'/%3E%3C/svg%3E")] bg-[length:10px_6px] bg-[right_0.6rem_center] bg-no-repeat ${TONO[actual.tono]}`}
    >
      {opciones.map((o) => (
        <option key={o.v} value={o.v}>
          {o.l}
        </option>
      ))}
    </select>
  );
}
