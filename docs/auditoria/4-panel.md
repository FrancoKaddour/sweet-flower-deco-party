# Jurado 4: Panel de administración (UX y funcionalidad)

**Cómo se auditó:** `localhost:3000` no respondía (Chrome mostraba la página de error y `curl` desde la VM de Fran devolvía 000). Usé **producción** (`sweet-flower-deco-party.vercel.app/panel`), donde Fran tenía la sesión iniciada como superadmin. Solo navegué con GET: no guardé, no cambié estados, no subí nada y no envié nada. Probé desktop 1440 y celular 390 (con el iframe del laboratorio). El resto lo leí en el código: `app/panel/**`, `components/panel/**`, `modules/{catalog,ventas,summit,newsletter}`, `app/api/panel/**`, `app/api/cron/newsletter`, `lib/dal.ts`, `lib/email/enviar.ts` y `docs/GUIA_PANEL.md`.

> ⚠️ **Dato real ensuciado en producción:** apareció un pedido **SF-9QWFM**, sin nombre, "2 × Alzadas mdf más Pino", del 26/10 a las 15:20. No estaba cuando entré al Inicio, así que casi seguro lo generó otro jurado probando el carrito en prod. Fran tiene que archivarlo.

---

## 1. Nota del jurado (escala 1-10, criterios de esta área)

| Criterio | Nota | Justificación |
|---|---|---|
| Diseño y consistencia de marca | **7,5** | Tiene identidad propia (eyebrows ✧, display en mayúsculas, sage/blush/sand), no es un template de shadcn. Le bajan dos cosas: el bloque rojo con texto champagne (contraste 1,81:1) y errores de copy como "PASE PASE VIP". |
| Usabilidad para Flor (no técnica) | **6** | Las tareas diarias de pedidos y consultas salen bien. Las del Summit (cobros, acreditación, reenviar la entrada) y las de catálogo en volumen (precio rápido, orden) no existen. La campaña se envía en una versión distinta de la que Flor ve. |
| Funcionalidad y robustez | **5,5** | Hay buena base (zod, `assertStaff` en cada action, auditoría, bloqueo de doble envío). Pero hay bugs con consecuencias reales: productos borrados que siguen online, el webhook de MP que pisa "Asistió", el cupo que se puede sobrevender, "Duplicar" que rompe las fotos del original y no hay `error.tsx`. |
| Mobile | **7,5** | Las tablas pasan a tarjetas sin scroll horizontal, los targets miden 44px, el botón de guardar queda fijo abajo y el drawer es accesible. No hay check-in desde el celu y los switches se pueden tocar sin querer, sin forma de deshacer. |
| Accesibilidad básica | **6,5** | Los labels, `aria-current`, `role=switch`, el foco del drawer y `inert` están bien. El contraste de la franja roja reprobó, los errores de las server actions no se anuncian y la búsqueda no ignora acentos. |
| Cobertura de contenido editable | **4** | Precios y fechas del Summit, cupo, preventas, FAQ, landings, textos, WhatsApp y disertantes solo se cambian por código. |

**Nota global del panel: 6/10.** Está bien hecho para cargar el catálogo y llevar el día a día. Para el Summit, que es la vertical que cobra, todavía no alcanza.

---

## 2. Hallazgos

### 🔴 Críticos

**P-01 🔴 "Ocultar" o "Borrar" un producto en el panel no lo saca del sitio: la ficha sigue online con datos viejos**
- **Dónde:** `modules/catalog/repository.ts:140-147` (`getProducto`) junto con `estaticoProductos()`. El seed sale de `CATALOGO_WHATSAPP`, así que los slugs de la base y los del respaldo estático son los mismos.
- **Qué pasa:** `productosDeBase({slug})` filtra `visible=true` y `deletedAt IS NULL`. Si no encuentra el producto, cae a `estatico()`, que lo busca por slug en el catálogo estático. Resultado: un producto oculto o borrado sigue respondiendo en `/productos/<cat>/<slug>` con el precio y la foto del import de WhatsApp. Lo mismo pasa si Flor le cambia el slug: la URL vieja sigue mostrando el contenido viejo. Además, `getDestacados` (L150-152) vuelve a los destacados estáticos si en la base no queda ninguno marcado.
- **Por qué importa:** rompe la confianza en el panel ("lo borré y sigue apareciendo"), puede mostrar precios desactualizados y deja contenido duplicado para SEO.
- **Arreglo:** usar el respaldo estático **solo si la base falla** (en el `catch` de `seguro`), nunca cuando "no lo encontró". Si hay base y no aparece, devolver `notFound()`. Si se cambia el slug, guardar el slug viejo en una tabla `redirects` y hacer 301. En `getDestacados`, si hay base, devolver `[]` aunque esté vacío.
- **Esfuerzo:** S.

