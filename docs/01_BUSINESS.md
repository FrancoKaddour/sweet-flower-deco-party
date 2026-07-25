# 01 — NEGOCIO

**Versión 1.0** · Capítulo "Negocio" de la Project Bible.

> Este documento describe **qué es** Sweet Flowers Deco Party como negocio, **cómo gana dinero**, y **qué le pedimos al sitio** que haga por él. Es el mapa del terreno sobre el que se construye todo lo demás: la marca ([`02_BRAND.md`](./02_BRAND.md)), la audiencia ([`03_TARGET_AUDIENCE.md`](./03_TARGET_AUDIENCE.md)) y la arquitectura del sitio ([`04_SITE_ARCHITECTURE.md`](./04_SITE_ARCHITECTURE.md)).
>
> **Regla de honestidad:** muchos datos duros de este documento (precios, cupos, márgenes, números de ediciones) son **provisionales** y dependen de las respuestas del cliente. Están marcados como `TODO(contenido): …`. Nada marcado así debe presentarse en el sitio como si fuera real. Ver también §13 de [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md).

---

## 1. Qué es Sweet Flowers Deco Party

Sweet Flowers Deco Party es una **marca argentina de decoración de eventos** liderada por **Flor**. En la superficie parece un proveedor de estructuras y piezas decorativas; en la práctica es algo bastante más ambicioso: **un ecosistema de marca** que combina un negocio de productos físicos con un negocio de conocimiento (formación) y un negocio de comunidad (membresía y figura de autora).

Esa combinación es lo que la hace difícil de copiar y lo que justifica el nivel del sitio. Un competidor puede vender un arco de hierro parecido; lo que no puede replicar de un día para otro es **la autoridad acumulada de siete ediciones de un evento del rubro**, una comunidad de alumnas que ya confían en Flor, y una voz de marca reconocible. El negocio, entonces, no vende "objetos": vende **la certeza de que quien te vende sabe más que vos del oficio**. Eso cambia por completo cómo debe comunicar el sitio.

Estratégicamente, Sweet Flowers no compite en precio. Compite en **estatus profesional**: ser la marca con la que una emprendedora del rubro *quiere ser vista trabajando*. Ese posicionamiento —desarrollado en [`02_BRAND.md`](./02_BRAND.md)— es el que sostiene los márgenes y el que hace que la formación tenga demanda.

---

## 2. Las cuatro unidades de negocio en detalle

El negocio opera sobre cuatro unidades que se retroalimentan. No son cuatro negocios separados: son **cuatro etapas de una misma relación con el cliente**, que idealmente empieza comprando un producto y termina siendo parte de la comunidad.

### 2.1 Productos de decoración para eventos

Es la unidad más tangible y, hoy, probablemente la de mayor volumen. Consiste en **estructuras y piezas decorativas** para montar eventos: arcos, paneles, cilindros, bases, repisas, letras, tótems, mesas auxiliares, y las **fundas y telas** que las visten. Los materiales principales son **hierro, MDF, madera y textiles**.

Características comerciales que condicionan el sitio:

- **Se venden a color.** El color es una decisión de compra, no un detalle. El catálogo tiene que dejar elegir/consultar color con la misma jerarquía con la que se elige un talle en indumentaria.
- **Muchas piezas son desarmables.** Esto es un argumento de venta fuerte para el público profesional: se guardan y transportan mejor. Debe comunicarse como beneficio, no esconderse en la ficha técnica.
- **Algunas son pintables.** El cliente puede reutilizar la misma estructura pintándola para otro evento. Es sustentabilidad + rentabilidad para la clienta profesional: un mismo objeto sirve para veinte fiestas.
- **Conviven stock y a medida.** Ver §5.

**Cómo gana dinero:** margen sobre producto físico. El precio se sostiene por diseño, calidad de terminación y —clave— por la marca. La misma pieza sin la marca Sweet Flowers vale menos.

### 2.2 Eventos / formación (el Workshop / Summit)

Es el **principal activo de autoridad** de la marca. Un evento del rubro —workshop/summit— del que se realiza la **8.ª edición el 18 de septiembre**, con **7 ediciones previas**, disertantes, sponsors y testimonios acumulados.

Este activo hace tres cosas a la vez:

