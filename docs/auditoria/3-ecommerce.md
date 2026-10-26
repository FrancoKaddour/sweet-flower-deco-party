# Jurado 3 — Ecommerce, conversión y contenido

Auditor: perfil CRO (Baymard / HBR) + jurado Awwwards (Content 10%).
Fecha: 26/10/2026. Producción `https://sweet-flower-deco-party.vercel.app` (localhost:3000 no respondía: "error page" en Chrome) + código en `$HOME/mnt/sweet-flowers-deco-party`.
Recorridos: celular 390 (laboratorio iframe) y desktop 1568.

> ⚠️ **Incidente a declarar (mío):** al probar el mensaje del carrito en producción intercepté `window.open` para no abrir WhatsApp, pero `enviar()` llama antes a `registrarPedido()` (CartDrawer.tsx:75-83), así que **quedó registrado un pedido de prueba en la base de producción: código `SF-9QWFM`** (2 × "Alzadas mdf más Pino", total $0). **Hay que borrarlo desde el panel (Pedidos)** para que no ensucie métricas. No se mandó ningún WhatsApp ni se creó ninguna inscripción. Esto también es un hallazgo: cualquiera que toque "Enviar" sin terminar en WhatsApp genera un pedido "fantasma" (ver E-21).

---

## 1. Nota del jurado

| Criterio | Nota | Justificación |
|---|---|---|
| **Content (Awwwards 10%)** | **5,5/10** | Lo editorial (Summit, landings SEO, FAQ) está bien escrito y con voz propia, pero el catálogo publica el texto crudo de WhatsApp con errores, hay 4 versiones distintas del recargo de MP, cifras que se contradicen y la home le habla al cliente final cuando el negocio le vende a decoradoras. |
| **Claridad de la oferta (producto)** | 4/10 | El precio que se ve no es el de lo que la persona quiere comprar (pintado, medida, con madera). 7 productos dicen "Precio a consultar" teniendo los precios escritos en la descripción. |
| **Flujo de pedido (carrito → WhatsApp)** | 5/10 | Técnicamente es sólido (código de pedido, registro en panel, accesible), pero el mensaje no lleva variante, color, fecha del evento, link ni código de descuento: el vendedor tiene que volver a preguntar todo. "Total: $0" es posible. |
| **Descubrimiento (catálogo)** | 3,5/10 | 192 productos sin buscador, sin filtros (color, medida, precio), sin orden, paginación sin URL. En celular, Hierro son 3 páginas de 24 tarjetas con una sola foto cada una. |
| **Conversión del Summit** | 6/10 | Qué, cuándo y dónde se entiende en 5 s; el pago con MP está bien pensado (precio calculado en servidor, bfcache, estados). Faltan: precio arriba, urgencia real (la cuenta regresiva apunta al evento y no al fin de la preventa), FAQ/política, CTA fijo en celular (el formulario está a ~12.300 px). |
| **Confianza / prueba social** | 3/10 | Cero reseñas/testimonios visibles, legales en `#`, "Historia" firmada por Flor pero inventada, promesas sin respaldo ("siempre se agota", "llave en mano"). Mucho depende de terceros, pero hay cosas que dependen de nosotros. |
| **Newsletter** | 6,5/10 | Propuesta concreta (10% al instante, código en pantalla + mail, baja en un clic). Pero el código no tiene dónde usarse en el carrito y una de las 3 promesas ("preventas antes que el público") hoy no se cumple. |
| **Medición** | 0/10 | No hay ningún analytics, píxel ni evento (verificado en código y en el HTML de producción). Sin medir no hay CRO. |

**Nota global del área: 4,8/10.** La base técnica es de 8; lo que la hunde es contenido de catálogo sin curar y cero medición. Las dos cosas se arreglan sin esperar a Flor.

---

## 2. Hallazgos

Leyenda: 🔴 crítico · 🟠 alto · 🟡 medio · ⚪ bajo · Esfuerzo S <1h · M 1-4h · L >4h

### A. Producto, precio y carrito

**E-01 🔴 El precio que se ve no es el de lo que se compra (variantes como texto crudo)**
- Dónde: todas las fichas `/productos/<cat>/<slug>`, tarjetas y carrito. Datos: `content/catalogo-whatsapp.ts` (106 de 192 productos tienen precios adicionales escondidos en `descripcion`).
- Evidencia: "Mickey mdf 2x2" muestra **$312.000** y la descripción dice "Pintado $420.000". "Arcada de hierro 3d" $309.000 / "De 2.40 x 1.80 $351.000". "Mesa ranurada" tiene 4 precios. "Cubo 25x25" tiene 3. El carrito (`CartProvider.tsx`, clave = `slug`) **no puede guardar variante**: si quiero el Mickey pintado, el total del carrito me miente en $108.000.
- Por qué importa: Baymard: la falta de claridad en precio/variantes es de las primeras causas de abandono. Encima, el mensaje que recibe Flor tiene un precio que no es el real → hay que renegociar en el chat → fricción y desconfianza ("en la web decía otra cosa").
- Arreglo: usar el campo `variantes` que ya existe en el tipo (`modules/catalog/types.ts`, DB `products.variantes`) como `{ etiqueta, precio }[]`; en la ficha, selector de chips (Sin pintar / Pintado; 2.40×1.50 / 2.40×1.80; Solo armazón / Con madera) que cambia el precio grande; clave del carrito = `slug + variante`; el mensaje lleva la variante. Hoy mismo, como mínimo: mostrar "Desde $X" en vez de "$X" cuando la descripción tiene más de un `$`.
- Esfuerzo: L (modelo + panel + UI) / S (el "Desde").

