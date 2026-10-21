import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Cliente de base (Neon HTTP → ideal para serverless en Vercel).
 * Si no hay DATABASE_URL (local sin configurar, o antes del setup), `db` es
 * null y el sitio público usa el catálogo estático como respaldo: nunca se cae.
 */
export type Db = NeonHttpDatabase<typeof schema>;

const url = process.env.DATABASE_URL;

export const db: Db | null = url ? drizzle(neon(url), { schema }) : null;

export const hasDb = (): boolean => db !== null;

/** Para código que SÍ necesita base (panel, auth): error claro si falta. */
export function requireDb(): Db {
  if (!db) {
    throw new Error(
      "Falta DATABASE_URL. Seguí docs/SETUP_BACKEND.md (Neon desde el Marketplace de Vercel + `vercel env pull`).",
    );
  }
  return db;
}

export { schema };
