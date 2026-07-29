import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

// 404 global — pieza de marca, no la pantalla pelada de Next (ver
// docs/04_SITE_ARCHITECTURE.md §7.4). Vive en la raíz de app/ (fuera del grupo
// (site)), así que aporta su propio Header/Footer. Tono cálido, salidas claras.
// TODO(contenido): copy final del 404 (el de abajo es la dirección provisional).
export default function NotFound() {
  return (
    <>
      <Header />
      <main
        id="main"
        data-theme="light"
        className="flex min-h-[80svh] items-center bg-bone px-6 pt-32 pb-24 text-ink md:px-10"
      >
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
              <Eyebrow className="mb-6">Error 404</Eyebrow>
              <p
                aria-hidden="true"
                className="font-display text-[length:var(--text-step-7)] font-extrabold uppercase leading-[0.85] tracking-[-0.02em] text-ink"
              >
                404
              </p>
              <h1 className="mt-4 max-w-[20ch] font-display text-[length:var(--text-step-4)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-ink [overflow-wrap:anywhere]">
                Esta página se fue de fiesta
              </h1>
              <p className="mt-6 max-w-[46ch] font-sans text-[length:var(--text-step-1)] leading-snug text-ink/70">
                No encontramos lo que buscabas, pero hay mucho lindo por acá.
                Volvamos a algo que sí existe.
              </p>
            </div>

            <nav
              aria-label="Salidas rápidas"
              className="flex flex-wrap gap-4 md:col-span-4 md:justify-self-end"
            >
              <Button href="/">Volver al inicio</Button>
              <Button href="/productos" variant="outline">
                Ver el catálogo
              </Button>
            </nav>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
