import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// drizzle-kit no lee .env.local solo: lo cargamos con el loader nativo de Node.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

// Migraciones versionadas en ./drizzle (se commitean). La estructura de la base
// SOLO cambia por migraciones: `npm run db:generate` → revisar → `npm run db:migrate`.
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Migraciones por la conexión directa (sin pgbouncer); la app usa DATABASE_URL.
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "" },
  strict: true,
  verbose: true,
});
