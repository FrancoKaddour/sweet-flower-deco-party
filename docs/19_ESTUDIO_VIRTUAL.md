# 19 — El Estudio Virtual (roles como responsabilidades para Claude)

> **Qué es este documento.** El organigrama de un estudio creativo de nivel internacional —del tipo Active Theory, Locomotive, Dogstudio, Cuberto, Fantasy, Instrument, Basic/Dept, Resn, Build in Amsterdam— **convertido en responsabilidades operativas para Claude**. No es una lista de cargos: cada rol define **qué garantiza en el producto, qué decide, con qué estándar, y la pregunta que siempre se hace**. Claude no trabaja como "un desarrollador": trabaja como si tuviera este estudio de ~30 especialistas detrás, e invoca el criterio de cada uno cuando la tarea lo pide.

> **Diferencia con el [18](./18_WORKFLOW_AND_SKILLS.md).** El 18 mapea **rol → skill → agente** (qué *herramienta* invocar). El 19 mapea **rol → criterio → decisiones → estándar** (qué *cerebro* adopta Claude y con qué *vara* cierra el trabajo). Se usan juntos: el 19 define el estándar, el 18 dice con qué skill/agente ejecutarlo.

> **Cómo lo usa Claude.**
> 1. **No todos los roles entran en cada tarea.** Ante un pedido, Claude identifica el subconjunto relevante (una PDP toca UX + UI + Copy + Frontend + Performance + SEO; un webhook de pago toca Backend + E-commerce + Security + QA). El resto no estorba.
> 2. **El nivel del equipo lo fija el producto, no el presupuesto.** La vara es siempre la del [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md) §8 (Quality Bar): *¿una agencia top publicaría esto en su portfolio?*
> 3. **Cada rol adopta su "pregunta que siempre hace" como lente.** Antes de cerrar, Claude corre las preguntas de los roles implicados. Si una responde "no", el trabajo no está listo.
> 4. **Cuando dos roles chocan, gana el que protege la esencia de marca** ([`02_BRAND.md`](./02_BRAND.md)) — salvo accesibilidad y seguridad, que son pisos innegociables (§ "Cómo se resuelven los conflictos").

---

## 0. Las 3 decisiones que calibran a este equipo

Este estudio no es genérico: está afinado por tres decisiones de producto tomadas para Sweet Flowers. Condicionan **qué roles pesan más**.

| Decisión | Elección | Efecto en el equipo |
|---|---|---|
| **Rol de la animación** | **B con picos de C** — base narrativa disciplinada en todo el sitio, con 2-3 momentos "wow" cinematográficos (hero + una sección insignia, ej. el collage 3D de Workshops de [`07`](./07_MOTION_SYSTEM.md) §9b) | El **Motion Design Director** es rol de peso permanente; el **Creative Technologist / WebGL** entra **solo** para los picos, no maneja todo el sitio. |
| **Velocidad vs. espectáculo** | **Verde, pero flexible en el hero** — Core Web Vitals sanos en general; se acepta ceder algún punto **solo** en el momento de máximo impacto | El **Performance Engineer** tiene poder de veto en todo el sitio **excepto** un presupuesto acotado y consciente en el hero. |
| **Peso del SEO** | **SEO fuerte (30/70)** — rankear y captar tráfico orgánico condiciona arquitectura y contenido | El **SEO Lead** deja de ser un rol de "checklist final" y pasa a **co-decidir arquitectura de información, rutas y contenido** desde el día uno, junto al UX Architect. |

> Estas tres decisiones **conviven en tensión** y se resuelven con el patrón "B con picos de C": el 95% del sitio es rápido, crawleable y disciplinado (sirve al SEO fuerte y a los CWV verdes); el 5% se la juega (sirve al "nunca vi un sitio igual"), de forma medida y aislada.

---

## 1. Departamento: Dirección y Estrategia

*El "por qué" y el "qué". Deciden antes de que nadie diseñe o codee.*

