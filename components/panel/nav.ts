import type { ComponentType } from "react";
import {
  IconInicio,
  IconCatalogo,
  IconContenido,
  IconVentas,
  IconComunidad,
  IconCampanas,
  IconConsultas,
  IconAjustes,
} from "@/components/panel/icons";

// Definición única de la navegación del panel. La consumen el Sidebar (nav) y el
// Topbar (para resolver el título de la sección activa). Un solo lugar donde
// agregar/quitar módulos.

export type IconoNav = ComponentType<{ className?: string }>;

export type NavItem = {
  label: string;
  href: string;
  icon: IconoNav;
  /** Descripción corta para el título de sección en el Topbar. */
  descripcion: string;
};

export const PANEL_NAV: NavItem[] = [
  {
    label: "Inicio",
    href: "/panel",
    icon: IconInicio,
    descripcion: "Resumen del negocio de un vistazo.",
  },
  {
    label: "Catálogo",
    href: "/panel/productos",
    icon: IconCatalogo,
    descripcion: "Productos, materiales y medios.",
  },
  {
    label: "Contenido",
    href: "/panel/contenido",
    icon: IconContenido,
    descripcion: "Eventos, testimonios y textos del sitio.",
  },
  {
    label: "Ventas",
    href: "/panel/ventas",
    icon: IconVentas,
    descripcion: "Órdenes y estado de despacho.",
  },
  {
    label: "Comunidad",
    href: "/panel/contactos",
    icon: IconComunidad,
    descripcion: "CRM: contactos, miembros e inscripciones.",
  },
  {
    label: "Campañas",
    href: "/panel/campanas",
    icon: IconCampanas,
    descripcion: "Email marketing a segmentos con opt-in.",
  },
  {
    label: "Consultas",
    href: "/panel/consultas",
    icon: IconConsultas,
    descripcion: 'Bandeja de presupuestos "a medida".',
  },
  {
    label: "Ajustes",
    href: "/panel/ajustes",
    icon: IconAjustes,
    descripcion: "Usuarios y roles del panel.",
  },
];

/** Devuelve true si `href` es la ruta activa (exacta para "/panel", prefijo para el resto). */
export function esRutaActiva(href: string, pathname: string): boolean {
  if (href === "/panel") return pathname === "/panel";
  return pathname === href || pathname.startsWith(`${href}/`);
}
