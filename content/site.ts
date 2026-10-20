// Contenido del sitio centralizado (única fuente de verdad para navegación y
// enlaces). Header y Footer consumen de acá para que no se dupliquen ni deriven.
// TODO(contenido): reemplazar los href="#" por URLs reales (WhatsApp, redes,
// páginas legales) cuando Flor pase los datos. Ver docs/16_DECISIONS.md.

export type NavLink = {
  label: string;
  href: string;
  /** Ítem destacado (Event Summit): se resalta en menú/footer. */
  destacado?: boolean;
  /** Dato corto que acompaña al destacado (ej. "2027"). */
  meta?: string;
};

// Todas las secciones del menú ya son páginas propias (el sitio completo navega).
// Event Summit y Workshops son páginas DISTINTAS (oct-2026). El Summit va
// segundo y destacado: es la prioridad de la clienta.

/** Navegación principal — compartida por el menú del Header y la columna del Footer. */
export const MAIN_NAV: readonly NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Event Summit", href: "/event-summit", destacado: true, meta: "2027" },
  { label: "Catering", href: "/productos/catering" },
  { label: "Ambientación", href: "/productos" },
  { label: "Historia", href: "/historia" },
] as const;

/** Enlace a Contacto — el Header lo suma al final del menú; el Footer lo lista aparte. */
export const CONTACTO_LINK: NavLink = { label: "Contacto", href: "/contacto" };

/** Contacto directo (Footer). TODO(contenido): email cuando Flor lo pase. */
export const CONTACTO_LINKS: readonly NavLink[] = [
  { label: "WhatsApp", href: "https://wa.me/5491151064010" },
  { label: "Instagram", href: "https://www.instagram.com/sweetflowersdecoparty/" },
] as const;

/** Enlaces informativos / legales (Footer). */
export const INFO_LINKS: readonly NavLink[] = [
  { label: "Envíos", href: "#" },
  { label: "Cambios", href: "#" },
  { label: "Términos", href: "#" },
  { label: "Privacidad", href: "#" },
] as const;

// WhatsApp de contacto (botón flotante).
// Línea de VENTAS (11 5106-4010). Formato internacional sin "+": 549 + área + número.
export const WHATSAPP_NUMBER = "5491151064010";
export const WHATSAPP_MESSAGE =
  "¡Hola Flor! Vengo de la web de Sweet Flowers y quiero consultar por un evento.";
export const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