**P-02 🔴 La campaña se envía en la última versión guardada, no en la que Flor está viendo**
- **Dónde:** `components/panel/newsletter/AccionesCampana.tsx` (está arriba del editor) y `CampanaEditor.tsx` (estado local controlado). `enviarCampana`/`enviarPrueba` leen la campaña de la base (`modules/newsletter/actions.ts:72-110`).
- **Qué pasa:** Flor edita el texto o cambia el segmento, mira la vista previa en vivo y toca "Enviarme una prueba" o "Enviar a N personas". Las dos acciones mandan lo que estaba guardado antes, y el contador N corresponde al segmento guardado. No hay aviso de "tenés cambios sin guardar" ni `beforeunload`.
- **Por qué importa:** un mail masivo con el texto viejo o al grupo equivocado no se puede deshacer, y la prueba no protege porque también sale vieja.
- **Arreglo:** con cambios sin guardar (`dirty`), deshabilitar Prueba y Enviar y mostrar "Guardá antes de probar". Más simple todavía: que Prueba y Enviar guarden primero (mandar el `FormData` y ejecutar `guardarCampana` → enviar). Mover las acciones debajo del editor o dejarlas fijas. Agregar `beforeunload` si hay cambios.
- **Esfuerzo:** S-M.

**P-03 🔴 El webhook de Mercado Pago pisa "Asistió" o "Cancelado" y reenvía la entrada**
- **Dónde:** `modules/summit/core.ts:77-86`.
- **Qué pasa:** cuando el pago llega aprobado, el `UPDATE … SET estado='pago' WHERE estado <> 'pago'` se aplica también si la inscripción ya estaba en `asistio` o `cancelado` (por ejemplo, si Flor marcó Asistió en el check-in). MP reintenta las notificaciones y, como `nueva` vuelve con datos, `enviarEntrada()` manda **otro mail de entrada**. También, si Flor marca "Pagó" a mano (transferencia), el aviso posterior de MP vuelve a mandar el mail, porque la condición no mira `pagoEstado`.
- **Por qué importa:** se pierde la asistencia el día del evento, llegan mails duplicados y alguien cancelado puede quedar como pagado.
- **Arreglo:** la condición tiene que ser `pagoEstado IS DISTINCT FROM 'aprobado' AND estado IN ('consulto','seno')`. La idempotencia del mail tiene que depender de `pagadoAt IS NULL`.
- **Esfuerzo:** S.

**P-04 🔴 El cupo se puede sobrevender y archivar libera lugares**
- **Dónde:** `modules/summit/pago.ts:51` (`quedanLugares` solo cuenta `seno|pago|asistio`), `modules/summit/core.ts:13-25` y `modules/ventas/actions.ts:73-80` (`archivarRegistro`).
- **Qué pasa:**
  - Con 1 lugar libre, 10 personas pueden empezar el checkout: cada una crea su inscripción en "consulto" y ninguna reserva el lugar. Si las 10 pagan, el webhook aprueba las 10 sin volver a mirar el cupo, y quedan 89/80.
  - El panel lo esconde: la barra usa `Math.min(100, …)` (`summit/page.tsx:86`).
  - Archivar una inscripción pagada pone `deletedAt` y `lugaresOcupados()` deja de contarla, así que el sitio vuelve a vender ese lugar.
