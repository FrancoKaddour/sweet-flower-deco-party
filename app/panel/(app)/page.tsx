import Link from "next/link";
import { PageHeader } from "@/components/panel/PageHeader";
import { PanelButton } from "@/components/panel/PanelButton";
import { PanelReveal } from "@/components/panel/PanelReveal";
import { SectionHeading } from "@/components/panel/SectionHeading";
import { ArrowLink } from "@/components/panel/ArrowLink";
import { SinBase } from "@/components/panel/SinBase";
import { hasDb } from "@/db";
import { requireStaff } from "@/lib/dal";
import { resumenCatalogo } from "@/modules/catalog/admin";
import { conteosSeguros } from "@/modules/ventas/admin";

// Inicio del panel: estado real del catálogo + lo que conviene completar +
// accesos rápidos. Todo sale de la base (nada de datos de ejemplo).

const fecha = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Argentina/Buenos_Aires",
});

function saludo() {
  const h = Number(
    new Intl.DateTimeFormat("es-AR", { hour: "numeric", hour12: false, timeZone: "America/Argentina/Buenos_Aires" }).format(new Date()),
  );
  if (h < 13) return "Buen día";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
}

const ACCESOS = [
  { href: "/panel/productos/nuevo", titulo: "Cargar un producto", texto: "Nombre, precio, fotos y categoría.", fondo: "bg-sage" },
  { href: "/panel/productos", titulo: "Editar el catálogo", texto: "Buscá, filtrá y actualizá precios.", fondo: "bg-blush" },
  { href: "/panel/productos/categorias", titulo: "Categorías", texto: "Textos, foto y orden de cada línea.", fondo: "bg-sand" },
] as const;