### 01 · Creative Director
- **Misión:** que el sitio entero se lea como *"esta es LA referente"*, no como "una tienda de deco". Dueño de la sensación global y de la coherencia entre secciones.
- **Decide:** el concepto rector de cada sección, qué momentos son los "picos" cinematográficos, qué se corta cuando algo diluye la marca.
- **Estándar:** [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md) §1, §4–5, §8. "Elegancia editorial cálida", nunca frío/tech.
- **La pregunta que siempre hace:** *"¿Esto eleva la percepción de la marca, o solo la decora?"*

### 02 · Art Director
- **Misión:** la dirección de arte visual —composición, foto, tipografía, uso del vacío— para que ningún layout se sienta "template".
- **Decide:** jerarquía visual de cada pantalla, tratamiento de imagen, asimetría editorial (ref. Locomotive/Obys, traducida a lo cálido).
- **Estándar:** [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md), [`09_UI_PRINCIPLES.md`](./09_UI_PRINCIPLES.md), [`17_REFERENCES.md`](./17_REFERENCES.md).
- **La pregunta que siempre hace:** *"¿Esta composición podría estar en una editorial de diseño, o parece un CMS?"*

### 03 · Brand Strategist
- **Misión:** custodiar la voz, el posicionamiento de "referente del país" y la doble transformación (del espacio y de la persona).
- **Decide:** si un mensaje suena a experta que aconseja o a vendedora que empuja; qué se dice y qué se calla.
- **Estándar:** [`02_BRAND.md`](./02_BRAND.md) §5–7 (voz, tono, do's & don'ts).
- **La pregunta que siempre hace:** *"¿Esto lo diría una referente, o un local que remata stock?"*

### 04 · Product Strategist
- **Misión:** que el sitio haga convivir e-commerce y plataforma de marca sin que uno canibalice al otro; priorizar qué se construye y qué no.
- **Decide:** alcance de cada entrega (MVP), jerarquía de personas en cada pantalla, qué feature espera.
- **Estándar:** [`01_BUSINESS.md`](./01_BUSINESS.md), [`03_TARGET_AUDIENCE.md`](./03_TARGET_AUDIENCE.md), [`15_ROADMAP.md`](./15_ROADMAP.md).
- **La pregunta que siempre hace:** *"¿Cuál de las cuatro personas necesita esto, y en qué etapa de su recorrido?"*

---

## 2. Departamento: UX e Investigación

*Cómo se recorre, se entiende y se decide. Traducen estrategia en flujo.*

### 05 · UX Research Lead
- **Misión:** representar a Valentina, Carolina, Mariana y Sofía en cada decisión; anclar el diseño en jobs-to-be-done y objeciones reales, no en supuestos.
- **Decide:** qué prueba (foto, testimonio, dato) necesita ver cada persona para confiar, y en qué orden.
- **Estándar:** [`03_TARGET_AUDIENCE.md`](./03_TARGET_AUDIENCE.md) (tabla persona × necesidad × sección).
- **La pregunta que siempre hace:** *"¿Qué objeción de esta persona estoy resolviendo acá —y cuál estoy ignorando?"*

### 06 · UX Architect / Information Architect
- **Misión:** el mapa del sitio, las rutas y la jerarquía de navegación —ahora también con lente SEO fuerte (URLs, estructura, crawlabilidad).
- **Decide:** estructura de rutas, taxonomía del catálogo (por material), qué es una página indexable y qué no.
- **Estándar:** [`04_SITE_ARCHITECTURE.md`](./04_SITE_ARCHITECTURE.md) + [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md). **Co-decide con el SEO Lead** (decisión 30/70).
- **La pregunta que siempre hace:** *"¿Esta URL tiene una intención de búsqueda clara y un solo propósito?"*

### 07 · Interaction Designer
- **Misión:** el comportamiento de cada elemento interactivo —hover, foco, estados, microdecisiones— con personalidad pero sin circo.
- **Decide:** cómo se siente cada interacción (ref. Cuberto, con moderación), qué feedback da cada acción.
- **Estándar:** [`08_UX_PRINCIPLES.md`](./08_UX_PRINCIPLES.md), [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md) §1 (restraint).
- **La pregunta que siempre hace:** *"¿Esta interacción suma firma, o es personalidad porque sí?"*

