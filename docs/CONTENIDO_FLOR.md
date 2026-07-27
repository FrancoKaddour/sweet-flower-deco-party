# Contenido real de Flor — respuestas ordenadas

> Transcripción de los audios de Flor (16-51), **ordenada y clasificada** para poder llenar el sitio. Fuente para reemplazar los `TODO(contenido)`.
> Estado de cada dato: ✅ **confirmado** · 🟡 **a confirmar / afinar** · ⬜ **pendiente de entrega**.
> Regla: nada de esto se "redondea" ni se inventa. Lo que está 🟡 se confirma con Flor antes de publicar.

Última actualización: 2026-07-26 (primeros audios). Documento **vivo**.

---

## 1. Operación general

- Trabajan **mayormente por pedido**. Manejan algo de stock pero **varía**; en eventos, los clientes ya saben que es por encargo. ✅
- **Tiempo de entrega:** ~15 días reales; para comunicar, usar **20 días** (margen). Cierran producción **por semana**, así que puede variar según cuándo se compra. ✅
- Marca **muy casera / familiar**, todavía no operan "empresa a empresa" en todo. Tono del sitio: **castellano, cercano**. ✅

## 2. Canales de venta

- **Tienda Nube: ya NO la tienen.** ✅ (refuerza el e-commerce propio — ADR-007)
- **Mercado Libre: no venden.** ✅
- **Redes sociales: sí** (todas con el mismo usuario). ⬜ *Flor va a escribir los @ / links exactos.*

## 3. Productos

- Son **muchos**; se cargan **de a poco y bien** (con fotos que correspondan; producto sin buena foto, no se sube). ✅
- Fuente del listado: el **catálogo de WhatsApp**. Falta **terminar de subir** cosas y hacer una **selección con Tobías** de qué va primero a la web. 🟡
- Se pueden ir agregando por **nombres específicos** propios (como los llaman internamente). ✅
- **Materiales:** la campaña actual es **todo hierro**. **MDF y madera/pino: casi no los trabajan** — no incluirlos salvo más adelante en una sección de **stock/promos** (cosas que ya no producen). ✅

### Productos que más se venden hoy ✅
- **Catering:** *Eclipse*, *Arcoíris*.
- **Estructuras:** *Telonera S*, *Arcos extensibles* (se venden muchísimo), *Ecos* (estructura nueva), *Arcada de hierro común*.
- **Pies de lámpara** (vendiendo mucho ahora).
- **Fundas** (todas las semanas) y **telas sublimadas** (todas las semanas).
- Foco actual de campaña: **hierro + catering** (funcionando muy bien).
> 🟡 Flor va a **chequear y confirmar** el top exacto; esta lista es lo que dijo de memoria.

## 4. Precios y recargo (IMPORTANTE para el e-commerce)

- El **precio del catálogo es SIN recargo**. ✅
- Para **Mercado Pago** se aplica recargo. Se comunica como "15%", pero **la cuenta real es dividir por (1 − 0,15)**, lo que da **≈ +18%**.
  - Fórmula a implementar: `precio_mp = precio_catalogo / (1 - 0.15)` → ≈ **+17,6 %**. ✅
  - > **Gonzalo:** esto es la lógica de precio con MP. El catálogo guarda el precio base; el recargo se calcula, no se hardcodea.
- Falta el **listado maestro con precios** (sale del catálogo de WhatsApp). ⬜

## 5. Envíos y garantías

- Empresa principal: **Vía Cargo** — con **50% de descuento en el valor del envío**. ✅
- Alternativas si Vía Cargo no llega: **Buspack / MD / FlechaBus** (hoy son la misma empresa). ✅
- **Seguro / garantías:**
  - Con **Buspack/MD/FlechaBus**: el **seguro lo paga el cliente a la transportista**, y el reclamo lo gestiona el cliente con la transportista. ✅
  - Con **Vía Cargo**: Sweet Flowers **tiene llegada** y puede **gestionarlo**; igual el seguro se paga a la transportista. ✅

## 6. Productos a medida

- Se **cotizan**; **misma demora** que un producto normal, **salvo** que sea muy específico / con mucho trabajo → se da **más tiempo**. ✅
- Ejemplo real: una **barra móvil** con estructura de hierro + madera atornillada → ~**1 mes** (primero la estructura de hierro, después al taller de madera). ✅
- Regla: la demora depende de la **complejidad**. ✅

## 7. Atención al cliente

- Hoy contestan **Tobías y Flor** (se turnan; cada uno con sus clientes; a los nuevos los etiquetan). ✅
- **3 preguntas más frecuentes antes de comprar:** ✅
  1. **Formas de pago.**
  2. **Si hacen envíos a todo el país.**
  3. **Tiempos de demora.**
- (Sirven para una sección de **FAQ**.)

## 8. Equipo

- Hoy son **4–5 personas**: producción + **publicidad** + **web (Franco)**. ✅
- 🟡 Definir qué mostramos como "equipo" (los que laburan en la empresa vs. colaboradores).

## 9. Historia de la marca

