/**
 * /llms.txt — resumen del negocio en Markdown para asistentes de IA (ChatGPT,
 * Claude, Perplexity, Gemini). Estándar propuesto en llmstxt.org: les da los
 * datos clave sin tener que interpretar el diseño ni las animaciones.
 * SOLO datos confirmados (docs/CONTENIDO_FLOR.md). Se genera en el build.
 */
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, BUSINESS } from "@/lib/site";
import { CATEGORIAS } from "@/content/catalogo";
import {
  EVENT_NAME,
  EVENT_WHEN,
  EVENT_CUPO,
  EDICION_LABEL,
  WORKSHOPS_REALIZADOS,
  INCLUYE,
} from "@/content/evento";

export const dynamic = "force-static";

const wa = (e164: string) => `https://wa.me/${e164.replace("+", "")}`;

export function GET() {
  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} es un emprendimiento familiar argentino de decoración de eventos, fundado y dirigido por ${BUSINESS.founder}. Fabrica piezas propias para decoradores, ambientadores y organizadores de eventos, y organiza el ${EVENT_NAME}, la cumbre argentina de la decoración de eventos. Base en ${BUSINESS.locality}, ${BUSINESS.region}, Argentina.

## Datos clave

- Qué hace: fabricación y venta de piezas para decorar eventos — catering (exhibidores), ambientación y estructuras de hierro — y el Event Summit, la cumbre del rubro.
- Para quién: decoradores, ambientadores, organizadores de eventos y salones; también particulares.
- Dónde: ${BUSINESS.locality}, ${BUSINESS.region}, Argentina. ${BUSINESS.shipping}.
- Producción: ${BUSINESS.leadTime}. Los productos a medida se cotizan; la demora depende de la complejidad.
- Pedidos y pagos: todo se coordina por WhatsApp (no hay pago online en el sitio). Transferencia bancaria, o link de Mercado Pago con recargo.
- Atención: responden Flor y Tobías en persona por WhatsApp.

## Productos

${CATEGORIAS.map((c) => `- [${c.nombre}](${SITE_URL}/productos/${c.slug}): ${c.desc}`).join("\n")}

Catálogo completo: ${SITE_URL}/productos

## ${EVENT_NAME}

- Qué es: la cumbre argentina de la decoración y la organización de eventos. Charlas de referentes del rubro, comunidad y networking.
- Trayectoria: ${WORKSHOPS_REALIZADOS} workshops presenciales (Centro Naval, Madero Tango en Puerto Madero, La Rioja, Río Cuarto, Palacio San Miguel y La Rural, entre otras sedes) y la 1ª edición del Summit (septiembre de 2026). Más de 180 asistentes y más de 20 disertantes en total.
- Próxima edición: ${EDICION_LABEL}, ${EVENT_WHEN}. Cupo de ${EVENT_CUPO} lugares. Pre-preventa abierta: la reserva y el pago se coordinan por WhatsApp.
- Incluye: ${INCLUYE.map((i) => i.titulo.toLowerCase()).join(", ")}.
- Más info e inscripción: ${SITE_URL}/event-summit

## Contacto

- WhatsApp ventas: ${BUSINESS.phoneVentas} (${wa(BUSINESS.phoneVentas)})
- WhatsApp capacitaciones y Event Summit: ${BUSINESS.phoneCapacitaciones} (${wa(BUSINESS.phoneCapacitaciones)})
- Instagram: ${BUSINESS.instagramHandle} (${BUSINESS.instagram})
- Formulario: ${SITE_URL}/contacto

## Páginas

- [Inicio](${SITE_URL}/)
- [Productos](${SITE_URL}/productos)
- [Event Summit](${SITE_URL}/event-summit)
- [Contacto y preguntas frecuentes](${SITE_URL}/contacto)
- [Historia](${SITE_URL}/historia)
`;
  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