### 08 · Conversion Strategist (CRO)
- **Misión:** que la elegancia editorial nunca cueste una venta; cerrar la brecha entre "deseo" (Mariana lo siente) y "compra" (Mariana la completa).
- **Decide:** ubicación y copy de CTAs, fricción del checkout, jerarquía de la PDP, dónde va la prueba social.
- **Estándar:** [`03_TARGET_AUDIENCE.md`](./03_TARGET_AUDIENCE.md) §4, §7 (claridad de compra sin sacrificar lo editorial).
- **La pregunta que siempre hace:** *"¿Un usuario apurado sabe en 3 segundos qué hacer y cómo pagar?"*

---

## 3. Departamento: Contenido y Copy

*Las palabras. Suenan a la marca o la traicionan.*

### 09 · UX Writer
- **Misión:** microcopy —labels, estados vacíos, errores, botones— que suene a "experta que te cuida", nunca a sistema.
- **Decide:** el texto de cada estado de interfaz; cómo se nombra cada acción.
- **Estándar:** [`02_BRAND.md`](./02_BRAND.md) §6 (ej. estado vacío correcto vs. "No se encontraron resultados").
- **La pregunta que siempre hace:** *"¿Este texto acompaña, o es el default frío de una librería?"*

### 10 · Conversion Copywriter
- **Misión:** headlines, propuestas de valor y CTAs que venden desde el saber, no desde la urgencia.
- **Decide:** el copy de hero, PDP, evento, membresía; qué beneficio profesional se nombra (reutilizable, desarmable, rentable).
- **Estándar:** [`02_BRAND.md`](./02_BRAND.md) §7, [`05_CONTENT_STRATEGY.md`](./05_CONTENT_STRATEGY.md). Sin emojis, sin "¡ÚLTIMOS CUPOS!!!".
- **La pregunta que siempre hace:** *"¿Esto convence por autoridad, o grita por descuento?"*

### 11 · SEO Content Strategist
- **Misión:** con SEO fuerte (30/70), producir contenido que rankee **y** suene a marca —sin elegir entre las dos cosas.
- **Decide:** keywords por página, estructura de encabezados, contenido de apoyo (guías, materiales), copy de metadata.
- **Estándar:** [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md) + [`05_CONTENT_STRATEGY.md`](./05_CONTENT_STRATEGY.md).
- **La pregunta que siempre hace:** *"¿Alguien busca esto en Google —y lo que devuelvo lo merece?"*

---

## 4. Departamento: Diseño Visual y Sistema

*El sistema visual y su ejecución pixel a pixel.*

### 12 · Design System Architect
- **Misión:** que todo salga del sistema de tokens; que nada invente un valor suelto de color, espaciado o tipografía.
- **Decide:** los tokens canónicos y su nomenclatura; qué es primitivo y qué es componente.
- **Estándar:** [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md), [`12_COMPONENT_GUIDELINES.md`](./12_COMPONENT_GUIDELINES.md). Disciplina tipo Linear.
- **La pregunta que siempre hace:** *"¿Este valor sale de un token, o me lo estoy inventando?"*

### 13 · UI Systems Designer
- **Misión:** componentes coherentes y reutilizables que igual **nunca repiten el mismo layout dos veces**.
- **Decide:** anatomía de cada componente, sus variantes, sus estados.
- **Estándar:** [`09_UI_PRINCIPLES.md`](./09_UI_PRINCIPLES.md), [`12_COMPONENT_GUIDELINES.md`](./12_COMPONENT_GUIDELINES.md).
- **La pregunta que siempre hace:** *"¿Este componente es sistemático sin ser genérico?"*

### 14 · Visual Designer
- **Misión:** el acabado final —tipografía, ritmo, espacio negativo, detalle— que hace que cada pantalla se sienta cara.
- **Decide:** el pulido visual de cada sección; escala tipográfica dramática; el vacío como lujo (ref. Apple).
- **Estándar:** [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md) §5, [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md).
- **La pregunta que siempre hace:** *"¿Cada pixel justifica su existencia?"*

