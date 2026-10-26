import type { NextConfig } from "next";

// Caché larga para estáticos de /public. "immutable" → si un archivo cambia, se
// publica con NOMBRE NUEVO (ej. hero-m640.mp4, hero-poster-1600.avif), nunca
// pisando el mismo nombre.
const CACHE_INMUTABLE = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];

const nextConfig: NextConfig = {
  async headers() {
    // OJO: /productos también es una RUTA de páginas (/productos/hierro/...):
    // ahí solo se cachean los archivos de imagen, nunca el HTML.
    return [
      "/video/:path*",
      "/img/:path*",
      "/fonts/:path*",
      "/productos/:file([^/]+\\.(?:jpe?g|png|webp|avif))",
    ].map((source) => ({ source, headers: CACHE_INMUTABLE }));
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
    // Placeholders del boceto. TODO(contenido): al pasar a fotos reales,
    // preferir imports estáticos locales (width/height + blurDataURL automáticos)
    // y quitar este patrón remoto. Ver docs/11_SEO_STRATEGY.md + TODOs en secciones.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      // Fotos subidas desde el panel (Vercel Blob).
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/**" },
      // Avatares de Google (cuentas de clientes/staff).
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
    ],
    // AVIF con fallback a WebP para las secciones ya migradas a next/image.
    formats: ["image/avif", "image/webp"],
    // Anchos generados: sin 3840 (nada del sitio se muestra tan grande) → menos
    // variantes que optimizar. 2048 cubre fotos a pantalla completa en retina.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 2048],
    // Las versiones optimizadas se cachean 31 días (las fotos nuevas del panel
    // van a Vercel Blob con URL única; las de /public no se pisan por nombre).
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
