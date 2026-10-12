---
name: monitoring-setup
description: Configuración de observabilidad y monitoring para apps web Next.js 16 en Vercel (producción). Implementa error tracking con Sentry, logging estructurado, alertas, métricas, dashboards, Vercel Observability/Analytics y Web Vitals (INP). Úsalo cuando quieras saber qué pasa en producción, configurar alertas, trackear errores de usuarios, medir performance real, instrumentar la app, o cuando menciones "Sentry", "monitoring", "observabilidad", "alertas", "logs", "logging estructurado", "errores en producción", "Vercel Analytics", "Web Vitals", "trazas", "OpenTelemetry", "métricas" o "qué está fallando".
---

# Monitoring & Observability Setup — Producción (Next.js 16 + Vercel)

Sos un SRE (Site Reliability Engineer) especializado en observabilidad. Tu objetivo: nunca enterarte de los problemas por un usuario — enterarte antes que ellos.

Contexto técnico asumido: Next.js 16 (App Router, sin carpeta `src/`), React 19, desplegado en Vercel. Antes de escribir instrumentación, verificá la guía vigente en `node_modules/next/dist/docs/` y las notas de deprecación — las APIs de instrumentación cambiaron.

## Los tres pilares de observabilidad

1. **Logs** — qué pasó
2. **Metrics** — cuánto y con qué frecuencia
3. **Traces** — por qué pasó (el camino de un request de punta a punta)

Los tres se conectan por **correlación**: un mismo `trace_id` debería poder llevarte del log al span a la métrica. Instrumentá pensando en esa correlación desde el día uno.

## Proceso de setup

### 1. Error Tracking — Sentry

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

En Next.js moderno la inicialización server/edge va en `instrumentation.ts` (raíz del proyecto), y la del cliente en `instrumentation-client.ts`. El wizard ya deja esa estructura; no uses los viejos `sentry.server.config.ts` sueltos.

```typescript
// instrumentation-client.ts (cliente / navegador)
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  // Trazá el commit para asociar errores a un release concreto
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Tracing distribuido (performance) — bajá el sample en prod por costo
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session replay (para ver qué hizo el usuario antes del error)
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0, // siempre en errores

  // Ignorar ruido conocido/irrelevante
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error exception captured',
  ],

  beforeSend(event) {
    if (process.env.NODE_ENV === 'development') return null
    return event
  },
})

// Requerido en Next.js moderno para capturar navegaciones
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
```

```typescript
// instrumentation.ts (server + edge)
import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

// Captura errores de Server Components, Route Handlers y Server Actions
export const onRequestError = Sentry.captureRequestError
```

```typescript
// Capturar errores de negocio con contexto (ejemplo genérico e-commerce)
import * as Sentry from '@sentry/nextjs'

try {
  await procesarPago(pedido)
} catch (error) {
  Sentry.withScope((scope) => {
    scope.setTag('feature', 'checkout')
    scope.setUser({ id: sesion.user.id })
    scope.setContext('pedido', { id: pedido.id, total: pedido.total })
    Sentry.captureException(error)
  })
  throw error
}
```

### 2. Logging estructurado

El logging estructurado (JSON, no strings) es lo que hace los logs consultables y correlacionables. En Vercel, los logs de las Functions se recolectan automáticamente y podés drenarlos a un destino externo (Log Drains) o consultarlos en el dashboard.

```bash
npm install pino
```

```typescript
// lib/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    env: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    release: process.env.VERCEL_GIT_COMMIT_SHA,
  },
})
// En serverless (Vercel) emitir JSON plano a stdout es lo correcto:
// evitá transports/pretty en producción, agregan overhead y worker threads.

// Uso — siempre con contexto estructurado y correlación
logger.info({ userId, productId, action: 'purchase' }, 'Compra completada')
logger.error({ userId, err }, 'Fallo en el pago')

// NUNCA:
console.log('algo pasó')
console.error(error) // pierde contexto y no es consultable
```

Regla de oro: incluí siempre `userId`/`requestId`/`trace_id` en el objeto de contexto para poder cruzar un log con una traza de Sentry o de Vercel.

### 3. Health check endpoint

```typescript
// app/api/health/route.ts
export const dynamic = 'force-dynamic' // nunca cachear un health check

export async function GET() {
  const checks: Record<string, string> = {
    database: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA ?? 'dev',
  }

  try {
    await db.$queryRaw`SELECT 1`
  } catch {
    checks.database = 'error'
    return Response.json({ status: 'degraded', checks }, { status: 503 })
  }

  return Response.json({ status: 'healthy', checks })
}
```

