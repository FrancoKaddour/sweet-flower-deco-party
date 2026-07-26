import { ImageResponse } from "next/og";

/**
 * Imagen Open Graph de la home (1200×630), generada on-the-fly con next/og.
 *
 * Nota: ImageResponse usa un subset de CSS con flexbox. Todo div con más de un
 * hijo necesita `display: "flex"` explícito. No cargamos la fuente custom
 * (Bricolage/Hanken) por simplicidad: usamos la sans del sistema.
 *
 * TODO(contenido): sustituir por arte final con la tipografía de marca real.
 */

// Tokens de marca
const BONE = "#F7F3EC"; // fondo (bone / marfil)
const INK = "#14110F"; // tinta
const CHAMPAGNE = "#C6A15B"; // champagne (acento)

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sweet Flowers Deco Party — Decoración de eventos";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BONE,
          fontFamily: "system-ui, Arial, sans-serif",
          padding: "80px",
        }}
      >
        {/* Kicker */}
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: CHAMPAGNE,
          }}
        >
          Decoración de eventos
        </div>

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            marginTop: 32,
            marginBottom: 32,
            fontSize: 132,
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: INK,
            textAlign: "center",
          }}
        >
          Sweet Flowers
        </div>

        {/* Bajada */}
        <div
          style={{
            display: "flex",
            fontSize: 34,
            fontWeight: 400,
            color: INK,
            textAlign: "center",
            maxWidth: 820,
          }}
        >
          Creamos la escenografía de tus mejores momentos
        </div>
      </div>
    ),
    { ...size },
  );
}
