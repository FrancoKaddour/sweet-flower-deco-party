// Vocabulario de estados (compartido entre server y client: sin "server-only").

export type Tono = "neutral" | "success" | "warning" | "danger" | "info";

export const ESTADOS_PEDIDO = [
  { v: "nuevo", l: "Nuevo", tono: "warning" },
  { v: "confirmado", l: "Confirmado", tono: "info" },
  { v: "en_produccion", l: "En producción", tono: "info" },
  { v: "enviado", l: "Enviado", tono: "info" },
  { v: "entregado", l: "Entregado", tono: "success" },
  { v: "cancelado", l: "Cancelado", tono: "danger" },
] as const satisfies readonly { v: string; l: string; tono: Tono }[];

export const ESTADOS_CONSULTA = [
  { v: "nueva", l: "Nueva", tono: "warning" },
  { v: "respondida", l: "Respondida", tono: "success" },
  { v: "archivada", l: "Archivada", tono: "neutral" },
] as const satisfies readonly { v: string; l: string; tono: Tono }[];

export const ESTADOS_INSCRIPCION = [
  { v: "consulto", l: "Consultó", tono: "warning" },
  { v: "seno", l: "Señó", tono: "info" },
  { v: "pago", l: "Pagó", tono: "success" },
  { v: "asistio", l: "Asistió", tono: "success" },
  { v: "cancelado", l: "Cancelado", tono: "danger" },
] as const satisfies readonly { v: string; l: string; tono: Tono }[];

export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number]["v"];
export type EstadoConsulta = (typeof ESTADOS_CONSULTA)[number]["v"];
export type EstadoInscripcion = (typeof ESTADOS_INSCRIPCION)[number]["v"];

export function infoEstado<T extends { v: string; l: string; tono: Tono }>(lista: readonly T[], v: string) {
  return lista.find((e) => e.v === v) ?? lista[0];
}

/** Normaliza un teléfono argentino al formato de wa.me (549 + área + número). */
export function telefonoWhatsApp(tel: string | null | undefined): string | null {
  if (!tel) return null;
  let d = tel.replace(/\D/g, "");
  if (d.length < 8) return null;
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("54")) d = d.slice(2);
  if (d.startsWith("9")) d = d.slice(1);
  if (d.startsWith("0")) d = d.slice(1);
  // "15" después del código de área (ej. 11 15 xxxx xxxx) → se quita.
  d = d.replace(/^(\d{2,4})15(\d{6,8})$/, "$1$2");
  return d.length >= 10 ? `549${d}` : null;
}
