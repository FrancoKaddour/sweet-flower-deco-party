import type { MetadataRoute } from "next";
import { SITE_URL, IS_INDEXABLE } from "@/lib/site";

/**
 * robots.txt — producción abierta a buscadores Y a los bots de IA (para que
 * ChatGPT, Claude, Perplexity, Gemini y Copilot puedan leer y recomendar el
 * sitio). Previews de Vercel y local: cerrado. El panel nunca se indexa.
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
  if (!IS_INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/panel", "/api/"] },
      { userAgent: AI_BOTS, allow: "/", disallow: ["/panel", "/api/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
