"use client";

import { startTransition, useActionState, useEffect, useId, useRef } from "react";
import Link from "next/link";
import { guardarPerfil, type EstadoPerfil } from "@/modules/cuenta/actions";
import { PROVINCIAS, TIPOS_CLIENTE, TRANSPORTES, type CampoPerfil } from "@/modules/cuenta/opciones";

export type PerfilInicial = {
  nombre: string;
  apellido: string;
  telefono: string;
  dni: string;
  tipoCliente: string;
  emprendimiento: string;
  instagram: string;
  calle: string;
  numero: string;
  pisoDepto: string;
  localidad: string;
  provincia: string;
  codigoPostal: string;
  transporte: string;
  contactoWhatsapp: boolean;
  contactoEmail: boolean;
};

const input =
  "mt-2 w-full rounded-none border-b border-ink/25 bg-transparent pb-2.5 pt-1 text-[max(16px,var(--text-step-0))] text-ink placeholder:text-ink/40 transition-colors focus:border-ink focus:outline-none aria-[invalid=true]:border-bordeaux";
const etiqueta = "text-[length:var(--text-step--1)] font-medium text-ink";
const ayuda = "mt-1.5 text-[length:var(--text-step--1)] text-ink/65";
const chip =
  "inline-flex min-h-11 cursor-pointer select-none items-center rounded-full border border-ink/20 px-4 text-[length:var(--text-step--1)] text-ink/80 transition-colors hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-bone has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink";

/**
 * "Mis datos" + "Dirección de envío" (un solo formulario, se guarda junto).
 * Envío a mano con JS para no perder lo tipeado si el servidor marca un error
 * (React 19 resetea el form tras una action nativa); action={accion} queda
 * para el envío sin JS.
 */
