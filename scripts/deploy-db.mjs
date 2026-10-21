// Se corre en cada deploy de Vercel ANTES del build: aplica las migraciones
// pendientes y carga el catálogo si la base está vacía (el seed es idempotente).
// Usa las variables que Vercel ya tiene (no hace falta copiar secretos a mano).
// Sin DATABASE_URL (ej. build local sin base) no hace nada.
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("[deploy-db] sin DATABASE_URL: salteo migraciones y seed.");
  process.exit(0);
}
const run = (cmd) => execSync(cmd, { stdio: "inherit" });
console.log("[deploy-db] aplicando migraciones…");
run("npx drizzle-kit migrate");
console.log("[deploy-db] seed del catálogo (solo agrega lo que falte)…");
run("npx tsx scripts/seed.ts");
