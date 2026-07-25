# 13 — ESTÁNDARES DE DESARROLLO

> Reglas de código no negociables para Sweet Flowers Deco Party. Un sitio bello que carga lento, rompe en Safari o no es accesible **no pasa la Quality Bar** ([`CLAUDE.md`](./CLAUDE.md), [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md)).
>
> Stack → [`10_TECH_STACK.md`](./10_TECH_STACK.md). Componentes → [`12_COMPONENT_GUIDELINES.md`](./12_COMPONENT_GUIDELINES.md). Diseño → [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md). Motion → [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md).

---

## 1. TypeScript estricto

`strict: true` + `noUncheckedIndexedAccess`. Reglas:

- **Prohibido `any`.** Si el tipo es incierto: `unknown` + *narrowing*. Terceros sin tipos → declararlos en `src/lib/types`.
- **Prohibido `as` casual.** Solo *type guards* justificados o `as const`. Nunca `as any`.
- **Sin `@ts-ignore`.** Si es inevitable, `@ts-expect-error` con comentario explicando por qué.
- **Tipos de dominio** en `src/lib/types` (`Product`, `Event`, `Membership`). Se importan; no se duplican inline.
- **`interface`** para formas de objeto/props; **`type`** para uniones y utilitarios.
- **Retornos explícitos** en funciones exportadas y en route handlers.

```ts
// ✅ narrowing en vez de any
function getStock(data: unknown): number {
  if (typeof data === "object" && data !== null && "stock" in data) {
    const s = (data as { stock: unknown }).stock;
    return typeof s === "number" ? s : 0;
  }
  return 0;
}

// ✅ discriminated union para variantes de producto
type ProductAvailability =
  | { kind: "stock"; quantity: number }
  | { kind: "made-to-order"; leadTimeDays: number | null }; // null mientras placeholder
```

---

## 2. Naming

| Cosa | Convención | Ejemplo |
| --- | --- | --- |
| Componente / archivo componente | `PascalCase` | `ProductCard.tsx` |
| Hook | `useCamelCase` | `useReveal` |
| Función / variable | `camelCase` | `formatPrice` |
| Constante global | `UPPER_SNAKE_CASE` | `EVENT_NAME` |
| Tipo / interface | `PascalCase` | `CommerceProduct` |
| Booleano | prefijo `is/has/should` | `isDismountable` |
| Archivo util/lib | `camelCase.ts` | `utils.ts` |
| Ruta App Router | `kebab-case` | `productos/[slug]` |

Nombres en **inglés en el código**; el **contenido/copy** en español (es-AR). Sin abreviaturas crípticas.

---

## 3. ESLint / Prettier

- **ESLint:** `next/core-web-vitals` + `@typescript-eslint` (strict). Reglas activas: `no-explicit-any`, `no-unused-vars`, `no-console` (salvo `warn`/`error`), `react-hooks/*`.
- **Prettier:** formato único, sin debate. Corre en pre-commit y en CI.
- **Import order:** builtins → externos → `@/…` → relativos.

```jsonc
// .prettierrc
{ "semi": true, "singleQuote": false, "trailingComma": "es5", "printWidth": 100 }
```

CI falla si ESLint o `tsc --noEmit` fallan. No se mergea rojo.

---

## 4. Conventional Commits

Formato `tipo(scope): descripción` en imperativo, en minúscula, sin punto final.

| Tipo | Uso |
| --- | --- |
| `feat` | nueva funcionalidad |
| `fix` | corrección de bug |
| `style` | maquetación/CSS/tokens (sin lógica) |
| `refactor` | cambio interno sin alterar comportamiento |
| `perf` | mejora de performance |
| `a11y` | accesibilidad |
| `docs` | documentación (`docs/`) |
| `chore` | config, deps, tooling |

```
feat(shop): add ProductCard with editorial layout
fix(nav): trap focus in MenuOverlay when open
perf(hero): animate only transform/opacity in reveal
docs(stack): document e-commerce options and recommendation
```

Commits pequeños y atómicos. El contenido pendiente se marca en código, no en el mensaje de commit.

---

## 5. Ramas

- `main` → siempre desplegable (production en Vercel).
- `feat/*`, `fix/*`, `chore/*` → ramas cortas por tarea.
- Merge vía **Pull Request** con preview deployment de Vercel + review.
- Rebase preferido sobre merge-commits para historia limpia; squash al mergear features.

