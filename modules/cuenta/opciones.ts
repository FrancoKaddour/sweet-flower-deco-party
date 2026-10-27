/**
 * Perfil del cliente — opciones y validación COMPARTIDAS (server y client, sin
 * "server-only"). La base guarda los valores `v`; la UI muestra `l`.
 */
import { z } from "zod";
import { telefonoWhatsApp } from "@/modules/ventas/estados";

export const TIPOS_CLIENTE = [
  { v: "decoradora", l: "Decoradora / decorador" },
  { v: "organizadora", l: "Organizo eventos" },
  { v: "particular", l: "Particular (mi propio evento)" },
  { v: "empresa", l: "Empresa / salón" },
] as const;

export const TRANSPORTES = [
  { v: "via_cargo", l: "Vía Cargo" },
  { v: "buspack", l: "Buspack" },
  { v: "md", l: "MD" },
  { v: "flechabus", l: "FlechaBus" },
  { v: "retiro", l: "Retiro en persona" },
] as const;

/** Las 24 jurisdicciones (23 provincias + CABA). */
export const PROVINCIAS = [
  "Ciudad Autónoma de Buenos Aires",
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
] as const;

export type TipoClienteV = (typeof TIPOS_CLIENTE)[number]["v"];
export type TransporteV = (typeof TRANSPORTES)[number]["v"];

const vacioANull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);
const opc = <T extends z.ZodType>(s: T) => z.preprocess(vacioANull, s.optional()).transform((v) => (v ?? null) as z.output<T> | null);
const texto = (max: number, msg = "Es muy largo.") => z.string().trim().max(max, msg);

/** "C1425ABC" (CPA) o "1425" (CP). */
export const CP_RE = /^(\d{4}|[A-Z]\d{4}[A-Z]{3})$/;

export const perfilSchema = z.object({
  nombre: z.string().trim().min(2, "Escribí tu nombre.").max(60, "Es muy largo."),
  apellido: opc(texto(60)),
  telefono: opc(
    z
      .string()
      .trim()
      .max(30, "Revisá el celular.")
      .regex(/^[\d\s()+-]+$/, "Usá solo números (podés dejar espacios o guiones).")
      .refine((v) => telefonoWhatsApp(v) != null, "Escribilo con código de área, ej. 11 5555 5555."),
  ),
  dni: opc(
    z
      .string()
      .trim()
      .transform((v) => v.replace(/[.\s-]/g, ""))
      .pipe(z.string().regex(/^\d{7,8}$/, "El DNI tiene 7 u 8 números.")),
  ),
  tipoCliente: opc(z.enum(TIPOS_CLIENTE.map((t) => t.v) as [TipoClienteV, ...TipoClienteV[]], "Elegí una opción.")),
  emprendimiento: opc(texto(80)),
  instagram: opc(
    z
      .string()
      .trim()
      .transform((v) => v.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/^@/, "").replace(/\/.*$/, ""))
      .pipe(z.string().regex(/^[A-Za-z0-9._]{1,30}$/, "Escribí solo el usuario, ej. sweetflowersdecoparty.")),
  ),
  calle: opc(texto(100)),
  numero: opc(texto(10, "Revisá el número.").regex(/^[\dA-Za-z\s/-]+$/, "Revisá el número (o escribí S/N).")),
  pisoDepto: opc(texto(30)),
  localidad: opc(texto(80)),
  provincia: opc(z.enum(PROVINCIAS, "Elegí una provincia de la lista.")),
  codigoPostal: opc(
    z
      .string()
      .trim()
      .transform((v) => v.toUpperCase().replace(/\s/g, ""))
      .pipe(z.string().regex(CP_RE, "Código postal de 4 números (1425) o CPA de 8 (C1425ABC).")),
  ),
  transporte: opc(z.enum(TRANSPORTES.map((t) => t.v) as [TransporteV, ...TransporteV[]], "Elegí una opción.")),
  contactoWhatsapp: z.boolean(),
  contactoEmail: z.boolean(),
});

export type PerfilInput = z.output<typeof perfilSchema>;
export type CampoPerfil = keyof PerfilInput | "privacidad";

/** Lee el FormData del formulario de /cuenta. */
export function perfilDesdeForm(fd: FormData) {
  const g = (k: string) => {
    const v = fd.get(k);
    return typeof v === "string" ? v : undefined;
  };
  return {
    nombre: g("nombre") ?? "",
    apellido: g("apellido"),
    telefono: g("telefono"),
    dni: g("dni"),
    tipoCliente: g("tipoCliente"),
    emprendimiento: g("emprendimiento"),
    instagram: g("instagram"),
    calle: g("calle"),
    numero: g("numero"),
    pisoDepto: g("pisoDepto"),
    localidad: g("localidad"),
    provincia: g("provincia"),
    codigoPostal: g("codigoPostal"),
    transporte: g("transporte"),
    contactoWhatsapp: fd.get("contactoWhatsapp") === "si",
    contactoEmail: fd.get("contactoEmail") === "si",
  };
}
