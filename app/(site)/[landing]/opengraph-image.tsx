import { ImageResponse } from "next/og";
import { OG, OG_SIZE, ogFonts, publicAsDataUrl } from "@/lib/og";
import { landingDe } from "@/content/seo/landings";
import { EVENT_WHEN } from "@/content/evento";

/**
 * Imagen para compartir de cada landing SEO: foto real de la landing + titular.
 * (next/og no lee WebP: si la foto es .webp se usa la del Summit en JPG.)
 * Texto dentro del cuadrado central → WhatsApp no lo corta.
 */
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Sweet Flowers Deco Party";

export default async function Image({ params }: { params: Promise<{ landing: string }> }) {
  const { landing } = await params;
  const l = landingDe(landing);
  const src = l && !l.imagen.src.endsWith(".webp") ? l.imagen.src.replace(/^\//, "") : "img/summit-hero.jpg";
  const [bg, fonts] = await Promise.all([publicAsDataUrl(src, "image/jpeg"), ogFonts(600)]);
  const { serif, sans } = fonts;
  const titulo = l?.h1 ?? "Sweet Flowers Deco Party";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundColor: OG.ink }}>
        <img
          src={bg}
          width={1200}
          height={630}
          alt=""
          style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage: "linear-gradient(to top, rgba(20,17,15,0.9) 0%, rgba(20,17,15,0.55) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "0 320px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: OG.champagne,
              fontFamily: sans,
            }}
          >
            Sweet Flowers Deco Party
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: titulo.length > 34 ? 52 : 64,
              lineHeight: 1,
              color: OG.bone,
              fontFamily: serif,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
            }}
          >
            {titulo}
          </div>
          <div style={{ display: "flex", width: 70, height: 3, backgroundColor: OG.champagne, marginTop: 30 }} />
          <div style={{ display: "flex", marginTop: 22, fontSize: 20, color: OG.bone, opacity: 0.75, fontFamily: sans }}>
            {l?.grupo === "formacion" ? `Event Summit · ${EVENT_WHEN}` : "Fabricación propia · Envíos a todo el país"}
          </div>
        </div>
      </div>
    ),
    { ...size, ...fonts.options },
  );
}
