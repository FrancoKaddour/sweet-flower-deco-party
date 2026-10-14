import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { CATEGORIAS } from "@/content/catalogo";

/**
 * sitemap.xml — todas las páginas públicas. lastModified fijo por sección
 * (no new Date(): generaría "cambios" falsos en cada build). Actualizar la
 * fecha cuando cambie el contenido de esa sección.
 */
const UPDATED = "2026-10-14";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  ) => ({ url: `${SITE_URL}${path}`, lastModified: UPDATED, changeFrequency, priority });

  return [
    page("", 1, "weekly"),
    page("/productos", 0.9, "weekly"),
    ...CATEGORIAS.map((c) => page(`/productos/${c.slug}`, 0.8, "weekly")),
    page("/event-summit", 0.9, "weekly"),
    page("/workshops", 0.7, "monthly"),
    page("/contacto", 0.7, "monthly"),
    page("/historia", 0.5, "yearly"),
    page("/membresia", 0.4, "monthly"),
  ];
}
