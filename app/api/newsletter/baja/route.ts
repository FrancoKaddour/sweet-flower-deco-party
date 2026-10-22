import { NextResponse } from "next/server";
import { darDeBaja } from "@/modules/newsletter/publico";

/**
 * Baja "en un clic" (RFC 8058): Gmail/Yahoo muestran un botón "Anular
 * suscripción" que hace POST acá. Un GET (link abierto a mano) va a la página
 * de confirmación.
 */
export async function POST(request: Request) {
  const t = new URL(request.url).searchParams.get("t") ?? "";
  await darDeBaja(t);
  return new NextResponse(null, { status: 200 });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const t = url.searchParams.get("t") ?? "";
  return NextResponse.redirect(new URL(`/newsletter/baja?t=${encodeURIComponent(t)}`, url.origin));
}
