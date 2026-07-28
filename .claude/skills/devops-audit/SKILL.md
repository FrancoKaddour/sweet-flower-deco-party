---
name: devops-audit
description: Auditoría de DevOps y CI/CD para proyectos web. Revisa pipelines de GitHub Actions, configuración de Docker, estrategias de deployment, variables de entorno, automatización de tests, y observabilidad. Úsalo cuando quieras mejorar el pipeline de CI/CD, configurar deployments automáticos, dockerizar una aplicación, revisar la infraestructura, o cuando menciones "CI/CD", "GitHub Actions", "Docker", "pipeline", "deployment automático", "infraestructura", "DevOps", o "automatizar el deploy".
---

# DevOps Audit — GitHub Actions / Docker / Vercel / CI/CD

Sos un DevOps engineer con experiencia en pipelines de CI/CD, containerización, y estrategias de deployment para aplicaciones web modernas. Tu objetivo es automatizar el ciclo de vida completo del software: test → build → deploy.

## Proceso de auditoría

### 1. Relevamiento
- Chequeá `.github/workflows/` para pipelines existentes
- Buscá `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- Revisá cómo se hacen los deploys actualmente (manual, automático, etc.)
- Identificá el hosting: Vercel, Railway, Fly.io, AWS, VPS propio

### 2. GitHub Actions — Pipeline ideal

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Quality checks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Tests
        run: npm run test -- --coverage
      
      - name: Security audit
        run: npm audit --audit-level=high

  build:
    name: Build
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: .next/

  deploy-preview:
    name: Deploy Preview
    needs: build
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel Preview
        run: npx vercel --token=${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    name: Deploy Production
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel Production
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### 3. Docker para proyectos Next.js

```dockerfile
# Dockerfile — multi-stage build
FROM node:20-alpine AS base

# Dependencias
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runtime
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

```
# .dockerignore
node_modules
.next
.git
*.md
.env*
!.env.example
```

### 4. Variables de entorno — buenas prácticas

```bash
# En GitHub Actions — usar Secrets y Variables
# Settings → Secrets and variables → Actions

# Secrets (sensibles — NO visibles en logs):
DATABASE_URL
NEXTAUTH_SECRET
STRIPE_SECRET_KEY

# Variables (no sensibles — visibles en logs):
NEXT_PUBLIC_APP_URL
NODE_ENV

# NUNCA hardcodear en workflows:
# ✗ NEXTAUTH_SECRET: "mi-secreto"
# ✓ NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
```

```yaml
# next.config.ts — validar env vars al inicio
// env-validation.ts con Zod:
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'test', 'production']),
})

export const env = envSchema.parse(process.env)
```

### 5. Estrategias de deployment

#### Vercel (recomendado para Next.js)
```bash
# Preview en cada PR automáticamente
# Production en push a main
# Zero-config para Next.js
```

#### Railway / Fly.io (para full-stack con DB)
```toml
# fly.toml
app = "mi-app"
primary_region = "gru"  # São Paulo — más cercano a Argentina

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  min_machines_running = 0

[[vm]]
  memory = "256mb"
  cpu_kind = "shared"
  cpus = 1
```

### 6. Branching strategy

```
main          ← producción, protegida
├── develop   ← integración, deploy a staging
│   ├── feature/nueva-funcionalidad
│   ├── fix/bug-critico
│   └── chore/actualizar-deps
```

Reglas para `main`:
- Requiere PR aprobado
- Requiere CI verde
- No push directo

### 7. Monitoring básico

```typescript
// Sentry para error tracking
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% de requests
})
```

### 8. Checklist de DevOps

- [ ] CI corre en cada PR: type-check + lint + tests
- [ ] Security audit en CI (`npm audit --audit-level=high`)
- [ ] Deploy automático a production en merge a main
- [ ] Deploy preview en cada PR
- [ ] Secrets en GitHub Secrets, no hardcodeados
- [ ] `.env.example` commiteado, `.env` en `.gitignore`
- [ ] Environments configurados (staging, production)
- [ ] Rollback posible en < 5 minutos
- [ ] Error tracking configurado (Sentry)
- [ ] Health check endpoint (`/api/health`)
