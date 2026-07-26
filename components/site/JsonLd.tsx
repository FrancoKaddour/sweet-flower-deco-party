/**
 * Structured data (JSON-LD, schema.org) del sitio.
 *
 * SERVER component (sin "use client"): se renderiza en el servidor y emite un
 * <script type="application/ld+json"> con el @graph de la marca. Pensado para
 * incrustarse una sola vez (típicamente en el layout o la home).
 *
 * TODO(contenido): completar teléfono, dirección y redes reales antes de lanzar.
 */

// Tipamos el grafo como estructura JSON serializable (sin `any`).
type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

type JsonLdGraph = Record<string, JsonLdValue>;

export function JsonLd() {
  const data: JsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": "https://sweetflowersdecoparty.com/#organization",
        name: "Sweet Flowers Deco Party",
        url: "https://sweetflowersdecoparty.com",
        description:
          "Decoración de eventos y formación del rubro en Argentina. Escenografía, piezas a medida y workshops.",
        areaServed: {
          "@type": "Country",
          name: "Argentina",
        },
        knowsAbout: [
          "decoración de eventos",
          "escenografía",
          "workshops",
        ],
        // TODO(contenido): URLs reales de Instagram / WhatsApp / otras redes.
        sameAs: [],
        // TODO(contenido): teléfono de contacto real (formato E.164, ej. "+54911...").
        // telephone: "",
        // TODO(contenido): dirección / localidad real del negocio.
        // address: {
        //   "@type": "PostalAddress",
        //   addressCountry: "AR",
        //   addressLocality: "",
        //   addressRegion: "",
        //   streetAddress: "",
        // },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
