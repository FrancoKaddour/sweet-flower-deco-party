import { ImageResponse } from "next/og";
import { OG, OG_SIZE, ogFonts, publicAsDataUrl } from "@/lib/og";
import { EVENT_NAME, EVENT_WHEN, EDICION_NUMERO } from "@/content/evento";

/** Imagen para compartir del Event Summit: foto del salón + título del evento. */
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${EVENT_NAME} — ${EVENT_WHEN}`;

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
            backgroundImage: "linear-gradient(to top, rgba(20,17,15,0.92) 10%, rgba(20,17,15,0.45) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            padding: "0 80px 70px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: OG.champagne,
              fontFamily: sans,
            }}
          >
            {`Nº ${String(EDICION_NUMERO).padStart(2, "0")} · ${EVENT_WHEN}`}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 20,
              fontSize: 104,
              lineHeight: 0.92,
              color: OG.bone,
              fontFamily: serif,
              textTransform: "uppercase",
            }}
          >
            <span>Sweet Flowers</span>
            <span>Event Summit</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 28,
              color: "rgba(247,243,236,0.82)",
              fontFamily: sans,
            }}
          >
            La cumbre argentina de la decoración de eventos
          </div>
        </div>
      </div>
    ),
    { ...size, ...fonts.options },
  );
}
