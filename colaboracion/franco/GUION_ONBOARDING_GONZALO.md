# Guion — Onboarding de Gonzalo por Discord (≤ 40 min)

Hoja de ruta **para vos (Franco)** para conducir la call de bienvenida. Compartís pantalla, seguís los tiempos, y dejás que Gonzalo hable. La idea no es que se acuerde de todo: es que **entienda el mapa** y sepa **dónde está cada cosa** para volver solo después.

> **Regla de oro de la call:** vos mostrás *dónde* vive cada cosa; los docs explican el *detalle*. No expliques todo de memoria — abrí el archivo y decí "esto está acá, lo leés cuando lo necesites". Todo lo que digas ya está escrito en `colaboracion/gonzalo/`.

---

## Antes de arrancar (2 min, mientras se conectan)

- [ ] Gonzalo en la call, con **su pantalla lista** para instalar si hace falta.
- [ ] Vos con el proyecto abierto en el editor + una terminal.
- [ ] Confirmá que ya tiene **Node 20+**, **Git** y **Claude Code / opencode** (si no, que instale mientras charlan — no frena la call).
- [ ] Tené a mano el link del repo y su invitación de colaborador de GitHub.

---

## Bloque 1 — El "qué" y el "porqué" · 4 min

**Qué mostrar:** nada todavía, mirá a cámara. **Qué decir (simple):**

- "Sweet Flowers es la marca de Flor: **decoración de eventos + formación + comunidad**. No estamos haciendo una web común: es una **plataforma premium** que tiene que verse de nivel de una agencia top."
- "La idea es que quien entra piense *'si el sitio tiene este nivel, imaginate los eventos'*. Eso es todo el proyecto en una frase."
- "**Tu parte:** el backend, las funcionalidades y el panel de administración. Yo hago el diseño y cargo el contenido. Vos hacés que **todo funcione perfecto**: catálogo, carrito, pagos, y el panel donde se carga todo."

**Check-in:** "¿Se entiende la diferencia entre lo que hago yo (que se vea) y lo que hacés vos (que funcione)?"

---

## Bloque 2 — El objetivo y la vara · 4 min

**Qué mostrar:** abrí [`../HANDOFF.md`](../HANDOFF.md) (la tabla de "quién es dueño de qué"). **Qué decir:**

- "El objetivo compartido: un sitio **memorable que funcione perfecto**. Apuntamos a algo que cotiza como un producto de USD 30k."
- "Acá está **quién hace qué** para no pisarnos. Vos sos dueño de: base de datos, e-commerce, pagos y el panel. Yo del diseño y el contenido."
- "Hay una **vara de calidad** (te la muestro en un rato): nada se entrega 'porque funciona'. Pero tranquilo — para vos, primero **funcional y simple**, y después lo pulimos juntos."

**Check-in:** "¿Ves los límites de archivos? La idea es que cada uno toque lo suyo y coordinemos la zona gris por acá."

---

## Bloque 3 — Tour del repo (pantalla compartida) · 10 min

**Qué mostrar:** compartí pantalla y recorré las carpetas. **Qué decir en cada una (rapidito):**

- `app/` → "las páginas y URLs del sitio (Next.js). Territorio mío sobre todo, pero acá también van tus `app/api` y el `app/panel`."
- `components/` → "las piezas visuales. Mías. Vos consumís datos, no tocás el diseño."
- `lib/` → "utilidades y lógica. **Acá va a vivir mucho de lo tuyo** (`lib/commerce`, etc.)."
- `docs/` → "la **Project Bible**: negocio, marca, decisiones, estándares. La fuente de verdad. Si el código y esto se contradicen, **manda esto**."
- `colaboracion/gonzalo/` → **abrí esta carpeta y frená acá.** "Esta es **tu base de operaciones**. Todo lo que necesitás está acá."

**Después mostrá, uno por uno, los docs de su carpeta** (solo abrí y decí para qué sirve cada uno — no los leas):
- `00_EMPEZA_ACA` → "instalás, clonás, corrés el proyecto. Tu día 1."
- `01_COMO_TRABAJAMOS` → "la metodología (ya la vemos)."
- `02_ARQUITECTURA_BACKEND` → "qué construimos y por qué."
- `06_DASHBOARD_SPEC` → "qué tiene que hacer el panel."
- `07_DB_IMPLEMENTACION` → "la base de datos, cómo no pisarnos."
- `03_BACKLOG` → "**tu plan tarea por tarea. De acá salís a trabajar.**"
- `04_PLANTILLAS_PROMPTS` → "cómo hablarle a la IA."
- `08_SKILLS_POR_TAREA` → "qué skill usar en cada tarea."
- `09_TESTEAR_MERCADOPAGO` → "para cuando lleguemos a pagos."

**Check-in:** "Si te perdés en cualquier momento, ¿a dónde volvés?" (Respuesta: a `colaboracion/gonzalo/README`.)

---

## Bloque 4 — Cómo trabajamos (la metodología) · 8 min

**Qué mostrar:** abrí [`../gonzalo/01_COMO_TRABAJAMOS.md`](../gonzalo/01_COMO_TRABAJAMOS.md). **Qué decir:**

- "Regla número uno: **Contexto → Diseño → Código.** Nunca al revés. Primero entendés qué hay que hacer y por qué, después lo pensás, recién ahí codeás. La IA te ayuda con las tres."
- "El flujo de Git es simple: **una tarea = una rama = commits chiquitos = un PR**. Yo reviso el PR antes de mergear. **Nunca** se pushea directo a `main`."
- "Regla de commits: **un commit por actividad, no todo junto.** Ayuda a que yo revise y a que si algo falla, se encuentre fácil."

