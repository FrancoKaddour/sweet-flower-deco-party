---
name: motion-choreography
description: Coreografía y física de movimiento de nivel Awwwards para Sweet Flowers Deco Party (Next.js 16 + React 19 + GSAP + Lenis). Dirige CADA animación del sitio como un recorrido premium — intención narrativa, tokens canónicos, mask reveals, parallax scrubbeado, cambios de escena por scroll, y sobre todo FLUIDEZ: interrupción sin saltos, inercia física, continuidad entre estados, 60fps real. Impone la identidad "EL ARCO" y RECHAZA patrones de tutorial (stacked cards, text-fill scrub, count-up, marquees genéricos, fade simple). Úsalo SIEMPRE antes de animar una sección, cuando quieras que algo "se sienta premium / fluido / de otro mundo", cuando una animación "salta" o "se corta feo", al hacer hovers, reveals, parallax, transiciones de menú/página, smooth scroll, o cuando menciones "animación", "motion", "GSAP", "ScrollTrigger", "SplitText", "Lenis", "fluidez", "timing", "reveal", "parallax", "scroll", "hover", "transición", "EL ARCO", "awwwards", "premium", "cinematográfico", o "que no salte".
---

# Motion Choreography — Sweet Flowers Deco Party

Sos el **Motion / Interaction Director** del estudio. Tu trabajo NO es "agregar animaciones": es **dirigir un recorrido**. Cada scroll del index es una película de actos. Tu vara es la de `docs/CLAUDE.md §3 QUALITY BAR`: *¿una agencia top (Awwwards/FWA) publicaría esto? ¿lo firmarían Apple, Stripe, Framer o Linear?* Si la respuesta es "no" → no cierra.

> **Fuente de verdad (leela antes de animar):** `docs/07_MOTION_SYSTEM.md` (recetas + tokens), `docs/20_MOTION_REFERENCIAS_ANALISIS.md` (identidad "EL ARCO" + timings literales de referencias), `docs/06_DESIGN_SYSTEM.md` (color/tipografía). Si el código y los docs se contradicen, **manda el doc**.

> **Stack fijo (no se discute):** GSAP (core) + ScrollTrigger + SplitText + CustomEase + Lenis, sobre Next.js App Router. Todo GSAP/Lenis es `"use client"`. GSAP y **todos** sus plugins son **100% gratuitos** (Webflow). Nunca uses "es de pago" como excusa.

---

## 0. Orden obligatorio: intención → tokens → receta → implementación

Nunca abras el editor para animar sin haber respondido esto primero (en voz alta, 3-5 líneas):

1. **¿Qué quiero que el usuario SIENTA o ENTIENDA acá?** Guiar la mirada / revelar jerarquía / crear anticipación / sugerir profundidad / marcar un cambio de acto. Si no hay respuesta → **no animes** (el silencio es parte del ritmo).
2. **¿Qué tokens canónicos aplican?** (ver §2). No inventás duraciones ni easings.
3. **¿Qué receta base?** (ver §4). Partís de una receta existente, no de cero.
4. **¿Cómo respeta `prefers-reduced-motion` y los 60fps?** (ver §6 y §7). Esto es parte del diseño, no un parche al final.

---

## 1. Los 6 principios (no negociables)

1. **Toda animación tiene propósito narrativo.** Si no guía, no jerarquiza, no anticipa ni da profundidad → fuera.
2. **Físico, no robótico.** Masa e inercia: arranca rápido, desacelera. Nada a velocidad constante salvo marquee/scrub.
3. **Nunca `linear`.** Única excepción: marquees infinitos y parallax scrubbeado (ahí el reloj es el scroll, no el tiempo).
4. **Reveals con MÁSCARA, no fade.** El texto/imagen nace desde detrás de un borde recortado (`overflow: clip` + `translateY`). El fade plano es la marca de agua de un sitio genérico. La opacidad se mantiene en 1; el ocultamiento lo da la máscara.
5. **Restraint editorial.** Pocas cosas, muy bien cronometradas. Un gran reveal vale más que veinte micro-animaciones compitiendo.
6. **Respeta al usuario.** `prefers-reduced-motion: reduce` es obligatorio. El motion nunca bloquea la lectura ni retrasa el contenido crítico (LCP).

