"use client";

import { useActionState, useEffect } from "react";
import { Campo, inputCls } from "@/components/panel/catalogo/campos";
import { PanelButton } from "@/components/panel/PanelButton";
import { useAccion, useToast } from "@/components/panel/Toast";
import { bloquearCliente, editarCliente, type EstadoEdicion } from "@/modules/clientes/actions";
import { PROVINCIAS, TIPOS_CLIENTE, TRANSPORTES } from "@/modules/cuenta/opciones";

type Valores = {
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
  dni: string | null;
  tipoCliente: string | null;
  emprendimiento: string | null;
  instagram: string | null;
  calle: string | null;
  numero: string | null;
  pisoDepto: string | null;
  localidad: string | null;
  provincia: string | null;
  codigoPostal: string | null;
  transporte: string | null;
  contactoWhatsapp: boolean;
  contactoEmail: boolean;
};

/** Edición de los datos del cliente desde el panel (mismas reglas que /cuenta). */
export function ClienteForm({ id, valores }: { id: string; valores: Valores }) {
  const [estado, accion, pendiente] = useActionState<EstadoEdicion, FormData>(editarCliente.bind(null, id), null);
  const { avisar } = useToast();
  useEffect(() => {
    if (estado) avisar({ tipo: estado.ok ? "ok" : "error", texto: estado.mensaje });
  }, [estado, avisar]);
  const err = (k: string) => (estado && !estado.ok ? estado.errores[k as keyof typeof estado.errores] : undefined);
  const campo = (k: keyof Valores, label: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <Campo id={`c-${k}`} label={label} error={err(k)}>
      <input
        id={`c-${k}`}
        name={k}
        defaultValue={(valores[k] as string | null) ?? ""}
        aria-invalid={Boolean(err(k)) || undefined}
        className={inputCls}
        {...extra}
      />
    </Campo>
  );
  const select = (k: keyof Valores, label: string, opciones: readonly { v: string; l: string }[]) => (
    <Campo id={`c-${k}`} label={label} error={err(k)}>
      <select id={`c-${k}`} name={k} defaultValue={(valores[k] as string | null) ?? ""} className={inputCls}>
        <option value="">—</option>
        {opciones.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </Campo>
  );

  return (
    <form action={accion} className="flex flex-col gap-6 rounded-[var(--radius-lg)] border border-line bg-cloud p-5 md:p-7">
      <div className="grid gap-5 md:grid-cols-2">
        {campo("nombre", "Nombre", { required: true })}
        {campo("apellido", "Apellido")}
        {campo("telefono", "Celular (WhatsApp)", { inputMode: "tel" })}
        {campo("dni", "DNI", { inputMode: "numeric" })}
        {select("tipoCliente", "Tipo de cliente", TIPOS_CLIENTE)}
        {campo("emprendimiento", "Emprendimiento")}
        {campo("instagram", "Instagram (sin @)")}
        {select("transporte", "Transporte", TRANSPORTES)}
      </div>
      <div className="grid gap-5 border-t border-line pt-6 md:grid-cols-2">
        {campo("calle", "Calle")}
        <div className="grid grid-cols-2 gap-5">
          {campo("numero", "Número")}
          {campo("pisoDepto", "Piso / depto")}
        </div>
        {campo("localidad", "Localidad")}
        {select("provincia", "Provincia", PROVINCIAS.map((p) => ({ v: p, l: p })))}
        {campo("codigoPostal", "Código postal")}
      </div>
      <div className="flex flex-wrap gap-6 border-t border-line pt-6 text-[length:var(--text-step--1)]">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="contactoWhatsapp" value="si" defaultChecked={valores.contactoWhatsapp} className="size-5 accent-[var(--color-ink)]" />
          Acepta que le escribamos por WhatsApp
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="contactoEmail" value="si" defaultChecked={valores.contactoEmail} className="size-5 accent-[var(--color-ink)]" />
          Acepta mails
        </label>
      </div>
      <div>
        <PanelButton type="submit" disabled={pendiente}>
          {pendiente ? "Guardando…" : "Guardar cambios"}
        </PanelButton>
      </div>
    </form>
  );
}

/** Bloquear / desbloquear la cuenta (con confirmación). */
export function BloquearCliente({ id, bloqueado }: { id: string; bloqueado: boolean }) {
  const [pendiente, correr] = useAccion();
  return (
    <button
      type="button"
      disabled={pendiente}
      onClick={() => {
        const ok = bloqueado
          ? true
          : window.confirm("¿Bloquear esta cuenta? Se cierra su sesión y no va a poder volver a ingresar hasta que la desbloquees.");
        if (ok) correr(() => bloquearCliente(id, !bloqueado));
      }}
      className={`inline-flex min-h-11 items-center justify-center rounded-[var(--radius-pill)] border px-5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] disabled:opacity-50 ${
        bloqueado ? "border-ink text-ink hover:bg-ink hover:text-bone" : "border-bordeaux text-bordeaux hover:bg-bordeaux hover:text-bone"
      }`}
    >
      {pendiente ? "…" : bloqueado ? "Desbloquear cuenta" : "Bloquear cuenta"}
    </button>
  );
}
