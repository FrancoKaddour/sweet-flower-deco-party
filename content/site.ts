// Contenido del sitio centralizado (única fuente de verdad para navegación y
// enlaces). Header y Footer consumen de acá para que no se dupliquen ni deriven.
// TODO(contenido): reemplazar los href="#" por URLs reales (WhatsApp, redes,
// páginas legales) cuando Flor pase los datos. Ver docs/16_DECISIONS.md.

export type NavLink = { label: string; href: string };

// NOTA DE NAVEGACIÓN (interino): sólo /productos existe como página propia. Las
// demás secciones apuntan a anclas de la Home ("/#seccion") para que funcionen
// desde CUALQUIER página (una ancla suelta "#seccion" no existe fuera de la Home
// y no llevaría a ningún lado). Cuando se construyan /evento, /membresia,
// /historia y /contacto como páginas, se reemplazan estos href por la ruta real.

/** Navegación principal — compartida por el menú del Header y la columna del Footer. */
export const MAIN_NAV: readonly NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Workshops", href: "/#workshops" },
  { label: "Membresía", href: "/#membresia" },
  { label: "Historia", href: "/#historia" },
] as const;

/** Enlace a Contacto — el Header lo suma al final del menú; el Footer lo lista aparte. */
export const CONTACTO_LINK: NavLink = { label: "Contacto", href: "/#contacto" };

/** Contacto directo (Footer). href reales a completar. */
export const CONTACTO_LINKS: readonly NavLink[] = [
  { label: "WhatsApp", href: "#" },
  { label: "Email", href: "#" },
  { label: "Instagram", href: "#" },
] as const;

/** Enlaces informativos / legales (Footer). */
export const INFO_LINKS: readonly NavLink[] = [
  { label: "Envíos", href: "#" },
  { label: "Cambios", href: "#" },
  { label: "Términos", href: "#" },
  { label: "Privacidad", href: "#" },
] as const;
