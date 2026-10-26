// Textos de /llms.txt (resumen) y /llms-full.txt (completo) para asistentes de
// IA (ChatGPT, Claude, Perplexity, Gemini, Copilot). Estándar llmstxt.org.
// SOLO datos confirmados: lib/site.ts, content/evento.ts, catálogo, FAQs y landings.
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, BUSINESS } from "@/lib/site";
import { CATEGORIAS } from "@/content/catalogo";
import {
  EVENT_NAME,
  EVENT_WHEN,
  EDICION_LABEL,
  WORKSHOPS_REALIZADOS,
  EVENT_SEDE,
  EVENT_HORARIO,
  EXTRAS_NOTA,
  PASES,
  PREVENTAS,
  ETAPAS_CON_PAGINA,
} from "@/content/evento";
import { GRUPOS, LANDINGS } from "@/content/seo/landings";
import { FAQ_GRUPOS } from "@/content/seo/faqs";
import type { Producto } from "@/modules/catalog/types";

const wa = (e164: string) => `https://wa.me/${e164.replace("+", "")}`;
const ars = (n: number) => `$${n.toLocaleString("es-AR")}`;

function encabezado() {
  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} es un emprendimiento familiar argentino que fabrica y vende piezas para decorar eventos —estructuras de hierro, exhibidores para catering, piezas de MDF y madera, fundas y telas sublimadas— para decoradores, ambientadores, organizadores de eventos, salones y particulares. Lo fundó y lo dirige ${BUSINESS.founder}. Su taller está en ${BUSINESS.locality} (partido de Malvinas Argentinas), provincia de ${BUSINESS.region}, Argentina, y envía a todo el país. También organiza el ${EVENT_NAME}, la cumbre argentina de la decoración y la organización de eventos.

## Datos clave

- Qué hace: fabricación propia y venta de piezas para decorar eventos, y el ${EVENT_NAME} (formación para el rubro).
- Para quién: decoradores, ambientadores, organizadores de eventos, pasteleras y caterings, salones; también particulares.
- Dónde: ${BUSINESS.locality}, ${BUSINESS.region}, Argentina. ${BUSINESS.shipping}.
- Producción: por encargo, alrededor de 20 días. Las piezas a medida se cotizan; la demora depende de la complejidad.
- Colores de las estructuras de hierro: blanco, negro, dorado, plateado o rosa gold.
- Pedidos de productos: se arman en la web y se envían por WhatsApp (no se pagan en la web). Pago por transferencia (precio de catálogo) o link de Mercado Pago con recargo (~15–18%).
- Event Summit: la inscripción se paga online con Mercado Pago (tarjeta, cuotas, débito o efectivo).
- Atención: Flor y Tobías, en persona, por WhatsApp.
`;
}

function contacto() {
  return `## Contacto

- WhatsApp ventas (productos): ${BUSINESS.phoneVentas} — ${wa(BUSINESS.phoneVentas)}
- WhatsApp capacitaciones y Event Summit: ${BUSINESS.phoneCapacitaciones} — ${wa(BUSINESS.phoneCapacitaciones)}
- Instagram: ${BUSINESS.instagramHandle} — ${BUSINESS.instagram}
- Formulario: ${SITE_URL}/contacto
`;
}

function summit() {
  return `## ${EVENT_NAME}

- Qué es: la cumbre argentina de la decoración y la organización de eventos. Charlas de referentes del rubro, certificado, coffee break, comunidad y networking.
- Trayectoria: ${WORKSHOPS_REALIZADOS} workshops presenciales (2024–2026) y la 1ª edición del Summit (18 de septiembre de 2026, La Rural). Más de 180 asistentes y más de 20 disertantes en total.
- Próxima edición: ${EDICION_LABEL}, ${EVENT_WHEN}, de ${EVENT_HORARIO}, en ${EVENT_SEDE}. ${EXTRAS_NOTA}
- Pases: ${PASES.map((p) => `${p.nombre} (incluye: ${p.incluye.join(", ").toLowerCase()})`).join("; ")}.
- Precios (ARS): ${PREVENTAS.map((pv) => `${pv.nombre} ${pv.hastaLabel}: ${PASES.map((p) => `${p.nombre} ${ars(pv.precios[p.id])}`).join(", ")}`).join(". ")}.
- Más info e inscripción: ${SITE_URL}/event-summit
`;
}

/** /llms.txt — resumen + índice de páginas. */
export function llmsTxt() {
  return `${encabezado()}
