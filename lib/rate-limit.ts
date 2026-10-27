import "server-only";
import { headers } from "next/headers";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { rateLimits } from "@/db/schema";
import { ipDeHeaders } from "@/lib/reglas";

/**
 * Rate limit sin paquetes externos: tabla `rate_limits` en Neon con ventana
 * fija. Una sola sentencia (upsert) cuenta y reinicia la ventana, así que es
 * atómica aunque neon-http no tenga transacciones interactivas.
 *
 *   if (!(await limitar(`nl:ip:${await ipCliente()}`, 5, 3600))) return …
 *
 * Si la base falla, deja pasar (fail-open): un problema de la tabla nunca
 * tiene que tirar abajo un formulario. Las filas viejas las limpia el cron.
 */
export async function limitar(clave: string, max: number, ventanaSeg: number): Promise<boolean> {
  if (!db) return true;
  const k = clave.slice(0, 200);
  try {
    const vencida = sql`${rateLimits.inicio} < now() - make_interval(secs => ${ventanaSeg})`;
    const [r] = await db
      .insert(rateLimits)
      .values({ clave: k, conteo: 1 })
      .onConflictDoUpdate({
        target: rateLimits.clave,
        set: {
          conteo: sql`case when ${vencida} then 1 else ${rateLimits.conteo} + 1 end`,
          inicio: sql`case when ${vencida} then now() else ${rateLimits.inicio} end`,
        },
      })
      .returning({ conteo: rateLimits.conteo });
    return (r?.conteo ?? 1) <= max;
  } catch (e) {
    console.error("[rate-limit]", e instanceof Error ? e.message : e);
    return true;
  }
}

/** IP del request actual (server actions y route handlers). */
export async function ipCliente(): Promise<string> {
  try {
    return ipDeHeaders(await headers());
  } catch {
    return "desconocida";
  }
}

/** Borra ventanas viejas (lo llama el cron diario). */
export async function limpiarRateLimits(): Promise<void> {
  if (!db) return;
  await db.delete(rateLimits).where(sql`${rateLimits.inicio} < now() - interval '2 days'`);
}