**E-02 🔴 El mensaje de WhatsApp no le sirve al vendedor y puede decir "Total: $0"**
- Dónde: `components/cart/CartDrawer.tsx:93-100`. Probado en producción (ver incidente): el mensaje generado fue
  `¡Hola! Quiero hacer este pedido desde la web (pedido SF-9QWFM): • 2 × Alzadas mdf más Pino — precio a consultar  Total (transferencia): $ 0 (+ productos a consultar)`
- Le falta: variante/medida/color por ítem; **fecha del evento** (es por encargo, ~20 días: es LA pregunta de calificación); link de cada producto (Flor tiene que adivinar cuál es entre 192); forma de pago elegida (transferencia vs MP +recargo); código del Club; forma de envío/CP. Nombre y localidad son opcionales y están debajo de la lista, así que casi nadie los va a completar.
- Por qué importa: cada dato que falta es un ida y vuelta en el chat. En venta por WhatsApp, cada ida y vuelta pierde gente.
- Arreglo: (1) si `total === 0` no mostrar la línea de total; si hay mezcla, "Subtotal de lo que tiene precio: $X"; (2) agregar campos "¿Para cuándo lo necesitás?" (fecha), "Color" (chips de los 5 colores de hierro) y "Código del Club (opcional)"; (3) agregar el link corto de cada producto; (4) formato propuesto en la sección final. Esfuerzo: M.

**E-03 🔴 "Precio a consultar" en productos que tienen el precio escrito**
- Dónde: 7 productos con `precio: null` (`tunel-hexagonal-desarmable`, `alzadas-mdf-mas-pino`, `alzadas-p-torta-de-mdf`, `bases-de-3-o-4-pisos`, `arcoiris-4-estantes`, `alzada-separada`, `alzada-triangular`). Ej.: `/productos/catering/alzadas-mdf-mas-pino` (desktop 1568): titular "Precio a consultar" y debajo "15cm diámetro x 15cm alto $8.500 …". `arcoiris-4-estantes` es **uno de los más vendidos según Flor** (CONTENIDO_FLOR §3) y no tiene precio.
- Por qué importa: "a consultar" es la etiqueta que más baja la conversión en catálogo; acá además es falsa. Y hace que el carrito sume $0.
- Arreglo: cargar el precio mínimo y mostrar "Desde $X". Esfuerzo: S (datos).

**E-04 🔴 La descripción del producto es el texto crudo de WhatsApp (ortografía y formato)**
- Dónde: 192 fichas y tarjetas. Ejemplos verificados: "aporx" y "15,% de recargo" (`base-cola-de-sirena-mdf`), "15xm diámetro" y "Colores a elección!!" (`alzadas-mdf-mas-pino`), "Indiciduales" y "eleccion" (`alzadas-escandinavas-x3`), "Hexagono" (`hexagono`), "podes" sin tilde (8 productos), "diametro" (10), "eleccion" (9), "CATALOGO DE FUNDAS" pegado al final (13 productos de fundas), "x link de mercado pago". Nombres con mayúsculas al azar: "Alzadas mdf más Pino", "Mickey mdf 2x2". `base-mariposa` sin descripción.
- Por qué importa: es lo primero que lee alguien que llega desde Google. Para Awwwards (Content) se nota en 10 segundos. Y todo eso va al JSON-LD `Product.description` y a las meta descriptions.
- Arreglo: pasada editorial de los 192 (o al menos los ~60 de hierro/catering más vendidos): nombre en formato título, descripción en 1-2 líneas + lista "Medidas / Colores / Incluye", sin precios adentro (van a variantes), sin "recargo" adentro (va en una línea global). Un script puede hacer el 70% (sacar `$…`, "15% de recargo…", "CATALOGO DE FUNDAS", corregir las 10 palabras repetidas) y el resto a mano. Esfuerzo: L (M con script).

**E-05 🔴 El recargo de Mercado Pago aparece con 4 números distintos, uno de ellos admitiendo que se comunica mal**
- Dónde y qué dice:
  - 25 fichas de producto: "15% de recargo x link de mercado pago".
  - `/contacto` (app/(site)/contacto/page.tsx:23): "recargo habitual (~18%)".
  - `/preguntas-frecuentes` (content/seo/faqs.ts:31): **"se comunica como 15%, en la práctica ronda el 18%"**.
  - `/llms.txt` (content/seo/llms.ts:39): "~15–18%".
  - Landings, bloque "Datos clave" (`app/(site)/[landing]/page.tsx:82`): "Pago: Transferencia o Mercado Pago", sin mencionar recargo.
- Por qué importa: la FAQ le dice al cliente, por escrito, que el número publicado no es el real. Es un golpe directo a la confianza y un riesgo de defensa del consumidor (publicidad engañosa). Que lo valide Flor con su contador.
- Arreglo: un único número en un único lugar (`lib/site.ts`, ej. `RECARGO_MP = 0.176` con la fórmula de CONTENIDO_FLOR §4) y que la ficha muestre las dos cifras: "**$99.000** por transferencia · $120.150 con Mercado Pago (hasta X cuotas)". Borrar la frase "se comunica como 15%". Esfuerzo: M.

