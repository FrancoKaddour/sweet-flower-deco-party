import type { Metadata } from "next";
import { LoginForm } from "@/components/panel/LoginForm";
import { PlugHint } from "@/components/panel/PlugHint";

export const metadata: Metadata = {
  title: "Ingresar",
};

// Login del panel — pantalla centrada, con la marca. SOLO UI (sin auth real):
// la autenticación la aporta Payload (colección Users). El <main> propio hace
// que el skip-link funcione también acá.
export default function LoginPage() {
  return (
    <main
      id="panel-main"
      tabIndex={-1}
      className="flex min-h-dvh items-center justify-center bg-bone px-4 py-12"
    >
      <div className="w-full max-w-md">
        <div className="rounded-[var(--radius-lg)] border border-line bg-cloud p-8 sm:p-10">
          <div className="mb-8 text-center">
            <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.16em] text-muted">
              Centro de operaciones
            </p>
            <h1 className="mt-2 font-display text-[length:var(--text-step-3)] font-bold leading-none tracking-tight text-ink">
              Sweet&nbsp;Flowers
            </h1>
            <p className="mt-3 text-[length:var(--text-step-0)] text-muted">
              Ingresá para gestionar catálogo, ventas y comunidad.
            </p>
          </div>

          <LoginForm />
        </div>

        <div className="mt-6">
          <PlugHint coleccion="Users">
            La auth la aporta Payload (colección{" "}
            <code className="font-mono">Users</code>): reemplazá el submit mock
            por <code className="font-mono">payload.login()</code> y protegé{" "}
            <code className="font-mono">/panel</code> con un proxy que redirija a
            este login sin sesión. Ver skill <em>auth-review</em>.
          </PlugHint>
        </div>
      </div>
    </main>
  );
}
