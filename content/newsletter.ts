// Newsletter "Club Sweet Flowers" — copy, beneficio y presets de campañas.
// Compartido entre server y client (sin "server-only").

/** % de descuento de bienvenida en el primer pedido (se valida por WhatsApp). */
export const DESCUENTO_BIENVENIDA = 10;

export const CLUB = {
  nombre: "Club Sweet Flowers",
  titulo: `${DESCUENTO_BIENVENIDA}% off en tu primer pedido`,
  bajada:
    "Sumate al club y enterate antes que nadie de lanzamientos, preventas del Event Summit y promos que no publicamos en ningún otro lado.",
  beneficios: [
    `Tu código de ${DESCUENTO_BIENVENIDA}% por mail`,
    "Te avisamos antes de que cambie el precio del Summit",
    "Lanzamientos y reposiciones primero",
  ],
  legal: "Un mail cada tanto, nada de spam. Te das de baja con un clic.",
} as const;

/** Variante de la banda para las páginas del Summit (E-20): lo que importa ahí es el evento. */
export const CLUB_SUMMIT = {
  titulo: "Enterate primero del Summit",
  bajada:
    "Te escribimos cuando se anuncien disertantes y antes de que cambie el precio de la entrada. Además, tu código de bienvenida para el primer pedido.",
  beneficios: [
    "Aviso antes de que cambie el precio",
    "Disertantes y novedades del Summit",
    `Tu código de ${DESCUENTO_BIENVENIDA}% por mail`,
  ],
} as const;

export const INTERESES = [
  { v: "productos", l: "Productos" },
  { v: "summit", l: "Event Summit" },
  { v: "workshops", l: "Workshops" },
] as const;
export type Interes = (typeof INTERESES)[number]["v"];

/** Segmentos a los que se puede mandar una campaña. */
export const SEGMENTOS = [
  { v: "todos", l: "Todos los suscriptos", ayuda: "Todas las personas activas en el club." },
  { v: "codigo-sin-usar", l: "No usaron su descuento", ayuda: "Se suscribieron pero todavía no compraron: ideal para un empujón." },
  { v: "clientes", l: "Ya compraron", ayuda: "Usaron su código: clientas reales, para fidelizar." },
  { v: "interes-productos", l: "Interesados en productos", ayuda: "Marcaron Productos al suscribirse." },
  { v: "interes-summit", l: "Interesados en el Summit", ayuda: "Marcaron Event Summit: preventas, cupos, disertantes." },
  { v: "interes-workshops", l: "Interesados en workshops", ayuda: "Marcaron Workshops." },
  { v: "con-cuenta", l: "Tienen cuenta en el sitio", ayuda: "Suscriptos que además crearon su cuenta." },
  { v: "nuevos-30", l: "Nuevos (últimos 30 días)", ayuda: "Se sumaron en el último mes." },
] as const;
export type Segmento = (typeof SEGMENTOS)[number]["v"];

export type DatosCampana = {
  asunto: string;
  preheader: string;
  titulo: string;
  cuerpo: string;
  imagen: string;
  ctaTexto: string;
  ctaUrl: string;
  segmento: Segmento;
};

/**
 * Plantillas de arranque: Flor elige una y edita. Fórmula de cada una:
 * asunto corto + beneficio concreto, un solo pedido (CTA) y urgencia real.
 */
export const PLANTILLAS: { id: string; nombre: string; descripcion: string; datos: DatosCampana }[] = [
  {
    id: "lanzamiento",
    nombre: "Lanzamiento",
    descripcion: "Presentar una pieza o colección nueva.",
    datos: {
      asunto: "Llegó: [nombre del producto] ✨",
      preheader: "Lo ves primero vos, antes que en Instagram.",
      titulo: "Nuevo en el taller",
      cuerpo:
        "Hola {nombre},\n\nTe lo mostramos primero a vos: [contá qué es la pieza, en qué eventos queda increíble y de qué está hecha].\n\n- Medidas: [completar]\n- Terminación: [completar]\n- Se hace por encargo (≈20 días)\n\nComo es una producción limitada, te recomendamos reservarla con tiempo.",
      imagen: "",
      ctaTexto: "Quiero verla",
      ctaUrl: "/productos",
      segmento: "interes-productos",
    },
  },
  {
    id: "promo",
    nombre: "Promo / descuento",
    descripcion: "Una oferta con fecha de vencimiento.",
    datos: {
      asunto: "Solo hasta el [fecha]: [X]% en [categoría]",
      preheader: "Una promo corta para las que están en el club.",
      titulo: "[X]% off por pocos días",
      cuerpo:
        "Hola {nombre},\n\nHasta el [fecha] tenés [X]% de descuento en [categoría / productos]. Es exclusivo para el club: no lo vas a ver publicado.\n\nArmá tu pedido en el sitio y mandalo por WhatsApp mencionando esta promo.",
      imagen: "",
      ctaTexto: "Aprovechar la promo",
      ctaUrl: "/productos",
      segmento: "todos",
    },
  },
  {
    id: "summit",
    nombre: "Preventa Summit",
    descripcion: "Abrir o recordar una preventa del Event Summit.",
    datos: {
      asunto: "Preventa del Event Summit: los primeros lugares son tuyos",
      preheader: "Precio de preventa por tiempo limitado y cupos contados.",
      titulo: "Tu lugar en el Event Summit",
      cuerpo:
        "Hola {nombre},\n\nAbrimos la preventa del Sweet Flowers Event Summit y, como sos parte del club, te avisamos antes que a nadie.\n\n- Charlas de referentes del rubro\n- Escena montada por Sweet Flowers\n- Networking con proveedores y colegas\n\nLos cupos son limitados y la preventa vence pronto.",
      imagen: "",
      ctaTexto: "Reservar mi lugar",
      ctaUrl: "/event-summit#inscripcion",
      segmento: "interes-summit",
    },
  },
  {
    id: "recordatorio",
    nombre: "Empujón a la primera compra",
    descripcion: "Para quienes todavía no usaron su descuento.",
    datos: {
      asunto: "{nombre}, tu descuento te está esperando",
      preheader: "Tu código de bienvenida sigue activo.",
      titulo: "¿Armamos tu primer pedido?",
      cuerpo:
        "Hola {nombre},\n\nTodavía tenés tu código de bienvenida sin usar: {codigo}.\n\nElegí tus piezas en el catálogo, sumalas al pedido y mencioná el código cuando nos escribas por WhatsApp. Te asesoramos con medidas y combinaciones.",
      imagen: "",
      ctaTexto: "Ver el catálogo",
      ctaUrl: "/productos",
      segmento: "codigo-sin-usar",
    },
  },
  {
    id: "novedad",
    nombre: "Novedad general",
    descripcion: "Contar algo: cambios, envíos, fechas, horarios.",
    datos: {
      asunto: "Novedades de Sweet Flowers",
      preheader: "Te contamos qué hay de nuevo.",
      titulo: "Te contamos",
      cuerpo: "Hola {nombre},\n\n[Escribí la novedad en 2 o 3 párrafos cortos.]",
      imagen: "",
      ctaTexto: "Ir al sitio",
      ctaUrl: "/",
      segmento: "todos",
    },
  },
];
