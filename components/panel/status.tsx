import { Badge } from "@/components/panel/Badge";
import type {
  EstadoPedidoPago,
  EstadoEnvio,
  EstadoProducto,
  EstadoLead,
  EstadoCampana,
  EstadoMembresia,
} from "@/lib/panel/mock";

// Mapeos estado → chip. Centralizados acá para que las tablas queden limpias y
// para que el vocabulario de estados (y sus colores) sea consistente en todo el
// panel. Etiquetas legibles en es-AR.

export function ChipPago({ estado }: { estado: EstadoPedidoPago }) {
  const map = {
    aprobado: { variant: "success" as const, label: "Aprobado" },
    pendiente: { variant: "warning" as const, label: "Pendiente" },
    rechazado: { variant: "danger" as const, label: "Rechazado" },
  };
  const { variant, label } = map[estado];
  return <Badge variant={variant}>{label}</Badge>;
}

export function ChipEnvio({ estado }: { estado: EstadoEnvio }) {
  const map = {
    "a-preparar": { variant: "info" as const, label: "A preparar" },
    enviado: { variant: "warning" as const, label: "Enviado" },
    entregado: { variant: "success" as const, label: "Entregado" },
  };
  const { variant, label } = map[estado];
  return <Badge variant={variant}>{label}</Badge>;
}

export function ChipProducto({ estado }: { estado: EstadoProducto }) {
  const map = {
    publicado: { variant: "success" as const, label: "Publicado" },
    borrador: { variant: "neutral" as const, label: "Borrador" },
    agotado: { variant: "danger" as const, label: "Agotado" },
  };
  const { variant, label } = map[estado];
  return <Badge variant={variant}>{label}</Badge>;
}

export function ChipLead({ estado }: { estado: EstadoLead }) {
  const map = {
    nuevo: { variant: "warning" as const, label: "Nuevo" },
    "en-curso": { variant: "info" as const, label: "En curso" },
    cotizado: { variant: "success" as const, label: "Cotizado" },
    cerrado: { variant: "neutral" as const, label: "Cerrado" },
  };
  const { variant, label } = map[estado];
  return <Badge variant={variant}>{label}</Badge>;
}

export function ChipCampana({ estado }: { estado: EstadoCampana }) {
  const map = {
    borrador: { variant: "neutral" as const, label: "Borrador" },
    programada: { variant: "info" as const, label: "Programada" },
    enviada: { variant: "success" as const, label: "Enviada" },
  };
  const { variant, label } = map[estado];
  return <Badge variant={variant}>{label}</Badge>;
}

export function ChipMembresia({ estado }: { estado: EstadoMembresia }) {
  const map = {
    activa: { variant: "success" as const, label: "Activa" },
    vencida: { variant: "danger" as const, label: "Vencida" },
    pendiente: { variant: "warning" as const, label: "Pendiente" },
  };
  const { variant, label } = map[estado];
  return <Badge variant={variant}>{label}</Badge>;
}
