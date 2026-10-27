import type { ComponentType } from "react";
import { IconInicio, IconCatalogo, IconAjustes, IconVentas, IconConsultas, IconComunidad, IconCampanas } from "@/components/panel/icons";

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
  /** Clave del contador de pendientes que se muestra al lado (si hay). */
  pendientes?: "pedidos" | "consultas" | "inscripciones";
};

export const PANEL_NAV: NavItem[] = [
  {
    label: "Inicio",
    href: "/panel",
    icon: IconInicio,
    descripcion: "Cómo viene el negocio hoy.",
  },
  {
    label: "Pedidos",
    href: "/panel/pedidos",
    icon: IconVentas,
    descripcion: "Pedidos del carrito y su estado.",
    pendientes: "pedidos",
  },
  {
    label: "Catálogo",
    href: "/panel/productos",
    icon: IconCatalogo,
    descripcion: "Productos, fotos, precios y categorías.",
  },
  {
    label: "Consultas",
    href: "/panel/consultas",
    icon: IconConsultas,
    descripcion: "Mensajes del formulario de contacto.",
    pendientes: "consultas",
  },
  {
    label: "Summit",
    href: "/panel/summit",
    icon: IconComunidad,
    descripcion: "Inscripciones, pagos y acreditación del Event Summit.",
    pendientes: "inscripciones",
  },
  {
    label: "Newsletter",
    href: "/panel/newsletter",
    icon: IconCampanas,
    descripcion: "Club Sweet Flowers: suscriptores y campañas.",
  },
  {
    label: "Ajustes",
    href: "/panel/ajustes",
    icon: IconAjustes,
    descripcion: "Equipo y permisos del panel.",
  },
];

/** Devuelve true si `href` es la ruta activa (exacta para "/panel", prefijo para el resto). */
export function esRutaActiva(href: string, pathname: string): boolean {
  if (href === "/panel") return pathname === "/panel";
  return pathname === href || pathname.startsWith(`${href}/`);
}
