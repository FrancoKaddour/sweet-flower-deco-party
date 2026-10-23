// Plantillas de email de Sweet Flowers — HTML de tablas con estilos inline (lo
// único que respetan Gmail, Outlook y Apple Mail). Funciones puras: las usa el
// server para enviar y el panel para la vista previa en vivo.

import { CLUB, DESCUENTO_BIENVENIDA } from "@/content/newsletter";

const C = {
  ink: "#14110f",
  bone: "#f7f3ec",
  cloud: "#ffffff",
  rojo: "#ED1C23",
  bordeaux: "#7A1218",
  champagne: "#c6a15b",
  muted: "#736d64",
  line: "#e4ddd1",
  sand: "#efe7d6",
};
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export type Correo = { asunto: string; html: string; texto: string };

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Absolutiza rutas internas ("/productos") con la URL del sitio. */
export const abs = (base: string, url: string) => (/^https?:\/\//.test(url) ? url : `${base}${url.startsWith("/") ? "" : "/"}${url}`);

/** Reemplaza {nombre} y {codigo} (con un saludo neutro si no hay nombre). */
export function personalizar(s: string, v: { nombre?: string | null; codigo?: string | null }) {
  const nombre = v.nombre?.trim().split(" ")[0] || "";
  return s
    .replace(/Hola \{nombre\},/g, nombre ? `Hola ${nombre},` : "Hola,")
    .replace(/\{nombre\}, /g, nombre ? `${nombre}, ` : "")
    .replace(/\{nombre\}/g, nombre || "")
    .replace(/\{codigo\}/g, v.codigo ?? "");
}

/** Texto plano → HTML: párrafos por línea en blanco, "- " = viñetas, **negrita**. */
export function cuerpoHtml(texto: string) {
  const bloques = esc(texto.trim()).split(/\n\s*\n/);
  const p = `margin:0 0 18px;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.ink};`;
  return bloques
    .map((b) => {
      const lineas = b.split("\n");
      const fmt = (l: string) => l.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      if (lineas.every((l) => l.trim().startsWith("- "))) {
        const items = lineas
          .map((l) => `<li style="margin:0 0 8px;padding-left:4px;">${fmt(l.trim().slice(2))}</li>`)
          .join("");
        return `<ul style="${p}padding-left:20px;">${items}</ul>`;
      }
      return `<p style="${p}">${lineas.map(fmt).join("<br>")}</p>`;
    })
    .join("");
}

function boton(texto: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 8px;"><tr><td style="background:${C.ink};border-radius:999px;">
<a href="${esc(href)}" style="display:inline-block;padding:15px 30px;font-family:${SANS};font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${C.bone};text-decoration:none;">${esc(texto)} &nbsp;↗</a>
</td></tr></table>`;
}

/** Marco común: logo, contenido, pie con datos y baja. */
export function layout({
  base,
  preheader,
  contenido,
  bajaUrl,
  motivo,
}: {
  base: string;
  preheader?: string;
  contenido: string;
  bajaUrl?: string;
  /** Por qué recibe el mail (obligatorio en marketing). */
  motivo: string;
}) {
  const pre = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}${"&nbsp;&zwnj;".repeat(40)}</div>`
    : "";
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Sweet Flowers</title></head>
<body style="margin:0;padding:0;background:${C.bone};">
${pre}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bone};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
<tr><td align="center" style="padding:0 0 24px;">
<a href="${base}" style="text-decoration:none;"><img src="${base}/brand/logo-mark-full.png" width="120" alt="Sweet Flowers Deco Party" style="display:block;width:120px;height:auto;border:0;"></a>
</td></tr>
<tr><td style="background:${C.cloud};border-radius:20px;padding:40px 36px;border:1px solid ${C.line};">
${contenido}
</td></tr>
<tr><td align="center" style="padding:28px 12px 0;font-family:${SANS};font-size:12px;line-height:1.7;color:${C.muted};">
<a href="https://www.instagram.com/sweetflowersdecoparty/" style="color:${C.ink};text-decoration:none;font-weight:600;">Instagram</a>
&nbsp;·&nbsp;<a href="${base}/productos" style="color:${C.ink};text-decoration:none;font-weight:600;">Catálogo</a>
&nbsp;·&nbsp;<a href="https://wa.me/5491151064010" style="color:${C.ink};text-decoration:none;font-weight:600;">WhatsApp</a><br>
Sweet Flowers Deco Party · Tortuguitas, Buenos Aires · Envíos a todo el país<br>
${esc(motivo)}${bajaUrl ? `<br><a href="${esc(bajaUrl)}" style="color:${C.muted};">Darme de baja</a>` : ""}
</td></tr>
</table></td></tr></table></body></html>`;
}

const eyebrow = (t: string) =>
  `<p style="margin:0 0 14px;font-family:${SANS};font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${C.champagne};">✧ ${esc(t)}</p>`;
const h1 = (t: string) =>
  `<h1 style="margin:0 0 22px;font-family:${SERIF};font-size:34px;line-height:1.05;font-weight:700;color:${C.ink};">${esc(t)}</h1>`;

/* ─────────────── Automáticos ─────────────── */

export function correoBienvenidaClub(v: { base: string; nombre?: string | null; codigo: string; bajaUrl: string }): Correo {
  const nombre = v.nombre?.trim().split(" ")[0];
  const contenido = `${eyebrow(CLUB.nombre)}
${h1(nombre ? `¡Bienvenida, ${nombre}!` : "¡Bienvenida al club!")}
<p style="margin:0 0 24px;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.ink};">Gracias por sumarte. Como prometimos, acá tenés tu código para el primer pedido:</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;"><tr><td align="center" style="background:${C.sand};border:1px dashed ${C.champagne};border-radius:16px;padding:26px 16px;">
<p style="margin:0 0 6px;font-family:${SANS};font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${C.muted};">${DESCUENTO_BIENVENIDA}% off en tu primer pedido</p>
<p style="margin:0;font-family:'Courier New',monospace;font-size:30px;font-weight:700;letter-spacing:4px;color:${C.bordeaux};">${esc(v.codigo)}</p>
</td></tr></table>
<p style="margin:0 0 10px;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.ink};"><strong>Cómo usarlo:</strong></p>
<ol style="margin:0 0 24px;padding-left:20px;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.ink};">
<li style="margin:0 0 6px;">Elegí tus piezas en el catálogo y sumalas al pedido.</li>
<li style="margin:0 0 6px;">Mandá el pedido por WhatsApp desde el sitio.</li>
<li>Mencioná tu código y te aplicamos el descuento.</li>
</ol>
${boton("Ver el catálogo", `${v.base}/productos`)}
<p style="margin:28px 0 0;font-family:${SANS};font-size:14px;line-height:1.6;color:${C.muted};">Además vas a enterarte primero de lanzamientos y de las preventas del Event Summit. Un mail cada tanto, prometido.<br><br>Flor y el equipo de Sweet Flowers</p>`;
  return {
    asunto: `Tu ${DESCUENTO_BIENVENIDA}% de bienvenida: ${v.codigo}`,
    html: layout({ base: v.base, preheader: `Tu código de ${DESCUENTO_BIENVENIDA}% para el primer pedido está adentro.`, contenido, bajaUrl: v.bajaUrl, motivo: "Recibís este mail porque te sumaste al Club Sweet Flowers." }),
    texto: `¡Bienvenida al ${CLUB.nombre}!\n\nTu código de ${DESCUENTO_BIENVENIDA}% para el primer pedido: ${v.codigo}\n\n1. Elegí tus piezas en ${v.base}/productos\n2. Mandá el pedido por WhatsApp desde el sitio\n3. Mencioná tu código\n\nDarte de baja: ${v.bajaUrl}`,
  };
}

export function correoRecordatorioCodigo(v: { base: string; nombre?: string | null; codigo: string; bajaUrl: string }): Correo {
  const nombre = v.nombre?.trim().split(" ")[0];
  const contenido = `${eyebrow("Tu descuento sigue activo")}
${h1(nombre ? `${nombre}, ¿armamos tu primer pedido?` : "¿Armamos tu primer pedido?")}
${cuerpoHtml(`Todavía tenés tu código de ${DESCUENTO_BIENVENIDA}% sin usar: **${v.codigo}**\n\nSi tenés dudas de medidas, combinaciones o envíos, escribinos y te asesoramos: muchas decoradoras arrancan con un arco o una estantería y van sumando.`)}
${boton("Elegir mis piezas", `${v.base}/productos`)}`;
  return {
    asunto: `${nombre ? `${nombre}, tu` : "Tu"} ${DESCUENTO_BIENVENIDA}% sigue esperándote`,
    html: layout({ base: v.base, preheader: `Tu código ${v.codigo} todavía está activo.`, contenido, bajaUrl: v.bajaUrl, motivo: "Recibís este mail porque sos parte del Club Sweet Flowers." }),
    texto: `Tu código de ${DESCUENTO_BIENVENIDA}% sigue activo: ${v.codigo}\n\nCatálogo: ${v.base}/productos\n\nDarte de baja: ${v.bajaUrl}`,
  };
}

export function correoBienvenidaCuenta(v: { base: string; nombre?: string | null }): Correo {
  const nombre = v.nombre?.trim().split(" ")[0];
  const contenido = `${eyebrow("Tu cuenta")}
${h1(nombre ? `¡Hola, ${nombre}!` : "¡Tu cuenta está lista!")}
${cuerpoHtml(`Ya podés seguir tus pedidos desde tu cuenta en Sweet Flowers.\n\n- Armá tu pedido en el catálogo y mandalo por WhatsApp\n- Mirá el estado de tus pedidos en "Mi cuenta"\n- Sumate al ${CLUB.nombre} y llevate ${DESCUENTO_BIENVENIDA}% en tu primera compra`)}
${boton("Ir a mi cuenta", `${v.base}/cuenta`)}`;
  return {
    asunto: "Bienvenida a Sweet Flowers",
    html: layout({ base: v.base, preheader: "Tu cuenta está lista. Seguí tus pedidos desde ahí.", contenido, motivo: "Recibís este mail porque creaste una cuenta en Sweet Flowers." }),
    texto: `¡Tu cuenta está lista!\n\nSeguí tus pedidos en ${v.base}/cuenta\nSumate al ${CLUB.nombre} y llevate ${DESCUENTO_BIENVENIDA}% en tu primera compra.`,
  };
}

/* ─────────────── Campañas ─────────────── */

export function correoCampana(v: {
  base: string;
  asunto: string;
  preheader?: string | null;
  titulo: string;
  cuerpo: string;
  imagen?: string | null;
  ctaTexto?: string | null;
  ctaUrl?: string | null;
  nombre?: string | null;
  codigo?: string | null;
  bajaUrl: string;
}): Correo {
  const per = (s: string) => personalizar(s, { nombre: v.nombre, codigo: v.codigo });
  const img = v.imagen
    ? `<img src="${esc(abs(v.base, v.imagen))}" width="528" alt="" style="display:block;width:100%;max-width:528px;height:auto;border:0;border-radius:14px;margin:0 0 28px;">`
    : "";
  const cta = v.ctaTexto && v.ctaUrl ? boton(per(v.ctaTexto), abs(v.base, v.ctaUrl)) : "";
  const contenido = `${img}${eyebrow("Club Sweet Flowers")}${h1(per(v.titulo))}${cuerpoHtml(per(v.cuerpo))}${cta}`;
  return {
    asunto: per(v.asunto),
    html: layout({ base: v.base, preheader: v.preheader ? per(v.preheader) : undefined, contenido, bajaUrl: v.bajaUrl, motivo: "Recibís este mail porque sos parte del Club Sweet Flowers." }),
    texto: `${per(v.titulo)}\n\n${per(v.cuerpo).replace(/\*\*/g, "")}${cta ? `\n\n${per(v.ctaTexto ?? "")}: ${abs(v.base, v.ctaUrl ?? "/")}` : ""}\n\nDarte de baja: ${v.bajaUrl}`,
  };
}

/* ─────────────── Event Summit ─────────────── */

export function correoEntradaSummit(v: {
  base: string;
  nombre: string;
  codigo: string;
  pase: string;
  monto: number;
  evento: string;
  edicion: string;
  fecha: string;
  horario: string;
  sede: string | null;
}): Correo {
  const nombre = v.nombre.trim().split(" ")[0];
  const fila = (k: string, val: string) =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:13px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">${esc(k)}</td><td align="right" style="padding:10px 0;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:15px;color:${C.ink};font-weight:600;">${esc(val)}</td></tr>`;
  const monto = `$ ${v.monto.toLocaleString("es-AR")}`;
  const contenido = `${eyebrow(`${v.evento} · ${v.edicion}`)}
${h1(`¡${nombre}, tu lugar está confirmado!`)}
<p style="margin:0 0 24px;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.ink};">Recibimos tu pago. Guardá este mail: es tu comprobante de inscripción.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;"><tr><td align="center" style="background:${C.ink};border-radius:16px;padding:26px 16px;">
<p style="margin:0 0 6px;font-family:${SANS};font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${C.champagne};">${esc(v.pase)}</p>
<p style="margin:0;font-family:'Courier New',monospace;font-size:30px;font-weight:700;letter-spacing:4px;color:${C.bone};">${esc(v.codigo)}</p>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
${fila("Fecha", v.fecha)}${fila("Horario", v.horario)}${v.sede ? fila("Lugar", v.sede) : ""}${fila("Pagaste", monto)}
</table>
${cuerpoHtml("Unos días antes del evento te escribimos por WhatsApp con todos los detalles. Si tenés alguna duda, respondé este mail o escribinos.")}
${boton("Ver el Event Summit", `${v.base}/event-summit`)}`;
  return {
    asunto: `Tu lugar en el ${v.evento} está confirmado (${v.codigo})`,
    html: layout({ base: v.base, preheader: `${v.pase} · ${v.fecha} · código ${v.codigo}`, contenido, motivo: "Recibís este mail porque te inscribiste al Sweet Flowers Event Summit." }),
    texto: `¡Tu lugar está confirmado!\n\n${v.pase} · Código ${v.codigo}\n${v.fecha} · ${v.horario}${v.sede ? `\n${v.sede}` : ""}\nPagaste ${monto}\n\n${v.base}/event-summit`,
  };
}
