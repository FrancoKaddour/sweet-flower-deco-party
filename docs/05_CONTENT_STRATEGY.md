# 05 — ESTRATEGIA DE CONTENIDO

**Versión 1.0** · Narrativa por sección, contenido de páginas clave y tono de microcopys.

> Este documento define **qué se cuenta, en qué orden y con qué intención** en cada pantalla. Es el puente entre el negocio ([`01_BUSINESS.md`](./01_BUSINESS.md)) y el diseño ([`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md) / [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)).
> El **mapa de rutas** vive en [`04_SITE_ARCHITECTURE.md`](./04_SITE_ARCHITECTURE.md). Los **principios de experiencia** viven en [`08_UX_PRINCIPLES.md`](./08_UX_PRINCIPLES.md).
> Todo texto real de Flor está pendiente: se marca con `TODO(contenido)`. **Nunca inventar datos duros** (precios, cupos, fechas, nombres).

Si el código y este documento se contradicen, **este documento tiene prioridad** hasta que se actualice de forma explícita.

---

## Índice

1. [Principios de contenido (recordatorio operativo)](#1-principios-de-contenido-recordatorio-operativo)
2. [La HOME, sección por sección](#2-la-home-sección-por-sección)
3. [Estrategia de contenido — Productos (catálogo y PDP)](#3-estrategia-de-contenido--productos-catálogo-y-pdp)
4. [Estrategia de contenido — Evento](#4-estrategia-de-contenido--evento)
5. [Estrategia de contenido — Membresía](#5-estrategia-de-contenido--membresía)
6. [Tono de los microcopys](#6-tono-de-los-microcopys)
7. [Pendientes de contenido](#7-pendientes-de-contenido)

---

## 1. Principios de contenido (recordatorio operativo)

Toda esta estrategia obedece a los **Experience Principles** del handoff ([`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md) §6):

- **No mostrar todo de una.** Cada sección entrega **una idea**, no un catálogo de ideas. Generar curiosidad.
- **Ritmo:** alternar deliberadamente **impacto → descanso → contenido → espacio negativo**. Nunca dos secciones "fuertes" seguidas ni dos "planas" seguidas.
- **Descubrimiento:** cada scroll revela algo nuevo. El usuario avanza porque quiere ver qué sigue.
- **Cada sección sorprende y tiene identidad propia.** Ningún layout se repite igual (regla dura de la Quality Bar).
- **Todo cuenta una historia:** de la **materia** (productos) → a la **experiencia** (eventos) → a la **comunidad** (membresía / Flor).
- **Jerarquía clara:** en cada pantalla el usuario sabe qué es lo más importante y qué acción tomar.

Cada sección de abajo se documenta con seis campos:
**Intención narrativa · Qué siente/descubre · Contenido · Jerarquía · CTA · Nota de motion.**

---

## 2. La HOME, sección por sección

La Home es la **primera pieza de decoración** que entrega la marca. No es un índice: es una **secuencia cinematográfica** que lleva de la seducción a la acción. Definimos **11 secciones** con un ritmo intencional.

Mapa de ritmo (alternancia impacto/descanso):

```
S1  Hero................. IMPACTO máximo
S2  Manifiesto.......... DESCANSO / respiración (texto sobre negativo)
S3  Materia............. CONTENIDO (productos, materialidad)
S4  Transición........... ESPACIO NEGATIVO / cita
S5  Evento.............. IMPACTO (cinematográfico, la joya)
S6  Prueba (ediciones).. CONTENIDO (números, autoridad)
S7  Flor................ DESCANSO (retrato, humano)
S8  Membresía........... CONTENIDO (pertenencia)
S9  Testimonios......... DESCANSO (voces reales)
S10 Sponsors/Logos...... ESPACIO NEGATIVO (marquee sutil)
S11 Cierre / CTA........ IMPACTO final (invitación)
```

---

### S1 — Hero

- **Intención narrativa:** en 2 segundos, comunicar *"esto es de otro nivel"*. Es la promesa completa de la marca condensada en una imagen y una frase.
- **Qué siente/descubre:** asombro. El usuario entiende que no está en "una tienda más". Todavía no sabe qué se vende exactamente, y eso está bien: queremos deseo antes que información.
- **Contenido:** foto o video grande (evento montado, flores, textura, luz), un **titular editorial** corto y potente, y un subtítulo de una línea. Sin párrafos.
  - Titular: `TODO(contenido)` — dirección provisional: una frase de marca ("Convertimos cada evento en una escena inolvidable" — placeholder, no final).
  - Media: `TODO(contenido)` — video SweetDay / foto hero en fondo limpio y montado.
