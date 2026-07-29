import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

// Layout del sitio público (route group "(site)" → no afecta la URL).
// Aporta el chrome compartido (Header + Footer) a todas las páginas de marketing
// —Home, /productos y las que vengan— sin duplicarlo en cada una. El /panel vive
// fuera de este grupo y tiene su propio shell, así que no hereda este layout.
// Cada página aporta su propio <main id="main"> (destino del skip-link raíz).
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
