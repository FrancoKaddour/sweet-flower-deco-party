---
name: performance-audit
description: Auditoría de performance web para proyectos Next.js 16 (App Router) + React 19. Analiza Lighthouse, Core Web Vitals (LCP, INP, CLS), bundle size, imágenes, streaming/Suspense, lazy loading, caching moderno, Server/Client Components, y fuentes web. Úsalo cuando el sitio esté lento, cuando quieras optimizar el bundle, mejorar los Core Web Vitals, reducir el tiempo de carga, optimizar imágenes, revisar Server vs Client Components, o cuando menciones "lento", "carga lenta", "Lighthouse", "performance", "bundle grande", "optimizar velocidad", "Core Web Vitals", "LCP", "INP", o "CLS".
---

# Performance Audit — Next.js 16 / React 19

Sos un experto en performance web con foco en Next.js 16 (App Router) y React 19, con TypeScript estricto. Tu objetivo es identificar y resolver cuellos de botella que afectan la velocidad, los Core Web Vitals, y la experiencia del usuario.

> Next.js 16 introduce cambios respecto de versiones previas (caching, `next/image`, streaming). Antes de escribir código, verificá las convenciones vigentes en `node_modules/next/dist/docs/` y respetá los avisos de deprecación.

## Proceso de auditoría

### 1. Relevamiento inicial
- Revisá `next.config.ts` para configuraciones de optimización (imágenes, `optimizePackageImports`, etc.)
- Identificá el uso de `'use client'` vs Server Components (por defecto todo es Server Component)
- Buscá imágenes (`<img>` vs `next/image`), fuentes, y scripts de terceros
- Chequeá si hay bundle analyzer configurado
- Identificá fetch de datos: dónde, cómo, y con qué estrategia de caché
- Revisá si se aprovecha streaming con `<Suspense>` y `loading.tsx`

### 2. Checklist de Performance

#### Core Web Vitals — objetivos (2026)
| Métrica | Bueno | Necesita mejora | Malo |
|---------|-------|-----------------|------|
| LCP (Largest Contentful Paint) | < 2.5s | 2.5s–4s | > 4s |
| INP (Interaction to Next Paint) | < 200ms | 200–500ms | > 500ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1–0.25 | > 0.25 |
| FCP (First Contentful Paint) | < 1.8s | 1.8s–3s | > 3s |
| TTFB (Time to First Byte) | < 800ms | 800ms–1.8s | > 1.8s |

> **INP reemplazó a FID** como Core Web Vital oficial desde marzo de 2024. FID quedó deprecado: mide sólo el primer input, mientras que INP mide la latencia de **todas** las interacciones a lo largo de la sesión. Optimizar INP implica reducir JS en el cliente, evitar tareas largas en el main thread, y diferir trabajo no crítico.

#### Imágenes (mayor impacto en LCP)
- [ ] Todas las imágenes usan `next/image` (optimización automática, WebP/AVIF)
- [ ] Imagen hero con `priority` (evita lazy load en LCP)
- [ ] `sizes` prop correcto para responsive images
- [ ] `width` y `height` definidos para evitar CLS
- [ ] Imágenes en formato moderno (WebP/AVIF vs JPG/PNG)
- [ ] No hay imágenes oversized (subir 1600px para mostrar en 400px)
- [ ] `placeholder="blur"` en imágenes above-the-fold para percepción de velocidad

```tsx
// ✅ Imagen optimizada
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Producto destacado"
  width={1200}
  height={600}
  priority          // ← LCP image: no lazy load
  placeholder="blur"
  sizes="(max-width: 768px) 100vw, 50vw"
  className="w-full h-auto"
/>

// ❌ Sin optimizar: sin dimensiones (CLS), sin WebP/AVIF, sin lazy load
<img src="/hero.jpg" alt="..." style={{ width: '100%' }} />
```

#### Server vs Client Components (reducir JS al cliente)
- [ ] Minimizar `'use client'` — sólo donde hay interactividad real (estado, efectos, eventos)
- [ ] No usar Client Components para mostrar datos estáticos
- [ ] Fetch de datos en Server Components (no `useEffect` en cliente)
- [ ] Pasar datos como props a Client Components, no fetchear en cliente
- [ ] Empujar el `'use client'` a las hojas del árbol (islas de interactividad), no a la raíz

```tsx
// ✅ Server Component — fetch directo en el servidor, cero JS al cliente
async function ProductList() {
  const products: Product[] = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 },
  }).then((r) => r.json())

  return (
    <ul>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </ul>
  )
}

// ❌ Client Component innecesario: envía JS y hace waterfall en el cliente
'use client'
function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then(setProducts)
  }, [])
  return <ul>{/* ... */}</ul>
}
```

#### Streaming y Suspense (mejora TTFB percibido e INP)
- [ ] Usar `loading.tsx` por ruta para skeletons instantáneos
- [ ] Envolver secciones lentas en `<Suspense>` para no bloquear el shell
- [ ] Los datos rápidos se muestran de inmediato mientras los lentos hacen streaming

```tsx
// ✅ El shell se renderiza al instante; las reviews llegan por streaming
import { Suspense } from 'react'

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <>
      <ProductHeader id={params.id} />
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews id={params.id} />   {/* Server Component async y lento */}
      </Suspense>
    </>
  )
}
```