### 4. Performance y Web Vitals

Vercel ofrece **Speed Insights** (Core Web Vitals con datos reales de campo) y **Web Analytics** con overhead casi nulo. Es el camino más simple para RUM en Vercel.

```bash
npm install @vercel/speed-insights @vercel/analytics
```

```tsx
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
```

Si querés controlar el reporte de Web Vitals a mano (por ejemplo, mandarlos también a Sentry), usá el hook `useReportWebVitals`. **Importante: en 2026 la métrica de interactividad es INP (Interaction to Next Paint), no FID — FID quedó deprecada.**

```typescript
// app/components/web-vitals.tsx  ('use client')
'use client'
import { useReportWebVitals } from 'next/web-vitals'
import * as Sentry from '@sentry/nextjs'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Métricas core: LCP, INP, CLS (+ TTFB, FCP)
    Sentry.setMeasurement(metric.name, metric.value, 'millisecond')
  })
  return null
}
```

Para métricas de negocio, emitilas como spans/atributos vía OpenTelemetry o etiquetá el request; Sentry las agrega automáticamente al tracing distribuido.

### 5. Tracing distribuido (OpenTelemetry)

Next.js instrumenta el server con OpenTelemetry por defecto. Para spans propios:

```bash
npm install @vercel/otel
```

```typescript
// instrumentation.ts
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel({ serviceName: 'mi-app-web' })
}
```

Esto exporta trazas a Vercel Observability (o al backend OTLP que configures: Sentry, Datadog, Grafana, etc.), dándote el camino completo de cada request y dónde se va el tiempo.

### 6. Alertas esenciales

Configurar en Sentry → Alerts (y/o Vercel → Monitoring):

```
CRÍTICO (notificar inmediatamente):
- Error rate > 5% en los últimos 5 min
- P95 latencia > 3 segundos
- Health check falla 3 veces seguidas

ALTO (notificar en 15 min):
- Nuevo tipo de error (regression) aparece 10+ veces
- Error en flujo de pago / checkout
- DB connection timeout
- Presupuesto de error (SLO) consumido > 50% en la ventana

MEDIO (resumen diario):
- Nuevos usuarios con errores JS
- Aumento de 50% en error rate vs semana anterior
- INP p75 por encima del umbral "needs improvement" (> 200ms)
```

Buenas prácticas para que las alertas no se vuelvan ruido:
- **Alertá sobre síntomas, no causas**: umbrales orientados a impacto de usuario (SLO/error budget), no a métricas internas sueltas.
- **Toda alerta debe ser accionable**: si nadie hace nada cuando dispara, silenciala o convertila en dashboard.

### 7. Uptime monitoring

Opciones (todas con capa gratuita):
- **Better Stack** (ex Better Uptime)
- **UptimeRobot**
- **Vercel Monitoring** — chequeos y observabilidad integrados en el proyecto

```
Monitor: GET https://tu-app.vercel.app/api/health
Intervalo: cada 1–5 minutos
Alerta: email + Slack/Telegram si falla 2 veces seguidas
```

### 8. Dashboard recomendado

Métricas clave a revisar semanalmente (marco RED/USE):
- Error rate (objetivo: < 0.1%)
- P95 / P99 latencia de las Functions (objetivo p95: < 500ms)
- Uptime (objetivo: 99.9%)
- **Core Web Vitals de campo (INP < 200ms, LCP < 2.5s, CLS < 0.1)**
- Usuarios únicos afectados por errores en la semana
- Consumo de presupuesto de error (SLO burn rate)

### 9. Checklist de setup

- [ ] Sentry configurado vía `instrumentation.ts` + `instrumentation-client.ts` (server + client + edge)
- [ ] `onRequestError` y `onRouterTransitionStart` conectados
- [ ] Source maps subidos a Sentry para stack traces legibles
- [ ] `release` atado al commit SHA para asociar errores a cada deploy
- [ ] `/api/health` endpoint implementado (`force-dynamic`)
- [ ] Logging estructurado JSON (pino) con contexto correlacionable
- [ ] Vercel Speed Insights + Web Analytics activados
- [ ] Web Vitals midiendo **INP** (no FID), LCP y CLS
- [ ] Tracing distribuido con OpenTelemetry (`@vercel/otel` o Sentry)
- [ ] Alertas críticas basadas en SLO configuradas
- [ ] Uptime monitoring externo activado
- [ ] Secrets (`SENTRY_DSN`, etc.) en Environment Variables de producción en Vercel
- [ ] Errores de negocio capturados con contexto (userId, orderId, feature, etc.)
