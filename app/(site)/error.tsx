"use client";

import { useEffect } from "react";
import Link from "next/link";
import { WHATSAPP_HREF } from "@/content/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonInner, buttonClasses } from "@/components/ui/Button";

/**
 * Error del sitio público (T-14). Se muestra dentro del layout (header y
 * footer siguen ahí) si una página tira al renderizar. Salidas: reintentar,
 * escribirnos por WhatsApp o volver al inicio. Sin detalles técnicos en
 * pantalla (el digest queda en la consola para soporte).
 */
export default function ErrorSitio({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[sitio] error de render", error.digest ?? error.message);
  }, [error]);

  return (
    <main
      id="main"
      data-theme="light"
      className="flex min-h-[80svh] items-center bg-bone px-6 pt-32 pb-24 text-ink md:px-10"
    >
      <div className="mx-auto w-full max-w-[87.5rem]">
        <Eyebrow className="mb-6">No se pudo cargar</Eyebrow>
        <h1
          tabIndex={-1}
          className="max-w-[18ch] font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-ink [overflow-wrap:anywhere]"
        >
          Esta página no cargó bien
        </h1>
        <p className="mt-6 max-w-[46ch] font-sans text-[length:var(--text-step-1)] leading-snug text-ink/70">
          Probá de nuevo en un momento. Si sigue igual, escribinos por WhatsApp y
          te ayudamos con tu consulta o tu pedido.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
          <button type="button" onClick={() => reset()} className={buttonClasses("dark")}>
            <ButtonInner primary tone="dark">
              Reintentar
            </ButtonInner>
          </button>
          <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={buttonClasses("dark")}>
            <ButtonInner primary={false} tone="dark">
              Escribir por WhatsApp
            </ButtonInner>
          </a>
          <Link href="/" className={buttonClasses("dark")}>
            <ButtonInner primary={false} tone="dark">
              Volver al inicio
            </ButtonInner>
          </Link>
        </div>
      </div>
    </main>
  );
}