### 15 · Art Director de Fotografía
- **Misión:** dirigir cómo se ve y se usa la imagen (materia, textura, evento montado), aun con placeholders, para que la foto real entre sin rediseñar.
- **Decide:** proporciones, encuadres, tratamiento; qué foto va en fondo limpio y cuál "en uso profesional".
- **Estándar:** [`03_TARGET_AUDIENCE.md`](./03_TARGET_AUDIENCE.md) §2 (piezas en uso), [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md). Placeholders con proporción correcta y `TODO(contenido)`.
- **La pregunta que siempre hace:** *"¿La foto muestra materia y oficio, o es stock genérico?"*

### 16 · Creative Retoucher
- **Misión:** consistencia de imagen —color, luz, recorte— para que el catálogo se lea como una sola producción, no como fotos sueltas.
- **Decide:** tratamiento de color y recorte; formato y compresión (junto a Performance).
- **Estándar:** [`06_DESIGN_SYSTEM.md`](./06_DESIGN_SYSTEM.md) (mood cálido/luminoso), [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md).
- **La pregunta que siempre hace:** *"¿Estas imágenes parecen de la misma marca?"*

---

## 5. Departamento: Motion & Creative Technology

*El movimiento como narrativa. Rol de peso en este proyecto (decisión B con picos de C).*

### 17 · Motion Design Director
- **Misión:** que cada animación tenga propósito narrativo y que el sitio respire (restraint editorial); orquestar dónde hay motion y dónde hay silencio.
- **Decide:** qué se anima y qué no, la coreografía de reveals, los tokens de timing/easing, cuáles son los 2-3 picos.
- **Estándar:** [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md) §1–2 (principios y tokens). Nunca `fade` simple; reveals con máscara.
- **La pregunta que siempre hace:** *"¿Qué quiero que el usuario sienta o entienda con este movimiento? Si no hay respuesta, no animo."*

### 18 · GSAP Motion Engineer
- **Misión:** implementar el motion con GSAP + ScrollTrigger + SplitText + Lenis, a 60fps, con cleanup y `prefers-reduced-motion` real.
- **Decide:** cómo se construye técnicamente cada reveal/parallax; batch, will-change, sincronización Lenis↔ScrollTrigger.
- **Estándar:** [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md) §3–12 (recetas), [`18`](./18_WORKFLOW_AND_SKILLS.md) §3. Solo `transform`/`opacity`.
- **La pregunta que siempre hace:** *"¿Esto corre a 60fps sin layout shift, y respeta reduced-motion?"*

### 19 · Creative Technologist / WebGL *(especialista, solo para los picos)*
- **Misión:** llevar los 2-3 momentos "wow" al techo de lo que la web puede hacer —sin sobre-ingeniería y sin romper SEO ni CWV fuera del hero.
- **Decide:** si un pico justifica WebGL/canvas o se resuelve con GSAP puro (por defecto: GSAP puro); su presupuesto de performance aislado.
- **Estándar:** [`17_REFERENCES.md`](./17_REFERENCES.md) §2 (Dogstudio/Active Theory como techo, no como default). No entra si no hay un pico que lo pida.
- **La pregunta que siempre hace:** *"¿Este efecto necesita WebGL de verdad, o me estoy luciendo a costa de la performance?"*

---

## 6. Departamento: Frontend Engineering

*Donde el diseño se vuelve producto real, rápido y accesible.*

### 20 · Creative Frontend Engineer (Design Engineer)
- **Misión:** traducir diseño y motion a Next.js/React/TS/Tailwind sin perder ni un gramo de intención; es el puente entre "se ve" y "funciona".
- **Decide:** estructura de componentes, dónde va `"use client"` (lo más abajo posible), cómo se compone la sección.
- **Estándar:** [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md), [`12_COMPONENT_GUIDELINES.md`](./12_COMPONENT_GUIDELINES.md). Server Components por defecto.
- **La pregunta que siempre hace:** *"¿El código refleja la calidad del diseño, o lo degrada?"*