## Productos

${CATEGORIAS.map((c) => `- [${c.nombre}](${SITE_URL}/productos/${c.slug}): ${c.desc}`).join("\n")}

Catálogo completo: ${SITE_URL}/productos

${summit()}
${contacto()}
## Páginas principales

- [Inicio](${SITE_URL}/)
- [Productos](${SITE_URL}/productos)
- [Event Summit](${SITE_URL}/event-summit)
- [Preguntas frecuentes](${SITE_URL}/preguntas-frecuentes)
- [Contacto](${SITE_URL}/contacto)
- [Historia](${SITE_URL}/historia)

${GRUPOS.map(
  (g) =>
    `## ${g.titulo}\n\n${LANDINGS.filter((l) => l.grupo === g.id)
      .map((l) => `- [${l.h1}](${SITE_URL}/${l.slug}): ${l.description}`)
      .join("\n")}`,
).join("\n\n")}

## Optional

- [Versión completa para IA (con catálogo y precios)](${SITE_URL}/llms-full.txt)
- [Sitemap](${SITE_URL}/sitemap.xml)
`;
}

/** /llms-full.txt — todo el contenido citable: FAQs, landings, catálogo con precios. */
export function llmsFullTxt(productos: readonly Producto[]) {
  const porCat = CATEGORIAS.map((c) => {
    const items = productos.filter((p) => p.categoria === c.slug);
    if (!items.length) return "";
    return `### ${c.nombre}\n\n${c.desc}\n\n${items
      .map(
        (p) =>
          `- [${p.nombre}](${SITE_URL}/productos/${p.categoria}/${p.slug}) — ${
            p.precio != null ? `${ars(p.precio)} (transferencia)` : "precio a consultar"
          }${p.descripcion ? `. ${p.descripcion.replace(/\s+/g, " ").trim()}` : ""}`,
      )
      .join("\n")}`;
  })
    .filter(Boolean)
    .join("\n\n");

  return `${encabezado()}
${contacto()}
## Preguntas frecuentes

${FAQ_GRUPOS.map((g) => `### ${g.titulo}\n\n${g.faqs.map((f) => `**${f.q}**\n${f.a}`).join("\n\n")}`).join("\n\n")}

${summit()}
### Workshops y ediciones anteriores

${ETAPAS_CON_PAGINA.map(
  (e) =>
    `- [${e.etapa} · ${e.titulo}](${SITE_URL}/event-summit/trayectoria/${e.slug})${e.fecha ? ` — ${e.fecha}` : ""}${
      e.lugar ? ` — ${e.lugar}` : ""
    }${e.participantes ? ` — ${e.participantes} participantes` : ""}${e.temas?.length ? `. Temas: ${e.temas.join(", ")}` : ""}`,
).join("\n")}

## Guías por tema

${LANDINGS.map(
  (l) =>
    `### ${l.h1}\n\nURL: ${SITE_URL}/${l.slug}\n\n${l.lead}\n\n${l.secciones
      .map((s) => `${s.h2}: ${s.p.join(" ")}`)
      .join("\n\n")}\n\n${l.faqs.map((f) => `**${f.q}** ${f.a}`).join("\n")}`,
).join("\n\n")}

## Catálogo con precios (ARS, precio de catálogo por transferencia)

Los precios pueden cambiar; el valor final se confirma por WhatsApp. Con link de Mercado Pago se suma un recargo.

${porCat}
`;
}