1. **Genera ingresos directos** (venta de entradas/inscripciones, y probablemente sponsors).
2. **Construye autoridad** que sube el valor percibido de *todas* las demás unidades. Quien organiza el evento más importante del rubro no es "una vendedora de arcos": es *la referente*.
3. **Alimenta la comunidad y la membresía**: cada edición deja alumnas nuevas que entran al ecosistema.

**Cómo gana dinero:** entradas/inscripciones + sponsors + venta cruzada (asistentes que después compran productos o se suman a la membresía). El evento es, en términos de marketing, el **motor de adquisición de clientes de mayor valor**.

> `TODO(contenido):` nombre definitivo del evento del 18/09 (¿"8vo Workshop" o "Sweet Flowers Event Summit"?), programa, disertantes, tipos de entrada, cupo, precio, y números de las 7 ediciones (asistentes, sedes, años). Lo completa el cliente. Hasta entonces, en el código se usa la constante `EVENT_NAME` en un solo lugar (ver [`CLAUDE.md`](./CLAUDE.md) §6).

### 2.3 Membresía

Acceso **recurrente** al ecosistema de Sweet Flowers. Su contenido exacto está **a definir con el cliente**, pero conceptualmente cubre alguna combinación de: contenido formativo continuo, beneficios/descuentos en productos, acceso anticipado o preferencial al evento, y pertenencia a una comunidad de profesionales del rubro.

Es la unidad estratégicamente más valiosa a largo plazo porque introduce **ingreso recurrente (MRR)** en un negocio que hoy depende de ventas transaccionales. Una clienta que paga una membresía mensual/anual vale mucho más, y de forma más predecible, que una compra única.

**Cómo gana dinero:** suscripción recurrente. El desafío no es cobrarla: es **justificar la recurrencia** (que la clienta perciba valor mes a mes). Por eso el sitio debe presentar la membresía como *pertenencia a un círculo profesional*, no como "un plan de descuentos".

> `TODO(contenido):` definición del producto de membresía — qué incluye exactamente, niveles/precios, periodicidad, beneficios concretos. Es la decisión de negocio más importante pendiente. Lo define el cliente. Ver [`16_DECISIONS.md`](./16_DECISIONS.md).

### 2.4 Marca / comunidad (Flor + alumnas/clientas)

No factura directamente, pero **es el activo que hace rentables a los otros tres**. La figura de **Flor** como autora y referente, la historia de la empresa, y la comunidad de alumnas y clientas son el *capital reputacional* que permite cobrar más por producto, llenar el evento y sostener la membresía.

**Cómo "gana dinero":** de forma indirecta, elevando el poder de fijación de precios (*pricing power*) y bajando el costo de adquisición de las otras tres unidades. La comunidad es el canal orgánico más barato y más creíble que tiene el negocio. Ver el rol de Flor como cara de marca en [`02_BRAND.md`](./02_BRAND.md) §7.

---

## 3. El motor de negocio (cómo se retroalimentan las unidades)

La forma correcta de leer el negocio no es "cuatro cajas", sino **un volante de inercia (flywheel)**:

```
COMUNIDAD (Flor) ──autoridad──▶ EVENTO ──alumnas nuevas──▶ PRODUCTOS
      ▲                                                        │
      │                                                        │
      └────────── MEMBRESÍA ◀──recurrencia── clientas fieles ──┘
```

1. La **comunidad** y la figura de Flor dan autoridad.
2. Esa autoridad **llena el evento**.
3. El evento genera **clientas nuevas** que compran **productos**.
4. Las clientas satisfechas entran a la **membresía** (recurrencia).
5. La membresía y las clientas fieles **agrandan la comunidad**, que vuelve a alimentar todo.

**Implicancia para el sitio:** el sitio no es una tienda con un evento pegado. Es la **puerta de entrada al flywheel**. Su trabajo es que el usuario que entra por cualquier punto (producto, evento o membresía) descubra los otros tres. Por eso la Home reparte a las tres unidades y cada unidad enlaza a las demás (ver [`04_SITE_ARCHITECTURE.md`](./04_SITE_ARCHITECTURE.md)).

---

## 4. Canales actuales y su implicancia

Hoy el negocio vende a través de canales de terceros:

| Canal | Rol actual | Implicancia para el sitio propio |
|---|---|---|
| **Tiendanube** | E-commerce de productos | Ya existe catálogo/checkout. El sitio nuevo puede *integrarse* o *enlazar* a Tiendanube en lugar de rehacer el checkout. Decisión abierta en [`16_DECISIONS.md`](./16_DECISIONS.md). |
| **Mercado Libre** | Alcance y ventas por marketplace | Aporta volumen y confianza transaccional, pero **diluye la marca** (todos los productos se ven iguales en ML). El sitio propio existe, en parte, para *recuperar el control de la percepción de marca* que ML no permite. |
| **Mercado Pago** | Cobros, con **recargo ~15%** | El recargo es un dato de negocio sensible: encarece el producto para quien paga con MP. El sitio debe manejar esto con transparencia (ver §6) y podría ser una razón para ofrecer otros medios/condiciones. |

**Lectura estratégica:** el problema de vender solo en Tiendanube/ML no es técnico, es de **posicionamiento**. En un marketplace, Sweet Flowers compite de igual a igual con cualquier vendedor y no puede contar su historia. El sitio propio es la jugada para **salir de la góndola y entrar al showroom**: un espacio donde la marca controla el relato, la estética y la percepción de estatus. Ese es, en el fondo, el ROI del sitio.

> `TODO(contenido):` confirmar si el sitio nuevo reemplaza, integra o convive con Tiendanube; y si ML sigue como canal de volumen. Lo define el cliente + decisión técnica en [`10_TECH_STACK.md`](./10_TECH_STACK.md).

---

## 5. Catálogo: por material, y stock vs. a medida

El catálogo se organiza naturalmente **por material**, porque el material define fabricación, precio, peso, terminación y uso. Esta es también la estructura de navegación propuesta para la sección Productos.

| Material | Ejemplos de piezas | Atributos comerciales clave |
|---|---|---|
| **Hierro** | Arcos, estructuras, bases, tótems | Robustez, reutilizable, desarmable, se pinta. Pieza "de inversión" para la profesional. |
| **MDF** | Paneles, letras, cartelería, repisas | Prolijo, económico, personalizable, ideal a medida (nombres/fechas). |
| **Madera** | Mesas auxiliares, cajones, tarimas, apoyos | Cálido, natural, premium rústico. |
| **Fundas / telas** | Fundas de sillas, manteles, telas de fondo, drapeados | Se venden por color; visten y transforman las estructuras. Alto margen relativo, bajo peso de envío. |

Transversal a todos los materiales, cada producto puede describirse por: **medidas**, **desarmable (sí/no)**, **pintable (sí/no)**, **colores disponibles**, **precio**, y **stock vs. a pedido**.

### Stock vs. a medida

- **Stock:** productos listos, con precio y despacho rápido. Son el motor de **conversión inmediata** del e-commerce. El sitio debe permitir comprar/consultar con fricción mínima.
- **A medida / a pedido:** productos que se fabrican según necesidad (medida, color, diseño). Tienen **tiempo de fabricación** y probablemente **precio bajo consulta**. Son el corazón del vínculo con la clienta profesional, pero requieren un flujo distinto: **consulta/presupuesto**, no "agregar al carrito".

**Implicancia para el sitio:** hacen falta **dos flujos de conversión distintos** conviviendo con elegancia:
1. *Comprar/consultar* (stock) → carrito o Mercado Pago / Tiendanube.
2. *Pedir presupuesto* (a medida) → formulario de consulta con material, medidas, color y fecha del evento.

Mezclarlos genera fricción. Separarlos con claridad es una decisión de UX de negocio, no de estética.

> `TODO(contenido):` listado maestro de productos (medidas, material, desarmable, pintable, colores, precio, top más vendidos) y qué es stock vs. a pedido. Lo entrega el cliente. Ver checklist en [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md) §13.

---

## 6. Envíos y pagos

Área con varios datos pendientes. Lo que sí es decisión de negocio-en-el-sitio:

- **Pagos:** hoy vía **Mercado Pago con recargo ~15%**. El sitio debe comunicar el precio y el eventual recargo con **transparencia total** (nada erosiona más la confianza premium que un recargo sorpresa en el checkout). Conviene evaluar mostrar precio final o aclarar condiciones antes del pago.
- **Envíos:** modalidades, zonas, costos y plazos **pendientes**. Para productos voluminosos (hierro/madera) el envío es un factor de decisión y hasta de objeción; conviene comunicarlo pronto en el flujo, no ocultarlo hasta el final.
- **Fabricación (a medida):** los **tiempos de fabricación** deben comunicarse de entrada para no defraudar expectativas.
- **Cambios / garantía:** política **pendiente**; es un elemento de confianza importante para el ticket alto.

