"use client";

import "./globals.css";

/**
 * Último recurso (T-14): reemplaza al layout raíz si ESE falla. Sin Header,
 * fuentes ni JS de marca: HTML mínimo, legible y con salida por WhatsApp.
 */
const WA = "https://wa.me/5491151064010";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es-AR">
      <body className="min-h-dvh bg-bone text-ink" data-loader="false">
        <main
          id="main"
          className="flex min-h-dvh flex-col justify-center px-6 py-16 md:px-10"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          <div className="mx-auto w-full max-w-[60rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-mark-520.webp" alt="Sweet Flowers Deco Party" className="mb-10 h-16 w-auto" />
            <h1 className="max-w-[18ch] text-[clamp(2.25rem,6vw,4.5rem)] uppercase leading-[0.95]">
              El sitio no cargó bien
            </h1>
            <p className="mt-6 max-w-[46ch] font-sans text-lg leading-snug text-ink/70">
              Probá de nuevo en un momento. Si sigue igual, escribinos por WhatsApp.
            </p>
            {error.digest && (
              <p className="mt-2 font-sans text-sm text-ink/60">Código para soporte: {error.digest}</p>
            )}
            <div className="mt-10 flex flex-wrap gap-4 font-sans text-sm font-medium uppercase tracking-[0.14em]">
              <button
                type="button"
                onClick={() => reset()}
                className="min-h-11 rounded-full bg-ink px-6 text-bone"
              >
                Reintentar
              </button>
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-full border border-ink px-6"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
