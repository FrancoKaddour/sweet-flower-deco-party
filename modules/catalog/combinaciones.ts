// "Se arma con" (E-10): combinaciones CURADAS a mano, solo las que salen de
// los propios datos del catálogo (la funda que corresponde a cada estructura,
// las piezas que forman los combos, estantería + alzadas). Sin inventar.
// Si un slug no existe o está oculto, simplemente no se muestra.
const ESTANTERIA = ["alzada-corona", "alzadas-escandinavas-x3", "torre-cupcakes-o-alzadas-2-en-1"];

export const SE_ARMA_CON: Record<string, readonly string[]> = {
  // Estructuras de hierro → su funda (+ piezas del mismo combo)
  "aro-de-hierro-1-20-1-50-2-00": ["funda-aro-1-20", "funda-aro-1-50", "funda-aro-2m", "pisos-de-cordura"],
  "arcada-de-hierro-95x2": ["funda-arcada-hierro", "semiarcada-de-hierro-95x2", "arcada-recta-de-hierro-95x2", "pisos-de-cordura"],
  "semiarcada-de-hierro-95x2": ["funda-semi-arcada-hierro", "arcada-de-hierro-95x2", "arcada-recta-de-hierro-95x2"],
  "arcada-recta-de-hierro-95x2": ["funda-arcada-recta-hierro", "arcada-de-hierro-95x2", "semiarcada-de-hierro-95x2"],
  "combo-x-3-arcada-semiarcada-arcada-recta": ["funda-arcada-hierro", "funda-semi-arcada-hierro", "funda-arcada-recta-hierro"],
  "combo-x3-arcadas": ["funda-arcada-hierro", "funda-semi-arcada-hierro"],
  "armazon-granero": ["funda-armazon-granero"],
  "cilindro-x-3": ["funda-cilindros-tradicional"],
  // Fundas → su estructura
  "funda-aro-1-20": ["aro-de-hierro-1-20-1-50-2-00"],
  "funda-aro-1-50": ["aro-de-hierro-1-20-1-50-2-00"],
  "funda-aro-2m": ["aro-de-hierro-1-20-1-50-2-00"],
  "funda-arcada-hierro": ["arcada-de-hierro-95x2", "semiarcada-de-hierro-95x2"],
  "funda-semi-arcada-hierro": ["semiarcada-de-hierro-95x2"],
  "funda-arcada-recta-hierro": ["arcada-recta-de-hierro-95x2"],
  "funda-armazon-granero": ["armazon-granero"],
  "funda-cilindros-tradicional": ["cilindro-x-3"],
  // Estanterías de catering → alzadas
  "estanteria-eclipse": ESTANTERIA,
  "eclipse-xl": ESTANTERIA,
  "estanteria-sweet": ESTANTERIA,
  "estanteria-star": ESTANTERIA,
  "estanteria-capsula-60cm": ESTANTERIA,
  "estanteria-capsula-xl": ESTANTERIA,
  "estanteria-s-60cm": ESTANTERIA,
  "estanteria-s-xl": ESTANTERIA,
  "arcoiris-4-estantes": ESTANTERIA,
};
