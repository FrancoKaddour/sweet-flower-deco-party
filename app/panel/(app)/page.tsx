import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/panel/PageHeader";
import { PanelButton } from "@/components/panel/PanelButton";
import { PanelReveal } from "@/components/panel/PanelReveal";
import { SectionHeading } from "@/components/panel/SectionHeading";
import { ArrowLink } from "@/components/panel/ArrowLink";
import { SinBase } from "@/components/panel/SinBase";
import { hasDb } from "@/db";
import { requireStaff } from "@/lib/dal";
import { formatARS } from "@/modules/catalog/types";
import { resumenCatalogo } from "@/modules/catalog/admin";
import { resumenNegocio } from "@/modules/ventas/admin";
import { resumenClub } from "@/modules/newsletter/admin";
import { EVENT_CUPO, PASES } from "@/content/evento";

// Inicio del panel (P-06): los números del negocio, no los del catálogo.
// Todo sale de la base (nada de datos de ejemplo).

export const metadata: Metadata = { title: { absolute: "Inicio · Panel · Sweet Flowers" } };

function saludo() {
  const h = Number(
    new Intl.DateTimeFormat("es-AR", { hour: "numeric", hour12: false, timeZone: "America/Argentina/Buenos_Aires" }).format(new Date()),
  );
  if (h < 13) return "Buen día";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
}

/** "hace 3 días" / "hace 5 h" */
function hace(d: Date | null): string {
  if (!d) return "";
  const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600e3);
  if (h < 1) return "hace menos de una hora";
  if (h < 48) return `hace ${h} h`;
  return `hace ${Math.floor(h / 24)} días`;
}

const plural = (n: number, s: string, p = `${s}s`) => `${n} ${n === 1 ? s : p}`;

type Trozo = { texto: string; href?: string };