- **Por qué importa:** vender 9 lugares que no existen es un problema operativo y de reputación.
- **Arreglo:**
  - Reservar el lugar unos 30 minutos al crear la preferencia (`pagoEstado='pendiente' AND createdAt > now()-30m` cuenta como ocupado) y pasar `expiration_date_to` a la preferencia de MP.
  - En `aplicarPago`, si se pasó el cupo, marcar "sobrecupo" y avisar en el panel.
  - Mostrar ">100%" en rojo.
  - No dejar archivar inscripciones con `pagoEstado='aprobado'`: solo cancelar, con reembolso manual.
- **Esfuerzo:** M.

### 🟠 Altos

**P-05 🟠 Falta todo lo operativo del Summit: export de inscriptos, check-in, reenvío de entrada, recaudado**
- **Dónde:** `app/panel/(app)/summit/page.tsx`. El único export que existe es el de suscriptores (`app/api/panel/newsletter/export`).
- **Qué pasa:** no se puede bajar la lista de acreditación (nombre, DNI, pase, código, estado de pago). No hay modo check-in desde el celular (buscar por DNI o código y marcar "Asistió" de un toque, idealmente leyendo el QR del mail). No hay botón "Reenviar entrada". No se ve **cuánto se recaudó** (Σ `precioReferencia` con pago aprobado) ni cuántos **lugares quedan**. La lista no tiene paginación ni filtro por edición.
- **Por qué importa:** el 9/4/2027 Flor va a acreditar 80 personas con una planilla armada a mano. Es la tarea más visible del producto y no está cubierta.
- **Arreglo:**
  - `GET /api/panel/summit/export` en CSV con `;` y BOM (ver P-14).
  - Página `/panel/summit/check-in` para mobile: un input grande con autofocus para DNI o código, el resultado con el nombre y el pase en grande, y un botón "Marcar asistió". Más adelante, QR con `BarcodeDetector`.
  - Botón "Reenviar entrada" que llame a `enviarEntrada`.
  - Métricas "Recaudado", "Lugares libres" y "Pendientes en MP".
- **Esfuerzo:** M-L.

**P-06 🟠 El dashboard no muestra los números del negocio**
- **Dónde:** `app/panel/(app)/page.tsx`.
- **Qué pasa:** el Inicio muestra 3 contadores de pendientes y después una franja grande con Productos, Visibles y Destacados (vanidad del catálogo), "últimos editados" y 3 atajos. No aparecen: inscriptos por pase, recaudado del Summit, lugares libres, cuántos días quedan de la preventa vigente, suscriptores nuevos en 7 o 30 días, pedidos de la semana y su monto estimado, ni los productos más pedidos (sale fácil de `orders.items`). La franja más grande de la pantalla se lleva la información que menos decide.
- **Por qué importa:** hoy el Inicio es decorativo. Flor vuelve a WhatsApp para saber cómo viene.
- **Arreglo:**
  - Cambiar la franja roja por "Summit: 23/80 · $ 4.830.000 · preventa termina en 15 días".
  - Agregar una fila de KPIs: Pedidos de los últimos 7 días, Consultas sin responder (con antigüedad de la más vieja) y Club +N.
  - Agregar "Top 5 productos pedidos (30 días)".
  - Mover las cifras del catálogo a Catálogo.
- **Esfuerzo:** M.

**P-07 🟠 "Duplicar producto" comparte las fotos con el original, y borrar una en la copia rompe el original**
- **Dónde:** `modules/catalog/actions.ts:111-113` (copia la misma `url`) y `:143` (`del(img.url)` en Blob).
- **Qué pasa:** la copia apunta a los mismos blobs. Si Flor borra una foto de la copia (que es lo esperable: "duplico y cambio la foto"), se elimina el archivo y el producto original queda con la imagen rota en el sitio.
- **Arreglo:** en `borrarImagen`, borrar el blob solo si ningún otro `product_images` usa esa URL (`count(*) where url = …`). La otra opción es copiar el blob al duplicar.
- **Esfuerzo:** S.