**E-06 🟠 Catálogo sin búsqueda, filtros, orden ni URL de página**
- Dónde: `/productos/<cat>` (`components/productos/GrillaPaginada.tsx`). Hierro: 72 productos en 3 páginas de 24; la página se guarda en `useState`, así que con "Atrás" desde una ficha **se vuelve a la página 1**. No hay `<input type=search>` en todo el sitio (verificado).
- Por qué importa: la decoradora busca por pieza ("arco extensible", "funda aro 2m") o por color/medida. Baymard: sin buscador ni filtros en catálogos de más de ~50 ítems, la tasa de "no encuentro" se dispara.
- Arreglo: (1) `?pagina=2` en la URL; (2) buscador por nombre en el header (192 ítems: filtro en cliente, sin backend); (3) chips de subtipo (Arcos · Arcadas · Aros · Columnas · Mesas) a partir de las palabras del nombre; (4) orden: Destacados / Menor precio / Mayor precio. Esfuerzo: M.

**E-07 🟠 La ficha no responde las 3 preguntas que Flor dice que más le hacen (pago, envío, demora)**
- Dónde: `app/(site)/productos/[categoria]/[slug]/page.tsx`. Hay "Producción: Por encargo, alrededor de 20 días" y "Envíos: A todo el país". Falta: cómo se paga (y el recargo), **Vía Cargo con 50% off en el envío** (dato confirmado en CONTENIDO_FLOR §5 que no se usa en ningún lado como argumento de venta), quién paga el seguro, qué pasa si llega dañado, cambios. Las fichas tienen 1 sola foto (fuente WhatsApp) sin escala ni contexto de uso.
- Arreglo: bloque fijo de 4 ítems debajo del CTA (Pago · Envío · Producción · Ayuda) con textos de la sección final; link a `/envios-a-todo-el-pais`. Fotos: priorizar 2.ª foto "armado en un evento" en los 20 más vendidos. Esfuerzo: S (bloque) / L (fotos, [BLOQUEADO-TERCEROS] parcial).

**E-08 🟠 El landing dice cosas que el producto contradice**
- Dónde: `/alzadas-para-tortas`. La FAQ dice "MDF de 10, 15, 20 y 25 cm"; el producto `alzadas-mdf-mas-pino` lista de 15 a **30 cm**. "Datos clave: Precio desde $10.000", pero hay alzadas a $7.000 y $8.500 (las que tienen `precio: null`, que el cálculo de `desde` ignora). `/estanterias-para-mesa-dulce` FAQ: "El precio de cada opción figura en el producto" → no figura (E-01).
- Arreglo: corregir las FAQ y los precios (resuelto por E-01/E-03); hacer que "Desde" use también los precios de variantes. Esfuerzo: S.

**E-09 🟠 Se publica lo que la clienta pidió NO publicar (MDF y madera)**
- Dónde: CONTENIDO_FLOR §3: "MDF y madera/pino: casi no los trabajan — no incluirlos salvo más adelante en una sección de stock/promos". En producción: 44 productos MDF + 18 de madera visibles, categorías 04 y 05 en `/productos`, y el hero de la home (`components/sections/HeroStory.tsx:38`) dice "Piezas en hierro, MDF, madera y telas".
- Por qué importa: van a entrar pedidos de cosas que no se fabrican → mala experiencia y tiempo perdido de Flor/Tobías. Además diluye el posicionamiento "hierro + catering".
- Arreglo: confirmar con Flor por WhatsApp (1 mensaje); mientras tanto, ocultar desde el panel o mover a una categoría "Stock y oportunidades" al final. Cambiar el hero a "hierro, catering, fundas y telas". Esfuerzo: S.

**E-10 🟡 Ficha: Agregar al pedido y Consultar compiten sin jerarquía de intención; no hay cross-sell real**
- "Más de hierro" muestra 4 productos de la misma categoría al azar. La venta real es por combinación (arco + funda + piso de cordura; estantería + alzadas). Proponer "Se arma con" (curado a mano para los 15 más vendidos) y en el carrito "¿Le sumás la funda?" cuando hay un aro/arcada. Esfuerzo: M.

### B. Event Summit

**E-11 🔴 La urgencia real está escondida: la cuenta regresiva apunta al evento, no a la preventa**
- Dónde: hero de `/event-summit` (`components/evento/Countdown.tsx` usa `EVENT_DATE_ISO`): muestra "164 días". La urgencia verdadera es que la **Preventa Comunidad (VIP $330.000 / General $180.000) vence el 10/11, en 15 días**, y después sube a $370.000 / $260.000 (+$40.000 / +$80.000). El hero no muestra precio ni ese vencimiento.
- Por qué importa: "164 días" invita a dejarlo para después. "Faltan 15 días para ahorrar $80.000" hace comprar hoy.
- Arreglo: countdown a `preventaVigente().hasta` 23:59 con el rótulo "La preventa Comunidad termina en"; debajo, "Pase General $180.000 · después $260.000". Esfuerzo: S.

**E-12 🟠 Las tarjetas de pases no dicen cuál precio rige hoy ni cuánto se ahorra; y la "preventa general" no termina nunca**
- Dónde: `components/evento/Pases.tsx`. Muestra las dos preventas con el mismo peso visual. `tarifaVigente()` (content/evento.ts:112) devuelve la última preventa para siempre: después del 15/12 se sigue cobrando "Preventa general · hasta el 15/12" → la etiqueta queda mintiendo y no hay "precio final".
- Además: "Preventa **Comunidad VIP Sweet Flowers**" suena restringida a clientas VIP, pero la compra cualquiera → o confunde ("¿puedo?") o le quita valor a la comunidad.
- Arreglo: marcar la vigente ("AHORA" + precio grande) y tachar la siguiente ("desde el 11/11: $260.000"); definir con Flor el precio post-15/12 y cargarlo como tercera tarifa; aclarar "abierta a todos" o pedir algo que valide la comunidad. Esfuerzo: S (+ dato de Flor).