---

## 6. Code review checklist

- [ ] ¿Cumple la *Quality Bar*? (¿lo firmaría Apple/Stripe/Framer?)
- [ ] TypeScript sin `any`/`as any`; tipos de dominio reutilizados.
- [ ] Server por defecto; `"use client"` justificado y en la hoja.
- [ ] Accesibilidad: semántica, foco, teclado, `alt`, contraste AA.
- [ ] Motion: tokens de [`07`](./07_MOTION_SYSTEM.md), solo `transform`/`opacity`, `prefers-reduced-motion` cubierto, cleanup de GSAP.
- [ ] Performance: `next/image`, `sizes` correcto, sin imports pesados en client.
- [ ] SEO: `metadata`/`generateMetadata` donde corresponde.
- [ ] Placeholders marcados `TODO(contenido):`; sin datos duros inventados.
- [ ] Sin `console.log`, sin código muerto, sin secretos hardcodeados.

---

## 7. Manejo de estado

Orden de preferencia (usar el más simple que resuelva):

1. **Server Components + props** → la mayoría del sitio no necesita estado cliente.
2. **URL / search params** → filtros de catálogo (compartible, indexable, sin estado global).
3. **`useState`/`useReducer` local** → UI efímera (menú abierto, hover).
4. **Context** → solo transversal real (ej. estado de smooth scroll / reduced motion).
5. **Librería de estado global** → **no** por ahora. Se justifica en [`16_DECISIONS.md`](./16_DECISIONS.md) si un carrito propio (Opción A/B) lo exige.

```tsx
// Filtros de catálogo en la URL, no en estado global.
// /productos?material=hierro  → Server Component lee searchParams
export default function ProductosPage({
  searchParams,
}: { searchParams: { material?: string } }) {
  const material = searchParams.material ?? "todos";
  // TODO(contenido): filtrar el listado maestro real por material
  return <ProductGrid material={material} />;
}
```

---

## 8. Data fetching en App Router

- **Fetch en Server Components** (async) por defecto; nunca exponer claves de API al cliente.
- **Caché explícita:** decidir por request `cache: "force-cache"` (contenido estático) o `next: { revalidate: N }` (ISR para catálogo).
- **`generateStaticParams`** para páginas de producto/edición conocidas.
- **Streaming con `<Suspense>`** para datos lentos (stock/precio de la API de tienda), sin bloquear el shell editorial.
- **Runtime Node por defecto** (no edge) — ver [`10_TECH_STACK.md`](./10_TECH_STACK.md) §9.

```tsx
// Catálogo con revalidación (ISR) — datos frescos sin rebuild.
async function getProducts(): Promise<CommerceProduct[]> {
  const res = await fetch(process.env.COMMERCE_API_URL!, {
    next: { revalidate: 3600 }, // 1h
  });
  if (!res.ok) throw new Error("commerce fetch failed");
  return res.json();
}
```

---

## 9. Performance — Core Web Vitals

Objetivos (campo, p75 mobile):

| Métrica | Objetivo | Palanca principal |
| --- | --- | --- |
| **LCP** | < 2.5 s | `next/image` + `priority` en hero, `next/font` swap |
| **CLS** | < 0.1 | dimensiones/`aspect-ratio` en imágenes, sin layout shift por fuentes |
| **INP** | < 200 ms | poco JS en client, animar solo `transform`/`opacity` |

Reglas:

- **Bundle budget:** JS inicial de cada ruta lo más bajo posible; vigilar el peso de client bundles en CI. GSAP solo en componentes que animan (`"use client"` en la hoja).
- **Lazy loading:** `next/dynamic` para bloques pesados no críticos (ej. galería interactiva) con `ssr: false` solo si de verdad es client-only.
- **Animar solo `transform` y `opacity`** — nunca `top/left/width/height` (causan reflow y bajan INP/FPS).
- **Imágenes:** formato AVIF/WebP automático, `sizes` correcto, `priority` únicamente en el LCP.
- **Fuentes:** `next/font` self-host + `display: swap`; sin `@import` de Google Fonts.
- Medir con **Vercel Speed Insights** (campo) y Lighthouse (lab).

---

## 10. Accesibilidad (WCAG 2.1 AA)

