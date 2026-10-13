import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El Summit se mudó de /evento a /event-summit (y /workshops es otra página).
  // Redirect permanente para no romper links viejos ni el SEO acumulado.
  async redirects() {
    return [{ source: "/evento", destination: "/event-summit", permanent: true }];
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
    ],
    // AVIF con fallback a WebP para las secciones ya migradas a next/image.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
