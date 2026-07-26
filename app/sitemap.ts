import type { MetadataRoute } from "next";

/**
 * sitemap.xml generado por Next (App Router).
 *
 * BOCETO: por ahora solo publicamos la home. Usamos una fecha fija como
 * `lastModified` para evitar que el sitemap cambie en cada build (no usar
 * `new Date()` sin argumentos: generaría diffs y "cambios" falsos).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://sweetflowersdecoparty.com",
      lastModified: "2026-01-01",
      changeFrequency: "monthly",
      priority: 1,
    },
    // TODO(rutas): agregar cuando existan las páginas correspondientes.
    // {
    //   url: "https://sweetflowersdecoparty.com/productos",
    //   lastModified: "2026-01-01",
    //   changeFrequency: "weekly",
    //   priority: 0.8,
    // },
    // {
    //   url: "https://sweetflowersdecoparty.com/productos/[slug]",
    //   lastModified: "2026-01-01",
    //   changeFrequency: "weekly",
    //   priority: 0.7,
    // },
    // {
    //   url: "https://sweetflowersdecoparty.com/evento",
    //   lastModified: "2026-01-01",
    //   changeFrequency: "monthly",
    //   priority: 0.7,
    // },
    // {
    //   url: "https://sweetflowersdecoparty.com/membresia",
    //   lastModified: "2026-01-01",
    //   changeFrequency: "monthly",
    //   priority: 0.7,
    // },
  ];
}
