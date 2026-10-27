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

/* ───────────── Precio (P-11) ───────────── */

export type ResultadoPrecio = { ok: true; valor: number | null } | { ok: false; error: string };

/**
 * Lee un precio en pesos tal como lo tipea Flor: "15000", "15.000", "$ 15.000".
 * Rechaza centavos ("15000.00", "1.5", "15000,50") en vez de adivinar: antes
 * "15000.00" se guardaba como $1.500.000. Vacío = a consultar (null).
 */
export function parsePrecio(entrada: string): ResultadoPrecio {
  const v = entrada.replace(/[\s$]/g, "");
  if (v === "") return { ok: true, valor: null };
  if (/[.,]\d{1,2}$/.test(v)) return { ok: false, error: "Sin centavos: escribí el precio en pesos enteros (ej. 15000 o 15.000)." };
  if (!/^\d{1,3}([.,]?\d{3})*$/.test(v) && !/^\d+$/.test(v)) return { ok: false, error: "Escribí solo números (ej. 15000 o 15.000)." };
  const n = Number(v.replace(/[.,]/g, ""));
  if (!Number.isSafeInteger(n) || n < 0 || n >= 100_000_000) return { ok: false, error: "Precio fuera de rango." };
  return { ok: true, valor: n };
}

/* ───────────── Variantes (formato acordado en modules/catalog/types.ts) ───────────── */

export type VarianteInput = { etiqueta: string; precio: number | null };

/** El editor manda JSON `[{etiqueta, precio}]` (precio como texto o número). Acepta también "A, B, C". */
export function parseVariantes(raw: string): { ok: true; valor: VarianteInput[] } | { ok: false; error: string } {
  const t = raw.trim();
  if (!t) return { ok: true, valor: [] };
  let lista: unknown;
  try {
    lista = JSON.parse(t);
  } catch {
    lista = t.split(/[,\n]/).map((x) => ({ etiqueta: x, precio: "" }));
  }
  if (!Array.isArray(lista)) return { ok: false, error: "Variantes inválidas." };
  const out: VarianteInput[] = [];
  for (const [i, x] of lista.entries()) {
    const o = (x ?? {}) as { etiqueta?: unknown; precio?: unknown };
    const etiqueta = String(o.etiqueta ?? "").trim();
    const precioTxt = o.precio == null ? "" : String(o.precio);
    if (!etiqueta) {
      if (precioTxt.trim()) return { ok: false, error: `La variante ${i + 1} tiene precio pero no nombre.` };
      continue;
    }
    if (etiqueta.length > 60) return { ok: false, error: `"${etiqueta.slice(0, 20)}…": máximo 60 caracteres.` };
    const p = parsePrecio(precioTxt);
    if (!p.ok) return { ok: false, error: `${etiqueta}: ${p.error}` };
    out.push({ etiqueta, precio: p.valor });
  }
  if (out.length > 30) return { ok: false, error: "Máximo 30 variantes." };
  return { ok: true, valor: out };
}

export const productoSchema = z.object({
  nombre: texto(140).min(2, "Poné un nombre (mínimo 2 letras)."),
  slug: texto(80)
    .transform((v) => slugify(v))
    .refine((v) => v.length >= 2, "La dirección en el sitio quedó vacía."),
  categoryId: z.string().min(1, "Elegí una categoría."),
  precio: z
    .string()
    .trim()
    .default("")
    .transform((v, ctx) => {
      const r = parsePrecio(v);
      if (!r.ok) {
        ctx.addIssue({ code: "custom", message: r.error });
        return z.NEVER;
      }
      return r.valor;
    }),
  descripcion: texto(4000).default(""),
  medidas: texto(300)
    .transform((v) => v || null)
    .nullable()
    .default(null),
  variantes: z
    .string()
    .max(8000)
    .default("")
    .transform((v, ctx) => {
      const r = parseVariantes(v);
      if (!r.ok) {
        ctx.addIssue({ code: "custom", message: r.error });
        return z.NEVER;
      }
      return r.valor;
    }),
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