- **Jerarquía:** 1) titular · 2) media · 3) micro-indicador de scroll. El header casi no existe todavía.
- **CTA:** ninguno intrusivo. Un indicador sutil de "seguí bajando" (descubrimiento > empuje).
- **Nota de motion:** reveal del titular **palabra por palabra** con máscara (`yPercent 100→0`, `power3.out`, stagger ~0.07); media con **parallax scrubbed** al scroll. `prefers-reduced-motion` → estado final directo. Ver [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md).

---

### S2 — Manifiesto

- **Intención narrativa:** declarar la filosofía. Pasar del impacto visual a la **voz de la marca**. Es el "quiénes somos" sin decir "quiénes somos".
- **Qué siente/descubre:** conexión. Descubre que hay una mirada, un criterio, una autora detrás.
- **Contenido:** un párrafo corto y editorial, tipografía grande sobre mucho espacio negativo. Una idea, no cinco.
  - `TODO(contenido)` — manifiesto real de Flor (3–4 líneas máximo).
- **Jerarquía:** el texto **es** la sección. Nada compite.
- **CTA:** ninguno, o un discreto "Nuestra historia" → `/historia` al pie.
- **Nota de motion:** reveal de texto por líneas con máscara, entrada lenta y pausada. Es un **descanso**: el motion respira, no grita.

---

### S3 — Materia (Productos)

- **Intención narrativa:** mostrar el **oficio y la materialidad**. Hierro, MDF, madera, telas. Que se sienta la textura antes que el precio.
- **Qué siente/descubre:** deseo táctil. Descubre que hay productos físicos, de calidad, con materiales nobles.
- **Contenido:** una presentación **no-grilla** de los materiales/categorías (evitar el clásico grid de cards). Fotos grandes de detalle (una pieza de hierro, la veta de la madera, el pliegue de una funda), con el nombre del material y una entrada al catálogo.
  - `TODO(contenido)` — fotos de detalle de material + nombres definitivos de categorías.
- **Jerarquía:** 1) foto de materia · 2) nombre de categoría · 3) acceso al catálogo.
- **CTA:** "Ver [material]" → `/productos/[categoria]` y un "Ver todo el catálogo" → `/productos`.
- **Nota de motion:** reveal escalonado de las categorías al entrar en viewport; parallax suave en las fotos; hover con leve escala/zoom en desktop. Nada mecánico.

---

### S4 — Transición / Cita

- **Intención narrativa:** **puente** entre el mundo del producto (materia) y el mundo del evento (experiencia). Bajar revoluciones antes del golpe grande.
- **Qué siente/descubre:** expectativa. Una frase lo prepara para lo que viene.
- **Contenido:** una **cita o frase-puente** a pantalla, sobre fondo (posible **momento oscuro cinematográfico**), con muchísimo espacio negativo.
  - `TODO(contenido)` — frase puente ("De las piezas… a la escena", provisional).
- **Jerarquía:** solo la frase.
- **CTA:** ninguno.
- **Nota de motion:** aparición lenta de la frase; puede haber un cambio de fondo (claro→oscuro) ligado al scroll. **Espacio negativo** como recurso, no vacío por descuido.

---

### S5 — Evento (la joya)

- **Intención narrativa:** presentar el evento como el **activo de autoridad** de la marca. Es el pico emocional de la Home.
- **Qué siente/descubre:** *"quiero estar ahí"*. Descubre que existe un summit/workshop, con historia (8va edición) y una fecha concreta.
- **Contenido:** media cinematográfica del evento, el **`EVENT_NAME`**, la **fecha (18/09)**, una línea de qué es, y la entrada al hub del evento.
  - `TODO(contenido)` — `EVENT_NAME` (sin definir: "8vo Workshop" vs "Sweet Flowers Event Summit"), copy de qué es el evento, media del evento montado.
  - Dato duro: la fecha **18/09** es real; el resto (cupo, valor) **no se muestra como definitivo** hasta confirmarse.
