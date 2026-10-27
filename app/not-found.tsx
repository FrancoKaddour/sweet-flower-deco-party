import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/Button";
import { balloonRed, balloonBlack, house, type BrandShape } from "@/content/brandShapes";

// T-20: título propio (y fuera del índice).
export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

function Forma({ shape, color, className }: { shape: BrandShape; color: string; className?: string }) {
  return (
    <svg viewBox={shape.viewBox} className={className} aria-hidden="true" focusable="false">
      <path d={shape.d} fill={color} fillRule="evenodd" />
    </svg>
  );
}

// 404 global — pieza de marca, no la pantalla pelada de Next (ver
// docs/04_SITE_ARCHITECTURE.md §7.4). Vive en la raíz de app/ (fuera del grupo
// (site)), así que aporta su propio Header/Footer. Tono cálido, salidas claras.
// D-17: la casita del logo con dos globos; uno se suelta y se va (CSS puro,
// globos de PageTransition / content/brandShapes). Con reduced-motion queda quieto.
export default function NotFound() {
  return (
    <>
      <Header />
      <main
        id="main"
        data-theme="light"
        className="flex min-h-[80svh] items-center bg-bone px-6 pt-32 pb-24 text-ink md:px-10"
      >
        <div className="mx-auto w-full max-w-[87.5rem]">
          <div className="grid grid-cols-1 items-end gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <p aria-hidden="true" className="t-voz-display text-[length:clamp(6rem,4rem+12vw,15rem)] leading-[0.8] text-ink">
                404
              </p>
              <h1 className="t-voz-display mt-6 max-w-[16ch] text-[length:var(--text-step-5)] text-ink">
                Esta página se fue de fiesta
              </h1>
              <p className="mt-6 max-w-[46ch] text-[length:var(--text-step-1)] leading-snug text-ink/75">
                El link está roto o la página ya no existe. Desde acá podés
                volver al inicio o ir directo al catálogo.
              </p>
              <nav aria-label="Salidas rápidas" className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
                <Button href="/">Volver al inicio</Button>
                <Button href="/productos" variant="outline">
                  Ver el catálogo
                </Button>
              </nav>
            </div>

            {/* La casita con un globo que se suelta */}
            <div aria-hidden="true" className="sf-404 relative mx-auto h-[clamp(18rem,40vw,30rem)] w-[clamp(14rem,30vw,22rem)] md:col-span-5">
              <div className="sf-404__globo sf-404__globo--suelto absolute left-[18%] top-[2%] h-[44%]">
                <Forma shape={balloonRed} color="var(--color-brand-red)" className="h-full w-auto" />
              </div>
              <div className="sf-404__globo sf-404__globo--quieto absolute left-[52%] top-[6%] h-[40%]">
                <Forma shape={balloonBlack} color="var(--color-ink)" className="h-full w-auto" />
              </div>
              <Forma shape={house} color="var(--color-ink)" className="absolute bottom-0 left-1/2 h-[52%] w-auto -translate-x-1/2" />
            </div>
          </div>

          {/* Lo más buscado: salidas útiles (y enlazado interno) */}
          <div className="mt-16 border-t border-line pt-8">
            <h2 className="text-[length:var(--text-step-0)] text-ink/75">Lo más buscado</h2>
            <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
              {[
                ["/estructuras-de-hierro-para-eventos", "Estructuras de hierro"],
                ["/arcos-para-eventos", "Arcos para eventos"],
                ["/exhibidores-para-catering", "Exhibidores para catering"],
                ["/event-summit", "Event Summit"],
                ["/preguntas-frecuentes", "Preguntas frecuentes"],
                ["/contacto", "Contacto"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex min-h-11 items-center rounded-[var(--radius-pill)] border border-line px-5 text-[length:var(--text-step--1)] text-ink/70 transition-colors hover:border-ink hover:text-ink"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
