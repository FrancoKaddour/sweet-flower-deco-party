// PREGUNTAS FRECUENTES generales (/preguntas-frecuentes, llms-full.txt y
// FAQPage). Respuestas cortas y directas: son las que citan Google y las IAs.
// Fuente: docs/CONTENIDO_FLOR.md (§1, §4, §5, §6, §7) y content/evento.ts.
// Regla: solo datos confirmados. TODO(contenido): sumar las que Flor y Tobías
// reciben seguido por WhatsApp.
import { EVENT_WHEN, EVENT_HORARIO, EVENT_SEDE, PASES, PREVENTAS, EXTRAS_NOTA } from "@/content/evento";
import { BUSINESS, RECARGO_MP_TEXTO } from "@/lib/site";

export type Faq = { q: string; a: string };

const ars = (n: number) => `$${n.toLocaleString("es-AR")}`;
const precios = PREVENTAS.map(
  (pv) => `${pv.nombre} (${pv.hastaLabel}): ${PASES.map((p) => `${p.nombre} ${ars(pv.precios[p.id])}`).join(", ")}`,
).join(". ");

export const FAQ_GRUPOS: readonly { id: string; titulo: string; faqs: readonly Faq[] }[] = [
  {
    id: "pedidos",
    titulo: "Pedidos y pagos",
    faqs: [
      {
        q: "¿Qué vende Sweet Flowers Deco Party?",
        a: "Fabricamos y vendemos piezas para decorar eventos: estructuras de hierro (arcos, arcadas, aros, columnas, mesas y sillones), exhibidores para catering (estanterías, alzadas, torres de cupcakes), pies de lámpara, y fundas y telas sublimadas. Además organizamos el Sweet Flowers Event Summit, una jornada de formación para el rubro.",
      },
      {
        q: "¿Cómo hago un pedido?",
        a: "Sumás los productos al pedido desde el catálogo de la web y lo enviás por WhatsApp, o nos escribís directo. Te confirmamos precio, color, medidas y fecha de entrega. No hace falta pagar en la web para pedir productos.",
      },
      {
        q: "¿Cuáles son las formas de pago?",
        a: `Transferencia bancaria o Mercado Pago. El precio publicado es por transferencia; con link de Mercado Pago se suma un ${RECARGO_MP_TEXTO}.`,
      },
      {
        q: "¿Cuánto demora un pedido?",
        a: "Trabajamos mayormente por encargo: alrededor de 20 días. Cerramos la producción por semana, así que puede variar según cuándo confirmes. Las piezas a medida muy específicas pueden llevar más; te lo aclaramos al cotizar.",
      },
      {
        q: "¿Hacen piezas a medida?",
        a: "Sí. Se cotizan por WhatsApp. La demora es la misma que la de un producto de catálogo, salvo que sea muy específica o lleve mucho trabajo (por ejemplo, una barra móvil de hierro y madera llevó alrededor de un mes).",
      },
      {
        q: "¿En qué colores vienen las estructuras de hierro?",
        a: "En blanco, negro, dorado, plateado o rosa gold.",
      },
    ],
  },
  {
    id: "envios",
    titulo: "Envíos",
    faqs: [
      {
        q: "¿Hacen envíos a todo el país?",
        a: "Sí. Principalmente por Vía Cargo, con descuento en el valor del envío, y donde no llega por Buspack, MD o FlechaBus.",
      },
      {
        q: "¿Dónde están ubicados?",
        a: `Nuestro taller está en ${BUSINESS.locality}, partido de Malvinas Argentinas, provincia de ${BUSINESS.region}. Desde ahí despachamos a toda la Argentina.`,
      },
      {
        q: "¿Quién paga el seguro del envío?",
        a: "El seguro se abona a la transportista. Con Buspack, MD o FlechaBus el reclamo lo gestiona el cliente; con Vía Cargo te ayudamos a gestionarlo.",
      },
    ],
  },
  {
    id: "summit",
    titulo: "Event Summit",
    faqs: [
      {
        q: "¿Qué es el Sweet Flowers Event Summit?",
        a: "Es la cumbre argentina de la decoración y la organización de eventos que organiza Sweet Flowers: una jornada de charlas de referentes del rubro, con certificado, coffee break y comunidad. Viene de siete workshops presenciales y de una 1ª edición en septiembre de 2026.",
      },
      {
        q: "¿Cuándo y dónde es la próxima edición?",
        a: `La 2ª edición es el ${EVENT_WHEN}, de ${EVENT_HORARIO}, en ${EVENT_SEDE}. ${EXTRAS_NOTA}`,
      },
      {
        q: "¿Cuánto sale la entrada al Event Summit?",
        a: `Hay dos pases, VIP y General, con precio de preventa. ${precios}. Se paga online con Mercado Pago.`,
      },
      {
        q: "¿Qué incluye cada pase?",
        a: PASES.map((p) => `${p.nombre}: ${p.incluye.join(", ").toLowerCase()}.`).join(" "),
      },
    ],
  },
  {
    id: "atencion",
    titulo: "Atención",
    faqs: [
      {
        q: "¿Quién me atiende?",
        a: "Flor y Tobías, en persona, por WhatsApp. Somos un emprendimiento familiar: no hay bots ni call center.",
      },
      {
        q: "¿Cómo los contacto?",
        a: "Por WhatsApp de ventas (11 5106-4010) para productos, por WhatsApp de capacitaciones (11 5512-7508) para el Event Summit, por Instagram (@sweetflowersdecoparty) o desde el formulario de contacto de la web.",
      },
    ],
  },
];

