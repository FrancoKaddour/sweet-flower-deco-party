CREATE TYPE "public"."order_status" AS ENUM('nuevo', 'confirmado', 'en_produccion', 'enviado', 'entregado', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."inquiry_status" AS ENUM('nueva', 'respondida', 'archivada');--> statement-breakpoint
CREATE TYPE "public"."registration_status" AS ENUM('consulto', 'seno', 'pago', 'asistio', 'cancelado');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"codigo" text NOT NULL,
	"user_id" text,
	"nombre" text,
	"localidad" text,
	"nota" text,
	"items" jsonb NOT NULL,
	"total" integer NOT NULL,
	"hay_consultar" boolean DEFAULT false NOT NULL,
	"estado" "order_status" DEFAULT 'nuevo' NOT NULL,
	"telefono" text,
	"nota_interna" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "orders_total_check" CHECK ("orders"."total" >= 0)
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" text PRIMARY KEY NOT NULL,
	"tipo" text NOT NULL,
	"nombre" text NOT NULL,
	"email" text,
	"telefono" text,
	"mensaje" text NOT NULL,
	"estado" "inquiry_status" DEFAULT 'nueva' NOT NULL,
	"nota_interna" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "summit_registrations" (
	"id" text PRIMARY KEY NOT NULL,
	"codigo" text NOT NULL,
	"edicion" text NOT NULL,
	"pase" text NOT NULL,
	"nombre" text NOT NULL,
	"ciudad" text,
	"forma_pago" text,
	"mensaje" text,
	"precio_referencia" integer,
	"estado" "registration_status" DEFAULT 'consulto' NOT NULL,
	"telefono" text,
	"nota_interna" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "orders_codigo_idx" ON "orders" USING btree ("codigo");--> statement-breakpoint
CREATE INDEX "orders_estado_idx" ON "orders" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "orders_created_idx" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "inquiries_estado_idx" ON "inquiries" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "inquiries_created_idx" ON "inquiries" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "summit_registrations_codigo_idx" ON "summit_registrations" USING btree ("codigo");--> statement-breakpoint
CREATE INDEX "summit_registrations_estado_idx" ON "summit_registrations" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "summit_registrations_edicion_idx" ON "summit_registrations" USING btree ("edicion");