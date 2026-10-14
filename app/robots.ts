import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt — producción abierta a buscadores Y a los bots de IA (para que
 * ChatGPT, Claude, Perplexity, Gemini y Copilot puedan leer y recomendar el
 * sitio). Qué se guarda en Google lo decide el meta robots (IS_INDEXABLE).
 * El panel nunca se rastrea.
 */
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  // Siempre abierto al rastreo (si se bloquea, WhatsApp e Instagram no pueden
  // armar la vista previa del link). Mientras IS_INDEXABLE sea false, cada
  // página lleva <meta name="robots" content="noindex"> (ver app/layout.tsx).
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/panel", "/api/"] },
      { userAgent: AI_BOTS, allow: "/", disallow: ["/panel", "/api/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