**E-13 🟠 En celular, el precio está a 10 pantallas y el formulario a 14, sin CTA fijo**
- Dónde: `/event-summit` a 390: página de **17.020 px**; `#pases` en y≈8.266, `#inscripcion` en y≈12.300. Los CTA del hero llevan ahí, pero quien scrollea se cruza con intro, escenas pineadas, stats y trayectoria antes de ver un precio.
- Arreglo: barra fija inferior en mobile después del hero ("General $180.000 · Preventa hasta 10/11 · [Quiero mi lugar]") que se oculta cuando el formulario está a la vista (ya existe `data-oculta-flotantes`). Esfuerzo: M.

**E-14 🟠 Faltan las respuestas que frenan una compra de $180.000-$370.000**
- Dónde: `/event-summit` no tiene FAQ. `/preguntas-frecuentes` tiene 4 del Summit (qué es, cuándo, cuánto, qué incluye). No hay nada sobre: **¿qué pasa si no puedo ir? (devolución / transferir la entrada a otra persona)**, **¿dan factura?**, ¿cuántas cuotas?, ¿qué son las "actividades extra del 7 y 8 de abril" y cuánto salen?, ¿hay almuerzo? (12:30 a 19 h), ¿puedo comprar para mi equipo?, ¿para quién es (principiantes / profesionales)?, accesibilidad, alojamiento cerca. El formulario no tiene casilla de "Acepto las condiciones" ni link a ninguna política.
- Por qué importa: es la objeción #1 de un ticket alto y, sin política publicada, cada reclamo se resuelve a mano. Parte es [BLOQUEADO-TERCEROS] (la política la decide Flor), pero la sección se puede armar hoy.
- Arreglo: acordeón de 8 preguntas arriba del formulario con las respuestas confirmadas y, para las que dependen de Flor, una respuesta honesta provisoria (ver sección final). Esfuerzo: M.

**E-15 🟠 Afirmaciones de urgencia/escala sin respaldo o contradictorias**
- "Una vez al año … y **siempre se agota**" (`components/evento/SummitIntro.tsx:26`): la 1.ª edición fue el 18/09/2026 y la 2.ª el 09/04/2027 (7 meses, no "una vez al año"); "siempre se agota" no está en ningún dato confirmado.
- "Lo que arrancó en un taller hoy junta a la industria entera **una vez al año**" (`/historia`).
- Stats (content/evento.ts:202): "**+180 asistentes**", pero la suma de `participantes` de los 7 workshops en el mismo archivo da **340** (80+40+40+40+60+50+30), sin contar la 1.ª edición. Nos estamos quedando cortos con un número propio.
- Meta description (`app/(site)/event-summit/page.tsx:31`): "**Pre-preventa** abierta" vs la página: "Preventa abierta".
- `content/evento.ts:186` `INCLUYE` dice "**20%** de descuento … desde que **señás** tu lugar"; los pases dicen 15% (solo VIP) y ya no hay seña. Hoy no se renderiza, pero está en la "fuente única". Comentarios desactualizados: `evento.ts` "Inscripción: TODO por WhatsApp (sin pago en el sitio)" y `Pases.tsx` "→ WhatsApp".
- Arreglo: "Dos ediciones, siete workshops" en lugar de "una vez al año"; sacar "siempre se agota" o reemplazar por un hecho ("la 1.ª edición tuvo X personas"); stats "+340 asistentes en workshops" (confirmar con Flor que las cifras por workshop son las buenas); borrar `INCLUYE` y los comentarios viejos. Esfuerzo: S.

**E-16 🟡 Urgencia de cupo que no se muestra (ni se protege)**
- "Son 80 lugares. Nada más." pero nunca se dice cuántos quedan. `quedanLugares()` (modules/summit/core.ts:27) existe y cuenta solo `seno/pago/asistio`: las inscripciones **pendientes** (pago en efectivo, que tarda días) no reservan lugar → cerca del cupo se puede vender de más.
- Arreglo: mostrar "Quedan N lugares" solo cuando N ≤ 30 (honesto y eficaz); reservar el lugar 72 h para pendientes de efectivo. Esfuerzo: M.

**E-17 🟡 Página de vuelta y mail de entrada: correctos pero se quedan cortos**
- `/event-summit/inscripcion` sin parámetros, desktop 1568: el h1 "NO ENCONTRAMOS TU INSCRIPCIÓN" **parte la palabra** ("ENCONTRAMO / S") por `overflow-wrap:anywhere` + tamaño `calc((100vw-3rem)/8)`. Los estados "nada" y "pendiente" no tienen link de vuelta al Summit (callejón sin salida salvo WhatsApp).
- Estado "ok": no ofrece **agregar al calendario**, ni **cómo llegar** a La Rural, ni compartir ("contale a una colega"), ni usar el beneficio VIP del 15% en la tienda (oportunidad de venta cruzada en el momento de mayor confianza).
- Mail (`lib/email/plantillas.ts` `correoEntradaSummit`): sin link a Google Calendar/.ics ni a mapa; el pie lleva el WhatsApp de **ventas** (5491151064010), no el de capacitaciones (`EVENT_WHATSAPP`); dice "respondé este mail" pero el `reply_to` depende de una variable de entorno (`REPLY_TO()` en enviar.ts) → si no está, la respuesta va a `hola@sweetflowers.com.ar` (dominio todavía no configurado, [BLOQUEADO-TERCEROS]); no menciona factura ni política; la versión texto no tiene WhatsApp.
- Arreglo: `text-wrap:balance` + `overflow-wrap:break-word` (no `anywhere`) en ese h1; links de calendario y mapa en página y mail; WA de capacitaciones; link "Ver mi beneficio VIP" en el mail si el pase es VIP. Esfuerzo: M.