**P-08 🟠 No hay `error.tsx` ni `loading.tsx` en el panel, y los errores de las actions se pierden**
- **Dónde:** `find app -name error.tsx` no devuelve nada (solo existe `app/not-found.tsx`). Los componentes `EstadoSelect`, `Alternar`, `CodigoUsado`, `AccionesProducto` e `ImagenesProducto` (en mover y borrar) llaman a la action sin `try/catch`.
- **Qué pasa:** si la sesión venció, Neon tarda en arrancar o la base corta, el `throw` de `assertStaff` o de Drizzle dentro de una transición va al error boundary por defecto de Next ("Application error"). Otra posibilidad es que el optimista revierta en silencio: el switch vuelve a su lugar y nadie explica qué pasó. Sin `loading.tsx`, la navegación entre secciones no da ninguna señal durante el cold start de Neon.
- **Arreglo:**
  - Crear `app/panel/(app)/error.tsx` con la marca, el texto "No pudimos guardar. Revisá tu conexión o volvé a entrar" y botones Reintentar e Ir a ingresar.
  - Crear `loading.tsx` con skeletons.
  - Agregar un helper `useAccion()` que haga `try/catch` y muestre un toast (`role=status`/`alert`).
- **Esfuerzo:** S-M.

**P-09 🟠 Contraste reprobado en la franja roja (Summit e Inicio)**
- **Dónde:** `/panel/summit` y `/panel` a 1440 y a 390. La clase `bg-botanical` resuelve a `rgb(237,28,35)`.
- **Evidencia:** el texto "✧ Precio vigente: …" en champagne `rgb(198,161,91)` sobre el rojo da **1,81:1**, y es la línea con el dato más importante (precio y preventa vigentes). Los subtítulos en `text-bone/55` y los `dt` en `bone/60` de 13px quedan alrededor de 2:1.
- **Arreglo:** dentro de esa franja, usar bone al 100% para los textos chicos o tinta sobre `blush`. El eyebrow champagne solo va sobre fondos oscuros (ink). Mismo fix en "✧ El catálogo hoy".
- **Esfuerzo:** S.

**P-10 🟠 Los estados del Summit no reflejan el flujo real (100% online)**
- **Dónde:** `db/schema.ts:287` (default `consulto`), `modules/summit/pago.ts:58-72`, `app/panel/(app)/page.tsx` ("Reservas al Summit · Consultaron y falta la seña"), `components/panel/nav.ts` (badge `inscripciones: consulto`) y `docs/GUIA_PANEL.md`.
- **Qué pasa:** cada checkout abandonado queda en "Consultó", infla el badge rojo del sidebar y el Inicio lo presenta como "falta la seña", cuando ya no hay seña (`content/evento.ts:35`: "se paga TODO online"). El estado "Señó" quedó obsoleto pero sigue en filtros y selects. Tampoco se distingue "abandonó el checkout" de "MP: en proceso / rechazado", que es lo que Flor necesita para hacer seguimiento por WhatsApp.
- **Arreglo:**
  - Renombrar a "Empezó (sin pagar)" y sacar "Señó", o dejarlo solo para lo manual.
  - Que el badge cuente solo los pagos `en_proceso`/`rechazado` de las últimas 48 h.
  - Agregar el filtro "Pagos pendientes en MP".
  - Actualizar GUIA_PANEL.
- **Esfuerzo:** S-M.

**P-11 🟠 Precio: tipear "15000.00" guarda $1.500.000, sin ningún aviso**
- **Dónde:** `modules/catalog/schemas.ts:22-26`.
- **Qué pasa:** `v.replace(/[.\s$]/g, "")` borra todos los puntos (se asume separador de miles). "15000.00" se convierte en "1500000" y pasa la validación como entero. Lo mismo con "1.5" (que se vuelve 15). El campo no muestra cómo va a quedar el precio formateado.
- **Por qué importa:** un precio 100 veces más alto en el sitio y en el WhatsApp del carrito.
- **Arreglo:** si el string matchea `/\.\d{1,2}$/`, tratarlo como decimales y rechazarlo con "Sin centavos". Mostrar debajo del input el valor `formatARS(n)` en vivo ("Se va a ver: $ 15.000").
- **Esfuerzo:** S.

