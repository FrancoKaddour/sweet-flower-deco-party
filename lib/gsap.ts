// Registro central de GSAP + plugins (todos gratuitos desde GSAP 3.13).
// Importar desde componentes client. Ver docs/07_MOTION_SYSTEM.md.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Registrar una sola vez (idempotente).
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };
