# KIT MOTION PORTABLE — llevar el sistema Sweet Flowers a otros proyectos

> Para replicar el trabajo de animación/efectos de este sitio en otro proyecto
> (primer destino: **miga-club** — Astro, EN PRODUCCIÓN en migaclub.com.ar).
> Contiene: qué copiar, qué adaptar, las recetas con timings reales, y el MÉTODO
> (que vale más que el código). Al final: prompt listo para pegar.

---

## 0. Qué es este sistema

Motion system construido sobre GSAP (ScrollTrigger + SplitText + CustomEase) +
Lenis, destilado de un análisis real de 7 sitios award-winning (bundles leídos,
timings literales): ver [`../../docs/20_MOTION_REFERENCIAS_ANALISIS.md`](../../docs/20_MOTION_REFERENCIAS_ANALISIS.md).

**Código de referencia en este repo** (leer, no copiar a ciegas):
- `lib/gsap.ts` — registro central + ease "hop" (CustomEase)
- `components/motion/SmoothScroll.tsx` — Lenis ↔ ScrollTrigger (ticker, lagSmoothing 0)
- `components/motion/FadeUp.tsx` / `RevealText.tsx` — reveals base (React)
- `components/membresia/ArcoPortal.tsx` — pin + scrub narrativo (el portal)
- `components/membresia/BeneficiosVentana.tsx` — cortinas scrubbed por capas
- `components/membresia/HeroUmbral.tsx` — coreografía de entrada en timeline
- `components/evento/EdicionesScroll.tsx` — scroll horizontal pineado
- `components/site/Header.tsx` — overlay full-screen + header adaptativo (data-theme)
- `app/globals.css` — tokens de easing, reduced-motion global, scrollbar-gutter

## 1. EL MÉTODO (esto es lo que se replica, no los efectos)

1. **UNA idea formal firma por marca.** Acá es EL ARCO (Sweet Flowers fabrica
   arcos). Para una marca de pizzas y sanguches de miga, candidatos legítimos:
   - **El TRIÁNGULO** (el corte del sanguche de miga — inconfundible y propio)
   - **La CUÑA/porción** (la pizza) o el **círculo** entero
   - El **apilado** (los pisos del sanguche: capas que se apilan/deslizan)
   La forma se usa como: máscara de TODAS las fotos, morph de entrada, marca de
   agua, bookend del footer. Disciplina: una forma, todo el sitio.
2. **Escenas, no secciones.** El fondo muta por tramo de scroll (paleta corta).
3. **Tipografía como material.** Display gigante (escala ≥5:1 sobre el body),
   que puede sangrar del canvas. Reveals por chars/words con máscara.
4. **Dos tempos.** Micro-UI ≤350ms · narrativa 1–1.5s. Nada intermedio difuso.
5. **UNA receta de reveal repetida** en todo el sitio (la consistencia es el lujo).
6. **`prefers-reduced-motion` SIEMPRE** (estado final directo, nunca ocultar
   contenido sin JS) + foco visible + `scrollbar-gutter: stable`.
7. **PROHIBIDO** (vara de calidad): stacked cards, text-fill scrub, count-up,
   marquees genéricos como pieza central, grillas de cards con hover-zoom.
   La coreografía tiene que salir de la NARRATIVA de la marca.

## 2. Tokens CSS (copiar al global del proyecto destino)