**E-18 🟡 El botón flotante de WhatsApp en el Summit va a la línea de ventas**
- `components/site/WhatsAppButton.tsx` es global con `WHATSAPP_HREF` (ventas, mensaje "consultar por un evento"). En `/event-summit`, `/event-summit/trayectoria/*` y landings de capacitación tendría que ir a `EVENT_WHATSAPP` con "Tengo una consulta sobre el Event Summit". Hoy las consultas del Summit caen en el teléfono equivocado. Además, en 390 tapa texto de la lista del Pase VIP y el microcopy de pago bajo el botón "Pagar". Esfuerzo: S.

### C. Newsletter (Club)

**E-19 🟠 El 10% no tiene dónde usarse en el flujo de compra**
- El mail de bienvenida dice "Mencioná tu código" pero el carrito no tiene campo de código y el mensaje de WhatsApp no lo incluye. Resultado: la mayoría se olvida y Flor no puede medir el canje (el segmento "codigo-sin-usar" depende de que alguien lo marque a mano).
- Arreglo: campo "Código del Club" en el carrito, precargado si el código está en `localStorage` (se guarda al suscribirse) o en `?codigo=` (link del mail); la línea "Código Club: CLUB-XXXX (10% off)" va en el mensaje y en `orders`. Esfuerzo: M.

**E-20 🟡 Promesa que hoy no se cumple y banda genérica en todas las páginas**
- "Preventas del Summit antes que el público": la preventa vigente es pública en la web. O se cumple (la próxima preventa se abre 48 h antes al club) o se cambia por "Te avisamos antes de que suba el precio".
- La misma banda "10% off en tu primer pedido" aparece en `/event-summit` y `/event-summit/inscripcion`, donde lo relevante es "Avisame cuando se anuncien los disertantes". Variante por contexto con el mismo componente (`interes` preseleccionado). Esfuerzo: S.
- Legal: se piden email (y en el Summit DNI) sin link a política de privacidad (Ley 25.326). [BLOQUEADO-TERCEROS] para el texto final; se puede publicar una provisoria honesta.

**E-21 🟡 Pedidos "fantasma" en el panel**
- `registrarPedido` corre antes de saber si WhatsApp se abrió (CartDrawer.tsx:75-83); si el popup se bloquea o la persona cierra WhatsApp sin enviar, queda igual un pedido. Lo comprobé sin querer (SF-9QWFM). Útil como "intención", engañoso como "pedido".
- Arreglo: guardarlo como `estado: "iniciado"` y que el panel lo muestre separado de los pedidos que el equipo confirmó; usarlo como evento de embudo (E-30). Esfuerzo: S.

### D. Confianza y posicionamiento

**E-22 🔴 La home le habla al público equivocado**
- Hero (`HeroStory.tsx:38`, y `JsonLd.tsx:110` como slogan): "Creamos la escenografía de **tus mejores momentos** … para transformar cualquier evento en una experiencia memorable". `/contacto`: "Contanos tu evento… armamos la escenografía a tu medida". Pero el negocio (SITE_DESCRIPTION, FAQ, `/resenas`) le vende **estructuras a decoradoras y organizadores** que arman eventos de terceros. Una decoradora que entra no se ve reflejada; una mamá que busca "decoración de cumpleaños" cree que le van a decorar el evento.
- Arreglo: hero B2B claro. Propuesta en la sección final. Esfuerzo: S.

**E-23 🟠 Promesas de servicio no confirmadas: "Montaje llave en mano"**
- `components/sections/Servicio.tsx:46-63`: "Llave en mano · Del boceto al montaje" y "Montaje llave en mano · Del boceto al armado, nos ocupamos de todo". En `docs/CONTENIDO_FLOR.md` no hay nada sobre montaje: el modelo es fabricar y enviar. Si no lo hacen, van a recibir pedidos de montaje y es una promesa falsa.
- Arreglo: reemplazar por algo confirmado ("Envíos a todo el país · Vía Cargo con 50% off en el envío", "Asesoramiento por WhatsApp con Flor y Tobías"). Esfuerzo: S.

**E-24 🟠 Prueba social: cero en todo el sitio**
- `/resenas` solo pide reseñas, no muestra ninguna. No hay testimonios en home, fichas ni Summit. Lo de terceros es [BLOQUEADO-TERCEROS], pero hay prueba social **que ya tenemos**: 7 workshops con fechas y asistentes, 1.ª edición en La Rural, los reels de Instagram de cada encuentro (ids en `content/evento.ts`), la cantidad de seguidores (Facebook ≈93 mil según `negocio.ts`; falta Instagram), "Ya somos +N en el club" (existe pero solo con N ≥ 50).
- Arreglo: tira "Como nos vieron" con números verificables + 3 reels embebidos/miniaturas en el Summit; en la ficha, "Más de X decoradoras ya la usan" solo si Flor da el número. Esfuerzo: M.

**E-25 🟡 Texto de `/resenas` que puede leerse como "review gating"**
- `app/(site)/resenas/page.tsx:114`: "¿Algo no salió como esperabas? **Antes de reseñar**, escribinos… y lo resolvemos." Las políticas de Google prohíben desalentar reseñas negativas o pedirlas de forma selectiva. Reformular: "Si algo no salió bien, también queremos saberlo: dejalo en tu reseña o escribinos y lo resolvemos." Esfuerzo: S.

