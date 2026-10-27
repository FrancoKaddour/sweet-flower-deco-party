import { and, count, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { NewsletterBanda } from "./NewsletterBanda";

/** Prueba social: solo se muestra cuando el número ya impresiona. */
async function totalClub(): Promise<number> {
  if (!db) return 0;
  try {
    const [r] = await db.select({ n: count() }).from(subscribers).where(and(eq(subscribers.estado, "activo"), isNotNull(subscribers.confirmadoAt)));
    return r?.n ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Newsletter "Club Sweet Flowers" — banda a sangre arriba del footer, en todas
 * las páginas del sitio. Estrategia: un beneficio concreto e inmediato (código
 * de descuento por mail al confirmar, doble opt-in), pocos campos, intereses opcionales para
 * segmentar y prueba social cuando el club ya es grande.
 *
 * En las páginas del Summit (/event-summit…) la banda cambia sola de mensaje
 * (E-20): avisos del evento e "Event Summit" preseleccionado. `variante`
 * permite forzarla.
 */
export async function Newsletter({ variante }: { variante?: "general" | "summit" } = {}) {
  const total = await totalClub();
  return <NewsletterBanda total={total} variante={variante} />;
}
