-- Panel → Clientes: cuentas bloqueadas por el staff.
ALTER TABLE "users" ADD COLUMN "bloqueado_at" timestamp with time zone;