/**
 * FAQ de la página del Summit (arriba del formulario de inscripción). Las que
 * dependen de una política que Flor todavía no definió tienen una respuesta
 * honesta provisoria.
 */
export const FAQ_SUMMIT: readonly Faq[] = [
  {
    q: "¿Para quién es?",
    // TODO(contenido): confirmar con Flor si hay algún perfil al que no apunte.
    a: "Para decoradoras, organizadoras de eventos y emprendedoras del rubro, estén empezando o tengan años de oficio.",
  },
  {
    q: "¿Qué incluye cada pase?",
    a: PASES.map((p) => `${p.nombre}: ${p.incluye.join(", ").toLowerCase()}.`).join(" "),
  },
  {
    q: "¿Cuándo y dónde es?",
    a: `El ${EVENT_WHEN}, de ${EVENT_HORARIO}, en ${EVENT_SEDE}.`,
  },
  {
    q: "¿Cómo pago? ¿Puedo pagar en cuotas?",
    a: "Online con Mercado Pago: tarjeta de crédito en cuotas, débito o dinero en cuenta de Mercado Pago. Tu lugar queda confirmado apenas se aprueba el pago.",
  },
  {
    q: "¿Qué son las actividades del 7 y 8 de abril?",
    // TODO(contenido): detalle y precio de las actividades extra (Flor/Tobías).
    a: "Son actividades extra, antes del Summit, que se abonan aparte. Escribinos por WhatsApp y te pasamos el detalle.",
  },
  {
    q: "¿Puedo comprar para mi equipo?",
    a: "Sí: hacé una inscripción por persona, así cada una recibe su código de entrada y su certificado.",
  },
  {
    q: "¿Y si después no puedo ir?",
    // TODO(contenido): política de devolución / transferencia de la entrada (Flor).
    a: "Escribinos por WhatsApp de capacitaciones (11 5512-7508) y lo vemos con vos.",
  },
  {
    q: "¿Dan factura?",
    // TODO(contenido): confirmar con Flor si se factura y de qué tipo.
    a: "Escribinos antes de pagar y te contamos.",
  },
];

export const FAQS_TODAS: readonly Faq[] = FAQ_GRUPOS.flatMap((g) => g.faqs);
