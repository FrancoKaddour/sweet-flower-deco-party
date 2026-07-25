# 18 — Workflow, Skills y manejo de Agentes

Cómo trabajamos con Claude Code en este proyecto: **qué skills** invocar en cada situación y **cómo orquestar los agentes** (subagentes) sin perder calidad ni coherencia.

> Regla base (de [`CLAUDE.md`](./CLAUDE.md)): **contexto → diseño → código**. Las skills y los agentes son herramientas al servicio de eso, no atajos para saltearlo.

---

## 1. Principios de orquestación

1. **El agente principal es el dueño del contexto.** Es el único que leyó toda la biblia y la conversación. Cuando delega, **debe transferir el contexto** (tokens, mood, decisiones) en el prompt del subagente: los subagentes arrancan “en frío”.
2. **Delegá para paralelizar o para no ensuciar el contexto**, no por deporte. Una búsqueda amplia, una auditoría, o escribir 5 documentos a la vez → subagentes. Un cambio de una línea → hacelo directo.
3. **Consistencia por diseño:** cuando varios agentes trabajan en paralelo, pasales los **mismos tokens canónicos** (colores de [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md), easings de [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)) para que no inventen valores distintos.
4. **Verificá lo que devuelve un subagente.** Su resultado es un insumo, no la verdad. Revisá archivos, corré la skill de review, mirá el diff.
5. **Paralelo real:** si lanzás varios agentes independientes, mandalos en **un solo mensaje** con varias tool calls (corren concurrentes).
6. **Aislamiento en escrituras paralelas:** si dos agentes van a **editar código a la vez**, usá `isolation: "worktree"` para evitar conflictos. Para lectura/auditoría no hace falta.

---

## 2. Tipos de agente (cuándo usar cada uno)

| Agente | Para qué | Cuándo en este proyecto |
|---|---|---|
| **Explore** | Búsqueda read-only amplia (barrer archivos, encontrar dónde vive algo) | “¿Dónde se define el token de color X?”, “¿qué componentes usan Marquee?” |
| **Plan** | Diseñar un plan de implementación antes de codear | Antes de armar el catálogo/PDP o el checkout (Fase 3) |
| **general-purpose** | Tareas multi-paso, escribir/editar, research complejo | Escribir docs, construir una sección completa, refactors grandes |
| **vercel:performance-optimizer** | Core Web Vitals, rendering, imágenes, bundle | Auditar performance del hero/animaciones antes de lanzar |
| **vercel:deployment-expert** | Deploy, previews, env vars, CI/CD | Fase 4/5, configurar Vercel |
| **vercel:ai-architect** | Features de IA (si sumamos chatbot/asistente) | Solo si aparece un requerimiento de IA |

> **Regla:** para auditar/buscar preferí **Explore** (read-only, barato). Para producir cambios, **general-purpose**. Para pensar arquitectura, **Plan**.

---

## 3. Skills por fase del proyecto

Las skills se invocan con `/<nombre>` o cuando el pedido matchea su descripción. **No inventes skills**: usá solo las de la lista disponible. Abajo, las relevantes para este proyecto, agrupadas por fase de [`15_ROADMAP.md`](./15_ROADMAP.md).

### Fase 1–2 · Diseño, boceto y contenido
| Skill | Uso en el proyecto |
|---|---|
| `frontend-design` | Generar mockups/páginas HTML de secciones antes de codearlas en React |
| `ux-audit` | Revisar user flows, fricción, jerarquía (contra [`08_UX_PRINCIPLES.md`](./08_UX_PRINCIPLES.md)) |
| `mobile-design` | Auditar responsive/touch/breakpoints mobile-first |
| `copywriting` | Redactar copy real de hero, PDP, evento, CTAs cuando llegue el contenido |
| `content-strategy` | Refinar pilares y calendario de contenido/blog |
| `accessibility-audit` | WCAG 2.1: contraste, ARIA, teclado, foco (obligatorio antes de cerrar secciones) |

### Fase 3 · E-commerce propio (desde 0) + inscripción
| Skill | Uso en el proyecto |
|---|---|
| `architecture-review` | Validar la arquitectura del catálogo/carrito/checkout |
| `api-design` | Contratos de API para productos, carrito, checkout, webhooks de Mercado Pago |
| `backend-review` | Revisar API routes / server actions (validación, errores, MP webhooks) |
| `db-review` | Modelado de productos, stock, pedidos; queries e índices |
| `auth-review` | Login/membresía, sesiones, protección de rutas (Fase 3/4) |
| `conversion-optimization` | Optimizar funnel de compra, PDP, checkout, carrito abandonado |