> `TODO(contenido):` medios de pago y condiciones (¿se mantiene el recargo del 15%?, ¿hay transferencia/cuotas?), zonas y costos de envío, plazos de fabricación a medida, política de cambios/garantía. Todo lo define el cliente.

---

## 7. El evento como motor de autoridad

Vale insistir porque es la palanca estratégica del negocio. El evento no se comunica como "un curso": se comunica como **el acontecimiento del rubro**. Su función en el sitio es doble:

- **Vender inscripciones** a la 8.ª edición (18/09).
- **Probar autoridad** mostrando las 7 ediciones anteriores: números, sedes, disertantes, sponsors y testimonios. Esta prueba social es la que convierte a un visitante escéptico de la sección Productos o Membresía. Alguien que duda si comprarle un arco a Sweet Flowers deja de dudar cuando ve que Sweet Flowers *organiza el evento al que va todo el rubro*.

Por eso la sección Evento debe vivir con dos capas: **"lo que viene"** (próxima edición, urgencia, inscripción) y **"lo que fue"** (legado, autoridad, prueba social). Ver tratamiento narrativo en [`05_CONTENT_STRATEGY.md`](./05_CONTENT_STRATEGY.md).

> `TODO(contenido):` números reales de las 7 ediciones, testimonios con permiso, logos de sponsors, fotos y video de ediciones. Lo entrega el cliente.

---

## 8. La membresía como ingreso recurrente

Estratégicamente, la membresía es la apuesta a **convertir un negocio transaccional en uno de relación**. Su valor no está en el precio del abono sino en el **LTV** (valor de vida del cliente) que desbloquea: una alumna que se queda en el ecosistema compra productos, vuelve al evento y recomienda.

El riesgo es lanzarla sin una propuesta de valor clara y que el churn se coma el beneficio. Por eso, hasta que el cliente defina el contenido, el sitio **presenta la membresía como concepto/lista de espera** en lugar de prometer beneficios que no están cerrados. Métricas asociadas (MRR, churn, LTV) se tratan en [`14_METRICS.md`](./14_METRICS.md) si existe, o en la sección de métricas del roadmap.

---

## 9. Propuesta de valor

> Formulación provisional, a validar con el cliente y a pulir en copy ([`05_CONTENT_STRATEGY.md`](./05_CONTENT_STRATEGY.md)).

**Para la clienta profesional (emprendedora/organizadora):**
> "Sweet Flowers te da las piezas, el conocimiento y la comunidad para que tus eventos —y tu negocio— se vean como los de una referente."

**Para la clienta final (decora un evento puntual):**
> "Decorá tu evento con piezas de nivel profesional, elegidas y respaldadas por quien forma al rubro."

La propuesta combina **producto + saber + pertenencia**. Ningún competidor de solo-producto puede ofrecer las tres cosas.

---

## 10. Ventajas competitivas

| Ventaja | Por qué es difícil de copiar |
|---|---|
| **Autoridad del evento (8 ediciones)** | Se construye con años, no con presupuesto. Es un foso real. |
| **Figura de Flor como referente** | La marca personal no se replica; genera confianza y voz propia. |
| **Comunidad de alumnas/clientas** | Canal orgánico y prueba social viva; barrera de entrada para nuevos. |
| **Combinación producto + formación + membresía** | El competidor de solo-producto no puede formar; el de solo-cursos no vende piezas. |
| **Piezas desarmables/pintables/reutilizables** | Argumento de rentabilidad para la profesional, no solo estético. |
| **Marca premium (percepción de estatus)** | Poder de fijación de precios que un vendedor de marketplace no tiene. |

El sitio debe **exhibir estas ventajas**, no darlas por sabidas. Un visitante nuevo no conoce la historia: el sitio se la cuenta.

---

## 11. Objetivos de negocio del sitio

En orden de prioridad estratégica (no necesariamente de volumen):

