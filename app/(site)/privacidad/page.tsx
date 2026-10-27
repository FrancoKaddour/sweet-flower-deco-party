import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_NAME, BUSINESS } from "@/lib/site";
import { PaginaLegal, type SeccionLegal } from "@/components/legal/PaginaLegal";
import { WHATSAPP_NUMBER } from "@/content/site";
import { EVENT_WHATSAPP } from "@/content/evento";

// Política de privacidad PROVISORIA (Ley 25.326 de Protección de Datos
// Personales; estructura de la AAIP). Solo datos confirmados del negocio.
// TODO(contenido): CUIT, domicilio legal y email del responsable (Flor);
// inscripción de la base ante la AAIP; revisión del texto por su contador/abogado.

export const metadata: Metadata = pageMetadata({
  title: "Política de privacidad",
  description: `Qué datos pide ${SITE_NAME}, para qué los usa, con quién los comparte y cómo pedir acceso, corrección o baja.`,
  path: "/privacidad",
});

const waVentas = `https://wa.me/${WHATSAPP_NUMBER}`;
const waSummit = `https://wa.me/${EVENT_WHATSAPP}`;

const SECCIONES: readonly SeccionLegal[] = [
  {
    id: "responsable",
    titulo: "Quién es responsable de tus datos",
    contenido: (
      <>
        <p>
          El responsable de la base de datos es <strong>{SITE_NAME}</strong>, emprendimiento familiar con taller en{" "}
          {BUSINESS.locality}, provincia de {BUSINESS.region}, Argentina.
        </p>
        <p>
          Para cualquier consulta sobre tus datos, escribinos por WhatsApp a la línea de ventas (
          <a href={waVentas} target="_blank" rel="noopener noreferrer">11 5106-4010</a>) o, si es por el Event Summit, a la
          de capacitaciones (<a href={waSummit} target="_blank" rel="noopener noreferrer">11 5512-7508</a>).
        </p>
      </>
    ),
  },
  {
    id: "datos",
    titulo: "Qué datos pedimos y para qué",
    contenido: (
      <>
        <ul>
          <li>
            <strong>Inscripción al Event Summit:</strong> nombre y apellido, email, celular, DNI y ciudad. Los usamos para
            gestionar tu inscripción, mandarte la entrada, acreditarte en la puerta (para eso pedimos el DNI) y avisarte
            novedades del evento.
          </li>
          <li>
            <strong>Pedidos y consultas desde la web:</strong> los datos que completes (nombre, localidad, mensaje y lo que
            elegiste). Los usamos para responderte y armar tu pedido; cada pedido queda registrado con un código.
          </li>
          <li>
            <strong>Club Sweet Flowers (newsletter):</strong> tu email y tus intereses, para mandarte novedades y tu
            código de descuento. Cada mail trae un enlace para darte de baja.
          </li>
          <li>
            <strong>Pagos:</strong> los procesa Mercado Pago. Nosotros no vemos ni guardamos los datos de tu tarjeta.
          </li>
          <li>
            <strong>Uso del sitio:</strong> estadísticas anónimas de visitas, sin cookies publicitarias. Tu navegador
            guarda de dónde llegaste (por ejemplo, Instagram) para que sepamos qué canal funciona.
          </li>
        </ul>
        <p>
          Los datos marcados como obligatorios en cada formulario son necesarios para esa finalidad: sin ellos no podemos,
          por ejemplo, completar tu inscripción. No usamos tus datos para otra cosa ni los vendemos.
        </p>
      </>
    ),
  },
  {
    id: "destinatarios",
    titulo: "Con quién los compartimos",
    contenido: (
      <>
        <p>Solo con los servicios que necesitamos para que el sitio funcione:</p>
        <ul>
          <li><strong>Mercado Pago</strong>, para cobrar los pagos online.</li>
          <li><strong>Resend</strong>, para enviar los mails (entrada del Summit, Club).</li>
          <li><strong>Vercel</strong>, donde está alojado el sitio y que mide las visitas.</li>
          <li><strong>Neon</strong>, la base de datos donde se guardan inscripciones, pedidos y suscripciones.</li>
        </ul>
        <p>
          Algunos de estos servicios guardan la información en servidores fuera de la Argentina. Fuera de eso, solo
          compartimos datos si una autoridad competente lo exige.
        </p>
      </>
    ),
  },
  {
    id: "conservacion",
    titulo: "Cuánto tiempo los guardamos",
    contenido: (
      <p>
        Mientras hagan falta para la finalidad por la que los diste (por ejemplo, hasta después del evento) o hasta que
        pidas la baja, salvo lo que haya que conservar por una obligación legal.
      </p>
    ),
  },
  {
    id: "derechos",
    titulo: "Tus derechos y cómo ejercerlos",
    contenido: (
      <>
        <p>
          Podés pedir <strong>acceso</strong> a tus datos, su <strong>rectificación</strong>, <strong>actualización</strong> o{" "}
          <strong>supresión</strong>, y darte de baja del Club cuando quieras. El acceso es gratuito a intervalos no
          inferiores a seis meses, salvo que acredites un interés legítimo (art. 14 de la Ley 25.326); la rectificación o
          supresión se resuelve dentro de los cinco días hábiles (art. 16).
        </p>
        <p>
          Para hacerlo, escribinos por <a href={waVentas} target="_blank" rel="noopener noreferrer">WhatsApp</a> desde el
          número o con el email que usaste, así podemos confirmar que sos vos.
        </p>
        <p className="border-l-2 border-bordeaux/40 pl-4 text-ink/65">
          La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la
          atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por
          incumplimiento de las normas vigentes en materia de protección de datos personales.
        </p>
      </>
    ),
  },
  {
    id: "seguridad",
    titulo: "Seguridad",
    contenido: (
      <p>
        El sitio funciona con conexión cifrada (HTTPS) y el acceso al panel donde se ven los datos está limitado a las
        personas del equipo que los necesitan.
      </p>
    ),
  },
  {
    id: "cambios",
    titulo: "Cambios en esta política",
    contenido: (
      <p>
        Si cambiamos algo importante, lo publicamos en esta página con la fecha de actualización. También podés ver los{" "}
        <Link href="/terminos">términos y condiciones</Link>.
      </p>
    ),
  },
];

export default function PrivacidadPage() {
  return (
    <PaginaLegal
      path="/privacidad"
      titulo="Política de privacidad"
      actualizado="26/10/2026"
      bajada={<p>Qué datos te pedimos, para qué los usamos y cómo podés pedir verlos, corregirlos o borrarlos.</p>}
      secciones={SECCIONES}
    />
  );
}
