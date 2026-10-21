import type { ComponentType } from "react";
import { IconInicio, IconCatalogo, IconAjustes } from "@/components/panel/icons";

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
    descripcion: "Resumen del catálogo y accesos rápidos.",
  },
  {
    label: "Catálogo",
    href: "/panel/productos",
    icon: IconCatalogo,
    descripcion: "Productos, fotos, precios y categorías.",
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
