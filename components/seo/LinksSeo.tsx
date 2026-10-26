import Link from "next/link";
import { GRUPOS, LANDINGS } from "@/content/seo/landings";

/**
 * Bloque de links SEO del footer (como el de labasicapasteleria.com): todas
 * las landings por intención y por zona, agrupadas, en texto chico. Le da a
 * Google (y a las IAs) un camino rastreable a cada landing desde TODAS las
 * páginas. Va DENTRO del footer oscuro (texto claro).
 */
export function LinksSeo() {
  return (
    <nav
      aria-label="Más sobre Sweet Flowers"
      className="mx-auto max-w-[87.5rem] border-t border-bone/10 px-6 py-10 md:px-10 md:py-12"
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-8 min-[480px]:grid-cols-2 lg:grid-cols-4">
        {GRUPOS.map((g) => {
          const items = LANDINGS.filter((l) => l.grupo === g.id);
          if (!items.length) return null;
          return (
            <div key={g.id}>
              <p className="mb-3 text-[length:var(--text-step--1)] uppercase tracking-wide text-champagne/80">
                {g.titulo}
              </p>
              <ul className="flex flex-wrap gap-x-1 text-[0.8125rem] leading-relaxed text-bone/55">
                {items.map((l, i) => (
                  <li key={l.slug} className="inline-flex items-center">
                    <Link
                      href={`/${l.slug}`}
                      className="inline-flex min-h-8 items-center transition-colors hover:text-bone"
                    >
                      {l.link}
                    </Link>
                    {i < items.length - 1 && (
                      <span aria-hidden="true" className="px-1.5 text-bone/25">
                        ·
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-1 text-[0.8125rem] text-bone/55">
        <li>
          <Link href="/preguntas-frecuentes" className="inline-flex min-h-8 items-center transition-colors hover:text-bone">
            Preguntas frecuentes
          </Link>
        </li>
        <li>
          <Link href="/resenas" className="inline-flex min-h-8 items-center transition-colors hover:text-bone">
            Dejanos tu reseña
          </Link>
        </li>
        <li>
          <Link href="/envios-a-todo-el-pais" className="inline-flex min-h-8 items-center transition-colors hover:text-bone">
            Envíos
          </Link>
        </li>
      </ul>
    </nav>
  );
}
