import Image from "next/image";
import { FadeUp } from "@/components/motion/FadeUp";

// TODO(contenido): principios, textos y fotos reales (ver docs → 03_PRINCIPIOS).
// Cada card se apila con position: sticky (CSS puro, sin JS).
const PRINCIPIOS = [
  {
    titulo: "Hacelo memorable",
    desc: "Cada detalle está pensado para sorprender y crear recuerdos que quedan.",
    img: "https://picsum.photos/seed/sfdp-prin-1/429/525",
  },
  {
    titulo: "Cada evento es único",
    desc: "Nada de fórmulas: diseñamos la escena a la medida de cada celebración.",
    img: "https://picsum.photos/seed/sfdp-prin-2/429/525",
  },
  {
    titulo: "Detalle artesanal",
    desc: "Piezas hechas a mano, con la calidez y la terminación de un oficio.",
    img: "https://picsum.photos/seed/sfdp-prin-3/429/525",
  },
];

/**
 * Sección PRINCIPIOS — cards que se apilan con sticky puro (referencia momoamo).
 * Cada <li> es opaco (bg-bone) y usa un top incremental para taparse entre sí.
 * Es SERVER component: el apilado es CSS y las entradas las hace <FadeUp>.
 */
export function Principios() {
  return (
    <section
      id="principios"
      className="relative w-full bg-sage py-[4rem] text-ink md:pb-[5rem] md:pt-[5rem]"
    >
      <div className="mx-auto max-w-[87.5rem] px-6 md:px-10">
      {/* Título de la sección (anima al entrar) */}
      <FadeUp y={100}>
        <h2 className="mx-auto max-w-[18ch] pb-[2.5rem] text-center font-display text-[length:var(--text-step-4)] font-bold uppercase leading-[0.9] text-ink md:text-[length:var(--text-step-5)]">
          {/* TODO(contenido): titular real */}
          Nuestros principios le dan vida a tu evento
        </h2>
      </FadeUp>

      {/* Lista apilable: cada item se pega con top incremental (96, 168, 240) */}
      <ul className="m-0 grid list-none gap-[2.5rem] p-0">
        {PRINCIPIOS.map((p, i) => (
          <li
            key={p.titulo}
            className="sticky overflow-hidden rounded-[var(--radius-md)] bg-bone p-6 shadow-[0_10px_44px_-18px_rgba(20,17,15,0.28)] md:p-9"
            style={{ top: `${96 + i * 72}px` }}
          >
            <article className="grid w-full grid-cols-1 items-start gap-6 md:grid-cols-3 md:gap-8">
              <header>
                <h3 className="font-display text-[length:var(--text-step-3)] font-bold uppercase leading-tight text-ink">
                  {p.titulo}
                </h3>
              </header>
              <figure className="m-0">
                <Image
                  className="h-[32.8125rem] max-h-[40vh] w-full rounded-[var(--radius-sm)] object-cover md:max-h-none md:w-[26.8125rem]"
                  src={p.img}
                  alt={p.titulo}
                  width={429}
                  height={525}
                  sizes="(max-width: 768px) 100vw, 429px"
                />
              </figure>
              <p className="font-sans text-[length:var(--text-step-0)] leading-snug text-ink md:ml-2">
                {p.desc}
              </p>
            </article>
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}
