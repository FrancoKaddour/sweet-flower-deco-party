/**
 * /llms-full.txt — versión completa para IA: datos del negocio, todas las
 * preguntas frecuentes, guías por tema (landings), trayectoria del Summit y el
 * catálogo con precios. Se regenera cada hora (el catálogo se edita en el panel).
 */
import { llmsFullTxt } from "@/content/seo/llms";
import { getTodosLosProductos } from "@/modules/catalog/repository";

export const revalidate = 3600;

export async function GET() {
  const productos = await getTodosLosProductos();
  return new Response(llmsFullTxt(productos), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
