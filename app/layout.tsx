import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  Cormorant_Garamond,
} from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { JsonLd } from "@/components/site/JsonLd";
import { Loader } from "@/components/intro/Loader";
import { PageTransition } from "@/components/motion/PageTransition";
import Script from "next/script";
import { Medicion } from "@/components/site/Medicion";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, IS_INDEXABLE } from "@/lib/site";

// Display grotesca con carácter — equivalente LIBRE al espíritu de "Snaskface".
// Alternativa self-hosted con más punch: Clash Display (Fontshare). Ver docs/06 + ADR-012.
// Rendimiento: hoy solo la usa el panel ([data-area="panel"] .font-display) →
// sin preload (antes se bajaban ~41 KB en TODAS las páginas públicas sin usarse).
// El navegador la baja recién cuando algún texto la usa.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// Cuerpo grotesca limpia — equivalente LIBRE a "Apercu" (la de snask.com).
// Variable (un solo archivo para todos los pesos). Sin preload: se descubre con
// el CSS del <head> y mientras tanto display:swap muestra el fallback métrico.
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// Logotipo — serif editorial FINA y elegante para el texto del logo del header
// ("Sweet Flowers"). Pesos ligeros para un registro premium, menos "simple".
// Es también la de TODOS los títulos (--font-display) → la única con preload.
// Variable (wght 300–700 en un solo archivo) en vez de 5 archivos estáticos:
// el sitio usa 300/400/500/600 (los "bold" de display se normalizan a 600).
const cormorant = Cormorant_Garamond({
  variable: "--font-logo",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  // URL real (dominio de producción de Vercel o el propio). Ver lib/site.ts.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Decoración de eventos y estructuras de hierro`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "Decoración de eventos",
  keywords: [
    "decoración de eventos",
    "estructuras de hierro para eventos",
    "arcos para decoración de eventos",
    "catering para eventos",
    "pies de lámpara",
    "fundas para estructuras",
    "telas sublimadas",
    "insumos para decoradores",
    "ambientación de eventos",
    "Event Summit decoración",
    "Sweet Flowers",
    "Tortuguitas",
    "Buenos Aires",
    "Argentina",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: SITE_NAME,
    url: "/",
    title: `${SITE_NAME} — Decoración de eventos`,
    description:
      "Estructuras de hierro, catering, fundas y telas para armar la escena de cada evento. Producción propia y envíos a todo el país.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Decoración de eventos`,
    description:
      "Estructuras de hierro, catering, fundas y telas para armar la escena de cada evento. Envíos a todo el país.",
  },
  // Solo producción se indexa (previews de Vercel y local, no).
  robots: IS_INDEXABLE
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
      }
    : { index: false, follow: false },
  appleWebApp: { title: "Sweet Flowers", statusBarStyle: "default" },
  // TODO(lanzamiento): pegar acá el código de Google Search Console.
  // verification: { google: "" },
};

// viewport-fit=cover activa env(safe-area-inset-*) en iPhone con notch (sin esto,
// los insets no existen). themeColor pinta la UI del navegador con el marfil base.
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#f7f3ec",
};

// Vercel Web Analytics + Speed Insights por script (sin paquete). Se activan
// con NEXT_PUBLIC_ANALYTICS=1 en Vercel (y Analytics/Speed Insights prendidos
// en el proyecto). Los eventos de negocio salen de lib/analytics.ts (track).
const ANALYTICS = process.env.NEXT_PUBLIC_ANALYTICS === "1";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-AR"
      className={`${bricolage.variable} ${hanken.variable} ${cormorant.variable} antialiased`}
    >
      {/* data-loader="true" se escribe en el HTML servido (NO desde JS) → el
          estado inicial del loader vive en CSS, cero flash, cero hidratación
          rota. La timeline de GSAP lo pasa a "false" al terminar la intro.
          Método Villurcann (colaboracion/franco/prompt-loader-hero.docx). */}
      <body className="min-h-dvh bg-bone text-ink" data-loader="true" suppressHydrationWarning>
        {/* Al RECARGAR (F5) no hay intro: este script corre antes del primer
            paint y deja el sitio en su estado final (sin loader a medias si
            estabas scrolleado). La intro sigue corriendo al entrar al inicio
            por primera vez o navegando hacia él. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(location.pathname!=="/"){document.body.setAttribute("data-loader","false")}else{var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="reload"){document.body.setAttribute("data-loader","false");document.body.setAttribute("data-skip-intro","true")}}}catch(e){}`,
          }}
        />
        {/* Skip-link: acceso rápido al contenido para usuarios de teclado */}
        <a
          href="#main"
          className="sr-only rounded-[var(--radius-pill)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-5 focus:py-2.5 focus:text-[length:var(--text-step--1)] focus:font-medium focus:uppercase focus:tracking-[0.1em] focus:text-bone"
        >
          Saltar al contenido
        </a>
        <JsonLd />
        {/* Loader de intro: el nombre SWEET FLOWERS se separa y en el hueco
            central nace el video del hero, que crece a pantalla completa. */}
        <Loader />
        {/* Transición entre páginas (globos del logo) — la firma de la marca. */}
        <PageTransition />
        <SmoothScroll>{children}</SmoothScroll>
        <Medicion />
        {ANALYTICS && (
          <>
            <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
            <Script src="/_vercel/speed-insights/script.js" strategy="lazyOnload" />
          </>
        )}
      </body>
    </html>
  );
}
