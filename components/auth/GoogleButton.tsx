import { ingresarConGoogle } from "@/lib/auth/actions";

/** Botón "Continuar con Google" (form + Server Action: funciona sin JS). */
export function GoogleButton({ volver, tone = "light" }: { volver: string; tone?: "light" | "dark" }) {
  return (
    <form action={ingresarConGoogle.bind(null, volver)}>
      <button
        type="submit"
        className={`flex min-h-13 w-full items-center justify-center gap-3 rounded-full px-6 text-[0.8rem] font-medium uppercase tracking-[0.12em] transition-colors duration-300 ${
          tone === "dark" ? "bg-ink text-bone hover:bg-bordeaux" : "border border-ink/20 bg-white text-ink hover:border-ink/50"
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.7 2.3 2.4 6.6 2.4 11.9S6.7 21.5 12 21.5c6.9 0 9.2-4.9 9.2-7.4 0-.5 0-.9-.1-1.3H12z" />
        </svg>
        Continuar con Google
      </button>
    </form>
  );
}