- **Jerarquía:** 1) `EVENT_NAME` + fecha · 2) media · 3) CTA de inscripción.
- **CTA:** "Conocé la 8va edición" → `/evento` (y, según ventana temporal, "Inscribirme" → `/evento/inscripcion`).
- **Nota de motion:** el momento **más teatral** de la Home. Reveal de título grande, media con parallax de mayor recorrido, posible cambio de tono de color. Impacto máximo, siempre con propósito.

---

### S6 — Prueba social / Ediciones

- **Intención narrativa:** respaldar el deseo con **hechos**: 7 ediciones previas, números, sedes. Autoridad medible.
- **Qué siente/descubre:** confianza. *"Esto no es la primera vez, es una institución del rubro"*.
- **Contenido:** contadores/números clave (ediciones, asistentes, disertantes), quizás una tira de fotos de ediciones anteriores.
  - `TODO(contenido)` — números reales de las 7 ediciones (no inventar: usar `Edición 0X`, `— asistentes` hasta confirmar).
- **Jerarquía:** 1) números · 2) evidencia visual · 3) acceso al archivo de ediciones.
- **CTA:** "Ver las ediciones anteriores" → `/evento/ediciones`.
- **Nota de motion:** conteo animado de los números al entrar en viewport (con `prefers-reduced-motion` → valor final directo); reveal escalonado. Es **contenido**, ritmo medio.

---

### S7 — Flor (la figura)

- **Intención narrativa:** poner **rostro y voz** a la marca. Humanizar toda la autoridad anterior.
- **Qué siente/descubre:** cercanía y aspiración. Descubre a la persona que lidera todo esto.
- **Contenido:** retrato editorial de Flor + una cita corta suya + una línea de bio. Entrada a la historia completa.
  - `TODO(contenido)` — retrato de Flor, cita real, bio breve.
- **Jerarquía:** 1) retrato · 2) cita · 3) acceso a `/historia`.
- **CTA:** "Conocé a Flor" / "Nuestra historia" → `/historia`.
- **Nota de motion:** **descanso**. Reveal suave del retrato con máscara, cita palabra por palabra. Íntimo, sin estridencia.

---

### S8 — Membresía

- **Intención narrativa:** ofrecer **pertenencia recurrente**. Convertir admiradores en comunidad.
- **Qué siente/descubre:** pertenencia. *"Puedo ser parte de esto todo el año, no solo un día"*.
- **Contenido:** propuesta de valor de la membresía en 2–3 beneficios claros, sin lista interminable.
  - `TODO(contenido)` — qué incluye la membresía (contenido/beneficios/comunidad — a definir con Flor).
- **Jerarquía:** 1) promesa de la membresía · 2) 2–3 beneficios · 3) CTA de alta.
- **CTA:** "Quiero ser parte" → `/membresia`.
- **Nota de motion:** contenido de ritmo medio; reveal de beneficios escalonado. Sobrio, elegante.

---

### S9 — Testimonios

- **Intención narrativa:** dejar que **otras voces** validen. La confianza de terceros pesa más que la autopromoción.
- **Qué siente/descubre:** identificación. *"Personas como yo pasaron por acá y les cambió algo"*.
- **Contenido:** 3–5 testimonios reales (con permiso), formato editorial (no cards genéricas). Nombre y contexto de cada persona.
  - `TODO(contenido)` — testimonios reales con permiso de uso.
- **Jerarquía:** la voz (la cita) primero; la atribución después.
- **CTA:** opcional, hacia el evento o membresía.
- **Nota de motion:** **descanso**. Transición suave entre testimonios (no carrusel automático agresivo); reveal de la cita por líneas.

---

### S10 — Sponsors / Logos

- **Intención narrativa:** cerrar la autoridad con **respaldo de marcas**. Señal de que el ecosistema apuesta al evento.
- **Qué siente/descubre:** legitimidad. *"Marcas serias están detrás de esto"*.
- **Contenido:** logos de sponsors en una tira sobria.
  - `TODO(contenido)` — logos de sponsors reales (con permiso).
- **Jerarquía:** los logos, parejos, sin destacar uno.
- **CTA:** ninguno (o "Quiero ser sponsor" → `/contacto` si aplica).
- **Nota de motion:** **marquee** horizontal lento y continuo (única excepción donde `linear` está permitido). **Espacio negativo** generoso alrededor.

---

### S11 — Cierre / CTA final

