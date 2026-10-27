"use client";

import { useActionState, useState } from "react";
import { guardarProducto } from "@/modules/catalog/actions";
import { parsePrecio, type EstadoForm } from "@/modules/catalog/schemas";
import { formatARS, type VarianteProducto } from "@/modules/catalog/types";
import { Campo, Interruptor, inputCls } from "./campos";

type Valores = {
  nombre: string;
  slug: string;
  categoryId: string;
  precio: number | null;
  descripcion: string;
  medidas: string | null;
  variantes: VarianteProducto[];
  destacado: boolean;
  visible: boolean;
};

/** "Se va a ver: $ 15.000" debajo del campo, en vivo (P-11). */
function vistaPrecio(texto: string): { ok: boolean; texto: string } {
  const p = parsePrecio(texto);
  if (!p.ok) return { ok: false, texto: p.error };
  return { ok: true, texto: p.valor == null ? "Se va a ver: Consultar precio" : `Se va a ver: ${formatARS(p.valor)}` };
}

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
  const [precio, setPrecio] = useState(valores?.precio != null ? String(valores.precio) : "");
  const [variantes, setVariantes] = useState<{ etiqueta: string; precio: string }[]>(
    (valores?.variantes ?? []).map((v) => ({ etiqueta: v.etiqueta, precio: v.precio != null ? String(v.precio) : "" })),
  );
  const e = estado.errores ?? {};
  const err = (k: string) => (e[k] ? { "aria-invalid": true, "aria-describedby": `${k}-error` } : {});
  const vp = vistaPrecio(precio);
  const preciosVar = variantes.map((v) => parsePrecio(v.precio)).filter((p) => p.ok && p.valor != null).map((p) => (p as { valor: number }).valor);
  const precioPorVariantes = preciosVar.length > 0;

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
        <div className="flex flex-col gap-2">
          <label htmlFor="precio" className="text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-muted">
            Precio (transferencia)
          </label>
          <input
            id="precio"
            name="precio"
            inputMode="numeric"
            placeholder="Ej: 15.000"
            value={precio}
            onChange={(ev) => setPrecio(ev.target.value)}
            disabled={precioPorVariantes}
            aria-invalid={!vp.ok || Boolean(e.precio)}
            aria-describedby="precio-vista"
            className={`${inputCls} disabled:opacity-60`}
          />
          <p id="precio-vista" aria-live="polite" className={`text-[length:var(--text-step--1)] ${!vp.ok || e.precio ? "text-bordeaux" : "text-muted"}`}>
            {precioPorVariantes
              ? `Lo ponen las variantes: se va a ver “Desde ${formatARS(Math.min(...preciosVar))}”.`
              : e.precio && vp.ok
                ? e.precio
                : vp.texto}
          </p>
        </div>
        <Campo id="slug" label="Dirección en el sitio" ayuda="Lo que va después de /productos/… Se arma sola con el nombre si la dejás vacía." error={e.slug}>
          <input id="slug" name="slug" defaultValue={valores?.slug} placeholder="arco-extensible" className={inputCls} {...err("slug")} />
        </Campo>
      </div>

      <Campo id="descripcion" label="Descripción" error={e.descripcion}>
        <textarea id="descripcion" name="descripcion" rows={5} defaultValue={valores?.descripcion} className={`${inputCls} resize-y`} />
      </Campo>

      <Campo id="medidas" label="Medidas" ayuda="Ej: 2,10 m alto × 1,50 m ancho" error={e.medidas}>
        <input id="medidas" name="medidas" defaultValue={valores?.medidas ?? ""} className={inputCls} />
      </Campo>

      <EditorVariantes filas={variantes} onChange={setVariantes} error={e.variantes} />
      <input type="hidden" name="variantes" value={JSON.stringify(variantes)} />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {id ? (
          <Interruptor name="visible" label="Visible en el sitio" defaultChecked={valores?.visible ?? false} ayuda="Si lo apagás, queda guardado pero no se muestra." />
        ) : (
          <p className="rounded-[var(--radius-md)] border border-line bg-cloud px-4 py-3 text-[length:var(--text-step--1)] leading-relaxed text-muted">
            Se crea <strong className="text-ink">oculto</strong>: subile al menos una foto y tocá “Publicar”.
          </p>
        )}
        <Interruptor name="destacado" label="Destacado" defaultChecked={valores?.destacado} ayuda="Aparece primero y en 'Lo más pedido'." />
      </div>

      {/* Barra de guardado: en celular queda pegada abajo (al alcance del pulgar). */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-6 max-md:sticky max-md:bottom-0 max-md:z-10 max-md:-mx-4 max-md:border-t max-md:border-line max-md:bg-bone/92 max-md:px-4 max-md:pt-3 max-md:pb-[max(0.75rem,env(safe-area-inset-bottom))] max-md:backdrop-blur-md">
        <button
          type="submit"
          disabled={pendiente}
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-pill)] bg-ink px-6 max-md:min-h-12 max-md:w-full text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-bone disabled:opacity-50"
        >
          {pendiente ? "Guardando…" : id ? "Guardar cambios" : "Crear producto"}
        </button>
        {estado.mensaje && (
          <p role={estado.ok ? "status" : "alert"} className={`text-[length:var(--text-step--1)] max-md:w-full max-md:text-center ${estado.ok ? "text-ink" : "text-bordeaux"}`}>
            {estado.mensaje}
          </p>
        )}
      </div>
    </form>
  );
}

