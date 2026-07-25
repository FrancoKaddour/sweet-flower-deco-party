# 10 — STACK TÉCNICO

> **Fuente de verdad del stack.** El *qué* y el *porqué* de negocio viven en [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md). Este documento justifica cada elección técnica, define la estructura del repo y deja la decisión de e-commerce documentada (con recomendación) para registrarla en [`16_DECISIONS.md`](./16_DECISIONS.md).
>
> Tokens de diseño → [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md). Tokens de motion → [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md). Convenciones de código → [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md). Componentes → [`12_COMPONENT_GUIDELINES.md`](./12_COMPONENT_GUIDELINES.md).

---

## 1. Resumen ejecutivo

| Capa | Elección | Motivo en una línea |
| --- | --- | --- |
| Framework | **Next.js (App Router)** | Server Components, streaming, SEO nativo, deploy en Vercel de primera. |
| Lenguaje | **TypeScript estricto** | Cero `any`, contratos explícitos, refactors seguros. |
| Estilos | **Tailwind CSS** | Tokens del design system como fuente única, cero CSS muerto, velocidad. |
| Animación | **GSAP** (ScrollTrigger + SplitText) | Timelines, scrub, reveals por palabra con máscara. 100% gratuito. |
| Smooth scroll | **Lenis** | Scroll con peso, sincronizado con ScrollTrigger. |
| Imágenes | **`next/image`** | AVIF/WebP, `srcset`, lazy y sin CLS. |
| Fuentes | **`next/font`** | Self-host, `font-display: swap`, cero request a terceros. |
| Deploy | **Vercel** | Runtime **Node.js (Fluid Compute)**, preview por PR, edge CDN. |
| E-commerce | **Abierto → ver §10** | 3 opciones evaluadas + recomendación. |

---

## 2. Por qué Next.js (App Router)

El sitio no es "una landing": convive **e-commerce** (catálogo, precio, envío, pago) con **plataforma de marca/eventos** y **membresía**. Eso exige tres cosas que el App Router resuelve nativamente:

1. **Server Components por defecto.** El catálogo, la home editorial y las páginas de evento son mayormente *contenido*. Renderizarlas en el server reduce el JS que viaja al cliente y mejora LCP. Solo bajamos a `"use client"` en las hojas del árbol donde hay interacción o animación (ver [`12_COMPONENT_GUIDELINES.md`](./12_COMPONENT_GUIDELINES.md)).
2. **SEO técnico de primera clase.** La [Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), `generateMetadata`, `sitemap.ts`, `robots.ts` y `opengraph-image.tsx` son parte del framework. Para un proyecto cuyo objetivo es **autoridad de marca** ([`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md)), esto es central.
3. **Streaming + Suspense.** Podemos enviar el shell editorial de inmediato y *stremear* datos lentos (stock, precios de la API de tienda) sin bloquear el render. Con el runtime Node de Vercel (Fluid Compute) el streaming/SSE funciona sin fricción (§9).

**Alternativas descartadas:** Astro (excelente para contenido, pero la capa de e-commerce dinámico + membresía + animación fina nos empujaba a demasiado "islands" manual); Remix/SPA (peor DX de SEO/imagen out-of-the-box para este caso); WordPress/Elementor (rompe la *Quality Bar* del handoff antes de empezar).

---

## 3. Por qué TypeScript estricto

`strict: true` no es negociable. El dominio tiene entidades con reglas (un producto es *desarmable*, *pintable*, tiene *material*, puede ser *a medida*). Modelarlas como tipos evita bugs de contenido y hace el catálogo mantenible.

```jsonc
// tsconfig.json (extracto)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "verbatimModuleSyntax": true,
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

Reglas de tipado (detalle en [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md)): **sin `any`**, sin `as` salvo *type guards* justificados, tipos de dominio en `src/lib/types`.

---

## 4. Por qué Tailwind CSS

- **Un solo lugar para los tokens.** El design system ([`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md)) define color, tipografía, espaciado y radios. Se mapean a Tailwind (v4: `@theme`) y **no se redefinen acá**.
- **Cero CSS muerto** en producción y velocidad de iteración altísima, clave para un sitio con mucha maquetación editorial única por sección.
- **Coexiste con GSAP:** Tailwind maqueta el estado *estático* (layout, tipografía, color); GSAP anima *transform/opacity*. No se pisan.

```css
/* src/styles/globals.css — los VALORES viven en 06_DESIGN_SYSTEM.md */
@import "tailwindcss";

@theme {
  /* TODO(contenido): reemplazar por tokens reales de 06_DESIGN_SYSTEM.md */
  --color-ink: #14110f;
  --color-bone: #f6f1e7;
  --font-display: var(--font-display);
  --font-body: var(--font-body);
}
```

---

## 5. Por qué GSAP (y no solo Framer Motion)

Ambos podrían convivir, pero el **motion firmado del sitio** ([`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)) pide cosas donde GSAP es netamente superior:

| Necesidad del motion | GSAP | Framer Motion |
| --- | --- | --- |
| Reveal por palabra con máscara (`SplitText`, `yPercent 100→0`) | Nativo, robusto | Manual y frágil |
| Parallax scrubbed ligado al scroll (`scrub: 2.8`) | `ScrollTrigger`, exacto | Limitado |
| Timelines coreografiadas (cambios de sección teatrales) | Excelente | Verboso |
| Control fino de easing (`power3.out`, custom) | Total | Bueno |

> **Nota de licencia (importante):** desde la adquisición por Webflow, **GSAP y todos sus plugins —incluido SplitText y ScrollTrigger— son 100% gratuitos**, sin club de pago. No usar "es caro" como argumento para evitarlo.

**Framer Motion** queda como opción puntual para micro-interacciones de UI (layout animations de un menú, por ejemplo) **solo si aporta**; no se adopta por defecto para no duplicar runtime de animación. Por ahora: **GSAP como motor único**.

---

## 6. Por qué Lenis (smooth scroll)

El handoff pide que "el scroll se sienta con peso". Lenis da smooth scroll con inercia controlada, es liviano, respeta el scroll nativo del OS y —crítico— **se sincroniza con ScrollTrigger** para que parallax/reveals no se desfasen.

```tsx
// src/components/providers/SmoothScroll.tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return; // sin smooth scroll si el usuario lo pide

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

`prefers-reduced-motion` desactiva el smooth scroll: el sitio debe sentirse elegante también sin movimiento ([`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)).

