/**
 * Datos estructurados (JSON-LD, schema.org) — lo que leen Google y las IAs
 * (ChatGPT, Perplexity, Gemini, Claude) para entender QUÉ es el negocio, DÓNDE
 * está, QUÉ vende y CÓMO contactarlo. Server components: se emiten en el HTML.
 * Datos: lib/site.ts (BUSINESS), content/seo/negocio.ts (datos que faltan →
 * null = no se emiten), content/catalogo.ts y content/evento.ts. Nada inventado:
 * sin ratings ni reseñas (no hay reseñas reales cargadas todavía).
 */
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, BUSINESS } from "@/lib/site";
import { CATEGORIAS } from "@/content/catalogo";
import { NEGOCIO_SEO } from "@/content/seo/negocio";
import {
  EVENT_NAME,
  EVENT_DATE_ISO,
  EVENT_END_ISO,
  EDICION_LABEL,
  PASES,
  PREVENTAS,
  type Etapa,
} from "@/content/evento";

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

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SUMMIT_ID = `${SITE_URL}/event-summit#event`;
const abs = (p: string) => (p.startsWith("http") ? p : `${SITE_URL}${p.startsWith("/") ? "" : "/"}${p}`);

const ORGANIZER: Json = { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, url: SITE_URL };

/** Dirección: solo con los campos que existen (calle/CP quedan null hasta tenerlos). */
function direccion(): Json {
  const a: Record<string, Json> = {
    "@type": "PostalAddress",
    addressLocality: BUSINESS.locality,
    addressRegion: BUSINESS.region,
    addressCountry: BUSINESS.country,
  };
  if (NEGOCIO_SEO.calle) a.streetAddress = NEGOCIO_SEO.calle;
  if (NEGOCIO_SEO.codigoPostal) a.postalCode = NEGOCIO_SEO.codigoPostal;
  return a;
}

/** Event del Summit (próxima edición). Se usa en el grafo global y en landings. */
export function summitEvent(): Json {
  return {
    "@type": "Event",
    "@id": SUMMIT_ID,
    name: `${EVENT_NAME} · ${EDICION_LABEL}`,
    description:
      "La cumbre argentina de la decoración y la organización de eventos: charlas de referentes del rubro, certificado de asistencia, coffee break y comunidad.",
    url: `${SITE_URL}/event-summit`,
    image: [abs("/img/summit-hero.jpg"), abs("/event-summit/opengraph-image")],
    inLanguage: "es-AR",
    ...(EVENT_DATE_ISO ? { startDate: EVENT_DATE_ISO, endDate: EVENT_END_ISO } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "La Rural",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Palermo, Ciudad Autónoma de Buenos Aires",
        addressRegion: "Ciudad Autónoma de Buenos Aires",
        addressCountry: "AR",
      },
    },
    organizer: ORGANIZER,
    offers: PREVENTAS.flatMap((pv) =>
      PASES.map((p) => ({
        "@type": "Offer",
        name: `${p.nombre} · ${pv.nombre}`,
        description: p.incluye.join(", "),
        price: pv.precios[p.id],
        priceCurrency: "ARS",
        validThrough: pv.hasta,
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/event-summit#pases`,
      })),
    ),
  };
}

/** Grafo del sitio: negocio + web (el Summit solo por @id). Va una vez, en el layout raíz. */
export function JsonLd() {
  const sameAs = [BUSINESS.instagram, NEGOCIO_SEO.facebook, NEGOCIO_SEO.googleMapsUrl, ...NEGOCIO_SEO.otrasRedes].filter(
    (u): u is string => Boolean(u),
  );
  const org: Record<string, Json> = {
    // Store (subtipo de LocalBusiness): fabrica y VENDE piezas para eventos.
    "@type": ["Organization", "Store"],
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: ["Sweet Flowers", "Sweet Flowers Deco"],
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: abs("/brand/logo-mark-full.png"), width: 2135, height: 2099 },
    image: abs("/opengraph-image"),
    description: SITE_DESCRIPTION,
    slogan: "Creamos la escenografía de tus mejores momentos",
    founder: { "@type": "Person", name: BUSINESS.founder },
    address: direccion(),
    areaServed: { "@type": "Country", name: "Argentina" },
    telephone: BUSINESS.phoneVentas,
    currenciesAccepted: "ARS",
    // TODO(contenido): rango real cuando Flor lo confirme; "$$" = precio medio.
    priceRange: "$$",
    paymentAccepted: "Transferencia bancaria, Mercado Pago",
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
    sameAs,
    knowsAbout: [
      "decoración de eventos",
      "ambientación de eventos",
      "estructuras de hierro para eventos",
      "arcos para decoración",
      "exhibidores para catering",
      "mesas dulces",
      "telas sublimadas",
      "fundas para estructuras",
      "capacitación para decoradores",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catálogo de piezas para decoración de eventos",
      url: `${SITE_URL}/productos`,
      itemListElement: CATEGORIAS.map((c) => ({
        "@type": "OfferCatalog",
        name: c.nombre,
        description: c.desc,
        url: `${SITE_URL}/productos/${c.slug}`,
      })),
    },
    event: { "@id": SUMMIT_ID },
  };
  if (NEGOCIO_SEO.email) org.email = NEGOCIO_SEO.email;
  if (NEGOCIO_SEO.geo)
    org.geo = { "@type": "GeoCoordinates", latitude: NEGOCIO_SEO.geo.lat, longitude: NEGOCIO_SEO.geo.lng };
  if (NEGOCIO_SEO.googleMapsUrl) org.hasMap = NEGOCIO_SEO.googleMapsUrl;
  if (NEGOCIO_SEO.horarios)
    org.openingHoursSpecification = NEGOCIO_SEO.horarios.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dias,
      opens: h.abre,
      closes: h.cierra,
    }));

  const data: Json = {
    "@context": "https://schema.org",
    "@graph": [
      org,
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "es-AR",
        publisher: { "@id": ORG_ID },
      },
      // T-19: el Event completo del Summit va SOLO en /event-summit
      // (<SummitJsonLd />); acá queda la referencia org.event → @id.
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

/** Lista de productos (catálogos, landings): ItemList con URL + nombre + imagen. */
export function ItemListJsonLd({
  name,
  items,
}: {
  name: string;
  items: readonly { nombre: string; path: string; img?: string | null }[];
}) {
  if (!items.length) return null;
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name,
        numberOfItems: items.length,
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: abs(it.path),
          name: it.nombre,
          ...(it.img ? { image: abs(it.img) } : {}),
        })),
      }}
    />
  );
}