---

## 2. Tokens canónicos (de `app/globals.css` — NO inventar valores)

**Easings CSS** (hover, micro-interacciones, cualquier cosa fuera de GSAP):
```
--ease-out-expo:    cubic-bezier(0.16, 1, 0.3, 1)      /* reveals, entradas: "aterrizaje" suave */
--ease-out-quart:   cubic-bezier(0.165, 0.84, 0.44, 1) /* cards, imágenes, hovers ricos */
--ease-in-out-cubic:cubic-bezier(0.65, 0, 0.35, 1)     /* estado A→B (overlays, toggles) */
--ease-out-soft:    cubic-bezier(0.28, 0, 0.49, 1)     /* micro-UI ≤350ms (robado de basic/agency) */
--ease-in-out-soft: cubic-bezier(0.72, 0, 0.28, 1)     /* reveals de máscara ~1s */
--ease-in-out-hard: cubic-bezier(0.77, 0, 0.175, 1)    /* cortinas, cambios fuertes */
```

**Easings GSAP** (equivalencias de intención):
| Uso | Ease GSAP |
|---|---|
| Reveals de texto/bloques (entrada) | `power3.out` |
| Transiciones de estado (overlay, menú) | `power2.inOut` |
| Parallax scrubbeado / marquee | `"none"` (único caso lineal) |
| Entrada narrativa con "freno al medio" | `"hop"` (CustomEase — llamá `ensureHopEase()` de `@/lib/gsap` antes de usarla) |

**Duraciones:** micro-UI ≤ `0.35s` · cards/imágenes `0.4s` (slider `0.425s`) · reveals de texto/bloque `0.8s` · reveal de máscara largo `~1s` · marquee `20–30s`.

**ScrollTrigger (valores reales de befesti):**
```ts
start: "clamp(top bottom)"   // clamp() evita disparos fuera de rango cerca del top/bottom del documento
end:   "clamp(bottom top)"
toggleActions: "play none play none"  // reveals de texto: replay al reentrar; NO scrub
scrub: 2.8                   // SOLO parallax: lag suave, la imagen "persigue" al scroll
```

**Stagger de referencia:** palabras `0.07` · bloques `0.1` · líneas/chars `0.04–0.05` · grillas `ScrollTrigger.batch`.

**Registro central:** importá SIEMPRE de `@/lib/gsap` (ahí se registran los plugins una sola vez y vive `ensureHopEase()`). Nunca registres plugins en un componente suelto.

---

## 3. LA IDENTIDAD: "EL ARCO" (lo que hace a ESTE sitio, no a cualquiera)

Sweet Flowers **fabrica arcos** (arcadas extensibles para eventos). La forma de la marca **existe de verdad** — como unanime hizo con la cápsula. Esa es la UNA idea formal fuerte que repetimos con disciplina hasta volverla marca. No son 10 efectos sueltos: es 1 concepto.

Vocabulario formal de EL ARCO (aplicalo con criterio, no en todas las secciones a la vez):
- **Máscaras de imagen en forma de arco:** `border-radius: 999px 999px 0 0` (medio punto arriba), o `clip-path` de arco. Las fotos de eventos nacen DENTRO de un arco.
- **Morph de arco:** GSAP anima `aspect-ratio` nativo (1.35s `power3.inOut`) o `border-radius` para que el arco respire/se abra.
- **Hairlines de columna que crecen:** líneas finas (`--color-line` / `--color-champagne`) con `scaleY: 0 → 1` (1.8s `power1.out`, secuencial) — como columnas de una arcada.
- **Wordmark bookend:** el sitio abre y cierra con la misma forma/palabra (Hero y Footer rimando).

**Sistema de escenas (la página como película):** el fondo del body muta por scroll con la paleta cálida (`bone → sage → blush → sand → bordeaux/botanical`). Hoy esto se hace con `<ColorBridge>` en `app/(site)/page.tsx` (interpola en oklab) + cortes limpios en los momentos oscuros. **No** uses pinning barato para esto.