**P-12 🟠 El contenido clave del sitio solo se edita por código**
- **Dónde:** `content/evento.ts`, `content/seo/faqs.ts`, `content/seo/landings.ts`, `content/seo/negocio.ts`, `content/site.ts`, `content/galerias.ts`, `content/newsletter.ts`.
- **Lista de lo que Flor no puede tocar:**
  - Summit:
    - Fecha, horario y sede.
    - **Cupo** (80).
    - **Preventas** (nombres, precios VIP/General, fechas `hasta`). Además, después del 15/12 `tarifaVigente()` sigue cobrando la última preventa porque no hay fase de "precio lleno".
    - Qué incluye cada pase.
    - Disertantes (hoy "[Disertante 01]") y el timeline de la trayectoria.
  - FAQ completa, textos y bloques de las landings SEO.
  - Datos del negocio (dirección, horarios, que hoy están BLOQUEADOS por terceros), número y mensaje de WhatsApp, redes, galerías y reseñas.
  - Plantillas de campañas y segmentos.
  - Alt text de cada foto: siempre se guarda el nombre del producto (`ImagenesProducto.tsx:38`).
  - Orden de productos dentro de la categoría (el `orden` se asigna al crear y no hay UI). Orden de categorías. No se pueden borrar categorías.
  - Portada de categoría: es un input "Pegá la URL", no se puede subir una foto (`CategoriaForm.tsx:49`).
- **Por qué importa:** cada cambio de precio o de fecha del Summit pasa por Fran y un deploy. Con preventas que vencen el 10/11 y el 15/12, va a pasar sí o sí.
- **Arreglo (priorizado):**
  1. Tabla `settings` (clave → JSON) con una pantalla "Summit" en el panel: fecha, sede, cupo, preventas (lista editable), pases y disertantes. `content/evento.ts` queda como valor por defecto.
  2. FAQ editable (lista con arrastrar para ordenar).
  3. Subir la foto de portada de categoría con el mismo `upload`.
  4. Reordenar productos con ↑↓ (como las fotos) o drag and drop.
- **Esfuerzo:** L (1), M (2), S (3), M (4).

### 🟡 Medios

**P-13 🟡 La búsqueda no ignora acentos.** `ilike` sin `unaccent` (`modules/catalog/admin.ts:17`, `ventas/admin.ts:12`, `newsletter/admin.ts:37`). Probado en prod: `?q=alzadas mdf mas` da **0 resultados**, y el producto se llama "Alzadas mdf **más** Pino". En suscriptores y Summit pasa lo mismo con "José" o "Gómez". **Arreglo:** `create extension unaccent` y `unaccent(col) ilike unaccent($1)`. **S.**

**P-14 🟡 El CSV de suscriptores abre roto en Excel en español.** `app/api/panel/newsletter/export/route.ts`: separador `,` (Excel es-AR usa `;`, así que todo queda en la columna A) y fechas ISO en UTC. Tampoco respeta el filtro activo. El BOM y el escape anti-fórmula están bien. **Arreglo:** usar `;`, `sep=;` o generar `.xlsx`. Fechas en `dd/mm/aaaa hh:mm` hora de Argentina. Pasar `q` y `estado`. **S.**

**P-15 🟡 El total del pedido muestra "$ 0" cuando todo es a consultar.** Visto en prod en el pedido SF-9QWFM: "TOTAL (TRANSFERENCIA) $ 0 + productos a consultar" (`pedidos/page.tsx:104`, `[id]/page.tsx:74`). **Arreglo:** si `total===0 && hayConsultar`, mostrar "A cotizar". Permitir que Flor cargue el **precio cotizado** por ítem y el total final en el detalle (hoy solo hay nota libre). **S-M.**

**P-16 🟡 Producto nuevo: sale "Visible" por defecto aunque todavía no tiene foto.** `ProductoForm.tsx:82` (`defaultChecked={valores?.visible ?? true}`) y el flujo "crear → después subir fotos". El producto se publica sin foto en cuanto Flor toca "Crear". **Arreglo:** default oculto al crear y un CTA "Publicar" cuando ya tenga al menos 1 foto. Otra opción: aceptar fotos en el alta (subir antes con un id temporal). **S.**

**P-17 🟡 No hay edición rápida de precio ni acciones masivas.** Para actualizar los precios por inflación (192 productos) hay que abrir uno por uno. **Arreglo:** en la tabla, celda de precio editable inline (`<input>` + Enter guarda con la action), y una acción masiva "subir X% a la categoría" con vista previa. **M.**