/** WebPage de una landing: qué es, de qué trata y quién la publica. */
export function WebPageJsonLd({
  path,
  name,
  description,
  image,
  about,
}: {
  path: string;
  name: string;
  description: string;
  image?: string;
  about?: Json;
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${abs(path)}#webpage`,
        url: abs(path),
        name,
        description,
        inLanguage: "es-AR",
        isPartOf: { "@id": WEBSITE_ID },
        publisher: { "@id": ORG_ID },
        ...(image ? { primaryImageOfPage: { "@type": "ImageObject", url: abs(image) } } : {}),
        ...(about ? { about } : { about: { "@id": ORG_ID } }),
      }}
    />
  );
}

/** El Summit como bloque propio (landings de formación). */
export function SummitJsonLd() {
  return <JsonLdScript data={{ "@context": "https://schema.org", ...(summitEvent() as Record<string, Json>) }} />;
}

/* ── Workshops pasados (páginas /event-summit/trayectoria/<slug>) ── */

const MESES: Record<string, string> = {
  enero: "01", febrero: "02", marzo: "03", abril: "04", mayo: "05", junio: "06",
  julio: "07", agosto: "08", septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12",
};

/** "29 y 30 de octubre de 2024" → { start: "2024-10-29", end: "2024-10-30" }. */
export function fechasDe(texto?: string): { start: string; end: string } | null {
  const m = texto?.match(/(\d{1,2})(?:\s*y\s*(\d{1,2}))?\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})/i);
  if (!m) return null;
  const mes = MESES[m[3].toLowerCase()];
  if (!mes) return null;
  const d = (n: string) => `${m[4]}-${mes}-${n.padStart(2, "0")}`;
  return { start: d(m[1]), end: d(m[2] ?? m[1]) };
}

/** Sedes con dirección pública (la 7ª, un hotel, NO se nombra → sin Event). */
const SEDES_EVENT: Record<string, { name: string; locality: string; region: string }> = {
  "centro-naval": { name: "Centro Naval", locality: "Ciudad Autónoma de Buenos Aires", region: "Ciudad Autónoma de Buenos Aires" },
  "madero-tango": { name: "Madero Tango", locality: "Puerto Madero, Ciudad Autónoma de Buenos Aires", region: "Ciudad Autónoma de Buenos Aires" },
  "la-rioja": { name: "La Rioja Capital", locality: "La Rioja", region: "La Rioja" },
  "rio-cuarto": { name: "Río Cuarto", locality: "Río Cuarto", region: "Córdoba" },
  "palacio-san-miguel": { name: "Palacio San Miguel", locality: "Ciudad Autónoma de Buenos Aires", region: "Ciudad Autónoma de Buenos Aires" },
  "la-rural": { name: "La Rural", locality: "Palermo, Ciudad Autónoma de Buenos Aires", region: "Ciudad Autónoma de Buenos Aires" },
  "primera-edicion": { name: "La Rural", locality: "Palermo, Ciudad Autónoma de Buenos Aires", region: "Ciudad Autónoma de Buenos Aires" },
};

/** Event (pasado) de un workshop o edición. No emite nada si falta fecha o sede. */
export function WorkshopEventJsonLd({ etapa, imagen }: { etapa: Etapa; imagen?: string }) {
  const sede = etapa.slug ? SEDES_EVENT[etapa.slug] : undefined;
  const f = fechasDe(etapa.fecha ?? etapa.lugar);
  if (!sede || !f || !etapa.slug) return null;
  const nombre =
    etapa.slug === "primera-edicion" ? `${EVENT_NAME} · 1ª edición` : `${etapa.etapa} de Sweet Flowers · ${etapa.titulo}`;
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Event",
        name: nombre,
        description:
          etapa.resumen ??
          `Workshop presencial para decoradores y organizadores de eventos${etapa.temas?.length ? `: ${etapa.temas.join(", ")}` : ""}.`,
        url: `${SITE_URL}/event-summit/trayectoria/${etapa.slug}`,
        startDate: f.start,
        endDate: f.end,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: sede.name,
          address: { "@type": "PostalAddress", addressLocality: sede.locality, addressRegion: sede.region, addressCountry: "AR" },
        },
        organizer: ORGANIZER,
        ...(imagen && !imagen.startsWith("http") ? { image: abs(imagen) } : {}),
        inLanguage: "es-AR",
      }}
    />
  );
}
