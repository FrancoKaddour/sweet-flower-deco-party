"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PanelButton } from "@/components/panel/PanelButton";

// Formulario de login — SOLO UI mock. No valida credenciales ni crea sesión:
// al enviar, simula el ingreso y navega a /panel. Inputs con <label> reales,
// autocompletado correcto y foco visible (champagne global).
//
// 🔌 GONZALO: reemplazá el onSubmit mock por payload.login({ email, password }).
// En éxito, redirigí a /panel; en error, mostrá el mensaje bajo el form.
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 🔌 GONZALO: acá va la llamada real de auth. Por ahora entramos directo.
    router.push("/panel");
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="login-email"
          className="text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-muted"
        >
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vos@sweetflowers.test"
          className="min-h-11 rounded-[var(--radius-sm)] border border-line bg-bone px-4 text-[length:var(--text-step-0)] text-ink placeholder:text-muted focus:border-champagne focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="login-password"
          className="text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] text-muted"
        >
          Contraseña
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="min-h-11 rounded-[var(--radius-sm)] border border-line bg-bone px-4 text-[length:var(--text-step-0)] text-ink placeholder:text-muted focus:border-champagne focus:outline-none"
        />
      </div>

      <PanelButton type="submit" variant="solid" className="mt-2 w-full">
        Ingresar
      </PanelButton>

      {/* 🔌 GONZALO: flujo de recupero de contraseña (payload.forgotPassword →
          email con token → payload.resetPassword). Hoy es placeholder. */}
      <a
        href="/panel/login"
        title="Pendiente: recupero de contraseña"
        className="text-center text-[length:var(--text-step--1)] text-muted underline-offset-2 hover:text-ink hover:underline"
      >
        ¿Olvidaste tu contraseña?
      </a>
    </form>
  );
}
