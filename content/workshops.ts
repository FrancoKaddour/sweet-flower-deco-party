// Workshops — página propia (/workshops), separada del Event Summit (oct-2026).
// ⚠️ TODO lo de este archivo es PLACEHOLDER: no hay contenido real de los
// workshops en los docs (temas, fechas, modalidad, precios). Lo completa Flor.
// La estructura está lista para reemplazar textos sin tocar el diseño.

// TODO(contenido): temas reales de los workshops.
export const APRENDIZAJES = [
  { titulo: "Armado de estructuras", desc: "Arcos, bases y paneles: cómo se montan, se fijan y se desarman sin dañarlos." },
  { titulo: "Diseño de la escena", desc: "Composición, paleta y jerarquía: que una mesa se lea como una sola idea." },
  { titulo: "Telas y terminaciones", desc: "Fundas, drapeados y detalles que hacen que una pieza se vea profesional." },
  { titulo: "Logística del evento", desc: "Traslado, tiempos de armado y checklist para que nada falle el día D." },
  { titulo: "El negocio de decorar", desc: "Costos, presupuestos y cómo rentabilizar piezas reutilizables." },
] as const;

// TODO(contenido): fechas, sede, modalidad y cupos reales.
export const PROXIMOS = [
  { fecha: "A confirmar", titulo: "Workshop de armado de arcos", modalidad: "Presencial", cupos: "Cupos limitados" },
  { fecha: "A confirmar", titulo: "Workshop de mesas dulces", modalidad: "Presencial", cupos: "Cupos limitados" },
  { fecha: "A confirmar", titulo: "Workshop de telas y fundas", modalidad: "Presencial", cupos: "Cupos limitados" },
] as const;

// TODO(contenido): perfiles reales de alumnas.
export const PARA_QUIEN = [
  { titulo: "Si estás empezando", desc: "Querés aprender el oficio desde la base, con método y sin prueba y error." },
  { titulo: "Si ya decorás", desc: "Querés subir el nivel de tus montajes y cobrar como profesional." },
  { titulo: "Si tenés un salón o estudio", desc: "Querés formar a tu equipo con un criterio estético único." },
] as const;

// TODO(contenido): reemplazar por contacto/inscripción real de workshops.
export const WORKSHOPS_CTA_HREF = "/contacto";
