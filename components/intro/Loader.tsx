import { LoaderIntro } from "@/components/intro/LoaderIntro";

/**
 * Loader del inicio (Server Component). Aporta, ANTES de que el navegador
 * pinte el hero (va antes que {children} en el layout):
 *  · un script inline que saltea la intro si ya se vio en esta sesión
 *    (sessionStorage `sf_intro`, T-02 a) — el layout ya resuelve recarga y
 *    "no es /";
 *  · un <noscript> que deja el inicio usable sin JS (T-03);
 *  · la intro animada (LoaderIntro, client).
 * El watchdog CSS de 10 s vive en app/globals.css.
 */
const SCRIPT_SESION = `try{if(location.pathname==="/"&&sessionStorage.getItem("sf_intro")){var b=document.body;b.setAttribute("data-loader","false");b.setAttribute("data-skip-intro","true")}}catch(e){}`;

const NOSCRIPT_CSS = `<style>body[data-loader=true] .c-hero__media,body[data-loader=true] .c-hero__media-overlay,body[data-loader=true] .c-hero__content,body[data-loader=true] .c-site-header{opacity:1!important;visibility:visible!important;width:100%!important;height:100%!important;border-radius:0!important}body[data-loader=true] .c-hero__content,body[data-loader=true] .c-site-header{height:auto!important}html,body{overflow:auto!important;touch-action:auto!important}.c-loader{display:none!important}</style>`;

export function Loader() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_SESION }} />
      <noscript dangerouslySetInnerHTML={{ __html: NOSCRIPT_CSS }} />
      <LoaderIntro />
    </>
  );
}
