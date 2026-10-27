import "server-only";
import { SITE_URL } from "@/lib/site";

/**
 * Envío de emails por Resend (API HTTP, sin dependencias extra).
 * Variables: RESEND_API_KEY (o AUTH_RESEND_KEY) y EMAIL_FROM, con un dominio
 * propio verificado en Resend (ver docs/NEWSLETTER.md). Sin clave, no se envía
 * nada: se registra en el log y la app sigue funcionando ("modo prueba").
 */

const KEY = () => process.env.RESEND_API_KEY ?? process.env.AUTH_RESEND_KEY;
const FROM = () => process.env.EMAIL_FROM ?? "Sweet Flowers <hola@sweetflowers.com.ar>";
const REPLY_TO = () => process.env.EMAIL_REPLY_TO;

export const envioHabilitado = () => Boolean(KEY());

/** Corte de cada llamada a Resend (si tarda más, se da por fallida y se reintenta después). */
const TIMEOUT_MS = 8000;

/** Para los logs: nunca el email completo (dato personal). */
const ocultar = (email: string) => email.replace(/^(.).*(@.*)$/, "$1***$2");

/** Base absoluta para links e imágenes de los mails. */
export const BASE_URL = SITE_URL;

export type Mensaje = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Link de baja en un clic (Gmail/Yahoo lo exigen en envíos masivos). */
  bajaUrl?: string;
};

function payload(m: Mensaje) {
  return {
    from: FROM(),
    to: [m.to],
    subject: m.subject,
    html: m.html,
    text: m.text,
    ...(REPLY_TO() ? { reply_to: REPLY_TO() } : {}),
    ...(m.bajaUrl
      ? {
          headers: {
            "List-Unsubscribe": `<${m.bajaUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        }
      : {}),
  };
}

/** Un mail. Devuelve ok=false si falló o si no hay clave configurada. */
export async function enviarEmail(m: Mensaje): Promise<{ ok: boolean; simulado?: boolean }> {
  const key = KEY();
  if (!key) {
    console.info(`[email] (sin RESEND_API_KEY, no se envía) → ${ocultar(m.to)}: ${m.subject}`);
    return { ok: false, simulado: true };
  }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload(m)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!r.ok) console.error("[email] Resend respondió", r.status);
    return { ok: r.ok };
  } catch (e) {
    console.error("[email]", e instanceof Error ? e.name : e);
    return { ok: false };
  }
}

/**
 * Envío masivo en lotes de 100 (límite de Resend). Devuelve enviados/fallidos y
 * `okIdx`: los índices (en `mensajes`) que salieron bien, para marcar solo esos.
 */
export async function enviarLote(
  mensajes: Mensaje[],
): Promise<{ enviados: number; fallidos: number; okIdx: number[]; simulado?: boolean }> {
  const key = KEY();
  if (!key) {
    console.info(`[email] (sin RESEND_API_KEY) campaña simulada a ${mensajes.length} destinatarios`);
    return { enviados: 0, fallidos: 0, okIdx: [], simulado: true };
  }
  let enviados = 0;
  let fallidos = 0;
  const okIdx: number[] = [];
  for (let i = 0; i < mensajes.length; i += 100) {
    const lote = mensajes.slice(i, i + 100);
    try {
      const r = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify(lote.map(payload)),
        signal: AbortSignal.timeout(TIMEOUT_MS * 2),
      });
      if (r.ok) {
        enviados += lote.length;
        lote.forEach((_, j) => okIdx.push(i + j));
      } else {
        fallidos += lote.length;
        console.error("[email] lote falló", r.status);
      }
    } catch (e) {
      fallidos += lote.length;
      console.error("[email] lote", e instanceof Error ? e.name : e);
    }
    // Respetar el límite de velocidad de Resend entre lotes.
    if (i + 100 < mensajes.length) await new Promise((res) => setTimeout(res, 600));
  }
  return { enviados, fallidos, okIdx };
}
