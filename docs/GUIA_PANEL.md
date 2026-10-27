# Guía rápida del panel — Sweet Flowers

Entrá a **sweet-flower-deco-party.vercel.app/panel** con tu cuenta de Google
(el mail tiene que estar habilitado; si no te deja entrar, avisale a Franco).
Todo funciona desde el celular. Cuando algo se guarda aparece un aviso abajo;
muchos avisos traen **Deshacer** (5 segundos).

## Inicio
Arriba, una línea con el **pulso del día** (pedidos de hoy, consultas que esperan
hace más de 24 h, inscriptos nuevos, lugares que quedan): cada parte es un link.
Después: el **Summit** (inscriptos por pase, cuánto se cobró, lugares libres y
cuántos días le quedan a la preventa), **pedidos de los últimos 7 días**,
**consultas sin responder** (y hace cuánto espera la más vieja), el **Club**
(+N en 7 y 30 días), **lo más pedido** del mes y lo que falta completar del catálogo.

## Pedidos
Cada vez que alguien arma el carrito y toca "Enviar por WhatsApp", el pedido
queda acá con un **código** (ej. `SF-7KQ4M`), el mismo que aparece en el WhatsApp.
- Estados: Iniciado (abrió WhatsApp) → Nuevo → Confirmado → En producción → Enviado → Entregado.
- Si todo el pedido es "a consultar", el total dice **A cotizar**.
- En el detalle: celular del cliente, nota interna y "Responder por WhatsApp".
- **Archivar** (solo admin) lo saca de la lista; está en **Ver archivados**, con **Restaurar**.

## Catálogo
- **Precio rápido:** en la lista, tocá el precio, escribilo y Enter. Sin centavos
  ("15000" o "15.000"). Abajo del campo ves cómo va a quedar ("Se va a ver: $ 15.000").
- **Ocultar / publicar / destacar:** los interruptores de la lista (con Deshacer).
- **Producto nuevo:** se crea **oculto**. Subile al menos una foto y tocá **Publicar**.
- **Fotos:** se achican solas en el celular antes de subir (más rápido con datos).
  La primera es la portada; se ordenan con ← →. Si duplicaste un producto, borrar
  una foto de la copia ya no rompe la del original.
- **Variantes:** medidas, pintado/sin pintar, combos… cada una con su precio
  (vacío = a consultar). Si tienen precio, en el sitio se ve "Desde $…".
- **Orden en el sitio:** filtrá por una categoría (sin búsqueda) y usá ↑ ↓.
- **Actualizar precios de una categoría** (solo admin): elegís la categoría y el %,
  ves el antes/después redondeado a $ 500 y aplicás. Se puede deshacer desde el aviso.
- **Papelera:** "Mandar a la papelera" lo saca del sitio; en el filtro **Papelera**
  está **Restaurar** (vuelve oculto, para revisarlo).
- **Categorías** (solo admin): textos, foto de portada (se sube desde acá) y visibilidad.
- La búsqueda ignora acentos: "mas" encuentra "más".

## Consultas
Lo que la gente escribe en el formulario de contacto. WhatsApp o Email con un
toque, y marcalas "Respondida". Archivadas: **Ver archivados**.

## Summit
- Arriba: **Recaudado** (pagos aprobados), **Lugares libres**, inscriptos por pase y
  **Pendientes en MP** (gente pagando en este momento). Si dice "Modo prueba",
  los pagos todavía son de prueba.
- Estados: **Empezó (sin pagar)** → **Pagó** → **Asistió**, o **Cancelado**.
  "Señó (manual)" es solo para acuerdos fuera de Mercado Pago.
- Filtros **Pagos pendientes en MP** (para escribirles por WhatsApp) y
  **Pagos con problemas** (sobrecupo o monto que no coincide: devolver o aceptar a mano).
- **Reenviar entrada:** en "+ Seguimiento" de una inscripción pagada.
- **Pasar a Pagó a mano** (transferencia) le manda la entrada por mail.
- **Cancelar** libera el lugar; si pagó por Mercado Pago, la devolución se hace
  desde tu cuenta de Mercado Pago. Las inscripciones pagas no se archivan.
- **Descargar lista (Excel):** abre bien en Excel en español. El DNI completo
  solo lo ven las administradoras; las editoras lo ven como ***.456.
- Selector de **edición** para ver ediciones anteriores.

### Acreditación (día del evento)
Summit → **Acreditar (check-in)**. Desde el celular: escribí el DNI o el código
`SUM-…` (o tocá **Escanear QR** en Android y apuntá al mail de la entrada) →
aparece el nombre y el pase en grande → **Marcó asistencia**. Arriba ves
"Adentro: N/80". Si te equivocaste, el aviso tiene Deshacer.

## Newsletter (Club Sweet Flowers)
La gente se suma desde el footer y **confirma desde un mail** (si no confirma, no
recibe campañas: figura como "Sin confirmar").
- **Suscriptores:** cuando alguien te pase su código por WhatsApp, buscalo y
  activá "Usado". Podés sumar a alguien a mano (si te lo pidió) y descargar CSV.
- **Campañas:** "Nueva campaña" → plantilla → editá → vista previa. Los botones
  **Enviarme una prueba** y **Enviar** están debajo del texto y **guardan los
  cambios antes de salir**, así lo que llega es lo que estás viendo. Si cerrás la
  pestaña con cambios sin guardar, el navegador te avisa.
- Si un envío quedó cortado en "Enviando", a los 10 minutos aparece **Retomar el envío**.
- `{nombre}` y `{codigo}` se reemplazan solos por los de cada persona.

## Ajustes
- Quién tiene acceso, con qué rol, y **la tabla de qué puede hacer cada rol**.
- **Cerrar sesiones** (admin): cierra la sesión de esa persona en todos sus
  dispositivos (si perdió el celu o dejó el equipo). Para sacarle el acceso, avisale a Franco.
- **Ver actividad** (admin): quién hizo qué y cuándo, filtrable por persona y sección.

## Si algo falla
Aparece "No pudimos cargar esto" con **Reintentar**, o "Tu sesión se cerró" con
**Ir a ingresar** (la sesión del panel dura 7 días). Si un aviso rojo dice
"Falta un paso técnico", avisale a Franco.
