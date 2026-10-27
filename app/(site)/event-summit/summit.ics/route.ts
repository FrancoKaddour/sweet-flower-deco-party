// /event-summit/summit.ics — el Summit como evento de calendario (Apple
// Calendar, Outlook, Google). Lo linkean la página de vuelta del pago y el
// mail de la entrada.
import { SITE_URL } from "@/lib/site";
import { EDICION_LABEL, EVENT_DATE_ISO, EVENT_END_ISO, EVENT_HORARIO, EVENT_NAME, EVENT_SEDE } from "@/content/evento";

export const dynamic = "force-static";

const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
/** Escapa texto según RFC 5545 (\ ; , y saltos de línea). */
const esc = (t: string) => t.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export function GET() {
  const inicio = EVENT_DATE_ISO ?? EVENT_END_ISO;
  const lineas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sweet Flowers Deco Party//Event Summit//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:summit-${inicio.slice(0, 10)}@sweetflowersdecoparty`,
    `DTSTAMP:${utc("2026-10-26T12:00:00-03:00")}`,
    `DTSTART:${utc(inicio)}`,
    `DTEND:${utc(EVENT_END_ISO)}`,
    `SUMMARY:${esc(EVENT_NAME)}`,
    `LOCATION:${esc(EVENT_SEDE ?? "La Rural, Palermo, Buenos Aires")}`,
    `DESCRIPTION:${esc(`${EDICION_LABEL} · ${EVENT_HORARIO}. Llevá tu código de inscripción. Más info: ${SITE_URL}/event-summit`)}`,
    `URL:${SITE_URL}/event-summit`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(`Mañana: ${EVENT_NAME}`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return new Response(lineas.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="sweet-flowers-event-summit.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
