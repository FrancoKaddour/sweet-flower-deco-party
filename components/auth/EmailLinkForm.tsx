import { ingresarConEmail } from "@/lib/auth/actions";

/** Ingreso sin contraseña: llega un link al email (requiere Resend + dominio). */
export function EmailLinkForm({ volver }: { volver: string }) {
  return (
    <form action={ingresarConEmail.bind(null, volver)} className="flex flex-col gap-3">
      <label htmlFor="ingreso-email" className="text-[0.7rem] uppercase tracking-[0.16em] text-ink/60">
        O con tu email
      </label>
      <input
        id="ingreso-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="tu@email.com"
        className="w-full border-b border-ink/25 bg-transparent py-3 text-[length:var(--text-step-0)] text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none"
      />
      <button
        type="submit"
        className="mt-2 flex min-h-13 w-full items-center justify-center rounded-full bg-ink px-6 text-[0.8rem] font-medium uppercase tracking-[0.12em] text-bone transition-colors hover:bg-bordeaux"
      >
        Enviarme el link
      </button>
    </form>
  );
}