**P-18 🟡 Los switches de Visible/Destacado no tienen deshacer ni feedback.** `Alternar.tsx`: en celular están en tarjetas largas y es fácil tocarlos al hacer scroll. Ocultar un producto no avisa nada y no ofrece "Deshacer". **Arreglo:** toast "Ocultaste X · Deshacer" durante 5 s. **S.**

**P-19 🟡 Archivar no se puede deshacer ni tiene vista "Archivados".** `Archivar.tsx` + `archivarRegistro`. "Archivar" suena reversible, pero desde la UI es definitivo (solo se recupera desde la base). Lo mismo pasa con "Borrar producto" (el `confirm` dice "Deja de verse en el sitio" y no hay papelera). **Arreglo:** filtro "Archivados" con "Restaurar", y una "Papelera" de productos. **M.**

**P-20 🟡 "Borrar" campaña no pide confirmación y es un DELETE físico.** `AccionesCampana.tsx:47-50` → `borrarCampana` (`delete from campaigns`). Elegir una plantilla en "Nueva campaña" también reemplaza lo que ya se había escrito, sin preguntar (`CampanaEditor.tsx:~78`). **Arreglo:** confirmación en dos pasos, como en Archivar, y preguntar antes de aplicar una plantilla sobre texto ya escrito. **S.**

**P-21 🟡 Una campaña puede quedar trabada en "Enviando".** `enviarCampana` marca `enviando` y después hace `await enviarLote`. Si la función se corta (timeout o deploy), queda así para siempre, sin reintento ni forma de saber a quién llegó. El cron de recordatorio marca `recordatorioAt` a **todos** los pendientes aunque haya fallado algún lote (`cron/newsletter/route.ts:44-48`). **Arreglo:** registrar los envíos por destinatario (`campaign_sends`) y agregar un botón "Reintentar a los que faltan". En el cron, marcar solo los lotes que salieron bien. **M.**

**P-22 🟡 Los permisos que muestra Ajustes no coinciden con el código.** `ajustes/page.tsx:19-21` dice que el editor "Carga y edita productos, fotos y **categorías**", pero `guardarCategoria` es `SOLO_ADMIN` y la misma página de categorías dice "Solo un administrador puede editar categorías". Ajustes tampoco menciona que enviar campañas, archivar y dar de baja suscriptores son solo de admin. **Arreglo:** generar la tabla de permisos desde una constante compartida con las actions. **S.**

**P-23 🟡 El panel cuenta inscripciones de todas las ediciones.** `ventas/admin.ts:83-87` y `listarInscripciones` no filtran `edicion`, mientras que el cupo público sí lo hace (`summit/core.ts:20`). Cuando arranque la 3.ª edición, el "0/80" del panel va a sumar las dos. **Arreglo:** filtrar por `EDICION_LABEL` y agregar un selector de edición. **S.**

**P-24 🟡 No hay pantalla de auditoría.** Se escribe `audit_log` en todas las actions, pero no hay UI para verlo. Con 3 personas en el panel, "¿quién ocultó esto?" no tiene respuesta. Además, `moverImagen` no audita. **Arreglo:** `/panel/ajustes/actividad`, solo lectura, con filtro por persona y entidad. **S-M.**

**P-25 🟡 No hay avisos a Flor.** Una inscripción pagada, una consulta nueva o un pago rechazado no generan notificación (mail o WhatsApp) para el equipo: solo el badge, si tiene el panel abierto. **Arreglo:** mail interno en `aplicarPago` (aprobado o rechazado) y en `registrarConsulta`, a `EMAIL_EQUIPO`. **S.** `[BLOQUEADO-TERCEROS]` hasta que esté el dominio de Resend. Mientras tanto se puede dejar listo con el modo simulado.

### ⚪ Bajos

**P-26 ⚪ "PASE PASE VIP" / "PASE PASE GENERAL".** `summit/page.tsx:75` y `:138` arman `` `Pase ${p.nombre}` `` y `nombre` ya es "Pase VIP". Se ve en la captura a 1440 y a 390. **S.**