**Después mostrá las reglas no negociables** (están en `00_EMPEZA_ACA` §5). Decilas cortito:
1. "Esta **no es la versión de Next.js** que la IA sabe de memoria — pedile que lea la doc real en `node_modules/next/dist/docs` antes de codear."
2. "**TypeScript estricto, sin `any`.**"
3. "**Runtime Node, nunca edge.**"
4. "**Servicios externos** (base, pagos, mails) se conectan por el **Marketplace de Vercel**, no cableando a mano."
5. "**Cero secretos en el código** — todo va en `.env.local` (que no se sube) o en `00_ACCESOS`."
6. "**Datos inventados jamás** — lo que falta se marca `TODO(contenido)`."

**Check-in:** "¿La de 'una tarea, una rama, un PR' te queda clara? Es la que más vas a usar."

---

## Bloque 5 — Tu equipo: Claude Code + las skills · 6 min

**Qué mostrar:** abrí `.claude/skills/` en el repo y [`../gonzalo/08_SKILLS_POR_TAREA.md`](../gonzalo/08_SKILLS_POR_TAREA.md). **Qué decir:**

- "No estás solo: tenés a **Claude Code** de copiloto, y le dejamos **skills** (expertos para tareas puntuales) **ya listas en el repo**. Al clonar te aparecen solas, no instalás nada."
- "Ejemplo: si vas a revisar la base de datos, usás `db-review`; si tocás seguridad, `security-audit`. Esta chuleta te dice **cuál usar en cada tarea**."
- "Dos cosas **sí** instalás aparte (están en `05_SKILLS_Y_SETUP`): el **plugin de Vercel** (clave para conectar la base y los pagos) y **agent-browser** (para probar el panel en un navegador de verdad)."
- "Para hablarle bien a la IA, tenés **plantillas de prompts** en `04_PLANTILLAS_PROMPTS`. Copiás, pegás, completás."

**Check-in:** "La idea no es que sepas todo de memoria — es que sepas **qué pedirle a la IA y con qué skill**. ¿Se entiende?"

---

## Bloque 6 — El plan y tu primera semana · 5 min

**Qué mostrar:** abrí [`../gonzalo/03_BACKLOG.md`](../gonzalo/03_BACKLOG.md) (el tablero de fases). **Qué decir:**

- "El trabajo está en **fases**. Cada una se apoya en la anterior. No hay que correr — se hace en orden."
- "Fase 0 = **el motor** (base de datos + modelo). Fase 1 = **panel base + catálogo**. Después: carrito, pagos, y el centro de operaciones completo."
- "**Arrancás por la Tarea 0**: un 'spike', una prueba corta para validar que la tecnología del panel (Payload) funciona con nuestro Next. Es medio día. Cuando termines, me avisás el resultado y **decidimos juntos** antes de seguir."
- "Las fases 4 a 6 las **detallamos juntos cuando llegues** — no te preocupes por eso ahora."

**Check-in:** "¿Tu primera misión concreta cuál es?" (Respuesta: Tarea 0, el spike de Payload.)

---

## Bloque 7 — Cierre: accesos y comunicación · 3 min

**Qué decir:**

- "Te mando ahora: **invitación al repo de GitHub** y **acceso a Vercel** (o te paso las variables de entorno). Las credenciales de pago van más adelante, en la carpeta `00_ACCESOS`."
- "**Cómo nos comunicamos:** un mensajito diario corto — *'hoy hice X, mañana Y, trabado en Z'*. Y lo más importante: **preguntá temprano.** Si estás 30 min trabado, escribime. No hay preguntas tontas."
- "Orden para hoy/mañana: (1) instalás y corrés el proyecto con `00_EMPEZA_ACA`, (2) leés `01` y `02` sin apuro, (3) arrancás la **Tarea 0**. Cuando la termines, me avisás."

**Cierre:** "Vamos a construir algo para mostrar. Cualquier cosa, me escribís. 🌷"

---

## Chuleta de tiempos (para no pasarte)

| Bloque | Min | Acumulado |
|---|---|---|
| Antes de arrancar | 2 | 2 |
| 1. El qué y el porqué | 4 | 6 |
| 2. Objetivo y vara | 4 | 10 |
| 3. Tour del repo | 10 | 20 |
| 4. Metodología | 8 | 28 |
| 5. Skills + IA | 6 | 34 |
| 6. Plan y 1ra semana | 5 | 39 |
| 7. Cierre | 3 | **42** |

> Si vas justo de tiempo, el bloque que podés acortar es el **5 (skills)** — con decirle "están en el repo y hay una chuleta" alcanza; lo profundiza solo. **No recortes el 3 (tour) ni el 6 (plan):** son los que lo dejan sabiendo a dónde ir.

---

## Anexo — Canales de Discord sugeridos (opcional)

Para que la comunicación quede ordenada, un server simple:

- **#general** — charla, avisos.
- **#avances** — el mensajito diario de Gonzalo (hoy/mañana/trabado).
- **#dudas-técnicas** — preguntas puntuales (con captura o link al archivo).
- **#prs-y-revisiones** — cuando abre un PR, lo linkea acá y vos avisás cuando lo revisaste.
- **#accesos** — **NO** para pegar credenciales; solo para coordinar "te mando X por privado". Los secretos van por DM o gestor de contraseñas, nunca a un canal.

> Con eso alcanza. Si crece el equipo, se suman canales; hoy, cuanto más simple, mejor.