#### Bundle size
- [ ] Analizar con `ANALYZE=true npm run build` (si `@next/bundle-analyzer` está instalado)
- [ ] `optimizePackageImports` en `next.config.ts` para librerías con muchos exports (íconos, UI kits)
- [ ] Dynamic imports para componentes grandes y rutas secundarias
- [ ] Tree-shaking funcionando (imports named, no default de librerías grandes)
- [ ] Evitar librerías pesadas cuando la plataforma ya lo resuelve (ej: `Intl` nativo vs librerías de fechas)

```tsx
// ✅ Dynamic import para componentes pesados / no críticos
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // sólo si el componente depende del browser
})

// ✅ Import específico (no el paquete completo)
import { format } from 'date-fns'   // ✓ tree-shakeable
import * as _ from 'lodash'          // ✗ trae TODO lodash al bundle
```

```typescript
// next.config.ts — reduce el costo de imports "barrel" de librerías grandes
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
}

export default nextConfig
```

#### Fuentes web
```tsx
// ✅ next/font — zero layout shift, self-hosting automático, sin requests a Google
import { Inter, Poppins } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'], display: 'swap' })

// ❌ Google Fonts con <link> — request extra, bloquea render, provoca CLS
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />
```

#### Caching y Data Fetching (Next.js 16 App Router)
```typescript
// Estático — cacheado (máximo performance)
fetch(url, { cache: 'force-cache' })

// ISR — revalidar por tiempo (cada hora)
fetch(url, { next: { revalidate: 3600 } })

// Dinámico — por request (necesario para datos personalizados/frescos)
fetch(url, { cache: 'no-store' })

// Revalidación on-demand por tag
fetch(url, { next: { tags: ['products'] } })
// → revalidateTag('products') en un Server Action cuando cambian los datos
```

> En Next.js 16 el comportamiento de caché por defecto y las APIs de revalidación cambiaron respecto de versiones anteriores. No asumas defaults de memoria: confirmá en `node_modules/next/dist/docs/` antes de decidir la estrategia (`force-cache`, `revalidate`, tags, o segment config).

#### Scripts de terceros
- [ ] Scripts externos con `next/script` y strategy adecuada
- [ ] Analytics con `strategy="afterInteractive"` (no bloqueante)
- [ ] Scripts no críticos (chat, widgets) con `strategy="lazyOnload"`
- [ ] No cargar scripts de terceros innecesarios — cada uno suma trabajo al main thread (empeora INP)

```tsx
import Script from 'next/script'

<Script src="https://cdn.example.com/analytics.js" strategy="afterInteractive" />
<Script src="https://cdn.example.com/chat-widget.js" strategy="lazyOnload" />
```

#### Animaciones (proteger INP y CLS)
- [ ] Animar **sólo** `transform` y `opacity` (composited, no disparan layout/paint)
- [ ] Evitar animar `width`, `height`, `top`, `left`, `margin` (fuerzan reflow → jank)
- [ ] Usar `will-change` con moderación y sólo durante la animación
- [ ] Respetar `prefers-reduced-motion`

```tsx
// ✅ Composited — corre en el compositor, no bloquea el main thread
<div className="transition-transform duration-300 hover:-translate-y-1" />

// ❌ Dispara layout en cada frame → jank e INP peor
<div className="transition-all duration-300 hover:mt-[-4px] hover:w-[110%]" />
```

#### CSS y estilos
- [ ] CSS no usado eliminado (purge automático en Tailwind)
- [ ] No hay CSS inline extenso generado dinámicamente en render
- [ ] Contenido de Tailwind configurado correctamente para el purging

#### Prefetching y navegación
- [ ] `<Link>` de Next.js (prefetch automático de rutas en viewport)
- [ ] `router.prefetch()` para rutas que el usuario probablemente visitará
- [ ] No bloquear navegación con operaciones síncronas pesadas

### 3. Quick wins — mayor impacto

1. Agregar `priority` a la imagen hero (mejora LCP inmediatamente)
2. Migrar `<img>` a `next/image` (WebP/AVIF automático, lazy loading)
3. Mover fetch de datos de `useEffect` a Server Components (reduce JS y elimina waterfalls)
4. Envolver secciones lentas en `<Suspense>` + `loading.tsx` (mejor TTFB percibido)
5. Agregar `next/font` para fuentes de Google (elimina CLS y request extra)
6. Revisar qué tiene `'use client'` innecesariamente (menos JS al cliente → mejor INP)

## Reporte de salida

```
## Performance Audit — [Fecha]

### Score Lighthouse estimado: [Performance X | Accessibility X | Best Practices X | SEO X]

### Core Web Vitals — problemas detectados
- LCP: [problema] → [solución]
- INP: [problema] → [solución]
- CLS: [problema] → [solución]

### Optimizaciones de alto impacto
- [archivo/componente] → [cambio] → [impacto estimado]

### Bundle y dependencias
- [análisis: peso, dynamic imports, optimizePackageImports]

### Cambios inmediatos (quick wins)
[código listo para aplicar]
```
