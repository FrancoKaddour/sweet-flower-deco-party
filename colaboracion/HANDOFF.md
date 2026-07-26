# HANDOFF — Quién hace qué (Franco / Gonzalo)

El documento que define **la división del trabajo** para que cada uno se enfoque a full sin pisarse. Léanlo los dos. Si algo cae en zona gris, se conversa por acá antes de tocar.

Objetivo compartido: un sitio **memorable** que funcione perfecto y sea un **puente de crecimiento** para Flor. Nivel de un producto que cotiza USD 30k.

---

## 1. Roles en una línea

- **Franco** → **Diseño + Contenido + Dirección.** Hace que se vea y se sienta de nivel; carga el contenido; revisa y aprueba el trabajo de Gonzalo.
- **Gonzalo** → **Backend + Funcionalidades + Panel.** Hace que todo *funcione perfecto*: datos, e-commerce, pagos, y el panel de operaciones.

---

## 2. Quién es dueño de qué (RACI simple)

| Área | Dueño | El otro… |
|---|---|---|
| Diseño visual (sitio y panel) | **Franco** | Gonzalo entrega funcional/simple; Franco pule |
| Secciones y UI del storefront (`components/sections`, `components/ui`) | **Franco** | Gonzalo consume datos, no cambia el diseño |
| Tokens de diseño (`app/globals.css`) | **Franco** | — |
| Contenido real (textos, imágenes, precios) | **Franco** (lo carga) | Gonzalo provee dónde cargarlo (panel) |
| Modelo de datos y migraciones (`collections`, `payload.config`) | **Gonzalo** | Franco no toca schema |
| E-commerce / pagos (`lib/commerce`, `lib/payments`, `app/api`) | **Gonzalo** | — |
| Panel `/panel` (funcionalidad) | **Gonzalo** | Franco define/pule el diseño |
| Base de datos y entornos | **Gonzalo** | Franco carga contenido, no administra la base |
| Arquitectura / decisiones técnicas | **Gonzalo propone → deciden juntos** | se registra en `docs/16_DECISIONS.md` |
| Aprobar PRs a `main` | **Franco** | Gonzalo abre el PR |

---

## 3. Límites de archivos (para NO pisarnos)

**Gonzalo toca (backend):**
`payload.config.ts` · `collections/*` · migraciones · `lib/commerce/*` · `lib/payments/*` · `app/api/*` · `app/panel/*` · scripts de seed.

**Franco toca (front + diseño):**
`components/sections/*` · `components/ui/*` · `components/motion/*` · `components/site/*` · `app/globals.css` · páginas de marketing (`app/page.tsx`, secciones del sitio público) · el **contenido** (vía panel).

**Zona frontera — se coordina por PR antes de tocar:**
`app/layout.tsx` · `content/site.ts` · tipos compartidos · cualquier cambio de schema que afecte contenido ya cargado.

> Por qué funciona: el **contenido vive en la base** (lo carga Franco por el panel), la **estructura vive en el código** (la define Gonzalo). Son planos distintos → no hay conflictos de merge. Ver [`gonzalo/07_DB_IMPLEMENTACION.md`](./gonzalo/07_DB_IMPLEMENTACION.md).

---

## 4. Cómo trabajamos juntos (el flujo)

1. Gonzalo toma una tarea del [backlog](./gonzalo/03_BACKLOG.md) → **rama** `feat/...`.
2. Trabaja con **commits chicos**; al terminar, **abre un PR** con la [plantilla](./gonzalo/04_PLANTILLAS_PROMPTS.md).
3. **Franco revisa** el PR (ver [`franco/REVISAR_A_GONZALO.md`](./franco/REVISAR_A_GONZALO.md)): que funcione, que pase el build, que no rompa el diseño, que no haya secretos.
4. Franco aprueba y **mergea a `main`**. Nunca se pushea directo a `main`.
5. Para pantallas del panel: Gonzalo las entrega **funcionales y simples**; Franco las **pule** en un PR aparte.

**Cadencia sugerida:** un mensaje diario corto de Gonzalo ("hoy hice X, mañana Y, trabado en Z"). Decisiones grandes o bloqueos → al momento, no acumular.

---

## 5. Contenido real (el plan cuando llegue)

El sitio hoy tiene **placeholders** (`TODO(contenido):`). Falta lo real: **imágenes y textos** que pasan Flor y su equipo (ver checklist en `docs/16_DECISIONS.md` §C).

Flujo cuando Flor entregue:
1. **Franco recibe** el material (fotos, textos, historia, productos, datos de eventos).
2. Franco lo **carga por el panel** (para eso existe) o, si es contenido que toca código (tokens de marca, textos de secciones aún no migradas), **se lo pasa a la IA/Claude** para llevarlo a donde corresponde con las mejores prácticas.
3. Se reemplazan los `TODO(contenido)` y se afina todo con contexto real.

Detalle en [`franco/INTAKE_DE_CONTENIDO.md`](./franco/INTAKE_DE_CONTENIDO.md).

> **Meta:** que lo único que falte para tener el sitio "de verdad" sea el contenido de Flor. Todo lo estructural (diseño + backend + panel) tiene que estar listo y sólido para recibirlo.

---

## 6. Definición de "listo para producción" (la vara común)

- [ ] Storefront memorable, responsive, accesible, con motion con propósito (Franco).
- [ ] Backend que funciona perfecto: catálogo, carrito, checkout MP con webhooks robustos, stock (Gonzalo).
- [ ] Panel operativo completo (contenido + ventas + comunidad + leads + métricas).
- [ ] Cero secretos en el código; todo por env vars.
- [ ] Cero datos inventados; contenido real cargado o marcado `TODO(contenido)`.
- [ ] `npm run build` en verde; sin `any`; Core Web Vitals sanos.

Cada uno es dueño de su mitad, pero la vara es de los dos. A construir algo para mostrar. 🌷
