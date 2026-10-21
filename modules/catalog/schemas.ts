import { z } from "zod";

/** Validación de lo que entra desde el panel (skill api-design / owasp). */

const texto = (max: number) => z.string().trim().max(max);

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

export const productoSchema = z.object({
  nombre: texto(140).min(2, "Poné un nombre (mínimo 2 letras)."),
  slug: texto(80)
    .transform((v) => slugify(v))
    .refine((v) => v.length >= 2, "El enlace (slug) quedó vacío."),
  categoryId: z.string().min(1, "Elegí una categoría."),
  precio: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : Number(v.replace(/[.\s$]/g, "").replace(",", "."))))
    .refine((v) => v === null || (Number.isInteger(v) && v >= 0 && v < 100_000_000), "Precio inválido (en pesos, sin centavos)."),
  descripcion: texto(4000).default(""),
  medidas: texto(300)
    .transform((v) => v || null)
    .nullable()
    .default(null),
  variantes: texto(1000)
    .default("")
    .transform((v) =>
      v
        .split(/[,\n]/)
        .map((x) => x.trim())
        .filter(Boolean)
        .slice(0, 30),
    ),
  destacado: z.coerce.boolean().default(false),
  visible: z.coerce.boolean().default(false),
});
export type ProductoInput = z.infer<typeof productoSchema>;

export const categoriaSchema = z.object({
  nombre: texto(80).min(2),
  slug: texto(80).transform(slugify).refine((v) => v.length >= 2),
  linea: z.enum(["catering", "ambientacion"]),
  tagline: texto(200).default(""),
  descripcion: texto(1000).default(""),
  incluye: texto(500)
    .default("")
    .transform((v) =>
      v
        .split(/[,\n]/)
        .map((x) => x.trim())
        .filter(Boolean)
        .slice(0, 8),
    ),
  imagen: texto(1000).transform((v) => v || null).nullable().default(null),
  visible: z.coerce.boolean().default(false),
});

/** Estado devuelto a los formularios (useActionState). */
export type EstadoForm = {
  ok?: boolean;
  mensaje?: string;
  errores?: Record<string, string>;
  id?: string;
};

export function erroresZod(e: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of e.issues) {
    const k = String(i.path[0] ?? "form");
    if (!out[k]) out[k] = i.message;
  }
  return out;
}