---

## 7. Por qué Vercel

- **Integración nativa con Next.js:** ISR, imágenes optimizadas, `next/font`, streaming.
- **Preview deployments por PR:** cada rama tiene URL propia para revisar diseño y motion.
- **Runtime Node.js (Fluid Compute) por defecto** (§9), con timeout de función de **300s** y soporte de streaming/SSE.
- CDN edge global para assets estáticos (imágenes, fuentes self-hosted).

---

## 8. Estructura de carpetas propuesta

```
sweet-flowers-deco-party/
├─ docs/                      # Project Bible (este directorio)
├─ public/
│  ├─ images/                 # placeholders con proporción correcta
│  ├─ video/                  # TODO(contenido): SweetDay + bruto
│  └─ fonts/                  # solo si next/font local
├─ src/
│  ├─ app/                    # App Router
│  │  ├─ (marketing)/         # home, historia, evento, membresía
│  │  │  ├─ page.tsx
│  │  │  └─ layout.tsx
│  │  ├─ (shop)/              # catálogo + producto
│  │  │  ├─ productos/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [slug]/page.tsx
│  │  ├─ api/                 # route handlers (webhooks pago, etc.)
│  │  ├─ layout.tsx           # root: fonts, providers, metadata base
│  │  ├─ sitemap.ts
│  │  ├─ robots.ts
│  │  └─ opengraph-image.tsx
│  ├─ components/
│  │  ├─ ui/                  # Button, Link, Container, Section, Heading…
│  │  ├─ motion/              # wrappers client de animación (useGSAP)
│  │  ├─ product/             # ProductCard, ProductGallery…
│  │  ├─ event/               # EventCard, Speakers…
│  │  ├─ layout/              # Nav, MenuOverlay, Footer
│  │  └─ providers/           # SmoothScroll, ReducedMotion…
│  ├─ lib/
│  │  ├─ types/               # tipos de dominio (Product, Event…)
│  │  ├─ commerce/            # adapter de e-commerce (§10)
│  │  ├─ constants.ts         # EVENT_NAME, rutas, etc.
│  │  ├─ seo.ts               # helpers de metadata
│  │  └─ utils.ts             # cn(), format…
│  ├─ content/                # datos placeholder (MDX/JSON tipados)
│  └─ styles/
│     └─ globals.css          # @import tailwind + @theme (tokens)
├─ tsconfig.json
├─ next.config.ts
└─ package.json
```

