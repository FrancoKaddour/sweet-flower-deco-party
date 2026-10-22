"use client";

import { useState, useTransition } from "react";
import { borrarCampana, duplicarCampana, enviarCampana, enviarPrueba } from "@/modules/newsletter/actions";
import { PanelButton } from "@/components/panel/PanelButton";

/** Probar, enviar (con confirmación en dos pasos), duplicar y borrar. */
export function AccionesCampana({
  id,
  borrador,
  destinatarios,
  segmento,
  esAdmin,
}: {
  id: string;
  borrador: boolean;
  destinatarios: number;
  segmento: string;
  esAdmin: boolean;
}) {
  const [pendiente, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; mensaje: string } | null>(null);
  const [confirmar, setConfirmar] = useState(false);

  const correr = (f: () => Promise<{ ok: boolean; mensaje: string } | void>) =>
    start(async () => {
      const r = await f();
      if (r) setMsg(r);
    });

  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-line bg-cloud p-5">
      <div className="flex flex-wrap items-center gap-3">
        {borrador && (
          <PanelButton variant="outline" disabled={pendiente} onClick={() => correr(() => enviarPrueba(id))}>
            Enviarme una prueba
          </PanelButton>
        )}
        {borrador && esAdmin && !confirmar && (
          <PanelButton disabled={pendiente || destinatarios === 0} onClick={() => setConfirmar(true)}>
            Enviar a {destinatarios} persona{destinatarios === 1 ? "" : "s"}
          </PanelButton>
        )}
        <PanelButton variant="ghost" disabled={pendiente} onClick={() => correr(() => duplicarCampana(id))}>
          Duplicar
        </PanelButton>
        {borrador && esAdmin && (
          <PanelButton variant="ghost" disabled={pendiente} onClick={() => correr(() => borrarCampana(id))}>
            Borrar
          </PanelButton>
        )}
      </div>

      {confirmar && (
        <div role="alertdialog" aria-label="Confirmar envío" className="rounded-[var(--radius-md)] border border-champagne/60 bg-champagne/10 p-4">
          <p className="text-ink">
            Se va a mandar a <strong>{destinatarios}</strong> persona{destinatarios === 1 ? "" : "s"} ({segmento}). Una vez enviada no se puede deshacer.
            ¿Ya te mandaste la prueba y la revisaste?
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <PanelButton
              disabled={pendiente}
              onClick={() =>
                correr(async () => {
                  const r = await enviarCampana(id);
                  setConfirmar(false);
                  return r;
                })
              }
            >
              {pendiente ? "Enviando…" : "Sí, enviar ahora"}
            </PanelButton>
            <PanelButton variant="ghost" disabled={pendiente} onClick={() => setConfirmar(false)}>
              Cancelar
            </PanelButton>
          </div>
        </div>
      )}

      {borrador && !esAdmin && (
        <p className="text-[length:var(--text-step--1)] text-muted">Solo una administradora puede hacer el envío final.</p>
      )}
      {msg && (
        <p role="status" className={msg.ok ? "text-botanical" : "text-bordeaux"}>
          {msg.mensaje}
        </p>
      )}
    </div>
  );
}