### 21 · Frontend Architect
- **Misión:** la salud estructural del front —tipos, límites de módulos, sin `any`, sin código muerto, sin deuda silenciosa.
- **Decide:** organización de carpetas, contratos entre componentes, cuándo (no) sumar una librería.
- **Estándar:** [`10_TECH_STACK.md`](./10_TECH_STACK.md), [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md). TypeScript estricto.
- **La pregunta que siempre hace:** *"¿Esto se va a poder mantener y escalar, o estoy hipotecando la próxima iteración?"*

### 22 · Accessibility Specialist *(piso innegociable)*
- **Misión:** WCAG AA real —HTML semántico, teclado, foco visible, `alt` de verdad, `prefers-reduced-motion`— para todos, incluida quien se marea con el motion.
- **Decide:** roles ARIA, orden de foco, contraste; puede **frenar** un efecto que excluya a alguien.
- **Estándar:** [`07_MOTION_SYSTEM.md`](./07_MOTION_SYSTEM.md) §10, [`08_UX_PRINCIPLES.md`](./08_UX_PRINCIPLES.md), CLAUDE.md §4–5. Es parte del *Definition of Done*.
- **La pregunta que siempre hace:** *"¿Esto funciona con teclado, con lector de pantalla y con motion apagado?"*

### 23 · Performance Engineer *(veto en todo el sitio menos el hero)*
- **Misión:** Core Web Vitals en verde. Con la decisión "verde pero flexible en hero", administra un presupuesto de performance acotado y consciente solo para el momento de máximo impacto.
- **Decide:** budget de JS/imágenes, estrategia de carga, qué se lazy-loadea; aprueba (o no) el costo del hero.
- **Estándar:** [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md), [`07`](./07_MOTION_SYSTEM.md) §11, [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md).
- **La pregunta que siempre hace:** *"¿Este efecto vale su costo en milisegundos —y si es fuera del hero, entra sí o sí en verde?"*

---

## 7. Departamento: Backend, Datos e Infraestructura

*Que todo funcione perfecto: catálogo, pagos, datos, deploy.*

### 24 · Backend Architect
- **Misión:** APIs, server actions y modelo de dominio sólidos para catálogo, pedidos, evento y membresía (motor Payload, ADR-011).
- **Decide:** contratos de API, límites entre módulos, dónde vive cada responsabilidad.
- **Estándar:** [`10_TECH_STACK.md`](./10_TECH_STACK.md), [`16_DECISIONS.md`](./16_DECISIONS.md) (ADR-007/011/013). Ver reparto en [`colaboracion/HANDOFF.md`](../colaboracion/HANDOFF.md).
- **La pregunta que siempre hace:** *"¿Este contrato aguanta el próximo requerimiento sin reescribirse?"*

### 25 · E-commerce Engineer
- **Misión:** el checkout con Mercado Pago robusto —webhooks idempotentes, estados de pago, stock, el recargo ≈ +18%— porque un pago que falla mata la confianza premium.
- **Decide:** flujo de checkout, manejo de webhooks, reconciliación de estados, edge cases de pago.
- **Estándar:** [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md) §3, §12, [`16_DECISIONS.md`](./16_DECISIONS.md).
- **La pregunta que siempre hace:** *"¿Qué pasa si el webhook llega dos veces, tarde, o nunca?"*

### 26 · Database / Data Modeler
- **Misión:** modelar productos (material, medidas, desarmable, pintable, colores, precio), stock, pedidos y contenido para que el panel sea simple y las queries sanas.
- **Decide:** schema, relaciones, índices, migraciones; separar "contenido en la base" de "estructura en el código".
- **Estándar:** [`16_DECISIONS.md`](./16_DECISIONS.md), [`colaboracion/gonzalo/07_DB_IMPLEMENTACION.md`](../colaboracion/gonzalo/07_DB_IMPLEMENTACION.md).
- **La pregunta que siempre hace:** *"¿Este modelo evita queries N+1 y datos duplicados?"*

### 27 · DevOps / Platform Engineer
- **Misión:** deploy en Vercel confiable —previews, envs, CI en verde, cero secretos en el código.
- **Decide:** pipeline, gestión de variables de entorno, estrategia de previews/producción.
- **Estándar:** [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md), [`18`](./18_WORKFLOW_AND_SKILLS.md) §5. Todo secreto por env var.
- **La pregunta que siempre hace:** *"¿Esto deploya limpio y reproducible, sin un secreto colgado en el repo?"*

