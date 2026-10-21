const TZ = "America/Argentina/Buenos_Aires";

const corta = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: TZ });
const larga = new Intl.DateTimeFormat("es-AR", { dateStyle: "full", timeStyle: "short", timeZone: TZ });

export const fechaCorta = (d: Date) => corta.format(d);
export const fechaLarga = (d: Date) => larga.format(d);

/** Link a wa.me con texto opcional. */
export function linkWhatsApp(numero: string, texto?: string) {
  return `https://wa.me/${numero}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;
}
