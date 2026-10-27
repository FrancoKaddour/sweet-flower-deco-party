-- Perfil de cliente, historial de compras (orders/summit_registrations.user_id) y datos propios del pedido (frente F).
-- OJO: 'iniciado' se agrega al enum pero no se usa en esta migración (Postgres no deja usar un valor nuevo en la misma transacción).
CREATE TYPE "public"."tipo_cliente" AS ENUM('decoradora', 'organizadora', 'particular', 'empresa');
--> statement-breakpoint
CREATE TYPE "public"."transporte" AS ENUM('via_cargo', 'buspack', 'md', 'flechabus', 'retiro');
--> statement-breakpoint
ALTER TYPE "public"."order_status" ADD VALUE 'iniciado' BEFORE 'nuevo';
--> statement-breakpoint
CREATE TABLE "customer_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"nombre" text,
	"apellido" text,
	"telefono" text,
	"dni" text,
	"tipo_cliente" "tipo_cliente",
	"emprendimiento" text,
	"instagram" text,
	"calle" text,
	"numero" text,
	"piso_depto" text,
	"localidad" text,
	"provincia" text,
	"codigo_postal" text,
	"transporte" "transporte",
	"contacto_whatsapp" boolean DEFAULT true NOT NULL,
	"contacto_email" boolean DEFAULT true NOT NULL,
	"privacidad_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customer_profiles_dni_check" CHECK ("customer_profiles"."dni" is null or "customer_profiles"."dni" ~ '^[0-9]{7,8}$')
);

--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "fecha_evento" date;
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "pago" text;
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "codigo_club" text;
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "origen" text;
--> statement-breakpoint
ALTER TABLE "summit_registrations" ADD COLUMN "user_id" text;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "summit_registrations" ADD CONSTRAINT "summit_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "orders_user_idx" ON "orders" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "summit_registrations_user_idx" ON "summit_registrations" USING btree ("user_id");
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_pago_check" CHECK ("orders"."pago" is null or "orders"."pago" in ('transferencia', 'mercadopago'));