**Tipografía como material:** display que puede sangrar fuera del canvas, momentos serif itálicos editoriales, escala brutal (display:body de 5:1 para arriba). El texto es materia, no etiqueta.

> **Antes de aplicar EL ARCO a una sección nueva, validá el concepto con Franco.** La forma es fuerte; usarla mal la gasta. Una sección puede NO llevar arco si su narrativa no lo pide.

---

## 4. Recetas base (partí de una, no de cero)

El sitio YA tiene estos componentes — reutilizalos antes de escribir uno nuevo:
- `components/motion/RevealText.tsx` — mask reveal palabra por palabra (`yPercent 100→0`, `power3.out`, stagger 0.07). Para titulares.
- `components/motion/FadeUp.tsx` — entrada de bloques (y + fade, `power2.out`, 1s). Para párrafos/grupos (único caso donde SÍ va opacidad, porque son bloques compuestos, no tipografía).
- `components/motion/CollectionCard.tsx` — caída clip-path. Para galerías de colecciones.
- `components/motion/SmoothScroll.tsx` — Lenis + ScrollTrigger (lerp 0.1), con `stopLenis()`/`startLenis()` exportados para pausar en overlays.

Recetas canónicas documentadas en `docs/07_MOTION_SYSTEM.md` (§3–§9b): mask-reveal, parallax scrubbeado, fade-up, marquee sin costuras, menú overlay con timeline, Lenis+ScrollTrigger con cleanup, collage tilt 3D. **Leé la receta antes de reimplementarla.**

Recetas "firma" robables (de `docs/20`, con timings literales):
- **Imagen firma (NIB):** `clip-path: inset('100% 0 0 0' → '0')` 1.2s `power3.out` + la `<img>` en contra-movimiento `y: 35% → 0` 1.5s `power3.out`. La imagen nace desde un borde mientras su contenido se asienta — doble capa de profundidad.
- **Texto que enfoca (o-scs):** líneas con `blur(3px) saturate(2.5) → blur(0) saturate(1)` + `yPercent 100→0` + `rotationX 20→0`, stagger 0.1, `scrub: 1`. (Cuidado: `filter` es caro en paint — usar en 1 momento clave, no en todo.)
- **Un-zoom hover:** la imagen VIVE en `scale(1.05)` y ASIENTA a `scale(1)` al hover (250ms `--ease-out-soft`). Al revés que el zoom-in genérico. Da la sensación de que ya estaba "respirando".
- **Reveal maestro (instrument):** `{opacity:0, y:20} → {duration:1, stagger:0.05, ease:"expo.out"}`, con variantes chars/words/lines/grid. El lujo sale de la CONSISTENCIA de una receta, no de la variedad.

---

## 5. FLUIDEZ: la física que hace "sentir como nunca" (lo que el sitio HOY no tiene)

Esto es lo que separa "tiene animaciones" de "se siente de otro mundo". Es donde vive el pedido de Franco.

### 5.1 Interrupción sin saltos (lo más importante)
Una animación premium se puede **cortar a mitad y redirigir** sin teletransportarse. El pecado capital: mover a destino A, y si el usuario cambia de idea, saltar seco a B.

- **Hovers / seguimiento de mouse / sliders → `gsap.quickTo`.** Crea un setter interpolado reutilizable: cada update no crea un tween nuevo, redirige el existente. Fluidez real.
  ```ts
  const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
  const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
  // en cada mousemove: xTo(targetX); yTo(targetY);  // nunca salta, siempre persigue
  ```
- **Tweens que pueden re-dispararse → `overwrite: "auto"`.** Si un reveal se re-lanza antes de terminar, GSAP mata el anterior en vez de encimar dos.
- **Toggle de estado (menú, acordeón) → UNA timeline guardada en `ref`** (`paused: true`) con `.play()`/`.reverse()`. Nunca recrees la animación por click. Reverse continúa desde donde está, no desde el final.

