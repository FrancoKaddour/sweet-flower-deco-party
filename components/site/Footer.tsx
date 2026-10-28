import Link from "next/link";
import { CONTACTO_LINK, WHATSAPP_NUMBER } from "@/content/site";
import { LANDINGS } from "@/content/seo/landings";
import { NEGOCIO_SEO } from "@/content/seo/negocio";
import { CATEGORIAS } from "@/content/catalogo";
import { EVENT_WHATSAPP } from "@/content/evento";
import { FooterGlobos } from "@/components/site/FooterGlobos";

/**
 * Footer del sitio — Server Component (la única isla client es la casita con
 * globos). Estructura tomada de labasicapasteleria.com (pedido de Fran):
 *  1) Cierre de marca: la casita del logo y SWEET FLOWERS a todo el ancho.
 *  2) Cuatro columnas: marca + redes · Catálogo · Información · Contacto.
 *  3) Línea SEO chica con todas las landings separadas por " · ".
 *  4) Barra inferior.
 * Solo datos confirmados: sin dirección exacta ni email hasta que Flor los pase
 * (content/seo/negocio.ts); Facebook aparece solo si está cargado.
 */
const tituloCls = "mb-4 text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-champagne";
const linkCls =
  "inline-flex min-h-10 items-center text-[length:var(--text-step--1)] text-bone/75 transition-colors hover:text-bone md:min-h-8";

const telefono = (n: string) => `+${n.slice(0, 2)} ${n.slice(2, 3)} ${n.slice(3, 5)} ${n.slice(5, 9)}-${n.slice(9)}`;

const CATALOGO = [
  { label: "Todos los productos", href: "/productos" },
  ...CATEGORIAS.map((c) => ({ label: c.nombre, href: `/productos/${c.slug}` })),
  { label: "Envíos a todo el país", href: "/envios-a-todo-el-pais" },
];

const INFORMACION = [
  { label: "Event Summit 2027", href: "/event-summit" },
  { label: "Historia", href: "/historia" },
  { label: "Reseñas", href: "/resenas" },
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
  { label: "Términos y condiciones", href: "/terminos" },
  { label: "Política de privacidad", href: "/privacidad" },
  { label: "Cambios y devoluciones", href: "/cambios" },
  { label: "Botón de arrepentimiento", href: "/terminos#arrepentimiento" },
];

const REDES = [
  { label: "Instagram", href: "https://www.instagram.com/sweetflowersdecoparty/" },
  ...(NEGOCIO_SEO.facebook ? [{ label: "Facebook", href: NEGOCIO_SEO.facebook }] : []),
];

function Columna({ titulo, items }: { titulo: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className={tituloCls}>{titulo}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={linkCls}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer data-theme="dark" className="w-full overflow-hidden bg-ink text-bone">
      {/* 1) Cierre de marca: casita arriba + SWEET FLOWERS a todo el ancho */}
      <div className="mx-auto max-w-[120rem] px-6 pt-14 md:px-10 md:pt-20">
        <div className="flex justify-center">
          <div className="h-[clamp(7rem,14vw,11rem)]">
            <FooterGlobos />
          </div>
        </div>
        <p
          aria-hidden="true"
          className="mt-8 whitespace-nowrap text-center font-(family-name:--font-logo) text-[length:min(calc((100vw-4rem)/8.15),14rem)] font-light uppercase leading-[0.8] tracking-[0.02em] text-bone md:text-[length:min(calc((100vw-6rem)/8.15),14rem)]"
        >
          Sweet Flowers
        </p>
      </div>

      {/* 2) Columnas */}
      <nav
        aria-label="Mapa del sitio"
        className="mx-auto mt-12 grid max-w-[87.5rem] grid-cols-2 gap-x-6 gap-y-10 border-t border-bone/10 px-6 py-12 md:mt-16 md:grid-cols-[1.4fr_1fr_1.2fr_1.2fr] md:gap-x-10 md:px-10 md:py-16"
      >
        {/* Marca + redes */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="font-(family-name:--font-logo) text-[length:var(--text-step-2)] uppercase tracking-[0.08em] text-bone">
            Sweet Flowers
          </Link>
          <p className="mt-3 max-w-[30ch] text-[length:var(--text-step--1)] leading-relaxed text-bone/65">
            Estructuras para eventos, hechas en Tortuguitas, Buenos Aires. Por
            encargo y con envíos a todo el país.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5">
            {REDES.map((r) => (
              <li key={r.href}>
                <a href={r.href} target="_blank" rel="noopener noreferrer" className={`${linkCls} underline-offset-4 hover:underline`}>
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <Columna titulo="Catálogo" items={CATALOGO} />
        <Columna titulo="Información" items={INFORMACION} />

        {/* Contacto (solo datos confirmados) */}
        <div className="col-span-2 md:col-span-1">
          <h2 className={tituloCls}>Contacto</h2>
          <ul className="text-[length:var(--text-step--1)] text-bone/75">
            <li className="flex min-h-10 items-center md:min-h-8">Tortuguitas, Buenos Aires</li>
            <li>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className={linkCls}>
                Ventas · {telefono(WHATSAPP_NUMBER)}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${EVENT_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className={linkCls}>
                Capacitaciones · {telefono(EVENT_WHATSAPP)}
              </a>
            </li>
            {NEGOCIO_SEO.email && (
              <li>
                <a href={`mailto:${NEGOCIO_SEO.email}`} className={linkCls}>{NEGOCIO_SEO.email}</a>
              </li>
            )}
            <li>
              <Link href={CONTACTO_LINK.href} className={linkCls}>Escribinos →</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* 3) Línea SEO: todas las landings, chicas y en línea */}
      <div className="mx-auto max-w-[87.5rem] border-t border-bone/10 px-6 py-6 text-center md:px-10">
        <p className="text-[0.68rem] leading-relaxed text-bone/45">
          <span className="mr-2 font-semibold uppercase tracking-[0.14em] text-bone/60">Estructuras para eventos</span>
          {LANDINGS.map((l, i) => (
            <span key={l.slug}>
              {i > 0 && <span aria-hidden="true"> · </span>}
              <Link href={`/${l.slug}`} className="transition-colors hover:text-bone">{l.link}</Link>
            </span>
          ))}
          <span aria-hidden="true"> · </span>
          <Link href="/resenas" className="transition-colors hover:text-bone">Dejanos tu reseña</Link>
        </p>
      </div>

      {/* 4) Barra inferior */}
      <div className="mx-auto flex max-w-[87.5rem] flex-wrap items-center justify-between gap-4 border-t border-bone/10 px-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-6 text-[length:var(--text-step--1)] text-bone/60 md:px-10 md:pb-10">
        <p>© {year} Sweet Flowers Deco Party · Tortuguitas, Buenos Aires</p>
      </div>
    </footer>
  );
}
