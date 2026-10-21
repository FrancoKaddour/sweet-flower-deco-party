import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy (ex middleware, Next 16) — PRIMERA barrera, optimista: si no hay
 * cookie de sesión, manda al login sin tocar la base. La verificación real
 * (sesión válida + rol) la hace el DAL en cada página/acción (lib/dal.ts).
 */
const COOKIES = ["authjs.session-token", "__Secure-authjs.session-token"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const tieneSesion = COOKIES.some((c) => req.cookies.has(c));
  if (tieneSesion) return NextResponse.next();

  if (pathname.startsWith("/panel") && !pathname.startsWith("/panel/login")) {
    return NextResponse.redirect(new URL("/panel/login", req.url));
  }
  if (pathname.startsWith("/cuenta")) {
    const url = new URL("/ingresar", req.url);
    url.searchParams.set("volver", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/panel/:path*", "/cuenta/:path*"] };
