import "server-only";
import { enviarEmail } from "@/lib/email/enviar";
import { esc } from "@/lib/email/plantillas";
import { SITE_URL } from "@/lib/site";

/**
 * Avisos internos al equipo (S-21 / P-25): sobrecupo, monto inválido, mail de
 * entrada que falló, webhook con error, inscripción pagada y consulta nueva.
 *
 * Destinatarios: EMAIL_EQUIPO (emails separados por coma) o, si falta, los de
 * PANEL_SUPERADMINS. Sin clave de Resend queda en "modo prueba": se registra en
 * el log y no se envía. Nunca tira error (una alerta no puede romper un cobro).
 * No mandar DNI ni datos de tarjeta en `datos`.
 */

type Datos = Record<string, string | number | boolean | null | undefined>;

const lista = (v?: string) =>
  (v ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e));

export function destinatariosEquipo(): string[] {
  const equipo = lista(process.env.EMAIL_EQUIPO);
  return equipo.length ? equipo : lista(process.env.PANEL_SUPERADMINS);
}

export async function alertarEquipo(asunto: string, datos: Datos = {}, link?: string): Promise<void> {
  try {
    const para = destinatariosEquipo();
    console.warn(`[alerta] ${asunto}`);
    if (!para.length) return;
    const filas = Object.entries(datos).filter(([, v]) => v !== undefined && v !== null && v !== "");
    const url = link ? (link.startsWith("http") ? link : `${SITE_URL}${link}`) : `${SITE_URL}/panel`;
    const html = `<!doctype html><html lang="es"><body style="margin:0;padding:24px;background:#f7f3ec;font-family:Helvetica,Arial,sans-serif;color:#14110f;">
<div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e4ddd1;border-radius:16px;padding:28px;">
<p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c6a15b;">Aviso del sitio</p>
<h1 style="margin:0 0 18px;font-size:22px;line-height:1.25;">${esc(asunto)}</h1>
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;line-height:1.5;">
${filas.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#736d64;vertical-align:top;white-space:nowrap;">${esc(k)}</td><td style="padding:4px 0;">${esc(String(v))}</td></tr>`).join("")}
</table>
<p style="margin:22px 0 0;"><a href="${esc(url)}" style="color:#14110f;font-weight:600;">Abrir el panel →</a></p>
</div></body></html>`;
    const texto = `${asunto}\n\n${filas.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${url}`;
    await Promise.all(para.map((to) => enviarEmail({ to, subject: `[Sweet Flowers] ${asunto}`, html, text: texto })));
  } catch (e) {
    console.error("[alerta] no se pudo avisar", e instanceof Error ? e.message : e);
  }
}
