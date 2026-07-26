# 05 — Skills y setup (todo lo que instalás)

Lista completa de herramientas, skills y accesos para construir el backend y el panel. Hacelo una vez, bien, antes de arrancar el backlog.

---

## 1. Herramientas de línea de comandos (CLI)

Instalá y verificá:

| Herramienta | Para qué | Instalar | Verificar |
|---|---|---|---|
| **Node.js 20+** | correr el proyecto | [nodejs.org](https://nodejs.org) (LTS) | `node -v` |
| **Git** | control de versiones | [git-scm.com](https://git-scm.com) | `git --version` |
| **GitHub CLI (`gh`)** | crear PRs desde la terminal | [cli.github.com](https://cli.github.com) | `gh --version` |
| **Vercel CLI** | traer env vars, deploys, logs | `npm i -g vercel` | `vercel --version` |

Después de instalar `gh` y `vercel`, logueate una vez: `gh auth login` y `vercel login`.

---

## 2. Skills / plugins de Claude Code

Estas son las "skills" que te potencian para este proyecto. En Claude Code se agregan desde su sistema de **plugins/skills** (menú `/plugin` o el marketplace de plugins).

| Skill / plugin | Para qué lo necesitás |
|---|---|
| **Vercel** (plugin) | **Clave.** Te guía para conectar servicios por el **Marketplace de Vercel** (Postgres/Neon, Blob, Mercado Pago, Resend) de la forma correcta, y para deploys/logs. Toda la infra pasa por acá. |
| **agent-browser** (skill) | Probar el panel y los flujos en un navegador real (abrir, click, screenshots). Indispensable para verificar que el dashboard *funciona*. Instalá: `npm i -g agent-browser && agent-browser install`. |

> Si Claude Code te ofrece más skills relacionadas (bases de datos, testing), sumalas cuando una tarea lo pida. Regla general: no instales por instalar; sumá lo que la tarea necesita y justificá por qué.

**Cómo la IA lee el contexto del proyecto:** Claude Code lee solo el [`../../AGENTS.md`](../../AGENTS.md) y el [`../../docs/CLAUDE.md`](../../docs/CLAUDE.md) del repo. No hace falta que se los pegues, pero conocelos.

---

## 3. Accesos que te tiene que dar Franco

Estos NO los podés conseguir solo. Pedíselos a Franco:

- [ ] **Colaborador en el repo de GitHub** (para clonar y abrir PRs).
- [ ] **Acceso al proyecto en Vercel** — o, si Franco prefiere, que él cree las integraciones del Marketplace y te pase las **variables de entorno** para tu `.env.local`.
- [ ] **Credenciales de test de Mercado Pago** (recién para la Fase 3; van a la carpeta `00_ACCESOS`).

> Mientras no tengas Vercel, podés avanzar Tarea 0 (spike) y leer los docs. La Tarea 1 en adelante necesita los accesos.

---

## 4. Servicios externos (se conectan por el Marketplace de Vercel)

**No** cablees estos proveedores a mano ni pegues claves en el código. Se agregan desde **Vercel → Marketplace** y Vercel te gestiona las credenciales como env vars:

| Servicio | Para qué | Cuándo |
|---|---|---|
| **Postgres (Neon)** | base de datos | Fase 0 / Tarea 1 |
| **Vercel Blob** | imágenes de productos/eventos | Fase 0 / Tarea 1 |
| **Mercado Pago** | pagos | Fase 3 |
| **Resend** | emails transaccionales | Fase 3 / 4 |

Detalle de la base de datos en [`07_DB_IMPLEMENTACION.md`](./07_DB_IMPLEMENTACION.md).

---

## 5. Variables de entorno (secretos)

- Viven en `.env.local` (que **NO** se sube a Git — verificá que esté en `.gitignore`).
- Traelas desde Vercel con: `vercel env pull .env.local`.
- **Nunca** las pegues en el código, en un commit, ni en un mensaje. Si dudás, preguntá.

---

## 6. Checklist de "setup listo"

- [ ] `node -v` ≥ 20, `git`, `gh`, `vercel` instalados y logueados.
- [ ] Repo clonado y `npm run dev` mostrando la home en `localhost:3000`.
- [ ] Plugin de Vercel y skill agent-browser instalados en Claude Code.
- [ ] Accesos pedidos a Franco (GitHub + Vercel).
- [ ] Leíste [`00`](./00_EMPEZA_ACA.md), [`01`](./01_COMO_TRABAJAMOS.md), [`02`](./02_ARQUITECTURA_BACKEND.md) y el [HANDOFF](../HANDOFF.md).

Con esto, andá al [`03_BACKLOG.md`](./03_BACKLOG.md) y arrancá por la Tarea 0.
