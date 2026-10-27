import { getSession } from "@/lib/dal";
import { limitar } from "@/lib/rate-limit";
import { exportarDatos } from "@/modules/cuenta/datos";

/**
 * "Descargar mis datos" (Ley 25.326, derecho de acceso): JSON con todo lo que
 * guardamos de la persona de la sesión. Nunca se cachea.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const s = await getSession().catch(() => null);
  if (!s?.user?.id || !s.user.email) return new Response("Ingresá a tu cuenta para descargar tus datos.", { status: 401 });
  if (!(await limitar(`exportar:${s.user.id}`, 10, 3600))) return new Response("Probá de nuevo en un rato.", { status: 429 });
  try {
    const datos = await exportarDatos(s.user.id, s.user.email);
    if (!datos) return new Response("No pudimos leer tus datos ahora.", { status: 503 });
    const fecha = new Date().toISOString().slice(0, 10);
    return new Response(JSON.stringify(datos, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="sweet-flowers-mis-datos-${fecha}.json"`,
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch (e) {
    console.error("[cuenta] exportar", e instanceof Error ? e.message : e);
    return new Response("No pudimos leer tus datos ahora. Probá de nuevo en un rato.", { status: 503 });
  }
}
