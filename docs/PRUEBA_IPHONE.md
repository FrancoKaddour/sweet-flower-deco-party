# Prueba en iPhone / iPad

Lista corta para probar el sitio en un iPhone real (Safari y Chrome; en iOS los dos usan el mismo motor, así que alcanza con hacerla bien en Safari y repasar rápido en Chrome). Ideal: un iPhone con iOS 17 o 18, y si podés, un iPad.

Marcá cada punto. Si algo falla, anotá: modelo de iPhone, versión de iOS, página y qué pasó (una captura ayuda mucho).

## Antes de empezar
- [ ] Abrí la URL de producción en Safari, **sin** estar logueado.
- [ ] Probá todo una vez en **vertical** y las partes marcadas con ↔ también en **horizontal**.

## Inicio (/)
- [ ] La intro (SWEET FLOWERS que se abre) corre una sola vez y termina en el video. No se puede scrollear mientras corre; después sí.
- [ ] **El video arranca solo**, sin sonido, sin pantalla completa y sin botón de play encima.
- [ ] Los textos del hero van cambiando en sincronía con el video.
- [ ] Al bajar, la barra de Safari se achica y crece: el sitio **no salta** ni las secciones fijadas (pins) pegan tirones.
- [ ] Al subir de golpe con un swipe fuerte hasta arriba no queda un hueco blanco ni el header mal puesto.
- [ ] ↔ En horizontal el hero y las secciones grandes entran sin huecos raros.

## Header y menú (cualquier página)
- [ ] El header no queda debajo del notch / Dynamic Island.
- [ ] Tocá "Menú": se abre la animación y **la página de atrás no se mueve** si arrastrás el dedo sobre el menú.
- [ ] Cerrá el menú: volvés **exactamente al mismo lugar** donde estabas.
- [ ] Tocar un link del menú navega y la página nueva arranca arriba.
- [ ] Tocar el logo no deja "Sweet Flowers" trabado a medio animar.
- [ ] ↔ En horizontal se ven todos los links del menú.

## Botón de WhatsApp y "Tu pedido"
- [ ] El botón flotante de WhatsApp queda arriba de la rayita de inicio del iPhone (no pegado al borde).
- [ ] Al tocarlo abre **la app de WhatsApp** con el mensaje escrito.
- [ ] Ningún botón flotante tapa un botón importante (Pagar, Enviar, etc.).

## Productos (/productos y una ficha)
- [ ] La galería de fotos se desliza con el dedo.
- [ ] "Agregar al pedido" → aparece "Tu pedido" abajo a la derecha.
- [ ] Abrí "Tu pedido": el panel cubre la pantalla, la página de atrás **no scrollea**, la lista sí.
- [ ] Tocá "Nombre" en el panel: **la pantalla NO hace zoom** y el teclado no tapa el campo.
- [ ] Cerrá el panel: volvés al mismo lugar de la página.
- [ ] "Enviar por WhatsApp" abre WhatsApp con el pedido completo.
- [ ] ↔ En horizontal el panel se puede scrollear hasta el botón de enviar.

## Event Summit (/event-summit)
- [ ] La cuenta regresiva se ve con números correctos (no "NaN").
- [ ] El scroll horizontal de ediciones se mueve suave y no se traba.
- [ ] Formulario de inscripción: tocá cada campo → **sin zoom**. Email muestra teclado con @, Celular teclado de teléfono, DNI teclado numérico.
- [ ] Autocompletar de iOS ofrece tu nombre, email y teléfono.
- [ ] Mientras completás, el botón de WhatsApp se esconde y no tapa nada.
- [ ] Poné un DNI corto (ej. 12) y tocá Pagar: aparece el error **y lo que escribiste sigue ahí**.
- [ ] Con datos válidos, "Pagar" te lleva a **Mercado Pago en la misma pestaña** (sin bloqueo de ventanas emergentes).
- [ ] En Mercado Pago tocá "Atrás" de Safari: el botón vuelve a decir "Pagar …" y se puede tocar (no queda en "Yendo a Mercado Pago…").

## Trayectoria (una edición, ej. /event-summit/trayectoria/la-rural)
- [ ] Tocá una foto: se abre a pantalla completa, sin el notch tapando el contador ni la ✕.
- [ ] Deslizá a los costados: cambia de foto.
- [ ] Pellizcá para hacer zoom: amplía; mientras está ampliada, mover el dedo **no** cambia de foto.
- [ ] Con el visor abierto la página de atrás no se mueve. Al cerrar (✕) volvés al mismo lugar.

## Newsletter / Club (footer o /newsletter)
- [ ] Tocar el email no hace zoom; el teclado muestra @ y no pone mayúscula al principio.
- [ ] Con un email mal escrito, el error aparece y **no se borra lo escrito**.
- [ ] Al suscribirte, "Copiar código" copia el código.

## Contacto (/contacto)
- [ ] Ningún campo hace zoom al tocarlo; Teléfono abre teclado numérico.
- [ ] Enviar abre WhatsApp con el mensaje.

## Cuenta y panel (si tenés acceso)
- [ ] /ingresar: el link de ingreso por email llega y al tocarlo en el iPhone entra.
- [ ] /panel en el celu: el menú lateral se abre y cierra; buscar muestra la tecla "Buscar" en el teclado; ningún campo hace zoom.

## Agregar a pantalla de inicio
- [ ] Safari → Compartir → "Agregar a pantalla de inicio": el ícono se ve bien (no una captura de la página) y el nombre es "Sweet Flowers".
- [ ] Abrilo desde el ícono: el header no queda debajo del reloj/batería y el color de arriba combina.
- [ ] Los links de WhatsApp e Instagram abren las apps.

## Modo bajo consumo y ahorro de datos
- [ ] Activá **Modo de bajo consumo** (Ajustes → Batería) y recargá el inicio: el iPhone puede no reproducir el video. Tiene que verse la **foto de portada** (no un recuadro negro) y los textos del hero tienen que aparecer igual.
- [ ] Con **Modo de datos reducidos** (Ajustes → Celular → Opciones) el sitio carga y se puede navegar; las fotos pueden tardar un poco más.
- [ ] Activá **Reducir movimiento** (Ajustes → Accesibilidad → Movimiento): el sitio no tiene animaciones bruscas y todo el contenido se ve.

## Extra rápido
- [ ] Girar el teléfono en cualquier página no deja nada roto ni cortado.
- [ ] Ningún número de teléfono suelto se ve como link azul subrayado.
- [ ] Repetí Inicio + Menú + Summit en **Chrome para iPhone**.
