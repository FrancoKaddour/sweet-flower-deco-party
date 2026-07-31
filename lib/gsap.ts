// Registro central de GSAP + plugins (todos gratuitos desde GSAP 3.13).
// Importar desde componentes client. Ver docs/07_MOTION_SYSTEM.md y
// docs/20_MOTION_REFERENCIAS_ANALISIS.md (identidad "El Arco").
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

// Registrar una sola vez (idempotente).
gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);

// iOS Safari: la URL bar se retrae durante el scroll y dispara un "resize" que
// recalcula todos los pins a mitad del gesto (saltos). Lo ignoramos en mobile.
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Ease "hop" (robada del análisis de chkstepan.com): arranca rápido, se frena
 * al medio y remata. Para entradas narrativas (arcos del hero, cortinas).
 * Crear es idempotente; llamar desde useGSAP (cliente) antes de usar ease:"hop".
 */
export function ensureHopEase(): void {
  if (!gsap.parseEase("hop")) {
    CustomEase.create(
      "hop",
      "M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1",
    );
  }
}

export { gsap, ScrollTrigger, SplitText, CustomEase, useGSAP };
