"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { EVENT_NAME, EVENT_WHATSAPP, PASES, tarifaVigente, type PaseId } from "@/content/evento";
import { formatARS } from "@/content/productos";
import { iniciarPagoSummit, type EstadoPagoSummit } from "@/modules/summit/pago";
import { misDatosParaPrecargar } from "@/modules/cuenta/actions";
import { Turnstile } from "@/components/captcha/Turnstile";

/** Evento para preseleccionar el pase desde las tarjetas de Pases. */
export const EVENTO_ELEGIR_PASE = "sf:elegir-pase";

/**
 * Inscripción al Summit con pago online (Mercado Pago Checkout Pro): elegís el
 * pase, completás tus datos y pagás como quieras (tarjeta, cuotas, débito o
 * dinero en cuenta; sin efectivo). Al aprobarse el pago, tu lugar queda confirmado solo.
 */
export function SummitInscripcion() {
  const [pase, setPase] = useState<PaseId>("vip");
  const [estado, accion, pendiente] = useActionState<EstadoPagoSummit, FormData>(iniciarPagoSummit, null);
  const tarifa = tarifaVigente();
  const precio = tarifa.precios[pase];
  const [faltaConsentimiento, setFaltaConsentimiento] = useState(false);

  // Con sesión: precarga nombre, email, celular, DNI y ciudad (solo campos
  // vacíos). Se pide cuando el formulario se acerca a la pantalla.
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const f = formRef.current;
    if (!f) return;
    const io = new IntersectionObserver(
      (e) => {
        if (!e.some((x) => x.isIntersecting)) return;
        io.disconnect();
        misDatosParaPrecargar()
          .then((d) => {
            if (!d) return;
            const poner = (n: string, v: string) => {
              const el = f.elements.namedItem(n);
              if (el instanceof HTMLInputElement && !el.value && v) el.value = v;
            };
            poner("nombre", d.nombreCompleto);
            poner("email", d.email);
            poner("telefono", d.telefono);
            poner("dni", d.dni);
            poner("ciudad", d.ciudad);
          })
          .catch(() => {});
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(f);
    return () => io.disconnect();
  }, []);

  const elegirPase = (id: PaseId, origen: "formulario" | "tarjeta") => {
    setPase(id);
    track("summit_select_pass", { pase: id, tarifa: tarifaVigente().id, origen });
  };

  useEffect(() => {
    const elegir = (e: Event) => {
      const id = (e as CustomEvent<PaseId>).detail;
      if (PASES.some((p) => p.id === id)) elegirPase(id, "tarjeta");
    };
    window.addEventListener(EVENTO_ELEGIR_PASE, elegir);
    return () => window.removeEventListener(EVENTO_ELEGIR_PASE, elegir);
  }, []);

  // Pago creado → al checkout de Mercado Pago. Es una navegación en la misma
  // pestaña (no window.open después de un await, que Safari bloquea).
  const estadoRef = useRef(estado);
  useEffect(() => {
    estadoRef.current = estado;
    if (estado?.ok) {
      track("summit_begin_checkout", { pase, monto: precio });
      window.location.assign(estado.url);
    }
    // Solo cuando cambia el estado del servidor (pase/precio son los del envío).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  // Safari guarda la página en el bfcache: si desde Mercado Pago tocan "Atrás",
  // vuelve con el botón trabado en "Yendo a Mercado Pago…". Al restaurarse,
  // ese estado deja de contar y el botón se rehabilita.
  const [estadoVuelto, setEstadoVuelto] = useState<EstadoPagoSummit>(null);
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setEstadoVuelto(estadoRef.current);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);
  const yendo = Boolean(estado?.ok) && estado !== estadoVuelto;

  // Con JS enviamos a mano (sin action nativa): React 19 resetea el formulario
  // tras cada action y, si el servidor devolvía un error, se borraba todo lo
  // tipeado (en el celular, tener que reescribir 5 campos). El action={accion}
  // queda para el envío sin JS.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    if (datos.get("consentimiento") !== "si") {
      setFaltaConsentimiento(true);
      e.currentTarget.querySelector<HTMLInputElement>('input[name="consentimiento"]')?.focus();
      return;
    }
    startTransition(() => accion(datos));
  };

  const field =
    "w-full scroll-mb-28 scroll-mt-28 rounded-none border-b border-bone/30 bg-transparent py-3 text-[max(16px,var(--text-step-0))] text-bone placeholder:text-bone/40 focus:border-champagne focus:outline-none aria-[invalid=true]:border-champagne";
  const label = "text-[0.7rem] uppercase tracking-[0.16em] text-bone/65";
  const error = estado && !estado.ok ? estado : null;
  const inv = (c: string) => (error?.campo === c ? true : undefined);
  const wa = `https://wa.me/${EVENT_WHATSAPP}?text=${encodeURIComponent(`¡Hola! Tengo una consulta sobre la inscripción al ${EVENT_NAME}.`)}`;

  return (
    <form ref={formRef} action={accion} onSubmit={onSubmit} data-oculta-flotantes className="flex flex-col gap-6" aria-label="Inscripción y pago">
      <input type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <fieldset className="flex flex-col gap-2">
        <legend className={`${label} mb-2`}>Pase</legend>
        <div className="grid grid-cols-2 gap-2">
          {PASES.map((p) => (
            <label
              key={p.id}
              className={`flex min-h-12 cursor-pointer items-center justify-center rounded-full border text-[0.75rem] uppercase tracking-[0.12em] transition-colors ${
                pase === p.id ? "border-bone bg-bone text-ink" : "border-bone/30 text-bone hover:border-bone/70"
              }`}
            >
              <input type="radio" name="pase" value={p.id} checked={pase === p.id} onChange={() => elegirPase(p.id, "formulario")} className="sr-only" />
              {p.nombre}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Precio vigente, bien grande */}
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-y border-bone/15 py-5">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-champagne">{tarifa.nombre}</p>
          {tarifa.hastaLabel && <p className="text-[length:var(--text-step--1)] text-bone/55">{tarifa.hastaLabel}</p>}
        </div>
        <p className="shrink-0 font-display text-[length:var(--text-step-4)] font-extrabold leading-none tabular-nums">{formatARS(precio)}</p>
      </div>

      <label className="flex flex-col gap-1">
        <span className={label}>Nombre y apellido</span>
        <input name="nombre" required minLength={3} autoComplete="name" autoCapitalize="words" enterKeyHint="next" aria-invalid={inv("nombre")} className={field} />
      </label>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={label}>Email</span>
          <input name="email" type="email" required autoComplete="email" inputMode="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="next" aria-invalid={inv("email")} className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={label}>Celular</span>
          <input name="telefono" type="tel" required autoComplete="tel" inputMode="tel" enterKeyHint="next" placeholder="11 5555 5555" aria-invalid={inv("telefono")} className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={label}>DNI</span>
          <input name="dni" required inputMode="numeric" autoComplete="off" enterKeyHint="next" aria-invalid={inv("dni")} aria-describedby="dni-ayuda" className={field} />
          <span id="dni-ayuda" className="text-[length:var(--text-step--1)] text-bone/50">
            Lo pedimos para acreditarte en la puerta.
          </span>
        </label>
        <label className="flex flex-col gap-1">
          <span className={label}>Ciudad</span>
          <input name="ciudad" required autoComplete="address-level2" autoCapitalize="words" enterKeyHint="done" aria-invalid={inv("ciudad")} className={field} />
        </label>
      </div>

      {/* Consentimiento (Ley 25.326, S-23): obligatorio. El servidor guarda la fecha. */}
      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-3 text-[length:var(--text-step--1)] leading-relaxed text-bone/80">
          <input
            type="checkbox"
            name="consentimiento"
            value="si"
            required
            aria-invalid={faltaConsentimiento || inv("consentimiento") ? true : undefined}
            aria-describedby={faltaConsentimiento ? "consentimiento-error" : undefined}
            onInvalid={() => setFaltaConsentimiento(true)}
            onChange={(e) => e.currentTarget.checked && setFaltaConsentimiento(false)}
            className="mt-0.5 size-5 shrink-0 accent-[var(--color-champagne)]"
          />
          <span>
            Acepto que usen mis datos para gestionar mi inscripción (ver{" "}
            <Link href="/privacidad" className="underline underline-offset-4 hover:text-bone">
              Privacidad
            </Link>
            ).
          </span>
        </label>
        {faltaConsentimiento && (
          <p id="consentimiento-error" role="alert" className="pl-8 text-[length:var(--text-step--1)] text-champagne">
            Para inscribirte tenés que aceptar el uso de tus datos para la inscripción.
          </p>
        )}
      </div>

      <Turnstile accion="summit" reiniciar={estado} />

      {error && (
        <p role="alert" className="rounded-[var(--radius-md)] border border-champagne/50 bg-champagne/10 px-4 py-3 text-[length:var(--text-step--1)] text-bone">
          {error.mensaje}
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente || yendo}
        className="group mt-2 flex min-h-14 w-full scroll-mb-28 items-center justify-center gap-3 rounded-full bg-bone px-6 text-[0.8rem] font-medium uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-champagne disabled:opacity-70"
      >
        {pendiente || yendo ? "Yendo a Mercado Pago…" : `Pagar ${formatARS(precio)}`}
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>
      <p className="text-center text-[length:var(--text-step--1)] leading-relaxed text-bone/55">
        Al pagar aceptás las{" "}
        <Link href="/terminos#summit" className="underline underline-offset-4 hover:text-bone">
          condiciones de la inscripción
        </Link>
        .
      </p>
      <p className="-mt-3 text-center text-[length:var(--text-step--1)] leading-relaxed text-bone/55">
        Pagás seguro con Mercado Pago: tarjeta de crédito en cuotas, débito o dinero en cuenta de Mercado Pago.
        ¿Dudas?{" "}
        <a href={wa} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-bone">
          Escribinos
        </a>
        .
      </p>
    </form>
  );
}
