"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { archivarRegistro, type TipoRegistro } from "@/modules/ventas/actions";

/** Archivar con confirmación en dos pasos (sin diálogos del navegador). */
export function Archivar({ tipo, id, volverA }: { tipo: TipoRegistro; id: string; volverA?: string }) {
  const [seguro, setSeguro] = useState(false);
  const [pendiente, start] = useTransition();
  const router = useRouter();
  if (!seguro)
    return (
      <button type="button" onClick={() => setSeguro(true)} className="text-[length:var(--text-step--1)] text-muted underline-offset-4 hover:text-bordeaux hover:underline">
        Archivar
      </button>
    );
  return (
    <span className="inline-flex items-center gap-3 text-[length:var(--text-step--1)]">
      <span className="text-muted">¿Seguro?</span>
      <button
        type="button"
        disabled={pendiente}
        onClick={() =>
          start(async () => {
            await archivarRegistro(tipo, id);
            if (volverA) router.push(volverA);
          })
        }
        className="font-medium text-bordeaux hover:underline"
      >
        {pendiente ? "Archivando…" : "Sí, archivar"}
      </button>
      <button type="button" onClick={() => setSeguro(false)} className="text-muted hover:text-ink">
        Cancelar
      </button>
    </span>
  );
}
