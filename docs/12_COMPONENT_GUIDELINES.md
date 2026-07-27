# 12 — GUÍA DE COMPONENTES

> Cómo construir componentes **coherentes, tipados, accesibles y animados** en Sweet Flowers Deco Party.
>
> Stack y estructura → [`10_TECH_STACK.md`](./10_TECH_STACK.md). Tokens de diseño → [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md). Tokens de motion (easing, duraciones, `yPercent`, `scrub`) → [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md). Estándares → [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md). **No redefinir tokens acá**: siempre remitir a `06`/`07`.

---

## 1. Principios

1. **Server por defecto, client donde haga falta.** `"use client"` solo en la hoja del árbol que anima o interactúa, lo más abajo posible ([`10_TECH_STACK.md`](./10_TECH_STACK.md)).
2. **Un componente, una responsabilidad.** Si un componente maquета *y* fetchea *y* anima, se parte.
3. **Props tipadas y explícitas.** Nada de `any`. Variantes vía `cva`.
4. **Composición sobre configuración.** Preferir `<Section><Heading/>…</Section>` a un mega-componente con 20 props booleanas.
5. **Accesibilidad no es una feature.** HTML semántico, foco visible, teclado, `prefers-reduced-motion` — en cada componente.
6. **Ningún layout se repite igual** (regla del handoff). Los componentes base son el *vocabulario*; cada sección los compone distinto.

---

## 2. Convención de nombres

| Elemento | Convención | Ejemplo |
| --- | --- | --- |
| Archivo de componente | `PascalCase.tsx` | `ProductCard.tsx` |
| Componente | `PascalCase` | `ProductCard` |
| Hook | `useCamelCase` | `useReveal` |
| Props type | `NombreProps` | `ProductCardProps` |
| Wrapper de animación | sufijo/carpeta `motion/` | `RevealText`, `ParallaxImage` |
| Variante `cva` | `nombreVariants` | `buttonVariants` |

Un componente por archivo (más sus subpartes privadas). Carpeta por dominio: `ui/`, `motion/`, `product/`, `event/`, `layout/`, `providers/`.

---

## 3. Anatomía de un componente

```tsx
// src/components/ui/Button.tsx  (Server Component — no anima ni usa estado)
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // base: los COLORES/RADIOS reales salen de 06_DESIGN_SYSTEM.md (Tailwind theme)
  "inline-flex items-center justify-center font-body transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "bg-ink text-bone hover:opacity-90",
        outline: "border border-ink text-ink hover:bg-ink hover:text-bone",
        ghost: "text-ink hover:opacity-70",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
```

**Reglas:** props extienden el elemento HTML nativo (`...props`), variantes con `cva`, merge de clases con `cn`, `defaultVariants` siempre definidos.

---

## 4. Separación Server / Client

- **Server (default):** maquetación, datos, texto, `next/image`, composición. Sin `"use client"`, sin hooks de estado/efecto.
- **Client (`"use client"`):** animación GSAP, estado de UI (menú abierto), listeners, `IntersectionObserver`.

**Patrón:** el Server Component pasa `children` (contenido server) a un wrapper client de animación. Así el HTML se renderiza en el server y el cliente solo *anima* el árbol ya existente.

```tsx
// Server component compone; el wrapper client solo anima.
import { RevealText } from "@/components/motion/RevealText";

export function Hero() {
  return (
    <section className="min-h-screen">
      {/* TODO(contenido): headline real de Flor */}
      <RevealText as="h1" className="font-display text-6xl">
        Decoración que se recuerda
      </RevealText>
    </section>
  );
}
```

---

## 5. Patrón para componentes animados

Wrapper client + `useGSAP` (o `gsap.context`) para *scoping* y cleanup automático. **Siempre** respetar `prefers-reduced-motion`. Los valores exactos (`yPercent: 100→0`, `power3.out`, `stagger ~0.07`, `scrub: 2.8`) están en [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md) — no inventar.