/**
 * Variantes (formato de modules/catalog/types.ts): filas etiqueta + precio,
 * agregar / quitar / reordenar. La primera es la que aparece elegida.
 */
function EditorVariantes({
  filas,
  onChange,
  error,
}: {
  filas: { etiqueta: string; precio: string }[];
  onChange: (f: { etiqueta: string; precio: string }[]) => void;
  error?: string;
}) {
  const set = (i: number, k: "etiqueta" | "precio", v: string) => onChange(filas.map((f, j) => (j === i ? { ...f, [k]: v } : f)));
  const mover = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= filas.length) return;
    const c = [...filas];
    [c[i], c[j]] = [c[j], c[i]];
    onChange(c);
  };
  const btn = "grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] text-ink hover:bg-bone disabled:opacity-25";
  return (
    <fieldset className="flex flex-col gap-3" aria-describedby={error ? "variantes-error" : "variantes-ayuda"}>
      <legend className="text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-muted">Variantes</legend>
      <p id="variantes-ayuda" className="text-[length:var(--text-step--1)] text-muted">
        Medidas, pintado o sin pintar, combos… Cada una con su precio (vacío = a consultar). La primera aparece elegida en la ficha.
      </p>
      {filas.length > 0 && (
        <ol className="flex flex-col gap-2">
          {filas.map((f, i) => {
            const p = parsePrecio(f.precio);
            return (
              <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 rounded-[var(--radius-md)] border border-line bg-cloud p-2 sm:grid-cols-[minmax(0,1fr)_10rem_auto]">
                <input
                  value={f.etiqueta}
                  onChange={(e) => set(i, "etiqueta", e.target.value)}
                  maxLength={60}
                  placeholder="Ej: 2,40 × 1,80 m"
                  aria-label={`Variante ${i + 1}: nombre`}
                  className={`${inputCls} max-sm:col-span-2`}
                />
                <span className="flex flex-col gap-1">
                  <input
                    value={f.precio}
                    onChange={(e) => set(i, "precio", e.target.value)}
                    inputMode="numeric"
                    placeholder="A consultar"
                    aria-label={`Variante ${i + 1}: precio`}
                    aria-invalid={!p.ok}
                    className={`${inputCls} text-right tabular-nums`}
                  />
                  <span className={`px-1 text-right text-[0.72rem] ${p.ok ? "text-muted" : "text-bordeaux"}`}>
                    {p.ok ? (p.valor != null ? formatARS(p.valor) : "a consultar") : "Sin centavos"}
                  </span>
                </span>
                <span className="flex">
                  <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} aria-label={`Subir variante ${i + 1}`} className={btn}>
                    ↑
                  </button>
                  <button type="button" onClick={() => mover(i, 1)} disabled={i === filas.length - 1} aria-label={`Bajar variante ${i + 1}`} className={btn}>
                    ↓
                  </button>
                  <button type="button" onClick={() => onChange(filas.filter((_, j) => j !== i))} aria-label={`Quitar variante ${i + 1}`} className={`${btn} text-bordeaux`}>
                    ×
                  </button>
                </span>
              </li>
            );
          })}
        </ol>
      )}
      <div>
        <button
          type="button"
          disabled={filas.length >= 30}
          onClick={() => onChange([...filas, { etiqueta: "", precio: "" }])}
          className="inline-flex min-h-11 items-center rounded-[var(--radius-pill)] border border-dashed border-ink/30 px-5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-ink hover:border-ink/60 disabled:opacity-40 max-sm:w-full max-sm:justify-center"
        >
          + Agregar variante
        </button>
      </div>
      {error && (
        <p id="variantes-error" role="alert" className="text-[length:var(--text-step--1)] text-bordeaux">
          {error}
        </p>
      )}
    </fieldset>
  );
}
