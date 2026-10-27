// Vocabulario de estados (compartido entre server y client: sin "server-only").

export type Tono = "neutral" | "success" | "warning" | "danger" | "info";

export const ESTADOS_PEDIDO = [
  { v: "iniciado", l: "Iniciado (abrió WhatsApp)", tono: "neutral" },
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

// Flujo 100% online (P-10): "consulto" = empezó la inscripción y todavía no
// pagó (checkout abierto o abandonado). "Señó" queda solo para acuerdos manuales.
export const ESTADOS_INSCRIPCION = [
  { v: "consulto", l: "Empezó (sin pagar)", tono: "neutral" },
  { v: "seno", l: "Señó (manual)", tono: "info" },
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

/* ───────────── Permisos (fuente única: las actions y Ajustes leen esto) ───────────── */

export type RolPanel = "superadmin" | "admin" | "editor";
const TODOS: readonly RolPanel[] = ["superadmin", "admin", "editor"];
const ADMINS: readonly RolPanel[] = ["superadmin", "admin"];

/** Qué puede hacer cada rol. `l` es el texto que se muestra en Ajustes. */
export const PERMISOS = {
  productoEditar: { l: "Cargar y editar productos, fotos, precios y variantes", roles: TODOS },
  productoBorrar: { l: "Mandar productos a la papelera y restaurarlos", roles: ADMINS },
  preciosMasivos: { l: "Subir precios por categoría (aumento masivo)", roles: ADMINS },
  categorias: { l: "Editar categorías (textos, portada, orden)", roles: ADMINS },
  estados: { l: "Cambiar estados y notas de pedidos, consultas e inscripciones", roles: TODOS },
  checkIn: { l: "Acreditar en el Summit y reenviar entradas", roles: TODOS },
  archivar: { l: "Archivar y restaurar pedidos, consultas e inscripciones", roles: ADMINS },
  dniCompleto: { l: "Ver y descargar el DNI completo de las inscripciones", roles: ADMINS },
  campanaArmar: { l: "Armar campañas y mandarse una prueba", roles: TODOS },
  campanaEnviar: { l: "Enviar y borrar campañas", roles: ADMINS },
  suscriptores: { l: "Marcar códigos usados y sumar suscriptores a mano", roles: TODOS },
  suscriptorBaja: { l: "Dar de baja o reactivar suscriptores", roles: ADMINS },
  actividad: { l: "Ver la actividad del panel y cerrar sesiones", roles: ADMINS },
} as const satisfies Record<string, { l: string; roles: readonly RolPanel[] }>;

export type Permiso = keyof typeof PERMISOS;

export function puede(rol: string | null | undefined, permiso: Permiso): boolean {
  return (PERMISOS[permiso].roles as readonly string[]).includes(rol ?? "");
}