**P-27 ⚪ Textos técnicos frente a Flor.** "(ver docs/MERCADOPAGO.md)" en `summit/page.tsx:93`, "(ver docs/NEWSLETTER.md)" en `Comunes.tsx:33` y `docs/SETUP_BACKEND.md` en `SinBase.tsx`. **Arreglo:** "Falta un paso técnico: avisale a Franco". **S.**

**P-28 ⚪ El `<title>` sale doble** en algunas rutas: "Panel · Sweet Flowers · Sweet Flowers Deco Party" (en el Inicio se suma la plantilla raíz del sitio). **S.**

**P-29 ⚪ Las fotos se suben sin comprimir.** Llegan hasta 15 MB directo a Blob desde el celular con datos móviles y suben de a una, secuencialmente, sin barra de progreso por archivo. **Arreglo:** redimensionar en el cliente a 2400px webp (canvas / `createImageBitmap`) antes de `upload`, y mostrar el progreso con `onUploadProgress`. **S-M.**

**P-30 ⚪ Las listas traen todas las filas y paginan en memoria** (`listarPedidos`, `listarConsultas`, `listarSuscriptores`, `listarProductosPanel`), y Summit no tiene paginación. Con el volumen de hoy no pasa nada; se rompe con unos 5k suscriptores. **Arreglo:** `limit/offset` en SQL. **S.**

**P-31 ⚪ Cambiar el estado de una inscripción a "Cancelado" no pide confirmación** ni recuerda que hay que hacer el reembolso en MP. Pasar a "Pagó" a mano no manda la entrada. **S.**

---

## 3. Top 10 para subir la nota antes del viernes (impacto / esfuerzo)

1. **P-01:** que el fallback estático no resucite productos ocultos o borrados. (S)
2. **P-03:** idempotencia correcta del webhook (no pisar Asistió, no duplicar mails). (S)
3. **P-02:** bloquear Prueba y Enviar si hay cambios sin guardar, o guardar antes de enviar. (S)
4. **P-07:** no borrar un blob que comparte otro producto. (S)
5. **P-11 + P-26 + P-09:** parser de precio con vista previa, "Pase Pase" y contraste de la franja roja. (S, en un solo PR)
6. **P-08:** `error.tsx` y `loading.tsx` del panel, y un helper de toast para las actions. (S-M)
7. **P-05 (parte 1):** export CSV de inscriptos y botón "Reenviar entrada". (S-M)
8. **P-06:** Inicio con los KPIs de verdad: Summit (inscriptos por pase, recaudado, libres, días de preventa), Club +N y top productos. (M)
9. **P-04:** reserva de lugar durante el checkout, control de sobrecupo y no dejar archivar pagados. (M)
10. **P-13 + P-14:** búsqueda sin acentos y CSV que abra bien en Excel en español. (S)

## 4. Ideas "wow" (viables en 2-3 días)

1. **Modo puerta (check-in) del Summit:** pantalla mobile a pantalla completa con la cámara (`BarcodeDetector`) que lee el QR de la entrada que llega por mail (el código `SUM-XXXXX`). Muestra en grande "✓ Sofía Gómez · Pase VIP" sobre fondo sage, con un sonido suave y vibración, y un contador "47/80 adentro" en vivo. Sirve también para mostrarlo en el case study de Awwwards.
2. **"Editor del Summit" sin código:** preventas como tarjetas con fecha de vencimiento y una cuenta regresiva ("La preventa VIP vence en 15 días: ¿mandamos la campaña?") que abre una campaña ya armada con el precio que está por vencer.
3. **Precio por inflación en 1 minuto:** seleccionar la categoría, poner "+12%", ver la vista previa con el antes y después y el redondeo a $500, y aplicar. Queda auditado y se puede deshacer.
4. **Pulso del día en el Inicio:** una línea en lenguaje natural arriba de todo ("Hoy entraron 3 pedidos (≈ $ 214.000), 2 consultas sin responder hace más de 24 h y 4 inscriptos VIP. Quedan 31 lugares.") armada con datos reales, sin IA, y cada pedazo lleva a su lista filtrada.
5. **Tomar foto → producto publicado desde el celular:** botón "Nuevo con foto" que abre la cámara (`capture="environment"`), comprime en el cliente, crea el borrador con la foto como portada y lleva directo a nombre, precio, categoría y "Publicar". Son tres toques desde el depósito.
