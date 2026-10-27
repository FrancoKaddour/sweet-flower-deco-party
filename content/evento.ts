// Datos del Sweet Flowers Event Summit — fuente única.
// EVENT_NAME se define acá y en NINGÚN otro lado (ADR-008 / docs/CONTENIDO_FLOR.md §10).
// ✅ confirmado · 🟡 a confirmar · ⬜ pendiente. Nada de esto se inventa.

export const EVENT_NAME = "Sweet Flowers Event Summit"; // ✅ (NO es un workshop)

// Trayectoria ✅ (audios de Flor, 19/10/2026 — docs/CONTENIDO_FLOR.md §18):
// primero hubo 7 WORKSHOPS (terminados), después la 1ª edición del Summit
// (18/09/2026). La próxima es la 2ª EDICIÓN del Summit: 9 de abril de 2027.
export const WORKSHOPS_REALIZADOS = 7;
/** Ediciones del Summit ya hechas. */
export const EDICIONES_PREVIAS = 1;
export const EDICION_NUMERO = EDICIONES_PREVIAS + 1;
/** "2ª edición" */
export const EDICION_LABEL = `${EDICION_NUMERO}ª edición`;

export const EVENT_DATE_ISO: string | null = "2027-04-09T12:30:00-03:00"; // ✅ fecha y horario
export const EVENT_END_ISO = "2027-04-09T19:00:00-03:00";
export const EVENT_HORARIO = "12:30 a 19 h"; // ✅
export const EVENT_YEAR = 2027;
/** Cuándo es, en texto. */
export const EVENT_WHEN = "9 de abril de 2027";
/** @deprecated usar EVENT_WHEN */
export const EVENT_DATE_LABEL = EVENT_WHEN;
export const EVENT_SEDE: string | null = "La Rural · Palermo, Buenos Aires"; // ✅

export const EVENT_CUPO = 80; // ✅ "por el momento"

// Inscripción: el formulario de /event-summit#inscripcion cobra el pase online
// con Mercado Pago (decisión 23/10/2026). WhatsApp queda para consultas.
export const EVENT_CTA_HREF = "/event-summit#inscripcion";

/** Cómo llegar: búsqueda de Google Maps (sin escribir una dirección a mano). */
export const EVENT_MAPA_URL =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("La Rural Predio Ferial, Palermo, Buenos Aires");