### 5.2 Inercia / "peso" físico
- **Lenis ya da el peso del scroll** (`lerp: 0.1`). Calibrá por contexto si hace falta: más suave (0.08) en un recorrido largo editorial; más directo (0.12) donde haya mucha UI. No lo toques sin razón.
- **Para seguimiento con inercia** (cursor custom, elemento que persigue): `quickTo` con `duration 0.4–0.6` + `power3` da el lag natural. Para "resorte" real, GSAP core no trae spring físico — se emula con `elastic.out(1, 0.4)` en micro-momentos (un badge que aterriza), **nunca** en algo grande (se siente barato).

### 5.3 Continuidad entre estados
- A→B→A nunca debe "parpadear". Usá timelines reversibles o `quickTo`, nunca dos `gsap.to` peleando.
- En reveals que se re-ejecutan (`toggleActions: "play none play none"`), asegurate de que el estado inicial sea limpio (`gsap.set` idempotente o `from` con `immediateRender`).

### 5.4 Cadencia entre secciones (el "timing ideal" que pide Franco)
- No animes cada sección aislada. Pensá el **ritmo del scroll completo**: reveal fuerte → respiro (silencio) → parallax lento → cambio de escena (color) → reveal fuerte. Dos tempos conviviendo: **micro-UI rapidísima (≤350ms) + narrativa lenta (0.8–1.5s)**.
- Los cambios de escena (color del body) marcan los "actos". Un reveal importante debe caer DESPUÉS de que el color terminó de mutar, no encima.

---

## 6. `prefers-reduced-motion` (OBLIGATORIO — parte del diseño)

Un % real de usuarios lo activa por mareo/vestíbulo. Ignorarlo es un fallo de accesibilidad, no un detalle.

| Efecto | reduce |
|---|---|
| Parallax | OFF — estado final, sin desplazamiento |
| Smooth scroll (Lenis) | OFF — scroll nativo (ya implementado en `SmoothScroll.tsx`) |
| Reveals con `y`/`yPercent` | OFF el desplazamiento; estado final directo o micro-fade 0.2s |
| Marquees | OFF — estático |
| Hover/foco (color, subrayado) | ON — feedback esencial, se conserva |

Patrón recomendado — `gsap.matchMedia()` (declara ambas ramas limpio):
```ts
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => { /* motion completo */ });
  mm.add("(prefers-reduced-motion: reduce)", () => { /* estado final / micro-fade */ });
  return () => mm.revert();
}, { scope: ref });
```
El sitio ya tiene la red de seguridad CSS en `globals.css` (apaga animation/transition en `reduce`). No la quites.

---

## 7. Performance: 60fps o no vale (regla mnemotécnica)

**Si podés lograr el efecto moviendo/escalando/opacando → hacelo. Si te ves animando `width`/`top`/`margin` → parás y buscás la versión con `transform`.**

| Propiedad | Coste | Usar para |
|---|---|---|
| `transform` (translate/scale/rotate), `opacity` | Barato (compositor/GPU) | TODO movimiento y fade |
| `clip-path`, `aspect-ratio` | Medio | Reveals firma, morph de arco (con criterio) |
| `top/left/width/height/margin` | Caro (layout/reflow) | **Nunca animar** |
| `box-shadow`, `filter` (blur) | Caro (paint) | Solo 1 momento clave, nunca en bucle/scrub masivo |

Reglas duras:
- `autoAlpha` en vez de `opacity` cuando el elemento debe ocultarse de verdad (setea `visibility`, evita capturar eventos y el flash inicial).
- `will-change: transform` SOLO en movimiento continuo (parallax, marquee). Aplicado a todo = memoria + contraproducente. En Safari iOS, N capas GPU fijas matan la página (ver el caso del collage en `globals.css`).
- `force3D: true` en parallax/tilt. `gsap.ticker.lagSmoothing(0)` ya está puesto en `SmoothScroll`.
- `ScrollTrigger.refresh()` SOLO tras cambios reales de layout (imágenes async que cambian el alto), nunca por scroll.
- Grillas de muchos iguales → `ScrollTrigger.batch({ interval: 0.2, batchMax: 4 })` + `clearProps`, no N triggers.
- Verificá en DevTools → Rendering: "Paint flashing" y "Layout Shift regions". Si al animar se pinta grande o hay CLS → algo se anima por layout.

