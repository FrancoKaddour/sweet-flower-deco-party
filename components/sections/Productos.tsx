import { RevealText } from "@/components/motion/RevealText";
import { CollectionCard } from "@/components/motion/CollectionCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SwipeDots } from "@/components/ui/SwipeDots";
import { getCategorias } from "@/modules/catalog/repository";

// Colecciones destacadas en la Home = las 3 primeras categorías del catálogo.
// La fuente única es content/catalogo.ts, así los slugs no se desincronizan con
// la página /productos. TODO(contenido): fotos y textos reales.

/**
 * Sección PRODUCTOS — 3 colecciones con "caída" clip-path (referencia CANCAN).
 * Cada colección enlaza a su parte del ecommerce. Ver docs/05_CONTENT_STRATEGY.md.
 */
export async function Productos() {
  const COLECCIONES = (await getCategorias()).slice(0, 3);
  return (
    <section id="productos" data-theme="light" className="bg-bone px-6 pb-16 pt-28 md:px-10 md:pb-24 md:pt-40">
      <div className="mx-auto max-w-[87.5rem]">
        {/* Encabezado (centrado) */}
        <div className="mb-16 text-center md:mb-20">
          <Eyebrow className="mb-6">El catálogo</Eyebrow>
          <RevealText
            as="h2"
            onScroll
            className="mx-auto max-w-[16ch] text-center font-display text-[length:var(--text-step-5)] font-extrabold uppercase leading-[0.92] tracking-[-0.01em] text-ink"
          >
            {/* TODO(contenido): titular real */}
            Piezas que sostienen la escena
          </RevealText>
        </div>

        {/* Colecciones — mobile: carrusel deslizable (las 3 caen juntas al
            entrar y la siguiente asoma); md+: grilla de 3 columnas. */}
        <div
          id="colecciones-track"
          data-fall-group
          className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {COLECCIONES.map((c, i) => (
            <div key={c.slug} className="w-[80%] max-w-[22rem] shrink-0 snap-center sm:w-[46%] md:w-auto md:max-w-none">
              <CollectionCard
                href={`/productos/${c.slug}`}
                index={c.index}
                titulo={c.nombre}
                desc={c.tagline}
                img={c.img}
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
