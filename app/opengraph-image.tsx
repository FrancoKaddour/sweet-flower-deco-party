import { ImageResponse } from "next/og";
import { OG, OG_SIZE, ogFonts, publicAsDataUrl } from "@/lib/og";

/**
 * Imagen para compartir del sitio (1200×630): la que aparece al pegar el link
 * en WhatsApp, Instagram, LinkedIn, Facebook o X. Logo real (casita + globos)
 * y el nombre en Cormorant, como en el sitio. Las páginas con imagen propia
 * (p. ej. /event-summit) la pisan con su propio opengraph-image.
 */
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Sweet Flowers Deco Party — Decoración de eventos";

export default async function Image() {
  const [logo, fonts] = await Promise.all([
    publicAsDataUrl("brand/logo-mark-full.png", "image/png"),
    ogFonts(500),
  ]);
  const { serif, sans } = fonts;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: OG.bone,
          padding: "0 90px",
          gap: 80,
        }}
      >
        {/* Logo real */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={380} height={374} alt="" style={{ objectFit: "contain" }} />

        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: OG.champagne,
              fontFamily: sans,
            }}
          >
            Decoración de eventos
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 112,
              lineHeight: 0.95,
              color: OG.ink,
              fontFamily: serif,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Sweet Flowers
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 8,
              fontSize: 40,
              color: OG.ink,
              fontFamily: serif,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            Deco Party
          </div>
          <div style={{ display: "flex", width: 90, height: 4, backgroundColor: OG.red, marginTop: 34 }} />
          <div
            style={{
              display: "flex",
              marginTop: 30,
              fontSize: 28,
              lineHeight: 1.35,
              color: "#4a4440",
              fontFamily: sans,
            }}
          >
            Estructuras de hierro · Catering · Fundas y telas. Envíos a todo el país.
          </div>
        </div>
      </div>
    ),
    { ...size, ...fonts.options },
  );
}