export default async function InicioPage() {
  const user = await requireStaff();
  const nombre = (user.name ?? user.email ?? "").split(" ")[0];

  const header = (
    <PageHeader
      seccion="Inicio"
      titulo={`${saludo()}${nombre ? `, ${nombre}` : ""}`}
      descripcion="Pedidos, consultas y reservas que entraron por el sitio, y el catálogo. Lo que cambies se publica en unos minutos."
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

  const [r, c] = await Promise.all([resumenCatalogo(), conteosSeguros()]);
  const atender = [
    { n: c.pedidos.nuevo ?? 0, label: "Pedidos nuevos", ayuda: "Confirmalos y pasalos a producción.", href: "/panel/pedidos?estado=nuevo", fondo: "bg-blush" },
    { n: c.consultas.nueva ?? 0, label: "Consultas sin responder", ayuda: "Del formulario de contacto.", href: "/panel/consultas?estado=nueva", fondo: "bg-sage" },
    { n: c.inscripciones.consulto ?? 0, label: "Reservas al Summit", ayuda: "Consultaron y falta la seña.", href: "/panel/summit?estado=consulto", fondo: "bg-sand" },
  ];
  const pendientes = [
    { n: r.sinPrecio, label: "sin precio", ayuda: "Se muestran como “Consultar precio”.", href: "/panel/productos?estado=sin-precio" },
    { n: r.sinFoto, label: "sin foto", ayuda: "Sin foto no venden: sumales al menos una.", href: "/panel/productos?estado=sin-foto" },
    { n: r.ocultos, label: "ocultos", ayuda: "No aparecen en el sitio hasta que los actives.", href: "/panel/productos?estado=ocultos" },
  ].filter((p) => p.n > 0);

  return (
    <div className="flex flex-col gap-12">
      {header}

      {/* Para atender: lo que entró por el sitio y espera respuesta. */}
      <section aria-labelledby="atender-heading" className="flex flex-col gap-6">
        <SectionHeading id="atender-heading" eyebrow="Para atender" titulo="Lo que entró por el sitio" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {atender.map((a, i) => (
            <PanelReveal key={a.href} index={i}>
              <Link
                href={a.href}
                className={`group flex h-full flex-col gap-2 rounded-[var(--radius-md)] border border-line ${a.fondo} p-6 transition-colors hover:border-champagne`}
              >
                <span className="font-display text-[length:var(--text-step-5)] font-extrabold leading-[0.85] tabular-nums text-ink">{a.n}</span>
                <span className="font-medium uppercase tracking-[0.08em] text-ink">{a.label}</span>
                <span className="text-[length:var(--text-step--1)] text-muted">{a.n === 0 ? "Nada pendiente. ✧" : a.ayuda}</span>
                <span aria-hidden="true" className="mt-auto pt-2 text-ink transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </PanelReveal>
          ))}
        </div>
      </section>

      {/* Franja oscura con las cifras del catálogo. */}
      <PanelReveal as="section" className="overflow-hidden rounded-[var(--radius-lg)] bg-botanical text-bone">
        <div className="flex flex-col gap-10 px-7 py-10 md:px-12 md:py-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[length:var(--text-step--1)] uppercase tracking-[0.18em] text-champagne">✧ El catálogo hoy</p>
              <h2 className="mt-3 max-w-[18ch] font-display text-[length:var(--text-step-3)] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] text-bone md:text-[length:var(--text-step-4)]">
                Lo que está publicado
              </h2>
            </div>
            <ArrowLink href="/" tono="oscuro">
              Ver el sitio
            </ArrowLink>
          </div>
          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
            {[
              { label: "Productos", valor: r.total, ayuda: "Total cargados (visibles y ocultos)." },
              { label: "Visibles", valor: r.total - r.ocultos, ayuda: "Los que ve la gente en el sitio." },
              { label: "Destacados", valor: r.destacados, ayuda: "Aparecen en la home y primeros en su categoría." },
            ].map((m) => (
              <div
                key={m.label}
                className="flex flex-col gap-2 border-t border-bone/15 pt-6 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:first:border-l-0 sm:first:pl-0"
              >
                <dt className="text-[length:var(--text-step--1)] uppercase tracking-[0.14em] text-bone/60">{m.label}</dt>
                <dd className="font-display text-[length:var(--text-step-6)] font-extrabold leading-[0.85] tracking-[-0.02em] text-bone tabular-nums">
                  {m.valor}
                </dd>
                <p className="text-[length:var(--text-step--1)] leading-relaxed text-bone/55">{m.ayuda}</p>
              </div>
            ))}
          </dl>
        </div>
      </PanelReveal>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Para completar */}
        <section aria-labelledby="pendientes-heading" className="flex flex-col gap-6">
          <SectionHeading id="pendientes-heading" eyebrow="Para completar" titulo="Lo que conviene revisar" />
          {pendientes.length === 0 ? (
            <p className="rounded-[var(--radius-md)] border border-line bg-cloud px-5 py-6 text-muted">
              Todo en orden: todos los productos tienen precio y foto. ✧
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-md)] border border-line bg-cloud">
              {pendientes.map((p, i) => (
                <PanelReveal as="li" key={p.label} index={i}>
                  <Link href={p.href} className="group flex items-center gap-5 px-5 py-4 transition-colors hover:bg-sand/60">
                    <span className="min-w-[3ch] font-display text-[length:var(--text-step-3)] font-extrabold leading-none tabular-nums text-ink">
                      {p.n}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium uppercase tracking-[0.08em] text-ink">Productos {p.label}</span>
                      <span className="block text-[length:var(--text-step--1)] text-muted">{p.ayuda}</span>
                    </span>
                    <span aria-hidden="true" className="text-muted transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </PanelReveal>
              ))}
            </ul>
          )}
        </section>

        {/* Últimos cambios */}
        <section aria-labelledby="ultimos-heading" className="flex flex-col gap-6">
          <SectionHeading
            id="ultimos-heading"
            eyebrow="Actividad"
            titulo="Últimos editados"
            verTodoLabel="Ver catálogo"
            verTodoHref="/panel/productos"
          />
          <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-md)] border border-line bg-cloud">
            {r.ultimos.map((p, i) => (
              <PanelReveal as="li" key={p.id} index={i}>
                <Link
                  href={`/panel/productos/${p.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-sand/60"
                >
                  <span className="min-w-0 truncate font-medium text-ink">{p.nombre}</span>
                  <span className="shrink-0 text-[length:var(--text-step--1)] tabular-nums text-muted">
                    {fecha.format(p.updatedAt)}
                  </span>
                </Link>
              </PanelReveal>
            ))}
          </ul>
        </section>
      </div>

      {/* Accesos rápidos */}
      <section aria-labelledby="accesos-heading" className="flex flex-col gap-6">
        <SectionHeading id="accesos-heading" eyebrow="Atajos" titulo="Accesos rápidos" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {ACCESOS.map((a, i) => (
            <PanelReveal key={a.href} index={i}>
              <Link
                href={a.href}
                className={`group flex h-full flex-col gap-3 rounded-[var(--radius-md)] border border-line ${a.fondo} p-6 transition-colors hover:border-champagne`}
              >
                <span className="font-display text-[length:var(--text-step-1)] font-bold uppercase leading-tight text-ink">
                  {a.titulo}
                </span>
                <span className="text-[length:var(--text-step--1)] leading-relaxed text-muted">{a.texto}</span>
                <span aria-hidden="true" className="mt-auto text-ink transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </PanelReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
