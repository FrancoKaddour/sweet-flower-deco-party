/**
 * Datos estructurados (JSON-LD, schema.org) — lo que leen Google y las IAs
 * (ChatGPT, Perplexity, Gemini, Claude) para entender QUÉ es el negocio, DÓNDE
 * está, QUÉ vende y CÓMO contactarlo. Server component: se emite en el HTML.
 * Datos: lib/site.ts (BUSINESS) + content/catalogo.ts. Nada inventado.
 */
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, BUSINESS } from "@/lib/site";
import { CATEGORIAS } from "@/content/catalogo";
import { EVENT_NAME } from "@/content/evento";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/** Emite un <script type="application/ld+json">. */
export function JsonLdScript({ data }: { data: Json }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify + escape de "<" → sin riesgo de cerrar el <script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const ORG_ID = `${SITE_URL}/#organization`;

/** Grafo del sitio: negocio + web. Va una vez, en el layout raíz. */
export function JsonLd() {
  const data: Json = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": ORG_ID,
        name: SITE_NAME,
        alternateName: ["Sweet Flowers", "Sweet Flowers Deco"],
        url: SITE_URL,
        logo: `${SITE_URL}/brand/logo-mark-full.png`,
        image: `${SITE_URL}/opengraph-image`,
        description: SITE_DESCRIPTION,
        slogan: "Creamos la escenografía de tus mejores momentos",
        founder: { "@type": "Person", name: BUSINESS.founder },
        address: {
          "@type": "PostalAddress",
          addressLocality: BUSINESS.locality,
          addressRegion: BUSINESS.region,
          addressCountry: BUSINESS.country,
        },
        areaServed: { "@type": "Country", name: "Argentina" },
        telephone: BUSINESS.phoneVentas,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: BUSINESS.phoneVentas,
            availableLanguage: "es",
            areaServed: "AR",
          },
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            name: "Capacitaciones y Event Summit",
            telephone: BUSINESS.phoneCapacitaciones,
            availableLanguage: "es",
            areaServed: "AR",
          },
        ],
        sameAs: [BUSINESS.instagram],
        knowsAbout: [
          "decoración de eventos",
          "ambientación de eventos",
          "estructuras de hierro para eventos",
          "arcos para decoración",
          "catering para eventos",
          "telas sublimadas",
          "fundas para estructuras",
          "capacitación para decoradores",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Catálogo de piezas para decoración de eventos",
          itemListElement: CATEGORIAS.map((c) => ({
            "@type": "OfferCatalog",
            name: c.nombre,
            description: c.desc,
            url: `${SITE_URL}/productos/${c.slug}`,
          })),
        },
        event: { "@type": "Event", name: EVENT_NAME, url: `${SITE_URL}/event-summit` },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "es-AR",
        publisher: { "@id": ORG_ID },
      },
    ],
  };
  return <JsonLdScript data={data} />;
}

/** Migas de pan (Inicio › Sección › Página) para páginas internas. */
export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "Inicio", path: "/" }, ...items];
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: all.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: `${SITE_URL}${it.path === "/" ? "" : it.path}`,
        })),
      }}
    />
  );
}

/** Preguntas frecuentes (solo con preguntas que SE VEN en la página). */
export function FaqJsonLd({ faqs }: { faqs: readonly { q: string; a: string }[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  );
}
