"use client";

import { useActionState } from "react";
import { guardarCategoria } from "@/modules/catalog/actions";
import type { EstadoForm } from "@/modules/catalog/schemas";
import { Campo, Interruptor, inputCls } from "./campos";

type Valores = {
  nombre: string;
  slug: string;
  linea: "catering" | "ambientacion";
  tagline: string;
  descripcion: string;
  incluye: string[];
  imagen: string | null;
  visible: boolean;
};

export function CategoriaForm({ id, valores }: { id: string | null; valores?: Valores }) {
  const [estado, accion, pendiente] = useActionState<EstadoForm, FormData>(guardarCategoria.bind(null, id), {});
  const e = estado.errores ?? {};
  const k = id ?? "nueva";
  return (
    <form action={accion} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Campo id={`${k}-nombre`} label="Nombre" error={e.nombre}>
          <input id={`${k}-nombre`} name="nombre" defaultValue={valores?.nombre} className={inputCls} />
        </Campo>
        <Campo id={`${k}-slug`} label="Enlace (slug)" ayuda="Cambiarlo rompe los links ya compartidos." error={e.slug}>
          <input id={`${k}-slug`} name="slug" defaultValue={valores?.slug} className={inputCls} />
        </Campo>
        <Campo id={`${k}-linea`} label="Línea">
          <select id={`${k}-linea`} name="linea" defaultValue={valores?.linea ?? "ambientacion"} className={inputCls}>
            <option value="catering">Catering</option>
            <option value="ambientacion">Ambientación</option>
          </select>
        </Campo>
      </div>
      <Campo id={`${k}-tagline`} label="Frase corta" error={e.tagline}>
        <input id={`${k}-tagline`} name="tagline" defaultValue={valores?.tagline} className={inputCls} />
      </Campo>
      <Campo id={`${k}-descripcion`} label="Descripción">
        <textarea id={`${k}-descripcion`} name="descripcion" rows={3} defaultValue={valores?.descripcion} className={`${inputCls} resize-y`} />
      </Campo>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Campo id={`${k}-incluye`} label="Qué vas a encontrar" ayuda="Separado por coma (máx. 8).">
          <input id={`${k}-incluye`} name="incluye" defaultValue={valores?.incluye.join(", ")} className={inputCls} />
        </Campo>
        <Campo id={`${k}-imagen`} label="Foto de portada (URL)" ayuda="Pegá la URL de una foto de un producto.">
          <input id={`${k}-imagen`} name="imagen" defaultValue={valores?.imagen ?? ""} className={inputCls} />
        </Campo>
      </div>
      <Interruptor name="visible" label="Visible en el sitio" defaultChecked={valores?.visible ?? true} />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="submit"
          disabled={pendiente}
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-pill)] bg-ink px-6 max-sm:w-full text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-bone disabled:opacity-50"
        >
          {pendiente ? "Guardando…" : id ? "Guardar" : "Crear categoría"}
        </button>
        {estado.mensaje && (
          <p role="status" className={estado.ok ? "text-botanical" : "text-bordeaux"}>
            {estado.mensaje}
          </p>
        )}
      </div>
    </form>
  );
}