**E-26 🟡 Links legales muertos en el footer**
- `content/site.ts` `INFO_LINKS`: Cambios, Términos, Privacidad → `href="#"` (verificado en producción). Un link que no lleva a nada es peor que no tenerlo. [BLOQUEADO-TERCEROS] el texto legal final → mientras tanto, páginas provisorias con lo que ya está confirmado (envíos, seguro, recargo, por encargo) y "Escribinos para cambios", o esconder los links. Esfuerzo: S-M.

**E-27 🟡 Historia firmada por Flor con hechos inventados**
- `/historia`: "Flor cosía, probaba y desarmaba…", "— Flor, fundadora". Ya se sabe que la historia real es [BLOQUEADO-TERCEROS], pero publicar en primera persona algo que Flor no dijo es más grave que un placeholder: si una alumna del workshop lo lee y no es así, se cae la credibilidad de todo. Mientras tanto: sacar la firma y dejar un texto en tercera persona solo con hechos confirmados (abajo). Esfuerzo: S.

### E. Contenido: placeholders y textos provisorios VISIBLES

| URL | Texto visible | Fuente |
|---|---|---|
| `/event-summit` (sección "Quiénes enseñan") | 3 tarjetas "Por anunciar · Confirmado · se revela pronto" (de `DISERTANTES` `[Disertante 01..03]` / "Tema a confirmar") | page.tsx:128-144 [BLOQUEADO-TERCEROS], bien resuelto como "intriga" |
| `/event-summit` | "Más de 20 referentes ya pasaron por acá" (TODO titular), "Entrás por la decoración. Te quedás por la gente." (TODO), "Una sala. Toda la industria." (TODO caption), "Son 80 lugares. Nada más." (TODO) | page.tsx:63,91,121,175 |
| `/event-summit` (scroll horizontal) | fotos picsum de workshops 01-03 y 05-07 | EdicionesScroll.tsx:162 [BLOQUEADO-TERCEROS] |
| `/historia` | relato completo + "— Flor, fundadora" + retrato picsum | historia/page.tsx:52-111 [BLOQUEADO-TERCEROS] (ver E-27) |
| `/` (sección historia) | retrato picsum + relato + firma placeholder | Historia.tsx:24-75 [BLOQUEADO-TERCEROS] |
| `/`, `/productos`, `/contacto` | titulares y bajadas marcados `TODO(contenido): titular real` (Productos, Destacados, Experiencia, Principios, Contacto "Creemos algo inolvidable juntos") | ver `grep TODO(contenido)` |
| `/productos/<cat>` | foto representativa de categoría "TODO" | productos/page.tsx:102 |
| Footer (todas) | Cambios / Términos / Privacidad → `#` | content/site.ts |
| `/productos/catering/base-mariposa` | sin descripción | catálogo |

No encontré "lorem" ni "TODO" literal renderizado en pantalla. Lo grave de contenido no son los placeholders (están bien disimulados) sino el catálogo crudo (E-04) y las contradicciones (E-05, E-08, E-15).

### F. Medición

**E-28 🔴 No hay ninguna medición**
- `package.json` sin `@vercel/analytics` ni `@vercel/speed-insights`; sin GA4, GTM ni Meta Pixel en el código ni en el HTML de producción (verificado con fetch del home). La única señal son los pedidos registrados en el panel (incluidos los fantasma, E-21) y las inscripciones.
- Por qué importa: no se puede saber cuánta gente llega desde Instagram, qué landing SEO trae pedidos, dónde se cae el embudo del Summit ni si el 10% funciona. Sin esto, cualquier cambio de esta auditoría es a ciegas.
- Arreglo: plan de eventos abajo. Esfuerzo: M.

**Plan de medición propuesto (E-28)**

1. **Vercel Analytics** (`@vercel/analytics`, `<Analytics />` en `app/layout.tsx`) + `track()` para eventos propios. Sin cookies → no hace falta banner. Es lo mínimo y se hace en 30 min.
2. **GA4** (opcional, si Flor quiere ver Google Ads/Search Console unidos) vía `next/third-parties/google`.
3. **Meta Pixel + Conversions API** solo cuando se pauten anuncios en Instagram (necesita banner de consentimiento).

| Evento | Dónde se dispara | Props |
|---|---|---|
| `view_item` | ficha de producto | slug, categoria, precio |
| `add_to_cart` | AddToCartButton | slug, variante, precio, origen (card/ficha/landing) |
| `begin_checkout` | se abre el CartDrawer con ítems | items, total |
| `wa_order_click` | "Enviar pedido por WhatsApp" | codigo, items, total, tiene_codigo_club |
| `wa_contact_click` | todo link a wa.me (flotante, ficha, landing, contacto) | linea (ventas/capacitaciones), pagina |
| `summit_select_pass` | BotonPase / radio del formulario | pase, tarifa |
| `summit_begin_checkout` | submit OK → redirige a MP | pase, monto |
| `summit_purchase` | `/event-summit/inscripcion` estado ok (una vez, con `codigo`) | pase, monto, codigo |
| `summit_payment_failed` / `_pending` | idem | estado |
| `newsletter_signup` | NewsletterForm OK | intereses, pagina |
| `search` / `filter` | cuando existan (E-06) | término |

