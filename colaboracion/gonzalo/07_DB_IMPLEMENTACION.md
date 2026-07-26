# 07 — Base de datos: implementación (y cómo no pisarnos)

Qué base usamos, cómo la conectamos y —clave— cómo hacemos para que tu trabajo (schema/código) y la carga de contenido de Franco **nunca choquen**.

---

## 1. Qué base y por qué

- **Postgres** (relacional, SQL estándar). Sólido, universal, escala, y es lo que espera Payload.
- **Proveedor: Neon**, conectado por el **Marketplace de Vercel**. Es serverless (escala a cero → barato para arrancar) y soporta **branching** (copias instantáneas de la base), que usamos para no pisarnos (ver §4).
- **Imágenes NO van en la base:** van a **Vercel Blob**. En la base guardamos solo la referencia. Esto mantiene la base liviana y rápida.

> No elijas otro proveedor ni cablees credenciales a mano: se agrega desde **Vercel → Marketplace** y Vercel gestiona las env vars.

---

## 2. Cómo se conecta al proyecto

1. Desde Vercel → Marketplace, agregás **Neon Postgres**.
2. Traés las variables a local: `vercel env pull .env.local`.
3. Payload usa su **adaptador de Postgres** apuntando a esa `DATABASE_URL`. Una sola configuración, en `payload.config.ts`.

Nunca pongas la URL de la base en el código ni en un commit. Siempre env var.

---

## 3. Migraciones (cómo cambia la estructura, sin romper nada)

La **estructura** de la base (tablas, columnas) cambia SOLO por **migraciones versionadas** de Payload. Nunca a mano en la base de producción.

- Cuando modificás una colección (agregás un campo, etc.), generás una **migración** (un archivo versionado en el repo).
- La migración se revisa en el PR como cualquier código.
- Se aplica automáticamente al desplegar. Así, lo que hay en dev, preview y producción es **reproducible y trazable**.
- **Vos sos el único dueño del schema y las migraciones.** Si algo del modelo tiene que cambiar, pasa por vos y por un PR.

Regla de oro: **el contenido** (productos, textos) lo carga Franco por el panel y vive **en la base**; **la estructura** (qué campos existen) la definís vos **en el código**. Son dos cosas separadas → no se pisan.

---

## 4. Entornos (y cómo NO pisarnos)

Usamos **una base por entorno**, aprovechando el branching de Neon:

| Entorno | Base | Quién / para qué |
|---|---|---|
| **Local (dev)** | tu **branch** de Neon (o una copia) | tus pruebas. Rompé lo que quieras, no afecta a nadie. |
| **Preview (por PR)** | branch de Neon efímero | cada PR tiene su base para probar aislado. |
| **Producción** | base principal | donde Franco carga el contenido real. **Sagrada.** |

Reglas para no pisarnos:

1. **Nunca apuntes tu dev a la base de producción para experimentar.** Usá tu branch. Si borrás algo de prod sin querer, perdemos el contenido de Flor.
2. **Franco carga contenido en producción por el panel; vos tocás schema por migraciones.** Como son planos distintos (datos vs estructura), no hay conflicto de merge.
3. **Un cambio de estructura que afecte lo que Franco ya cargó** (ej: renombrar un campo con datos) → avisá **antes** y coordinen. Payload ayuda con migraciones de datos, pero se conversa primero.
4. **Backups:** Neon guarda historial (point-in-time). Aún así, antes de una migración grande en producción, avisá a Franco.

---

## 5. Datos de ejemplo (seed)

Mientras no haya contenido real, un **script de seed** (Fase 0, Tarea 3) llena la base de dev con datos placeholder (`TODO(contenido)`, precios `null`). Debe ser **idempotente**: correrlo dos veces no duplica. Nunca corras el seed contra producción.

---

## 6. Resumen de límites (contrato entre vos y Franco)

- **Tuyo (código):** `payload.config.ts`, `collections/*`, migraciones, `lib/commerce`, `lib/payments`, `app/api/*`, `app/panel/*`.
- **De Franco (datos + diseño):** el contenido que carga por el panel, y el diseño del storefront/panel.
- **Frontera (se coordina por PR):** cambios de schema que afecten datos ya cargados; `app/layout.tsx`; `content/site.ts`.

Con esto, cada uno avanza a full sin bloquear al otro. El detalle de la división está en el [HANDOFF](../HANDOFF.md).
