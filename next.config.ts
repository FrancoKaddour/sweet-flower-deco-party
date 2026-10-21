import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  },
};

export default nextConfig;