```css
:root {
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
  --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-out-soft: cubic-bezier(0.28, 0, 0.49, 1);      /* micro-UI */
  --ease-in-out-soft: cubic-bezier(0.72, 0, 0.28, 1);   /* máscaras 1s */
  --ease-in-out-hard: cubic-bezier(0.77, 0, 0.175, 1);  /* barridos */
}
html { scrollbar-gutter: stable; } /* el sitio no salta al abrir overlays */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

Ease "hop" (chkstepan — entradas narrativas):
`CustomEase.create("hop","M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1")`

## 3. Recetas con timings (números literales, funcionan)

| Receta | Números |
|---|---|
| Reveal maestro (todo el sitio) | `{opacity:0, y:20} → {duration:1, stagger:.05, ease:"expo.out"}`, trigger `top 85%`, una sola vez |
| Título por chars | SplitText chars, `y:110%` (líneas alternadas ±), dur .65, stagger .04, `power3.out`, máscara `overflow:clip` |
| Párrafos por líneas | lines `y:100%→0`, dur .5, stagger .09 |
| Imagen firma | `clip-path: inset(100% 0 0 0 → 0)` 1.2s `power3.out` + `<img>` interna `y:35%→0` 1.5s |
| Parallax | `scrub: 1.2–2.8`, `ease:"none"`, `start:"clamp(top bottom)"` (sin salto above-the-fold) |
| Pin narrativo | `pin` + `scrub:1`, `end:"+=150-180%"`; el elemento escala/viaja y al soltar la escena YA cambió |
| Cortina por capas | capas apiladas por z-index, cada una `clipPath inset(100%→0)` con `scrub:true` ligado a su trigger |
| Un-zoom hover | reposo `scale(1.05)` → hover `scale(1)`, 250ms `--ease-out-soft` |
| Overlay/menú | fade .4 + links `yPercent:110→0` stagger .06 `power3.out`; cierre más rápido (.3, `power2.in`) |
| Lenis | `lerp: 0.075–0.1` + `lenis.on('scroll', ScrollTrigger.update)` + raf en `gsap.ticker` + `lagSmoothing(0)` |

## 4. Adaptación a ASTRO (miga-club no es Next/React)

- **Instalar:** `npm i gsap lenis` (NO hace falta `@gsap/react`).
- Los componentes React de acá se traducen a **`<script>` de Astro** (vanilla):
  el patrón es idéntico — seleccionar por `data-*`, armar timeline, ScrollTrigger.
- Boilerplate global (una vez, en el Layout):

```html
<script>
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { SplitText } from "gsap/SplitText";
  import { CustomEase } from "gsap/CustomEase";
  import Lenis from "lenis";

  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduce) {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Reveal maestro: <div data-reveal> o data-reveal="chars|lines"
  if (!reduce) {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        y: 20, autoAlpha: 0, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });
  }
</script>
```

- Con View Transitions de Astro (`<ClientRouter/>`), re-inicializar en
  `astro:page-load` (no en load a secas).
- ⚠️ Reglas propias de miga-club: está EN PRODUCCIÓN (deploy `tools/deploy.ps1`)
  → trabajar en rama, verificar build antes de deployar; y respetar su regla de
  commits (sin menciones de IA).

## 5. PROMPT LISTO para pegar en el Claude de miga-club

```
Quiero llevar a este sitio el sistema de motion/animación que construimos en
Sweet Flowers. Leé primero el kit completo acá:

C:\Users\Usuario\Desktop\DESARROLLO WEB\Ecommerce\sweet-flowers-deco-party\colaboracion\franco\KIT_MOTION_PORTABLE.md

y el análisis de referencias acá:

C:\Users\Usuario\Desktop\DESARROLLO WEB\Ecommerce\sweet-flowers-deco-party\docs\20_MOTION_REFERENCIAS_ANALISIS.md

Después:
1. Estudiá este proyecto (Astro, EN PRODUCCIÓN — trabajar en rama).
2. Proponeme la IDEA FORMAL FIRMA para Miga Club (candidatos: el triángulo del
   sanguche de miga / la porción de pizza / las capas apiladas) y la paleta de
   escenas, ANTES de escribir código. La valido yo.
3. Recién después implementá: tokens CSS, Lenis+ScrollTrigger en el Layout,
   receta única de reveal con data-attributes, y UNA pieza narrativa firma
   (equivalente al "portal del arco" de Sweet Flowers, pero con NUESTRA forma).
4. Todo con prefers-reduced-motion, mobile-first, y sin patrones cliché
   (nada de stacked cards / text-fill / count-up).
5. Commits chicos, uno por actividad, y build verde antes de cada uno.
```
