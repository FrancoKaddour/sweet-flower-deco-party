# 11 — SEO Strategy

> **Fuente de verdad de SEO** del proyecto. SEO técnico + SEO de contenido para un sitio premium editorial construido en **Next.js (App Router) + TypeScript**.
> Enlaza con: [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md) · [`04_SITE_ARCHITECTURE.md`](./04_SITE_ARCHITECTURE.md) · [`05_CONTENT_STRATEGY.md`](./05_CONTENT_STRATEGY.md) · [`10_TECH_STACK.md`](./10_TECH_STACK.md) · [`15_ROADMAP.md`](./15_ROADMAP.md) · [`16_DECISIONS.md`](./16_DECISIONS.md)

> **Regla mientras no haya contenido real:** todo dato duro (título real, descripción, fecha, cupo, disertante, precio) va marcado como `TODO(contenido)`. **No inventamos datos** que parezcan reales. El objetivo de este documento es dejar la **arquitectura de SEO lista** para que, cuando llegue el contenido de Flor, solo haya que rellenar valores.

---

## 0. Objetivo estratégico

Sweet Flowers Deco Party quiere ser **LA referente de decoración de eventos y formación del rubro en Argentina**. En términos de SEO eso significa dominar tres universos de búsqueda:

1. **Producto / e-commerce** — quien busca comprar o alquilar estructuras de hierro, MDF, madera, fundas y telas para decorar un evento.
2. **Formación / evento** — quien busca capacitarse (workshop, summit, mentoría) en el rubro de la decoración de eventos.
3. **Marca / autoridad** — quien ya conoce a Flor o al evento y busca la marca por su nombre (búsqueda *brand*).

El SEO no es una capa que se agrega al final: es una **consecuencia de la arquitectura**. Next.js App Router nos da las herramientas nativas (Metadata API, streaming, RSC) para hacerlo bien sin librerías extra.

---

## 1. SEO técnico en Next.js App Router

### 1.1 Metadata API — título y descripción por ruta

Cada ruta define su propia metadata. Usamos **metadata estática** (`export const metadata`) donde el contenido es fijo, y **`generateMetadata`** donde depende de datos (producto, edición del evento, artículo del blog).

**Metadata raíz** (`app/layout.tsx`) — define defaults heredables y `metadataBase` (obligatorio para que Open Graph resuelva URLs absolutas):

```ts
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sweetflowersdecoparty.com"), // TODO(contenido): dominio real
  title: {
    default: "Sweet Flowers Deco Party — Decoración de eventos & formación", // TODO(contenido)
    template: "%s · Sweet Flowers Deco Party",
  },
  description:
    "TODO(contenido): descripción maestra de marca (150–160 caracteres) redactada por Flor.",
  applicationName: "Sweet Flowers Deco Party",
  authors: [{ name: "Flor" }], // TODO(contenido): nombre completo
  creator: "Sweet Flowers Deco Party",
  publisher: "Sweet Flowers Deco Party",
  formatDetection: { telephone: false, address: false, email: false },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};
```

**Reglas de copy para metadata:**

| Elemento | Largo objetivo | Regla |
|---|---|---|
| `title` | 50–60 caracteres | Keyword principal + marca. Sin relleno. |
| `description` | 150–160 caracteres | Beneficio + diferenciador + llamada implícita. No es un resumen: es un anuncio. |
| `template` | — | `%s · Sweet Flowers Deco Party` para que cada página herede la marca al final. |

> **TODO(contenido):** Flor debe validar el título maestro y la descripción de marca. El resto de los títulos por ruta se derivan de la arquitectura de [`04_SITE_ARCHITECTURE.md`](./04_SITE_ARCHITECTURE.md).

### 1.2 `generateMetadata` para rutas dinámicas

Ejemplo para la ficha de un producto (`app/tienda/[slug]/page.tsx`):

