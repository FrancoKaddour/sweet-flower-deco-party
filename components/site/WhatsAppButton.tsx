/**
 * Botón flotante de WhatsApp — discreto, abajo a la derecha.
 * Círculo tinta con el ícono; en hover/foco se abre una píldora "Escribinos".
 * Oculto mientras corre el loader del inicio (ver globals.css .c-wa) y mientras
 * hay un formulario, los pases del Summit o el footer a la vista.
 * Línea: ventas (content/site.ts) en general; capacitaciones (EVENT_WHATSAPP)
 * en /event-summit/** y en las landings de capacitación/workshops.
 * Server component: arma la lista de landings acá para no mandar landings.ts al cliente.
 */
import { WHATSAPP_MESSAGE, WHATSAPP_NUMBER } from "@/content/site";
import { EVENT_NAME, EVENT_WHATSAPP } from "@/content/evento";
import { LANDINGS } from "@/content/seo/landings";
import { WhatsAppFlotante } from "./WhatsAppFlotante";

const RUTAS_CAPACITACION = LANDINGS.filter((l) => l.linea === "capacitaciones").map((l) => `/${l.slug}`);

export function WhatsAppButton() {
  return (
    <WhatsAppFlotante
      ventas={{ numero: WHATSAPP_NUMBER, mensaje: WHATSAPP_MESSAGE, linea: "ventas" }}
      capacitaciones={{
        numero: EVENT_WHATSAPP,
        mensaje: `¡Hola! Tengo una consulta sobre el ${EVENT_NAME}.`,
        linea: "capacitaciones",
      }}
      rutasCapacitacion={RUTAS_CAPACITACION}
    />
  );
}