- ⬜ **Pendiente:** Flor la va a **escribir y enviar** (no la dicta por audio). Incluye por qué arrancó Sweet Flowers.

---

## 10. Evento — **Sweet Flowers Event Summit** (18/09)

- **Nombre oficial: "Sweet Flowers Event Summit".** ✅ **NO es un workshop** (es un summit/evento). → cierra ADR-008.
- **Cupo:** **80 personas** (por el momento). ✅
- **Disertantes:** **3 confirmados**; faltan **confirmar más** y **los temas de cada uno**. ⬜
- **Precio de entrada:** 🟡 *a confirmar cifras exactas.* Flor mencionó: contado (promo julio) ≈ **$2.80** y **3 cuotas por transferencia de ≈ $330**. Los números quedaron **ambiguos en el audio** → **confirmar valor de contado, valor por cuota, y vigencia de la promo**.
- **Inscripción/pago hoy:** por **transferencia bancaria**; si quieren **Mercado Pago**, **+15% (≈18%)**. Campaña actual: mensajes a contactos agendados. ✅
- **Qué incluye:** ✅
  - Todas las **charlas**.
  - **Certificado de asistencia.**
  - **Coffee.**
  - Acceso a un **grupo de WhatsApp exclusivo**.
  - **20% de descuento** en cualquier compra desde que **señan** el evento.
  - **Descuentos con proveedores recomendados.**
  - **Asesoramiento** (especial para comunidad / alumnos de workshops).
- 🟡 **Faltan:** **fecha/horario exacto**, **sede/lugar** del 18/09, **modalidad** (presencial), y **fecha de apertura de inscripción online**.

## 11. Ediciones previas (trayectoria / prueba social)

- **Asistentes:** más de **150** en total; hoy ≈ **180** (muchos **repiten** porque ninguna edición es igual). ✅ *(cifras aproximadas, dichas de memoria)*
- **Disertantes:** **más de 20** en total (algunos repitieron). ✅
- **Sedes (7 ediciones):** ✅
  1. **Centro Naval.**
  2. **Puerto Madero — Madero Tango.**
  3. **La Rioja** — centro cultural (La Rioja Capital).
  4. **Río Cuarto.**
  5. **Palacio San Miguel** (CABA).
  6. **La Rural.**
  7. **Un hotel** → **NO nombrarlo** (hubo un robo, terminaron la alianza). ⬅️ omitir de la web.

## 12. Testimonios

- ⬜ **Pendiente de enviar:** **8–10 testimonios** de alumnas con **nombre, ciudad** y **capturas de WhatsApp** (los tiene). ✅ *existen* / ⬜ *falta que los mande.*

## 13. Marca (logo / manual)

- **Manual de marca: NO existe.** Es "muy casero"; **habría que armarlo**. 🟡
  - → Decisión práctica: **construimos tokens provisionales nosotros** (paleta/tipografía) y, si más adelante arman manual, se reemplazan en un solo lugar (ADR-006/ADR-009).
- **Logo:** ⬜ pendiente (viene con las imágenes).

## 14. Redes sociales

- ⬜ **Pendiente:** Flor **va a escribir** los usuarios/links (todas con el mismo @).

## 15. Público / clienta típica

- 🟡 Flor **no lo definió con precisión** ("varía mucho"). Queda **por afinar** un perfil de cliente (buyer persona) más adelante, o trabajarlo nosotros con los datos de ventas.

---

## 16. IMÁGENES — todo pendiente ⬜

Flor avisó que **las imágenes las pasa aparte** ("no tengo nada" cargado todavía). Falta **todo el material visual**:
- **Logo** vectorial.
- **Fotos de productos** (selección con Tobías de los que van primero).
- **Fotos de Flor / equipo / taller.**
- **Material del evento** (fotos de ediciones previas, branding del Summit).
- **Capturas de testimonios.**

---

## 17. LO QUE FALTA (para pasarle a Flor)

**Textos / datos:**
1. **Historia de la marca** (la escribe Flor) — incluye por qué arrancó. ⬜
2. **@ y links de redes** (todas iguales). ⬜
3. **Listado maestro de productos con precios** (del catálogo de WhatsApp) + **selección con Tobías** de cuáles subir primero, con sus **nombres específicos**. ⬜
4. **Evento — precios exactos**: valor de contado (promo julio) y valor por cuota — **confirmar cifras**. 🟡
5. **Evento — logística**: **fecha/horario, sede/lugar, modalidad** y **apertura de inscripción**. ⬜
6. **Evento — disertantes**: nombres de los confirmados + los que falten + **tema de cada uno**. ⬜
7. **Testimonios**: los 8–10 con **nombre, ciudad y captura**. ⬜
8. **Equipo**: quiénes se muestran y con qué rol. 🟡
9. (Opcional) **Manual de marca**: si tiene alguna idea de colores/tipografía; si no, lo proponemos nosotros. 🟡

**Imágenes:** TODO el material visual del punto 16. ⬜

> Cuando Flor mande cada cosa, se marca ✅ acá y se lleva a donde corresponde (panel o código), siguiendo `colaboracion/franco/INTAKE_DE_CONTENIDO.md`.
