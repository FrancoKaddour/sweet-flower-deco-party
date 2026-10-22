import Link from "next/link";
import { envioHabilitado } from "@/lib/email/enviar";

export function TabsNewsletter({ activa }: { activa: "campanas" | "suscriptores" }) {
  const tabs = [
    { id: "campanas", l: "Campañas", href: "/panel/newsletter" },
    { id: "suscriptores", l: "Suscriptores", href: "/panel/newsletter/suscriptores" },
  ] as const;
  return (
    <nav aria-label="Secciones del newsletter" className="flex gap-2">
      {tabs.map((t) => (
        <Link
          key={t.id}
          href={t.href}
          aria-current={activa === t.id ? "page" : undefined}
          className={`inline-flex min-h-10 items-center rounded-[var(--radius-pill)] border px-5 text-[length:var(--text-step--1)] font-medium uppercase tracking-[0.08em] transition-colors ${
            activa === t.id ? "border-ink bg-ink text-bone" : "border-line bg-cloud text-muted hover:text-ink"
          }`}
        >
          {t.l}
        </Link>
      ))}
    </nav>
  );
}

/** Aviso mientras no esté conectado el dominio de envío. */
export function AvisoEnvio() {
  if (envioHabilitado()) return null;
  return (
    <p className="rounded-[var(--radius-md)] border border-champagne/50 bg-champagne/10 px-4 py-3 text-[length:var(--text-step--1)] leading-relaxed text-ink">
      <strong>Modo prueba:</strong> la gente ya se puede suscribir y ve su código en pantalla, y podés armar campañas, pero los
      mails todavía no salen. Se activan cuando esté conectado el dominio de envío (ver docs/NEWSLETTER.md).
    </p>
  );
}
