"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Paginacion } from "@/components/ui/Paginacion";
import { track } from "@/lib/analytics";
import { rangoDePrecio, type Producto } from "@/modules/catalog/types";

/**
 * Grilla de una categoría (E-06): buscador por nombre, chips de tipo (salen
 * de los nombres), orden y paginación de a 24. Todo en el navegador (son
 * ~130 piezas) y reflejado en la URL (?q=&tipo=&orden=&pagina=), así "Atrás"
 * desde una ficha vuelve a la misma página y el link se puede compartir.
 */
const POR_PAGINA = 24;

const TIPOS: { id: string; label: string; re: RegExp }[] = [
  { id: "arcos", label: "Arcos", re: /\barcos?\b|extensible/i },
  { id: "arcadas", label: "Arcadas", re: /arcada/i },
  { id: "aros", label: "Aros", re: /\baros?\b/i },
  { id: "columnas", label: "Columnas", re: /columna/i },
  { id: "mesas", label: "Mesas", re: /\bmesa|mesitas/i },
  { id: "sillones", label: "Sillones", re: /sill[oó]n/i },
  { id: "paneles", label: "Paneles", re: /panel/i },
  { id: "cilindros", label: "Cilindros", re: /cilindro/i },
  { id: "estanterias", label: "Estanterías", re: /estanter/i },
  { id: "alzadas", label: "Alzadas", re: /alzada/i },
  { id: "torres", label: "Torres", re: /\btorre/i },
  { id: "bases", label: "Bases", re: /\bbases?\b/i },
  { id: "fundas", label: "Fundas", re: /funda/i },
];

type Orden = "destacados" | "menor" | "mayor";

const normalizar = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const minimo = (p: Producto) => rangoDePrecio(p)?.min ?? null;