export default async function InicioPage() {
  const user = await requireStaff();
  const nombre = (user.name ?? user.email ?? "").split(" ")[0];

  const header = (
    <PageHeader
      seccion="Inicio"
      titulo={`${saludo()}${nombre ? `, ${nombre}` : ""}`}
      descripcion="Cómo viene el negocio hoy: pedidos, consultas, el Summit y el club. Tocá cualquier número para ver el detalle."
      accion={<PanelButton href="/panel/productos/nuevo">Nuevo producto</PanelButton>}
    />
  );

  if (!hasDb()) {
    return (
      <div className="flex flex-col gap-10">
        {header}
        <SinBase />
      </div>
    );
  }

  const [n, club, cat] = await Promise.all([resumenNegocio(), resumenClub().catch(() => null), resumenCatalogo()]);
  const s = n.summit;

  // Pulso del día (idea wow 4): una línea en lenguaje natural, cada pedazo lleva a su lista.
  const trozos: Trozo[] = [];
  trozos.push(
    n.pedidosHoy.n
      ? { texto: `Hoy entraron ${plural(n.pedidosHoy.n, "pedido")}${n.pedidosHoy.monto ? ` (≈ ${formatARS(n.pedidosHoy.monto)})` : ""}`, href: "/panel/pedidos" }
      : { texto: "Hoy todavía no entraron pedidos" },
  );
  if (n.consultas.masDe24h) trozos.push({ texto: `${plural(n.consultas.masDe24h, "consulta")} sin responder hace más de 24 h`, href: "/panel/consultas?estado=nueva" });
  else if (n.consultas.n) trozos.push({ texto: `${plural(n.consultas.n, "consulta")} para responder`, href: "/panel/consultas?estado=nueva" });
  const insHoy = PASES.filter((p) => n.inscriptosHoy[p.id]).map((p) => `${n.inscriptosHoy[p.id]} ${p.nombre.replace("Pase ", "")}`);
  if (insHoy.length) trozos.push({ texto: `inscriptos nuevos al Summit: ${insHoy.join(" y ")}`, href: "/panel/summit?estado=pago" });
  trozos.push({ texto: s.libres === 1 ? "queda 1 lugar" : `quedan ${s.libres} lugares`, href: "/panel/summit" });
  if (s.problemas) trozos.push({ texto: `${plural(s.problemas, "pago")} del Summit para revisar`, href: "/panel/summit?pago=problemas" });

  const kpis = [
    {
      n: String(n.pedidos7.n),
      l: "Pedidos · 7 días",
      a: n.pedidos7.monto ? `≈ ${formatARS(n.pedidos7.monto)} por transferencia` : "Sin montos (a cotizar)",
      href: "/panel/pedidos",
      fondo: "bg-blush",
    },
    {
      n: String(n.consultas.n),
      l: "Consultas sin responder",
      a: n.consultas.n ? `La más vieja: ${hace(n.consultas.masVieja)}` : "Nada pendiente.",
      href: "/panel/consultas?estado=nueva",
      fondo: "bg-sage",
    },
    {
      n: club ? `+${club.nuevos7}` : "—",
      l: "Club · 7 días",
      a: club ? `+${club.nuevos30} en 30 días · ${club.activos} en total` : "Sin datos del club.",
      href: "/panel/newsletter/suscriptores",
      fondo: "bg-sand",
    },
  ];

  const pendientes = [
    { n: cat.sinPrecio, label: "sin precio", ayuda: "Se muestran como “Consultar precio”.", href: "/panel/productos?estado=sin-precio" },
    { n: cat.sinFoto, label: "sin foto", ayuda: "Sin foto no venden: sumales al menos una.", href: "/panel/productos?estado=sin-foto" },
    { n: cat.ocultos, label: "ocultos", ayuda: "No aparecen en el sitio hasta que los publiques.", href: "/panel/productos?estado=ocultos" },
  ].filter((p) => p.n > 0);

  return (
    <div className="flex flex-col gap-12">
      {header}

      <p className="max-w-[62ch] text-[length:var(--text-step-1)] leading-snug text-ink [font-family:var(--font-logo)]">
        {trozos.map((t, i) => (
          <span key={i}>
            {i === 0 ? "" : i === trozos.length - 1 ? " y " : ", "}
            {t.href ? (
              <Link href={t.href} className="underline decoration-champagne decoration-1 underline-offset-[0.2em] hover:decoration-ink">
                {i === 0 ? t.texto : t.texto.charAt(0).toLowerCase() + t.texto.slice(1)}
              </Link>
            ) : (
              t.texto
            )}
          </span>
        ))}
        .
      </p>

      {/* Summit: vino #7A1218 (D-21) y textos chicos en bone pleno (P-09). */}
      <PanelReveal as="section" className="overflow-hidden rounded-[var(--radius-lg)] bg-bordeaux text-bone">
        <div className="flex flex-col gap-8 px-7 py-9 md:px-12 md:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[length:var(--text-step--1)] text-bone">
                <span className="text-champagne">✧</span> Event Summit
                {n.preventa ? ` · ${n.preventa.nombre} ${n.preventa.dias === 0 ? "termina hoy" : `termina en ${plural(n.preventa.dias, "día")}`}` : ""}
              </p>
              <h2 className="mt-3 text-[length:var(--text-step-4)] font-semibold leading-[0.95] text-bone [font-family:var(--font-logo)] [font-variant-numeric:lining-nums] md:text-[length:var(--text-step-5)]">
                {s.confirmados}/{EVENT_CUPO} · {formatARS(s.recaudado)}
              </h2>
            </div>
            <ArrowLink href="/panel/summit" tono="oscuro">
              Ver inscripciones
            </ArrowLink>
          </div>
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ...PASES.map((p) => ({ l: p.nombre, v: s.pases[p.id] ?? 0 })),
              { l: "Lugares libres", v: s.libres },
              { l: "Pendientes en MP", v: s.pendientesMP },
            ].map((m) => (
              <div key={m.l} className="flex flex-col gap-1 border-t border-bone/25 pt-4">
                <dt className="text-[length:var(--text-step--1)] text-bone">{m.l}</dt>
                <dd className="text-[length:var(--text-step-3)] font-semibold leading-none tabular-nums text-bone [font-family:var(--font-logo)] [font-variant-numeric:lining-nums]">{m.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </PanelReveal>

      <section aria-labelledby="kpis-heading" className="flex flex-col gap-6">
        <SectionHeading id="kpis-heading" eyebrow="Ventas y club" titulo="Cómo viene la semana" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {kpis.map((k, i) => (
            <PanelReveal key={k.l} index={i}>
              <Link href={k.href} className={`group flex h-full flex-col gap-2 rounded-[var(--radius-md)] border border-line ${k.fondo} p-6 transition-colors hover:border-champagne`}>
                <span className="text-[length:var(--text-step-5)] font-semibold leading-[0.85] tabular-nums text-ink [font-family:var(--font-logo)] [font-variant-numeric:lining-nums]">{k.n}</span>
                <span className="font-medium text-ink">{k.l}</span>
                <span className="text-[length:var(--text-step--1)] text-muted">{k.a}</span>
              </Link>
            </PanelReveal>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <section aria-labelledby="top-heading" className="flex flex-col gap-6">
          <SectionHeading id="top-heading" eyebrow="Últimos 30 días" titulo="Lo más pedido" verTodoLabel="Ver pedidos" verTodoHref="/panel/pedidos" />
          {n.top.length === 0 ? (
            <p className="rounded-[var(--radius-md)] border border-line bg-cloud px-5 py-6 text-muted">Todavía no hay pedidos en los últimos 30 días.</p>
          ) : (
            <ol className="flex flex-col divide-y divide-line rounded-[var(--radius-md)] border border-line bg-cloud">
              {n.top.map((t, i) => (
                <li key={`${t.slug}-${i}`} className="flex items-center gap-4 px-5 py-4">
                  <span className="w-6 shrink-0 text-[length:var(--text-step-1)] leading-none tabular-nums text-muted [font-family:var(--font-logo)]">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate font-medium text-ink">{t.nombre}</span>
                  <span className="shrink-0 text-[length:var(--text-step--1)] tabular-nums text-muted">
                    {plural(t.unidades, "unidad", "unidades")} · {plural(t.pedidos, "pedido")}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section aria-labelledby="pendientes-heading" className="flex flex-col gap-6">
          <SectionHeading id="pendientes-heading" eyebrow="Catálogo" titulo="Para completar" verTodoLabel="Ver catálogo" verTodoHref="/panel/productos" />
          {pendientes.length === 0 ? (
            <p className="rounded-[var(--radius-md)] border border-line bg-cloud px-5 py-6 text-muted">Todo en orden: todos los productos tienen precio y foto. ✧</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-md)] border border-line bg-cloud">
              {pendientes.map((p) => (
                <li key={p.label}>
                  <Link href={p.href} className="group flex items-center gap-5 px-5 py-4 transition-colors hover:bg-sand/60">
                    <span className="min-w-[3ch] text-[length:var(--text-step-3)] font-semibold leading-none tabular-nums text-ink [font-family:var(--font-logo)] [font-variant-numeric:lining-nums]">{p.n}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-ink">Productos {p.label}</span>
                      <span className="block text-[length:var(--text-step--1)] text-muted">{p.ayuda}</span>
                    </span>
                    <span aria-hidden="true" className="text-muted transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
