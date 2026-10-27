import "server-only";
import { ipCliente } from "@/lib/rate-limit";

/**
 * Captcha con Cloudflare Turnstile, sin paquetes (ver docs/SETUP_BACKEND.md).
 *
 * - Sin `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: no se muestra ni se exige (todo
 *   funciona como hoy).
 * - Con la clave pública: el servidor EXIGE un token válido. El widget del
 *   formulario (components/captcha/Turnstile.tsx) lo manda en el campo oculto
 *   `cf-turnstile-response`.
 * - Fail-open solo ante fallas de Cloudflare (timeout de 8 s, 5xx, red) o si
 *   falta `TURNSTILE_SECRET_KEY`: un captcha caído nunca tiene que frenar una
 *   venta; el rate limit sigue de respaldo. Un token inválido o vencido SIEMPRE
 *   se rechaza.
 */

const VERIFICAR = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Campo que agrega el widget al formulario. */
export const CAMPO_CAPTCHA = "cf-turnstile-response";

export const MENSAJE_CAPTCHA = "No pudimos comprobar que no seas un robot. Esperá unos segundos y probá de nuevo.";

export const captchaExigido = () => Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

export async function verificarCaptcha(token: unknown, ip?: string | null): Promise<boolean> {
  if (!captchaExigido()) return true;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("[captcha] hay NEXT_PUBLIC_TURNSTILE_SITE_KEY pero falta TURNSTILE_SECRET_KEY: no se verifica");
    return true;
  }
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  try {
    const body = new URLSearchParams({ secret, response: token, idempotency_key: crypto.randomUUID() });
    if (ip && ip !== "desconocida") body.set("remoteip", ip);
    const r = await fetch(VERIFICAR, { method: "POST", body, cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!r.ok) {
      console.error("[captcha] Cloudflare respondió", r.status, "(se deja pasar)");
      return true;
    }
    const d = (await r.json()) as { success?: boolean; "error-codes"?: string[] };
    if (d.success !== true) console.warn("[captcha] rechazado", d["error-codes"]?.join(",") ?? "");
    return d.success === true;
  } catch (e) {
    console.error("[captcha] sin respuesta de Cloudflare (se deja pasar)", e instanceof Error ? e.message : e);
    return true;
  }
}

/** Atajo para Server Actions con FormData: toma el token del form y la IP del request. */
export async function captchaDelForm(fd: FormData): Promise<boolean> {
  if (!captchaExigido()) return true;
  return verificarCaptcha(fd.get(CAMPO_CAPTCHA), await ipCliente());
}