**UTM para Instagram (nada que programar, solo disciplina):**
- Link en bio: `/?utm_source=instagram&utm_medium=social&utm_campaign=bio`
- Historias del Summit: `/event-summit?utm_source=instagram&utm_medium=story&utm_campaign=summit-preventa-comunidad`
- Posts de producto: `/productos/hierro/<slug>?utm_source=instagram&utm_medium=post&utm_campaign=<pieza>`
- Mails del Club: `utm_source=club&utm_medium=email&utm_campaign=<id-campaña>` (agregarlo automáticamente en `correoCampana`).
- **Clave para WhatsApp:** guardar la primera `utm_source` en `localStorage` y agregarla al mensaje del carrito ("Llegué desde: Instagram") y a `orders`/`summitRegistrations` (columna `origen`). Así Flor ve en el panel de dónde vienen las ventas que cierran por chat.

---

## 3. Top 10 para subir la nota antes del viernes (impacto / esfuerzo)

1. **E-05 Un solo número de recargo MP** y borrar "se comunica como 15%" (S). Confianza + riesgo legal.
2. **E-11 Countdown a la preventa + precio en el hero del Summit** (S). Es la palanca de venta más barata del sitio; vence el 10/11.
3. **E-28 Vercel Analytics + 6 eventos clave + UTM en el mensaje** (M). Sin esto no hay forma de demostrar nada.
4. **E-02 Mensaje de WhatsApp completo** (fecha del evento, color, link, código Club; sin "Total $0") (M).
5. **E-03 + "Desde $X"** en los 7 productos sin precio y en los 106 con varios precios (S).
6. **E-22 + E-23 Hero B2B y sacar "montaje llave en mano"** (S).
7. **E-15 Corregir cifras/afirmaciones del Summit** (+340, "una vez al año", "siempre se agota", "Pre-preventa") (S).
8. **E-14 FAQ del Summit arriba del formulario** (con respuestas provisorias honestas) (M).
9. **E-04 Limpieza del catálogo por script** (sacar `$…`, recargos, "CATALOGO DE FUNDAS", corregir 10 palabras) + a mano los 30 más vendidos (M-L).
10. **E-12 + E-13 Pases con "precio de hoy / ahorrás" + barra fija de compra en mobile** (M).

(Antes que todo: **borrar el pedido de prueba SF-9QWFM** del panel.)

---

## 4. Ideas "wow" (viables en 2-3 días)

1. **"Armá tu mesa"**: en la ficha de estanterías/alzadas/arcos, botón "Ver en tu color" que cambia la foto con un filtro de color sobre el hierro (máscara SVG/duotono que ya usan en el Summit) para Blanco/Negro/Dorado/Plateado/Rosa Gold. Resuelve una pregunta real del chat y es un momento memorable para el jurado.
2. **Ticket del Summit como pieza de diseño**: la página de éxito muestra una entrada animada (estilo pase VIP con el código monoespaciado que ya existe) con "Agregar a Google Calendar / Apple Wallet (.pkpass simple) / Compartir en historias" (imagen OG generada con `next/og`, como ya hacen para las landings). Convierte a cada asistente en publicidad.
3. **Barra de preventa viva**: un hilo fino arriba del sitio con "Preventa Comunidad · 15 días · General $180.000 → $260.000" que se va "llenando" al acercarse la fecha. Urgencia real, cero invención.
4. **El pedido como "presupuesto lindo"**: al enviar el carrito, además de abrir WhatsApp, se genera una imagen/PDF del pedido con fotos (OG dinámico con el código SF-XXXX) que la decoradora puede reenviar a SU cliente. Les resuelve trabajo a las decoradoras → vuelven.
5. **Mapa de la comunidad**: los 7 workshops + 1.ª edición en un mapa de Argentina animado (CABA, Puerto Madero, La Rioja, Río Cuarto) con asistentes por sede y los reels. Prueba social real hecha experiencia.

---

## 5. Qué podemos escribir/hacer NOSOTROS sin esperar a Flor/Tobías

Todo lo de abajo usa **solo datos ya confirmados** (CONTENIDO_FLOR.md, lib/site.ts, content/evento.ts). Donde falta un dato, lo digo y no lo invento.

### 5.1 Hero de la home (B2B)
- Eyebrow: **Fabricantes para decoradoras y organizadores de eventos**
- Titular: **Las estructuras que arman tus eventos**
- Bajada: **Arcos, arcadas, estanterías, alzadas, fundas y telas sublimadas. Fabricación propia en Tortuguitas, por encargo en unos 20 días y con envíos a todo el país.**
- CTA 1: **Ver catálogo** · CTA 2: **Event Summit 2027**

### 5.2 Bloque fijo en cada ficha de producto (debajo del CTA)
- **Pago** — Precio por transferencia. Con link de Mercado Pago se suma un recargo de [X]% *(un solo número; ver E-05)*.
- **Envío** — A todo el país por Vía Cargo, con 50% de descuento en el valor del envío. Donde no llega, Buspack, MD o FlechaBus. El seguro se abona a la transportista.
- **Producción** — Por encargo: contá unos 20 días desde que confirmás. Cerramos la producción por semana.
- **Colores** (solo hierro) — Blanco, negro, dorado, plateado o rosa gold.
- **¿Dudas?** — Te responden Flor o Tobías por WhatsApp, sin bots.

### 5.3 Mensaje de WhatsApp del carrito (formato)
```
¡Hola! Quiero hacer este pedido desde la web (pedido SF-XXXXX):

• 1 × Arcada de hierro 3D — 2.40 × 1.80 — Dorado — $351.000
  sweetflowers…/productos/hierro/arcada-de-hierro-3d
• 2 × Alzada Corona — Blanco — $X c/u

Subtotal por transferencia: $X
(1 producto a cotizar)

Para cuándo lo necesito: 15/12
Envío a: Rosario, Santa Fe
Pago: transferencia
Código Club: CLUB-XXXX
Nombre: …
```
Microcopy encima del botón: **"Te respondemos por WhatsApp para confirmar colores, envío y la fecha de entrega. No se cobra nada acá."** (ya existe parecido; sumar "fecha de entrega").
Campo nuevo: **"¿Para cuándo lo necesitás?"** con ayuda "Trabajamos por encargo, unos 20 días".