> Se usa `src/` para separar código de config. Alias `@/*` → `src/*`. Los grupos de rutas `(marketing)` y `(shop)` permiten layouts distintos sin ensuciar la URL.

---

## 9. Notas de plataforma (Vercel)

- **Runtime por defecto: Node.js (Fluid Compute). NO usar `edge`.** El streaming, SSE y los SDKs de pago funcionan en Node sin las limitaciones del edge.
- **No** declarar `export const runtime = "edge"` salvo caso puntual y justificado en [`16_DECISIONS.md`](./16_DECISIONS.md).
- **Timeout de funciones: 300s** — suficiente para webhooks de pago y llamadas a APIs de tienda.
- `next/image` y `next/font` son nativos: no agregar loaders externos ni Google Fonts por `<link>`.

```ts
// Ejemplo de route handler: runtime Node (default), sin edge.
// src/app/api/webhooks/mercadopago/route.ts
export const dynamic = "force-dynamic";
// NO: export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  // TODO(contenido): validar firma del webhook y procesar el pago
  return Response.json({ received: true });
}
```

---

## 10. Fuentes con `next/font`

Self-host automático, sin CLS, sin request a Google. Las familias reales se definen cuando llegue el manual de marca ([`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md)).

```tsx
// src/app/layout.tsx (extracto)
import localFont from "next/font/local";
// import { Fraunces, Manrope } from "next/font/google"; // alternativa si son Google Fonts

// TODO(contenido): reemplazar por la familia display real del manual de marca
const display = localFont({
  src: "../../public/fonts/display.woff2",
  variable: "--font-display",
  display: "swap",
});
const body = localFont({
  src: "../../public/fonts/body.woff2",
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Las variables CSS (`--font-display`, `--font-body`) se consumen desde Tailwind (`@theme`), no se hardcodean font-families.

---

## 11. Imágenes con `next/image`

- Siempre `next/image` con `width`/`height` o `fill` + contenedor con proporción → **cero CLS**.
- Formatos AVIF/WebP automáticos, `sizes` correcto por breakpoint.
- Foto *hero*/LCP con `priority`; el resto lazy por defecto.
- `alt` **real y descriptivo**; en placeholders, `alt` con prefijo `TODO(contenido):`.

```tsx
import Image from "next/image";

<Image
  src="/images/placeholder-producto.jpg"
  alt="TODO(contenido): descripción real de la pieza de decoración"
  width={1200}
  height={1500}
  sizes="(max-width: 768px) 100vw, 50vw"
  className="h-auto w-full object-cover"
/>;
```

---

## 12. i18n (es-AR)

El sitio es **monolingüe es-AR** por ahora. **No** se instala framework de i18n (evitamos complejidad prematura). Se fija:

- `<html lang="es-AR">`.
- Formato de moneda/fecha con `Intl` y locale `es-AR`.
- Copys centralizados en `src/content` para poder internacionalizar más adelante sin reescribir componentes.

```ts
// src/lib/utils.ts
export const formatPrice = (value: number): string =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);
```

> Si en el futuro se agrega EN, se evaluará `next-intl` y se registrará en [`16_DECISIONS.md`](./16_DECISIONS.md).

---

## 13. Analytics y SEO tooling

- **Vercel Analytics + Speed Insights** para Core Web Vitals reales de campo (objetivos en [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md)).
- **Metadata API** de Next para title/description/OG/Twitter por ruta.
- `sitemap.ts` + `robots.ts` generados.
- **JSON-LD** (`Product`, `Event`, `Organization`) inyectado como `<script type="application/ld+json">` — clave para catálogo y evento. Estrategia completa en [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md).

```tsx
// Analytics en el root layout
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
// … <body>{children}<Analytics /><SpeedInsights /></body>
```

---

## 14. Decisión de e-commerce (ABIERTA)

Hoy la marca ya opera con **Tiendanube + Mercado Libre + Mercado Pago** (recargo ~15%). Eso condiciona la elección: cualquier camino debe respetar la operación actual de stock, cobros y envíos.

### Opción A — Frontend custom + checkout con Mercado Pago (Checkout Pro / SDK)

Catálogo propio en Next; el carrito y el pago se resuelven con Mercado Pago directamente.

| Pros | Cons |
| --- | --- |
| Control total de UX/motion en catálogo y checkout (cumple la *Quality Bar*). | Hay que construir/mantener gestión de stock, precios y envíos por afuera. |
| Sin dependencia del theme/limitaciones de Tiendanube. | Duplica la operación actual (Flor ya gestiona en Tiendanube). |
| Un solo dominio, un solo look & feel. | Más superficie de mantenimiento y responsabilidad legal/fiscal. |

### Opción B — Tiendanube headless vía su API

Frontend custom en Next que **lee productos/stock desde la API de Tiendanube** y delega el checkout/backoffice a Tiendanube.

| Pros | Cons |
| --- | --- |
| Look & feel premium propio + backoffice ya conocido por la marca. | La API de Tiendanube tiene límites; sincronización y auth a resolver. |
| Reutiliza stock, precios, envíos y pagos ya configurados. | El checkout puede salir del dominio (o requiere integración fina). |
| Menos operación nueva para Flor. | Acoplamiento a la plataforma y a su roadmap. |

### Opción C — Enlazar a la tienda Tiendanube existente

El sitio premium es la plataforma de marca/eventos y **enlaza** al catálogo Tiendanube ya operativo para comprar.

| Pros | Cons |
| --- | --- |
| Time-to-market mínimo, cero riesgo de checkout. | Ruptura de experiencia al saltar de dominio (rompe la inmersión editorial). |
| Cero mantenimiento de e-commerce nuevo. | Poco control de UX/motion en la compra. |
| Deja al equipo enfocado en marca/evento/membresía primero. | El catálogo no vive dentro del relato del sitio. |

### Recomendación

**Fase 1 (lanzamiento): Opción C** — enlazar a Tiendanube. Permite lanzar el sitio premium ya, sin bloquear por integración de pago, y mantiene intacta la operación actual. Mitigamos la ruptura de experiencia mostrando **fichas de producto propias y editoriales** dentro del sitio (con foto, material, medidas, si es desarmable/pintable) y un CTA claro "Comprar en la tienda" que abre Tiendanube.

**Fase 2 (evolución): migrar a Opción B** — Tiendanube headless — para traer el catálogo dentro del relato y controlar la UX, reutilizando el backoffice que Flor ya domina. **Opción A** solo si la API de Tiendanube resulta insuficiente y el negocio justifica asumir la operación completa de checkout.

> Esta decisión, su fecha y sus disparadores de revisión se registran en [`16_DECISIONS.md`](./16_DECISIONS.md). El `src/lib/commerce/` se diseña como **adapter** para que cambiar de C → B → A no toque los componentes de UI.

```ts
// src/lib/commerce/types.ts — contrato estable independiente del proveedor
export interface CommerceProduct {
  id: string;
  slug: string;
  title: string;
  priceARS: number | null;      // null mientras sea placeholder
  material: "hierro" | "mdf" | "madera" | "fundas-telas";
  isDismountable: boolean;
  isPaintable: boolean;
  buyUrl: string;               // link a Tiendanube en Fase 1
}
```

---

## 15. Dependencias iniciales

```jsonc
{
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "gsap": "latest",           // ScrollTrigger + SplitText incluidos, gratuitos
    "lenis": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "class-variance-authority": "latest",
    "@vercel/analytics": "latest",
    "@vercel/speed-insights": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "tailwindcss": "latest",
    "eslint": "latest",
    "prettier": "latest"
  }
}
```

> Toda dependencia nueva se justifica (regla de `CLAUDE.md`). No agregar librerías de animación/estado redundantes.

---

## 16. Referencias cruzadas

- Diseño y tokens → [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md)
- Motion y recetas GSAP → [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)
- Componentes → [`12_COMPONENT_GUIDELINES.md`](./12_COMPONENT_GUIDELINES.md)
- Estándares de código → [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md)
- Decisiones abiertas → [`16_DECISIONS.md`](./16_DECISIONS.md)
- SEO → [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md)
