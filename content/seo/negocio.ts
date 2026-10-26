// DATOS DEL NEGOCIO PARA SEO — los que todavía FALTAN.
// Lo confirmado vive en lib/site.ts (BUSINESS) y content/evento.ts. Acá van
// SOLO los datos que Google Business Profile, schema.org y las IAs piden y que
// todavía no tenemos. Regla: nada se inventa. Mientras un campo sea null, el
// sitio simplemente no lo muestra (ni en la página ni en el JSON-LD).
//
// TODO(Fran/Tobías): completar cada null con el dato real. Ver docs/SEO.md.

export const NEGOCIO_SEO = {
  /** TODO: calle y número del taller (si se puede publicar). Ej. "Av. X 1234". */
  calle: null as string | null,
  /** TODO: código postal. Tortuguitas es B1667 — confirmar. */
  codigoPostal: null as string | null,
  /** Partido de Tortuguitas (dato geográfico, no del negocio). */
  partido: "Malvinas Argentinas",
  /** TODO: coordenadas del taller (Google Maps → clic derecho → copiar). */
  geo: null as { lat: number; lng: number } | null,
  /**
   * TODO: horario de atención por WhatsApp / retiro. Formato schema.org:
   * [{ dias: ["Monday","Tuesday"], abre: "09:00", cierra: "18:00" }]
   */
  horarios: null as { dias: string[]; abre: string; cierra: string }[] | null,
  /** TODO: ¿se puede retirar en el taller? true/false. Hasta saberlo, no se promete. */
  retiroEnTaller: null as boolean | null,
  /** TODO: email público de contacto. */
  email: null as string | null,
  /** TODO: Facebook (≈93 mil seguidores). URL exacta de la página. */
  facebook: null as string | null,
  /** TODO: TikTok / YouTube / Pinterest si existen (URLs). */
  otrasRedes: [] as string[],
  /**
   * TODO: Place ID de Google Business Profile. Con eso se arma el link directo
   * "Dejanos tu reseña": https://search.google.com/local/writereview?placeid=<ID>
   * (Se busca en https://developers.google.com/maps/documentation/places/web-service/place-id)
   */
  googlePlaceId: null as string | null,
  /** TODO: link de la ficha en Google Maps (para "Cómo llegar" y sameAs). */
  googleMapsUrl: null as string | null,
  /** TODO: código de verificación de Google Search Console (meta tag). */
  googleSiteVerification: null as string | null,
  /** TODO: código de verificación de Bing Webmaster Tools. */
  bingSiteVerification: null as string | null,
  /**
   * TODO (opcional): clave de IndexNow (Bing/Yandex avisan rápido de cambios).
   * Pasos en docs/SEO.md (se sirve como archivo /<clave>.txt en public/).
   */
  indexNowKey: null as string | null,
} as const;

/** Link para dejar reseña en Google (o null si falta el Place ID). */
export const RESENA_GOOGLE_URL = NEGOCIO_SEO.googlePlaceId
  ? `https://search.google.com/local/writereview?placeid=${NEGOCIO_SEO.googlePlaceId}`
  : null;
