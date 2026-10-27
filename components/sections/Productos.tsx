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
    <section id="productos" data-theme="light" className="bg-bone px-6 pb-16 pt-28 md:px-10 md:pb-24 md:pt-40">
      <div className="mx-auto max-w-[87.5rem]">
        <div className="mb-14 grid gap-6 md:mb-20 md:grid-cols-12 md:items-end">
          <RevealText
            as="h2"
            onScroll
            className="t-voz-display max-w-[14ch] text-[length:var(--text-step-6)] text-ink md:col-span-7"
          >
            Lo que sale del taller
          </RevealText>
          <p className="max-w-[40ch] text-[length:var(--text-step-0)] leading-relaxed text-ink/75 md:col-span-4 md:col-start-9">
            Tres familias de piezas, todas hechas por encargo: contá unos 20
            días desde que confirmás.
          </p>
        </div>

        {/* mobile: carrusel deslizable; md+: grilla de 3 columnas. */}
        <div
          id="colecciones-track"
          data-fall-group
          className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {COLECCIONES.map((c, i) => (
            <div key={c.slug} className="w-[80%] max-w-[22rem] shrink-0 snap-center sm:w-[46%] md:w-auto md:max-w-none">
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
        <SwipeDots forId="colecciones-track" count={COLECCIONES.length} label="Colecciones" />
      </div>
    </section>
  );
}
