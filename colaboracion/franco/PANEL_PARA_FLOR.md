# Panel de Sweet Flowers — qué vas a poder manejar (para Flor)

> Documento para **presentarle a Flor** todo lo que va a poder hacer desde la web/panel, y que ella confirme o pida más. Basado en el plan real del proyecto ([`../gonzalo/06_DASHBOARD_SPEC.md`](../gonzalo/06_DASHBOARD_SPEC.md) + modelo de datos en `lib/panel/types.ts`).
> Idioma cliente: cálido, sin tecnicismos. Las **ideas nuevas** que apruebe Flor se registran como decisión en `docs/16_DECISIONS.md` y se coordinan con Gonzalo.

---

## 1. El panel en una frase

El panel (`/panel`) es **el centro de control del negocio**: desde un solo lugar, con usuario y contraseña, Flor y el equipo manejan productos, ventas, la comunidad, las campañas de mail y las métricas. Todo en español, con precios en pesos.

---

## 2. Lo que YA está en el plan (Flor lo va a poder hacer)

| Área | Qué puede hacer Flor | Estado |
|---|---|---|
| **📊 Inicio / Métricas** | Ver cómo va el negocio de un vistazo: ventas (hoy/semana/mes), stock bajo, inscriptos al evento, contactos nuevos, leads sin responder. | En plan |
| **🛍️ Catálogo** | Cargar/editar/borrar productos: precio, fotos, stock, material, medidas, "desarmable/pintable", "a medida". Categorías y medios. | En plan |
| **📦 Ventas** | Ver las órdenes con estado de pago (lo fija Mercado Pago) y marcar el envío (a preparar / enviado / entregado). Aviso de stock bajo. | En plan |
| **👥 Comunidad (CRM)** | Toda persona en un solo lugar (compradores, inscriptos, miembros, leads, suscriptos), con historial, etiquetas y consentimiento de mail. Exportar. | En plan |
| **✉️ Campañas / Newsletter** | Armar y enviar mails a un segmento (ej: "inscriptos al Summit"), desde la misma web, solo a quien aceptó recibirlos. Ver enviados/aperturas. | En plan |
| **📝 Consultas "a medida"** | Bandeja de pedidos a medida: recibir, marcar estado (nuevo/en curso/cotizado/cerrado) y responder. Que no se pierda ninguno. | En plan |
| **🖋️ Contenido del sitio** | Editar textos, redes, testimonios y las ediciones del evento sin tocar código. | En plan |
| **🔒 Usuarios y roles** | Dar acceso al equipo (ej: Tobías) con permisos (admin / editor). | En plan |

> **Clave del sistema:** el centro es **Contactos**. Cada compra, inscripción, membresía o consulta queda pegada a la persona. Por eso una campaña puede segmentar cruzando todo (ej: "inscriptos que todavía no compraron").

---

## 3. Ideas EXTRA que le pueden facilitar la vida (a confirmar con Flor)

Pensadas para cómo trabaja Sweet Flowers hoy (por encargo, mucho WhatsApp, eventos, a medida):

| Idea | Por qué le sirve | Esfuerzo |
|---|---|---|
| **Suscripción al newsletter en la web** | Un formulario en el sitio para juntar suscriptores (con su permiso) → así tiene a quién mandarle campañas. *Sin esto, no hay a quién.* **★ prioridad** | Bajo |
| **Calendario de producción / entregas** | Ver por semana qué hay que producir y despachar (cierran producción por semana, ~20 días). | Medio |
| **Métricas más finas** | Producto más vendido, ticket promedio, de qué ciudades compran (útil para envíos), y cuántos leads se vuelven ventas. | Medio |
| **WhatsApp integrado (panel)** | En cada consulta/venta, un botón que abre WhatsApp con el número de esa persona y un mensaje ya escrito (no hay que copiar el número ni tipear). Detalle interno del panel. | Bajo |
| **Exportables para contabilidad** | Descargar ventas del mes / contactos en Excel. | Bajo |
| **N.º de seguimiento del envío** | Cargar el tracking en la orden y avisarle al cliente. | Bajo |
| **Recordatorios automáticos** | Mail de bienvenida al inscribirse, recordatorio del evento, y aviso de "lead sin responder hace X días". | Medio |
| **Cupones / códigos de descuento** | Para el evento, miembros o campañas puntuales. | Medio |
| ~~Presupuestos a medida desde el panel~~ | **Flor lo maneja por WhatsApp → no hace falta en el panel (por ahora).** | — |
| ~~Seña + 20% del evento~~ | **Flor lo maneja por WhatsApp → no hace falta en el panel (por ahora).** | — |

---

## 4. Lo que NO hace (por ahora) — para alinear expectativas

- No emite factura / AFIP (se evalúa más adelante si el negocio lo pide).
- No edita el estado de pago a mano (lo confirma Mercado Pago automáticamente).
- Las campañas son una herramienta **propia y simple** (no Mailchimp): envío a segmentos, respetando el permiso. Sin automatizaciones complejas (salvo que se sumen las de arriba).
- El cobro automático de la membresía está **pendiente de definir con Flor**.

---

## 5. Para cerrar esto necesitamos que Flor confirme

1. ¿De las **ideas extra** (§3), cuáles quiere sí o sí? ¿Falta algo que hoy hace a mano y quiere tener acá?
2. **Membresía:** ¿cómo se cobra (mensual/anual, precio) y qué incluye? (hoy está a definir).
3. Datos que faltan para el mail/campañas: sus **@ de redes**, **email** y **WhatsApp** oficiales.

---

## 6. Mensaje listo para WhatsApp

> Copiá/pegá y ajustá el tono. Se puede mandar en 1 o 2 mensajes.

```
Flor! Te resumo lo que vas a poder manejar vos misma desde el panel de la web, tu "centro de control" 🌷

📊 Ver cómo va el negocio: ventas del día/semana/mes, stock bajo, inscriptos al evento, contactos nuevos.
🛍️ Cargar y editar tus productos (precio, fotos, stock, "a medida"), sin depender de nadie.
📦 Ver tus ventas y marcar el envío (a preparar / enviado / entregado).
👥 Toda tu gente en un solo lugar: compradores, inscriptos, miembros y consultas, con su historial.
✉️ Mandar campañas de mail a tu gente (ej: a los inscriptos al Summit) desde la misma web, solo a quienes aceptaron recibirlos.
🔒 Todo con usuario y contraseña, y le das acceso a quien vos quieras.

Y algunas cosas más que te pueden servir:
• Un lugar en la web para que la gente se suscriba y así juntar a quién mandarle campañas.
• Un calendario de producción/entregas por semana.
• Métricas más finas: producto más vendido, ticket promedio, de qué ciudades te compran.

¿Te sirve así? ¿Hay algo que hoy hacés a mano y te gustaría tener acá? 🙌
```
