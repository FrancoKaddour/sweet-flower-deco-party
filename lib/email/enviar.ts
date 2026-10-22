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
    console.info(`[email] (sin RESEND_API_KEY, no se envía) → ${m.to}: ${m.subject}`);
    return { ok: false, simulado: true };
  }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload(m)),
    });
    if (!r.ok) console.error("[email] Resend respondió", r.status, await r.text());
    return { ok: r.ok };
  } catch (e) {
    console.error("[email]", e);
    return { ok: false };
  }
}

/** Envío masivo en lotes de 100 (límite de Resend). Devuelve enviados/fallidos. */
export async function enviarLote(mensajes: Mensaje[]): Promise<{ enviados: number; fallidos: number; simulado?: boolean }> {
  const key = KEY();
  if (!key) {
    console.info(`[email] (sin RESEND_API_KEY) campaña simulada a ${mensajes.length} destinatarios`);
    return { enviados: 0, fallidos: 0, simulado: true };
  }
  let enviados = 0;
  let fallidos = 0;
  for (let i = 0; i < mensajes.length; i += 100) {
    const lote = mensajes.slice(i, i + 100);
    try {
      const r = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify(lote.map(payload)),
      });
      if (r.ok) enviados += lote.length;
      else {
        fallidos += lote.length;
        console.error("[email] lote falló", r.status, await r.text());
      }
    } catch (e) {
      fallidos += lote.length;
      console.error("[email] lote", e);
    }
    // Respetar el límite de velocidad de Resend entre lotes.
    if (i + 100 < mensajes.length) await new Promise((res) => setTimeout(res, 600));
  }
  return { enviados, fallidos };
}
