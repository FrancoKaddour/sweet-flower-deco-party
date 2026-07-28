---
name: monitoring-setup
description: Configuración de observabilidad y monitoring para aplicaciones web en producción. Implementa error tracking con Sentry, logging estructurado, alertas, métricas de performance, y dashboards. Úsalo cuando quieras saber qué pasa en producción, configurar alertas, trackear errores de usuarios, medir performance real, o cuando menciones "Sentry", "monitoring", "alertas", "logs", "errores en producción", "observabilidad", "Datadog", o "qué está fallando".
---

# Monitoring & Observability Setup — Producción

Sos un SRE (Site Reliability Engineer) especializado en observabilidad. Tu objetivo: nunca enterarte de los problemas por un usuario — enterarte antes que ellos.

## Los tres pilares de observabilidad

1. **Logs** — qué pasó
2. **Metrics** — cuánto y con qué frecuencia
3. **Traces** — por qué pasó (el camino de un request)

## Proceso de setup

### 1. Error Tracking — Sentry

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session replay (para ver qué hizo el usuario antes del error)
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0, // siempre en errores
  
  // Ignorar errores conocidos/irrelevantes
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error exception captured',
  ],
  
  beforeSend(event) {
    // No enviar errores de desarrollo
    if (process.env.NODE_ENV === 'development') return null
    return event
  }
})
```

```typescript
// Capturar errores de negocio con contexto
import * as Sentry from '@sentry/nextjs'

try {
  await processPayment(order)
} catch (error) {
  Sentry.withScope((scope) => {
    scope.setTag('feature', 'checkout')
    scope.setUser({ id: session.user.id })
    scope.setExtra('orderId', order.id)
    scope.setExtra('amount', order.total)
    Sentry.captureException(error)
  })
  throw error
}
```

### 2. Logging estructurado

```bash
npm install pino pino-pretty
```

```typescript
// lib/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  // En producción: JSON para parseo
  // En desarrollo: pretty print
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
})

// Uso — siempre con contexto estructurado
logger.info({ userId, productId, action: 'purchase' }, 'Purchase completed')
logger.error({ userId, error: err.message, stack: err.stack }, 'Payment failed')

// NUNCA:
console.log('algo pasó')
console.error(error) // pierde contexto
```

### 3. Health check endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    database: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  }
  
  try {
    // Verificar DB
    await db.$queryRaw`SELECT 1`
  } catch {
    checks.database = 'error'
    return Response.json({ status: 'degraded', checks }, { status: 503 })
  }
  
  return Response.json({ status: 'healthy', checks })
}
```

### 4. Performance monitoring

```typescript
// Trackear métricas de negocio en Sentry
Sentry.metrics.increment('checkout.completed', 1, {
  tags: { paymentMethod: 'stripe' }
})

Sentry.metrics.timing('api.products.fetch', duration, {
  tags: { cached: String(wasCached) }
})

// Core Web Vitals automático con Sentry
// o manualmente:
export function reportWebVitals(metric: NextWebVitalsMetric) {
  Sentry.metrics.distribution(metric.name, metric.value, {
    unit: 'millisecond',
    tags: { page: window.location.pathname }
  })
}
```

### 5. Alertas esenciales

Configurar en Sentry → Alerts:

```
CRÍTICO (notificar inmediatamente):
- Error rate > 5% en los últimos 5 min
- P95 latencia > 3 segundos
- Health check falla 3 veces seguidas

ALTO (notificar en 15 min):
- Nuevo tipo de error aparece 10+ veces
- Error de pago registrado
- DB connection timeout

MEDIO (resumen diario):
- Nuevos usuarios con errores JS
- Aumento de 50% en error rate vs semana anterior
```

### 6. Uptime monitoring (gratis)

Opciones:
- **Better Uptime** (gratis hasta 10 monitores)
- **UptimeRobot** (gratis hasta 50 monitores)
- **Vercel** — ya monitorea automáticamente

```
Monitor: GET https://tu-app.vercel.app/api/health
Intervalo: cada 5 minutos
Alerta: email + Telegram si falla 2 veces seguidas
```

### 7. Dashboard recomendado

Métricas clave a revisar semanalmente:
- Error rate (objetivo: < 0.1%)
- P95 latencia (objetivo: < 500ms)
- Uptime (objetivo: 99.9%)
- Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Usuarios afectados por errores en la semana

### 8. Checklist de setup

- [ ] Sentry configurado (client + server + edge)
- [ ] Source maps subidos a Sentry para stack traces legibles
- [ ] `/api/health` endpoint implementado
- [ ] Logging estructurado (pino o winston)
- [ ] Alertas críticas configuradas en Sentry
- [ ] Uptime monitoring externo activado
- [ ] `SENTRY_DSN` en variables de entorno de producción
- [ ] Errores de negocio capturados con contexto (userId, orderId, etc.)
