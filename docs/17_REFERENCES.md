# 17 — Referencias

> Referencias visuales y de interacción, cada una con **el porqué**: qué tomamos de ella y cómo la adaptamos al **mood cálido / editorial** del rubro flores/deco.
> Enlaza con: [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md) · [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md) · [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md) · [`08_UX_PRINCIPLES.md`](./08_UX_PRINCIPLES.md) · [`09_UI_PRINCIPLES.md`](./09_UI_PRINCIPLES.md)

> **Regla de oro de este documento:** **inspirarse, NO copiar.** Estas referencias son una biblioteca de decisiones bien tomadas por otros. Tomamos el *principio* (por qué funciona), no el *pixel* (cómo se ve). Todo se traduce al lenguaje cálido, floral y editorial de Sweet Flowers. Si una técnica de una agencia fría (tech, SaaS) se siente ajena al rubro, se **suaviza**: menos brutalismo, más calidez.

---

## 1. Referencias de producto / claridad

### Apple
- **Por qué:** maestría en storytelling por scroll. Cada sección de una página de producto es un "acto": revela una idea a la vez, con jerarquía tipográfica impecable y espacio en blanco generoso.
- **Qué tomamos:** el ritmo narrativo (una idea por scroll), la escala tipográfica dramática, el uso del vacío como lujo, y las transiciones que sienten inevitables.
- **Cómo lo adaptamos:** su frialdad minimalista se calienta con textura, fotografía de flores y color de marca. El ritmo, sí; la asepsia, no.

### Stripe
- **Por qué:** claridad quirúrgica en información compleja + gradientes y detalles de motion sutiles que dan sensación de producto "caro y confiable".
- **Qué tomamos:** la legibilidad de secciones densas (útil para la ficha de producto y la página del evento con muchos datos), y los micro-detalles de motion que premian sin distraer.
- **Cómo lo adaptamos:** el orden y la confianza, aplicados a precios, cupos y beneficios de membresía. La estética tech se reemplaza por la editorial cálida.

### Linear
- **Por qué:** el ejemplo de "premium por restricción": paleta contenida, tipografía perfecta, motion mínimo pero exacto. Nada sobra.
- **Qué tomamos:** la disciplina. Menos es más cuando cada elemento está perfecto. Consistencia obsesiva de espaciado y tokens.
- **Cómo lo adaptamos:** mantenemos la disciplina de sistema, pero con la calidez del rubro. Linear es frío a propósito; nosotros somos cálidos a propósito.

---

## 2. Referencias de motion / interacción

### Framer
- **Por qué:** el mejor ejemplo de motion como parte del producto, no como adorno. Reveals, parallax y microinteracciones al servicio de la narrativa.
- **Qué tomamos:** la idea de que cada animación tiene un propósito (guiar la mirada, dar profundidad, generar expectativa) — alineado con [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md).
- **Cómo lo adaptamos:** curvas de easing suaves y orgánicas (nada mecánico), coherentes con flores y telas.

### Studio Freight (creadores de Lenis)
- **Por qué:** referentes del smooth scroll con peso e inercia; el scroll como experiencia, no como utilidad. Usamos **Lenis**, su librería.
- **Qué tomamos:** la sensación de scroll editorial (peso, inercia controlada) que sostiene el mood cinematográfico.
- **Cómo lo adaptamos:** inercia suave, nunca exagerada; siempre con `prefers-reduced-motion` respetado.

### Cuberto
- **Por qué:** cursores custom, hovers expresivos y transiciones de página con personalidad fuerte.
- **Qué tomamos:** ideas de microinteracciones memorables (hover en imágenes/CTAs) que suman firma sin romper usabilidad.
- **Cómo lo adaptamos:** con moderación. Personalidad sí, circo no. La elegancia del rubro manda.

### Locomotive
- **Por qué:** referentes del scroll cinematográfico y del diseño editorial en web. Layouts asimétricos con intención.
- **Qué tomamos:** la composición editorial (asimetría, tipografía protagonista, imágenes grandes) que evita el look "plantilla".
- **Cómo lo adaptamos:** asimetría al servicio de la calidez, con fotografía de eventos reales como protagonista.

