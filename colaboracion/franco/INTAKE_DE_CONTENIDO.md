# Intake de contenido — cuando Flor entrega

El plan para cuando lleguen las **imágenes y los textos reales** de Flor y su equipo. La meta: que lo único que faltaba para tener el sitio "de verdad" era esto, y que se cargue **donde corresponde, con las mejores prácticas**.

---

## 1. Qué tiene que entregar Flor (checklist)

Es el checklist de contenido de [`../../docs/16_DECISIONS.md`](../../docs/16_DECISIONS.md) §C. En resumen:

| Carpeta | Contenido | Desbloquea |
|---|---|---|
| **00_ACCESOS** | credenciales (dominio, Mercado Pago, redes) | pagos, deploy |
| **01_MARCA** | **logo vectorial**, **manual de marca** (paleta + tipografía), fotos de Flor | tokens definitivos, historia |
| **02_PRODUCTOS** | listado maestro (nombre, material, precio, +15% por canal, stock, a medida) + **fotos** | catálogo real |
| **03_EVENTOS** | ediciones (previas + 8va), testimonios, sponsors, disertantes | evento, prueba social |
| **04_MEMBRESIA** | qué incluye, precio, beneficios | sección membresía |
| **05_TEXTOS** | historia, bio de Flor, copys de secciones y CTAs | textos reales |
| **06_VIDEO** | SweetDay + material bruto | hero/secciones |

> Pedilo organizado así. Cuanto más ordenado llega, más rápido se carga.

---

## 2. Dos caminos según el tipo de contenido

Cuando tengas el material, va por uno de dos caminos:

### Camino A — Contenido que se carga por el PANEL (lo hacés vos)
Todo lo que es **datos**: productos, precios, fotos de producto, eventos, testimonios, textos editables del sitio.
- Se carga en `/panel` (que construye Gonzalo). Para eso existe.
- No toca código. Vos lo cargás y listo.

### Camino B — Contenido que toca el CÓDIGO (me lo pasás a mí / la IA)
Lo que es **estructural o de marca**:
- **Manual de marca** → reemplazar los tokens provisionales (paleta, tipografía) en `app/globals.css`. Esto cierra ADR-006/ADR-009.
- **Logo vectorial** → integrarlo en Header/Footer/OG.
- **Copys de secciones** que todavía están hardcodeados como placeholder (hasta que se muevan al panel).
- **Fotos del sitio** (hero, secciones) con `next/image`, `alt` reales y optimización.

Para el Camino B: **me pasás el material y yo lo llevo a donde corresponde**, reemplazando los `TODO(contenido)`, aplicando el manual de marca en un solo lugar, y afinando todo con contexto real y las mejores prácticas.

---

## 3. Cómo me lo pasás (para que quede impecable)

Cuando tengas material del Camino B, decime algo como:

```
Llegó contenido de Flor. Te paso:
- Manual de marca: paleta <...> y tipografías <...>.
- Logo: <archivo/ubicación>.
- Textos reales de <sección>: <pegás el texto>.
- Fotos para <hero/sección>: <ubicación/archivos>.

Llevalo a donde corresponde con las mejores prácticas: reemplazá los TODO(contenido),
aplicá el manual de marca en los tokens, poné alt reales, y avisame qué quedó y qué falta.
```

Yo me encargo de ubicarlo bien, mantener la coherencia del design system, y dejar el proyecto con **contexto real** para poder seguir puliendo con la mejor calidad.

---

## 4. Al terminar una tanda de intake

- [ ] Los `TODO(contenido)` de esa sección/tema quedaron reemplazados (verificable con búsqueda global de `TODO(contenido)`).
- [ ] Manual de marca aplicado en los tokens (si vino) → un solo lugar, todo el sitio actualizado.
- [ ] Imágenes con `next/image` y `alt` reales y descriptivos (SEO).
- [ ] Nada quedó inventado; lo que falta sigue marcado como placeholder.
- [ ] Se actualizó el estado en `docs/16_DECISIONS.md` §C (marcar ✅ lo recibido) y qué fase se destraba.

> Regla de oro: el contenido real **no rompe** el diseño ni la estructura; los **completa**. Si algo del contenido pide un cambio de diseño, es una decisión aparte que charlamos.