```tsx
// src/components/motion/RevealText.tsx
"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, useGSAP);

type RevealTextProps = {
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  children: React.ReactNode;
};

export function RevealText({ as: Tag = "h2", className, children }: RevealTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const el = ref.current;
      if (!el) return;

      if (reduce) {
        gsap.set(el, { opacity: 1 }); // estado final directo, sin desplazamiento
        return;
      }

      const split = new SplitText(el, { type: "words" });
      // Máscara: el contenedor recorta; las palabras suben desde abajo.
      gsap.set(el, { overflow: "clip" });
      gsap.from(split.words, {
        yPercent: 100,        // ver 07_MOTION_SYSTEM.md
        duration: 0.9,
        ease: "power3.out",   // token de 07
        stagger: 0.07,        // token de 07
        scrollTrigger: { trigger: el, start: "top 85%" },
      });

      return () => split.revert(); // cleanup: restaura el DOM
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
```

**Reglas de motion en componentes:**
- Animar **solo `transform` y `opacity`** (nunca `top/left/width`) → sin reflow, 60fps.
- `useGSAP` con `scope` para cleanup automático; `SplitText` siempre con `revert()`.
- Rama `reduce` obligatoria: estado final directo, sin parallax ni desplazamientos grandes.
- Registrar plugins una sola vez por módulo.

---

## 6. Accesibilidad por componente (base)

- Un solo `<h1>` por página; jerarquía `h1→h2→h3` sin saltos.
- Elementos interactivos: `<button>` para acciones, `<a>` para navegación. Nunca `<div onClick>`.
- Foco visible siempre (`focus-visible:ring`), nunca `outline: none` sin reemplazo.
- Navegable por teclado; `Esc` cierra overlays; `role`/`aria-*` donde el HTML no alcanza.
- Imágenes con `alt` real (placeholder → `alt` con `TODO(contenido):`).
- Contraste AA (valores de color en [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md)).

Detalle WCAG completo en [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md).

---

## 7. Catálogo inicial de componentes base

### 7.1 `Container`
- **Responsabilidad:** ancho máximo y padding horizontal consistente. Sin estilo visual propio.
- **Props clave:** `size?: "default" | "wide" | "full"`, `as?`, `className`.
- **a11y/motion:** ninguna (es estructural).

```tsx
export function Container({ size = "default", className, children }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-6 md:px-10",
      size === "default" && "max-w-6xl",
      size === "wide" && "max-w-screen-2xl", className)}>
      {children}
    </div>
  );
}
```

### 7.2 `Section`
- **Responsabilidad:** landmark de sección con ritmo vertical (spacing de `06`) y `id` para anclas/nav.
- **Props clave:** `id`, `as?: "section" | "div"`, `spacing?`, `label?` (para `aria-label`).
- **a11y/motion:** renderiza `<section aria-labelledby>` cuando hay heading; no anima (los hijos animan).

### 7.3 `Heading` (con reveal)
- **Responsabilidad:** titular editorial con reveal por palabra opcional.
- **Props clave:** `level: 1|2|3`, `reveal?: boolean` (default `true`), `children`.
- **a11y/motion:** mapea `level`→`h1/h2/h3` (semántica ≠ tamaño). Si `reveal`, usa `RevealText` (§5) y respeta `prefers-reduced-motion`.

```tsx
import { RevealText } from "@/components/motion/RevealText";

export function Heading({ level, reveal = true, className, children }: HeadingProps) {
  const Tag = `h${level}` as const;
  if (!reveal) return <Tag className={className}>{children}</Tag>;
  return <RevealText as={Tag} className={className}>{children}</RevealText>;
}
```

### 7.4 `Link` (interno/externo)
- **Responsabilidad:** navegación. Usa `next/link` para rutas internas; `<a>` con `rel` para externas.
- **Props clave:** `href`, `external?`, `variant?`.
- **a11y/motion:** externos → `target="_blank" rel="noopener noreferrer"` + texto que indique salida cuando aplique (ej.: redes). El **checkout es interno** (Mercado Pago), no un enlace externo — ver [`10_TECH_STACK.md`](./10_TECH_STACK.md) §14.

```tsx
import NextLink from "next/link";

export function Link({ href, external, className, children }: LinkProps) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return <NextLink href={href} className={className}>{children}</NextLink>;
}
```

