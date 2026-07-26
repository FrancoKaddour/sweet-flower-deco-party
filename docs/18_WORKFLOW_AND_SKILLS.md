# 18 — Workflow, Skills y manejo de Agentes

Cómo trabajamos con Claude Code en este proyecto. La premisa: **operamos como una agencia de desarrollo web y soluciones digitales full-service** — la que le daría servicio a una cartera de +2M de clientes. Eso significa que cada disciplina (dirección, marketing, marca, UX, UI, motion, frontend, backend, e-commerce, QA, DevOps, seguridad, SEO, data, legal, finanzas) tiene su **rol**, sus **skills** y su forma de invocarse.

> Regla base (de [`CLAUDE.md`](./CLAUDE.md)): **contexto → diseño → código**. Skills y agentes son el equipo de esa agencia, no un atajo para saltear el proceso.

---

## 1. Principios de orquestación

1. **El agente principal es el dueño del contexto.** Es el único que leyó toda la biblia y la conversación. Cuando delega, **transfiere el contexto** (tokens, mood, decisiones) en el prompt: los subagentes arrancan “en frío”.
2. **Delegá para paralelizar o para no ensuciar el contexto.** Auditoría amplia, escribir varios docs, barrer el repo → subagentes. Un cambio de una línea → directo.
3. **Consistencia por diseño:** a todo agente que toque diseño/motion pasale los **tokens canónicos** ([`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md) y [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)) para que no invente valores.
4. **Verificá lo que devuelve un subagente.** Es un insumo, no la verdad. Revisá archivos, corré `code-review`, mirá el diff.
5. **Paralelo real:** agentes independientes → **un solo mensaje** con varias tool calls (corren concurrentes).
6. **Aislamiento en escrituras paralelas:** dos agentes editando código a la vez → `isolation: "worktree"`. Para leer/auditar no hace falta.

---

## 2. La “agencia” full-service: roles → skills → agente

Cada fila es un **departamento/rol** de la agencia. Usá la skill cuando la tarea matchea; usá el agente para ejecutar o paralelizar.

| # | Rol / Departamento | Responsabilidad en este proyecto | Skills | Agente |
|---|---|---|---|---|
| 01 | **Dirección / Estrategia (CEO)** | Visión de producto, prioridización, viabilidad, decisiones | `mvp-scoping` · `business-plan` · `competitor-analysis` · `metrics-review` · `architecture-review` | `Plan`, principal |
| 02 | **Finanzas** | Costos, proyecciones, pricing del evento/membresía | `financial-model` · `pitch-deck` | principal |
| 03 | **Project / Delivery** | Roadmap, fases, ADRs, seguimiento | — (usa [`15_ROADMAP.md`](./15_ROADMAP.md), [`16_DECISIONS.md`](./16_DECISIONS.md)) | `Plan` |
| 04 | **Marca / Creative Direction** | Voz, tono, posicionamiento “referente del país” | `content-strategy` · `copywriting` | principal |
| 05 | **Marketing** | Funnel, campañas, adquisición, prueba social | `marketing-audit` · `conversion-optimization` | `general-purpose` |
| 06 | **Growth** | Loops, referidos, escala | `growth-hacking` | `general-purpose` |
| 07 | **Social / Community** | Instagram/TikTok/LinkedIn, comunidad de alumnas | `social-media` (+ [`14_LINKEDIN_STRATEGY.md`](./14_LINKEDIN_STRATEGY.md)) | `general-purpose` |
| 08 | **Copywriting** | Copy real de hero, PDP, evento, CTAs, emails | `copywriting` | `general-purpose` |
| 09 | **UX / Product Design** | Flows, jerarquía, fricción, arquitectura de info | `ux-audit` · `mobile-design` · `accessibility-audit` | `general-purpose` |
| 10 | **UI / Visual Design** | Sistema visual, mockups, componentes | `frontend-design` (+ [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md), [`09_UI_PRINCIPLES.md`](./09_UI_PRINCIPLES.md)) | `general-purpose` |
| 11 | **Motion / Interaction** | GSAP: reveals, parallax, smooth scroll, transiciones | — (ver **§3 Stack GSAP** + [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)) | principal / `general-purpose` |
| 12 | **Frontend Engineering** | Next.js/React/TS/Tailwind, componentes, performance | `code-quality` · `code-review` · `project-clean` · `vercel:react-best-practices` · `vercel:nextjs` · `vercel:shadcn` | `general-purpose` |
| 13 | **Backend / API** | API routes, server actions, webhooks Mercado Pago | `api-design` · `backend-review` · `architecture-review` · `vercel:vercel-functions` | `general-purpose` |
| 14 | **E-commerce** | Catálogo, PDP, carrito, checkout MP (**desde 0**, ADR-007) | `conversion-optimization` · `api-design` · `db-review` | `general-purpose` |
| 15 | **Data / Base de datos** | Modelado productos/stock/pedidos, queries, storage | `db-review` · `vercel:vercel-storage` | `general-purpose` |
| 16 | **Auth / Membresía** | Login, sesiones, roles, protección de rutas | `auth-review` · `vercel:auth` | `general-purpose` |
| 17 | **QA / Testing** | Flujos, screenshots, cross-browser, iOS | `playwright` · `agent-browser` · `verify` · `cross-browser-compat` · `ios-debug` | `general-purpose` |
| 18 | **DevOps / Platform** | CI/CD, envs, deploy, previews | `devops-audit` · `vercel:deploy` · `vercel:env` · `vercel:deployments-cicd` | `vercel:deployment-expert` |
| 19 | **SRE / Observabilidad** | Errores, logs, alertas, uptime | `monitoring-setup` | `general-purpose` |
| 20 | **Seguridad** | XSS/CSRF/CSP, OWASP, deps, pagos | `security-audit` · `owasp-hardening` · `dependency-audit` | `general-purpose` |
| 21 | **Performance** | Core Web Vitals, bundle, imágenes, animaciones | `performance-audit` · `vercel:cdn-caching` | `vercel:performance-optimizer` |
| 22 | **SEO / SEM** | Metadata, JSON-LD, sitemap, keywords, autoridad | `seo-audit` (+ [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md)) | `general-purpose` |
| 23 | **Analytics / BI** | KPIs, métricas de negocio, tracking | `metrics-review` · `monitoring-setup` | `general-purpose` |
| 24 | **Legal / Compliance** | Términos, privacidad, cookies (AR/LATAM) | `legal-review` | `general-purpose` |
| 25 | **AI / Innovación** | Asistente/recomendador (si se decide sumarlo) | `ai-integration` · `vercel:ai-sdk` | `vercel:ai-architect` |

> **Skills reales solamente.** Si un nombre no está en la lista disponible de la sesión, **no existe** — no lo inventes.

---

## 3. Stack de MOTION — GSAP (obligatorio, no opcional)

El movimiento es parte del producto, no un adorno. **No hay skill de GSAP**: es stack, y se gobierna desde [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md). Todo agente que toque animación **debe** usar exactamente esto:

- **GSAP** (core) — motor de animación.
- **ScrollTrigger** — animaciones ligadas al scroll (reveals al entrar, parallax).
- **SplitText** — partir titulares en palabras para el **mask-reveal** (`yPercent: 100 → 0`, `power3.out`, `stagger ~0.07`, máscara con `overflow: clip`).
- **Lenis** — smooth scroll (scroll “con peso”), integrado con ScrollTrigger vía rAF.
- (Opcionales según necesidad) **Flip** para transiciones de layout, **Observer** para gestos.

Reglas duras (de [`CLAUDE.md`](./CLAUDE.md) §5 y [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)):
- **GSAP y todos sus plugins son 100% gratuitos** (Webflow los liberó, incluido SplitText). No hay excusa de licencia para no usarlos.
- Registrar plugins **una sola vez** (client component). Animar solo `transform`/`opacity`.
- Limpiar siempre con `gsap.context()` / `useGSAP` en React (evitar leaks en el App Router).
- **`prefers-reduced-motion` obligatorio:** sin parallax ni desplazamientos grandes; estado final o micro-fade.
- Easings canónicos: `power3.out` (reveals), `power2.inOut` (transiciones), `"none"` (parallax/marquee). **Nunca `linear`** salvo marquees.

---

## 4. Tipos de agente (cuándo usar cada uno)

| Agente | Para qué |
|---|---|
| **Explore** | Búsqueda read-only amplia (barrer archivos, encontrar dónde vive algo). Barato. |
| **Plan** | Diseñar un plan de implementación antes de codear (catálogo, PDP, checkout). |
| **general-purpose** | Tareas multi-paso: escribir/editar, construir secciones, refactors, auditorías que producen cambios. |
| **vercel:performance-optimizer** | Core Web Vitals, rendering, imágenes, bundle. |
| **vercel:deployment-expert** | Deploy, previews, envs, CI/CD. |
| **vercel:ai-architect** | Features de IA (solo si se suma un asistente/recomendador). |

Para **auditar/buscar** → `Explore`. Para **producir cambios** → `general-purpose`. Para **pensar arquitectura** → `Plan`.

---

## 5. Skills por fase (vista temporal del roadmap)

- **Fase 1–2 (boceto + contenido):** `frontend-design`, `ux-audit`, `mobile-design`, `accessibility-audit`, `copywriting`, `content-strategy`. + Stack GSAP.
- **Fase 3 (e-commerce propio + inscripción + membresía):** `architecture-review`, `api-design`, `backend-review`, `db-review`, `auth-review`, `conversion-optimization`.
- **Fase 4 (hardening/SEO/perf/DevOps):** `performance-audit`, `seo-audit`, `security-audit`, `owasp-hardening`, `dependency-audit`, `cross-browser-compat`, `ios-debug`, `devops-audit`, `monitoring-setup`, `legal-review`.
- **Fase 5 (lanzamiento):** `vercel:deploy`, `metrics-review`, `social-media`, + verificación final.
- **Transversal (cada PR):** `code-quality`, `code-review`, `project-clean`, `verify`.

---

## 6. Recetas de orquestación

**A. Construir una sección nueva de la Home**
1. `Plan` (o razonamiento propio) → intención narrativa + motion.
2. Codear (principal / `general-purpose`) con tokens canónicos + Stack GSAP.
3. `accessibility-audit` + `mobile-design`.
4. `code-review` del diff → ajustar → cerrar.

**B. Auditoría amplia del repo** → un solo `Explore` (“medium” o “very thorough”).

**C. Trabajo en paralelo** → varios `general-purpose` en un mismo mensaje, cada uno con contexto compartido + tokens + su tarea. Si editan código a la vez → `isolation: "worktree"`.

**D. Pre-deploy a producción (Fase 4/5)** → en paralelo: `performance-audit`, `seo-audit`, `security-audit`, `accessibility-audit`, `dependency-audit`. Consolidar → priorizar → corregir → `code-review` → `vercel:deploy`.

---

## 7. Orquestación pesada (multi-agente / “ultracode”)

Para tareas grandes con verificación adversarial (auditoría integral pre-lanzamiento, revisión exhaustiva de la Fase 3 con pagos) existe la orquestación por **Workflow** (fan-out de muchos agentes + verificación).

- **Costosa en tokens; solo con opt-in explícito.** No se dispara “por las dudas”.
- Se pide con “usá un workflow” / “ultracode”, o `/code-review ultra` para review multi-agente en la nube.
- Review pesado de PRs: `comprehensive-review` / `zen-comprehensive-review` — **caros**, solo si se piden.

---

## 8. Reglas de oro

- **No arranques por código.** Contexto → diseño → código.
- **GSAP + ScrollTrigger + SplitText + Lenis** son obligatorios para motion; `prefers-reduced-motion` siempre.
- **Pasá los tokens canónicos** a todo subagente que toque diseño o motion.
- **Verificá** lo que devuelve un subagente; `code-review` en cada diff.
- **Paralelizá** en un solo mensaje; **aislá con worktree** si editan a la vez.
- **`accessibility-audit`, `performance-audit`, `seo-audit`** son parte del *Definition of Done*.
- **Skills reales solamente.**
