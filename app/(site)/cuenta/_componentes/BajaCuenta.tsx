"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { borrarMiCuenta, type EstadoBaja } from "@/modules/cuenta/actions";

/** Baja de la cuenta en dos pasos: abrir el panel y escribir BORRAR. */
export function BajaCuenta() {
  const [abierto, setAbierto] = useState(false);
  const [estado, accion, pendiente] = useActionState<EstadoBaja, FormData>(borrarMiCuenta, null);
  const uid = useId();
  const campoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (abierto) campoRef.current?.focus();
  }, [abierto]);

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-expanded={false}
        aria-controls={`${uid}-panel`}
        className="inline-flex min-h-11 items-center text-[length:var(--text-step--1)] font-medium text-bordeaux underline decoration-bordeaux/40 underline-offset-4 hover:decoration-bordeaux"
      >
        Quiero borrar mi cuenta
      </button>
    );
  }
  return (
    <form id={`${uid}-panel`} action={accion} className="rounded-[var(--radius-md)] border border-bordeaux/30 bg-rose-50 p-5 md:p-6">
      <p className="font-medium text-ink">Esto no se puede deshacer.</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-[length:var(--text-step--1)] leading-relaxed text-ink/80">
        <li>Borramos tu perfil, tu dirección y tu acceso con Google o email.</li>
        <li>Tus pedidos quedan en nuestro registro sin tu nombre ni tu teléfono.</li>
        <li>Si pagaste una entrada del Summit, guardamos el comprobante del pago (lo exige la ley) y tu lugar sigue en pie.</li>
        <li>Salís del Club y dejás de recibir mails.</li>
      </ul>
      <label htmlFor={`${uid}-conf`} className="mt-5 block text-[length:var(--text-step--1)] font-medium text-ink">
        Para confirmar, escribí BORRAR
      </label>
      <input
        ref={campoRef}
        id={`${uid}-conf`}
        name="confirmacion"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        aria-invalid={estado && !estado.ok ? true : undefined}
        aria-describedby={estado && !estado.ok ? `${uid}-err` : undefined}
        className="mt-2 w-full max-w-xs rounded-none border-b border-ink/30 bg-transparent pb-2 text-[max(16px,var(--text-step-0))] uppercase tracking-[0.12em] text-ink focus:border-ink focus:outline-none"
      />
      {estado && !estado.ok && (
        <p id={`${uid}-err`} role="alert" className="mt-2 text-[length:var(--text-step--1)] font-medium text-bordeaux">
          {estado.mensaje}
        </p>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        <button
          type="submit"
          disabled={pendiente}
          className="inline-flex min-h-12 items-center rounded-full bg-bordeaux px-6 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-bone transition-colors hover:bg-ink disabled:opacity-60"
        >
          {pendiente ? "Borrando…" : "Borrar mi cuenta"}
        </button>
        <button type="button" onClick={() => setAbierto(false)} className="min-h-11 text-[length:var(--text-step--1)] text-ink/70 underline-offset-4 hover:text-ink hover:underline">
          Cancelar
        </button>
      </div>
    </form>
  );
}
