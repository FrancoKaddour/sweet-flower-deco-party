import Link from "next/link";
import { MAIN_NAV, CONTACTO_LINKS, INFO_LINKS, CONTACTO_LINK } from "@/content/site";
import { GRUPOS, LANDINGS } from "@/content/seo/landings";
import { FooterGlobos } from "@/components/site/FooterGlobos";

/**
 * Footer del sitio — Server Component (T-12): todo es HTML estático salvo la
 * casita con globos (FooterGlobos, isla client chica).
 *
 * D-20: cierre de marca grande (SWEET FLOWERS a todo el ancho, la casita con
 * sus globos) y el mapa del sitio en FILAS (título + links en línea, pedido de Fran)
 * (navegación, contacto, info y las landings SEO por grupo). T-13: los títulos
 * de columna son h2 (antes h4 después de un h2).
 */
const linkCls =
  "inline-flex min-h-10 items-center text-bone/80 transition-colors hover:text-bone md:min-h-8";
const tituloCls =
  "pt-2.5 text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-champagne md:pt-1.5";

/** Una FILA del mapa del sitio: título a la izquierda y links en línea (se acomodan solos). */
function Fila({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-x-8 gap-y-1 border-t border-bone/10 py-4 first:border-t-0 md:grid-cols-[11rem_1fr] md:py-5">
      <h2 className={tituloCls}>{titulo}</h2>
      <ul className="flex flex-wrap gap-x-6 gap-y-0">{children}</ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer data-theme="dark" className="w-full overflow-hidden bg-ink text-bone">
      {/* 1) Cierre de marca */}
      <div className="mx-auto max-w-[120rem] px-6 pt-20 md:px-10 md:pt-28">
        <div className="flex items-end justify-between gap-6">
          <p className="t-voz-display max-w-[18ch] text-[length:var(--text-step-4)] text-bone/90 md:text-[length:var(--text-step-5)]">
            Estructuras para eventos, hechas en Tortuguitas.
          </p>
          <div className="h-[clamp(9rem,22vw,17rem)] shrink-0">
            <FooterGlobos />
          </div>
        </div>
        <p
          aria-hidden="true"
          className="mt-6 whitespace-nowrap font-(family-name:--font-logo) text-[length:min(calc((100vw-4rem)/8.15),14rem)] font-light uppercase leading-[0.8] tracking-[0.02em] md:text-[length:min(calc((100vw-6rem)/8.15),14rem)] text-bone"
        >
          Sweet Flowers
        </p>
      </div>

      {/* 2) Links — una fila por grupo (título + links en línea) */}
      <nav
        aria-label="Mapa del sitio"
        className="mx-auto max-w-[87.5rem] border-t border-bone/10 px-6 py-10 md:mt-16 md:px-10 md:py-14"
      >
        <Fila titulo="Sitio">
          {[...MAIN_NAV, CONTACTO_LINK].map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`${linkCls} text-[length:var(--text-step--1)]`}>{item.label}</Link>
            </li>
          ))}
        </Fila>
        {GRUPOS.map((g) => {
          const items = LANDINGS.filter((l) => l.grupo === g.id);
          if (!items.length) return null;
          return (
            <Fila key={g.id} titulo={g.titulo}>
              {items.map((l) => (
                <li key={l.slug}>
                  <Link href={`/${l.slug}`} className={`${linkCls} text-[length:var(--text-step--1)]`}>
                    {l.link}
                  </Link>
                </li>
              ))}
            </Fila>
          );
        })}
        <Fila titulo="Info">
          {INFO_LINKS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`${linkCls} text-[length:var(--text-step--1)]`}>{item.label}</Link>
            </li>
          ))}
          <li>
            <Link href="/resenas" className={`${linkCls} text-[length:var(--text-step--1)]`}>Dejanos tu reseña</Link>
          </li>
        </Fila>
      </nav>

      {/* 3) Barra inferior */}
      <div className="mx-auto flex max-w-[87.5rem] flex-wrap items-center justify-between gap-4 border-t border-bone/10 px-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-6 text-[length:var(--text-step--1)] text-bone/65 md:px-10 md:pb-10">
        <p>© {year} Sweet Flowers Deco Party, Tortuguitas (Buenos Aires)</p>
        <ul aria-label="Contacto directo" className="-mr-2.5 flex items-center gap-1">
          {CONTACTO_LINKS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center px-2.5 text-bone/80 transition-colors hover:text-bone"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