export function PerfilForm({ inicial, aceptoPrivacidad }: { inicial: PerfilInicial; aceptoPrivacidad: boolean }) {
  const [estado, accion, pendiente] = useActionState<EstadoPerfil, FormData>(guardarPerfil, null);
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const avisoRef = useRef<HTMLParagraphElement>(null);
  const errores: Partial<Record<CampoPerfil, string>> = estado && !estado.ok ? estado.errores : {};

  // Error → foco al primer campo marcado (o al aviso si es general).
  useEffect(() => {
    if (!estado || estado.ok) return;
    const primero = Object.keys(estado.errores)[0];
    const el = primero ? formRef.current?.querySelector<HTMLElement>(`[name="${primero}"]`) : null;
    (el ?? avisoRef.current)?.focus();
  }, [estado]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    startTransition(() => accion(datos));
  };

  const id = (c: string) => `${uid}-${c}`;
  const err = (c: CampoPerfil) => errores[c];
  const desc = (c: CampoPerfil, conAyuda = false) =>
    [conAyuda ? `${id(c)}-ayuda` : null, err(c) ? `${id(c)}-error` : null].filter(Boolean).join(" ") || undefined;
  const errorDe = (c: CampoPerfil) =>
    err(c) ? (
      <p id={`${id(c)}-error`} className="mt-1.5 text-[length:var(--text-step--1)] font-medium text-bordeaux">
        {err(c)}
      </p>
    ) : null;

  const campo = (c: keyof PerfilInicial & CampoPerfil, l: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}, ayudaTxt?: string) => (
    <div>
      <label htmlFor={id(c)} className={etiqueta}>
        {l}
      </label>
      <input
        id={id(c)}
        name={c}
        defaultValue={String(inicial[c] ?? "")}
        aria-invalid={err(c) ? true : undefined}
        aria-describedby={desc(c, Boolean(ayudaTxt))}
        className={input}
        {...extra}
      />
      {ayudaTxt && (
        <p id={`${id(c)}-ayuda`} className={ayuda}>
          {ayudaTxt}
        </p>
      )}
      {errorDe(c)}
    </div>
  );

  return (
    <form ref={formRef} action={accion} onSubmit={onSubmit} noValidate data-oculta-flotantes className="flex flex-col">
      <section id="datos" aria-labelledby="datos-h" className="scroll-mt-28">
        <h2 id="datos-h" className="font-display text-[length:var(--text-step-3)] font-bold leading-none text-ink">
          Mis datos
        </h2>
        <p className="mt-3 max-w-[52ch] text-ink/70">Con esto armamos tu pedido y tu inscripción sin volver a preguntarte.</p>

        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
          {campo("nombre", "Nombre", { autoComplete: "given-name", autoCapitalize: "words", required: true, maxLength: 60 })}
          {campo("apellido", "Apellido", { autoComplete: "family-name", autoCapitalize: "words", maxLength: 60 })}
          {campo("telefono", "Celular con WhatsApp", { type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "11 5555 5555", maxLength: 30 }, "Con código de área, sin 0 ni 15.")}
          {campo("dni", "DNI (opcional)", { inputMode: "numeric", autoComplete: "off", maxLength: 12 }, "Lo usamos para acreditarte en el Summit.")}
        </div>

        <fieldset className="mt-9" aria-describedby={err("tipoCliente") ? `${id("tipoCliente")}-error` : undefined}>
          <legend className={etiqueta}>¿Cómo trabajás con nosotros?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {TIPOS_CLIENTE.map((t) => (
              <label key={t.v} className={chip}>
                <input type="radio" name="tipoCliente" value={t.v} defaultChecked={inicial.tipoCliente === t.v} className="sr-only" />
                {t.l}
              </label>
            ))}
          </div>
          {errorDe("tipoCliente")}
        </fieldset>

        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
          {campo("emprendimiento", "Tu emprendimiento (opcional)", { autoComplete: "organization", maxLength: 80 })}
          {campo("instagram", "Instagram (opcional)", { autoCapitalize: "none", autoCorrect: "off", spellCheck: false, placeholder: "@tuemprendimiento", maxLength: 60 })}
        </div>
      </section>

      <section id="envio" aria-labelledby="envio-h" className="mt-20 scroll-mt-28 border-t border-ink/10 pt-14">
        <h2 id="envio-h" className="font-display text-[length:var(--text-step-3)] font-bold leading-none text-ink">
          Dirección de envío
        </h2>
        <p className="mt-3 max-w-[52ch] text-ink/70">Enviamos a todo el país por transporte. El costo del envío se cotiza aparte.</p>

        <div className="mt-8 grid grid-cols-6 gap-x-6 gap-y-7">
          <div className="col-span-6 sm:col-span-4">{campo("calle", "Calle", { autoComplete: "address-line1", maxLength: 100 })}</div>
          <div className="col-span-3 sm:col-span-2">{campo("numero", "Número", { inputMode: "text", maxLength: 10, placeholder: "S/N" })}</div>
          <div className="col-span-3 sm:col-span-2">{campo("pisoDepto", "Piso / depto", { autoComplete: "address-line2", maxLength: 30 })}</div>
          <div className="col-span-6 sm:col-span-4">{campo("localidad", "Localidad", { autoComplete: "address-level2", autoCapitalize: "words", maxLength: 80 })}</div>
          <div className="col-span-6 sm:col-span-4">
            <label htmlFor={id("provincia")} className={etiqueta}>
              Provincia
            </label>
            <select
              id={id("provincia")}
              name="provincia"
              defaultValue={inicial.provincia}
              autoComplete="address-level1"
              aria-invalid={err("provincia") ? true : undefined}
              aria-describedby={desc("provincia")}
              className={`${input} appearance-none bg-[length:12px] bg-[right_0.25rem_center] bg-no-repeat pr-6`}
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%2314110f' stroke-width='1.5'/%3E%3C/svg%3E\")" }}
            >
              <option value="">Elegí tu provincia</option>
              {PROVINCIAS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errorDe("provincia")}
          </div>
          <div className="col-span-6 sm:col-span-2">
            {campo("codigoPostal", "Código postal", { autoComplete: "postal-code", autoCapitalize: "characters", maxLength: 10, placeholder: "1425" }, "4 números o CPA (C1425ABC).")}
          </div>
        </div>

        <fieldset className="mt-9">
          <legend className={etiqueta}>Transporte preferido (opcional)</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {TRANSPORTES.map((t) => (
              <label key={t.v} className={chip}>
                <input type="radio" name="transporte" value={t.v} defaultChecked={inicial.transporte === t.v} className="sr-only" />
                {t.l}
              </label>
            ))}
            <label className={chip}>
              <input type="radio" name="transporte" value="" defaultChecked={!inicial.transporte} className="sr-only" />
              Lo vemos después
            </label>
          </div>
          {errorDe("transporte")}
        </fieldset>

        <fieldset className="mt-9">
          <legend className={etiqueta}>¿Por dónde te escribimos?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            <label className={chip}>
              <input type="checkbox" name="contactoWhatsapp" value="si" defaultChecked={inicial.contactoWhatsapp} className="sr-only" />
              WhatsApp
            </label>
            <label className={chip}>
              <input type="checkbox" name="contactoEmail" value="si" defaultChecked={inicial.contactoEmail} className="sr-only" />
              Email
            </label>
          </div>
          <p className={ayuda}>Solo sobre tus pedidos e inscripciones. Las novedades del Club van aparte.</p>
        </fieldset>
      </section>

      <div className="sticky bottom-0 z-10 -mx-6 mt-12 border-t border-ink/10 bg-bone/95 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:pb-0 md:backdrop-blur-none">
        {!aceptoPrivacidad && (
          <div className="mb-4">
            <label className="flex cursor-pointer items-start gap-3 text-[length:var(--text-step--1)] leading-relaxed text-ink/80">
              <input
                type="checkbox"
                name="privacidad"
                value="si"
                aria-invalid={err("privacidad") ? true : undefined}
                aria-describedby={err("privacidad") ? `${id("privacidad")}-error` : undefined}
                className="mt-0.5 size-5 shrink-0 accent-[var(--color-ink)]"
              />
              <span>
                Acepto que Sweet Flowers guarde estos datos para mis pedidos e inscripciones (
                <Link href="/privacidad" className="underline underline-offset-4 hover:text-bordeaux">
                  Privacidad
                </Link>
                ).
              </span>
            </label>
            {errorDe("privacidad")}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="submit"
            disabled={pendiente}
            className="inline-flex min-h-13 items-center justify-center rounded-full bg-ink px-8 text-[0.8rem] font-medium uppercase tracking-[0.12em] text-bone transition-colors hover:bg-bordeaux disabled:opacity-60"
          >
            {pendiente ? "Guardando…" : "Guardar mis datos"}
          </button>
          <p
            ref={avisoRef}
            tabIndex={-1}
            role={estado && !estado.ok ? "alert" : "status"}
            className={`text-[length:var(--text-step--1)] outline-none ${estado && !estado.ok ? "font-medium text-bordeaux" : "text-ink/75"}`}
          >
            {estado?.mensaje ?? ""}
          </p>
        </div>
      </div>
    </form>
  );
}
