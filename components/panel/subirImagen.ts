"use client";

import { upload } from "@vercel/blob/client";

/**
 * P-29: antes de subir, la foto se achica en el celular a 2400 px del lado
 * largo y se pasa a WEBP (calidad 0,86). Una foto de 12 MB del iPhone queda en
 * ~600 KB. Si el navegador no puede (formato raro), sube el original.
 */
const LADO_MAX = 2400;

export async function comprimir(f: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(f.type) && !/\.(jpe?g|png|webp|heic)$/i.test(f.name)) return f;
  try {
    const bmp = await createImageBitmap(f, { imageOrientation: "from-image" });
    const k = Math.min(1, LADO_MAX / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * k);
    const h = Math.round(bmp.height * k);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return f;
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.86));
    if (!blob || blob.type !== "image/webp") return f;
    // Si ya venía chica y liviana, no la empeoramos.
    if (blob.size >= f.size && k === 1) return f;
    return new File([blob], f.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    return f;
  }
}

/** Comprime y sube a Blob vía /api/panel/upload, informando el porcentaje. */
export async function subirFoto(carpeta: string, f: File, onProgreso?: (pct: number) => void): Promise<string> {
  const lista = await comprimir(f);
  if (lista.size > 15 * 1024 * 1024) throw new Error(`"${f.name}" pesa más de 15 MB.`);
  const ext = lista.type === "image/webp" ? "webp" : (lista.name.split(".").pop()?.toLowerCase() ?? "jpg");
  const blob = await upload(`${carpeta}.${ext}`, lista, {
    access: "public",
    handleUploadUrl: "/api/panel/upload",
    onUploadProgress: (p) => onProgreso?.(Math.round(p.percentage)),
  });
  return blob.url;
}
