---
name: performance-audit
description: Auditoría de performance web para proyectos Next.js/React. Analiza Lighthouse scores, Core Web Vitals, bundle size, imágenes, lazy loading, caching, Server/Client Components, fuentes web, y estrategias de optimización. Úsalo cuando el usuario quiera mejorar la velocidad del sitio, optimizar el bundle, mejorar los Core Web Vitals, reducir el tiempo de carga, optimizar imágenes, revisar el uso de Server vs Client Components, o cuando mencione "lento", "carga lenta", "Lighthouse", "performance", "bundle grande", "optimizar velocidad", "Core Web Vitals", "LCP", "CLS", o "FID".
---

# Performance Audit — Next.js / React

Sos un experto en performance web con foco en Next.js. Tu objetivo es identificar y resolver cuellos de botella que afectan la velocidad, los Core Web Vitals, y la experiencia del usuario.

## Proceso de auditoría

### 1. Relevamiento inicial
- Revisá `next.config.js/ts` para configuraciones de optimización
- Identificá el uso de `'use client'` vs Server Components
- Buscá imágenes (`<img>` vs `next/image`), fuentes, y scripts de terceros
- Chequeá si hay bundle analyzer configurado
- Identificá fetch de datos: dónde, cómo, y con qué estrategia de caché

### 2. Checklist de Performance

#### Core Web Vitals — objetivos
| Métrica | Bueno | Necesita mejora | Malo |
|---------|-------|-----------------|------|
| LCP (Largest Contentful Paint) | < 2.5s | 2.5s–4s | > 4s |
| INP (Interaction to Next Paint) | < 200ms | 200–500ms | > 500ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1–0.25 | > 0.25 |
| FCP (First Contentful Paint) | < 1.8s | 1.8s–3s | > 3s |
| TTFB (Time to First Byte) | < 800ms | 800ms–1.8s | > 1.8s |

#### Imágenes (mayor impacto en LCP)
- [ ] Todas las imágenes usan `next/image` (optimización automática, WebP/AVIF)
- [ ] Imagen hero con `priority={true}` (evita lazy load en LCP)
- [ ] `sizes` prop correcto para responsive images
- [ ] `width` y `height` definidos para evitar CLS
- [ ] Imágenes en formato moderno (WebP/AVIF vs JPG/PNG)
- [ ] No hay imágenes oversized (subir 800px para mostrar en 200px)

```tsx
// ✅ Imagen optimizada
<Image
  src="/hero.jpg"
  alt="Tortas artesanales"
  width={1200}
  height={600}
  priority  // ← LCP image: no lazy load
  sizes="(max-width: 768px) 100vw, 50vw"
  className="w-full h-auto"
/>

// ❌ Sin optimizar
<img src="/hero.jpg" alt="..." style={{ width: '100%' }} />
```

#### Server vs Client Components
- [ ] Minimizar `'use client'` — solo donde se necesita interactividad
- [ ] No usar Client Components para mostrar datos estáticos
- [ ] Fetch de datos en Server Components (no useEffect en cliente)
- [ ] Pasar datos como props a Client Components, no fetchear en cliente

```tsx
// ✅ Server Component — fetch directo, sin bundle JS
async function ProductList() {
  const products = await fetch('...', { next: { revalidate: 3600 } }).then(r => r.json())
  return <ul>{products.map(p => <ProductCard key={p.id} product={p} />)}</ul>
}

// ❌ Client Component innecesario
'use client'
function ProductList() {
  const [products, setProducts] = useState([])
  useEffect(() => { fetch('...').then(r => r.json()).then(setProducts) }, [])
  return <ul>...</ul>
}
```

#### Bundle size
- [ ] Analizar con `ANALYZE=true npm run build` (si `@next/bundle-analyzer` está instalado)
- [ ] Imports con barrel files optimizados (no importar lodash completo)
- [ ] Dynamic imports para componentes grandes y rutas secundarias
- [ ] Tree-shaking funcionando (imports named, no default de librerías grandes)

```tsx
// ✅ Dynamic import para componentes pesados
const HeavyChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <p>Cargando...</p>,
  ssr: false
})

// ✅ Import específico (no el paquete completo)
import { format } from 'date-fns'  // ✓
import _ from 'lodash'  // ✗ trae TODO lodash
```

#### Fuentes web
```tsx
// ✅ next/font — zero layout shift, sin requests extra
import { Inter, Playfair_Display } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap' })

// ❌ Google Fonts con <link> — bloquea render
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />
```

#### Caching y Data Fetching (Next.js App Router)
```typescript
// Estático — buildtime (máximo performance)
fetch(url, { cache: 'force-cache' })

// ISR — revalidar cada hora
fetch(url, { next: { revalidate: 3600 } })

// Dinámico — por request (necesario para datos personalizados)
fetch(url, { cache: 'no-store' })

// Revalidar por tag (on-demand)
fetch(url, { next: { tags: ['products'] } })
// → revalidateTag('products') cuando cambian los datos
```

#### Scripts de terceros
- [ ] Scripts externos con `next/script` y strategy adecuada
- [ ] Analytics con `strategy="afterInteractive"` (no bloqueante)
- [ ] Scripts no críticos con `strategy="lazyOnload"`
- [ ] No cargar scripts de terceros innecesarios

```tsx
<Script src="analytics.js" strategy="afterInteractive" />
<Script src="chat-widget.js" strategy="lazyOnload" />
```

#### CSS y estilos
- [ ] CSS no usado eliminado (PurgeCSS automático en Tailwind)
- [ ] No hay CSS inline extenso en componentes
- [ ] Tailwind `content` configurado correctamente para purging

#### Prefetching y navegación
- [ ] `<Link>` de Next.js (prefetch automático en viewport)
- [ ] `router.prefetch()` para rutas que el usuario probablemente visitará
- [ ] No bloquear navegación con operaciones síncronas pesadas

### 3. Quick wins — mayor impacto

1. Agregar `priority` a la imagen hero (mejora LCP inmediatamente)
2. Migrar `<img>` a `next/image` (WebP automático, lazy loading)
3. Mover fetch de datos de `useEffect` a Server Components
4. Agregar `next/font` para fuentes de Google
5. Revisar qué tiene `'use client'` innecesariamente

## Reporte de salida

```
## Performance Audit — [Fecha]

### Score Lighthouse estimado: [Performance X | Accessibility X | Best Practices X | SEO X]

### Core Web Vitals — problemas detectados
- LCP: [problema] → [solución]
- CLS: [problema] → [solución]
- INP: [problema] → [solución]

### Optimizaciones de alto impacto
- [archivo/componente] → [cambio] → [impacto estimado]

### Bundle y dependencias
- [análisis]

### Cambios inmediatos (quick wins)
[código listo para aplicar]
```
