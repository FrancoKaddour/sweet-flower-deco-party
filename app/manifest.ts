import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

/**
 * Web App Manifest (/manifest.webmanifest): nombre, colores e íconos para
 * "Agregar a inicio" (Android/Chrome) y señales de marca para buscadores.
 * display "browser": es un sitio, no una app (sin modo standalone).
 * Íconos: public/icons/ (generados desde public/brand/logo-mark-full.png).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Sweet Flowers",
    description: SITE_DESCRIPTION,
    lang: "es-AR",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#f7f3ec",
    theme_color: "#f7f3ec",
    categories: ["shopping", "business", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
