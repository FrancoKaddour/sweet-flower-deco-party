CREATE TYPE "public"."campaign_status" AS ENUM('borrador', 'enviando', 'enviada');--> statement-breakpoint
CREATE TYPE "public"."subscriber_status" AS ENUM('activo', 'baja');--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" text PRIMARY KEY NOT NULL,
	"asunto" text NOT NULL,
	"preheader" text,
	"titulo" text NOT NULL,
	"cuerpo" text NOT NULL,
	"imagen" text,
	"cta_texto" text,
	"cta_url" text,
	"segmento" text DEFAULT 'todos' NOT NULL,
	"estado" "campaign_status" DEFAULT 'borrador' NOT NULL,
	"enviados" integer DEFAULT 0 NOT NULL,
	"fallidos" integer DEFAULT 0 NOT NULL,
	"enviada_at" timestamp with time zone,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"nombre" text,
	"origen" text DEFAULT 'footer' NOT NULL,
	"intereses" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"user_id" text,
	"estado" "subscriber_status" DEFAULT 'activo' NOT NULL,
	"token" text NOT NULL,
	"codigo" text NOT NULL,
	"codigo_usado_at" timestamp with time zone,
	"recordatorio_at" timestamp with time zone,
	"consent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"baja_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "campaigns_estado_idx" ON "campaigns" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "campaigns_created_idx" ON "campaigns" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "subscribers_token_idx" ON "subscribers" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "subscribers_codigo_idx" ON "subscribers" USING btree ("codigo");--> statement-breakpoint
CREATE INDEX "subscribers_estado_idx" ON "subscribers" USING btree ("estado");