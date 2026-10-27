import { Cormorant_Garamond } from "next/font/google";

/**
 * Itálica REAL de Cormorant para la tercera voz tipográfica (citas y bajadas,
 * utilidad .t-voz-cita). El layout carga solo la redonda; sin esto el navegador
 * inclinaba la redonda (itálica falsa). Se aplica con `italica.className` en el
 * elemento: solo baja el archivo la página que la usa.
 */
export const italica = Cormorant_Garamond({
  subsets: ["latin"],
  style: "italic",
  weight: ["300", "400"],
  display: "swap",
  preload: false,
});
