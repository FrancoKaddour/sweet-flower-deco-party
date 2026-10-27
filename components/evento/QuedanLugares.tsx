/**
 * "Quedan N lugares · M personas pagando ahora" — solo cuando quedan 30 o
 * menos (urgencia honesta, E-16). Los números los calcula el servidor con
 * quedanLugares() y reservasEnCurso() (modules/summit/core.ts).
 */
export const UMBRAL_LUGARES = 30;

export type Cupo = { quedan: number; pagando: number } | null;

export function QuedanLugares({ cupo, className = "" }: { cupo: Cupo; className?: string }) {
  if (!cupo || cupo.quedan > UMBRAL_LUGARES) return null;
  const { quedan, pagando } = cupo;
  return (
    <p className={`text-[length:var(--text-step-0)] font-medium ${className}`}>
      {quedan === 0 ? "Se agotaron los lugares" : quedan === 1 ? "Queda 1 lugar" : `Quedan ${quedan} lugares`}
      {quedan > 0 && pagando > 0 && (
        <span className="font-normal opacity-75">
          {" · "}
          {pagando === 1 ? "1 persona pagando ahora" : `${pagando} personas pagando ahora`}
        </span>
      )}
    </p>
  );
}