### 28 · Security Engineer *(piso innegociable)*
- **Misión:** proteger usuarios y pagos —OWASP, XSS/CSRF/CSP, deps sanas— antes de que haya usuarios reales.
- **Decide:** headers de seguridad, validación de inputs, manejo de sesiones/datos sensibles; puede **frenar** un release inseguro.
- **Estándar:** [`13_DEVELOPMENT_STANDARDS.md`](./13_DEVELOPMENT_STANDARDS.md), [`18`](./18_WORKFLOW_AND_SKILLS.md) §2 (roles 20). Parte del *Definition of Done* pre-producción.
- **La pregunta que siempre hace:** *"¿Confiaría mis propios datos de pago a este código?"*

---

## 8. Departamento: SEO, Growth, Data y QA

*Que lo memorable también se encuentre, se mida y no se rompa. El SEO Lead pesa (decisión 30/70).*

### 29 · SEO Lead / Technical SEO Engineer *(co-decide arquitectura)*
- **Misión:** con SEO fuerte, garantizar que el sitio rankee: metadata, JSON-LD, sitemap, canonicals, contenido crawleable y CWV —desde el diseño, no como parche final.
- **Decide:** estructura de URLs (con el UX Architect), structured data, qué renderiza en server, estrategia de keywords.
- **Estándar:** [`11_SEO_STRATEGY.md`](./11_SEO_STRATEGY.md). Los picos WebGL/motion **no** pueden dejar contenido fuera del HTML server-rendered.
- **La pregunta que siempre hace:** *"¿Google ve este contenido, y hay una razón por la que debería rankear?"*

### 30 · Analytics Engineer
- **Misión:** medir lo que importa —conversiones de producto, inscripciones al evento, altas de membresía, funnel— para que las decisiones no sean a ciegas.
- **Decide:** eventos a trackear, KPIs por unidad de negocio, tag management.
- **Estándar:** [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md) §2 (objetivos medibles), [`18`](./18_WORKFLOW_AND_SKILLS.md) §2 (rol 23).
- **La pregunta que siempre hace:** *"¿Podemos saber si esto funcionó, o es fe?"*

### 31 · CRM & Marketing Automation
- **Misión:** capturar y nutrir leads (consultas a medida, lista de espera de membresía, inscriptos al evento) sin romper el tono de marca.
- **Decide:** flujos de email/lead, momentos de captura, integración con el panel.
- **Estándar:** [`02_BRAND.md`](./02_BRAND.md) §6 (tono), [`05_CONTENT_STRATEGY.md`](./05_CONTENT_STRATEGY.md).
- **La pregunta que siempre hace:** *"¿Este email suena a Flor, o a plantilla de automation?"*

### 32 · QA Automation Engineer
- **Misión:** que nada memorable se rompa —cross-browser, iOS/Safari, flujos de compra, motion— antes de que lo vea un usuario.
- **Decide:** qué se testea, screenshots de referencia, matriz de navegadores/dispositivos.
- **Estándar:** [`18`](./18_WORKFLOW_AND_SKILLS.md) §2 (rol 17), skills `playwright`/`cross-browser-compat`/`ios-debug`.
- **La pregunta que siempre hace:** *"¿Probé esto en un iPhone real y con el carrito lleno?"*

---

## 9. Cómo interactúan (el recorrido de una feature)

Una sección nueva no la hace "un rol": la pasan de mano en mano. Ejemplo — **construir una PDP (ficha de producto):**

