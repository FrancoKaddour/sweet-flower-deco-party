import { ImageResponse } from "next/og";
import { OG, OG_SIZE, publicAsDataUrl } from "@/lib/og";

/**
 * Imagen para compartir del sitio (1200×630): solo el logo (casita + globos),
 * centrado sobre marfil. WhatsApp recorta la imagen en un CUADRADO central
 * (630×630) en la vista chica: el logo mide 470px de alto y vive entero dentro
 * de ese cuadrado, con aire, así no se corta en ninguna red.
 * Las páginas con imagen propia (p. ej. /event-summit) la pisan.
 */
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Sweet Flowers Deco Party — Decoración de eventos";

export default async function Image() {
  const logo = await publicAsDataUrl("brand/logo-mark-full.png", "image/png");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: OG.bone,
        }}
      >
        {/* Logo real: 2135×2099 → 478×470 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={478} height={470} alt="" />
      </div>
    ),
    size,
  );
}
