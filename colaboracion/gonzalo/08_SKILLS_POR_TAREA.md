# 08 — Qué skill usar en cada tarea (tu chuleta)

Una **skill** es un "experto" que Claude Code carga para una tarea puntual: le da criterio profesional en algo concreto (revisar una base de datos, blindar la seguridad, diseñar una API…). No escribe por vos: **te sube el nivel** de lo que construís y te avisa lo que un principiante no ve.

> **Buena noticia:** las skills que necesitás **ya están en el repo**. Al clonar, Claude Code las detecta solas (viven en `.claude/skills/`). **No instalás nada.** Esta chuleta te dice *cuándo* usar cada una.

---

## Cómo se usa una skill

**En Claude Code (recomendado):**
- **Automático:** muchas veces se activan solas cuando tu pedido matchea (ej: si decís "revisá mi base de datos", entra `db-review`). Vos escribí natural.
- **A mano:** escribí `/` y el nombre. Ej: `/db-review`, `/security-audit`.

**En opencode:**
- opencode **no** lee `.claude/skills/` igual que Claude Code. Ahí la skill puede no aparecer sola. Solución simple: **para tareas con criterio (revisar API, base de datos, seguridad), usá Claude Code.** Dejá opencode para escribir/editar código común. Esta chuleta te sirve igual como guía de *qué mirar* en cada tarea.

> Regla de oro (no cambia): **contexto → diseño → código**. La skill es un copiloto experto, no un piloto automático. Vos seguís entendiendo lo que hacés y Franco revisa el PR.

---

## La chuleta: tarea → skill

Ordenada por tu [backlog](./03_BACKLOG.md). Usá la skill **antes de cerrar** la tarea (para revisar tu trabajo) o **al planear** (para que te guíe).

| Cuándo (tarea del backlog) | Skill | Para qué te sirve |
|---|---|---|
| **Antes de decidir arquitectura** (Tarea 0–2, dudas de "cómo estructuro esto") | `architecture-review` | Te dice si tu forma de organizar el backend escala o te vas a arrepentir. |
| **Al diseñar endpoints / la Local API** (Tarea 5, `lib/commerce`) | `api-design` | Cómo nombrar rutas, contratos, errores, versionado. Que tu API sea profesional. |
| **Al modelar la base de datos** (Tarea 2, colecciones) | `db-review` | Detecta queries N+1, índices que faltan, relaciones mal armadas, datos duplicados. |
| **Al revisar cualquier código de servidor** (Tareas 5–8, webhooks) | `backend-review` | Revisa estructura de endpoints, middleware, manejo de errores, validación. |
| **Al armar el login del panel** (Tarea 4, auth) | `auth-review` | Que las sesiones, rutas protegidas y roles estén bien. La puerta del panel no puede fallar. |
| **Antes de tocar pagos y antes de producción** (Fase 3 y 6) | `security-audit` | Revisa vulnerabilidades: inputs, datos sensibles, configuración. Clave para el checkout. |
| **Al blindar para producción** (Fase 6) | `owasp-hardening` | Protecciones concretas contra las 10 fallas más comunes (inyección, XSS, IDOR…). |
| **Al testear flujos críticos** (Fase 3 checkout/webhook, Fase 6) | `testing` | Tests unitarios/integración con Vitest + Testing Library. Probar checkout, Server Actions y webhooks de pago (verificación de firma + idempotencia). |
| **Antes de un deploy serio** (Fase 6) | `dependency-audit` | Busca paquetes con vulnerabilidades (CVE) o desactualizados. |
| **Al configurar deploy / CI / envs** (Fase 1 en adelante) | `devops-audit` | Revisa el pipeline, variables de entorno, que no haya secretos colgados. |
| **Cuando quieras saber qué pasa en producción** (Fase 5–6) | `monitoring-setup` | Errores, logs y alertas para enterarte si algo falla antes que el cliente. |
| **Si algo carga lento** (Fase 6) | `performance-audit` | Core Web Vitals, bundle, imágenes. Que el sitio vuele. |
| **En CADA PR, antes de pedirle review a Franco** | `code-quality` | Naming, código repetido, deuda técnica, que esté prolijo y mantenible. |
| **Cuando el repo esté desordenado** (limpieza puntual) | `project-clean` | Elimina código muerto, imports sin usar, `console.log`, archivos huérfanos. |

---

## Skills que NO están en el repo (y por qué)

Estas te pueden servir pero **no** son archivos que se clonan; se instalan aparte:

| Skill / herramienta | Para qué | Cómo la tenés |
|---|---|---|
| **agent-browser** | Probar el panel en un navegador real (abrir, click, screenshots). Indispensable para verificar que el dashboard *funciona*. | Instalar: `npm i -g agent-browser && agent-browser install` (ya está en [05_SKILLS_Y_SETUP](./05_SKILLS_Y_SETUP.md) §2). |
| **playwright** | Tests de flujos (checkout, webhook). | Es de plugin; la sumás en Fase 3/6 cuando toque testear. |
| **code-review** | Review formal de un diff. | Built-in de Claude Code / plugin. Pedíselo cuando quieras un repaso antes del PR. |
| **Vercel** (plugin) | Conectar Postgres/Blob/Mercado Pago por el Marketplace, deploys, logs. **Clave.** | Se instala como plugin de Vercel (ver [05_SKILLS_Y_SETUP](./05_SKILLS_Y_SETUP.md) §2). |

> Si Claude Code te ofrece una skill que no está acá y una tarea la pide, sumala. **No instales por instalar:** sumá lo que la tarea necesita.

---

## Cómo se conecta esto

- **Setup e instalación completa** → [05_SKILLS_Y_SETUP.md](./05_SKILLS_Y_SETUP.md).
- **El "estudio completo" de roles y su vara** (contexto, opcional) → [`../../docs/19_ESTUDIO_VIRTUAL.md`](../../docs/19_ESTUDIO_VIRTUAL.md) y [`../../docs/18_WORKFLOW_AND_SKILLS.md`](../../docs/18_WORKFLOW_AND_SKILLS.md).
- **Cómo hablarle a la IA** → [04_PLANTILLAS_PROMPTS.md](./04_PLANTILLAS_PROMPTS.md).
- **Tu plan de trabajo** → [03_BACKLOG.md](./03_BACKLOG.md).