### Fase 4 · Hardening, SEO, performance, DevOps
| Skill | Uso en el proyecto |
|---|---|
| `performance-audit` | Core Web Vitals, bundle, imágenes, Server vs Client Components, animaciones |
| `seo-audit` | Metadata, OG, JSON-LD, sitemap, canonical (contra [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md)) |
| `security-audit` | XSS, CSRF, CSP, CORS, cookies, exposición de datos |
| `owasp-hardening` | Blindaje OWASP Top 10 antes de manejar pagos/datos reales |
| `dependency-audit` | CVEs y dependencias antes de producción |
| `cross-browser-compat` / `ios-debug` | Que el motion y el layout no rompan en Safari/iOS |
| `devops-audit` | CI/CD, envs, Docker si aplica |
| `monitoring-setup` | Sentry/logs/alertas para producción |
| `legal-review` | Términos, privacidad, cookies (AR/LATAM) antes de captar datos/pagos |

### Transversal · Calidad de código (en cada PR)
| Skill | Uso en el proyecto |
|---|---|
| `code-quality` | SOLID/DRY, naming, code smells, estructura de componentes |
| `project-clean` | Limpiar imports/código muerto/console.logs antes de un hito |
| `code-review` | **Review de cada diff** antes de dar por hecho un cambio |
| `verify` | Correr la app y confirmar que un cambio hace lo que dice |
| `playwright` / `agent-browser` | Testing de flujos, screenshots, QA visual del motion |

### Negocio / marketing (apoyo a la biblia)
`marketing-audit` · `social-media` · `competitor-analysis` · `metrics-review` · `mvp-scoping` — para refinar [`01_BUSINESS.md`](./01_BUSINESS.md), [`14_LINKEDIN_STRATEGY.md`](./14_LINKEDIN_STRATEGY.md) y priorización. `business-plan`, `financial-model`, `pitch-deck`, `growth-hacking` quedan como opcionales según lo pida Flor.

---

## 4. Recetas de orquestación para este proyecto

**A. Construir una sección nueva de la Home**
1. `Plan` (o razonamiento propio) → intención narrativa + motion de la sección.
2. Codear (agente principal o `general-purpose`).
3. `accessibility-audit` + `mobile-design` sobre la sección.
4. `code-review` del diff. Ajustar. Cerrar.

**B. Auditoría amplia (buscar algo en todo el repo)**
- Un solo `Explore` con instrucción de amplitud (“medium” o “very thorough”). No barrás vos archivo por archivo.

**C. Trabajo en paralelo sobre varias secciones/docs**
- Varios `general-purpose` en **un mismo mensaje**, cada uno con: contexto compartido + tokens canónicos + su archivo/tarea específica. Si editan código a la vez → `isolation: "worktree"`.

**D. Antes de un deploy a producción (Fase 4/5)**
- En paralelo: `performance-audit`, `seo-audit`, `security-audit`, `accessibility-audit`, `dependency-audit`. Consolidar hallazgos, priorizar, corregir, `code-review`, deploy con `vercel:deploy`.

---

## 5. Orquestación pesada (multi-agente / “ultracode”)

Para tareas grandes (auditar todo el sitio con verificación adversarial, migraciones, revisión exhaustiva multi-dimensión) existe la orquestación por **Workflow** (fan-out de muchos agentes en paralelo con verificación).

- **Es costosa en tokens y solo se usa con opt-in explícito.** No la dispares “por las dudas”.
- Cuándo sí: auditoría integral pre-lanzamiento, o revisión exhaustiva de la Fase 3 (e-commerce + pagos) donde un error cuesta caro.
- Cómo pedirla: el usuario debe decir explícitamente “usá un workflow” / “ultracode”, o invocar `/code-review ultra` para review multi-agente en la nube.
- Para el review de PRs pesados existen además `comprehensive-review` / `zen-comprehensive-review` — **caras**, solo si se piden explícitamente.

---

## 6. Reglas de oro (resumen)

- **No arranques por código.** Contexto → diseño → código.
- **Pasá los tokens canónicos** a todo subagente que toque diseño o motion.
- **Verificá** lo que devuelve un subagente; corré `code-review` en cada diff.
- **Paralelizá** en un solo mensaje; **aislá con worktree** si editan a la vez.
- **`accessibility-audit`, `performance-audit` y `seo-audit`** son parte del *Definition of Done*, no un extra.
- **Skills reales solamente.** Si no está en la lista, no existe.