1. **Construir autoridad de marca.** Es el objetivo raíz: si el sitio no eleva la percepción de la marca, los otros tres objetivos rinden menos. Todo lo demás se apoya acá.
2. **Inscribir al evento.** Conversión de mayor valor por su rol en el flywheel (adquisición de clientas de alto LTV).
3. **Vender / consultar productos.** Ingreso tangible y más inmediato; motor del e-commerce (stock) + generación de leads (a medida).
4. **Captar membresías.** Ingreso recurrente; la apuesta de largo plazo.

Estos objetivos se traducen en secciones y CTAs en [`04_SITE_ARCHITECTURE.md`](./04_SITE_ARCHITECTURE.md) y en métricas concretas en el roadmap.

---

## 12. Preguntas abiertas del negocio (mapeo a las 22 preguntas del cliente)

Estas son las decisiones de negocio que el sitio **necesita** resueltas, mapeadas a las 22 preguntas pendientes solicitadas al cliente. Mientras no lleguen, el contenido asociado queda como `TODO(contenido)`.

| # | Pregunta al cliente | Qué desbloquea en el negocio/sitio |
|---|---|---|
| 1 | Nombre definitivo del evento (18/09) | Titular y URL de la sección Evento; constante `EVENT_NAME`. |
| 2 | Historia real de la empresa y de Flor | Sección Historia / autoridad de marca ([`02_BRAND.md`](./02_BRAND.md)). |
| 3 | Bio de Flor + equipo | Figura de referente, prueba de autoridad. |
| 4 | Listado maestro de productos | Catálogo completo por material (§5). |
| 5 | Top productos más vendidos | Curaduría de la Home y destacados. |
| 6 | Qué es stock vs. a medida | Dos flujos de conversión (§5). |
| 7 | Medidas / desarmable / pintable por producto | Fichas técnicas y argumentos de venta. |
| 8 | Colores disponibles por producto | Selección de color en catálogo. |
| 9 | Precios (y política de recargo MP 15%) | Mostrar precio con transparencia (§6). |
| 10 | Medios de pago (además de MP) | Opciones de checkout / reducir fricción del recargo. |
| 11 | Zonas, costos y plazos de envío | Comunicar envío temprano en el flujo (§6). |
| 12 | Tiempos de fabricación a medida | Expectativas en el flujo de presupuesto. |
| 13 | Política de cambios / garantía | Confianza en ticket alto. |
| 14 | ¿Reemplaza/integra/convive con Tiendanube? | Decisión de e-commerce (§4, [`16_DECISIONS.md`](./16_DECISIONS.md)). |
| 15 | ¿ML sigue como canal de volumen? | Estrategia de canales (§4). |
| 16 | Programa del evento + disertantes | Sección Evento "lo que viene". |
| 17 | Tipos de entrada, precio y cupo | Inscripción y urgencia. |
| 18 | Números de las 7 ediciones previas | Prueba de autoridad "lo que fue" (§7). |
| 19 | Testimonios (con permiso) | Prueba social en todo el sitio. |
| 20 | Sponsors de las ediciones | Autoridad y validación externa. |
| 21 | **Qué incluye la membresía** (niveles, precio, periodicidad) | Definir la unidad de negocio de recurrencia (§2.3, §8). |
| 22 | **Descripción de la clienta que más compra** | Afinar las buyer personas ([`03_TARGET_AUDIENCE.md`](./03_TARGET_AUDIENCE.md)). |

> Además de estas 22, el proyecto necesita **assets** (logo vectorial, manual de marca, fotos, video) que no son "preguntas" pero bloquean el diseño final. Ver [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md) §13.

---

## 13. Cómo se conecta este documento

- **Marca y voz** que sostienen el pricing power → [`02_BRAND.md`](./02_BRAND.md)
- **A quién le vendemos** cada unidad → [`03_TARGET_AUDIENCE.md`](./03_TARGET_AUDIENCE.md)
- **Cómo se traduce en secciones y CTAs** → [`04_SITE_ARCHITECTURE.md`](./04_SITE_ARCHITECTURE.md)
- **Decisiones abiertas y checklist de contenido** → [`16_DECISIONS.md`](./16_DECISIONS.md)
- **Visión general** → [`00_PROJECT_HANDOFF.md`](./00_PROJECT_HANDOFF.md)
