import { RevealText } from "@/components/motion/RevealText";
import { CollectionCard } from "@/components/motion/CollectionCard";
import { SwipeDots } from "@/components/ui/SwipeDots";
import { getCategorias } from "@/modules/catalog/repository";

// Las 3 primeras categorías del catálogo (content/catalogo.ts vía repository).
// D-02: en la home cada puerta muestra la pieza EN USO, no la foto de taller.
// Si cambia el catálogo, la categoría sin foto acá usa la suya.
// TODO(contenido): foto de una funda puesta (aro o arcada) para "Fundas & telas";
// hoy va la tela sublimada de fondo del workshop de Río Cuarto.
const FOTO_EN_USO: Record<string, string> = {
  catering: "/productos/cat-eclipse-1m-comida.jpg",
  hierro: "/productos/arco-con-rombo.jpg",
  "fundas-y-telas": "/img/rio-cuarto/rc-01.webp",
};

/**
 * Sección PRODUCTOS — 3 puertas al catálogo con "caída" clip-path.
 * Encabezado a la izquierda + bajada a la derecha (D-04), sin numerales (D-10).
 */
export async function Productos() {
  const COLECCIONES = (await getCategorias()).slice(0, 3);
  return (
    <section id="productos" data-theme="light" className="bg-bone px-6 pb-16 pt-28 md:flex md:min-h-svh md:flex-col md:justify-center md:px-10 md:py-16">
      <div className="mx-auto w-full max-w-[87.5rem]">
        {/* Encabezado centrado; en desktop/notebook la sección entra en 100svh */}
        <div className="mb-10 flex flex-col items-center gap-4 text-center md:mb-[clamp(1.5rem,4svh,3rem)]">
          <RevealText
            as="h2"
            onScroll
            className="t-voz-display mx-auto max-w-[16ch] text-[length:var(--text-step-5)] text-ink lg:max-w-none lg:text-[length:var(--text-step-6)]"
          >
            Lo que sale del taller
          </RevealText>
          <p className="mx-auto max-w-[44ch] text-[length:var(--text-step-0)] leading-relaxed text-ink/75">
            Tres familias de piezas, todas hechas por encargo: contá unos 20
            días desde que confirmás.
          </p>
        </div>

        {/* mobile: carrusel deslizable; md+: grilla de 3 columnas. */}
        <div
          id="colecciones-track"
          data-fall-group
          className="-mx-6 flex snap-x snap-mandatory scroll-px-[14vw] gap-4 overflow-x-auto px-[14vw] [scrollbar-width:none] sm:scroll-px-6 sm:px-6 md:mx-0 md:justify-center md:gap-6 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {COLECCIONES.map((c, i) => (
            <div key={c.slug} className="w-[72vw] max-w-[20rem] shrink-0 snap-center sm:w-[44%] md:w-[min(22rem,calc((100svh-19rem)*0.727),calc((100%-3rem)/3))] md:max-w-none">
              <CollectionCard
                href={`/productos/${c.slug}`}
                index=""
                titulo={c.nombre}
                desc={c.tagline}
                img={FOTO_EN_USO[c.slug] ?? c.img}
                delay={i * 140}
              />
            </div>
          ))}
        </div>
        <SwipeDots forId="colecciones-track" count={COLECCIONES.length} label="Colecciones" centrar />
      </div>
    </section>
  );
}
