// Contenido de la página /membresia — fuente única.
// ⚠️ TODO(contenido): TODO este archivo es PLACEHOLDER. Los beneficios reales,
// el precio y los planes los define Flor (ADR-014 / docs/CONTENIDO_FLOR.md).
// La sección Membresía de la Home usa su propia lista corta; al confirmar
// beneficios reales, unificar ambas acá.

/** Nombre de concepto de la membresía (propuesta de marca, a validar con Flor). */
export const CIRCULO_NOMBRE = "El Círculo Sweet Flowers";

/** Manifiesto — se "llena" palabra por palabra con el scroll (ManifiestoScrub). */
export const MANIFIESTO =
  "No es un descuento. Es tener a Flor y a una comunidad entera cerca todo el año: aprender juntas, llegar antes que nadie y crecer con el respaldo de las que ya lo lograron.";

/** Beneficios (cartas apiladas). TODO(contenido): lista real de Flor. */
export const BENEFICIOS = [
  {
    titulo: "Descuentos en toda la tienda",
    desc: "Cada pieza del catálogo, siempre con precio de miembro.",
  },
  {
    titulo: "Acceso anticipado",
    desc: "Las piezas nuevas y los cupos del Summit, antes que nadie.",
  },
  {
    titulo: "Clases y contenido exclusivo",
    desc: "El oficio compartido: técnicas, procesos y trastienda.",
  },
  {
    titulo: "Prioridad en fechas",
    desc: "Tu evento primero en el calendario de producción.",
  },
  {
    titulo: "Comunidad privada",
    desc: "Decoradoras de todo el país que empujan para el mismo lado.",
  },
] as const;

/** Sinceridad que construye confianza (estrategia §5). TODO(contenido). */
export const PARA_QUIEN = [
  "Vivís de decorar eventos, o estás decidida a vivir de esto.",
  "Querés comunidad de verdad, no seguidores.",
  "Preferís aprender el oficio antes que copiar tendencias.",
] as const;

export const NO_ES_PARA = [
  "Buscás solo un cupón de descuento.",
  "Querés resultados mágicos sin proceso.",
  "No te interesa compartir con otras colegas.",
] as const;

/** CTA de alta: aún no existe flujo online → va a contacto. TODO(contenido). */
export const MEMBRESIA_CTA_HREF = "/contacto";