- **Semántica:** landmarks (`header/nav/main/footer`), un `<h1>` por página, jerarquía sin saltos.
- **Teclado:** todo lo interactivo es tabulable y operable; orden de tab lógico; `Esc` cierra overlays; *focus trap* en modales/menu.
- **Foco visible:** nunca eliminar el outline sin un `focus-visible:ring` equivalente.
- **Contraste AA:** texto ≥ 4.5:1 (≥ 3:1 grande). Valores de color en [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md).
- **Imágenes:** `alt` real; decorativas → `alt=""`.
- **`prefers-reduced-motion: reduce`** (obligatorio): sin parallax ni desplazamientos grandes; solo micro-fades o estado final directo. Aplica a Lenis y a todo GSAP ([`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)).

```tsx
// Guard estándar de motion — repetir en cada componente animado.
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduce) {
  gsap.set(target, { opacity: 1, clearProps: "transform" });
  return;
}
```

Auditoría con la skill de accessibility-audit antes de cerrar secciones grandes.

---

## 11. SEO a nivel código

- **Metadata API** por ruta; `metadataBase` en el root.
- `sitemap.ts` + `robots.ts`; `opengraph-image.tsx` para OG por defecto.
- **JSON-LD** (`Product`, `Event`, `Organization`) donde aplique. Estrategia en [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md).
- `alt`, headings y URLs semánticas cuentan como SEO técnico.

```tsx
// src/app/(shop)/productos/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  // TODO(contenido): título/descr. reales desde el listado maestro de productos
  return {
    title: `Producto — Sweet Flowers Deco Party`,
    description: "TODO(contenido): descripción real de la pieza.",
    openGraph: { images: [`/images/products/${params.slug}.jpg`] },
    alternates: { canonical: `/productos/${params.slug}` },
  };
}
```

---

## 12. Reglas de placeholders

Mientras no haya contenido real ([`CLAUDE.md`](./CLAUDE.md) §0):

- **Texto:** `TODO(contenido): copy real de Flor`.
- **`alt` de imagen:** prefijo `TODO(contenido):`.
- **Datos duros (precio, cupo, fecha, nombre):** **nunca** inventar valores realistas. Usar `$ —`, `Edición 0X`, `[NOMBRE DISERTANTE]`.
- **Nombre del evento:** constante única `EVENT_NAME` en `src/lib/constants.ts` (sin definir → placeholder), para cambiarlo en un solo lugar.
- Los `TODO(contenido):` deben ser *greppables*: `grep -r "TODO(contenido)" src/` lista todo lo pendiente.

```ts
// src/lib/constants.ts
// TODO(contenido): nombre definitivo del evento del 18/09 (pendiente cliente)
export const EVENT_NAME = "[NOMBRE DEL EVENTO]";
```

---

## 13. Definition of Done

Una tarea está **terminada** solo si:

- [ ] Compila: `tsc --noEmit` sin errores; ESLint y Prettier en verde.
- [ ] Sin `any`, sin `console.log`, sin código muerto, sin secretos hardcodeados.
- [ ] Server por defecto; `"use client"` justificado y en la hoja del árbol.
- [ ] Accesible: semántica, teclado, foco visible, contraste AA, `alt` real/placeholder.
- [ ] `prefers-reduced-motion` respetado en todo el motion; GSAP con cleanup.
- [ ] Performance: `next/image` + `sizes`, `next/font`, animación solo `transform`/`opacity`; sin regresión de CWV.
- [ ] SEO: `metadata`/`generateMetadata` donde corresponde.
- [ ] Placeholders marcados `TODO(contenido):`; ningún dato duro inventado.
- [ ] Responsive verificado (mobile-first) y sin romper en Safari/iOS.
- [ ] Commit con Conventional Commits; PR con preview de Vercel.
- [ ] Pasa la *Quality Bar*: digno de portfolio.
- [ ] Reporte final honesto: qué se hizo, qué quedó como placeholder, qué se mejoraría ([`CLAUDE.md`](./CLAUDE.md) §7).

---

## 14. Referencias cruzadas

- Stack y decisiones → [`10_TECH_STACK.md`](./10_TECH_STACK.md)
- Componentes → [`12_COMPONENT_GUIDELINES.md`](./12_COMPONENT_GUIDELINES.md)
- Diseño / tokens → [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md)
- Motion / tokens → [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)
- SEO → [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md)
- Decisiones abiertas → [`16_DECISIONS.md`](./16_DECISIONS.md)
