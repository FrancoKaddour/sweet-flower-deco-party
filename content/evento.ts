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

export const EVENT_DATE_ISO: string | null = "2027-04-09T09:00:00-03:00"; // ✅ fecha · horario ⬜
export const EVENT_YEAR = 2027;
/** Cuándo es, en texto. */
export const EVENT_WHEN = "9 de abril de 2027";
/** @deprecated usar EVENT_WHEN */
export const EVENT_DATE_LABEL = EVENT_WHEN;
// TODO(contenido): sede de la 2ª edición.
export const EVENT_SEDE: string | null = null;

export const EVENT_CUPO = 80; // ✅ "por el momento"

// Inscripción ✅ (§18): el que quiere paga directo con Mercado Pago (cuotas);
// el que quiere algo más personalizado, formulario → WhatsApp.
export const EVENT_CTA_HREF = "/event-summit#inscripcion";
// TODO(contenido): link de pago de Mercado Pago de la pre-preventa (lo genera
// Flor desde su cuenta). Mientras sea null, el botón de MP no se muestra.
export const EVENT_MP_LINK: string | null = null;
// TODO(contenido): precio de la pre-preventa (contado / cuotas / vigencia).
export const EVENT_PRECIO: string | null = null;
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
  { etapa: "Event Summit · 2ª edición", titulo: "9 de abril de 2027", detalle: "Pre-preventa abierta", proxima: true },
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
