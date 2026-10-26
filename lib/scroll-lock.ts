/**
 * Bloqueo de scroll de la página para overlays (menú, carrito, lightbox).
 *
 * Por qué no alcanza con `overflow: hidden` en <body>: en iOS Safari (sobre
 * todo iOS 15) el gesto táctil sigue scrolleando la página de atrás. Acá:
 *  - overflow hidden + overscroll-behavior none en <html> y <body> (iOS 16+,
 *    Android y desktop lo respetan);
 *  - un touchmove NO pasivo que cancela el arrastre salvo que ocurra dentro de
 *    un contenedor que realmente scrollea (lista del carrito, nav del menú) o
 *    que sea un gesto de 2 dedos (pinch-zoom en el lightbox).
 * No usamos `position: fixed` en el body: con GSAP pins + Lenis movería el
 * layout y los ScrollTrigger recalcularían. La posición de scroll no se toca,
 * así que al cerrar queda exactamente donde estaba.
 *
 * Con contador: si se abren dos overlays a la vez, el scroll vuelve recién
 * cuando se cierran los dos.
 */

let locks = 0;
let prev: { html: string; body: string; htmlOB: string; bodyOB: string } | null = null;

function puedeScrollear(target: EventTarget | null, dy: number): boolean {
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body && el !== document.documentElement) {
    if (el instanceof HTMLElement) {
      const oy = getComputedStyle(el).overflowY;
      if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1) {
        // En el borde y empujando hacia afuera → no hay nada que scrollear acá;
        // seguimos buscando en los ancestros (si no hay, se cancela).
        const arriba = el.scrollTop <= 0 && dy > 0;
        const abajo = el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && dy < 0;
        if (!arriba && !abajo) return true;
      }
    }
    el = el.parentElement;
  }
  return false;
}

let startY = 0;
const onTouchStart = (e: TouchEvent) => {
  startY = e.touches[0]?.clientY ?? 0;
};
const onTouchMove = (e: TouchEvent) => {
  if (e.touches.length > 1) return; // pinch-zoom: permitido
  const dy = (e.touches[0]?.clientY ?? 0) - startY;
  if (!puedeScrollear(e.target, dy) && e.cancelable) e.preventDefault();
};

/** Bloquea el scroll de la página. Devuelve la función que lo libera (idempotente). */
export function lockScroll(): () => void {
  if (typeof document === "undefined") return () => {};
  if (locks === 0) {
    const html = document.documentElement;
    const body = document.body;
    prev = {
      html: html.style.overflow,
      body: body.style.overflow,
      htmlOB: html.style.overscrollBehavior,
      bodyOB: body.style.overscrollBehavior,
    };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
  }
  locks++;
  let liberado = false;
  return () => {
    if (liberado) return;
    liberado = true;
    locks = Math.max(0, locks - 1);
    if (locks > 0) return;
    const html = document.documentElement;
    const body = document.body;
    html.style.overflow = prev?.html ?? "";
    body.style.overflow = prev?.body ?? "";
    html.style.overscrollBehavior = prev?.htmlOB ?? "";
    body.style.overscrollBehavior = prev?.bodyOB ?? "";
    prev = null;
    document.removeEventListener("touchstart", onTouchStart);
    document.removeEventListener("touchmove", onTouchMove);
  };
}
