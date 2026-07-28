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
    "paths": { "@/*": ["./*"] }
  }
}
```

Reglas de tipado (detalle en [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md)): **sin `any`**, sin `as` salvo *type guards* justificados, tipos de dominio en `lib/types`.

---

## 4. Por qué Tailwind CSS

- **Un solo lugar para los tokens.** El design system ([`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md)) define color, tipografía, espaciado y radios. Se mapean a Tailwind (v4: `@theme`) y **no se redefinen acá**.
- **Cero CSS muerto** en producción y velocidad de iteración altísima, clave para un sitio con mucha maquetación editorial única por sección.
- **Coexiste con GSAP:** Tailwind maqueta el estado *estático* (layout, tipografía, color); GSAP anima *transform/opacity*. No se pisan.

```css
/* app/globals.css — los VALORES viven en 06_DESIGN_SYSTEM.md */
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
// components/motion/SmoothScroll.tsx
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
├─ app/                       # App Router (raíz del repo)
│  ├─ layout.tsx              # root: fonts, providers, metadata base
│  ├─ page.tsx                # home
│  ├─ globals.css             # @import tailwind + @theme (tokens)
│  ├─ sitemap.ts
│  ├─ robots.ts
│  ├─ opengraph-image.tsx
│  ├─ api/                    # route handlers (webhooks pago, etc.)
│  └─ productos/              # catálogo + producto (rutas planas)
│     ├─ page.tsx
│     └─ [slug]/page.tsx
├─ components/
│  ├─ ui/                     # Button, Link, Container, Section, Heading…
│  ├─ motion/                 # wrappers client de animación (SmoothScroll, useGSAP)
│  ├─ sections/              # bloques de página (home, historia, evento…)
│  └─ site/                   # Nav, MenuOverlay, Footer
├─ lib/
│  ├─ types/                  # tipos de dominio (Product, Event…)
│  ├─ commerce/               # adapter de e-commerce (§10)
│  ├─ constants.ts            # EVENT_NAME, rutas, etc.
│  ├─ seo.ts                  # helpers de metadata
│  └─ utils.ts                # cn(), format…
├─ content/                   # datos placeholder (MDX/JSON tipados)
├─ tsconfig.json
├─ next.config.ts
└─ package.json
```

> El repo **no** usa `src/`: todo cuelga de la raíz. El alias `@/*` apunta a la raíz del repo (`@/lib/… = lib/…`, `@/components/… = components/…`). Las rutas son planas; si en el futuro hiciera falta separar layouts, se pueden usar grupos de ruta (p. ej. `(marketing)`/`(shop)`) como opción, pero no son la estructura fija de hoy.

---

## 9. Notas de plataforma (Vercel)

- **Runtime por defecto: Node.js (Fluid Compute). NO usar `edge`.** El streaming, SSE y los SDKs de pago funcionan en Node sin las limitaciones del edge.
- **No** declarar `export const runtime = "edge"` salvo caso puntual y justificado en [`16_DECISIONS.md`](./16_DECISIONS.md).
- **Timeout de funciones: 300s** — suficiente para webhooks de pago y llamadas a APIs de tienda.
- `next/image` y `next/font` son nativos: no agregar loaders externos ni Google Fonts por `<link>`.

```ts
// Ejemplo de route handler: runtime Node (default), sin edge.
// app/api/webhooks/mercadopago/route.ts
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
// app/layout.tsx (extracto)
import localFont from "next/font/local";
// import { Fraunces, Manrope } from "next/font/google"; // alternativa si son Google Fonts

// TODO(contenido): reemplazar por la familia display real del manual de marca
const display = localFont({
  src: "../public/fonts/display.woff2",
  variable: "--font-display",
  display: "swap",
});
const body = localFont({
  src: "../public/fonts/body.woff2",
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
- Copys centralizados en `content/` para poder internacionalizar más adelante sin reescribir componentes.

```ts
// lib/utils.ts
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

## 14. E-commerce (DECIDIDO ✅ — ver ADR-007)

**E-commerce propio, construido desde 0 + Mercado Pago.** Catálogo, ficha (PDP), carrito y checkout viven dentro del sitio; el cobro es con **Mercado Pago** (Checkout Pro → Bricks) + **webhooks**. Los productos **a medida** van por **flujo de presupuesto**, no compra directa.

> **Tienda Nube y Mercado Libre quedaron descartados.** Flor confirmó que **ya no usa Tienda Nube** ni vende por ML (ver [`CONTENIDO_FLOR.md`](./CONTENIDO_FLOR.md) §2). No hay nada que integrar ni enlazar. Las opciones B (headless) y C (enlace) de versiones previas de este doc **ya no aplican**.

- **Datos + panel:** Payload CMS como motor + panel a medida (ADR-011). Ver `colaboracion/gonzalo/02_ARQUITECTURA_BACKEND.md`.
- **Recargo Mercado Pago:** el precio de catálogo va **sin recargo**; con MP se calcula `precio / (1 - 0.15)` ≈ **+18%** (ver `CONTENIDO_FLOR.md` §4).
- **Adapter:** `lib/commerce/` como interfaz estable → el proveedor de pago es intercambiable sin tocar la UI (ADR-013).

```ts
// lib/commerce/types.ts — contrato estable independiente del proveedor
export interface CommerceProduct {
  id: string;
  slug: string;
  title: string;
  priceARS: number | null;      // precio base (sin recargo); null mientras sea placeholder
  material: "hierro" | "mdf" | "madera" | "fundas-telas";
  isDismountable: boolean;
  isPaintable: boolean;
  stock: number;
  isCustomOrder: boolean;       // true → flujo de presupuesto, no compra directa
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
