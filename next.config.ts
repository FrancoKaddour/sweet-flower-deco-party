import type { NextConfig } from "next";

// Caché larga para estáticos de /public. "immutable" → si un archivo cambia, se
// publica con NOMBRE NUEVO (ej. hero-m640.mp4, hero-poster-1600.avif), nunca
// pisando el mismo nombre.
const CACHE_INMUTABLE = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];

// Headers de seguridad (S-20) en todas las respuestas.
// CSP ACTIVA (nov-2026): se activó después de recorrer producción en modo
// report-only sin ninguna violación (inicio, productos, ficha, Summit, reel de
// Instagram, contacto con captcha, historia, ingresar, login del panel, 404).
// 'unsafe-inline' en scripts: Next mete scripts inline (datos de RSC) y el
// layout tiene uno propio; sacarlo exige nonce por request = todo dinámico (se
// pierde ISR/estático). Igual bloquea scripts de otros dominios, envío de datos
// a hosts ajenos (connect-src), formularios desviados (form-action) y framing.
// Si algo nuevo de afuera deja de cargar, agregar su dominio ACÁ.
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://lh3.googleusercontent.com https://*.mercadopago.com https://*.mlstatic.com",
  "media-src 'self' blob:",
  "font-src 'self' data:",
  // vercel.com/api/blob + *.blob.vercel-storage.com: subida de fotos del panel
  // (el navegador sube directo a Vercel Blob, components/panel/subirImagen.ts).
  "connect-src 'self' https://vitals.vercel-insights.com https://*.mercadopago.com https://*.mercadopago.com.ar https://challenges.cloudflare.com https://vercel.com https://*.blob.vercel-storage.com",
  // challenges.cloudflare.com: captcha Turnstile (lib/captcha.ts).
  "frame-src 'self' https://www.instagram.com https://*.mercadopago.com https://*.mercadopago.com.ar https://challenges.cloudflare.com",
  "form-action 'self' https://accounts.google.com https://*.mercadopago.com https://*.mercadopago.com.ar",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const SEGURIDAD = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  // Sin "preload": eso compromete el dominio en las listas de los navegadores (decisión aparte).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Content-Security-Policy", value: CSP },
];

const nextConfig: NextConfig = {
  async headers() {
    // OJO: /productos también es una RUTA de páginas (/productos/hierro/...):
    // ahí solo se cachean los archivos de imagen, nunca el HTML.
    return [
      { source: "/:path*", headers: SEGURIDAD },
      ...[
        "/video/:path*",
        "/img/:path*",
        "/fonts/:path*",
        "/productos/:file([^/]+\\.(?:jpe?g|png|webp|avif))",
      ].map((source) => ({ source, headers: CACHE_INMUTABLE })),
    ];
  },
  // El Summit se mudó de /evento a /event-summit (y /workshops es otra página).
  // Redirect permanente para no romper links viejos ni el SEO acumulado.
  async redirects() {
    return [
      { source: "/evento", destination: "/event-summit", permanent: true },
      // Los workshops terminaron (fueron 7): su historia vive en la trayectoria del Summit.
      { source: "/workshops", destination: "/event-summit#trayectoria", permanent: false },
      // Membresía fuera del sitio (oct-2026): se simplifica todo a WhatsApp.
      { source: "/membresia", destination: "/", permanent: false },
    ];
  },
  images: {
    // Solo orígenes propios (picsum se sacó en nov-2026: ya no hay placeholders).
    remotePatterns: [
      // Fotos subidas desde el panel (Vercel Blob). TODO(S-20): fijar el hostname
      // EXACTO del store (<id>.public.blob.vercel-storage.com, se ve en Vercel →
      // Storage o en la URL de cualquier foto subida) para que nadie use el
      // optimizador con imágenes de otro store.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/**" },
      // Avatares de Google (cuentas de clientes/staff).
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
    ],
    // AVIF con fallback a WebP para las secciones ya migradas a next/image.
    formats: ["image/avif", "image/webp"],
    // Anchos generados: sin 3840 (nada del sitio se muestra tan grande) → menos
    // variantes que optimizar. 2048 cubre fotos a pantalla completa en retina.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 2048],
    // Calidad de compresión: 85 en todo el sitio (Next usa 75 por defecto y
    // en fotos grandes se notaba el pixelado). Next elige el valor permitido
    // más cercano, así que todas las imágenes salen a 85.
    qualities: [85],
    // Las versiones optimizadas se cachean 31 días (las fotos nuevas del panel
    // van a Vercel Blob con URL única; las de /public no se pisan por nombre).
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
