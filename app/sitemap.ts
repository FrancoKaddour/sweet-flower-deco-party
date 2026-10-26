import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ETAPAS_CON_PAGINA } from "@/content/evento";
import { getCategorias, getTodosLosProductos } from "@/modules/catalog/repository";
import { LANDINGS } from "@/content/seo/landings";

/**
 * sitemap.xml — todas las páginas públicas. lastModified fijo por sección
 * (no new Date(): generaría "cambios" falsos en cada build). Actualizar la
 * fecha cuando cambie el contenido de esa sección.
 */
const UPDATED = "2026-10-26";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [CATEGORIAS, PRODUCTOS] = await Promise.all([getCategorias(), getTodosLosProductos()]);
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    img?: string | null,
  ) => ({
    url: `${SITE_URL}${path}`,
    lastModified: UPDATED,
    changeFrequency,
    priority,
    // Image sitemap: Google Imágenes descubre las fotos reales de cada página.
    ...(img ? { images: [img.startsWith("http") ? img : `${SITE_URL}${img}`] } : {}),
  });

  return [
    page("", 1, "weekly"),
    page("/productos", 0.9, "weekly"),
    ...CATEGORIAS.map((c) => page(`/productos/${c.slug}`, 0.8, "weekly", c.img)),
    ...PRODUCTOS.map((p) => page(`/productos/${p.categoria}/${p.slug}`, 0.6, "weekly", p.img)),
    // Landings SEO por intención y zona (content/seo/landings.ts).
    ...LANDINGS.map((l) => page(`/${l.slug}`, l.grupo === "zonas" ? 0.7 : 0.8, "monthly", l.imagen.src)),
    page("/preguntas-frecuentes", 0.7, "monthly"),
    page("/resenas", 0.4, "monthly"),
    page("/event-summit", 0.9, "weekly"),
    ...ETAPAS_CON_PAGINA.map((e) => page(`/event-summit/trayectoria/${e.slug}`, 0.6, "monthly")),
    page("/contacto", 0.7, "monthly"),
    page("/historia", 0.5, "yearly"),
  ];
}