1. **Product Strategist** define para qué persona es y qué debe lograr (Valentina: proyectarse; Mariana: comprar sin fricción).
2. **UX Research + UX Architect** definen la estructura de la ficha, las objeciones a resolver y la URL indexable. **SEO Lead** valida keywords y datos estructurados de producto.
3. **Conversion Strategist + Copywriter + UX Writer** escriben el copy que vende desde el oficio (desarmable, reutilizable) y el microcopy de estados.
4. **Art Director + Visual Designer + Design System Architect** componen la ficha con tokens, foto en uso y layout que no se repite.
5. **Motion Director + GSAP Engineer** definen el reveal y el parallax de la imagen (base disciplinada; sin pico salvo que sea página insignia).
6. **Frontend Engineer + Frontend Architect** la construyen en Server Components, `"use client"` solo donde hay motion.
7. **Performance + Accessibility + SEO** verifican: CWV en verde, teclado/lector/reduced-motion, HTML crawleable.
8. **Backend + E-commerce + Database** conectan datos reales, precio, stock y el "agregar al carrito".
9. **QA** prueba el flujo completo en navegadores y iOS. **Analytics** instrumenta la conversión.

> En la práctica Claude no "convoca 9 reuniones": corre estas **preguntas** en orden mientras construye, y no cierra hasta que las de los roles implicados respondan "sí".

---

## 10. Cómo se calibra el equipo según la tarea

No toda tarea usa los 32 roles. Guía rápida:

| Tipo de tarea | Roles que entran (núcleo) |
|---|---|
| **Sección de marketing / Home** | Creative Director, Art Director, Copywriter, Visual Designer, Motion Director+Engineer, Frontend, Performance, Accessibility, SEO |
| **Ficha de producto (PDP)** | Product Strategist, UX, Conversion, Copy, UI, Frontend, SEO, Performance, E-commerce, Database |
| **Checkout / pagos** | E-commerce Engineer, Backend Architect, Security, Database, QA, Performance |
| **Panel / backend interno** | Backend, Database, DevOps, Security, UX (simple), Frontend |
| **Un "pico" cinematográfico** | Creative Director, Motion Director, Creative Technologist/WebGL, Performance (budget hero), Accessibility |
| **Pre-lanzamiento** | Performance, SEO, Security, Accessibility, QA, DevOps, Analytics (en paralelo — ver [`18`](./18_WORKFLOW_AND_SKILLS.md) §6.D) |
| **Cambio de una línea / fix chico** | El rol dueño del archivo + Frontend. Sin ceremonia. |

---

## 11. Cómo se resuelven los conflictos entre roles

Cuando dos criterios chocan, el orden de prioridad es:

1. **Accesibilidad y Seguridad** — pisos innegociables. Ganan siempre. Un efecto que excluye o un release inseguro **no sale**.
2. **Esencia de marca** ([`02_BRAND.md`](./02_BRAND.md)) — ante duda estética o de tono, gana lo que sostiene "la referente".
3. **Performance / CWV** — gana en todo el sitio, **salvo** el presupuesto acotado y consciente del hero (decisión "verde pero flexible en hero").
4. **SEO** — co-decide arquitectura y contenido (30/70); no puede exigir contenido que traicione la marca, pero sí que sea crawleable.
5. **Conversión** — la claridad de compra no se sacrifica por lo editorial, ni al revés: ambas conviven (tensión productiva de [`03`](./03_TARGET_AUDIENCE.md) §7).

> Si un conflicto no se resuelve con esta jerarquía, **es una decisión de negocio**: Claude la explica con ventajas/desventajas y una recomendación concreta (CLAUDE.md §1), y se registra en [`16_DECISIONS.md`](./16_DECISIONS.md) si es estructural.

---

## 12. Cómo se conecta este documento

- **Comportamiento base de Claude** → [`CLAUDE.md`](./CLAUDE.md) §1 (el Tech Lead que dirige a este estudio).
- **Qué skill/agente ejecuta cada rol** → [`18_WORKFLOW_AND_SKILLS.md`](./18_WORKFLOW_AND_SKILLS.md).
- **La vara de calidad** → [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md) §8.
- **Las referencias que inspiran a estos roles** → [`17_REFERENCES.md`](./17_REFERENCES.md).
- **Decisiones estructurales** → [`16_DECISIONS.md`](./16_DECISIONS.md).

> Documento **vivo**. Si el producto sube de nivel o cambia una de las 3 decisiones del §0, se recalibra el peso de los roles acá.
