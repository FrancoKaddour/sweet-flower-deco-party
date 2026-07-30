import { RevealText } from "@/components/motion/RevealText";
import { CollectionCard } from "@/components/motion/CollectionCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CATEGORIAS } from "@/content/catalogo";

// Colecciones destacadas en la Home = las 3 primeras categorías del catálogo.
// La fuente única es content/catalogo.ts, así los slugs no se desincronizan con
// la página /productos. TODO(contenido): fotos y textos reales.
const COLECCIONES = CATEGORIAS.slice(0, 3);

/**
 * Sección PRODUCTOS — 3 colecciones con "caída" clip-path (referencia CANCAN).
 * Cada colección enlaza a su parte del ecommerce. Ver docs/05_CONTENT_STRATEGY.md.
 */
export function Productos() {
  return (
    <section id="productos" className="bg-bone px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1400px]">
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

        {/* Colecciones */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {COLECCIONES.map((c, i) => (
            <CollectionCard
              key={c.slug}
              href={`/productos/${c.slug}`}
              index={c.index}
              titulo={c.nombre}
              desc={c.tagline}
              img={c.img}
              delay={i * 140}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
