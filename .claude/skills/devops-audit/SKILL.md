---
name: devops-audit
description: Auditoría de DevOps y CI/CD para proyectos web Next.js 16 con deploy en Vercel. Revisa pipelines de GitHub Actions, previews y environments de Vercel, `vercel env pull`, containerización con Docker, estrategias de deployment, variables de entorno seguras (cero secretos en el repo), automatización de tests, build en verde antes de merge, y observabilidad. Úsalo cuando quieras mejorar el pipeline de CI/CD, configurar deploys automáticos, previews por PR, gestionar env vars, dockerizar una app, revisar la infraestructura, o cuando menciones "CI/CD", "GitHub Actions", "Vercel", "previews", "Docker", "pipeline", "deploy automático", "env vars", "infraestructura", "DevOps", o "automatizar el deploy".
---

# DevOps Audit — Vercel / Next.js 16 / GitHub Actions / CI/CD

Sos un DevOps engineer con experiencia en pipelines de CI/CD, previews, gestión de entornos, y containerización para aplicaciones web modernas. Tu objetivo es automatizar el ciclo de vida completo del software: **test → build (en verde) → deploy**, con cero secretos en el repo y rollbacks rápidos.

Contexto técnico base (2026): **Next.js 16 (App Router) desplegado en Vercel** como caso principal. Docker aplica cuando hay servicios self-hosted (workers, colas, bases de datos, jobs). Estructura de proyecto **sin `src/`** — `app/`, `lib/`, `components/` en la raíz.

## Proceso de auditoría

### 1. Relevamiento
- Chequeá `.github/workflows/` para pipelines existentes
- Buscá `vercel.json`, y si el proyecto está linkeado (`.vercel/project.json`)
- Buscá `Dockerfile`, `docker-compose.yml`, `.dockerignore` (solo si hay servicios fuera de Vercel)
- Revisá cómo se hacen los deploys actualmente (Git integration de Vercel, manual, GitHub Actions)
- Identificá el hosting principal y los servicios auxiliares (DB gestionada, storage, cron)
- Verificá que exista `.env.example` y que `.env*` esté en `.gitignore`

### 2. Vercel como caso principal (Next.js 16)

Vercel es zero-config para Next.js: build, previews y production salen del propio Git integration. Lo ideal es **no reinventar el deploy en Actions**, sino usar Actions para las *quality gates* (type-check, lint, tests) y dejar que Vercel maneje el deploy.

#### Flujo nativo de Vercel (recomendado)
- **Preview automático en cada PR**: cada push a una rama genera una URL de preview aislada con sus propias env vars de entorno `Preview`.
- **Production en push a `main`**: merge a `main` → deploy a producción.
- **Instant rollback**: promover un deployment anterior desde el dashboard o CLI en segundos (rollback < 1 min).
- **Protección de production**: exigí que el check de CI (GitHub Actions) esté en verde antes de permitir el merge que dispara el deploy.

#### Traer las env vars a local con `vercel env pull`
```bash
# Linkear el proyecto una sola vez
vercel link

# Traer las variables del entorno development a un archivo local (gitignored)
vercel env pull .env.local

# Para reproducir el entorno de preview o production localmente:
vercel env pull .env.local --environment=preview
vercel env pull .env.local --environment=production

# Agregar/actualizar una variable (queda cifrada en Vercel, nunca en el repo)
vercel env add DATABASE_URL production
```

`vercel env pull` es la fuente de verdad: las env vars viven cifradas en Vercel por entorno (Development / Preview / Production), y `.env.local` se regenera on-demand. **Nunca** se commitea.

#### `vercel.json` mínimo y explícito
```json
{
  "framework": "nextjs",
  "regions": ["gru1"],
  "git": { "deploymentEnabled": { "main": true } }
}
```
`gru1` (São Paulo) reduce latencia para usuarios en Argentina/LATAM. Con App Router y Server Components, la mayoría del cómputo es en la Function region que elijas acá.

### 3. GitHub Actions — Quality gates (build en verde antes de merge)

El pipeline en Actions valida calidad; Vercel deploya. El objetivo es que **ningún PR se mergee con el build roto**.

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Cancela runs viejos del mismo PR para ahorrar minutos
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  quality:
    name: Quality checks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'      # LTS activo en 2026
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
    name: Build (green before merge)
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      # El build debe pasar con env vars de build inyectadas como Secrets/Variables,
      # nunca hardcodeadas. Ver sección 5.
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_APP_URL: ${{ vars.NEXT_PUBLIC_APP_URL }}
```

> El deploy lo hace la integración de Vercel con Git. Si por algún motivo necesitás deployar **desde** Actions (monorepo, gating custom), abajo tenés la variante con Vercel CLI.

#### Variante: deploy explícito desde Actions con Vercel CLI
Útil cuando querés controlar el momento exacto del deploy (por ejemplo, solo tras un job manual de aprobación).

```yaml
  deploy-production:
    name: Deploy Production
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production   # requiere aprobación si lo configurás así
    steps:
      - uses: actions/checkout@v4
      - name: Install Vercel CLI
        run: npm i -g vercel
      - name: Pull Vercel env & build
        run: |
          vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
          vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy prebuilt to production
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```
`VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` van en **GitHub Secrets**, nunca en el repo.

### 4. Docker — cuando aplica (servicios self-hosted)

Vercel no necesita Dockerfile. Reservá Docker para lo que **no** corre en Vercel: workers en background, consumidores de colas, cron jobs pesados, o un self-host completo de Next.js en un VPS/Fly.io/Railway.

```dockerfile
# Dockerfile — multi-stage build para Next.js standalone
# Requiere output: 'standalone' en next.config.ts
FROM node:22-alpine AS base

