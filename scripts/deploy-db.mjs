// Se corre en cada build de Vercel ANTES de `next build`: aplica las
// migraciones pendientes, carga el catálogo si la base está vacía y aplica las
// actualizaciones de datos de una sola vez (scripts/actualizaciones.ts).
//
// S-26: SOLO en Production (VERCEL_ENV === "production"). En Preview no se toca
// la base (puede ser la misma que producción). En local (sin VERCEL_ENV) NO
// corre en `npm run build`: para migrar a mano, `npm run db:deploy`
// (o DEPLOY_DB=1 npm run build). Sin DATABASE_URL no hace nada.
import { execSync } from "node:child_process";

const env = process.env.VERCEL_ENV;
const manual = process.argv.includes("--manual") || process.env.DEPLOY_DB === "1";

if (env && env !== "production") {
  console.log(`[deploy-db] VERCEL_ENV=${env}: salteo migraciones, seed y actualizaciones (solo corren en Production).`);
  process.exit(0);
}
if (!env && !manual) {
  console.log("[deploy-db] build local: salteo la base (para migrar a mano: npm run db:deploy).");
  process.exit(0);
}
if (!process.env.DATABASE_URL) {
  console.log("[deploy-db] sin DATABASE_URL: salteo migraciones y seed.");
  process.exit(0);
}
const run = (cmd) => execSync(cmd, { stdio: "inherit" });
console.log("[deploy-db] aplicando migraciones…");
run("npx drizzle-kit migrate");
console.log("[deploy-db] seed del catálogo (solo si nunca se cargó)…");
run("npx tsx scripts/seed.ts");
console.log("[deploy-db] actualizaciones de datos de una sola vez…");
run("npx tsx scripts/actualizaciones.ts");
