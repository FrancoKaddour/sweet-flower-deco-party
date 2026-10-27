"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * P-08: error del panel con la marca. Aparece si la sesión venció, la base
 * tarda en despertar o se cortó la conexión en medio de una acción.
 */
export default function ErrorPanel({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[panel]", error.digest ?? error.message);
  }, [error]);
  const sesion = /autorizado/i.test(error.message);
  return (
    <div role="alert" className="flex flex-col gap-8 py-6">
      <div className="max-w-2xl">
        <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-bordeaux">✧ Algo no salió</p>
        <h1 className="mt-4 text-[length:var(--text-step-4)] font-semibold leading-[0.95] text-ink [font-family:var(--font-logo)] md:text-[length:var(--text-step-5)]">
          {sesion ? "Tu sesión se cerró" : "No pudimos cargar esto"}
        </h1>
        <p className="mt-4 text-[length:var(--text-step-0)] leading-relaxed text-muted">
          {sesion
            ? "Por seguridad, la sesión del panel dura 7 días. Volvé a entrar con tu cuenta de Google y seguí donde estabas."
            : "Revisá tu conexión y probá de nuevo. Si guardaste algo justo antes, fijate si quedó: a veces la base tarda unos segundos en despertar."}
        </p>
        {error.digest && <p className="mt-3 font-mono text-[length:var(--text-step--1)] text-muted">Código: {error.digest}</p>}
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-pill)] bg-ink px-6 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-bone max-sm:w-full"
        >
          Reintentar
        </button>
        <Link
          href="/panel/login"
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-pill)] border border-ink/20 px-6 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-ink max-sm:w-full"
        >
          Ir a ingresar
        </Link>
      </div>
    </div>
  );
}
