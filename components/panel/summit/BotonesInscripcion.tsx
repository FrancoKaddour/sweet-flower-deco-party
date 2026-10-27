"use client";

import { reenviarEntradaPanel } from "@/modules/ventas/actions";
import { useAccion } from "@/components/panel/Toast";

/** "Reenviar entrada" (P-05): manda de nuevo el mail con la entrada. */
export function ReenviarEntrada({ id, email }: { id: string; email: string | null }) {
  const [pendiente, correr] = useAccion();
  return (
    <button
      type="button"
      disabled={pendiente || !email}
      onClick={() => correr(() => reenviarEntradaPanel(id))}
      title={email ? `Se manda a ${email}` : "No tiene email"}
      className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-pill)] border border-ink/20 px-5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-ink hover:border-ink/40 disabled:opacity-50"
    >
      {pendiente ? "Enviando…" : "Reenviar entrada"}
    </button>
  );
}
