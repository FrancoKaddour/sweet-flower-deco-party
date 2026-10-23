ALTER TABLE "summit_registrations" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "summit_registrations" ADD COLUMN "dni" text;--> statement-breakpoint
ALTER TABLE "summit_registrations" ADD COLUMN "pago_estado" text;--> statement-breakpoint
ALTER TABLE "summit_registrations" ADD COLUMN "mp_preference_id" text;--> statement-breakpoint
ALTER TABLE "summit_registrations" ADD COLUMN "mp_payment_id" text;--> statement-breakpoint
ALTER TABLE "summit_registrations" ADD COLUMN "pagado_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "summit_registrations_pago_idx" ON "summit_registrations" USING btree ("pago_estado");