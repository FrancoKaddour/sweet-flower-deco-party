# Auditoría "jurado" — 26/10/2026 y plan hasta el viernes 30/10

Cinco jurados auditaron el sitio en paralelo (solo lectura, en producción y por código). Los informes completos, con cada hallazgo, evidencia y archivo:línea, están en `docs/auditoria/`.

## Notas de partida

| Jurado | Nota hoy | Meta viernes | Lo que más pesa |
|---|---|---|---|
| Diseño + Creatividad (Awwwards 60%) | 6,1 | 7,5 | Fotos de producto amateur, títulos monótonos, loader tomado de De Puydt, 3 rojos |
| Developer + Usabilidad (Awwwards 30% + Developer Award) | 6,6 | 8 | /event-summit se congelaba (YA ARREGLADO), intro que se repite, ~3 s por click, contraste |
| Ecommerce + Contenido | 4,8 | 7,5 | Catálogo crudo de WhatsApp, recargo MP contradictorio, cero medición, Summit sin urgencia |
| Panel | 6 | 7,5 | Producto oculto que sigue online, webhook que pisa "Asistió", falta acreditación del Summit |
| Seguridad / pagos | NO apto para cobrar | Apto | Sobreventa del cupo, links de pago que no vencen, privacidad (Ley 25.326), sin alertas |

## Ya resuelto
- **T-01** — `/event-summit` se congelaba en desktop (bucle infinito del detector de fondo del header). Commit `0ddc62c`.

## Plan

**Martes 27 y miércoles 28 — 6 frentes en paralelo** (cada agente con su zona de archivos):

| Frente | Qué resuelve | IDs |
|---|---|---|
| A · Pagos y seguridad | Reserva de cupo y sobrecupo, vencimiento de la preferencia, monto/moneda, webhook que no pisa estados, mail de entrada con reintento, alertas al equipo, consentimiento + DNI enmascarado, rate limit, newsletter con doble opt-in, headers de seguridad, open redirect, rol revalidado, migraciones solo en producción | S-01…S-28, P-03, P-04 |
| B · Panel | Fallback que resucita productos, campaña sin guardar, duplicar fotos, precio "15000.00", búsqueda sin acentos, CSV para Excel, error/loading, dashboard con números reales, export + check-in + reenviar entrada del Summit, editor de variantes | P-01…P-31 |
| C1 · Catálogo y carrito | Limpieza del texto de WhatsApp, variantes con precio, "Desde $X", mensaje de WhatsApp completo, código del Club, buscador/filtros/orden, bloque de pago-envío-producción en la ficha, labels y anuncios accesibles, medición | E-01…E-10, E-19, E-21, T-06, T-09, T-16, T-18, T-24 |
| C2 · Summit y contenido | Cuenta regresiva a la preventa, pases con "precio de hoy", barra fija en celular, FAQ del Summit, página de vuelta, WhatsApp correcto, cifras corregidas, historia sin firma inventada, reseñas sin "gating", páginas legales provisorias | E-11…E-18, E-20, E-24…E-27 |
| D · Diseño | Números de la tipografía, tarjetas de categoría, fotos de "Una fiesta…", header sobre el hero, un solo rojo, tres voces tipográficas, testimonios, copy de la home (B2B, sin "llave en mano"), tratamiento de fotos de producto, loader propio y una vez por sesión, 404 y footer | D-01…D-22, E-22, E-23, T-02, T-03, T-05 |
| E · Developer | Transición de página más rápida, menú con `inert` y foco, pausa de video/marquee, error/loading del sitio, headings, JSON-LD, foco tras navegar, JS más liviano, medición en el layout | T-04, T-07, T-08, T-10…T-15, T-17, T-19…T-25 |

**Jueves 29** — Segunda ronda: lo que quede de cada frente + ideas "wow" elegidas + revisión cruzada.
**Viernes 30** — QA completo (todas las rutas × anchos, teclado, consola), medición en producción, jurado de verificación que no participó del trabajo, y commit final.

## Decisiones tomadas sin esperar a Flor/Tobías (todas reversibles)
1. **Recargo de Mercado Pago:** un único número en un único lugar (`lib/site.ts`). Se usa el que figura en `docs/CONTENIDO_FLOR.md`; si Flor dice otro, se cambia en una línea.
2. **Productos de MDF y madera:** se ocultan (no se borran), porque Flor pidió por escrito no incluirlos (CONTENIDO_FLOR §3). Se vuelven a mostrar desde el panel.
3. **"Montaje llave en mano":** se reemplaza por lo confirmado (fabricación propia, envíos a todo el país, asesoramiento por WhatsApp).
4. **Historia:** texto en tercera persona solo con hechos confirmados, sin firma, hasta que Flor mande la suya.
5. **Hero de la home:** le habla a decoradoras y organizadores (el cliente real), no al cliente final.
6. **Páginas legales provisorias:** privacidad, términos y cambios con lo ya confirmado y "escribinos" donde falta definición.

## Lo que necesitamos de afuera (no bloquea el plan)
- **Fran:** confirmar en Vercel si Preview usa la misma base que producción (S-26); levantar `npm run dev` para verificar; activar Web Analytics en Vercel; borrar el pedido de prueba SF-9QWFM.
- **Flor:** recargo real de MP, precio después del 15/12, política si alguien no puede ir al Summit y factura, si hace montaje, si publica MDF/madera, historia y retrato.
- **Tobías:** credenciales de Mercado Pago, fotos de los workshops, disertantes.
