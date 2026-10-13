// Datos del Sweet Flowers Event Summit — fuente única.
// EVENT_NAME se define acá y en NINGÚN otro lado (ADR-008 / docs/CONTENIDO_FLOR.md §10).
// ✅ confirmado · 🟡 a confirmar · ⬜ pendiente. Nada de esto se inventa.

export const EVENT_NAME = "Sweet Flowers Event Summit"; // ✅ (NO es un workshop)

// La 8ª edición fue el 18/09/2026 ✅. La PRÓXIMA es la 9ª, a comienzos de
// 2027 ✅ (dicho por Franco/Flor, oct-2026). Fecha exacta ⬜.
export const EDICIONES_PREVIAS = 8;
export const EDICION_NUMERO = EDICIONES_PREVIAS + 1;

// TODO(contenido): fecha exacta (ISO) de la 9ª edición. Mientras sea null, la
// cuenta regresiva se oculta y se muestra EVENT_WHEN.
export const EVENT_DATE_ISO: string | null = null;
export const EVENT_YEAR = 2027;
/** Cuándo es, en texto: "Comienzos de 2027" hasta tener la fecha exacta. */
export const EVENT_WHEN = "Comienzos de 2027";
/** @deprecated usar EVENT_WHEN */
export const EVENT_DATE_LABEL = EVENT_WHEN;

export const EVENT_CUPO = 80; // ✅ "por el momento"

// CTA de reserva: la inscripción hoy es por transferencia / contacto directo.
// TODO(contenido): reemplazar por /evento/inscripcion cuando exista el flujo online.
export const EVENT_CTA_HREF = "/contacto";

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
  { valor: EDICIONES_PREVIAS, prefijo: "", sufijo: "", label: "Ediciones" },
  { valor: 180, prefijo: "+", sufijo: "", label: "Asistentes" },
  { valor: 20, prefijo: "+", sufijo: "", label: "Disertantes" },
  { valor: EVENT_CUPO, prefijo: "", sufijo: "", label: "Cupos esta edición" },
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