export function GrillaPaginada({ productos, categoria }: { productos: Producto[]; categoria?: string }) {
  const [pagina, setPagina] = useState(1);
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState("");
  const [orden, setOrden] = useState<Orden>("destacados");
  const ancla = useRef<HTMLDivElement>(null);
  const uid = useId();
  const listo = useRef(false);

  // Estado inicial desde la URL (después del primer render: sin desajuste SSR).
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const u = new URLSearchParams(location.search);
      setQ(u.get("q") ?? "");
      setTipo(u.get("tipo") ?? "");
      const o = u.get("orden");
      if (o === "menor" || o === "mayor") setOrden(o);
      const n = Number(u.get("pagina"));
      if (Number.isInteger(n) && n > 1) setPagina(n);
      listo.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Estado → URL (replaceState: no ensucia el historial).
  useEffect(() => {
    if (!listo.current) return;
    const u = new URL(location.href);
    const set = (k: string, v: string) => (v ? u.searchParams.set(k, v) : u.searchParams.delete(k));
    set("q", q.trim());
    set("tipo", tipo);
    set("orden", orden === "destacados" ? "" : orden);
    set("pagina", pagina > 1 ? String(pagina) : "");
    history.replaceState(history.state, "", u.pathname + u.search + u.hash);
  }, [q, tipo, orden, pagina]);

  // Medición de búsquedas (con pausa: no un evento por tecla).
  useEffect(() => {
    const t = q.trim();
    if (t.length < 2) return;
    const id = window.setTimeout(() => track("search", { termino: t.slice(0, 60), categoria }), 900);
    return () => window.clearTimeout(id);
  }, [q, categoria]);

  const tipos = useMemo(() => {
    const conConteo = TIPOS.map((t) => ({ ...t, n: productos.filter((p) => t.re.test(p.nombre)).length }));
    const utiles = conConteo.filter((t) => t.n >= 2 && t.n < productos.length);
    return utiles.length >= 2 ? utiles : [];
  }, [productos]);

  const filtrados = useMemo(() => {
    const termino = normalizar(q.trim());
    const re = TIPOS.find((t) => t.id === tipo)?.re;
    let lista = productos.filter(
      (p) => (!re || re.test(p.nombre)) && (!termino || normalizar(`${p.nombre} ${p.descripcion ?? ""}`).includes(termino)),
    );
    if (orden !== "destacados") {
      const dir = orden === "menor" ? 1 : -1;
      lista = [...lista].sort((a, b) => {
        const pa = minimo(a);
        const pb = minimo(b);
        if (pa == null) return pb == null ? 0 : 1; // "a cotizar" siempre al final
        if (pb == null) return -1;
        return (pa - pb) * dir;
      });
    }
    return lista;
  }, [productos, q, tipo, orden]);

  const total = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const actual = Math.min(pagina, total);
  const visibles = filtrados.slice((actual - 1) * POR_PAGINA, actual * POR_PAGINA);

  const ir = (n: number) => {
    setPagina(n);
    ancla.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const chip =
    "inline-flex min-h-10 items-center rounded-full border px-4 text-[length:var(--text-step--1)] transition-colors";

  return (
    <div ref={ancla} className="scroll-mt-28">
      <div className="mb-10 flex flex-col gap-5 border-b border-line pb-8 md:mb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:max-w-sm">
            <label htmlFor={`${uid}-q`} className="block text-[length:var(--text-step--1)] text-ink/70">
              Buscar por nombre
            </label>
            <input
              id={`${uid}-q`}
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPagina(1);
              }}
              autoComplete="off"
              className="mt-1 w-full border-b border-ink/30 bg-transparent py-2 text-[length:var(--text-step-0)] text-ink focus:border-ink focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor={`${uid}-orden`} className="text-[length:var(--text-step--1)] text-ink/70">
              Ordenar
            </label>
            <select
              id={`${uid}-orden`}
              value={orden}
              onChange={(e) => {
                setOrden(e.target.value as Orden);
                setPagina(1);
              }}
              className="min-h-11 rounded-full border border-ink/25 bg-bone px-4 text-[length:var(--text-step--1)] text-ink focus:border-ink focus:outline-none"
            >
              <option value="destacados">Destacados</option>
              <option value="menor">Menor precio</option>
              <option value="mayor">Mayor precio</option>
            </select>
          </div>
        </div>

        {tipos.length > 0 && (
          <div role="group" aria-label="Filtrar por tipo" className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={tipo === ""}
              onClick={() => {
                setTipo("");
                setPagina(1);
              }}
              className={`${chip} ${tipo === "" ? "border-ink bg-ink text-bone" : "border-ink/20 text-ink/80 hover:border-ink"}`}
            >
              Todo
            </button>
            {tipos.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={tipo === t.id}
                onClick={() => {
                  setTipo(tipo === t.id ? "" : t.id);
                  setPagina(1);
                }}
                className={`${chip} ${tipo === t.id ? "border-ink bg-ink text-bone" : "border-ink/20 text-ink/80 hover:border-ink"}`}
              >
                {t.label}
                <span className="ml-1.5 tabular-nums opacity-60">{t.n}</span>
              </button>
            ))}
          </div>
        )}

        <p role="status" className="text-[length:var(--text-step--1)] text-ink/65">
          {filtrados.length === productos.length
            ? `${productos.length} productos`
            : `${filtrados.length} de ${productos.length} productos`}
        </p>
      </div>

      {visibles.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {visibles.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="font-display text-[length:var(--text-step-2)] font-bold uppercase">Sin resultados</p>
          <p className="mx-auto mt-3 max-w-[44ch] text-ink/70">
            No encontramos {q.trim() ? `“${q.trim()}”` : "piezas con ese filtro"}. Probá con otra palabra o pedinos la
            pieza por WhatsApp: muchas las hacemos a medida.
          </p>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setTipo("");
              setPagina(1);
            }}
            className="mt-6 inline-flex min-h-11 items-center text-[0.75rem] font-medium uppercase tracking-[0.12em] underline underline-offset-4"
          >
            Ver todo
          </button>
        </div>
      )}

      {total > 1 && (
        <div className="mt-16 flex flex-col items-center gap-3">
          <Paginacion pagina={actual} total={total} onChange={ir} />
          <p className="text-[length:var(--text-step--1)] text-ink/60">
            {(actual - 1) * POR_PAGINA + 1}–{Math.min(actual * POR_PAGINA, filtrados.length)} de {filtrados.length} productos
          </p>
        </div>
      )}
    </div>
  );
}
