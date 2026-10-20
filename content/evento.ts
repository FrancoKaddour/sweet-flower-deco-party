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

// Inscripción: TODO por WhatsApp (sin pago en el sitio — decisión oct-2026).
// El formulario de /event-summit#inscripcion abre la línea de capacitaciones.
export const EVENT_CTA_HREF = "/event-summit#inscripcion";
/** Precio de referencia (el más bajo vigente) para resúmenes. */
export const EVENT_PRECIO: string | null = "Desde $150.000";

// PASES y PREVENTAS ✅ (Flor, 20/10/2026). Precios en ARS: transferencia y por
// link de Mercado Pago (el link lo mandan por WhatsApp; no se paga en el sitio).
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
  precios: Record<PaseId, { transferencia: number; mp: number }>;
};

export const PREVENTAS: readonly Preventa[] = [
  {
    id: "comunidad",
    nombre: "Preventa Comunidad VIP Sweet Flowers",
    hasta: "2026-11-10",
    hastaLabel: "hasta el 10/11",
    precios: {
      vip: { transferencia: 280000, mp: 330000 },
      general: { transferencia: 150000, mp: 180000 },
    },
  },
  {
    id: "general",
    nombre: "Preventa general",
    hasta: "2026-12-15",
    hastaLabel: "hasta el 15/12",
    precios: {
      vip: { transferencia: 320000, mp: 370000 },
      general: { transferencia: 220000, mp: 260000 },
    },
  },
];

/** Preventa vigente hoy (o null si ya pasaron todas). */
export function preventaVigente(hoy = new Date()): Preventa | null {
  const d = hoy.toISOString().slice(0, 10);
  return PREVENTAS.find((p) => d <= p.hasta) ?? null;
}

export const EXTRAS_NOTA = "Actividades extra el 7 y 8 de abril: se abonan aparte.";
/** Línea de WhatsApp de capacitaciones / Summit (11 5512-7508). */
export const EVENT_WHATSAPP = "5491155127508";

/** El camino hasta acá: 7 workshops → 1ª edición → 2ª edición. */
export const TRAYECTORIA: readonly {
  etapa: string;
  titulo: string;
  lugar?: string;
  detalle?: string;
  proxima?: boolean;
}[] = [
  // Sedes de los workshops en orden (§11). El 7º se hizo en un hotel que NO se nombra.
  { etapa: "Workshop 01", titulo: "Centro Naval", lugar: "CABA" },
  { etapa: "Workshop 02", titulo: "Madero Tango", lugar: "Puerto Madero" },
  { etapa: "Workshop 03", titulo: "La Rioja Capital", lugar: "La Rioja" },
  { etapa: "Workshop 04", titulo: "Río Cuarto", lugar: "Córdoba" },
  { etapa: "Workshop 05", titulo: "Palacio San Miguel", lugar: "CABA" },
  { etapa: "Workshop 06", titulo: "La Rural", lugar: "CABA" },
  { etapa: "Workshop 07", titulo: "Séptimo workshop" },
  { etapa: "Event Summit · 1ª edición", titulo: "La Rural", lugar: "18 de septiembre de 2026" },
  { etapa: "Event Summit · 2ª edición", titulo: "9 de abril de 2027", detalle: "Preventa abierta", proxima: true },
];

// Qué incluye — TODOS ✅ (§10).
export const INCLUYE = [
  {
    titulo: "Todas las charlas",
    desc: "Acceso completo a la jornada de disertaciones.",
  },
  {
    titulo: "Certificado de asistencia",
    desc: "Tu paso por el summit, documentado.",
  },
  { titulo: "Coffee break", desc: "Pausas para conectar y recargar." },
  {
    titulo: "Comunidad privada",
    desc: "Grupo de WhatsApp exclusivo entre asistentes.",
  },
  {
    titulo: "20% de descuento",
    desc: "En cualquier compra desde que señás tu lugar.",
  },
  {
    titulo: "Proveedores recomendados",
    desc: "Beneficios con nuestra red de confianza.",
  },
  {
    titulo: "Asesoramiento",
    desc: "Acompañamiento para tu camino en el rubro.",
  },
] as const;

// Trayectoria (§11) — cifras aproximadas dichas por Flor (de memoria).
export const STATS = [
  { valor: WORKSHOPS_REALIZADOS, prefijo: "", sufijo: "", label: "Workshops" },
  { valor: 180, prefijo: "+", sufijo: "", label: "Asistentes" },
  { valor: 20, prefijo: "+", sufijo: "", label: "Disertantes" },
  { valor: EVENT_CUPO, prefijo: "", sufijo: "", label: "Cupos 2ª edición" },
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
