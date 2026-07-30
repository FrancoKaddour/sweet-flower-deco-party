import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { JsonLd } from "@/components/site/JsonLd";

// Display grotesca con carácter — equivalente LIBRE al espíritu de "Snaskface".
// Alternativa self-hosted con más punch: Clash Display (Fontshare). Ver docs/06 + ADR-012.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

// Cuerpo grotesca limpia — equivalente LIBRE a "Apercu" (la de snask.com).
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // TODO(contenido): dominio real (ADR-010) + textos/imágenes OG reales. Ver docs/11_SEO_STRATEGY.md.
  metadataBase: new URL("https://sweetflowersdecoparty.com"),
  title: {
    default: "Sweet Flowers Deco Party — Decoración de eventos",
    template: "%s · Sweet Flowers Deco Party",
  },
  description:
    "Decoración de eventos y formación del rubro en Argentina. Piezas en hierro, MDF, madera y telas, a medida o en stock. Workshops y comunidad.",
  keywords: [
    "decoración de eventos",
    "escenografía de eventos",
    "piezas de decoración",
    "workshop decoración",
    "Sweet Flowers",
    "Argentina",
  ],
  authors: [{ name: "Sweet Flowers Deco Party" }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Sweet Flowers Deco Party",
    title: "Sweet Flowers Deco Party — Decoración de eventos",
    description:
      "Creamos la escenografía de tus mejores momentos. Piezas en hierro, MDF, madera y telas. Workshops y comunidad.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sweet Flowers Deco Party — Decoración de eventos",
    description:
      "Creamos la escenografía de tus mejores momentos. Decoración de eventos y workshops.",
  },
  alternates: {
    canonical: "/",
  },
};

// viewport-fit=cover activa env(safe-area-inset-*) en iPhone con notch (sin esto,
// los insets no existen). themeColor pinta la UI del navegador con el marfil base.
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#f7f3ec",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-AR"
      className={`${bricolage.variable} ${hanken.variable} antialiased`}
    >
      <body className="min-h-dvh bg-bone text-ink">
        {/* Skip-link: acceso rápido al contenido para usuarios de teclado */}
        <a
          href="#main"
          className="sr-only rounded-[var(--radius-pill)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-5 focus:py-2.5 focus:text-[length:var(--text-step--1)] focus:font-medium focus:uppercase focus:tracking-[0.1em] focus:text-bone"
        >
          Saltar al contenido
        </a>
        <JsonLd />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