- **Intención narrativa:** **cerrar la escena** y pedir la acción. Después de todo el relato, una invitación clara.
- **Qué siente/descubre:** decisión. Sabe exactamente qué hacer ahora.
- **Contenido:** una frase de cierre potente + **la** acción prioritaria del momento (según campaña: evento, catálogo o membresía).
  - `TODO(contenido)` — frase de cierre + definición de cuál es la acción prioritaria por temporada.
- **Jerarquía:** 1) frase de cierre · 2) CTA único y grande.
- **CTA:** uno solo, dominante (p. ej. "Sumate a la 8va edición" → `/evento`). Evitar múltiples CTAs que diluyan.
- **Nota de motion:** **impacto final** simétrico al hero. Reveal del titular grande, CTA con micro-interacción cuidada. Da sensación de cierre de círculo.

> Regla de convivencia: la Home **presenta las puertas** (productos / evento / membresía / Flor) sin que ninguna canibalice a la otra. Ver [`04_SITE_ARCHITECTURE.md`](./04_SITE_ARCHITECTURE.md) §8.

---

## 3. Estrategia de contenido — Productos (catálogo y PDP)

El flujo de producto cambia de tono: acá el usuario quiere **decidir y confiar**. La elegancia se mantiene, pero el contenido se vuelve **claro, honesto y sin fricción**. Un catálogo confuso mata la venta por más lindo que sea.

### 3.1 Catálogo raíz `/productos`

- **Intención narrativa:** ordenar el mundo de productos por **materialidad**, no abrumar.
- **Contenido:** presentación de las categorías (hierro, MDF, madera, fundas y telas) con una foto representativa y una línea de qué encontrás en cada una. Acceso a "a medida".
- **Jerarquía:** categoría → foto → entrada. Un buscador es deseable pero no P0.
- **CTA:** "Ver [categoría]".
- **Nota de motion:** reveal escalonado de categorías; contención (no es una sección "de show", es de navegación).

### 3.2 Listado `/productos/[categoria]`

- **Intención narrativa:** dejar **comparar y filtrar** con comodidad.
- **Contenido:** grilla de productos con foto, nombre, precio y señales clave (desarmable / pintable / a medida). Filtros por color, tamaño, precio y orden. Estado vacío cálido (ver [`04_SITE_ARCHITECTURE.md`](./04_SITE_ARCHITECTURE.md) §7.2).
- **Jerarquía:** foto → nombre → precio → señal. El precio se muestra claro, no escondido.
- **CTA:** clic en la pieza → PDP.
- **Nota de motion:** reveal de la grilla al scroll; filtros con transición suave, sin recargar de golpe.

### 3.3 Ficha de producto (PDP) `/productos/[categoria]/[slug]`

La PDP es donde se **gana o pierde la confianza**. Debe responder toda pregunta antes de que se formule.

- **Intención narrativa:** dar **certeza total** para comprar/consultar sin dudas.
- **Contenido — checklist obligatorio:**
  - Galería de fotos (fondo limpio + pieza montada en evento).
  - Nombre + descripción editorial breve.
  - **Precio** claro (y aclaración de recargo ~15% por Mercado Pago donde corresponda).
  - **Material** (hierro / MDF / madera / tela).
  - **Medidas**.
  - **¿Desarmable? ¿Pintable? Colores disponibles.**
  - **Stock vs. a medida / a pedido** (con tiempo de fabricación).
  - **Envío** (zonas, tiempos, retiro).
  - CTA de compra/consulta (según decisión de checkout, [`04_SITE_ARCHITECTURE.md`](./04_SITE_ARCHITECTURE.md) §9).
  - Breadcrumb (Inicio › Productos › Categoría › Producto).
  - `TODO(contenido)` — datos reales por producto (medidas, material, precio, colores, tiempos).
- **Jerarquía:** galería → nombre/precio → atributos clave → CTA → envío/detalles.
- **CTA:** primario "Agregar al carrito" o "Comprar" o "Consultar" (según §9). Secundario "Presupuesto a medida" → `/contacto`.
- **Nota de motion:** galería con transición suave; reveal del bloque de datos; **cero animación que retrase** ver el precio o el CTA. Acá la Quality Bar es *no estorbar*.
- **Puente narrativo opcional:** "¿Vas a montarlo vos misma? Sumate al workshop" → `/evento` (solo si es coherente, sin ruido).

---

## 4. Estratégia de contenido — Evento

El evento es el **corazón aspiracional**. Aquí el tono vuelve a ser cinematográfico y de autoridad. El hub tiene varias piezas (ver [`04_SITE_ARCHITECTURE.md`](./04_SITE_ARCHITECTURE.md) §2).

