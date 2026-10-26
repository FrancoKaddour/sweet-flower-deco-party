# SEO y posicionamiento en IAs — Sweet Flowers Deco Party

Referencia: labasicapasteleria.com (landings servicio × zona, bloque de links en el footer, Bakery + BreadcrumbList, FAQ, /resenas). Acá se aplicó lo mismo y se corrigió lo que esa web hace mal (dos H1 por página, meta keywords, sin llms.txt real, sin FAQPage en las landings).

## Qué está hecho

| Qué | Dónde |
|---|---|
| 24 landings por intención y zona (`/arcos-para-eventos`, `/estructuras-para-eventos-en-cordoba`…) con H1 único, respuesta directa, datos citables, contenido propio, productos reales del catálogo, FAQ + FAQPage, migas + BreadcrumbList, WebPage, ItemList, enlazado a landings hermanas y CTA a WhatsApp | `content/seo/landings.ts` + `app/(site)/[landing]/page.tsx` |
| Imagen para compartir propia de cada landing (foto real + titular) | `app/(site)/[landing]/opengraph-image.tsx` |
| Bloque de links SEO en el footer (Productos · Ocasiones · Formación · Envíos y zonas) | `components/seo/LinksSeo.tsx` (insertado en `components/site/Footer.tsx`) |
| `/preguntas-frecuentes` (todas las FAQs, un FAQPage) | `content/seo/faqs.ts` + `app/(site)/preguntas-frecuentes/page.tsx` |
| `/resenas` "Dejanos tu reseña" (link a Google, SIN reseñas inventadas ni rating) | `app/(site)/resenas/page.tsx` |
| JSON-LD: Organization + Store, WebSite, Event del Summit (precios reales de preventa), Event de cada workshop pasado, Product (+ manufacturer, sku, itemCondition), ItemList en categorías, FAQPage, BreadcrumbList, WebPage | `components/site/JsonLd.tsx` |
| Metadata: og:image por defecto en TODAS las internas (antes quedaban sin imagen), hreflang es-AR + x-default, canonical | `lib/site.ts` → `pageMetadata()` |
| sitemap con landings, FAQ, reseñas e image sitemap | `app/sitemap.ts` |
| robots: abierto a buscadores y bots de IA; bloquea /panel, /api, /cuenta, /ingresar, pagos y bajas | `app/robots.ts` |
| Manifest + íconos (192, 512, maskable, apple-icon 180) | `app/manifest.ts`, `public/icons/`, `app/apple-icon.png` |
| `/llms.txt` (resumen + índice) y `/llms-full.txt` (FAQs, guías, trayectoria y catálogo con precios) | `content/seo/llms.ts`, `app/llms.txt`, `app/llms-full.txt` |
| 404 con salidas a lo más buscado | `app/not-found.tsx` |

## Cómo agregar una landing o una zona

1. Abrí `content/seo/landings.ts` y copiá un bloque del mismo grupo.
2. Cambiá `slug` (español, guiones, sin tildes; no puede coincidir con una ruta existente como `productos` o `contacto`).
3. Escribí contenido PROPIO: `lead` (respuesta directa en 2–3 líneas), `secciones`, `faqs` (2–4 reales). Nunca copiar otra landing cambiando el nombre de la ciudad: Google lo trata como "doorway page" y baja todo el sitio.
4. Para zonas: contá algo concreto de esa zona (un workshop que se hizo ahí, cómo llega el envío). Si no hay nada propio que decir, mejor no crear la landing.
5. `productos.re` filtra el catálogo por nombre (sin tildes, minúsculas). `relacionadas`: 3–4 slugs.
6. Listo: entra sola al sitemap, al footer, al llms.txt y genera su imagen para compartir.

## Datos que FALTAN (completar en `content/seo/negocio.ts`)

Mientras estén en `null`, no se muestran ni se emiten en el JSON-LD.

- Calle y número del taller (si se puede publicar) y código postal.
- Coordenadas del taller.
- Horarios de atención.
- ¿Se puede retirar en el taller?
- Email público.
- URL de Facebook y otras redes (TikTok, YouTube, Pinterest).
- **Place ID de Google Business Profile** (activa el botón directo de reseña en `/resenas`) y link de Google Maps.
- Códigos de verificación de Google Search Console y Bing (y pegarlos en `metadata.verification` de `app/layout.tsx`).
- (Opcional) clave de IndexNow: generar 32 caracteres hex, guardar `public/<clave>.txt` con la clave adentro y cargarla en `negocio.ts`.

## Lanzamiento (indexar)

Hoy el sitio lleva `noindex` a propósito (`IS_INDEXABLE` en `lib/site.ts`). Para lanzar: Vercel → Settings → Environment Variables → `NEXT_PUBLIC_INDEX = 1` (Production) y redeploy.

## Tareas fuera del código (para Fran / Flor / Tobías)

1. **Dominio propio** y conectarlo en Vercel (todo el SEO toma el dominio solo).
2. **Google Search Console**: verificar el dominio, enviar `https://<dominio>/sitemap.xml`, revisar "Páginas" e "Inspección de URL" para pedir indexación de la home, `/productos`, `/event-summit` y las landings principales.
3. **Google Business Profile** (lo más importante para búsquedas locales):
   - Categoría principal: "Proveedor de artículos para fiestas" o "Fabricante" (probar la que mejor encaje); secundarias: "Tienda de decoración para eventos", "Centro de formación".
   - Mismo nombre, teléfono y zona que la web (NAP idéntico en todos lados).
   - Si no quieren mostrar la dirección: configurarlo como "empresa de servicio a domicilio" con zona Argentina.
   - Subir 20+ fotos reales (taller, piezas armadas, eventos, Summit), horarios, link a la web, productos destacados.
   - Publicar novedades (Summit, productos nuevos) 1 vez por semana.
4. **Reseñas reales**: después de cada entrega y de cada evento, mandar por WhatsApp el link de `/resenas`. Responder TODAS las reseñas. Nunca comprar ni inventar reseñas.
5. **Bing Webmaster Tools**: importar desde Search Console (alimenta a ChatGPT y Copilot).
6. **Citas NAP**: cargar el negocio igual en Facebook, Instagram (link en bio a la web), Páginas Amarillas, Cylex, Hotfrog, Foursquare, Apple Business Connect, Waze.
7. **Backlinks**: pedir link a salones de los workshops (Centro Naval, Palacio San Miguel, La Rural/Expo Hobby), sponsors del Summit, disertantes y decoradoras clientas; notas en medios del rubro y locales (Malvinas Argentinas, zona norte).
8. **Redes**: link a la web en Instagram, Facebook y TikTok; usar las URLs de las landings en historias destacadas ("Arcos", "Catering", "Envíos").
9. **Contenido**: cada producto nuevo con buena foto y descripción con medidas; sumar FAQs reales que llegan por WhatsApp a `content/seo/faqs.ts`.
10. **Medir**: Search Console (clics/consultas por landing) y, si se suma analítica, eventos de clic en WhatsApp.