### 7.5 `ProductCard`
- **Responsabilidad:** ficha editorial de producto (foto, título, material, precio, CTA de compra).
- **Props clave:** `product: CommerceProduct` (contrato de [`10_TECH_STACK.md`](./10_TECH_STACK.md)).
- **a11y/motion:** el enlace envuelve el título (no toda la card como link redundante); precio con `Intl` es-AR; reveal de imagen con máscara/parallax sutil. Placeholder de precio: `$ —` (nunca inventar).

```tsx
import Image from "next/image";
import { Link } from "@/components/ui/Link";
import { formatPrice } from "@/lib/utils";
import type { CommerceProduct } from "@/lib/commerce/types";

export function ProductCard({ product }: { product: CommerceProduct }) {
  return (
    <article className="group flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-clip">
        <Image
          src={`/images/products/${product.slug}.jpg`}
          alt={`TODO(contenido): ${product.title}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <h3 className="font-display text-xl">
        <Link href={product.buyUrl} external className="focus-visible:ring-2">
          {product.title}
        </Link>
      </h3>
      <p className="text-sm uppercase tracking-wide opacity-70">{product.material}</p>
      <p className="font-body">{product.priceARS === null ? "$ —" : formatPrice(product.priceARS)}</p>
    </article>
  );
}
```

### 7.6 `EventCard`
- **Responsabilidad:** tarjeta de edición del Summit/Workshop (número de edición, sede, año, testimonio).
- **Props clave:** `edition: number`, `venue?`, `year?`, `href?`.
- **a11y/motion:** datos duros como placeholders (`Edición 0X`, sin fecha inventada); reveal on-scroll; foco en el enlace de "ver edición".

### 7.7 `Marquee`
- **Responsabilidad:** cinta horizontal en loop (sponsors, palabras clave de marca).
- **Props clave:** `speed?`, `direction?`, `children`.
- **a11y/motion:** **única excepción** donde `linear` está permitido ([`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)); duplicar contenido para loop seamless; `aria-hidden` en la copia duplicada; **pausar si `prefers-reduced-motion`**.

```tsx
"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";

export function Marquee({ children, speed = 30 }: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(ref.current, { xPercent: -50, ease: "none", duration: speed, repeat: -1 });
  }, { scope: ref });

  return (
    <div className="overflow-hidden">
      <div ref={ref} className="flex w-max gap-12">
        {children}
        <span aria-hidden>{children}</span>
      </div>
    </div>
  );
}
```

### 7.8 `Nav` / `MenuOverlay`
- **Responsabilidad:** navegación principal; overlay a pantalla completa en mobile/menu.
- **Props clave:** `items: NavItem[]`, `open`, `onClose`.
- **a11y/motion:** *focus trap* mientras está abierto; `Esc` cierra; `aria-expanded` en el botón; devolver el foco al disparador al cerrar; body scroll lock coordinado con Lenis; reveal escalonado de los items.

```tsx
"use client";
import { useEffect, useRef } from "react";

export function MenuOverlay({ open, onClose, items }: MenuOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    ref.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="Menú principal"
      hidden={!open} className="fixed inset-0 z-50 bg-ink text-bone">
      <nav>
        <ul>{items.map((it) => <li key={it.href}><a href={it.href}>{it.label}</a></li>)}</ul>
      </nav>
    </div>
  );
}
```

### 7.9 `Footer`
- **Responsabilidad:** landmark `<footer>` con navegación secundaria, redes, contacto, legal.
- **Props clave:** normalmente sin props (lee de `constants`/`content`).
- **a11y/motion:** `<footer>` como landmark, enlaces con texto claro, contraste AA; motion sutil (reveal), sin protagonismo.

---

## 8. Checklist antes de dar por hecho un componente

- [ ] Props tipadas, sin `any`; variantes con `cva` si hay más de un estilo.
- [ ] Server por defecto; `"use client"` solo si anima/interactúa, en la hoja.
- [ ] HTML semántico + foco visible + navegable por teclado.
- [ ] `alt` real (o `TODO(contenido):` en placeholder); datos duros nunca inventados.
- [ ] Motion con tokens de [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md), solo `transform`/`opacity`, con cleanup y rama `prefers-reduced-motion`.
- [ ] Clases mergeadas con `cn`; tokens de color/tipografía desde [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md), no hardcodeados.
- [ ] Digno de portfolio (*Quality Bar* de `CLAUDE.md`).
