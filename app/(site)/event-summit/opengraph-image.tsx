import { ImageResponse } from "next/og";
import { OG, OG_SIZE, ogFonts, publicAsDataUrl } from "@/lib/og";
import { EVENT_NAME, EVENT_WHEN, EDICION_LABEL } from "@/content/evento";

/** Imagen para compartir del Event Summit: foto del salón + título del evento. */
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${EVENT_NAME} — ${EDICION_LABEL}, ${EVENT_WHEN}`;

export default async function Image() {
  const [bg, fonts] = await Promise.all([
    publicAsDataUrl("img/summit-hero.jpg", "image/jpeg"),
    ogFonts(600),
  ]);
  const { serif, sans } = fonts;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundColor: OG.ink }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
            backgroundImage: "linear-gradient(to top, rgba(20,17,15,0.85) 0%, rgba(20,17,15,0.6) 100%)",
          }}
        />
        {/* Texto dentro del CUADRADO central (560px de ancho): WhatsApp recorta
            630×630 del medio en la vista chica y así no se corta nada. */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: OG.champagne,
              fontFamily: sans,
            }}
          >
            {`${EDICION_LABEL} · ${EVENT_WHEN}`}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 54,
              letterSpacing: "0.08em",
              color: OG.bone,
              fontFamily: serif,
              textTransform: "uppercase",
            }}
          >
            Sweet Flowers
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 6,
              fontSize: 128,
              lineHeight: 0.9,
              color: OG.bone,
              fontFamily: serif,
              textTransform: "uppercase",
            }}
          >
            <span>Event</span>
            <span>Summit</span>
          </div>
          <div style={{ display: "flex", width: 70, height: 3, backgroundColor: OG.champagne, marginTop: 30 }} />
        </div>
      </div>
    ),
    { ...size, ...fonts.options },
  );
}
