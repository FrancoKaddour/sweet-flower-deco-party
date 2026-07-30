# 20 — ANÁLISIS DE REFERENCIAS DE MOTION (investigación real)

> Investigación hecha con browser real + lectura de bundles sobre las 7 referencias
> que definió Franco. Timings/easings citados son **literales del código** de cada
> sitio (donde el minificado lo permitió). Screenshots en
> `%TEMP%\sfdp-refs\<dominio>\`. Fecha: 2026-07-30.
>
> **Regla de la casa (feedback de Franco):** patrones de tutorial (stacked cards,
> text-fill scrub, count-up, marquees genéricos) = rechazados. La vara es
> coreografía original con UNA idea formal fuerte.

---

## 1. El ADN común de los 7 (por qué se sienten "de otro mundo")

1. **UNA idea formal fuerte por sitio, ejecutada con disciplina.**
   unanime = la cápsula (pill) en todo; chkstepan = letras "dañadas" + hairlines;
   o-scs = mission control (mono + escáner); NIB = tipografía que sangra y se
   deforma; momoamo = color-blocking; instrument = revista indexada; basic = velocidad.
   *No son 10 efectos: es 1 concepto repetido hasta ser marca.*
2. **La tipografía es material, no texto.** Escalas display:body de 5:1 a 18:1
   (instrument: 240px vs 13px). Titulares que sangran fuera del canvas (NIB),
   letras que se deforman con MorphSVG (NIB footer), wordmarks como bookend
   (unanime abre y cierra con lo mismo).
3. **Cambios de ESCENA, no de sección.** El fondo del body entero muta al
   scrollear (instrument: `data-theme` + CSS vars con transition 0.3s
   `cubic-bezier(.73,.24,.68,.82)`; momoamo: 6 mundos de color). La página es una
   película con actos.
4. **Sistema de timing con nombre** (basic): `--ease-garret: cubic-bezier(.5,0,0,1)`,
   `--ease-out-soft: cubic-bezier(.28,0,.49,1)`, `--ease-in-out-hard:
   cubic-bezier(.77,0,.175,1)`; micro ≤350ms, reveals de máscara 1s. Dos tempos:
   micro-UI rapidísima + narrativa lenta. NIB corre todo a `timeScale(1.15)`.
5. **UNA receta de reveal, repetida** (instrument): `{opacity:0, y:20} →
   {duration:1, stagger:.05, ease:"expo.out"}` con variantes chars/words/lines/grid.
   El lujo sale de la consistencia, no de la variedad.
6. **Micro-interacciones quirúrgicas:** un-zoom hover (imagen vive en scale 1.05 y
   ASIENTA a 1 al hover — basic + instrument), cursor contextual solo sobre media
   (disco "Ver galería" — basic), nav "abacus" con pill que morfa entre items
   (instrument, 300ms), swap de label en 2 líneas por chars (NIB, .5s power2.inOut
   stagger .025), flecha fly-through (basic: sale por derecha, re-entra por
   izquierda, 0.55s).
7. **Casi nadie usa WebGL para lo importante.** El "3D" de instrument es video
   pre-renderizado; o-scs usa un .mp4; chkstepan usa canvas 2D de líneas. El truco
   es dirección de arte, no shaders.

## 2. Recetas robables con timings literales

| Receta | Fuente | Código |
|---|---|---|
| Reveal maestro | instrument | `from {opacity:0,y:20} to {duration:1, stagger:.05, ease:"expo.out"}`; grillas con `ScrollTrigger.batch({interval:.2, batchMax:4})` + `clearProps` |
| Imagen firma | NIB | `clip-path: inset('100% 0 0 0'→'0')` 1.2s power3.out + `<img>` contra-mov `y:35%→0` 1.5s power3.out, trigger `50% 100%` |
| Título direccional | NIB | SplitText chars, líneas alternadas `y:±110%`, dur .65, stagger .04–.05, power3.out; párrafos lines `y:100%` .5s stagger .09 |
| Texto que enfoca | o-scs | lines: `blur(3px) saturate(2.5) → blur(0) saturate(1)` + `yPercent:100→0` + `rotationX:20→0`, stagger .1, scrub:1 |
| Escenas sticky | o-scs | todas las secciones `position:sticky; top:0`, la siguiente tapa; dim con scrub |
| Theme por scroll | instrument | sentinelas al 50vh → `data-theme` en body, `transition: background-color .3s cubic-bezier(.73,.24,.68,.82)` |
| Morph de forma | unanime | GSAP anima `aspect-ratio` nativo 1.35s power3.inOut en máscaras `border-radius:100vmax`; hairlines `scaleY 0→1` 1.8s power1.out secuencial |
| Ease "hop" | chkstepan | `CustomEase "M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1"` dur 1.5 (arranca, se frena al medio, remata) |
| Canvas líneas | chkstepan | canvas 2D, 40–60 líneas sin/cos, amplitud reactiva al mouse, lerp .08 |
| Cortina de página | NIB | panel sube `y:100vh→0` 1s power3.inOut mientras el contenido sale `y:-100vh`; logo re-entra por chars sobre el panel |
| Un-zoom hover | basic/instr | reposo `scale(1.05)` → hover `scale(1)` 250ms ease-out-soft |
| Parallax sin salto | unanime | `start:"clamp(top bottom)"` en todo parallax above-the-fold |
| Preloader real | NIB | precarga `document.images` + contador, logo chars `x:120%` .5s stagger .1; `localStorage` para saltarlo en revisitas |

## 3. Propuesta de identidad de motion para Sweet Flowers (a validar con Franco)

**Idea formal firma: EL ARCO.** Sweet Flowers fabrica arcos (arcos extensibles,
arcadas) — la forma de la marca existe de verdad. Como unanime hizo con la
cápsula: máscaras de imagen en forma de arco (`border-radius: 999px 999px 0 0`),
que morfan (aspect-ratio animado), hairlines de columna que crecen, wordmark
bookend. Nadie más puede reclamar esa forma con esa legitimidad.

**Sistema de escenas:** theme-switching del body por scroll con la paleta cálida
existente (bone → sage → blush → sand → bordeaux/botanical) — la página como
película de actos, sin pinning barato.

**Tipografía como material:** display que sangra fuera del canvas, momentos serif
itálicos editoriales, escala más brutal que la actual.

**Sistema de timing:** tokens de easing/duración con nombre + la receta única de
reveal (expo.out) para TODO el sitio; micro-UI ≤350ms; un-zoom hovers; cursor
contextual sobre galerías.

> Nada de esto entra al código sin validar el concepto con Franco primero.
