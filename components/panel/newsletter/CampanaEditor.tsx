"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { guardarCampana, type EstadoCampanaForm } from "@/modules/newsletter/actions";
import { correoCampana } from "@/lib/email/plantillas";
import { PLANTILLAS, SEGMENTOS, type DatosCampana, type Segmento } from "@/content/newsletter";
import { inputCls } from "@/components/panel/catalogo/campos";
import { PanelButton } from "@/components/panel/PanelButton";

const label = "text-[length:var(--text-step--1)] uppercase tracking-[0.12em] text-muted";

/**
 * Editor de campaña con vista previa en vivo (el mismo HTML que llega al mail).
 * Arriba, plantillas de arranque para no empezar de cero.
 */
export function CampanaEditor({
  id,
  inicial,
  base,
  conteos,
  bloqueada = false,
}: {
  id: string | null;
  inicial: DatosCampana;
  base: string;
  conteos: Record<string, number>;
  bloqueada?: boolean;
}) {
  const [d, setD] = useState<DatosCampana>(inicial);
  const [estado, accion, pendiente] = useActionState<EstadoCampanaForm, FormData>(guardarCampana.bind(null, id), null);
  const [subiendo, setSubiendo] = useState(false);
  const [errorImg, setErrorImg] = useState<string | null>(null);
  const [vista, setVista] = useState<"escritorio" | "celular">("escritorio");
  const archivo = useRef<HTMLInputElement>(null);

  const set = <K extends keyof DatosCampana>(k: K, v: DatosCampana[K]) => setD((x) => ({ ...x, [k]: v }));

  const html = useMemo(
    () => correoCampana({ base, ...d, nombre: "Flor", codigo: "CLUB-7KQ4M", bajaUrl: "#" }).html,
    [base, d],
  );

  const subirImagen = async (f: File | undefined) => {
    if (!f) return;
    setErrorImg(null);
    if (!f.type.startsWith("image/")) return setErrorImg("Tiene que ser una imagen.");
    if (f.size > 15 * 1024 * 1024) return setErrorImg("Pesa más de 15 MB.");
    setSubiendo(true);
    try {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const blob = await upload(`newsletter/campana.${ext}`, f, { access: "public", handleUploadUrl: "/api/panel/upload" });
      set("imagen", blob.url);
    } catch (e) {
      setErrorImg((e as Error).message || "No se pudo subir.");
    } finally {
      setSubiendo(false);
      if (archivo.current) archivo.current.value = "";
    }
  };

  const segmento = SEGMENTOS.find((s) => s.v === d.segmento);

  return (
    <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <form action={accion} className="flex flex-col gap-6">
        {!id && (
          <fieldset className="flex flex-col gap-3">
            <legend className={`${label} mb-3`}>Empezar desde una plantilla</legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PLANTILLAS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setD(p.datos)}
                  className="rounded-[var(--radius-md)] border border-line bg-cloud px-4 py-3 text-left transition-colors hover:border-champagne"
                >
                  <span className="block font-medium text-ink">{p.nombre}</span>
                  <span className="block text-[length:var(--text-step--1)] text-muted">{p.descripcion}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <label className="flex flex-col gap-2">
          <span className={label}>Asunto *</span>
          <input name="asunto" value={d.asunto} onChange={(e) => set("asunto", e.target.value)} maxLength={150} required disabled={bloqueada} className={inputCls} />
          <span className="text-[length:var(--text-step--1)] text-muted">Corto y con un beneficio concreto. Ideal: menos de 50 caracteres ({d.asunto.length}).</span>
        </label>
        <label className="flex flex-col gap-2">
          <span className={label}>Texto de vista previa</span>
          <input name="preheader" value={d.preheader} onChange={(e) => set("preheader", e.target.value)} maxLength={150} disabled={bloqueada} className={inputCls} />
          <span className="text-[length:var(--text-step--1)] text-muted">La línea gris que se ve al lado del asunto en la bandeja.</span>
        </label>
        <label className="flex flex-col gap-2">
          <span className={label}>Título *</span>
          <input name="titulo" value={d.titulo} onChange={(e) => set("titulo", e.target.value)} maxLength={150} required disabled={bloqueada} className={inputCls} />
        </label>
        <label className="flex flex-col gap-2">
          <span className={label}>Mensaje *</span>
          <textarea name="cuerpo" value={d.cuerpo} onChange={(e) => set("cuerpo", e.target.value)} rows={10} required disabled={bloqueada} className={`${inputCls} resize-y`} />
          <span className="text-[length:var(--text-step--1)] leading-relaxed text-muted">
            Dejá una línea en blanco entre párrafos. Empezá con “- ” para hacer una lista y usá **texto** para negrita.
            Se reemplazan solos: <code className="font-mono">{"{nombre}"}</code> y <code className="font-mono">{"{codigo}"}</code> (su código de descuento).
          </span>
        </label>

        <div className="flex flex-col gap-2">
          <span className={label}>Imagen (opcional)</span>
          <input type="hidden" name="imagen" value={d.imagen} />
          {d.imagen ? (
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.imagen} alt="" className="h-20 w-28 rounded-[var(--radius-sm)] object-cover" />
              {!bloqueada && (
                <button type="button" onClick={() => set("imagen", "")} className="text-[length:var(--text-step--1)] text-muted hover:text-bordeaux">
                  Quitar
                </button>
              )}
            </div>
          ) : (
            !bloqueada && (
              <div>
                <input ref={archivo} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" id="img-campana" onChange={(e) => subirImagen(e.target.files?.[0])} />
                <label htmlFor="img-campana" className="inline-flex min-h-11 cursor-pointer items-center rounded-[var(--radius-pill)] border border-line bg-cloud px-5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-ink hover:border-ink/40">
                  {subiendo ? "Subiendo…" : "Subir foto"}
                </label>
                <p className="mt-2 text-[length:var(--text-step--1)] text-muted">Horizontal y en JPG/PNG se ve bien en todos los correos.</p>
              </div>
            )
          )}
          {errorImg && <p className="text-bordeaux">{errorImg}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className={label}>Texto del botón</span>
            <input name="ctaTexto" value={d.ctaTexto} onChange={(e) => set("ctaTexto", e.target.value)} maxLength={40} disabled={bloqueada} className={inputCls} />
          </label>
          <label className="flex flex-col gap-2">
            <span className={label}>Link del botón</span>
            <input name="ctaUrl" value={d.ctaUrl} onChange={(e) => set("ctaUrl", e.target.value)} placeholder="/productos o https://…" disabled={bloqueada} className={inputCls} />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className={label}>¿A quién se lo mandamos?</span>
          <select name="segmento" value={d.segmento} onChange={(e) => set("segmento", e.target.value as Segmento)} disabled={bloqueada} className={inputCls}>
            {SEGMENTOS.map((s) => (
              <option key={s.v} value={s.v}>
                {s.l} ({conteos[s.v] ?? 0})
              </option>
            ))}
          </select>
          {segmento && <span className="text-[length:var(--text-step--1)] text-muted">{segmento.ayuda}</span>}
        </label>

        {!bloqueada && (
          <div className="flex flex-wrap items-center gap-4">
            <PanelButton type="submit" disabled={pendiente || subiendo}>
              {pendiente ? "Guardando…" : id ? "Guardar cambios" : "Guardar borrador"}
            </PanelButton>
            {estado && <p role="status" className={estado.ok ? "text-botanical" : "text-bordeaux"}>{estado.mensaje}</p>}
          </div>
        )}
      </form>

      {/* Vista previa en vivo */}
      <div className="flex flex-col gap-3 xl:sticky xl:top-6 xl:self-start">
        <div className="flex items-center justify-between">
          <span className={label}>Vista previa</span>
          <div className="flex gap-1 rounded-full border border-line bg-cloud p-1">
            {(["escritorio", "celular"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVista(v)}
                aria-pressed={vista === v}
                className={`rounded-full px-3 py-1 text-[length:var(--text-step--1)] capitalize ${vista === v ? "bg-ink text-bone" : "text-muted"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-[var(--radius-md)] border border-line bg-cloud px-4 py-3">
          <p className="truncate font-medium text-ink">{d.asunto.replace(/\{nombre\},?\s?/g, "Flor, ") || "Asunto"}</p>
          <p className="truncate text-[length:var(--text-step--1)] text-muted">{d.preheader || "Texto de vista previa"}</p>
        </div>
        <div className="flex justify-center overflow-hidden rounded-[var(--radius-lg)] border border-line bg-bone">
          <iframe
            title="Vista previa del mail"
            srcDoc={html}
            sandbox=""
            className={`h-[720px] bg-bone transition-[width] ${vista === "celular" ? "w-[375px]" : "w-full"}`}
          />
        </div>
      </div>
    </div>
  );
}
