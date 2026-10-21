import { defineConfig } from "drizzle-kit";

// Migraciones versionadas en ./drizzle (se commitean). La estructura de la base
// SOLO cambia por migraciones: `npm run db:generate` → revisar → `npm run db:migrate`.
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  strict: true,
  verbose: true,
});
