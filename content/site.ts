// Contenido del sitio centralizado (única fuente de verdad para navegación y
// enlaces). Header y Footer consumen de acá para que no se dupliquen ni deriven.
// TODO(contenido): reemplazar los href="#" por URLs reales (WhatsApp, redes,
// páginas legales) cuando Flor pase los datos. Ver docs/16_DECISIONS.md.

export type NavLink = { label: string; href: string };

// Todas las secciones del menú ya son páginas propias (el sitio completo navega).
// TODO(contenido): definir si la etiqueta "Workshops" se renombra a "Evento"
// (la página es el Sweet Flowers Event Summit). Decisión de Franco.

/** Navegación principal — compartida por el menú del Header y la columna del Footer. */
export const MAIN_NAV: readonly NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Workshops", href: "/evento" },
  { label: "Membresía", href: "/membresia" },
  { label: "Historia", href: "/historia" },
] as const;

/** Enlace a Contacto — el Header lo suma al final del menú; el Footer lo lista aparte. */
export const CONTACTO_LINK: NavLink = { label: "Contacto", href: "/contacto" };

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