```ts
// app/tienda/[slug]/page.tsx
import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug); // TODO(contenido): fuente real del catálogo

  if (!product) {
    return { title: "Producto no encontrado", robots: { index: false } };
  }

  return {
    title: product.name, // el template agrega " · Sweet Flowers Deco Party"
    description: product.seoDescription ?? product.shortDescription,
    alternates: { canonical: `/tienda/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.shortDescription,
      url: `/tienda/${product.slug}`,
      images: [
        {
          url: product.ogImage ?? product.mainImage, // 1200×630 ideal
          width: 1200,
          height: 630,
          alt: `${product.name} — Sweet Flowers Deco Party`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
      images: [product.ogImage ?? product.mainImage],
    },
  };
}
```

> Nota: en Next 15+ `params` es una `Promise` y se `await`ea. Mantener esa firma para evitar warnings.

### 1.3 Open Graph + Twitter Cards

Toda página compartible (home, tienda, ficha de producto, evento, artículo) debe tener OG y Twitter card. Reglas:

- **Imagen OG: 1200×630 px.** Para el evento y la home podemos generar imágenes OG dinámicas con `ImageResponse` (`next/og`) en un `opengraph-image.tsx`, reutilizando la tipografía de marca cuando esté definida.
- `twitter.card = "summary_large_image"` en todas las páginas con imagen destacada.
- El `alt` de la imagen OG es **real y descriptivo**, no el nombre del archivo.

```tsx
// app/opengraph-image.tsx  (OG dinámica de la home)
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%",
        background: "#TODO", color: "#TODO", alignItems: "center",
        justifyContent: "center", fontSize: 64 }}>
        Sweet Flowers Deco Party {/* TODO(contenido): claim real + fondo/paleta de marca */}
      </div>
    ),
    { ...size }
  );
}
```

### 1.4 JSON-LD Structured Data

Los datos estructurados le dicen a Google **qué es** cada página, y habilitan *rich results* (estrellas, precios, fechas de evento, breadcrumbs, FAQ). Se inyectan como `<script type="application/ld+json">`. En App Router, la forma recomendada es renderizar el script dentro del componente de servidor de cada página.

**Patrón de inyección seguro:**

```tsx
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

**Organization** (va en el layout raíz, una sola vez):

```ts
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sweet Flowers Deco Party",
  url: "https://www.sweetflowersdecoparty.com", // TODO(contenido)
  logo: "https://www.sweetflowersdecoparty.com/logo.png", // TODO(contenido): logo vectorial exportado
  description: "TODO(contenido): descripción de marca",
  founder: { "@type": "Person", name: "TODO(contenido): nombre completo de Flor" },
  areaServed: "AR",
  sameAs: [
    "TODO(contenido): URL Instagram",
    "TODO(contenido): URL LinkedIn",
    "TODO(contenido): otras redes (Flor pasa los @)",
  ],
};
```

**Product** (ficha de producto). `offers` refleja el precio: el **precio base va sin recargo**; con Mercado Pago se calcula `precio / (1 - 0.15)` ≈ **+18%** (ver `CONTENIDO_FLOR.md` §4). El schema debe reflejar el precio publicado de forma coherente:

```ts
const productLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  image: product.images,
  description: product.description,
  sku: product.sku,
  material: product.material, // hierro / MDF / madera / tela — TODO(contenido)
  brand: { "@type": "Brand", name: "Sweet Flowers Deco Party" },
  offers: {
    "@type": "Offer",
    priceCurrency: "ARS",
    price: product.price, // TODO(contenido): precio real; contemplar +15% por canal
    availability: product.inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/PreOrder", // "a medida" ≈ PreOrder / MadeToOrder
    url: `https://www.sweetflowersdecoparty.com/tienda/${product.slug}`,
  },
};
```

**Event** (la edición del 18/09). Este es el bloque más valioso para SEO porque habilita el *rich result* de evento en Google:

```ts
const eventLd = {
  "@context": "https://schema.org",
  "@type": "EducationalEvent", // formación; alternativa: "BusinessEvent"
  name: "TODO(contenido): nombre del evento — ver decisión abierta en 16_DECISIONS.md",
  description: "TODO(contenido): descripción de la 8va edición",
  startDate: "2026-09-18T00:00:00-03:00", // fecha 18/09; TODO(contenido): hora real
  endDate: "TODO(contenido): fecha/hora de fin",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", // TODO(contenido): presencial/híbrido
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: "TODO(contenido): venue",
    address: {
      "@type": "PostalAddress",
      addressLocality: "TODO(contenido): ciudad",
      addressRegion: "TODO(contenido): provincia",
      addressCountry: "AR",
    },
  },
  image: ["TODO(contenido): imagen del evento 1200×630"],
  organizer: {
    "@type": "Organization",
    name: "Sweet Flowers Deco Party",
    url: "https://www.sweetflowersdecoparty.com",
  },
  performer: [
    { "@type": "Person", name: "TODO(contenido): disertante 1" },
    { "@type": "Person", name: "TODO(contenido): disertante 2" },
  ],
  offers: {
    "@type": "Offer",
    url: "TODO(contenido): URL de inscripción / checkout",
    price: "TODO(contenido): precio de entrada",
    priceCurrency: "ARS",
    availability: "https://schema.org/InStock",
    validFrom: "TODO(contenido): apertura de inscripción",
  },
};
```

> **Importante:** Google penaliza el structured data que no coincide con el contenido visible. No publiques `EventLd` con datos inventados. Mientras no haya datos reales, este bloque queda comentado o detrás de un flag.

**BreadcrumbList** (navegación jerárquica; se genera desde la ruta):

```ts
const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.sweetflowersdecoparty.com/" },
    { "@type": "ListItem", position: 2, name: "Tienda", item: "https://www.sweetflowersdecoparty.com/tienda" },
    { "@type": "ListItem", position: 3, name: product.name, item: `https://www.sweetflowersdecoparty.com/tienda/${product.slug}` },
  ],
};
```

**FAQPage** (para la página del evento y para fichas con dudas frecuentes: "¿venden o alquilan?", "¿hacen a medida?", "¿envían al interior?"):

```ts
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "TODO(contenido): ¿Los productos se venden o se alquilan?",
      acceptedAnswer: { "@type": "Answer", text: "TODO(contenido): respuesta de Flor" },
    },
    {
      "@type": "Question",
      name: "TODO(contenido): ¿Hacen estructuras a medida?",
      acceptedAnswer: { "@type": "Answer", text: "TODO(contenido): respuesta de Flor" },
    },
  ],
};
```

### 1.5 sitemap.xml y robots.txt

Next App Router genera ambos de forma nativa con archivos convención en `app/`.

`app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.sweetflowersdecoparty.com";
  const staticRoutes = ["", "/tienda", "/evento", "/membresia", "/nosotros", "/blog"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const products = await getAllProducts(); // TODO(contenido): fuente real
  const productRoutes = products.map((p) => ({
    url: `${base}/tienda/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
```

`app/robots.ts`:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/checkout/", "/gracias"] },
    sitemap: "https://www.sweetflowersdecoparty.com/sitemap.xml",
  };
}
```

### 1.6 Canonical URLs

- Cada página declara su `alternates.canonical` (relativo; Next lo resuelve contra `metadataBase`).
- Evitamos contenido duplicado por parámetros (filtros de tienda, UTM): el canonical apunta siempre a la URL **limpia**.
- Una sola versión de dominio: elegir `www` o apex y **redirigir 301** la otra (config en Vercel). `TODO(contenido)`: decidir dominio canónico.

### 1.7 i18n es-AR

- `lang="es-AR"` en `<html>` (en `app/layout.tsx`).
- El sitio es **monolingüe español rioplatense**. No se planifica multi-idioma en el MVP, así que **no** se implementan `hreflang` alternativos (agregarían complejidad sin beneficio). Si en el futuro se abre a otros mercados hispanohablantes, se evalúa `es` genérico vs. variantes.
- Copys, fechas y moneda en formato AR (`ARS`, `dd/mm`, `$`).

### 1.8 Core Web Vitals como factor de ranking

Google usa CWV como señal. El stack (RSC + `next/image` + `next/font`) ya juega a favor; el riesgo real es el **motion** (GSAP/Lenis). Objetivos:

| Métrica | Objetivo | Riesgo en este proyecto | Mitigación |
|---|---|---|---|
| **LCP** ≤ 2.5 s | Hero editorial con imagen/video grande | `priority` en la imagen del hero, `next/image`, video con `poster` y `preload="none"` |
| **CLS** < 0.1 | Reveals con máscara, fuentes custom | reservar dimensiones (`width`/`height`/`aspect-ratio`), `next/font` con `display: swap` |
| **INP** < 200 ms | Lenis + ScrollTrigger en cada scroll | animar solo `transform`/`opacity`, no bloquear el hilo, `will-change` con criterio |

Ver reglas de motion en [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md) y de performance en [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md). **`prefers-reduced-motion` no es solo accesibilidad: también protege INP.**

### 1.9 Imágenes: `alt` real + `next/image`

- **Siempre `next/image`.** Da lazy-loading, `srcset` responsive y evita CLS.
- **`alt` real y descriptivo**, no el nombre del archivo. Ejemplo bueno: `alt="Arco de hierro con flores blancas para ceremonia de casamiento"`. Ejemplo malo: `alt="IMG_2043"`.
- Formatos modernos (AVIF/WebP) automáticos vía Next.
- Imágenes decorativas puras → `alt=""` (para lectores de pantalla), nunca omitir el atributo.
- Nombres de archivo con keywords: `arco-hierro-flores-casamiento.jpg`, no `foto1.jpg`. `TODO(contenido)`: renombrar assets al recibirlos.

---

## 2. Estrategia de keywords (rubro decoración de eventos + formación · Argentina)

> Estas son **hipótesis de intención** a validar con Search Console / Keyword Planner una vez publicado. No son volúmenes reales. `TODO(contenido)`: validar y priorizar con datos.

### 2.1 Mapa de intención por unidad de negocio

| Cluster | Intención | Keywords semilla (hipótesis) | Ruta destino |
|---|---|---|---|
| **Producto — compra** | Transaccional | "estructuras de hierro para eventos", "arcos para casamiento", "atriles MDF decoración", "fundas para sillas evento" | `/tienda`, fichas |
| **Producto — alquiler/medida** | Transaccional/comercial | "decoración de eventos a medida", "alquiler estructuras eventos [ciudad]" | `/tienda`, FAQ |
| **Formación — evento** | Comercial/informacional | "workshop decoración de eventos", "curso decoración de eventos Argentina", "capacitación ambientación eventos" | `/evento` |
| **Formación — marca del evento** | Brand | "Sweet Flowers Event Summit", "Sweet Flowers workshop" (según nombre definido) | `/evento` |
| **Autoridad / inspiración** | Informacional (blog) | "ideas decoración casamiento", "tendencias ambientación 2026", "cómo decorar un evento" | `/blog` |
| **Marca** | Brand | "Sweet Flowers Deco Party", "Flor [apellido] decoración" | `/`, `/nosotros` |

### 2.2 Long-tail y locales

- Modificadores locales: ciudad/provincia de operación (`TODO(contenido)`), "cerca mío", "envío al interior".
- Long-tail de alto valor por baja competencia: combinaciones material + ocasión ("arco de hierro para quince", "atril de madera para civil").
- Si hay local físico o retiro presencial: crear/optimizar **Google Business Profile** y usar `LocalBusiness` en schema.

### 2.3 Prioridad de ataque

1. **Brand** (fácil, alta conversión) — asegurar que la marca y el evento aparezcan #1 por su nombre.
2. **Long-tail transaccional de producto** — menos competencia, alta intención de compra.
3. **Formación** — diferenciador único; poca competencia orgánica en Argentina.
4. **Cabeza genérica de inspiración** — vía blog, a mediano plazo.

---

## 3. Contenido / blog para autoridad (topical authority)

El blog no es opcional: es el motor de autoridad temática que sostiene los rankings comerciales. Estrategia **pillar + cluster**.

| Pilar (página madre) | Clusters (artículos) | Objetivo SEO |
|---|---|---|
| "Guía de decoración de eventos" | tipos de estructuras, materiales (hierro vs MDF vs madera), cómo elegir según el evento | Capturar informacional y linkear a `/tienda` |
| "Detrás del Workshop/Summit" | ediciones pasadas, aprendizajes de disertantes, testimonios | Autoridad + brand del evento; alimenta LinkedIn (ver [`14_LINKEDIN_STRATEGY.md`](./14_LINKEDIN_STRATEGY.md)) |
| "Tendencias de ambientación" | tendencias por temporada/año, paletas, ocasiones | Tráfico de cabeza + frescura (contenido nuevo recurrente) |

**Reglas de contenido:**

- Cada artículo apunta a **una** keyword principal + variantes semánticas, con intención clara.
- Enlazado interno fuerte: artículos → fichas de producto → evento. El link interno reparte autoridad y guía al usuario por el funnel.
- E-E-A-T: firmar los artículos con la autora (Flor), mostrar experiencia real (fotos de sus eventos, casos), y citar las 7 ediciones previas como prueba de trayectoria.
- Cada artículo lleva su `Article`/`BlogPosting` JSON-LD, OG propia y `alt` reales.

> **TODO(contenido):** el blog depende del **texto real y las fotos de Flor**. Ver checklist en [`16_DECISIONS.md`](./16_DECISIONS.md) (carpetas 05_TEXTOS y 06_VIDEO). Sin contenido real, el blog no se lanza: se deja la ruta y la estructura de datos listas.

---

## 4. Checklist de implementación SEO

- [ ] `metadataBase` + `title.template` + descripción de marca en `app/layout.tsx`.
- [ ] `generateMetadata` en `/tienda/[slug]`, `/evento`, `/blog/[slug]`.
- [ ] OG estáticas + `opengraph-image.tsx` dinámica (home y evento).
- [ ] Twitter cards `summary_large_image`.
- [ ] JSON-LD: Organization (layout), Product (fichas), Event (evento), BreadcrumbList (todas las anidadas), FAQPage (evento + FAQ).
- [ ] `app/sitemap.ts` con rutas estáticas + productos dinámicos.
- [ ] `app/robots.ts` con disallow de `/api`, `/checkout`, `/gracias`.
- [ ] `canonical` por ruta; dominio canónico único con 301.
- [ ] `lang="es-AR"`.
- [ ] Core Web Vitals medidos (Lighthouse + campo real en Search Console).
- [ ] `alt` reales en todas las imágenes; `next/image` sin excepciones.
- [ ] Search Console + Bing Webmaster dados de alta; sitemap enviado.
- [ ] GA4 / analytics de privacidad configurado (ver [`15_ROADMAP.md`](./15_ROADMAP.md) Fase 4).

---

## 5. Dependencias y bloqueos

- **Contenido real de Flor** bloquea: descripciones reales, blog, alt reales, datos de Event/Product schema.
- **Decisión de e-commerce** (custom+Mercado Pago vs Tiendanube headless vs enlace) afecta el control sobre metadata y schema de producto: si es **enlace a Tiendanube**, el SEO de fichas vive fuera de nuestro sitio y perdemos ese control. Ver decisión abierta en [`16_DECISIONS.md`](./16_DECISIONS.md).
- **Nombre del evento** sin definir bloquea el schema `Event.name` y la keyword *brand* del evento. Ver [`16_DECISIONS.md`](./16_DECISIONS.md).

> Este documento es **vivo**. Cuando lleguen los datos reales, se reemplazan los `TODO(contenido)` y se actualiza la fecha de versión.
