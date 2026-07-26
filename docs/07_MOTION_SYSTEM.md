# 07 · Sistema de Movimiento (Motion System)

> Fuente de verdad para **toda** animación e interacción de *Sweet Flowers Deco Party*.
> El **qué** y el **porqué** de la marca viven en [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md).
> Los tokens visuales (color, tipografía, espaciado) viven en [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md).
> Las decisiones de experiencia que este movimiento debe servir viven en [`08_UX_PRINCIPLES.md`](./08_UX_PRINCIPLES.md).

**Stack de motion:** GSAP + ScrollTrigger + SplitText + [Lenis](https://github.com/darkroomengineering/lenis) (smooth scroll), sobre Next.js App Router + TypeScript + Tailwind.

> **Nota de licencia (importante):** GSAP y **todos** sus plugins —incluido **SplitText**— son **100% gratuitos** desde la adquisición por Webflow. No hay licencia paga ni club "premium". Nunca uses "es de pago" como excusa para no usar SplitText, MorphSVG, etc.

**Referencia técnica principal:** [befesti.com](https://befesti.com) (Webflow + GSAP). Los valores numéricos de abajo fueron **extraídos en vivo** de ese sitio y son la fuente de verdad de nuestros números.

---

## 1. Motion Principles

El movimiento en este sitio no es decoración: es **narrativa**. Si una animación no guía la mirada, no genera expectativa o no comunica jerarquía/profundidad, **no va**.

1. **Toda animación tiene propósito.** Antes de animar, respondé: ¿qué quiero que el usuario *sienta* o *entienda*? Guiar la mirada, revelar jerarquía, crear anticipación, sugerir profundidad. Si no hay respuesta, no animes.
2. **Físico, no robótico.** El movimiento imita masa e inercia: arranca rápido y desacelera (ease-out). Nada se mueve a velocidad constante salvo que deba parecer mecánico (marquees).
3. **Nunca `linear`.** Excepción única: marquees infinitos y parallax scrubbeado (donde el "reloj" es el scroll, no el tiempo). Todo lo demás usa curvas expo/quart.
4. **Reveals con máscara, no `fade` simple.** El texto y las imágenes entran desde detrás de un borde recortado (`overflow: clip` + `translateY`), no apareciendo de opacidad 0. El fade plano es la marca de agua de un sitio genérico; acá **el ocultamiento lo da la máscara**, no la opacidad.
5. **Restraint editorial.** Premium = pocas cosas, muy bien hechas y bien cronometradas. Un gran reveal vale más que veinte micro-animaciones compitiendo. El silencio (secciones sin motion) es parte del ritmo — ver [`08_UX_PRINCIPLES.md`](./08_UX_PRINCIPLES.md).
6. **Respeta al usuario.** `prefers-reduced-motion: reduce` es **obligatorio** (sección 10). Y el motion nunca bloquea la lectura ni retrasa el contenido crítico.

---

## 2. Tokens canónicos

### 2.1. Easing

**CSS** (transiciones de hover, micro-interacciones, cualquier cosa fuera de GSAP):

```css
:root {
  /* Reveals, entradas: sensación de "aterrizaje" suave y decidido */
  --ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);
  /* Cards, imágenes, hovers ricos */
  --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
  /* Transiciones de estado A→B (overlays, toggles) */
  --ease-in-out:    cubic-bezier(0.65, 0, 0.35, 1);
}
```

**GSAP** (equivalencias de intención):

| Uso | Ease GSAP | Notas |
|-----|-----------|-------|
| Reveals de texto/bloques (entrada) | `power3.out` | Equivale a la sensación de `--ease-out-expo`. |
| Transiciones de estado (overlay, menú) | `power2.inOut` | Equivale a `--ease-in-out`. |
| Parallax scrubbeado y marquees | `"none"` | El scroll o el loop son el "reloj". **Único caso lineal.** |

### 2.2. Duraciones

```css
:root {
  --dur-fast: 0.2s;  /* hover de links, subrayados, micro-feedback */
  --dur-med:  0.4s;  /* cards, imágenes, hovers ricos (slider: 0.425s) */
  --dur-slow: 0.8s;  /* reveals de texto y bloques al entrar en viewport */
}
```

| Token | Valor | Cuándo |
|-------|-------|--------|
| `--dur-fast` | `0.2s` | Hover de links, cambios de color, subrayados. |
| `--dur-med` | `0.4s` | Cards, hover de imágenes, transformaciones de UI. Slider: **`0.425s`**. |
| `--dur-slow` | `0.8s` | Reveals de títulos y bloques al entrar en scroll. |
| Marquee | `20–30s` lineal | Cinta infinita, `ease: "none"`. |

### 2.3. ScrollTrigger (valores reales de befesti)

```ts
// Config compartida para reveals ligados a scroll
const REVEAL_ST = {
  start: "clamp(top bottom)",     // el elemento empieza a considerarse al tocar el borde inferior del viewport
  end: "clamp(bottom top)",       // termina al salir por arriba
  toggleActions: "play none play none", // play al entrar, replay al re-entrar; NO scrub
  scrub: false,                   // reveals de TEXTO no son scrubbeados
};

// Parallax de imágenes: SÍ scrubbeado
const PARALLAX_SCRUB = 2.8;       // lag suave: la imagen "sigue" al scroll con inercia
```

> `clamp()` en `start`/`end` evita que triggers cerca del top/bottom del documento se disparen fuera de rango. Es lo que usa befesti y lo adoptamos como default.

---

## 3. Receta (a) — Mask reveal de títulos, palabra por palabra

El reveal insignia del sitio. Cada palabra sube desde detrás de una máscara recortada. **La opacidad se mantiene en 1**; el ocultamiento lo da `mask: "words"` (SplitText genera un wrapper con `overflow: clip`).

```tsx
// components/motion/TextReveal.tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export function TextReveal({
  children,
  as: Tag = "h2",
  className,
}: {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Respetar reduced-motion: sin animación, estado final directo.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const split = new SplitText(ref.current, {
        type: "words",
        mask: "words", // genera wrapper con overflow: clip por palabra
        wordsClass: "reveal-word",
      });

      gsap.from(split.words, {
        yPercent: 100,          // parte 100% por debajo de su máscara
        duration: 0.8,          // --dur-slow
        ease: "power3.out",
        stagger: 0.07,          // cascada palabra por palabra
        // opacity NO se toca: el mask hace el ocultamiento, no el fade
        scrollTrigger: {
          trigger: ref.current,
          start: "clamp(top bottom)",
          toggleActions: "play none play none",
        },
      });

      // Cleanup: revertir el split para no dejar DOM sucio en re-render/HMR
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
```

**Por qué así:**
- `mask: "words"` es la clave editorial: recorta cada palabra individualmente, sin `<span>` manuales ni CSS extra.
- `stagger: 0.07` da la cadencia de "escritura cinematográfica" sin sentirse lento.
- `split.revert()` en el cleanup evita que Fast Refresh de Next duplique nodos.

---

## 4. Receta (b) — Parallax scrubbeado de imágenes

La imagen se desplaza más lento que el scroll, dando profundidad. **`ease: "none"`** porque el reloj es el scroll; `scrub: 2.8` agrega inercia suave (la imagen "persigue" al scroll con lag).

```tsx
// components/motion/ParallaxImage.tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(img.current, {
        y: "20%",           // desplazamiento vertical del contenido de la imagen
        ease: "none",       // scrubbeado ⇒ lineal
        scrollTrigger: {
          trigger: wrap.current,
          start: "clamp(top bottom)",
          end: "clamp(bottom top)",
          scrub: 2.8,       // inercia suave (valor real de befesti)
        },
      });
    },
    { scope: wrap },
  );

  return (
    // El wrap RECORTA el overflow; la imagen es más alta que su marco para tener recorrido.
    <div ref={wrap} className="relative overflow-hidden">
      <Image
        ref={img}
        src={src}
        alt={alt}
        width={1600}
        height={2000}
        // 120% de alto ⇒ hay margen para desplazar sin dejar bordes vacíos
        className="h-[120%] w-full object-cover will-change-transform"
      />
    </div>
  );
}
```

> **Clave:** la imagen debe ser **más grande que su contenedor** (`h-[120%]`) para que el desplazamiento del 20% nunca deje un borde vacío. El `overflow-hidden` del wrap hace de máscara.

---

## 5. Receta (c) — Fade-up de bloques on-scroll

Para bloques que no son títulos (párrafos, tarjetas, grupos). Sube + micro-fade. Es la excepción donde sí usamos opacidad, porque son bloques compuestos, no tipografía.

```tsx
// components/motion/RevealBlock.tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function RevealBlock({
  children,
  stagger = 0.1,
  className,
}: {
  children: React.ReactNode;
  stagger?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const targets = ref.current!.querySelectorAll("[data-reveal]");

      gsap.from(targets, {
        y: reduce ? 0 : 32,     // sin desplazamiento en reduced-motion
        autoAlpha: 0,           // autoAlpha = opacity + visibility (evita flash)
        duration: reduce ? 0.2 : 0.8,
        ease: "power3.out",
        stagger: reduce ? 0 : stagger,
        scrollTrigger: {
          trigger: ref.current,
          start: "clamp(top bottom)",
          toggleActions: "play none play none",
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
// Uso: <RevealBlock><p data-reveal>...</p><p data-reveal>...</p></RevealBlock>
```

**Buen default:** `y: 32px` (no más de ~40). Un desplazamiento grande se siente barato; uno pequeño se siente premium.

---

## 6. Receta (d) — Marquee infinito sin costuras

Cinta continua (ej: nombres de servicios, "eventos · formación · deco"). **Lineal a propósito** (`ease: "none"`). El truco: duplicar el contenido y animar `-50%`, de modo que al terminar la copia esté exactamente donde arrancó.

```tsx
// components/motion/Marquee.tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Marquee({
  items,
  speed = 25, // segundos por vuelta (20–30s)
}: {
  items: string[];
  speed?: number;
}) {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Al mover -50% y tener el contenido DUPLICADO, el loop es invisible.
      gsap.to(track.current, {
        xPercent: -50,
        ease: "none",
        duration: speed,
        repeat: -1,
      });
    },
    { scope: track },
  );

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div ref={track} className="inline-flex gap-12 will-change-transform">
        {/* Se renderiza dos veces: [A][A]. La animación a -50% deja [A] visible siempre. */}
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-2xl tracking-tight">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
```

> **No** uses `left`/`margin` para el marquee: causa layout thrash. Solo `xPercent` (transform). El duplicado + `-50%` es lo que elimina la "costura" del salto.

---

## 7. Receta (e) — Menú overlay full-screen (timeline)

Overlay que cubre la pantalla con una máscara, revela links en cascada y se cierra en reversa. Una sola `timeline` guardada permite `play()`/`reverse()` según el estado.

```tsx
// components/nav/MenuOverlay.tsx
"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const LINKS = ["Eventos", "Formación", "Deco", "Nosotras", "Contacto"];

export function MenuOverlay() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      tl.current = gsap
        .timeline({ paused: true })
        // 1) La lámina cubre la pantalla desde abajo
        .to(".overlay-panel", {
          yPercent: 0,
          duration: reduce ? 0.2 : 0.6,
          ease: "power2.inOut", // --ease-in-out para transición de estado
        })
        // 2) Links entran en cascada (con máscara por línea)
        .from(
          ".overlay-link",
          {
            yPercent: reduce ? 0 : 120,
            autoAlpha: reduce ? 0 : 1,
            duration: reduce ? 0.2 : 0.6,
            ease: "power3.out",
            stagger: 0.06,
          },
          reduce ? "<" : "-=0.2", // solapa levemente con el panel
        );
    },
    { scope: root },
  );

  const toggle = () => {
    setOpen((v) => !v);
    open ? tl.current?.reverse() : tl.current?.play();
  };

  return (
    <div ref={root}>
      <button onClick={toggle} aria-expanded={open} aria-controls="menu-overlay">
        {open ? "Cerrar" : "Menú"}
      </button>

      <div
        id="menu-overlay"
        className="overlay-panel fixed inset-0 translate-y-full bg-[--color-cream]"
        aria-hidden={!open}
      >
        <nav>
          {LINKS.map((l) => (
            <div key={l} className="overflow-hidden">
              <a href="#" className="overlay-link block text-6xl">
                {l}
              </a>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
```

**Detalles que importan:**
- Guardar la timeline en un `ref` (`paused: true`) y usar `play()`/`reverse()` evita recrear la animación en cada click.
- El wrapper `overflow-hidden` por cada link es lo que convierte el `yPercent: 120` en un **mask reveal** por línea.
- `aria-expanded` en el botón y `aria-hidden` en el panel son obligatorios (ver [`08_UX_PRINCIPLES.md`](./08_UX_PRINCIPLES.md) → accesibilidad).

---

## 8. Receta (f) — Lenis + ScrollTrigger + cleanup en React/Next

Lenis da el smooth scroll (lerp ~0.1). **Clave:** hay que sincronizar Lenis con ScrollTrigger vía un único `requestAnimationFrame` para que ambos usen el mismo reloj, y limpiar todo al desmontar.

```tsx
// components/motion/SmoothScrollProvider.tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // sin smooth scroll para reduced-motion (scroll nativo)

    const lenis = new Lenis({ lerp: 0.1 }); // suavidad ~befesti

    // 1) Lenis avisa a ScrollTrigger cada vez que hay scroll
    lenis.on("scroll", ScrollTrigger.update);

    // 2) UN solo RAF maneja Lenis, usando el ticker de GSAP como reloj único
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0); // evita saltos tras throttling de pestaña

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
```

**Por qué `gsap.ticker` en vez de un `requestAnimationFrame` propio:** un solo reloj = cero desincronización entre el suavizado de Lenis y los cálculos de ScrollTrigger. Es el patrón oficial recomendado.

**`useGSAP` vs `gsap.context`:** `useGSAP` (de `@gsap/react`) **es** `gsap.context` + cleanup automático envueltos para React. Con `{ scope: ref }` todas las animaciones creadas dentro se revierten solas al desmontar. Preferilo siempre sobre un `useLayoutEffect` manual. Si por alguna razón no usás el hook, el equivalente crudo es:

```tsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    /* animaciones */
  }, ref);
  return () => ctx.revert(); // cleanup: revierte todo
}, []);
```

---

## 9. Receta (g) — Integración con Next.js App Router

Reglas de oro para no romper SSR ni duplicar plugins:

1. **Todo lo que usa GSAP/Lenis es Client Component** (`"use client"`). GSAP toca `window`/DOM; no puede correr en el server.
2. **Registrá plugins una sola vez.** Hacelo en un módulo compartido que se importe donde haga falta. Registrar el mismo plugin múltiples veces es inofensivo pero desprolijo; centralizarlo es más limpio.
3. **`SmoothScrollProvider` envuelve el árbol** en el layout, pero el layout en sí sigue siendo Server Component: solo el provider es cliente.
4. **`ScrollTrigger.refresh()` tras cargar contenido async** (imágenes que cambian el alto del documento). Con `next/image` y `sizes` correctos suele bastar, pero si el layout salta, refrescá.

```ts
// lib/gsap.ts — registro centralizado (import "@/lib/gsap" donde se necesite)
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };
```

```tsx
// app/layout.tsx (Server Component)
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
```

---

## 9b. Receta (h) — Collage inclinado con tilt 3D (sección Workshops)

> Efecto tipo befesti "NOT JUST IN THE FEED": un collage de fotos **inclinado** que
> entra tilteado en 3D y se **endereza** al scrollear, con parallax continuo de columnas.
> Implementado en [`components/sections/Workshops.tsx`](../components/sections/Workshops.tsx)
> + clases `.wk-*` en [`app/globals.css`](../app/globals.css).

**Anatomía**

```
<section> (bg tinta, min-h 256vh → doble recorrido)
 ├─ .wk-collage  (absolute inset-0, overflow hidden, perspective: 3000px, flex justify-end)
 │   ├─ .wk-grid (width 205vw, preserve-3d, transform-origin 50% 50%)  ← GSAP le controla el tilt
 │   │   └─ .wk-col × 5  (flex-col; imgs aspect 2/3, radius 8px)        ← GSAP les controla el parallax
 │   └─ .wk-fade (gradientes que funden los bordes a tinta + scrim del texto)
 └─ contenedor de texto (z-3): título con mask-reveal + CTA, abajo-derecha
```

**Valores canónicos (afinados — no cambiar sin re-verificar cobertura)**

| Parámetro | Valor | Por qué |
|---|---|---|
| `perspective` (en `.wk-collage`) | `3000px` | 3D con **poca** deformación → mejor cobertura. |
| `transform-origin` (grid) | `50% 50%` | pivote **central** → la escala cubre parejo en todas las direcciones. |
| Tilt `from` | `rotationX: 12, rotationY: 0, rotation: -14, scale: 1.7` | **`rotationY: 0` es clave**: cualquier rotación en Y destapa los costados. |
| Tilt `to` | `rotationX: 0, rotationY: 0, rotation: -10, scale: 1.35` | reposo levemente rotado en Z (como befesti). |
| Tilt `ease` | `"none"` | progresa lineal con el scroll → **acompaña todo el recorrido** (no muere temprano). |
| Parallax columnas | `fromTo` `yPercent: ±30 → ∓30`, `ease: "none"` | movimiento continuo; pares/impares en sentidos opuestos. |
| `scrub` (ambos) | `2.8` | inercia perezosa (valor real de befesti). |
| Grid `width` | `min(2200px, 205vw)` | mucho más ancho que el viewport → cubre aun inclinado. |
| Sección alto | `256vh` | doble recorrido de scroll. |

```ts
const trigger = { trigger: el, start: "clamp(top bottom)", end: "clamp(bottom top)", scrub: 2.8 } as const;

// 1) Tilt 3D — ease "none" para acompañar TODO el scroll
gsap.fromTo(gridEl,
  { rotationX: 12, rotationY: 0, rotation: -14, scale: 1.7 },
  { rotationX: 0, rotationY: 0, rotation: -10, scale: 1.35,
    transformOrigin: "50% 50%", ease: "none", force3D: true, scrollTrigger: trigger });

// 2) Parallax continuo por columna (sentidos opuestos)
cols.forEach((col, i) => {
  const dir = i % 2 === 0 ? 1 : -1;
  gsap.fromTo(col.querySelectorAll("img"),
    { yPercent: 30 * dir },
    { yPercent: -30 * dir, ease: "none", scrollTrigger: trigger });
});
```

**Cobertura (el problema difícil):** un plano inclinado en 3D **no cubre** un rectángulo en los bordes.
Reglas que resuelven el "espacio negro":
1. **`rotationY: 0`** — la rotación en Y es la que más destapa los costados. Evitarla; el drama 3D se logra con `rotationX` (inclinación) + rotación en Z + `scale` (zoom).
2. **Escala alta al entrar** (`from.scale` > `to.scale`) — cuando más inclinado, más grande → sigue cubriendo.
3. **Grid muy ancho** (205vw) + pivote central.
4. Lo poco que quede se **funde a tinta** con `.wk-fade` (bordes) — como hace befesti de verdad: el fondo oscuro esconde el descubierto.

**Truco de verificación (test de magenta):** para ver si un hueco es *fondo sin cubrir* o *imagen oscura*, pintá el fondo de la sección de magenta y ocultá el fade:
```js
document.querySelector('#workshops').style.background = 'magenta';
document.querySelector('.wk-fade').style.display = 'none';
```
Si el hueco se vuelve magenta → es cobertura (subí `scale`/ancho, bajá `rotationY`). Si sigue oscuro → es una imagen oscura (se resuelve con fotos reales).

**Legibilidad del texto:** título blanco (`text-bone`) con `text-shadow` + un scrim muy suave del lado derecho en `.wk-fade`. No hace falta una banda negra.

> Nota: las imágenes actuales son placeholders (picsum). Con **fotos reales de los workshops**
> el resultado mejora mucho y desaparece cualquier "parche oscuro" aleatorio.

---

## 10. `prefers-reduced-motion` (OBLIGATORIO)

**No es opcional.** Un porcentaje real de usuarios activa esto por vestíbulo/mareo. Ignorarlo es un fallo de accesibilidad, no un detalle estético. Ver [`08_UX_PRINCIPLES.md`](./08_UX_PRINCIPLES.md) → checklist de accesibilidad.

**Qué se apaga y qué se conserva:**

| Efecto | reduced-motion: reduce |
|--------|------------------------|
| Parallax de imágenes | **OFF** — imagen en su estado final, sin desplazamiento. |
| Smooth scroll (Lenis) | **OFF** — scroll nativo del navegador. |
| Reveals con desplazamiento (`y`, `yPercent`) | **OFF** el desplazamiento; contenido visible directo o micro-fade (`0.2s`). |
| Marquees | **OFF** — cinta estática. |
| Hover/foco (color, subrayado) | **ON** — feedback esencial, se conserva. |

**Patrón recomendado — `gsap.matchMedia()`** (declara ambas ramas de forma limpia):

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();

  // Movimiento completo
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(".hero-word", {
      yPercent: 100, duration: 0.8, ease: "power3.out", stagger: 0.07,
    });
  });

  // Reducido: solo estado final / micro-fade, sin desplazamiento
  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.from(".hero-word", { autoAlpha: 0, duration: 0.2 });
  });

  return () => mm.revert();
});
```

**Refuerzo en CSS** (red de seguridad para transiciones fuera de GSAP):

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 11. Guía de performance

El motion premium es también motion **fluido**. 60fps o no vale la pena. Reglas:

1. **Animá solo `transform` y `opacity`.** Son las únicas propiedades que el compositor maneja en GPU sin recalcular layout ni paint. **Nunca** animes `top`, `left`, `width`, `height`, `margin`, `padding` → causan *layout thrash* (reflow por frame).

   | Propiedad | Coste | Usar para |
   |-----------|-------|-----------|
   | `transform` (translate/scale/rotate) | Barato (compositor) | Todo movimiento y escala. |
   | `opacity` | Barato (compositor) | Fades. |
   | `top/left/width/height` | Caro (layout) | **Evitar.** |
   | `box-shadow`, `filter` | Caro (paint) | Con moderación; preferir capas. |

2. **`will-change: transform`** en elementos que se van a animar seguido (parallax, marquee). Pero con criterio: aplicarlo a *todo* consume memoria y es contraproducente. Solo donde hay movimiento continuo.
3. **`autoAlpha` en vez de `opacity`** cuando el elemento debe estar realmente oculto (setea `visibility: hidden` en 0), evitando que capture eventos e impidiendo el "flash" inicial.
4. **Evitá disparar `ScrollTrigger.refresh()` en cada scroll.** Refrescá solo tras cambios reales de layout.
5. **Lazy de secciones pesadas.** Componentes de motion abajo del fold pueden montarse cuando se acercan al viewport.
6. **Batch de reveals.** Para muchos elementos iguales, `ScrollTrigger.batch()` agrupa entradas en un solo callback en vez de crear N triggers.
7. **Medí con DevTools → Performance/Rendering.** Activá "Paint flashing" y "Layout Shift regions": si al animar se pintan zonas grandes o hay CLS, algo se está animando por layout.

> **Regla mnemotécnica:** si podés lograr el efecto moviendo/escalando/opacando, hacelo. Si te ves tentado a animar `width` o `top`, parás y buscás la versión con `transform`.

---

## 12. Checklist de motion (antes de cerrar una sección)

- [ ] ¿Cada animación tiene un propósito narrativo claro?
- [ ] ¿Usa los tokens (`power3.out`, `--dur-slow`, etc.), sin `linear` salvo marquee/scrub?
- [ ] ¿Los títulos usan **mask reveal** palabra por palabra, no fade?
- [ ] ¿Las imágenes destacadas tienen parallax scrubbeado (`scrub: 2.8`)?
- [ ] ¿Solo se animan `transform`/`opacity`?
- [ ] ¿`prefers-reduced-motion: reduce` apaga parallax, smooth scroll y desplazamientos?
- [ ] ¿Hay cleanup (`useGSAP` scope / `ctx.revert()` / `split.revert()`)?
- [ ] ¿Corre a 60fps sin layout shift (verificado en DevTools)?

---

**Relacionado:** [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md) · [`08_UX_PRINCIPLES.md`](./08_UX_PRINCIPLES.md) · [`12_COMPONENT_GUIDELINES.md`](./12_COMPONENT_GUIDELINES.md) · [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md)