### 4.1 `/evento` — Próxima edición (conversión principal)

- **Intención narrativa:** vender **la experiencia de estar ahí** y cerrar la inscripción.
- **Contenido (secuencia recomendada):**
  1. **Hero del evento:** `EVENT_NAME` + **18/09** + frase de qué es.
  2. **Qué vas a vivir:** promesa de la experiencia (no una agenda seca).
  3. **Programa / ejes:** de qué se trata la jornada. `TODO(contenido)`.
  4. **Disertantes:** quiénes enseñan (entrada a `/evento/disertantes`). `TODO(contenido)`.
  5. **Autoridad:** 7 ediciones previas (entrada a `/evento/ediciones`).
  6. **Testimonios** de ediciones anteriores.
  7. **Sponsors**.
  8. **Inscripción:** valor/cupo (cuando estén confirmados) + CTA a `/evento/inscripcion`.
  - Datos duros (cupo, valor, agenda): `TODO(contenido)` — **no mostrar como definitivos** hasta confirmar.
- **Jerarquía:** `EVENT_NAME` + fecha + CTA de inscripción arriba de todo (y repetido al cierre).
- **CTA:** "Inscribirme" → `/evento/inscripcion` (persistente).
- **Nota de motion:** cinematográfico y con ritmo; heros teatrales, contenido con reveals; sin cansar.

### 4.2 `/evento/ediciones` y `[edicion]`

- **Intención narrativa:** demostrar **trayectoria**. Cada edición es prueba y SEO.
- **Contenido:** archivo de las 7 ediciones (número, año/sede, foto, un dato). Detalle por edición: galería, números, testimonios, sponsors de esa edición. `TODO(contenido)`.
- **CTA:** volver al evento actual / inscribirse.
- **Nota de motion:** archivo con reveal editorial; detalle con galería inmersiva.

### 4.3 `/evento/disertantes` y `[slug]`

- **Intención narrativa:** autoridad por asociación (quién enseña).
- **Contenido:** grilla de disertantes (foto, nombre, especialidad). Perfil: bio, aporte, redes. `TODO(contenido)` — ¿perfiles individuales en v1? (ver decisión en `04`/`16`).
- **CTA:** inscripción.
- **Nota de motion:** grilla con reveal escalonado; perfil editorial.

### 4.4 `/evento/inscripcion`

- **Intención narrativa:** **cero fricción** para completar la acción.
- **Contenido:** formulario/paso mínimo indispensable; confirmación clara. Sin distracciones de marca que compitan con completar.
- **CTA:** "Confirmar inscripción".
- **Nota de motion:** mínima. Foco en completar. Estados de éxito/error claros (ver §6).

---

## 5. Estratégia de contenido — Membresía

- **Intención narrativa:** convertir la admiración puntual en **relación recurrente**. La membresía es pertenencia, no un "producto más".
- **Qué siente/descubre:** *"quiero estar adentro todo el año"*.
- **Contenido — estructura recomendada:**
  1. **Promesa** de la membresía en una frase.
  2. **Qué incluye:** 3–5 beneficios concretos (contenido, comunidad, acceso, descuentos). Sin lista infinita.
  3. **Para quién es** (y para quién no) — sinceridad que genera confianza.
  4. **Prueba social** (voces de miembros, si existen).
  5. **Precio / planes** y CTA de alta.
  - `TODO(contenido)` — definición real de beneficios, planes y precio de la membresía (a definir con Flor). **No inventar precio.**
- **Jerarquía:** promesa → beneficios → precio/plan → CTA.
- **CTA:** "Quiero ser parte" / "Sumarme".
- **Nota de motion:** elegante y sobrio; reveal de beneficios escalonado; el precio no se esconde detrás de animaciones.
- **Puente narrativo:** conexión con el evento y la comunidad de Flor (mismo ecosistema).

---

## 6. Tono de los microcopys

La voz de la marca en los textos chicos es: **cálida, segura, editorial, argentina y sin relleno.** Ni fría corporativa, ni sobreactuada. Habla como Flor: con criterio y calidez, tuteando (vos), sin signos de exclamación en cascada.