### Dogstudio / Active Theory
- **Por qué:** el extremo del WebGL y las experiencias inmersivas; el techo de lo que la web puede hacer.
- **Qué tomamos:** ambición e inmersión como referencia de "hasta dónde se puede llegar", más que técnicas a implementar tal cual.
- **Cómo lo adaptamos:** **con criterio y sin sobre-ingeniería.** No metemos WebGL porque sí: el rubro pide emoción y elegancia, no demo técnica. Performance y CWV mandan ([`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md)).

### Obys
- **Por qué:** tipografía experimental y dirección de arte editorial audaz; layouts que se sienten revista de diseño.
- **Qué tomamos:** el coraje tipográfico y la dirección de arte fuerte, para que ningún layout se sienta genérico.
- **Cómo lo adaptamos:** audacia tipográfica dentro del sistema de marca, sin sacrificar legibilidad ni calidez.

---

## 3. Awwwards (curaduría, no una referencia puntual)

- **Por qué:** es el **estándar de calidad** contra el que nos medimos (junto con FWA). Ver [`CLAUDE.md`](./CLAUDE.md) §3 QUALITY BAR.
- **Qué tomamos:** el listón. La pregunta "¿una agencia top publicaría esto en su portfolio?" antes de cerrar cualquier componente.
- **Cómo lo usamos:** como filtro de calidad, no como catálogo a copiar. Muchos sites de Awwwards son fríos/tech; nosotros tomamos el nivel de ejecución, no la estética.

---

## 4. befesti.com — análisis técnico de referencia (el modelo más cercano)

> Es la referencia más alineada con lo que queremos: **editorial, cinematográfica, con motion artesanal**. Se hizo un análisis técnico real de cómo está construida. **Inspirarse, NO copiar:** replicamos los *principios* de motion y los adaptamos al mood cálido/floral.

**Stack detectado:** Webflow + **GSAP 3.15** (ScrollTrigger + SplitText).

### 4.1 Reveal de títulos palabra por palabra (con máscara)
- **Técnica observada:**
  - `SplitText` para separar el título en palabras.
  - Contenedor con **`overflow: clip`** (máscara), para que cada palabra "suba" desde detrás del borde.
  - Cada palabra anima **`yPercent: 100 → 0`**.
  - Easing **`power3.out`**.
  - **`stagger` ≈ 0.07s** entre palabras.
  - **`duration` ≈ 0.8s** por palabra.
- **Por qué funciona:** la máscara hace que el texto "nazca" en vez de solo aparecer; el stagger genera cadencia de lectura; `power3.out` da la desaceleración elegante.
- **Cómo lo adaptamos:** mismos parámetros como punto de partida (coincide con [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)), pero con la tipografía y el color de marca, y sobre fondos cálidos con textura. **Respetar `prefers-reduced-motion`** (estado final directo, sin desplazamiento).

```ts
// Receta base derivada del análisis (adaptar tokens/tipografía a la marca)
const split = new SplitText(title, { type: "words" });
gsap.from(split.words, {
  yPercent: 100,      // sube desde detrás de la máscara
  duration: 0.8,
  ease: "power3.out",
  stagger: 0.07,
  scrollTrigger: {
    trigger: title,
    start: "clamp(top bottom)",
    end: "clamp(bottom top)",
    toggleActions: "play none play none",
  },
});
// el contenedor del título necesita overflow: clip (la máscara)
```

### 4.2 Parallax de imágenes (scrubbed)
- **Técnica observada:**
  - La imagen anima **`y: "20%"`** ligada al scroll.
  - Easing **`ease: "none"`** (obligatorio en animaciones scrubbed: el scroll es el tiempo).
  - **`scrub: 2.8`** — el 2.8 agrega inercia/retraso, la imagen "persigue" al scroll con suavidad.
- **Por qué funciona:** el scrub con retraso da profundidad y peso cinematográfico sin marear; `ease:"none"` evita saltos.
- **Cómo lo adaptamos:** mismo principio para fotos de eventos/flores; intensidad ajustada para que la calidez no se pierda en movimiento excesivo. Solo `transform` (nunca `top`) por performance/INP.

```ts
gsap.to(image, {
  y: "20%",
  ease: "none",
  scrollTrigger: {
    trigger: imageWrapper,
    start: "clamp(top bottom)",
    end: "clamp(bottom top)",
    scrub: 2.8,        // inercia: la imagen persigue al scroll
  },
});
```

### 4.3 Configuración de ScrollTrigger observada
- **`start: "clamp(top bottom)"`** y **`end: "clamp(bottom top)"`** — el prefijo `clamp()` (GSAP 3.12+) evita que el trigger se dispare fuera de los límites del documento (ideal para el primer y último bloque; sin esto, elementos cerca de los bordes se animan de forma rara).
- **`toggleActions: "play none play none"`** — reproduce al entrar, no hace nada al salir, vuelve a reproducir al reentrar por arriba, nada al salir por arriba. Da reveals que se re-ejecutan al volver a scrollear hacia el elemento.
- **Cómo lo adaptamos:** adoptamos `clamp()` y estos `toggleActions` como default de nuestras recetas de reveal en [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md), salvo casos donde queramos que la animación ocurra una sola vez (`play none none none`).

### 4.4 Qué NO copiamos de befesti
- Su paleta/estética concreta: nuestro mood es **cálido y floral**, no el suyo.
- Su tipografía y composición literal.
- Cualquier recurso con copyright (imágenes, textos, assets).
- Tomamos **principios de motion y parámetros de easing/timing** como punto de partida; la dirección de arte es 100% Sweet Flowers.

---

## 5. Cómo usar estas referencias

1. **Antes de diseñar una sección**, buscá qué referencia resuelve mejor el *problema* (claridad → Stripe/Linear; narrativa → Apple; motion → Framer/befesti; scroll → Studio Freight/Locomotive; audacia tipográfica → Obys).
2. Extraé el **principio**, no el pixel.
3. **Traducilo al mood cálido/editorial** de la marca ([`02_BRAND.md`](./02_BRAND.md)).
4. Verificá contra el **QUALITY BAR** de [`CLAUDE.md`](./CLAUDE.md) §3 y contra performance/accesibilidad ([`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md), [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md)).

> Documento **vivo**. Se agregan referencias nuevas con su porqué a medida que aparecen.
