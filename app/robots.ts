import type { MetadataRoute } from "next";

/**
 * robots.txt generado por Next (App Router).
 *
 * BOCETO: por ahora el sitio NO debe indexarse. Bloqueamos todo el crawling.
 * TODO(lanzamiento): al salir a producción cambiar `disallow: "/"` por
 * `allow: "/"` (y ajustar reglas por bot si hiciera falta).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
      // TODO(lanzamiento): reemplazar por `allow: "/"` cuando el sitio sea público.
    },
    sitemap: "https://sweetflowersdecoparty.com/sitemap.xml",
  };
}