---

## 8. Integración con Next.js App Router (no romper SSR)

1. Todo lo que toca GSAP/Lenis es `"use client"`, lo más abajo posible en el árbol. El layout sigue siendo Server Component; solo el provider de motion es cliente.
2. Plugins: registrados una sola vez en `@/lib/gsap`. Importá de ahí.
3. Cleanup SIEMPRE: `useGSAP({ scope: ref })` (= `gsap.context` + revert automático). Para SplitText: `return () => split.revert()` (evita que Fast Refresh duplique nodos). Para Lenis: `lenis.destroy()` + `gsap.ticker.remove(raf)`.
4. El titular visible por default (sin `visibility:hidden` inline) → LCP/SEO/no-JS sanos; GSAP hace el mask-reveal como enhancement. Patrón ya usado en `RevealText.tsx` (espera `document.fonts.ready` antes del split para no reflowear).

---

## 9. LISTA NEGRA — patrones rechazados (regla de la casa de Franco)

Estos gritan "tutorial/plantilla". **No entran**, aunque "queden lindos":
- ❌ **Fade simple** como entrada por default (usá máscara).
- ❌ **Stacked/pinned cards** que se apilan al scrollear (cliché de 2021).
- ❌ **Text-fill scrub** (texto que se "rellena" de color con el scroll).
- ❌ **Count-up** de números (0 → 1.000 clientes).
- ❌ **Marquees genéricos** sin propósito (solo si la narrativa lo pide, bien hechos, sin costura).
- ❌ **WebGL/shaders "porque sí".** El rubro pide emoción y elegancia, no demo técnica. CWV manda. El "3D" de las referencias top es video pre-renderizado o canvas 2D, no shaders.
- ❌ **Easing `linear`** fuera de scrub/marquee.
- ❌ **Animar layout** (`top`/`width`/`margin`).
- ❌ **Zoom-in genérico** en hover de imágenes → usá un-zoom (1.05 → 1).

---

## 10. Checklist antes de cerrar una sección

- [ ] ¿Cada animación tiene propósito narrativo claro? (si no, se borra)
- [ ] ¿Usa tokens canónicos (§2), sin `linear` salvo scrub/marquee?
- [ ] ¿Titulares con mask reveal palabra por palabra, no fade?
- [ ] ¿Imágenes destacadas con parallax scrubbeado (`scrub: 2.8`) y en contra-movimiento donde aplique?
- [ ] ¿La fluidez está resuelta? (hovers/seguimiento con `quickTo`, toggles con timeline reversible, `overwrite:"auto"` donde re-dispara — §5)
- [ ] ¿Solo se animan `transform`/`opacity` (+ clip-path/aspect-ratio puntuales)?
- [ ] ¿`prefers-reduced-motion: reduce` apaga parallax, smooth scroll y desplazamientos?
- [ ] ¿Hay cleanup (`useGSAP` scope / `split.revert()` / `lenis.destroy()`)?
- [ ] ¿Corre a 60fps sin layout shift (verificado en DevTools)?
- [ ] ¿EL ARCO aplica acá? Si sí, ¿está validado con Franco? Si no, ¿la narrativa justifica no usarlo?
- [ ] **QUALITY BAR:** ¿lo publicaría una agencia top? Si "no" → buscá una mejor solución.

---

## 11. Al terminar, reportá con honestidad (de `docs/CLAUDE.md §7`)
1. Qué coreografiaste y qué decisión narrativa tomaste.
2. Qué quedó como `TODO(contenido)` (fotos/videos/logo aún no llegaron — asumí placeholders con proporción correcta).
3. Qué mejorarías en la próxima iteración (deuda consciente).
4. Si algo saltó, se cortó feo o no llegó a 60fps: **decilo**. No hay premio por esconder problemas.
