"use client";

import { useState } from "react";
import { borrarCampana, duplicarCampana, enviarCampana, enviarPrueba, guardarCampana } from "@/modules/newsletter/actions";
import { SEGMENTOS, type DatosCampana } from "@/content/newsletter";
import { PanelButton } from "@/components/panel/PanelButton";
import { useAccion } from "@/components/panel/Toast";

/**
 * Probar, enviar (con confirmación en dos pasos), duplicar y borrar.
 * P-02: si hay cambios sin guardar, Prueba y Enviar GUARDAN PRIMERO, así lo
 * que sale es exactamente lo que Flor está viendo (y al grupo que eligió).
 */
export function AccionesCampana({
  id,
  borrador,
  esAdmin,
  datos,
  cambios,
  conteos,
  onGuardado,
}: {
  id: string;
  borrador: boolean;
  esAdmin: boolean;
  datos: DatosCampana;
  cambios: boolean;
  conteos: Record<string, number>;
  onGuardado: () => void;
}) {
  const [pendiente, correr] = useAccion();
  const [confirmar, setConfirmar] = useState<"enviar" | "borrar" | null>(null);
  const destinatarios = conteos[datos.segmento] ?? 0;
  const segmento = SEGMENTOS.find((s) => s.v === datos.segmento)?.l ?? datos.segmento;

  const guardarPrimero = async () => {
    if (!cambios) return null;
    const fd = new FormData();
    for (const [k, v] of Object.entries(datos)) fd.set(k, String(v ?? ""));
    const r = await guardarCampana(id, null, fd);
    if (r?.ok) onGuardado();
    return r;
  };

  const conGuardado = (f: () => Promise<{ ok: boolean; mensaje: string }>) =>
    correr(async () => {
      const g = await guardarPrimero();
      if (g && !g.ok) return { ok: false, mensaje: `No se guardó: ${g.mensaje}` };
      return f();
    });

  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-cloud p-5">
      {borrador && cambios && (
        <p className="text-[length:var(--text-step--1)] text-ink">
          Tenés cambios sin guardar: la prueba y el envío los guardan antes de salir.
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {borrador && (
          <PanelButton variant="outline" disabled={pendiente} onClick={() => conGuardado(() => enviarPrueba(id))}>
            {cambios ? "Guardar y enviarme una prueba" : "Enviarme una prueba"}
          </PanelButton>
        )}
        {borrador && esAdmin && confirmar !== "enviar" && (
          <PanelButton disabled={pendiente || destinatarios === 0} onClick={() => setConfirmar("enviar")}>
            Enviar a {destinatarios} persona{destinatarios === 1 ? "" : "s"}
          </PanelButton>
        )}
        <PanelButton variant="ghost" disabled={pendiente} onClick={() => correr(() => duplicarCampana(id))}>
          Duplicar
        </PanelButton>
        {borrador && esAdmin && (
          <PanelButton variant="ghost" disabled={pendiente} onClick={() => setConfirmar("borrar")}>
            Borrar
          </PanelButton>
        )}
      </div>

      {confirmar === "enviar" && (
        <div role="alertdialog" aria-label="Confirmar envío" className="rounded-[var(--radius-md)] border border-champagne/60 bg-champagne/10 p-4">
          <p className="text-ink">
            Se va a mandar a <strong>{destinatarios}</strong> persona{destinatarios === 1 ? "" : "s"} ({segmento}).
            {cambios ? " Primero guardamos tus cambios." : ""} Una vez enviada no se puede deshacer. ¿Ya te mandaste la prueba y la revisaste?
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <PanelButton
              disabled={pendiente}
              onClick={() =>
                conGuardado(async () => {
                  const r = await enviarCampana(id);
                  setConfirmar(null);
                  return r;
                })
              }
            >
              {pendiente ? "Enviando…" : "Sí, enviar ahora"}
            </PanelButton>
            <PanelButton variant="ghost" disabled={pendiente} onClick={() => setConfirmar(null)}>
              Cancelar
            </PanelButton>
          </div>
        </div>
      )}

      {confirmar === "borrar" && (
        <div role="alertdialog" aria-label="Confirmar borrado" className="rounded-[var(--radius-md)] border border-bordeaux/30 bg-bordeaux/5 p-4">
          <p className="text-ink">¿Borrar este borrador? No se puede recuperar.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <PanelButton disabled={pendiente} onClick={() => correr(() => borrarCampana(id))} className="!bg-bordeaux">
              {pendiente ? "Borrando…" : "Sí, borrar"}
            </PanelButton>
            <PanelButton variant="ghost" disabled={pendiente} onClick={() => setConfirmar(null)}>
              Cancelar
            </PanelButton>
          </div>
        </div>
      )}

      {borrador && !esAdmin && (
        <p className="text-[length:var(--text-step--1)] text-muted">Solo una administradora puede hacer el envío final.</p>
      )}
    </div>
  );
}

/** S-27: la campaña quedó trabada en "Enviando" (la función se cortó): retomar. */
export function RetomarEnvio({ id }: { id: string }) {
  const [pendiente, correr] = useAccion();
  return (
    <div role="alert" className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-bordeaux/30 bg-bordeaux/5 p-4">
      <p className="text-ink">
        Este envío quedó cortado a la mitad. Podés retomarlo: se vuelve a mandar a todo el grupo (algunas personas pueden recibirlo dos veces).
      </p>
      <div>
        <PanelButton disabled={pendiente} onClick={() => correr(() => enviarCampana(id))}>
          {pendiente ? "Enviando…" : "Retomar el envío"}
        </PanelButton>
      </div>
    </div>
  );
}
