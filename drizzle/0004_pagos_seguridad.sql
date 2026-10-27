CREATE TABLE "rate_limits" (
	"clave" text PRIMARY KEY NOT NULL,
	"inicio" timestamp with time zone DEFAULT now() NOT NULL,
	"conteo" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "summit_registrations" ADD COLUMN "reserva_hasta" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "summit_registrations" ADD COLUMN "entrada_enviada_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "summit_registrations" ADD COLUMN "consent_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "subscribers" ADD COLUMN "confirmado_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "subscribers" ADD COLUMN "token_confirmacion" text;
--> statement-breakpoint
-- Antes del índice único: si dos deploys simultáneos duplicaron un marcador, queda el más viejo.
DELETE FROM "audit_log" a USING "audit_log" b WHERE a."entidad" = 'datos' AND b."entidad" = 'datos' AND a."accion" = b."accion" AND (a."created_at", a."id") > (b."created_at", b."id");
--> statement-breakpoint
CREATE UNIQUE INDEX "audit_log_datos_accion_idx" ON "audit_log" USING btree ("accion") WHERE "audit_log"."entidad" = 'datos';
--> statement-breakpoint
CREATE UNIQUE INDEX "subscribers_token_confirmacion_idx" ON "subscribers" USING btree ("token_confirmacion");
--> statement-breakpoint
-- Doble opt-in: quienes ya estaban en el club ya recibieron su código; quedan confirmados.
UPDATE "subscribers" SET "confirmado_at" = "created_at" WHERE "confirmado_at" IS NULL;
--> statement-breakpoint
-- Entradas ya pagadas: se asume que el mail salió (si no, se reenvía desde el panel). Evita un reenvío masivo del cron.
UPDATE "summit_registrations" SET "entrada_enviada_at" = COALESCE("pagado_at", now()) WHERE "pago_estado" = 'aprobado' AND "entrada_enviada_at" IS NULL;