/** Link "Agregar a Google Calendar" del evento (también sirve para el mail de la entrada). */
export function calendarioGoogleUrl(codigo?: string): string {
  const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT_NAME,
    dates: `${utc(EVENT_DATE_ISO ?? EVENT_END_ISO)}/${utc(EVENT_END_ISO)}`,
    location: "La Rural, Palermo, Buenos Aires",
    details: `${EDICION_LABEL} · ${EVENT_HORARIO}${codigo ? ` · Tu código: ${codigo}` : ""}`,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

// PASES y PREVENTAS ✅ (Flor, 20/10/2026 · 23/10/2026: se paga TODO online con
// Mercado Pago, precio fijo por pase; tarjeta, cuotas, débito o dinero en cuenta; sin efectivo).
// La preventa Comunidad está abierta a todos (no se pide ningún requisito).
export type PaseId = "vip" | "general";

export const PASES: readonly { id: PaseId; nombre: string; incluye: readonly string[] }[] = [
  {
    id: "vip",
    nombre: "Pase VIP",
    incluye: [
      "Ingreso al Event Summit",
      "Lugar preferencial en el auditorio",
      "Ingreso preferencial al auditorio",
      "Regalos exclusivos",
      "Sorteos",
      "Coffee break",
      "Certificado de asistencia",
      "Ingreso a Expo Hobby",
      "Cliente VIP Sweet Flowers: 15% de descuento en cualquier compra",
      "Grupo de WhatsApp exclusivo",
      "Valores preferenciales en próximos eventos",
      "Descuentos con proveedores recomendados",
    ],
  },
  {
    id: "general",
    nombre: "Pase General",
    incluye: [
      "Ingreso al auditorio del Event Summit",
      "Regalos",
      "Sorteos",
      "Coffee break",
      "Certificado de asistencia",
      "Ingreso a Expo Hobby",
    ],
  },
];

export type Preventa = {
  id: string;
  nombre: string;
  /** Último día válido (inclusive), ISO yyyy-mm-dd. */
  hasta: string;
  hastaLabel: string;
  /** Precio final en ARS (se cobra por Mercado Pago). */
  precios: Record<PaseId, number>;
};

export const PREVENTAS: readonly Preventa[] = [
  {
    id: "comunidad",
    // Antes "Preventa Comunidad VIP Sweet Flowers": sonaba restringida y es abierta a todos.
    nombre: "Preventa Comunidad",
    hasta: "2026-11-10",
    hastaLabel: "hasta el 10/11",
    precios: {
      vip: 330000,
      general: 180000,
    },
  },
  {
    id: "general",
    nombre: "Preventa general",
    hasta: "2026-12-15",
    hastaLabel: "hasta el 15/12",
    precios: {
      vip: 370000,
      general: 260000,
    },
  },
];

/** Preventa vigente hoy (o null si ya pasaron todas). Fecha de Argentina. */
export function preventaVigente(hoy = new Date()): Preventa | null {
  const d = new Date(hoy.getTime() - 3 * 3600e3).toISOString().slice(0, 10);
  return PREVENTAS.find((p) => d <= p.hasta) ?? null;
}

/**
 * Tarifa con la que se cobra hoy: la preventa vigente o, si ya pasaron todas,
 * el último precio rotulado "Precio actual" (sin fecha de vencimiento, para no
 * decir "Preventa… hasta el 15/12" cuando ya pasó).
 * TODO(contenido): precio del pase después del 15/12 (Flor) → sumarlo como tarifa.
 */
export function tarifaVigente(hoy = new Date()): Preventa {
  const pv = preventaVigente(hoy);
  if (pv) return pv;
  const ultima = PREVENTAS[PREVENTAS.length - 1];
  return { ...ultima, id: "actual", nombre: "Precio actual", hastaLabel: "" };
}

/** Momento exacto en que termina una preventa: su último día, 23:59:59 hora AR. */
export function finDePreventa(p: Preventa): Date {
  return new Date(`${p.hasta}T23:59:59-03:00`);
}

/** La tarifa que viene después de la vigente (para "Desde el 11/11: $…"), o null. */
export function siguientePreventa(hoy = new Date()): Preventa | null {
  const pv = preventaVigente(hoy);
  if (!pv) return null;
  return PREVENTAS[PREVENTAS.indexOf(pv) + 1] ?? null;
}

/** "11/11": el día siguiente al fin de una preventa (cuando cambia el precio). */
export function cambioDePrecioLabel(p: Preventa): string {
  const d = new Date(`${p.hasta}T12:00:00-03:00`);
  d.setUTCDate(d.getUTCDate() + 1);
  const [, m, dd] = d.toISOString().slice(0, 10).split("-");
  return `${dd}/${m}`;
}

/** "10/11": último día de una preventa. */
export function hastaCorto(p: Preventa): string {
  const [, m, d] = p.hasta.split("-");
  return `${d}/${m}`;
}

/** "Desde $180.000": el pase más barato con la tarifa de hoy. */
export function precioDesde(hoy = new Date()): string {
  const t = tarifaVigente(hoy);
  const min = Math.min(...PASES.map((p) => t.precios[p.id]));
  return `Desde $${min.toLocaleString("es-AR")}`;
}

export const EXTRAS_NOTA = "Actividades extra el 7 y 8 de abril: se abonan aparte.";
/** Línea de WhatsApp de capacitaciones / Summit (11 5512-7508). */
export const EVENT_WHATSAPP = "5491155127508";

/** El camino hasta acá: 7 workshops → 1ª edición → 2ª edición. */
export type Etapa = {
  etapa: string;
  titulo: string;
  lugar?: string;
  detalle?: string;
  proxima?: boolean;
  /** Foto de la tarjeta (si no hay, la tarjeta usa un placeholder). */
  foto?: string;
  /** Página propia: /event-summit/trayectoria/<slug>. */
  slug?: string;
  /** Número grande de la página (01, 02… o "I"). */
  numero?: string;
  /** Bajada de la página. */
  resumen?: string;
  /** Fecha del encuentro (texto). */
  fecha?: string;
  participantes?: number;
  /** Temas / charlas del encuentro. */
  temas?: readonly string[];
  /** Reel de Instagram del encuentro (id de la URL /reel/<id>/). */
  reel?: string;
};

export const TRAYECTORIA: readonly Etapa[] = [
  // Sedes de los workshops en orden (§11). El 7º se hizo en un hotel que NO se nombra.
  { etapa: "Workshop 01", titulo: "Centro Naval", lugar: "CABA", slug: "centro-naval", numero: "01", fecha: "16 de abril de 2024", participantes: 80, temas: ["Globología", "Redes sociales", "Flores gigantes", "Ambientación y organización"], reel: "C6cfHqhNybc" },
  { etapa: "Workshop 02", titulo: "Madero Tango", lugar: "Puerto Madero", slug: "madero-tango", numero: "02", fecha: "29 y 30 de octubre de 2024", participantes: 40, temas: ["Globología", "Creación de contenido", "Organización de eventos", "Protocolo y ceremonial", "Cookies express", "Seteo de mesa", "Ceremonia del té", "Tu cliente ideal", "Flores"], reel: "DB9tZrKy0bg" },
  { etapa: "Workshop 03", titulo: "La Rioja Capital", lugar: "La Rioja", slug: "la-rioja", numero: "03", fecha: "11 de abril de 2025", participantes: 40, temas: ["Globología", "Redes sociales", "Organización de eventos"], reel: "DImcgKISos5" },
  { etapa: "Workshop 04", titulo: "Río Cuarto", lugar: "Córdoba", foto: "/img/rio-cuarto/rc-03.webp", slug: "rio-cuarto", numero: "04", fecha: "2 de julio de 2025", participantes: 40, temas: ["Tendencia e inspiración", "Redes sociales", "Pastelería", "Contratos", "Tendencia en barras", "Armado en vivo del salón"], reel: "DLvv52Os4je" },
  { etapa: "Workshop 05", titulo: "Palacio San Miguel", lugar: "CABA", slug: "palacio-san-miguel", numero: "05", fecha: "8 de octubre de 2025", participantes: 60, temas: ["Ambientación y organización", "Propuestas infantiles", "Bodas de destino", "Redes sociales e IA", "Contratos para eventos", "Pastelería", "Manejo de emociones", "Sommelier"], reel: "DQSvf6EDNwg" },
  { etapa: "Workshop 06", titulo: "La Rural", lugar: "CABA", slug: "la-rural", numero: "06", fecha: "10 de abril de 2026", participantes: 50, temas: ["Vender tu imagen", "Propuestas de decoración", "Inspiración y tendencias", "Looks pastelería 2026", "Neurofinanzas y costos"], reel: "DXhzBnCiS_o" },
  { etapa: "Workshop 07", titulo: "Séptimo workshop", lugar: "Salón de hotel", slug: "septimo-workshop", numero: "07", fecha: "8 y 9 de julio de 2026", participantes: 30, temas: ["Bodas vs. 15 años", "Iluminación", "Arte floral", "Presupuestos que venden", "Inclusión en eventos", "Seguridad e higiene"], reel: "DaToDjGM8Tg" },
  {
    etapa: "Event Summit · 1ª edición",
    titulo: "La Rural",
    lugar: "18 de septiembre de 2026",
    foto: "/img/summit/lg/sum-28.webp",
    slug: "primera-edicion",
    numero: "I",
    resumen:
      "La primera edición del Sweet Flowers Event Summit: una jornada entera de charlas, escena montada, pasarela y comunidad. El día en que el rubro se juntó en un mismo lugar.",
  },
  { etapa: "Event Summit · 2ª edición", titulo: "9 de abril de 2027", detalle: "Preventa abierta", proxima: true },
];

/** Etapas con página propia (workshops + ediciones pasadas). */
export const ETAPAS_CON_PAGINA = TRAYECTORIA.filter((t): t is Etapa & { slug: string } => Boolean(t.slug));


/**
 * Asistentes sumando los 7 workshops (participantes de cada uno, arriba): 340.
 * Sin contar la 1ª edición del Summit.
 * TODO(contenido): confirmar con Flor que las cifras por workshop son las buenas.
 */
export const ASISTENTES_WORKSHOPS = TRAYECTORIA.reduce((n, t) => n + (t.participantes ?? 0), 0);

/** Ciudades donde se hicieron workshops (las sedes nombradas; el hotel se omite). */
export const CIUDADES_WORKSHOPS = ["CABA", "La Rioja", "Río Cuarto"] as const;

// Trayectoria (§11 y datos de cada workshop).
export const STATS = [
  { valor: WORKSHOPS_REALIZADOS, prefijo: "", sufijo: "", label: "Workshops" },
  { valor: ASISTENTES_WORKSHOPS, prefijo: "+", sufijo: "", label: "Asistentes en workshops" },
  { valor: CIUDADES_WORKSHOPS.length, prefijo: "", sufijo: "", label: "Ciudades" },
  { valor: 20, prefijo: "+", sufijo: "", label: "Disertantes" },
] as const;

// Escenarios que nos recibieron (§11). La 7ª sede (un hotel) se OMITE a propósito.
export const SEDES = [
  { lugar: "Centro Naval", ciudad: "CABA" },
  { lugar: "Madero Tango", ciudad: "Puerto Madero" },
  { lugar: "La Rioja Capital", ciudad: "La Rioja" },
  { lugar: "Río Cuarto", ciudad: "Córdoba" },
  { lugar: "Palacio San Miguel", ciudad: "CABA" },
  { lugar: "La Rural", ciudad: "CABA" },
] as const;

// Disertantes: 3 confirmados; nombres y temas ⬜ (§10).
// TODO(contenido): nombres reales, especialidad, foto y tema de cada disertante.
export const DISERTANTES = [
  { nombre: "[Disertante 01]", tema: "Tema a confirmar" },
  { nombre: "[Disertante 02]", tema: "Tema a confirmar" },
  { nombre: "[Disertante 03]", tema: "Tema a confirmar" },
] as const;
