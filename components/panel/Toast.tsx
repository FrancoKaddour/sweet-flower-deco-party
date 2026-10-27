"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";

/**
 * Avisos del panel (P-08 / P-18). Una sola región viva, montada en el shell:
 * - éxito → role="status" (se anuncia sin interrumpir)
 * - error → role="alert"
 * Opcional: botón "Deshacer" (5 s). Se pausa con el puntero o el foco encima.
 *
 * `useAccion()` envuelve una Server Action: transición + try/catch + aviso.
 * Si la action devuelve `{ ok: false, mensaje }`, se muestra como error.
 */

type Aviso = {
  id: number;
  tipo: "ok" | "error";
  texto: string;
  deshacer?: () => void | Promise<unknown>;
};

type Ctx = { avisar: (a: Omit<Aviso, "id">) => void };

const ToastCtx = createContext<Ctx>({ avisar: () => {} });

export const useToast = () => useContext(ToastCtx);

const DURACION = 5000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const n = useRef(0);
  const avisar = useCallback((a: Omit<Aviso, "id">) => {
    const id = ++n.current;
    setAvisos((xs) => [...xs.slice(-2), { ...a, id }]);
  }, []);
  const cerrar = useCallback((id: number) => setAvisos((xs) => xs.filter((x) => x.id !== id)), []);

  return (
    <ToastCtx.Provider value={{ avisar }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:left-[18rem]">
        {avisos.map((a) => (
          <Item key={a.id} aviso={a} onCerrar={() => cerrar(a.id)} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function Item({ aviso, onCerrar }: { aviso: Aviso; onCerrar: () => void }) {
  const [pausa, setPausa] = useState(false);
  const [deshaciendo, setDeshaciendo] = useState(false);
  useEffect(() => {
    if (pausa) return;
    const t = setTimeout(onCerrar, aviso.tipo === "error" ? DURACION * 2 : DURACION);
    return () => clearTimeout(t);
  }, [pausa, onCerrar, aviso.tipo]);

  return (
    <div
      role={aviso.tipo === "error" ? "alert" : "status"}
      onPointerEnter={() => setPausa(true)}
      onPointerLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={() => setPausa(false)}
      className={`pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-[length:var(--text-step--1)] shadow-[0_12px_32px_-12px_rgb(20_17_15/0.45)] ${
        aviso.tipo === "error" ? "bg-bordeaux text-bone" : "bg-ink text-bone"
      }`}
    >
      <span aria-hidden="true" className="text-champagne">{aviso.tipo === "error" ? "!" : "✧"}</span>
      <p className="min-w-0 flex-1 leading-snug">{aviso.texto}</p>
      {aviso.deshacer && (
        <button
          type="button"
          disabled={deshaciendo}
          onClick={async () => {
            setDeshaciendo(true);
            try {
              await aviso.deshacer?.();
            } finally {
              onCerrar();
            }
          }}
          className="inline-flex min-h-11 shrink-0 items-center rounded-[var(--radius-pill)] border border-bone/40 px-4 font-medium uppercase tracking-[0.08em] text-bone hover:border-bone disabled:opacity-50"
        >
          {deshaciendo ? "…" : "Deshacer"}
        </button>
      )}
      <button type="button" onClick={onCerrar} aria-label="Cerrar aviso" className="grid size-11 shrink-0 place-items-center text-bone/80 hover:text-bone">
        ×
      </button>
    </div>
  );
}

type Resultado = { ok: boolean; mensaje?: string } | void | undefined | unknown;

type Opciones<R> = {
  /** Texto de éxito (o función del resultado). Sin texto, no avisa el éxito. */
  ok?: string | ((r: R) => string | undefined);
  /** Texto de error si la action TIRA (sesión vencida, base caída). */
  error?: string;
  deshacer?: () => void | Promise<unknown>;
  /** Se llama si falló (para revertir estado local). */
  alFallar?: () => void;
};

const ERROR_GENERICO = "No pudimos guardar. Revisá tu conexión o volvé a entrar al panel.";

function esFallo(r: unknown): r is { ok: false; mensaje?: string } {
  return typeof r === "object" && r !== null && "ok" in r && (r as { ok: unknown }).ok === false;
}

export function useAccion() {
  const { avisar } = useToast();
  const [pendiente, start] = useTransition();
  const correr = useCallback(
    <R extends Resultado>(fn: () => Promise<R>, op: Opciones<R> = {}) =>
      start(async () => {
        try {
          const r = await fn();
          if (esFallo(r)) {
            op.alFallar?.();
            avisar({ tipo: "error", texto: r.mensaje || ERROR_GENERICO });
            return;
          }
          const texto = typeof op.ok === "function" ? op.ok(r) : op.ok ?? (typeof r === "object" && r && "mensaje" in r ? String((r as { mensaje?: string }).mensaje ?? "") : "");
          if (texto) avisar({ tipo: "ok", texto, deshacer: op.deshacer });
        } catch (e) {
          unstable_rethrow(e); // redirect()/notFound() de la action siguen su curso
          op.alFallar?.();
          avisar({ tipo: "error", texto: op.error ?? ERROR_GENERICO });
        }
      }),
    [avisar],
  );
  return [pendiente, correr] as const;
}
