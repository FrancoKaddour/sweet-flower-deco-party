// Utilidades para las imágenes de compartir (Open Graph) generadas con next/og.
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

export const OG = {
  bone: "#F7F3EC",
  ink: "#14110F",
  champagne: "#C6A15B",
  red: "#ED1C24",
};

/** Archivo de /public como data URL (para <img> dentro de ImageResponse). */
export async function publicAsDataUrl(file: string, mime: string): Promise<string> {
  const buf = await readFile(join(process.cwd(), "public", file));
  return `data:${mime};base64,${buf.toString("base64")}`;
}

type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 500 | 600; style: "normal" };

/** Baja un peso de una Google Font en TTF (sin user-agent, Google entrega TTF). */
async function googleFont(family: string, name: string, weight: 400 | 500 | 600): Promise<OgFont[]> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`,
      { cache: "force-cache" },
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return [];
    const data = await fetch(url, { cache: "force-cache" }).then((r) => r.arrayBuffer());
    return [{ name, data, weight, style: "normal" }];
  } catch {
    return [];
  }
}

/**
 * Tipografías de marca para las imágenes: Cormorant (serif del logotipo) y
 * Hanken Grotesk (textos). Se bajan en el build (Vercel tiene red). Si fallan,
 * devuelve {} y next/og usa su fuente por defecto — nunca rompe el build.
 */
export async function ogFonts(serifWeight: 500 | 600) {
  const fonts = (
    await Promise.all([
      googleFont("Cormorant Garamond", "Cormorant", serifWeight),
      googleFont("Hanken Grotesk", "Hanken", 400),
    ])
  ).flat();
  return {
    options: fonts.length ? { fonts } : {},
    serif: fonts.some((f) => f.name === "Cormorant") ? "Cormorant" : "serif",
    sans: fonts.some((f) => f.name === "Hanken") ? "Hanken" : "sans-serif",
  };
}