### 5.4 Hero del Summit (urgencia real)
- Sobre la cuenta regresiva: **La preventa Comunidad termina en** [días:horas] (hasta el 10/11)
- Debajo: **Pase General $180.000 · Pase VIP $330.000 — desde el 11/11: $260.000 y $370.000.**

### 5.5 Tarjeta de pase
- Rótulo de la vigente: **Precio de hoy** · debajo de la siguiente, tachado suave: **Desde el 11/11: $260.000** · chip: **Ahorrás $80.000** (General) / **Ahorrás $40.000** (VIP).

### 5.6 FAQ del Summit (encima del formulario)
1. **¿Para quién es?** — Para decoradoras, organizadoras de eventos y emprendedoras del rubro, empiecen o ya tengan años. *(confirmar con Flor si hay un perfil excluido)*
2. **¿Qué incluye cada pase?** — (lista de `PASES`, ya confirmada).
3. **¿Cuándo y dónde?** — 9 de abril de 2027, de 12:30 a 19 h, en La Rural (Palermo, Buenos Aires).
4. **¿Cómo pago? ¿En cuotas?** — Online con Mercado Pago: tarjeta de crédito en cuotas, débito, dinero en cuenta o efectivo. Si pagás en efectivo, tu lugar se confirma cuando se acredita.
5. **¿Qué son las actividades del 7 y 8 de abril?** — Son actividades extra que se abonan aparte. Escribinos y te pasamos el detalle. *(falta el detalle: [BLOQUEADO-TERCEROS])*
6. **¿Puedo comprar para mi equipo?** — Sí: hacé una inscripción por persona, así cada una recibe su código y su certificado. *(verdadero con el sistema actual)*
7. **¿Y si después no puedo ir?** — Escribinos por WhatsApp de capacitaciones (11 5512-7508) y lo vemos con vos. *(respuesta honesta hasta que Flor defina devolución/transferencia de entrada: [BLOQUEADO-TERCEROS])*
8. **¿Dan factura?** — Escribinos antes de pagar y te contamos. *(idem)*
Debajo del botón "Pagar": **"Al pagar aceptás las condiciones de la inscripción"** con link a la FAQ hasta que exista la política.

### 5.7 Cifras y frases del Summit corregidas
- Reemplazar "Una vez al año, … y siempre se agota" por: **"Siete workshops, una primera edición en La Rural y ahora la segunda. La decoración de eventos se junta en un mismo lugar: charlas de referentes, proveedores, comunidad y una escena montada por Sweet Flowers. Presencial y con 80 lugares."**
- Stats: **7 workshops · +340 asistentes en workshops · +20 disertantes · 80 lugares** *(confirmar el 340 con Flor; sale de los datos de cada workshop ya cargados)*.
- Meta description: "Preventa abierta" (no "Pre-preventa").

### 5.8 Página de éxito del Summit — bloque extra
- **Agregalo al calendario** (Google / Apple) · **Cómo llegar a La Rural** · Si es VIP: **"Ya sos Cliente VIP: tenés 15% de descuento en cualquier compra. Mirá el catálogo →"**

### 5.9 `/historia` provisoria (sin firma, tercera persona, solo hechos)
**"Sweet Flowers Deco Party es un emprendimiento familiar de Tortuguitas, Buenos Aires. Fabricamos estructuras de hierro, piezas para catering, fundas y telas sublimadas para decoradoras de todo el país. Trabajamos por encargo y te atienden Flor y Tobías en persona. Desde 2024 organizamos workshops para el rubro —siete, en CABA, Puerto Madero, La Rioja y Río Cuarto— y en septiembre de 2026 la primera edición del Sweet Flowers Event Summit en La Rural."** + CTA "Conocé el Summit". La historia en primera persona, cuando la mande Flor.

### 5.10 Recargo (una línea, en todos lados)
**"El precio publicado es por transferencia. Con link de Mercado Pago se suma un [X]%."** — X = el que defina Flor (la fórmula de CONTENIDO_FLOR §4 da 17,6%). Borrar "se comunica como 15%".

### 5.11 Newsletter
- Beneficio corregido: **"Te avisamos antes de que cambie el precio del Summit"** (en lugar de "Preventas antes que el público").
- Variante para páginas del Summit: titular **"Enterate primero quiénes disertan"** · beneficio **"Disertantes, cronograma y cambios de precio, antes que en Instagram"**.

### 5.12 `/resenas` (sin review gating)
**"Si algo no salió como esperabas, también queremos saberlo: contalo en tu reseña o escribinos por WhatsApp y lo resolvemos."**

### 5.13 Tareas sin texto
- Borrar pedido de prueba `SF-9QWFM`.
- Ocultar (o mover a "Stock y oportunidades") MDF y madera hasta que Flor confirme (E-09).
- Script de limpieza de descripciones (E-04) + "Desde $X" automático.
- Botón flotante de WhatsApp con la línea de capacitaciones en `/event-summit/**` (E-18).
- Arreglar el corte "ENCONTRAMO/S" (E-17).
- Vercel Analytics + eventos + UTM en mensaje (E-28).
- Esconder los links legales `#` o publicar páginas provisorias (E-26).
