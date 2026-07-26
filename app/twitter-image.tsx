/**
 * Imagen para Twitter/X Cards. Reutilizamos exactamente la misma imagen que
 * Open Graph (mismo tamaño y arte) re-exportando desde ./opengraph-image.
 *
 * El único campo propio es `alt`, que definimos aparte para poder ajustar el
 * texto alternativo específico de la tarjeta sin duplicar el render.
 */
export { default, size, contentType } from "./opengraph-image";

export const alt = "Sweet Flowers Deco Party — Decoración de eventos";
