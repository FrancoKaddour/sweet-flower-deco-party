/**
 * /llms.txt — resumen del negocio en Markdown para asistentes de IA (ChatGPT,
 * Claude, Perplexity, Gemini). Estándar propuesto en llmstxt.org: les da los
 * datos clave sin tener que interpretar el diseño ni las animaciones.
 * Contenido: content/seo/llms.ts (SOLO datos confirmados). Versión completa: /llms-full.txt.
 */
import { llmsTxt } from "@/content/seo/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
