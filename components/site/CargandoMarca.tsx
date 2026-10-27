/**
 * Skeleton de carga con la marca (T-14): la casita respira y debajo se
 * insinúan título y bajada. Server Component, sin JS. Lo usan los loading.tsx
 * de las rutas dinámicas (inscripción del Summit, cuenta, ingresar).
 */
export function CargandoMarca({ etiqueta = "Cargando…" }: { etiqueta?: string }) {
  return (
    <main
      id="main"
      data-theme="light"
      aria-busy="true"
      className="flex min-h-[80svh] items-center bg-bone px-6 pt-32 pb-24 text-ink md:px-10"
    >
      <div className="mx-auto flex w-full max-w-[40rem] flex-col items-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-mark-520.webp"
          alt=""
          aria-hidden="true"
          className="h-16 w-auto motion-safe:animate-pulse"
        />
        <div aria-hidden="true" className="mt-10 h-9 w-3/4 rounded-full bg-ink/8 motion-safe:animate-pulse" />
        <div aria-hidden="true" className="mt-4 h-4 w-2/3 rounded-full bg-ink/6 motion-safe:animate-pulse" />
        <div aria-hidden="true" className="mt-2 h-4 w-1/2 rounded-full bg-ink/6 motion-safe:animate-pulse" />
        <p role="status" className="sr-only">
          {etiqueta}
        </p>
      </div>
    </main>
  );
}
