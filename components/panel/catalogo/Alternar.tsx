"use client";

import { useOptimistic } from "react";
import { alternarProducto } from "@/modules/catalog/actions";
import { useAccion } from "@/components/panel/Toast";

const TEXTO = {
  visible: (v: boolean, n: string) => (v ? `Publicaste "${n}"` : `Ocultaste "${n}"`),
  destacado: (v: boolean, n: string) => (v ? `"${n}" ahora es destacado` : `"${n}" dejó de ser destacado`),
};

/** Interruptor inline de la tabla (visible / destacado): optimista, con aviso y "Deshacer" (P-18). */
export function Alternar({ id, campo, valor, label, nombre }: { id: string; campo: "visible" | "destacado"; valor: boolean; label: string; nombre?: string }) {
  const [opt, setOpt] = useOptimistic(valor);
  const [, correr] = useAccion();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={opt}
      aria-label={`${label}: ${opt ? "sí" : "no"}`}
      onClick={() => {
        const nuevo = !opt;
        correr(
          async () => {
            setOpt(nuevo);
            return alternarProducto(id, campo, nuevo);
          },
          {
            ok: (r) => TEXTO[campo](nuevo, (r as { mensaje?: string })?.mensaje || nombre || "el producto"),
            deshacer: () => alternarProducto(id, campo, !nuevo),
          },
        );
      }}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${opt ? "bg-ink" : "bg-line"}`}
    >
      <span className={`inline-block size-5 rounded-full bg-cloud shadow transition-transform ${opt ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}