**Reglas de voz:**
- Tratamiento **de "vos"** (argentino): "Sumate", "Contanos", "Mirá".
- **Verbos de acción concretos** en los CTA, nunca "Click aquí" ni "Enviar" pelado.
- **Sin jerga técnica** de e-commerce ("SKU", "checkout") de cara al usuario.
- **Honestidad**: si algo es a medida o demora, se dice. La confianza se construye siendo claro.
- **Brevedad**: un microcopy que necesita dos renglones está mal escrito.

### 6.1 CTAs (primarios y secundarios)

| Contexto | CTA recomendado (provisional) |
|---|---|
| Home → catálogo | "Ver el catálogo" |
| Home → evento | "Conocé la 8va edición" |
| PDP → compra | "Agregar al carrito" / "Comprar" (según §9 de `04`) |
| PDP → a medida | "Pedir presupuesto a medida" |
| Evento → inscripción | "Inscribirme" |
| Membresía → alta | "Quiero ser parte" |
| Contacto | "Contanos qué buscás" |
| Newsletter/footer | "Sumate a la comunidad" |

TODO(contenido): validar los CTA definitivos con Flor.

### 6.2 Labels y señales de producto

- Señales en la card/PDP: **"Desarmable"**, **"Pintable"**, **"A medida"**, **"En stock"**, **"A pedido"**.
- Precio: mostrar claro; si aplica recargo, decirlo sin letra chica engañosa. `TODO(contenido)`: fórmula exacta del recargo (~15% Mercado Pago).
- Envío: **"Envíos a todo el país"** / **"Retiro en [zona]"**. `TODO(contenido)`: zonas y tiempos reales.

### 6.3 Estados vacíos (empty states)

El vacío nunca es un callejón sin salida. Siempre: **reconocer + orientar + ofrecer salida**.

| Estado | Microcopy provisional (`TODO(contenido)`) |
|---|---|
| Filtro sin resultados | "Todavía no hay piezas con esa combinación. Probá con otro color o contanos qué buscás y lo hacemos a medida." + CTA `/contacto` |
| Carrito vacío | "Tu carrito está esperando. Volvé al catálogo y encontrá tu pieza." + CTA `/productos` |
| Categoría sin cargar | "Estamos preparando esta sección. Volvé pronto." |
| Búsqueda sin match | "No encontramos eso. Probá otra palabra o mirá el catálogo completo." |

### 6.4 Errores y 404

- Tono **humano y con guiño**, nunca técnico.
- Error recuperable: "Algo no cargó como esperábamos. Probá de nuevo en un momento." + "Reintentar".
- 404: "Esta página se fue de fiesta. Volvamos a algo lindo." + accesos a Home / catálogo / evento.
- `TODO(contenido)`: validar estos copys con Flor (los actuales son provisionales).

### 6.5 Confirmaciones y feedback

- Alta a newsletter/membresía: reconocimiento cálido, no un "Success" seco. Provisional: "Listo, ya sos parte. Te vamos a escribir pronto."
- Formulario enviado: "Recibimos tu mensaje. Te respondemos a la brevedad."
- Inscripción confirmada: mensaje de bienvenida al evento (con `EVENT_NAME`). `TODO(contenido)`.

---

## 7. Pendientes de contenido

Nada de lo siguiente debe presentarse como definitivo hasta confirmarse (checklist maestro en [`16_DECISIONS.md`](./16_DECISIONS.md)):

- `TODO(contenido)`: **`EVENT_NAME`** — nombre definitivo del evento (afecta hero de evento, S5 de Home, CTAs, confirmaciones).
- `TODO(contenido)`: **titular del hero**, **manifiesto**, **frase-puente** y **frase de cierre** de la Home.
- `TODO(contenido)`: **datos de las 7 ediciones** (números, sedes) — no inventar.
- `TODO(contenido)`: **programa, disertantes, cupo y valor** del evento — no mostrar como definitivos.
- `TODO(contenido)`: **beneficios, planes y precio** de la membresía.
- `TODO(contenido)`: **datos por producto** (medidas, material, precio, colores, tiempos, envío).
- `TODO(contenido)`: **testimonios y sponsors** reales, con permiso de uso.
- `TODO(contenido)`: **retrato, cita y bio de Flor**.
- `TODO(contenido)`: **validación de todos los microcopys** (CTAs, empty states, errores, confirmaciones) con la voz real de la marca.

---

> Este documento es **vivo**. Cuando llegue el contenido real de Flor, se reemplazan los `TODO(contenido)` acá y en el código. La documentación manda sobre el código.
