"use client";

import { useActionState } from "react";
import { guardarProducto } from "@/modules/catalog/actions";
import type { EstadoForm } from "@/modules/catalog/schemas";
import { Campo, Interruptor, inputCls } from "./campos";

type Valores = {
  nombre: string;
  slug: string;
  categoryId: string;
  precio: number | null;
  descripcion: string;
  medidas: string | null;
  variantes: string[];
  destacado: boolean;
  visible: boolean;
};

/** Alta / edición de producto. Valida en el server (zod) y muestra los errores por campo. */
export function ProductoForm({
  id,
  valores,
  categorias,
}: {
  id: string | null;
  valores?: Valores;
  categorias: { id: string; nombre: string }[];
}) {
  const [estado, accion, pendiente] = useActionState<EstadoForm, FormData>(guardarProducto.bind(null, id), {});
  const e = estado.errores ?? {};
  const err = (k: string) => (e[k] ? { "aria-invalid": true, "aria-describedby": `${k}-error` } : {});

  return (
    <form action={accion} className="flex flex-col gap-6" noValidate>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Campo id="nombre" label="Nombre" error={e.nombre}>
          <input id="nombre" name="nombre" required defaultValue={valores?.nombre} className={inputCls} {...err("nombre")} />
        </Campo>
        <Campo id="categoryId" label="Categoría" error={e.categoryId}>
          <select id="categoryId" name="categoryId" defaultValue={valores?.categoryId ?? ""} className={inputCls} {...err("categoryId")}>
            <option value="" disabled>
              Elegí una categoría
            </option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <Campo id="precio" label="Precio (transferencia)" ayuda="En pesos, sin centavos. Vacío = 'a consultar'." error={e.precio}>
          <input
            id="precio"
            name="precio"
            inputMode="numeric"
            placeholder="Ej: 99000"
            defaultValue={valores?.precio ?? ""}
            className={inputCls}
            {...err("precio")}
          />
        </Campo>
        <Campo id="slug" label="Enlace (slug)" ayuda="Se arma solo con el nombre si lo dejás vacío." error={e.slug}>
          <input id="slug" name="slug" defaultValue={valores?.slug} placeholder="arco-extensible" className={inputCls} {...err("slug")} />
        </Campo>
      </div>

      <Campo id="descripcion" label="Descripción" error={e.descripcion}>
        <textarea id="descripcion" name="descripcion" rows={5} defaultValue={valores?.descripcion} className={`${inputCls} resize-y`} />
      </Campo>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Campo id="medidas" label="Medidas" ayuda="Ej: 2,10 m alto × 1,50 m ancho" error={e.medidas}>
          <input id="medidas" name="medidas" defaultValue={valores?.medidas ?? ""} className={inputCls} />
        </Campo>
        <Campo id="variantes" label="Variantes" ayuda="Separadas por coma: Blanco, Negro, Dorado" error={e.variantes}>
          <input id="variantes" name="variantes" defaultValue={valores?.variantes.join(", ")} className={inputCls} />
        </Campo>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Interruptor name="visible" label="Visible en el sitio" defaultChecked={valores?.visible ?? true} ayuda="Si lo apagás, queda guardado pero no se muestra." />
        <Interruptor name="destacado" label="Destacado" defaultChecked={valores?.destacado} ayuda="Aparece primero y en 'Lo más pedido'." />
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <button
          type="submit"
          disabled={pendiente}
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-pill)] bg-ink px-6 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-bone disabled:opacity-50"
        >
          {pendiente ? "Guardando…" : id ? "Guardar cambios" : "Crear producto"}
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
