# 04 — Plantillas (prompts, reporte, PR, ayuda)

Copiá, pegá, adaptá. Estas plantillas hacen que Claude Code / opencode trabaje ordenado y que tus reportes sean claros. Reemplazá lo que está entre `<...>`.

---

## 1. Arrancar una tarea con Claude Code

Este es el prompt base. La clave: **contexto + pedir plan antes de código**.

```
Vamos a trabajar en la <Tarea N: nombre> del backlog (colaboracion/gonzalo/03_BACKLOG.md).

Antes de escribir NADA de código:
1. Leé estos archivos: colaboracion/gonzalo/02_ARQUITECTURA_BACKEND.md, colaboracion/gonzalo/03_BACKLOG.md (la tarea N) y <otros docs que indique la tarea>.
2. Recordá que esta es una versión especial de Next.js: leé lo relevante en node_modules/next/dist/docs/ antes de proponer código de Next.
3. Explicame tu PLAN: qué archivos vas a crear/tocar y por qué. En pasos chicos.

Recién cuando yo te diga "dale", empezás a codear. Respetá: TypeScript sin `any`,
runtime Node (no edge), secretos en env vars, placeholders con TODO(contenido).
```

Después de leer su plan: si te cierra, respondé **"dale, hacelo paso por paso y explicame cada decisión"**. Si no, pedile que lo ajuste.

---

## 2. Pedir que planifique (cuando la tarea es grande o no la entendés)

```
No escribas código todavía. Quiero entender el problema primero.
Explicame en simple: (a) qué hay que construir, (b) qué opciones hay,
(c) cuál recomendás y por qué, (d) qué podría salir mal.
Cuando lo entienda te digo cómo seguimos.
```

---

## 3. Revisar/entender código que ya existe

```
Explicame qué hace <archivo o función> como si estuviera aprendiendo.
¿Por qué está hecho así? ¿Qué pasaría si lo cambio? ¿Hay algo que mejorarías?
```

---

## 4. Cuando termina una tarea — reporte para Franco

Pegá esto en el PR o en el mensaje a Franco:

```
## <Tarea N: nombre>

**Qué hice:** <2–4 líneas>

**Decisiones que tomé:** <si elegiste algo, por qué>

**Cómo probarlo:**
1. <paso>
2. <paso>

**Quedó pendiente / TODO(contenido):** <lo que falta o es placeholder>

**Dudas / lo que no me cerró:** <si hay algo, decilo — no lo escondas>
```

---

## 5. Descripción de Pull Request

```
### Qué
<qué resuelve este PR, en 1–3 líneas>

### Cómo probarlo
<pasos para que Franco lo verifique>

### Checklist
- [ ] `npm run build` pasa
- [ ] Sin `any`, sin console.log, sin código muerto
- [ ] Sin secretos en el código
- [ ] Placeholders marcados con TODO(contenido)
- [ ] Cumple los criterios de aceptación de la tarea
```

---

## 6. Cuando estás trabado (pedir ayuda a Franco)

No mandes solo "no anda". Mandá esto:

```
Estoy trabado en <Tarea N>.

**Qué quería hacer:** <objetivo>
**Qué probé:** <1–3 cosas>
**El error (copiado tal cual):**
```
<pegá el mensaje de error completo>
```
**Rama / PR:** <link>
```

Cuanto más preciso, más rápido te destrabamos.

---

## 7. Ejemplo real aplicado (Tarea 2 — modelar una colección)

```
Vamos a trabajar en la Tarea 2 del backlog: modelar la colección Products en Payload.

Antes de escribir código:
1. Leé colaboracion/gonzalo/02_ARQUITECTURA_BACKEND.md (§5, el borrador de colecciones) y
   docs/16_DECISIONS.md (§C, el checklist de contenido: material, +15% por canal,
   stock, "a medida").
2. Mirá components/sections/Destacados.tsx y Productos.tsx para ver qué datos de
   producto muestra hoy el sitio, así no me olvido ningún campo.
3. Proponé el esquema de la colección Products (campos, tipos, cuáles son
   obligatorios, slugs) y explicámelo. NO escribas el archivo todavía.

Cuando me convenza el esquema, lo creamos. Un commit solo para esta colección.
```

---

## Recordá

- La IA **propone**; vos **decidís y revisás**. Si no entendés algo, no lo mergees: preguntá.
- Pasos chicos > un salto gigante.
- Ante la duda entre rápido y bien hecho → bien hecho, y avisá si tarda.
