# SWEET FLOWERS DECO PARTY — PROJECT HANDOFF

**Versión 1.0** · Documento principal · Fuente de verdad del proyecto.

Toda decisión técnica, visual o funcional debe partir de este documento. Si existe una contradicción entre el código y este documento, **el documento tiene prioridad** hasta que se actualice de forma explícita.

Este handoff es el documento que recibiría un equipo senior o una agencia premium antes de escribir una línea de código. Su objetivo no es "explicar el hero": es transmitir **el producto que vamos a construir** y el negocio detrás.

---

## Índice

1. [Filosofía](#1-filosofía)
2. [Objetivo](#2-objetivo)
3. [El negocio en 2 minutos](#3-el-negocio-en-2-minutos)
4. [La experiencia](#4-la-experiencia)
5. [Cómo debe sentirse el sitio](#5-cómo-debe-sentirse-el-sitio)
6. [Experience Principles](#6-experience-principles)
7. [Motion Principles](#7-motion-principles)
8. [Quality Bar](#8-quality-bar)
9. [Claude Behavior](#9-claude-behavior)
10. [Sistema de diseño — resumen](#10-sistema-de-diseño--resumen)
11. [Arquitectura del sitio — resumen](#11-arquitectura-del-sitio--resumen)
12. [Stack técnico — resumen](#12-stack-técnico--resumen)
13. [Estado y contenido pendiente](#13-estado-y-contenido-pendiente)
14. [Cómo leer el resto de la documentación](#14-cómo-leer-el-resto-de-la-documentación)

---

## 1. Filosofía

No estamos construyendo una página web.

Estamos construyendo una **plataforma de marca**.

Cada decisión —técnica, visual, de contenido— debe reforzar la percepción de:

- **lujo**
- **calidad**
- **autoridad**
- **confianza**
- **creatividad**
- **exclusividad**

No queremos un sitio bonito. Queremos un sitio **memorable**.

Queremos que el usuario, al recorrerlo, piense:

> *"Si este sitio tiene este nivel… imaginate los eventos."*

El sitio es la **primera pieza de decoración** que la marca entrega. Si el sitio no impresiona, ninguna promesa sobre los eventos es creíble. Si el sitio impresiona, la venta ya empezó antes de la primera palabra.

---

## 2. Objetivo

Posicionar a **Sweet Flowers Deco Party** como **la empresa referente del país** en decoración de eventos y en formación del rubro.

El sitio **no** existe solo para vender productos o inscribir a un workshop. Existe para **elevar la percepción completa de la marca**. El usuario debe salir convencido de que está frente a **líderes del mercado**, no frente a "un proveedor más de decoración".

Objetivos medibles (se refinan en [`15_ROADMAP.md`](./15_ROADMAP.md) y [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md)):

- Convertir visitas en **consultas de producto** y **ventas** (catálogo → carrito/consulta → Mercado Pago / Tiendanube).
- Convertir visitas en **inscripciones al evento** (la próxima edición).
- Captar **membresías** recurrentes.
- Construir **autoridad de marca** (SEO, contenido, testimonios, ediciones anteriores, sponsors).
- Ser una pieza de **portfolio** que la propia marca pueda mostrar con orgullo.

---

## 3. El negocio en 2 minutos

> Detalle completo en [`01_BUSINESS.md`](./01_BUSINESS.md). Muchos datos son **provisionales**: dependen de las respuestas del cliente (ver §13).

**Sweet Flowers Deco Party** es una marca argentina liderada por **Flor** que opera sobre (al menos) **cuatro unidades de negocio**:

1. **Productos de decoración** para eventos: estructuras y piezas principalmente en **hierro** (campaña actual) + **fundas/telas**; MDF/madera casi no se trabajan (solo stock/promos). Se venden a color, muchas desarmables, algunas pintables. Cobros por **Mercado Pago** (recargo: precio de catálogo `/(1-0,15)` ≈ +18%). **Trabajan mayormente por pedido** (~20 días). *Tienda Nube y Mercado Libre: ya no se usan* (ver [`CONTENIDO_FLOR.md`](./CONTENIDO_FLOR.md)).
2. **Eventos / formación:** el **Sweet Flowers Event Summit** (evento del rubro, **NO** un workshop). La próxima edición es el **18 de septiembre**. Hay **7 ediciones previas**, disertantes, sponsors y testimonios. Es el principal activo de autoridad de la marca.
3. **Membresía:** acceso recurrente (contenido / beneficios / comunidad — a definir con el cliente).
4. **Marca / comunidad:** la figura de Flor, la historia, y la comunidad de alumnas/clientas que sostiene todo lo anterior.

**Por qué importa para el sitio:** el sitio tiene que hacer convivir con elegancia un **e-commerce** (catálogo, precios, envíos, pago) con una **plataforma de marca/eventos** (relato, autoridad, inscripción, membresía). No es "una tienda" ni "una landing de evento": es **ambas**, sin que ninguna canibalice a la otra.

---

## 4. La experiencia

**No copiar. Inspirarse.**

Queremos que el usuario sienta algo del orden de:

`Apple` · `Stripe` · `Linear` · `Framer` · `Awwwards` · `Studio Freight` · `Cuberto` · `Locomotive (Montreal)` · `Dogstudio` · `Active Theory` · `Obys` · `Befesti`

…pero **traducido al rubro de la decoración y los eventos**. La referencia técnica de scroll/reveal/parallax es [befesti.com](https://befesti.com) (análisis detallado en [`17_REFERENCES.md`](./17_REFERENCES.md) y [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md)). La referencia de **mood** es más editorial y cálida que Befesti: esto es **flores, fiesta y elegancia**, no música electrónica. Ver §5 y [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md).

---

## 5. Cómo debe sentirse el sitio

El sitio debe sentirse:

`cinematográfico` · `editorial` · `minimalista` · `sofisticado` · `atemporal` · `elegante` · `premium` · `muy dinámico` · `fluido` · `con personalidad`

Y **nunca**:

`genérico` · `"template"` · `recargado` · `apurado` · `predecible`

**Traducción al rubro:** cinematográfico no significa "oscuro y frío" (eso es Befesti/música). Acá cinematográfico significa **luz, textura, materia y detalle**: pétalos, telas, hierro, madera; espacios amplios; tipografía editorial; foto grande y cuidada. La sofisticación viene del **espacio en blanco, el ritmo y el movimiento**, no de saturar la pantalla.

---

## 6. Experience Principles

> Estos principios cambian **cómo** se diseña cada sección. Detalle en [`08_UX_PRINCIPLES.md`](./08_UX_PRINCIPLES.md).

- **No mostrar todo de una.** Generar **curiosidad**.
- **Crear ritmo:** alternar impacto visual ↔ descanso ↔ contenido ↔ espacio negativo.
- **Sensación de descubrimiento:** cada scroll revela algo, no lo entrega todo.
- **Cada sección sorprende** y tiene **identidad propia**. Nunca repetir el mismo layout.
- **No scroll infinito lleno de cajas.** No usar `cards` "porque sí".
- **Todo cuenta una historia:** de la materia (productos) a la experiencia (eventos) a la comunidad (membresía).
- **Jerarquía clara:** en cada pantalla el usuario sabe qué es lo más importante y qué acción tomar.

---

## 7. Motion Principles

> Detalle, tokens y recetas GSAP en [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md).

- **Toda animación tiene propósito.** Nunca animar por animar.
- La animación sirve para: **guiar la mirada**, **dar jerarquía**, **generar expectativa**, **mostrar profundidad**, **dar sensación premium**.
- El movimiento se siente **físico**, no robótico. Curvas de easing **suaves**. Nunca `linear`, salvo marquees.
- **Reveals con máscara**, no `fade` simple. Textos grandes se revelan **palabra por palabra**.
- **Imágenes con parallax.** El scroll se siente **con peso** (smooth scroll / Lenis).
- Los cambios de sección son **teatrales**, pero al servicio del contenido.
- **`prefers-reduced-motion`** siempre respetado: el sitio funciona y se ve elegante también sin movimiento.
- Referencia técnica exacta (SplitText, `yPercent 100→0`, `power3.out`, stagger ~0.07, parallax `scrub: 2.8`): ver [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md).

---

## 8. Quality Bar

Nunca aceptar una solución simplemente porque funciona. Preguntarse siempre:

- ¿Una agencia top haría esto? ¿Apple? ¿Framer? ¿Stripe?
- Si la respuesta es **no** → buscar una mejor solución.

- **Cada componente** debe ser digno de portfolio.
- **Cada animación** debe sentirse artesanal.
- **Cada interacción** debe tener intención.
- **Cada pixel** debe justificar su existencia.

Esta barra aplica **también al código**: legible, tipado, accesible, performante. Un sitio bello que carga lento o rompe en Safari **no** pasa la barra.

---

## 9. Claude Behavior

> Copia operativa en [`CLAUDE.md`](./CLAUDE.md). Se repite acá porque es parte de la biblia.

Actuás como un **Tech Lead con más de 20 años de experiencia**. Tu responsabilidad **no es obedecer**, es **construir el mejor producto posible**.

Nunca empieces escribiendo código. Primero: **analizá, pensá, criticá, proponé mejoras, explicá ventajas y desventajas, detectá problemas futuros** (deuda técnica, UX, accesibilidad, SEO, performance). Si existe una mejor solución, **proponela aunque no te la hayan pedido**.

---

## 10. Sistema de diseño — resumen

> Fuente de verdad y tokens completos en [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md). **Todo lo de abajo es PROVISIONAL** hasta recibir el manual de marca y el logo vectorial (ver §13).

- **Dirección visual (provisional):** base clara **editorial cálida** (marfil/hueso) con tinta casi negra, un **acento floral romántico** y un **acento premium champagne/dorado**. Reservamos la opción de **momentos oscuros cinematográficos** para heros o secciones puntuales.
- **Tipografía (provisional):** *display* serif editorial para titulares (elegante, atemporal) + *grotesque* geométrica neutra para cuerpo. Alternativas gratuitas propuestas en `06`.
- **Titulares** en gran tamaño, mucho **espacio negativo**, grilla amplia.
- **Tokens canónicos** (nombres que NO deben cambiar entre docs): definidos en `06` (color, tipografía, espaciado, radios) y `07` (easing, duraciones).

---

## 11. Arquitectura del sitio — resumen

> Mapa completo en [`04_SITE_ARCHITECTURE.md`](./04_SITE_ARCHITECTURE.md).

Ejes principales del sitio (nombres provisionales):

- **Home** — relato de marca + puertas a las 3 unidades de negocio.
- **Productos / Catálogo** — por material (hierro, MDF, madera, fundas y telas), producto a producto, con precio, medidas, si es desarmable/pintable, colores, envío. A medida bajo consulta.
- **Evento / Summit** — próxima edición (18/09), programa, disertantes, entrada, inscripción; y ediciones anteriores (números, sedes, testimonios, sponsors).
- **Membresía** — propuesta de valor y alta.
- **Historia / Sobre Flor** — relato de marca y autoridad.
- **Contacto** — consulta, presupuesto a medida, canales.

---

## 12. Stack técnico — resumen

> Detalle y justificación en [`10_TECH_STACK.md`](./10_TECH_STACK.md) y [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md).

- **Next.js (App Router) + TypeScript estricto + Tailwind CSS.**
- **GSAP** (ScrollTrigger + SplitText, ambos gratuitos) + **Lenis** para smooth scroll.
- **Deploy en Vercel.** Imágenes con `next/image`, fuentes con `next/font`.
- **E-commerce:** DECIDIDO — **propio desde 0 + Mercado Pago**, con **Payload** como motor y **panel a medida** (ADR-007/011/013). Tienda Nube/ML descartados. Ver [`16_DECISIONS.md`](./16_DECISIONS.md).

---

## 13. Estado y contenido pendiente

El sitio se está **bocetando con placeholders**. El contenido real fue **solicitado** al cliente (22 preguntas + estructura de carpetas). Nada duro (precio, cupo, fecha, nombre) debe presentarse como real hasta recibirlo.

**Bloqueantes principales (ver checklist en [`16_DECISIONS.md`](./16_DECISIONS.md)):**

- Logo **vectorial** (`.ai/.eps/.svg`) + manual de marca (colores y tipografías reales).
- ~~Nombre definitivo del evento del 18/09~~ → **DECIDIDO: "Sweet Flowers Event Summit"** (ADR-008). Es un summit/evento, no un workshop.
- **Listado maestro de productos** (medidas, material, desarmable, pintable, colores, precios, top 10 más vendidos).
- Envíos, pagos, tiempos de fabricación, cambios/garantía.
- **Historia real** de la empresa + bio de Flor + equipo.
- **Programa del evento**, entrada/cupo, inscripción, números de las 7 ediciones, testimonios (con permiso), sponsors.
- Fotos de producto (fondo limpio) y en uso (montado en evento), fotos de Flor, video (SweetDay + bruto).

---

## 14. Cómo leer el resto de la documentación

- **Empezá siempre por:** [`CLAUDE.md`](./CLAUDE.md) → este handoff.
- **Para diseñar una sección:** `08_UX_PRINCIPLES` → `05_CONTENT_STRATEGY` → `06_DESIGN_SYSTEM` → `07_MOTION_SYSTEM` → `09_UI_PRINCIPLES`.
- **Para escribir código:** `10_TECH_STACK` → `13_DEVELOPMENT_STANDARDS` → `12_COMPONENT_GUIDELINES`.
- **Para entender el negocio:** `01_BUSINESS` → `02_BRAND` → `03_TARGET_AUDIENCE`.
- **Decisiones y dudas abiertas:** `16_DECISIONS` (es un documento **vivo**; actualizalo).

> Recordá la regla de oro: **la documentación manda sobre el código.** Si vas a desviarte, primero actualizá el doc.