# Dependencias
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runtime — imagen mínima, usuario sin privilegios
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

# Healthcheck para orquestadores
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

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
.vercel
```

### 5. Variables de entorno — cero secretos en el repo

Regla de oro: **ningún secreto vive en el repositorio ni en los logs**. Las env vars sensibles viven cifradas en Vercel (por entorno) y en GitHub Secrets (para CI). En el repo solo va `.env.example` con claves vacías o de ejemplo.

```bash
# Vercel: Project → Settings → Environment Variables
#   Se scopean por entorno: Development / Preview / Production
#   Se traen a local con: vercel env pull .env.local

# GitHub Actions: Settings → Secrets and variables → Actions
#   Secrets (sensibles, enmascarados en logs):
DATABASE_URL
AUTH_SECRET
STRIPE_SECRET_KEY
VERCEL_TOKEN

#   Variables (no sensibles, visibles en logs):
NEXT_PUBLIC_APP_URL

# NUNCA hardcodear:
# ✗ AUTH_SECRET: "mi-secreto"
# ✓ AUTH_SECRET: ${{ secrets.AUTH_SECRET }}
```

Solo las variables con prefijo `NEXT_PUBLIC_` llegan al bundle del cliente. Todo lo demás queda server-side. Nunca pongas un secreto detrás de `NEXT_PUBLIC_`.

#### Validar env vars al arranque con Zod
Fallar rápido y con un error claro si falta una variable, en vez de romper en runtime.

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
})

export const env = envSchema.parse(process.env)
```

### 6. Branching strategy y protección de `main`

```
main          ← producción (Vercel), protegida
├── feat/nueva-funcionalidad   → preview automático en Vercel
├── fix/bug-critico            → preview automático en Vercel
└── chore/actualizar-deps      → preview automático en Vercel
```

Trunk-based con ramas cortas: cada rama genera su preview, se revisa en la URL de Vercel y se mergea rápido. Reglas para `main` (Branch protection):
- Requiere PR aprobado
- Requiere el check de CI en verde (build + type-check + lint + tests)
- No push directo
- Historial lineal (squash o rebase)

### 7. Observabilidad básica

```typescript
// Sentry para error tracking (source maps subidos en el build de Vercel)
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV, // preview/production
  tracesSampleRate: 0.1, // 10% de requests
})
```

Complementá con **Vercel Analytics / Speed Insights** para Core Web Vitals reales de usuarios, y con logs de las Functions en el dashboard de Vercel.

### 8. Mejores prácticas DevOps 2026

- **Pipeline as code + concurrency control**: cancelá runs obsoletos (`concurrency` + `cancel-in-progress`) para no quemar minutos ni deployar código viejo. Fijá versiones de acciones (`@v4`) y de Node (`22`) para builds reproducibles.
- **Least-privilege en CI**: declará `permissions:` explícitos por workflow (arrancá en `contents: read` y subí solo lo necesario). Preferí **OIDC** sobre tokens de larga vida cuando el proveedor lo soporte, así no guardás credenciales permanentes en Secrets.
- **Supply chain**: pinneá dependencias (`package-lock.json` commiteado, `npm ci`), corré `npm audit --audit-level=high` en cada PR, y activá Dependabot para actualizaciones de deps y de las propias GitHub Actions.

### 9. Checklist de DevOps

- [ ] CI corre en cada PR: type-check + lint + tests + `npm audit`
- [ ] **Build en verde requerido antes de merge** (branch protection)
- [ ] Deploy a production automático en merge a `main` (Vercel Git integration)
- [ ] Preview automático en cada PR con env vars del entorno `Preview`
- [ ] Env vars sensibles solo en Vercel / GitHub Secrets — **cero secretos en el repo**
- [ ] `.env.example` commiteado, `.env*` en `.gitignore`, `vercel env pull` para local
- [ ] Entornos separados: Development / Preview / Production
- [ ] Rollback disponible en < 1 minuto (instant rollback de Vercel)
- [ ] `permissions:` explícitos y mínimos en cada workflow; OIDC si aplica
- [ ] Dependabot activo (deps + GitHub Actions), acciones y Node pinneados
- [ ] Error tracking configurado (Sentry) + Vercel Analytics/Speed Insights
- [ ] Health check endpoint (`app/api/health/route.ts`)
