// Datos del sitio y del negocio — fuente única para SEO, JSON-LD, llms.txt y OG.
// Datos del negocio: docs/CONTENIDO_FLOR.md + relevamiento con Flor (jul-2026).
import type { Metadata } from "next";

/**
 * URL pública del sitio. En Vercel se toma sola del dominio de producción
 * (VERCEL_PROJECT_PRODUCTION_URL): cuando se conecte el dominio propio, todo
 * (canonical, OG, sitemap, JSON-LD) pasa a usarlo sin tocar código.
 * NEXT_PUBLIC_SITE_URL lo pisa si hiciera falta.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://sweet-flower-deco-party.vercel.app")
).replace(/\/$/, "");

/**
 * ¿Google puede indexar? Hoy NO: el sitio tiene fotos y textos de relleno.
 * Los bots SÍ pueden leerlo (robots.txt abierto), así funcionan las vistas
 * previas de WhatsApp/redes y las IAs que leen el link en vivo; solo se pide
 * "noindex" para que no quede guardado en Google con contenido provisorio.
 *
 * LANZAMIENTO: en Vercel → Settings → Environment Variables, agregar
 * NEXT_PUBLIC_INDEX = 1 (Production) y redeployar. Sin tocar código.
 */
export const IS_INDEXABLE =
  process.env.VERCEL_ENV === "production" && process.env.NEXT_PUBLIC_INDEX === "1";

export const SITE_NAME = "Sweet Flowers Deco Party";
export const SITE_TAGLINE = "Decoración de eventos";

/** Descripción madre (≈155 caracteres) — la que usan Google, WhatsApp y las IAs. */
export const SITE_DESCRIPTION =
  "Fabricamos estructuras de hierro, catering, pies de lámpara, fundas y telas sublimadas para decoradores y organizadores de eventos. Envíos a todo el país.";

export const BUSINESS = {
  founder: "Florencia (Flor) Cabanillas",
  locality: "Tortuguitas",
  region: "Buenos Aires",
  country: "AR",
  instagram: "https://www.instagram.com/sweetflowersdecoparty/",
  instagramHandle: "@sweetflowersdecoparty",
  // WhatsApp por línea (formato E.164).
  phoneVentas: "+5491151064010",
  phoneCapacitaciones: "+5491155127508",
  shipping: "Envíos a todo el país (Vía Cargo, Buspack, MD, FlechaBus)",
  leadTime: "Por encargo, alrededor de 20 días",
} as const;

/**
 * Metadata de una página interna: título, descripción, canonical y OG/Twitter
 * propios. (Next NO mezcla openGraph entre layout y página: si la página no lo
 * define, hereda el de la home y al compartir aparece el título del inicio.)
 */
export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
}: {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
}): Metadata {
  const shareTitle = ogTitle ?? `${title} · ${SITE_NAME}`;
  // Imagen por defecto = la del sitio (app/opengraph-image.tsx). Sin esto, al
  // definir openGraph acá la página se queda SIN og:image. Las páginas con su
  // propio opengraph-image.tsx (Summit, landings) la pisan solas.
  const images = [{ url: "/opengraph-image", width: 1200, height: 630, alt: shareTitle }];
  return {
    title,
    description,
    alternates: { canonical: path, languages: { "es-AR": path, "x-default": path } },
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: SITE_NAME,
      url: path,
      title: shareTitle,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images },
  };
}
