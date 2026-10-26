"use client";

import { useOptimistic, useTransition } from "react";
import { alternarProducto } from "@/modules/catalog/actions";

/** Interruptor inline de la tabla (visible / destacado) con respuesta optimista. */
export function Alternar({ id, campo, valor, label }: { id: string; campo: "visible" | "destacado"; valor: boolean; label: string }) {
  const [opt, setOpt] = useOptimistic(valor);
  const [, start] = useTransition();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={opt}
      aria-label={`${label}: ${opt ? "sí" : "no"}`}
      onClick={() =>
        start(async () => {
          setOpt(!opt);
          await alternarProducto(id, campo, !opt);
        })
      }
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${opt ? "bg-ink" : "bg-line"}`}
    >
      <span className={`inline-block size-5 rounded-full bg-cloud shadow transition-transform ${opt ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}
