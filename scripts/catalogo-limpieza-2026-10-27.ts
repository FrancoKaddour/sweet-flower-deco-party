// Datos del bloque "2026-10-27-catalogo-limpio" de scripts/actualizaciones.ts.
// GENERADO (frente C1, 27/10/2026): para cada producto, el valor ORIGINAL del
// seed (`antes`) y el curado (`despues`). La actualización solo pisa un campo
// si en la base sigue igual a `antes` (o sea, si Flor no lo editó en el panel).
export type FilaLimpieza = {
  slug: string;
  antes: { nombre: string; precio: number | null; descripcion: string; medidas: string | null };
  despues: {
    nombre: string;
    precio: number | null;
    descripcion: string;
    medidas: string | null;
    variantes: { etiqueta: string; precio: number | null }[];
    /** slug de categoría (cambia en los de hierro que estaban como madera/MDF). */
    categoria: string;
  };
};

export const LIMPIEZA_CATALOGO: FilaLimpieza[] = [
 {
  "slug": "mickey-mdf-2x2",
  "antes": {
   "nombre": "Mickey mdf 2x2",
   "precio": 312000,
   "descripcion": "Mickey mdf 2x2 desarmable Profundidad 20cm aprox Pintado $420.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Mickey MDF 2x2",
   "precio": 312000,
   "descripcion": "Mickey MDF 2x2 desarmable Profundidad 20cm aprox Pintado $420.000",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "olas-de-mdf",
  "antes": {
   "nombre": "Olas de mdf",
   "precio": 47500,
   "descripcion": "Olas de mdf/ individual o doble Pintadas $62.500",
   "medidas": null
  },
  "despues": {
   "nombre": "Olas de MDF",
   "precio": 47500,
   "descripcion": "Olas de MDF/ individual o doble Pintadas $62.500",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "cubo-de-25x25",
  "antes": {
   "nombre": "Cubo de 25x25",
   "precio": 10000,
   "descripcion": "Sin pintar sin letras $10.000 c/u Sin pintar con letras $12.000 c/u Pintado con letras $18.000 c/u",
   "medidas": null
  },
  "despues": {
   "nombre": "Cubo 25 × 25",
   "precio": 10000,
   "descripcion": "Cubo con o sin letras. Precio por unidad.",
   "medidas": "25 × 25 cm",
   "variantes": [
    {
     "etiqueta": "Sin pintar, sin letras",
     "precio": 10000
    },
    {
     "etiqueta": "Sin pintar, con letras",
     "precio": 12000
    },
    {
     "etiqueta": "Pintado, con letras",
     "precio": 18000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "combo-x-3-paneles-arcadas",
  "antes": {
   "nombre": "Combo x 3 paneles arcadas",
   "precio": 144000,
   "descripcion": "Combo x3 arcadas lisas, desarmables 1Panel arcada 1.80x80 2 semi arcadas 1.60x80 Pintado $209.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Combo x3 paneles arcada",
   "precio": 144000,
   "descripcion": "Tres paneles de arcada lisos y desarmables: una arcada y dos semiarcadas.",
   "medidas": "Arcada 1,80 × 0,80 m · semiarcadas 1,60 × 0,80 m",
   "variantes": [
    {
     "etiqueta": "Sin pintar",
     "precio": 144000
    },
    {
     "etiqueta": "Pintado",
     "precio": 209000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "bases-orejas-mickey-mdf",
  "antes": {
   "nombre": "Bases Orejas Mickey mdf",
   "precio": 12000,
   "descripcion": "Bases mdf Mickey 35cm aprox 15% de recargo x link de mercado pago",
   "medidas": null
  },
  "despues": {
   "nombre": "Bases Orejas Mickey MDF",
   "precio": 12000,
   "descripcion": "Bases MDF Mickey 35cm aprox",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "hexagono",
  "antes": {
   "nombre": "Hexágono",
   "precio": 99000,
   "descripcion": "Hexagono de hierro desarmable Medidas: 2m de alto x 2m de ancho La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Hexágono",
   "precio": 99000,
   "descripcion": "Hexágono de hierro desarmable.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "2 m de alto × 2 m de ancho",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "casita-mdf",
  "antes": {
   "nombre": "Casita mdf",
   "precio": 87500,
   "descripcion": "Casita de mdf Pintada $129.500 Medidas: 1.80x80",
   "medidas": null
  },
  "despues": {
   "nombre": "Casita MDF",
   "precio": 87500,
   "descripcion": "Casita de MDF Pintada $129.500 Medidas: 1.80x80",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "mesa-ranurada",
  "antes": {
   "nombre": "Mesa ranurada",
   "precio": 60500,
   "descripcion": "Mesa ranurada de mdf desarmable Medidas: 1x80x40 Pintado $90.500 Tapa cajón $70.500 Pintado $105.500",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa ranurada",
   "precio": 60500,
   "descripcion": "Mesa ranurada de MDF desarmable Medidas: 1x80x40 Pintado $90.500 Tapa cajón $70.500 Pintado $105.500",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "arcada-de-hierro-3d",
  "antes": {
   "nombre": "Arcada de hierro 3d",
   "precio": 309000,
   "descripcion": "Arcada de hierro desarmable Medidas: De 2.40 x 1.50 $309.000 De 2.40 x 1.80 $351.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Arcada de hierro 3D",
   "precio": 309000,
   "descripcion": "Arcada de hierro desarmable.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "2,40 × 1,50 m",
     "precio": 309000
    },
    {
     "etiqueta": "2,40 × 1,80 m",
     "precio": 351000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "base-mariposa",
  "antes": {
   "nombre": "Base Mariposa",
   "precio": 12000,
   "descripcion": "",
   "medidas": null
  },
  "despues": {
   "nombre": "Base mariposa",
   "precio": 12000,
   "descripcion": "Base con forma de mariposa. Consultanos medidas y colores.",
   "medidas": null,
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "base-cola-de-sirena-mdf",
  "antes": {
   "nombre": "Base cola de sirena mdf",
   "precio": 12000,
   "descripcion": "Base cola de sirena mdf 35cm aporx 15,% de recargo x link de mercado pago",
   "medidas": null
  },
  "despues": {
   "nombre": "Base cola de sirena (MDF)",
   "precio": 12000,
   "descripcion": "Base de MDF con forma de cola de sirena.",
   "medidas": "35 cm aprox.",
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "pisos-de-cordura",
  "antes": {
   "nombre": "Pisos de Cordura",
   "precio": 13000,
   "descripcion": "Pisos de cordura sublimados Se vende por metro de 1x1.40 Lo podes pedir de la medida que quieras 1x1.40 $13.000 2x1.40 $26.000 3x1.40 $39.000 2x2.80 $52.000 3x2.80 $78.000 De otra medida a cotizar CATALOGO DE FUNDAS",
   "medidas": null
  },
  "despues": {
   "nombre": "Piso de cordura",
   "precio": 13000,
   "descripcion": "Piso de cordura sublimado, por metro. De otra medida, a cotizar.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "1 × 1,40 m",
     "precio": 13000
    },
    {
     "etiqueta": "2 × 1,40 m",
     "precio": 26000
    },
    {
     "etiqueta": "3 × 1,40 m",
     "precio": 39000
    },
    {
     "etiqueta": "2 × 2,80 m",
     "precio": 52000
    },
    {
     "etiqueta": "3 × 2,80 m",
     "precio": 78000
    }
   ],
   "categoria": "fundas-y-telas"
  }
 },
 {
  "slug": "panel-arcada-140x60",
  "antes": {
   "nombre": "Panel arcada 140x60",
   "precio": 46500,
   "descripcion": "Panel madera arcada Medida 60x1.40",
   "medidas": null
  },
  "despues": {
   "nombre": "Panel arcada 140x60",
   "precio": 46500,
   "descripcion": "Panel madera arcada Medida 60x1.40",
   "medidas": null,
   "variantes": [],
   "categoria": "madera"
  }
 },
 {
  "slug": "auto-barbie-mdf",
  "antes": {
   "nombre": "Auto Barbie mdf",
   "precio": 56000,
   "descripcion": "Auto Barbie mdf pintado $79.000 Medidas 1m x 70 aprox",
   "medidas": null
  },
  "despues": {
   "nombre": "Auto Barbie MDF",
   "precio": 56000,
   "descripcion": "Auto Barbie MDF pintado $79.000 Medidas 1m x 70 aprox",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "columna-hierro-estrella",
  "antes": {
   "nombre": "Columna hierro estrella",
   "precio": 71000,
   "descripcion": "Columna hierro estrella Medidas 1.90 de alto y ancho aprox 1 m X link mp 15% de recargo",
   "medidas": null
  },
  "despues": {
   "nombre": "Columna de hierro estrella",
   "precio": 71000,
   "descripcion": "Columna de hierro con estrella.",
   "medidas": "1,90 m de alto · 1 m de ancho aprox.",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "margarita",
  "antes": {
   "nombre": "Margarita",
   "precio": 25000,
   "descripcion": "Margarita mdf Pintado $35.000 Medidas: 90cm de largo x 40cm de alto",
   "medidas": null
  },
  "despues": {
   "nombre": "Margarita",
   "precio": 25000,
   "descripcion": "Margarita MDF Pintado $35.000 Medidas: 90cm de largo x 40cm de alto",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "combo-x3-arcadas",
  "antes": {
   "nombre": "Combo x3 arcadas",
   "precio": 252000,
   "descripcion": "Combo x 3: 1 arcada 95x2 2 semi arcada 95x1.60 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Combo x3 arcadas",
   "precio": 252000,
   "descripcion": "Una arcada y dos semiarcadas de hierro.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "Arcada 0,95 × 2 m · semiarcadas 0,95 × 1,60 m",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "candelabro-5-velas",
  "antes": {
   "nombre": "Candelabro 5 velas",
   "precio": 98000,
   "descripcion": "Candelabro 5 velas Consultar x otras opciones",
   "medidas": null
  },
  "despues": {
   "nombre": "Candelabro de 5 velas",
   "precio": 98000,
   "descripcion": "Candelabro para 5 velas. Consultanos por otras opciones.",
   "medidas": null,
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "combo-playa",
  "antes": {
   "nombre": "Combo Playa",
   "precio": 169000,
   "descripcion": "Combo Playa 1 palmera 2 m desarmable 2 palmeras 1 m 1 tabla surf 1.50m 1 tabla surf 1 m $239.000 pintado Precios individuales Palmera 2m $69.000 Sin pintar $89.000 Pintado Palmera 1 m $24.000 Sin pintar $34.000 Pintado Tabla surf 1.50m $52.500 Sin pintar $72.500 Pintado Tabla surf 1m $24.000 Sin pintar $34.000 Pintado",
   "medidas": null
  },
  "despues": {
   "nombre": "Combo Playa",
   "precio": 169000,
   "descripcion": "Combo Playa 1 palmera 2 m desarmable 2 palmeras 1 m 1 tabla surf 1.50m 1 tabla surf 1 m $239.000 pintado Precios individuales Palmera 2m $69.000 Sin pintar $89.000 Pintado Palmera 1 m $24.000 Sin pintar $34.000 Pintado Tabla surf 1.50m $52.500 Sin pintar $72.500 Pintado Tabla surf 1m $24.000 Sin pintar $34.000 Pintado",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "mesa-jeep",
  "antes": {
   "nombre": "Mesa jeep",
   "precio": 112500,
   "descripcion": "Mesa jeep mdf desarmable Medidas 80x80x40 Pintado $147.500",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa jeep",
   "precio": 112500,
   "descripcion": "Mesa jeep MDF desarmable Medidas 80x80x40 Pintado $147.500",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "mesa-carroza",
  "antes": {
   "nombre": "Mesa Carroza",
   "precio": 135000,
   "descripcion": "Mesa carroza desarmable Medidas: Diámetro 50cm Largo Total 1m aprox El tambor se saca y lo podes usar como Mesa solo eso Dos usos $165.000 con madera La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa carroza",
   "precio": 135000,
   "descripcion": "Mesa carroza desarmable. El tambor se saca y lo usás como mesa sola: dos usos.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "50 cm de diámetro · 1 m de largo total aprox.",
   "variantes": [
    {
     "etiqueta": "Sin madera",
     "precio": 135000
    },
    {
     "etiqueta": "Con madera",
     "precio": 165000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "sillon-luna",
  "antes": {
   "nombre": "Sillón luna",
   "precio": 198000,
   "descripcion": "Sillon luna solo armazón 2m de alto La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Sillón Luna",
   "precio": 198000,
   "descripcion": "Sillón luna de hierro, solo armazón.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "2 m de alto",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesa-mostrador",
  "antes": {
   "nombre": "Mesa Mostrador",
   "precio": 95000,
   "descripcion": "Mesa mostrador desarmable Medidas 1x40x75 Fundas se le puede poner",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa Mostrador",
   "precio": 95000,
   "descripcion": "Mesa mostrador desarmable Medidas 1x40x75 Fundas se le puede poner",
   "medidas": null,
   "variantes": [],
   "categoria": "madera"
  }
 },
 {
  "slug": "cubos-pintados-con-numeros-o-letras-en-mdf",
  "antes": {
   "nombre": "Cubos pintados con números o letras en mdf",
   "precio": 15500,
   "descripcion": "Cada uno $15500 15% de recargo x link mercado pago Medidas 25x25",
   "medidas": null
  },
  "despues": {
   "nombre": "Cubo pintado con número o letra (MDF)",
   "precio": 15500,
   "descripcion": "Cubo de MDF pintado con número o letra. Precio por unidad.",
   "medidas": "25 × 25 cm",
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "semiarcada-de-hierro-95x2",
  "antes": {
   "nombre": "Semiarcada de hierro 95x2",
   "precio": 95000,
   "descripcion": "Semi Arcada 95x2 Combo x3 $256.000 (cualquier formato) La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Semiarcada de hierro 95 × 2",
   "precio": 95000,
   "descripcion": "Semiarcada de hierro. En combo x3 la combinás con arcadas y arcadas rectas, en el formato que quieras.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "0,95 × 2 m",
   "variantes": [
    {
     "etiqueta": "Unidad",
     "precio": 95000
    },
    {
     "etiqueta": "Combo x3",
     "precio": 256000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesa-hexagonal-larga",
  "antes": {
   "nombre": "Mesa hexagonal larga",
   "precio": 105000,
   "descripcion": "Solo armazon $105.000 Medidas: 90cm de alto x 90cm de largo",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa hexagonal larga",
   "precio": 105000,
   "descripcion": "Mesa hexagonal de hierro, solo armazón.",
   "medidas": "90 cm de alto × 90 cm de largo",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "funda-semi-arcada-hierro",
  "antes": {
   "nombre": "Funda Semi Arcada hierro",
   "precio": 22000,
   "descripcion": "Funda con elastico para semi arcada de hierro 95x2 $22.000 95x1.60$20.000 CATALOGO DE FUNDAS",
   "medidas": null
  },
  "despues": {
   "nombre": "Funda para semiarcada de hierro",
   "precio": 20000,
   "descripcion": "Funda con elástico para semiarcada de hierro.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "0,95 × 1,60 m",
     "precio": 20000
    },
    {
     "etiqueta": "0,95 × 2 m",
     "precio": 22000
    }
   ],
   "categoria": "fundas-y-telas"
  }
 },
 {
  "slug": "arcoiris-en-mdf",
  "antes": {
   "nombre": "Arcoíris en mdf",
   "precio": 15000,
   "descripcion": "15% de recargo x link mercado pago Medidas 40cm aprox",
   "medidas": null
  },
  "despues": {
   "nombre": "Arcoíris en MDF",
   "precio": 15000,
   "descripcion": "Medidas 40cm aprox",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "pies-y-tallos-para-flores",
  "antes": {
   "nombre": "Pies y tallos para flores",
   "precio": 79500,
   "descripcion": "Pies para flores de organza x3 Base con 3 caños de hierro, desarmable Los podes acomodar de la forma que quieras Medidas: 50cm de diametro 3 tallos de 1.60m de alto (los 2 curvos quedan a 1.50 de alto)",
   "medidas": null
  },
  "despues": {
   "nombre": "Pies y tallos para flores",
   "precio": 79500,
   "descripcion": "Base desarmable con 3 caños de hierro para flores de organza: los acomodás como quieras.\nIncluye: base y 3 tallos.",
   "medidas": "Base de 50 cm de diámetro · tallos de 1,60 m (los 2 curvos quedan a 1,50 m)",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesa-ola",
  "antes": {
   "nombre": "Mesa ola",
   "precio": 60500,
   "descripcion": "Mesa de mdf con ola Medidas: 1x80x40 Pintado $90.500 Tapa cajón $70.500 Pintado $105.500",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa ola",
   "precio": 60500,
   "descripcion": "Mesa de MDF con ola Medidas: 1x80x40 Pintado $90.500 Tapa cajón $70.500 Pintado $105.500",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "algas-de-mdf",
  "antes": {
   "nombre": "Algas de mdf",
   "precio": 4000,
   "descripcion": "Alga grande 20cm de alto sin pintar $4.000 Pintada $8.500 Alga grande 30cm de alto sin pintar $6.000 Pintada $10.500 Alga chica 50cm de alto sin pintar $16.000 Pintado $21.500 Alga grande 70cm de alto sin pintar $23.000 Pintada $30.500",
   "medidas": null
  },
  "despues": {
   "nombre": "Algas de MDF",
   "precio": 4000,
   "descripcion": "Alga grande 20cm de alto sin pintar $4.000 Pintada $8.500 Alga grande 30cm de alto sin pintar $6.000 Pintada $10.500 Alga chica 50cm de alto sin pintar $16.000 Pintado $21.500 Alga grande 70cm de alto sin pintar $23.000 Pintada $30.500",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "alzada-cuadrada-20x20",
  "antes": {
   "nombre": "Alzada cuadrada 20x20",
   "precio": 10000,
   "descripcion": "15% de recargo x link Mercado pago Colores a elección",
   "medidas": null
  },
  "despues": {
   "nombre": "Alzada cuadrada 20 × 20",
   "precio": 10000,
   "descripcion": "Alzada cuadrada.\nColores: a elección.",
   "medidas": "20 × 20 cm",
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "luna-enterrada",
  "antes": {
   "nombre": "Luna Enterrada",
   "precio": 132000,
   "descripcion": "Luna enterrada de hierro Medidas: No es desarmable son 2 partes, la mas alta y la chica",
   "medidas": null
  },
  "despues": {
   "nombre": "Luna enterrada",
   "precio": 132000,
   "descripcion": "Luna de hierro en 2 partes, la alta y la chica. No es desarmable.",
   "medidas": null,
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "funda-aro-1-50",
  "antes": {
   "nombre": "Funda aro 1.50",
   "precio": 18000,
   "descripcion": "Funda con elastico para aro 1.50 de diametro CATALOGO DE FUNDAS",
   "medidas": null
  },
  "despues": {
   "nombre": "Funda para aro de 1,50 m",
   "precio": 18000,
   "descripcion": "Funda con elástico para aro de 1,50 m de diámetro.",
   "medidas": null,
   "variantes": [],
   "categoria": "fundas-y-telas"
  }
 },
 {
  "slug": "columna-corazon",
  "antes": {
   "nombre": "Columna corazon",
   "precio": 75000,
   "descripcion": "Columna con corazón de hierro desarmable 2m de alto 1.50 aprox el corazón La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Columna corazón",
   "precio": 75000,
   "descripcion": "Columna de hierro desarmable con corazón.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "2 m de alto · corazón de 1,50 m aprox.",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "panel-espiralado-1-60x80",
  "antes": {
   "nombre": "Panel espiralado 1.60x80",
   "precio": 69000,
   "descripcion": "Panel espiralado desarmable Ranurado o liso Podes usarlo de los dos lados Medidas 1.60x80 Pintado $94.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Panel espiralado 1.60x80",
   "precio": 69000,
   "descripcion": "Panel espiralado desarmable Ranurado o liso Podes usarlo de los dos lados Medidas 1.60x80 Pintado $94.000",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "numero-de-hierro-3d-1-2-3-4-5-6-7-8-9",
  "antes": {
   "nombre": "Número de hierro 3D 1/2/3/4/5/6/7/8/9",
   "precio": 62000,
   "descripcion": "Número de hierro de 1.50 de alto y 30cm de profundidad La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Número de hierro 3D (del 1 al 9)",
   "precio": 62000,
   "descripcion": "Número de hierro 3D, del 1 al 9.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "1,50 m de alto × 30 cm de profundidad",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "alzada-mariposa",
  "antes": {
   "nombre": "Alzada mariposa",
   "precio": 13000,
   "descripcion": "Alzada Mariposa Medidas: 20xm alto x 25cm ancho Pintada",
   "medidas": null
  },
  "despues": {
   "nombre": "Alzada mariposa",
   "precio": 13000,
   "descripcion": "Alzada con forma de mariposa, pintada.",
   "medidas": "20 cm de alto × 25 cm de ancho",
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "base-mdf-10x30",
  "antes": {
   "nombre": "Base mdf 10x30",
   "precio": 4700,
   "descripcion": "Colores a elección 15% de recargo x link de mercado pago",
   "medidas": null
  },
  "despues": {
   "nombre": "Base MDF 10x30",
   "precio": 4700,
   "descripcion": "Colores a elección",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "atril",
  "antes": {
   "nombre": "Atril",
   "precio": 83000,
   "descripcion": "Atril de hierro Medidas: 1.80 de alto Abonando por transferencia/efectivo tenes descuento en hierro!",
   "medidas": null
  },
  "despues": {
   "nombre": "Atril",
   "precio": 83000,
   "descripcion": "Atril de hierro.",
   "medidas": "1,80 m de alto",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "combo-x-3-mesas-cubo-mas-barril",
  "antes": {
   "nombre": "Combo x 3 mesas cubo más barril",
   "precio": 284000,
   "descripcion": "Combo x 3 mesas desarmables más 1 barril 2 mesas Cubo 1 Mesa rectangular 1 barril Con las maderas $384.000 Medidas Rectangular 40x90x80 Cuadradas 40x40x75 40x40x55 Barril 40x65 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Combo x3 mesas cubo más barril",
   "precio": 284000,
   "descripcion": "Tres mesas desarmables (2 cubo y 1 rectangular) más 1 barril.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "Rectangular 40 × 90 × 80 · cubos 40 × 40 × 75 y 40 × 40 × 55 · barril 40 × 65 cm",
   "variantes": [
    {
     "etiqueta": "Sin maderas",
     "precio": 284000
    },
    {
     "etiqueta": "Con maderas",
     "precio": 384000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "separador-de-torta",
  "antes": {
   "nombre": "Separador de torta",
   "precio": 19500,
   "descripcion": "Separador de torta Hierro La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Separador de torta",
   "precio": 19500,
   "descripcion": "Separador de torta de hierro.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "cola-de-sirena-de-mdf-150m",
  "antes": {
   "nombre": "Cola de sirena de mdf 150m",
   "precio": 87500,
   "descripcion": "Cola de Sirena mdf 1.50m Pintada $122.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Cola de sirena de MDF 150m",
   "precio": 87500,
   "descripcion": "Cola de Sirena MDF 1.50m Pintada $122.000",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "armazon-granero",
  "antes": {
   "nombre": "Armazón granero",
   "precio": 123000,
   "descripcion": "Medidas 1.50 x 2 m Funda armazon granero (ver catálogo de fundas) $25.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Armazón granero",
   "precio": 123000,
   "descripcion": "Armazón de hierro tipo granero. La funda se pide aparte (Funda para armazón granero).\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "1,50 × 2 m",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "fundas-mesa-torta",
  "antes": {
   "nombre": "Fundas mesa torta",
   "precio": 28000,
   "descripcion": "Fundas para la mesa torta de pino Medidas de la mesa 50x28 40x28 30x35 CATALOGO DE FUNDAS",
   "medidas": null
  },
  "despues": {
   "nombre": "Funda para mesa torta",
   "precio": 28000,
   "descripcion": "Funda para la mesa torta de pino.",
   "medidas": "Para mesas de 50 × 28, 40 × 28 y 30 × 35 cm",
   "variantes": [],
   "categoria": "fundas-y-telas"
  }
 },
 {
  "slug": "cubo-con-malla-x-unidad",
  "antes": {
   "nombre": "Cubo con malla x unidad",
   "precio": 110000,
   "descripcion": "Cubo con malla solo armazon 50x50x75 $115.000 40x40x65 $110.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Cubo con malla (por unidad)",
   "precio": 110000,
   "descripcion": "Cubo de hierro con malla, solo armazón.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "40 × 40 × 65 cm",
     "precio": 110000
    },
    {
     "etiqueta": "50 × 50 × 75 cm",
     "precio": 115000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "panel-arcada-190x60",
  "antes": {
   "nombre": "Panel arcada 190x60",
   "precio": 55000,
   "descripcion": "Panel madera arcada Medidas 60x190",
   "medidas": null
  },
  "despues": {
   "nombre": "Panel arcada 190x60",
   "precio": 55000,
   "descripcion": "Panel madera arcada Medidas 60x190",
   "medidas": null,
   "variantes": [],
   "categoria": "madera"
  }
 },
 {
  "slug": "jaula",
  "antes": {
   "nombre": "Jaula",
   "precio": 35500,
   "descripcion": "Jaula Colores a elección La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Jaula",
   "precio": 35500,
   "descripcion": "Jaula decorativa.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "alzada-hierro-con-pie-para-un-plato",
  "antes": {
   "nombre": "Alzada hierro con pie para un plato",
   "precio": 45000,
   "descripcion": "Alzada de hierro p un plato 28cm de diámetro Alto 85cm aprox La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Alzada de hierro con pie",
   "precio": 45000,
   "descripcion": "Alzada de hierro con pie, para un plato.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "Plato de 28 cm de diámetro · 85 cm de alto aprox.",
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "mesitas-pentagono-x-unidad",
  "antes": {
   "nombre": "Mesitas pentagono x unidad",
   "precio": 80500,
   "descripcion": "Combo x2 mesas solo armazon $144.000 Por unidad $80.500 No hacemos las maderas de este combo",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesitas pentágono",
   "precio": 80500,
   "descripcion": "Mesitas pentágono de hierro, solo armazón (las maderas de este modelo no las hacemos).",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "Unidad",
     "precio": 80500
    },
    {
     "etiqueta": "Combo x2",
     "precio": 144000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "sillon-sweet",
  "antes": {
   "nombre": "Sillón Sweet",
   "precio": 174000,
   "descripcion": "Sillón Sweet solo armazón 2x2m Entran 2 personas La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Sillón Sweet",
   "precio": 174000,
   "descripcion": "Sillón de hierro, solo armazón. Entran 2 personas.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "2 × 2 m",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "caja-barbie-tamano-real",
  "antes": {
   "nombre": "Caja Barbie tamaño real",
   "precio": 99000,
   "descripcion": "Caja de barbie pintada Pintada $150.000 Medidas 1.70x90x60",
   "medidas": null
  },
  "despues": {
   "nombre": "Caja Barbie tamaño real",
   "precio": 99000,
   "descripcion": "Caja de barbie pintada Pintada $150.000 Medidas 1.70x90x60",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "funda-aro-2m",
  "antes": {
   "nombre": "Funda Aro 2m",
   "precio": 38000,
   "descripcion": "Funda con elastico para aro 2m de diámetro CATALOGO DE FUNDAS",
   "medidas": null
  },
  "despues": {
   "nombre": "Funda para aro de 2 m",
   "precio": 38000,
   "descripcion": "Funda con elástico para aro de 2 m de diámetro.",
   "medidas": null,
   "variantes": [],
   "categoria": "fundas-y-telas"
  }
 },
 {
  "slug": "fundas-mesa-cubo",
  "antes": {
   "nombre": "Fundas Mesa Cubo",
   "precio": 38000,
   "descripcion": "Fundas para las Mesa cubo Medidas 30x55 40x65 50x75 CATALOGO DE FUNDAS",
   "medidas": null
  },
  "despues": {
   "nombre": "Fundas para mesa cubo",
   "precio": 38000,
   "descripcion": "Fundas para mesas cubo.",
   "medidas": "30 × 55 · 40 × 65 · 50 × 75 cm",
   "variantes": [],
   "categoria": "fundas-y-telas"
  }
 },
 {
  "slug": "arcada-romana-xl",
  "antes": {
   "nombre": "Arcada Romana XL",
   "precio": 396000,
   "descripcion": "Arcada Romana XL 2X3 con entrada XL Color a eleccion",
   "medidas": null
  },
  "despues": {
   "nombre": "Arcada romana XL",
   "precio": 396000,
   "descripcion": "Arcada romana con entrada XL.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "2 × 3 m",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "corona",
  "antes": {
   "nombre": "Corona",
   "precio": 66500,
   "descripcion": "Corona de hierro Medidas: Largo 1m aproximadamente Tiene 2 ganchitos La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Corona",
   "precio": 66500,
   "descripcion": "Corona de hierro con 2 ganchitos.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "1 m de largo aprox.",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "funda-armazon-granero",
  "antes": {
   "nombre": "Funda armazón Granero",
   "precio": 25000,
   "descripcion": "Funda con elastico para armazón granero 2 x 1.50 CATALOGO DE FUNDAS",
   "medidas": null
  },
  "despues": {
   "nombre": "Funda para armazón granero",
   "precio": 25000,
   "descripcion": "Funda con elástico para el armazón granero.",
   "medidas": "2 × 1,50 m",
   "variantes": [],
   "categoria": "fundas-y-telas"
  }
 },
 {
  "slug": "alzada-16-lazos-espiralada",
  "antes": {
   "nombre": "Alzada 16 lazos espiralada",
   "precio": 54500,
   "descripcion": "Alzada Colores a elección La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Alzada espiralada de 16 lazos",
   "precio": 54500,
   "descripcion": "Alzada espiralada.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "cohete-mdf-50cm-de-alto",
  "antes": {
   "nombre": "Cohete mdf 50cm de alto",
   "precio": 12000,
   "descripcion": "Cohete mdf 50cm de alto 15% de recargo x link de mercado pago",
   "medidas": null
  },
  "despues": {
   "nombre": "Cohete MDF 50cm de alto",
   "precio": 12000,
   "descripcion": "Cohete MDF 50cm de alto",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "columna-mariposa",
  "antes": {
   "nombre": "Columna mariposa",
   "precio": 94000,
   "descripcion": "Columnas con mariposa de hierro Llegan a 1.50cm de alto Mariposa 60cm $94.000 Mariposa 90cm $105.000 En hierro tenes descuento por tranferencia!",
   "medidas": null
  },
  "despues": {
   "nombre": "Columna mariposa",
   "precio": 94000,
   "descripcion": "Columna de hierro con mariposa.",
   "medidas": "Hasta 1,50 m de alto",
   "variantes": [
    {
     "etiqueta": "Mariposa de 60 cm",
     "precio": 94000
    },
    {
     "etiqueta": "Mariposa de 90 cm",
     "precio": 105000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "porton-merlina-halloween",
  "antes": {
   "nombre": "Portón Merlina Halloween",
   "precio": 94000,
   "descripcion": "Pintado $144.000 3 piezas Medidas 180x1 aprox",
   "medidas": null
  },
  "despues": {
   "nombre": "Portón Merlina (Halloween)",
   "precio": 94000,
   "descripcion": "Portón en 3 piezas.",
   "medidas": "1,80 × 1 m aprox.",
   "variantes": [
    {
     "etiqueta": "Sin pintar",
     "precio": 94000
    },
    {
     "etiqueta": "Pintado",
     "precio": 144000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "funda-semi-arcada-pino",
  "antes": {
   "nombre": "Funda Semi Arcada pino",
   "precio": 16000,
   "descripcion": "Funda con elastico para semi arcada de pino 1.60x60 CATALOGO DE FUNDAS",
   "medidas": null
  },
  "despues": {
   "nombre": "Funda para semiarcada de pino",
   "precio": 16000,
   "descripcion": "Funda con elástico para semiarcada de pino.",
   "medidas": "1,60 × 0,60 m",
   "variantes": [],
   "categoria": "fundas-y-telas"
  }
 },
 {
  "slug": "doble-arcada-hierro",
  "antes": {
   "nombre": "Doble arcada hierro",
   "precio": 281000,
   "descripcion": "Doble arcada hierro Medidas y precios Combo 1 doble arcada ($303.000) 2.20 X 1.50m aprox $185.500 2.00 X 1.10m aprox $123.500 Combo 2 doble arcada ($281.000) 2.40 X 1.80m aprox $200.000 2.20 X 1.20m aprox $133.000 15% de recargo x link de Mercado pago",
   "medidas": null
  },
  "despues": {
   "nombre": "Doble arcada de hierro",
   "precio": 123500,
   "descripcion": "Dos arcadas de hierro, una dentro de la otra. Se venden en combo o cada una por separado. Medidas aproximadas.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "Combo 1: 2,20 × 1,50 + 2,00 × 1,10 m",
     "precio": 303000
    },
    {
     "etiqueta": "Combo 2: 2,40 × 1,80 + 2,20 × 1,20 m",
     "precio": 281000
    },
    {
     "etiqueta": "Sola 2,20 × 1,50 m",
     "precio": 185500
    },
    {
     "etiqueta": "Sola 2,00 × 1,10 m",
     "precio": 123500
    },
    {
     "etiqueta": "Sola 2,40 × 1,80 m",
     "precio": 200000
    },
    {
     "etiqueta": "Sola 2,20 × 1,20 m",
     "precio": 133000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "columna-mickey-hierro-desarmable",
  "antes": {
   "nombre": "Columna Mickey hierro desarmable",
   "precio": 75000,
   "descripcion": "Estructura Mickey hierro Alto 2 m Diámetro de aro 1m La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Columna Mickey de hierro",
   "precio": 75000,
   "descripcion": "Estructura Mickey de hierro, desarmable.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "2 m de alto · aro de 1 m de diámetro",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesa-hamaca",
  "antes": {
   "nombre": "Mesa hamaca",
   "precio": 173000,
   "descripcion": "Mesa hamaca 1.50 x 2 desarmable La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa hamaca",
   "precio": 173000,
   "descripcion": "Mesa hamaca de hierro, desarmable.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "1,50 × 2 m",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "arco-para-luces-fijo-o-extendible",
  "antes": {
   "nombre": "Arco para luces fijo o extendible",
   "precio": 349000,
   "descripcion": "Arco de hierro para cortina de luces es extensible! de 2x2x2 extensible a 2x3x3 $349.000 de 2x2x2 extensible a 3x3x3 $427.000 Dato extra!!!! Se pueden usar solo los extendibles p eventos diferentes o sectores diferentes!!! Super practicos y varios usos!!!",
   "medidas": null
  },
  "despues": {
   "nombre": "Arco para luces extensible",
   "precio": 349000,
   "descripcion": "Arco de hierro para cortina de luces. Los tramos extensibles también se usan solos, en otro evento o en otro sector.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "De 2×2×2 a 2×3×3 m",
     "precio": 349000
    },
    {
     "etiqueta": "De 2×2×2 a 3×3×3 m",
     "precio": 427000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "tunel-hexagonal-desarmable",
  "antes": {
   "nombre": "Túnel Hexagonal desarmable",
   "precio": null,
   "descripcion": "*Túnel hexagonal x 3 (desarmable)* 2.20 de alto x 2.50 de ancho aprox $295.000 2.50 de alto x 3 de ancho aprox $324.000 *Túnel hexagonal x 4 (desarmable)* 2.50 de alto x 3 de ancho aprox $386.000 *Túnel hexagonal x 5 (desarmable)* 2.50 de alto x 3 de ancho aprox $438.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Túnel hexagonal desarmable",
   "precio": 295000,
   "descripcion": "Túnel de hexágonos de hierro, desarmable, de 3, 4 o 5 módulos. Medidas de alto × ancho, aproximadas.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "x3 · 2,20 × 2,50 m",
     "precio": 295000
    },
    {
     "etiqueta": "x3 · 2,50 × 3 m",
     "precio": 324000
    },
    {
     "etiqueta": "x4 · 2,50 × 3 m",
     "precio": 386000
    },
    {
     "etiqueta": "x5 · 2,50 × 3 m",
     "precio": 438000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "alzada-corona",
  "antes": {
   "nombre": "Alzada Corona",
   "precio": 34500,
   "descripcion": "Alzada de hierro con madera $49.000 Solo armazon $34.500 Medidas 25cm de diámetro 18 cm de alto La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Alzada Corona",
   "precio": 34500,
   "descripcion": "Alzada de hierro.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "25 cm de diámetro × 18 cm de alto",
   "variantes": [
    {
     "etiqueta": "Solo armazón",
     "precio": 34500
    },
    {
     "etiqueta": "Con madera",
     "precio": 49000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "eclipse-xl",
  "antes": {
   "nombre": "Eclipse XL",
   "precio": 72000,
   "descripcion": "Eclipse XL Con maderas $192.000 Medida 1m x 58cm Colores a elección",
   "medidas": null
  },
  "despues": {
   "nombre": "Eclipse XL",
   "precio": 72000,
   "descripcion": "Estantería Eclipse XL de hierro.\nColores: a elección.",
   "medidas": "1 m × 58 cm",
   "variantes": [
    {
     "etiqueta": "Sin maderas",
     "precio": 72000
    },
    {
     "etiqueta": "Con maderas",
     "precio": 192000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "par-de-columnas-parentesis",
  "antes": {
   "nombre": "Par de columnas paréntesis",
   "precio": 71000,
   "descripcion": "Columnas paréntesis de hierro para flores Par de columnas parentesis de 1.20 de alto $71.000 Par de columnas parentesis de 1.90 de alto $80.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Par de columnas paréntesis",
   "precio": 71000,
   "descripcion": "Par de columnas paréntesis de hierro para flores.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "1,20 m de alto",
     "precio": 71000
    },
    {
     "etiqueta": "1,90 m de alto",
     "precio": 80000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "posa-torta-triangulo",
  "antes": {
   "nombre": "Posa torta triángulo",
   "precio": 30000,
   "descripcion": "Posa torta hierro y madera 22cm de díametro La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Posatorta triángulo",
   "precio": 30000,
   "descripcion": "Posatorta de hierro y madera.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "22 cm de diámetro",
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "arco-extensible-3x4-con-soporte",
  "antes": {
   "nombre": "Arco extensible 3x4 con soporte",
   "precio": 182000,
   "descripcion": "Arco extensible base pesada con soporte 3x4 $182.000 4x4 $237.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Arco extensible con soporte",
   "precio": 182000,
   "descripcion": "Arco extensible con base pesada y soporte.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "3 × 4 m",
     "precio": 182000
    },
    {
     "etiqueta": "4 × 4 m",
     "precio": 237000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "columna-mariposa-hierro-solo-contorno",
  "antes": {
   "nombre": "Columna Mariposa hierro solo contorno",
   "precio": 94000,
   "descripcion": "Columna mariposa hierro dorada plateada rosa gold Mariposa 60cm $94.000 Maripsoa 90cm $105.000 Pie regulable hasta 1.50 Colores a eleccion",
   "medidas": null
  },
  "despues": {
   "nombre": "Columna mariposa (solo contorno)",
   "precio": 94000,
   "descripcion": "Columna mariposa de hierro, solo contorno, con pie regulable.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "Pie regulable hasta 1,50 m",
   "variantes": [
    {
     "etiqueta": "Mariposa de 60 cm",
     "precio": 94000
    },
    {
     "etiqueta": "Mariposa de 90 cm",
     "precio": 105000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "arcada-ventana-2x1-desarmable",
  "antes": {
   "nombre": "Arcada ventana 2x1 desarmable",
   "precio": 160000,
   "descripcion": "Arcada ventana 2x1 Arcada ventana 2.50x1.50 $178.000 Desarmable Color a eleccion",
   "medidas": null
  },
  "despues": {
   "nombre": "Arcada ventana desarmable",
   "precio": 160000,
   "descripcion": "Arcada ventana de hierro, desarmable.\nColores: a elección.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "2 × 1 m",
     "precio": 160000
    },
    {
     "etiqueta": "2,50 × 1,50 m",
     "precio": 178000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "arcada-hierro-2x2",
  "antes": {
   "nombre": "Arcada hierro 2x2",
   "precio": 94000,
   "descripcion": "Arcada hierro para entrada desarmable Medidas 2x2 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Arcada de hierro 2 × 2",
   "precio": 94000,
   "descripcion": "Arcada de hierro para entrada, desarmable.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "2 × 2 m",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesa-puente-desarmable-mdf",
  "antes": {
   "nombre": "Mesa puente desarmable mdf",
   "precio": 97500,
   "descripcion": "Mesa puente mdf Medidas: 35x60, 40x70, 45x80 (plegables) Pintado $127.500",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa puente desarmable MDF",
   "precio": 97500,
   "descripcion": "Mesa puente MDF Medidas: 35x60, 40x70, 45x80 (plegables) Pintado $127.500",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "mesa-octogonal",
  "antes": {
   "nombre": "Mesa octogonal",
   "precio": 99000,
   "descripcion": "Mesa octogonal Medidas: 60x75 Solo armazón $85.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa octogonal",
   "precio": 99000,
   "descripcion": "Mesa octogonal de hierro. Solo armazón: $85.000.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "60 × 75 cm",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "columna-con-circulos",
  "antes": {
   "nombre": "Columna con circulos",
   "precio": 71000,
   "descripcion": "Columna de aros de hierro para flores Columna de 1.90 de alto $71.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Columna con círculos",
   "precio": 71000,
   "descripcion": "Columna de aros de hierro para flores.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "1,90 m de alto",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "arcada-de-hierro-95x2",
  "antes": {
   "nombre": "Arcada de hierro 95x2",
   "precio": 95000,
   "descripcion": "Arcada 95x2 Combo x3 $256.000 (cualquier formato) La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Arcada de hierro 95 × 2",
   "precio": 95000,
   "descripcion": "Arcada de hierro. En combo x3 la combinás con semiarcadas y arcadas rectas, en el formato que quieras.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "0,95 × 2 m",
   "variantes": [
    {
     "etiqueta": "Unidad",
     "precio": 95000
    },
    {
     "etiqueta": "Combo x3",
     "precio": 256000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "entrada-estrella",
  "antes": {
   "nombre": "Entrada estrella",
   "precio": 99000,
   "descripcion": "Estrella hierro desarmable Medidas: 2m x 2m caño 15-15 $99.000 2.50 x 2.50 caño 20-20 $212.000 3.50 x 3.50 caño 30-30 $302.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Entrada estrella",
   "precio": 99000,
   "descripcion": "Estrella de hierro desarmable.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "2 × 2 m · caño 15-15",
     "precio": 99000
    },
    {
     "etiqueta": "2,50 × 2,50 m · caño 20-20",
     "precio": 212000
    },
    {
     "etiqueta": "3,50 × 3,50 m · caño 30-30",
     "precio": 302000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "cactus",
  "antes": {
   "nombre": "Cactus",
   "precio": 8500,
   "descripcion": "Cactus pino 50cm aprox Pintado $13.500",
   "medidas": null
  },
  "despues": {
   "nombre": "Cactus",
   "precio": 8500,
   "descripcion": "Cactus pino 50cm aprox Pintado $13.500",
   "medidas": null,
   "variantes": [],
   "categoria": "madera"
  }
 },
 {
  "slug": "bandeja-huesito-mdf",
  "antes": {
   "nombre": "Bandeja huesito mdf",
   "precio": 4900,
   "descripcion": "15% de recargo x link mercado pago Medida 22cm aprox",
   "medidas": null
  },
  "despues": {
   "nombre": "Bandeja huesito (MDF)",
   "precio": 4900,
   "descripcion": "Bandeja de MDF con forma de huesito.",
   "medidas": "22 cm aprox.",
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "bases-rectangulares-20x30",
  "antes": {
   "nombre": "Bases rectangulares 20x30",
   "precio": 9000,
   "descripcion": "15% de recargo x link de mercado pago Bases rectangulares colores a elección Consultar x otras medidas",
   "medidas": null
  },
  "despues": {
   "nombre": "Bases rectangulares 20 × 30",
   "precio": 9000,
   "descripcion": "Bases rectangulares. Consultanos por otras medidas.\nColores: a elección.",
   "medidas": "20 × 30 cm",
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "combo-x-5-mesas-diamante",
  "antes": {
   "nombre": "Combo x 5 mesas diamante",
   "precio": 330000,
   "descripcion": "Combo x 5 mesas armazones Medidas 50x75x90 40x40x75 30x30x90 Solo armazon $330.000 Con la madera $440.000 Combo x 3 (mesa principial y 2 a eleccion de las otras) Solo armazon $223.000 Con maderas $293.000 PRECIOS INDIVIDUALES 40x40x75 solo armazon $79.000 30x30x90 solo armazon $79.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Combo x5 mesas diamante",
   "precio": 79000,
   "descripcion": "Mesas diamante de hierro en combo de 5, de 3 (la principal y 2 a elección) o por unidad.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "50 × 75 × 90 · 40 × 40 × 75 · 30 × 30 × 90 cm",
   "variantes": [
    {
     "etiqueta": "Combo x5 solo armazón",
     "precio": 330000
    },
    {
     "etiqueta": "Combo x5 con maderas",
     "precio": 440000
    },
    {
     "etiqueta": "Combo x3 solo armazón",
     "precio": 223000
    },
    {
     "etiqueta": "Combo x3 con maderas",
     "precio": 293000
    },
    {
     "etiqueta": "40 × 40 × 75 solo armazón",
     "precio": 79000
    },
    {
     "etiqueta": "30 × 30 × 90 solo armazón",
     "precio": 79000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "aro-mickey",
  "antes": {
   "nombre": "Aro Mickey",
   "precio": 170000,
   "descripcion": "Solo orejas $74.000 Medidas: Aro de hierro 1.50cm de diametro Alto 2m aprox con las orejas (Tambien lo podes pedir con pies) Desarmable",
   "medidas": null
  },
  "despues": {
   "nombre": "Aro Mickey",
   "precio": 74000,
   "descripcion": "Aro de hierro con orejas, desarmable. También se puede pedir con pies.",
   "medidas": "Aro de 1,50 m de diámetro · 2 m de alto aprox. con las orejas",
   "variantes": [
    {
     "etiqueta": "Aro con orejas",
     "precio": 170000
    },
    {
     "etiqueta": "Solo las orejas",
     "precio": 74000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesas-isla",
  "antes": {
   "nombre": "Mesas Isla",
   "precio": 348000,
   "descripcion": "Combo x5 mesas de hierro Con maderas $468.000 2cm pintado y barnizado Medidas: 1 mesa central de 1m de alto x 40cm de diametro 4 mesas en los costados de 80cm de alto x 40cm de profundidad El diametro final es de 1.20, cada uno le da la abertura que necesite",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesas Isla",
   "precio": 348000,
   "descripcion": "Combo de 5 mesas de hierro: una central y cuatro a los costados, que abrís como necesites. La madera es de 2 cm, pintada y barnizada.",
   "medidas": "Central de 1 m de alto × 40 cm de diámetro · 4 laterales de 80 cm de alto × 40 cm de profundidad · diámetro final 1,20 m",
   "variantes": [
    {
     "etiqueta": "Sin maderas",
     "precio": 348000
    },
    {
     "etiqueta": "Con maderas",
     "precio": 468000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "vuelta-al-mundo-2x2",
  "antes": {
   "nombre": "Vuelta al mundo 2x2",
   "precio": 517000,
   "descripcion": "Vuelta al mundo hierro Medida 2x2 no gira Es desarmable La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Vuelta al mundo 2 × 2",
   "precio": 517000,
   "descripcion": "Vuelta al mundo de hierro, desarmable. No gira.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "2 × 2 m",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "hexagonales",
  "antes": {
   "nombre": "Hexagonales",
   "precio": 99000,
   "descripcion": "Combo x3 Hexgonales Medidas 30x55 40x65 50x75",
   "medidas": null
  },
  "despues": {
   "nombre": "Hexagonales",
   "precio": 99000,
   "descripcion": "Combo x3 Hexgonales Medidas 30x55 40x65 50x75",
   "medidas": null,
   "variantes": [],
   "categoria": "madera"
  }
 },
 {
  "slug": "comoda-maru",
  "antes": {
   "nombre": "Cómoda Maru",
   "precio": 60000,
   "descripcion": "Cómoda Maru de pino Las podes pedir con reja Medidas 60x40x55",
   "medidas": null
  },
  "despues": {
   "nombre": "Cómoda Maru",
   "precio": 60000,
   "descripcion": "Cómoda Maru de pino Las podés pedir con reja Medidas 60x40x55",
   "medidas": null,
   "variantes": [],
   "categoria": "madera"
  }
 },
 {
  "slug": "arcada-entrada-doble",
  "antes": {
   "nombre": "Arcada entrada doble",
   "precio": 212000,
   "descripcion": "Arcada entrada doble base pesada Medidas: 2.50m de ancho x 2m de alto La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Arcada de entrada doble",
   "precio": 212000,
   "descripcion": "Arcada doble para entrada, con base pesada.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "2,50 m de ancho × 2 m de alto",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesa-mariposa",
  "antes": {
   "nombre": "Mesa mariposa",
   "precio": 119000,
   "descripcion": "Mesa mariposa mdf desarmable Medidas 80x80 Pintado $189.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa mariposa",
   "precio": 119000,
   "descripcion": "Mesa mariposa MDF desarmable Medidas 80x80 Pintado $189.000",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "torre-cupcakes-hexagonal-2-x-1",
  "antes": {
   "nombre": "Torre cupcakes hexagonal 2 x 1",
   "precio": 30000,
   "descripcion": "15% de recargo x link de mercado pago Colores a elección La usas como torre o cómo alzadas divinas!",
   "medidas": null
  },
  "despues": {
   "nombre": "Torre de cupcakes hexagonal 2 en 1",
   "precio": 30000,
   "descripcion": "La usás como torre de cupcakes o separada, como alzadas.\nColores: a elección.",
   "medidas": null,
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "combo-x-3-mesas-nordicas-pino",
  "antes": {
   "nombre": "Combo x 3 mesas nórdicas pino",
   "precio": 60000,
   "descripcion": "Combo x 3 mesas nórdicas de pino Medidas aprox 40x60 40x55 35x50",
   "medidas": null
  },
  "despues": {
   "nombre": "Combo x 3 mesas nórdicas pino",
   "precio": 60000,
   "descripcion": "Combo x 3 mesas nórdicas de pino Medidas aprox 40x60 40x55 35x50",
   "medidas": null,
   "variantes": [],
   "categoria": "madera"
  }
 },
 {
  "slug": "mariposa",
  "antes": {
   "nombre": "Mariposa",
   "precio": 8000,
   "descripcion": "Mariposa mdf De 50cm de alto $8.000 sin pintar •pintada $16.000 De 1m de alto aprox $22.000 sin pintar •pintada $44.000 De 1.50 de alto $37.000 sin pintar •pintada $74.000 De 2m de alto (segundo modelo) $99.000 sin pintar •pintada $198.000 Cada mitad $56.500",
   "medidas": null
  },
  "despues": {
   "nombre": "Mariposa",
   "precio": 8000,
   "descripcion": "Mariposa MDF De 50cm de alto $8.000 sin pintar •pintada $16.000 De 1m de alto aprox $22.000 sin pintar •pintada $44.000 De 1.50 de alto $37.000 sin pintar •pintada $74.000 De 2m de alto (segundo modelo) $99.000 sin pintar •pintada $198.000 Cada mitad $56.500",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "funda-aro-1-20",
  "antes": {
   "nombre": "Funda Aro 1.20",
   "precio": 16000,
   "descripcion": "Funda con elastico para aro 1.20 de diámetro CATALOGO DE FUNDAS",
   "medidas": null
  },
  "despues": {
   "nombre": "Funda para aro de 1,20 m",
   "precio": 16000,
   "descripcion": "Funda con elástico para aro de 1,20 m de diámetro.",
   "medidas": null,
   "variantes": [],
   "categoria": "fundas-y-telas"
  }
 },
 {
  "slug": "combo-x-3-cilindros-malla",
  "antes": {
   "nombre": "Combo x 3 cilindros malla",
   "precio": 207000,
   "descripcion": "Combo x 3 cilindros malla solo armazón Medidas 50x75 40x65 30x55 Con maderas $282.000 PRECIOS INDIVIDUALES (sin madera) 50x75 $92.000 40x65 $89.000 30x55 $87.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Cilindros con malla",
   "precio": 87000,
   "descripcion": "Cilindros de hierro con malla, en combo de 3 o por unidad (diámetro × alto, en cm).\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "Combo x3 solo armazón",
     "precio": 207000
    },
    {
     "etiqueta": "Combo x3 con maderas",
     "precio": 282000
    },
    {
     "etiqueta": "50 × 75 sin madera",
     "precio": 92000
    },
    {
     "etiqueta": "40 × 65 sin madera",
     "precio": 89000
    },
    {
     "etiqueta": "30 × 55 sin madera",
     "precio": 87000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "pie-para-flores",
  "antes": {
   "nombre": "Pie para flores",
   "precio": 40000,
   "descripcion": "Pie con base pesada para poner 3 flores de organza Unidad $40.000 Par $63.000 Medidas:",
   "medidas": null
  },
  "despues": {
   "nombre": "Pie para flores",
   "precio": 40000,
   "descripcion": "Pie con base pesada para 3 flores de organza.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "Unidad",
     "precio": 40000
    },
    {
     "etiqueta": "Par",
     "precio": 63000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesa-frozen",
  "antes": {
   "nombre": "Mesa frozen",
   "precio": 100000,
   "descripcion": "Mesa Frozen mdf desarmable Medidas 80x80cm Pintada $130.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa frozen",
   "precio": 100000,
   "descripcion": "Mesa Frozen MDF desarmable Medidas 80x80cm Pintada $130.000",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "arcada-3d-arcoiris-2-x-1",
  "antes": {
   "nombre": "Arcada 3d arcoiris 2 x 1",
   "precio": 219000,
   "descripcion": "Medidas 2x1 Sin pintar $219.000 Pintada $270.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Arcada 3D arcoíris",
   "precio": 219000,
   "descripcion": "Arcada arcoíris 3D.",
   "medidas": "2 × 1 m",
   "variantes": [
    {
     "etiqueta": "Sin pintar",
     "precio": 219000
    },
    {
     "etiqueta": "Pintada",
     "precio": 270000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "aro-de-hierro-1-20-1-50-2-00",
  "antes": {
   "nombre": "Aro de hierro 1.20/1.50/2.00",
   "precio": 99000,
   "descripcion": "Aro de hierro Hacemos de la medida que quieras! Son de 2m de alto, lo que varia es el diametro 2m x 2m 1.50 x 2m 1.20 x 2m Color a eleccion",
   "medidas": null
  },
  "despues": {
   "nombre": "Aro de hierro",
   "precio": 99000,
   "descripcion": "Aro de hierro de 2 m de alto; lo que cambia es el diámetro. También lo hacemos a la medida que necesites.\nColores: a elección.",
   "medidas": "1,20, 1,50 o 2 m de diámetro × 2 m de alto",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "alzada-2-platos-de-hierro",
  "antes": {
   "nombre": "Alzada 2 platos de hierro",
   "precio": 35000,
   "descripcion": "Alzada 2 platos hierro La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Alzada de 2 platos",
   "precio": 35000,
   "descripcion": "Alzada de hierro de 2 platos.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesa-falsa-v",
  "antes": {
   "nombre": "Mesa falsa V",
   "precio": 60500,
   "descripcion": "Mesa desarmable falsa V Medidas 1x80x40 Pintado $90.500 Tapa cajón $70.500 Pintado $105.500",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa falsa V",
   "precio": 60500,
   "descripcion": "Mesa desarmable falsa V Medidas 1x80x40 Pintado $90.500 Tapa cajón $70.500 Pintado $105.500",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "panel-espiralado-80x80",
  "antes": {
   "nombre": "Panel espiralado 80x80",
   "precio": 45000,
   "descripcion": "Panel espiralado desarmable Ranurado o liso Podes usarlo de los dos lados Medidas 80x80 Pintado $70.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Panel espiralado 80x80",
   "precio": 45000,
   "descripcion": "Panel espiralado desarmable Ranurado o liso Podes usarlo de los dos lados Medidas 80x80 Pintado $70.000",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "mesas-glowsweet",
  "antes": {
   "nombre": "Mesas Glowsweet",
   "precio": 93000,
   "descripcion": "Mesas GlowSweet! *Opciones por unidad* 40x75 $113.000 sin maderas _$138.000 con madera_ 40x65 $108.000 sin maderas _$133.000 con madera_ 40x55 $98.000 sin maderas _$123.000 con madera_ 40x45 $93.000 sin maderas _$118.000 con madera_ *Opciones de combos x 2* (75 y 55) $200.000 sin maderas _$250.000 con maderas_ (65 y 45) $190.000 sin maderas _$240.000 con maderas_ (75 y 65) $209.000 sin maderas _$259.000 con maderas_ (55 y 45) $181.000 sin madera _$231.000 con maderas_ (75 y 45) $195.000 sin madera _$245.000 con maderas_ (65 y 55) $195.000 sin madera _$245.000 con maderas_ *Combo x 3* Elegir las 3 , y a los precios por unidad se les hace un %10 de descuento *Combo x 4* $350.000 sin maderas _$450.000 con maderas_",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesas GlowSweet",
   "precio": 93000,
   "descripcion": "Mesas GlowSweet por unidad o en combo (diámetro × alto, en cm). Combos de 2 mesas desde $181.000 sin maderas; en el combo de 3 elegís las mesas y tienen 10 % de descuento sobre el precio por unidad.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "40 × 45 sin maderas",
     "precio": 93000
    },
    {
     "etiqueta": "40 × 45 con madera",
     "precio": 118000
    },
    {
     "etiqueta": "40 × 55 sin maderas",
     "precio": 98000
    },
    {
     "etiqueta": "40 × 55 con madera",
     "precio": 123000
    },
    {
     "etiqueta": "40 × 65 sin maderas",
     "precio": 108000
    },
    {
     "etiqueta": "40 × 65 con madera",
     "precio": 133000
    },
    {
     "etiqueta": "40 × 75 sin maderas",
     "precio": 113000
    },
    {
     "etiqueta": "40 × 75 con madera",
     "precio": 138000
    },
    {
     "etiqueta": "Combo x4 sin maderas",
     "precio": 350000
    },
    {
     "etiqueta": "Combo x4 con maderas",
     "precio": 450000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "estanteria-star",
  "antes": {
   "nombre": "Estanteria Star",
   "precio": 57000,
   "descripcion": "Estanteria Star Con maderas $77.000 Medida 60cm aprox Colores a eleccion",
   "medidas": null
  },
  "despues": {
   "nombre": "Estantería Star",
   "precio": 57000,
   "descripcion": "Estantería Star de hierro.\nColores: a elección.",
   "medidas": "60 cm aprox.",
   "variantes": [
    {
     "etiqueta": "Sin maderas",
     "precio": 57000
    },
    {
     "etiqueta": "Con maderas",
     "precio": 77000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "base-ovalada-espiralada-mdf-20x30",
  "antes": {
   "nombre": "Base ovalada espiralada mdf 20x30",
   "precio": 9000,
   "descripcion": "Base espiralada ovalada mdf Medida 20x30 Color a elección 15% de recargo x link de mercado pago",
   "medidas": null
  },
  "despues": {
   "nombre": "Base ovalada espiralada MDF 20x30",
   "precio": 9000,
   "descripcion": "Base espiralada ovalada MDF Medida 20x30 Color a elección",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "hexagono-doble",
  "antes": {
   "nombre": "Hexagono doble",
   "precio": 152000,
   "descripcion": "Doble hexágono de hierro Medidas La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Hexágono doble",
   "precio": 152000,
   "descripcion": "Doble hexágono de hierro.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "arbol-de-navidad",
  "antes": {
   "nombre": "Arbol de navidad",
   "precio": 149000,
   "descripcion": "Estructura árbol navidad de hierro desarmable Medidas: 1.20m de ancho x 2m de alto $169.000 1.80m de ancho x 3m de alto $262.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Árbol de Navidad",
   "precio": 149000,
   "descripcion": "Estructura de árbol de Navidad de hierro, desarmable. Medidas y precios publicados: 1,20 × 2 m, $169.000 · 1,80 × 3 m, $262.000.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "columna-hierro-corazon",
  "antes": {
   "nombre": "Columna hierro corazon",
   "precio": 71000,
   "descripcion": "Columna hierro corazon Medidas 1.90 de alto y ancho aprox 1 m X link mp 15% de recargo",
   "medidas": null
  },
  "despues": {
   "nombre": "Columna de hierro corazón",
   "precio": 71000,
   "descripcion": "Columna de hierro con corazón.",
   "medidas": "1,90 m de alto · 1 m de ancho aprox.",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "arcada-romana",
  "antes": {
   "nombre": "Arcada Romana",
   "precio": 352000,
   "descripcion": "Arcada Romana 2.40x1.80 $352.000 Arcada Romana 2x3 $396.000 Arcada Romana 3x3 $454.000 Extension de 1 m sola $58.000 COLUMNAS 45x45x2 $137.000 c/u 45x45x1.60 $129.000 c/u La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Arcada romana",
   "precio": 352000,
   "descripcion": "Arcada romana de hierro.\nAdicionales: extensión de 1 m, $58.000 · columnas de 45 × 45 × 2 m, $137.000 c/u · de 45 × 45 × 1,60 m, $129.000 c/u.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "2,40 × 1,80 m",
     "precio": 352000
    },
    {
     "etiqueta": "2 × 3 m",
     "precio": 396000
    },
    {
     "etiqueta": "3 × 3 m",
     "precio": 454000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "torre-cupcakes-o-alzadas-2-en-1",
  "antes": {
   "nombre": "Torre cupcakes o alzadas 2 en 1",
   "precio": 30000,
   "descripcion": "15% de recargo x link Mercado pago Torre de cupcakes desarmable la usas como torre o la separas y te quedan alzadas p tortas Colores a elección",
   "medidas": null
  },
  "despues": {
   "nombre": "Torre de cupcakes o alzadas 2 en 1",
   "precio": 30000,
   "descripcion": "Torre de cupcakes desarmable: la usás como torre o la separás y te quedan alzadas para tortas.\nColores: a elección.",
   "medidas": null,
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "arco-extensible-doble-barral",
  "antes": {
   "nombre": "Arco extensible doble barral",
   "precio": 174000,
   "descripcion": "Arco extensible doble barral 2 x 1.50 extensible a 3 m Base pesada La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Arco extensible doble barral",
   "precio": 174000,
   "descripcion": "Arco extensible de doble barral con base pesada.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "2 × 1,50 m, extensible a 3 m",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "combo-x-3-cilindros-tradicionales",
  "antes": {
   "nombre": "Combo x 3 cilindros tradicionales",
   "precio": 85000,
   "descripcion": "Combo x 3 cilindros tradicionales encastrables Medidas 50x75 40x65 30x55",
   "medidas": null
  },
  "despues": {
   "nombre": "Combo x 3 cilindros tradicionales",
   "precio": 85000,
   "descripcion": "Combo x 3 cilindros tradicionales encastrables Medidas 50x75 40x65 30x55",
   "medidas": null,
   "variantes": [],
   "categoria": "madera"
  }
 },
 {
  "slug": "mesa-caracola",
  "antes": {
   "nombre": "Mesa Caracola",
   "precio": 62500,
   "descripcion": "Mesa Caracola de mdf Medidas: 1m x 80cm x 40cm Pintada $87.500",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa Caracola",
   "precio": 62500,
   "descripcion": "Mesa Caracola de MDF Medidas: 1m x 80cm x 40cm Pintada $87.500",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "corazon-de-hierro",
  "antes": {
   "nombre": "Corazón de hierro",
   "precio": 99000,
   "descripcion": "Corazón hierro Medidas: 2m x 2m Desarmable La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Corazón de hierro",
   "precio": 99000,
   "descripcion": "Corazón de hierro desarmable.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "2 × 2 m",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesa-mdf",
  "antes": {
   "nombre": "Mesa mdf",
   "precio": 15000,
   "descripcion": "15% de recargo x link de Mercado pago Mesa 25x35 colores a elección",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa de MDF 25 × 35",
   "precio": 15000,
   "descripcion": "Mesa de MDF.\nColores: a elección.",
   "medidas": "25 × 35 cm",
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "castillo",
  "antes": {
   "nombre": "Castillo",
   "precio": 87500,
   "descripcion": "Castillo de mdf Medidas: 1.80 x 70 aprox Pintado $129.500",
   "medidas": null
  },
  "despues": {
   "nombre": "Castillo",
   "precio": 87500,
   "descripcion": "Castillo de MDF Medidas: 1.80 x 70 aprox Pintado $129.500",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "alzadas-mdf-mas-pino",
  "antes": {
   "nombre": "Alzadas mdf más Pino",
   "precio": null,
   "descripcion": "15cm diámetro x 15cm alto $8.500 15xm diámetro x40cm alto $10.000 20cm diámetro x 20cm alto $15.000 25cm diametro x 20cm alto $15.000 25cm diámetro x 25cm alto $15.000 30cm diámetro x 20cm alto $15.000 30cm diámetro x 25cm alto $16.500 15% de recargo x link de mercado pago Colores a elección!!",
   "medidas": null
  },
  "despues": {
   "nombre": "Alzadas de MDF y pino",
   "precio": 8500,
   "descripcion": "Alzadas para torta de MDF y pino. Medidas: diámetro × alto.\nColores: a elección.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "15 × 15 cm",
     "precio": 8500
    },
    {
     "etiqueta": "15 × 40 cm",
     "precio": 10000
    },
    {
     "etiqueta": "20 × 20 cm",
     "precio": 15000
    },
    {
     "etiqueta": "25 × 20 cm",
     "precio": 15000
    },
    {
     "etiqueta": "25 × 25 cm",
     "precio": 15000
    },
    {
     "etiqueta": "30 × 20 cm",
     "precio": 15000
    },
    {
     "etiqueta": "30 × 25 cm",
     "precio": 16500
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "carpa-circo",
  "antes": {
   "nombre": "Carpa circo",
   "precio": 159000,
   "descripcion": "Carpa circo mdf desarmable Medidas 2x1.80 Pintado $204.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Carpa circo",
   "precio": 159000,
   "descripcion": "Carpa circo MDF desarmable Medidas 2x1.80 Pintado $204.000",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "alzadas-escandinavas-x3",
  "antes": {
   "nombre": "Alzadas Escandinavas x3",
   "precio": 85000,
   "descripcion": "Combo x 3 alzadas Escandinavas Colores a eleccion Combo x 3 Indiciduales $35.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Alzadas escandinavas",
   "precio": 35000,
   "descripcion": "Alzadas escandinavas, en combo de 3 o por unidad.\nColores: a elección.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "Combo x3",
     "precio": 85000
    },
    {
     "etiqueta": "Individual",
     "precio": 35000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "funda-arcada-pino",
  "antes": {
   "nombre": "Funda Arcada pino",
   "precio": 18000,
   "descripcion": "Funda con elastico para arcada pino 1.90x60 $18.000 1.60x60 $18.000 1.40x60 $18.000 CATALOGO DE FUNDAS",
   "medidas": null
  },
  "despues": {
   "nombre": "Funda para arcada de pino",
   "precio": 18000,
   "descripcion": "Funda con elástico para arcada de pino.",
   "medidas": "1,90, 1,60 o 1,40 × 0,60 m (mismo precio)",
   "variantes": [],
   "categoria": "fundas-y-telas"
  }
 },
 {
  "slug": "mesa-pelota",
  "antes": {
   "nombre": "Mesa Pelota",
   "precio": 69500,
   "descripcion": "Mesa Pelota mdf $85.000 pintada Desarmable",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa Pelota",
   "precio": 69500,
   "descripcion": "Mesa Pelota MDF $85.000 pintada Desarmable",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "combo-x-3-mesas-cilindro-con-varillas",
  "antes": {
   "nombre": "Combo x 3 mesas cilindro con varillas",
   "precio": 260000,
   "descripcion": "Combo x 3 mesas redondas con detalles de varillas solo armazón sin maderas La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Combo x3 mesas cilindro con varillas",
   "precio": 260000,
   "descripcion": "Tres mesas redondas de hierro con detalle de varillas. Solo armazón, sin maderas.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "combo-x-3-paneles-espiralado",
  "antes": {
   "nombre": "Combo x 3 paneles espiralado",
   "precio": 146000,
   "descripcion": "Combo x 3 paneles espiralado Medidas 1.80x80 1.60x80 80x80 este podes usarlo de ambos lados Pintado $216.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Combo x 3 paneles espiralado",
   "precio": 146000,
   "descripcion": "Combo x 3 paneles espiralado Medidas 1.80x80 1.60x80 80x80 este podés usarlo de ambos lados Pintado $216.000",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "funda-cilindros-tradicional",
  "antes": {
   "nombre": "Funda Cilindros Tradicional",
   "precio": 35000,
   "descripcion": "Fundas con elastico para los tres cilindros tradicional Medidas (diametro x alto) 50x75 40x65 30x55 CATALOGO DE FUNDAS",
   "medidas": null
  },
  "despues": {
   "nombre": "Fundas para cilindros tradicionales",
   "precio": 35000,
   "descripcion": "Fundas con elástico para los tres cilindros tradicionales.",
   "medidas": "50 × 75 · 40 × 65 · 30 × 55 cm (diámetro × alto)",
   "variantes": [],
   "categoria": "fundas-y-telas"
  }
 },
 {
  "slug": "funda-arcada-hierro",
  "antes": {
   "nombre": "Funda Arcada hierro",
   "precio": 22000,
   "descripcion": "Funda con elastico para Arcada de hierro o semi arcada 95x2 CATALOGO DE FUNDAS",
   "medidas": null
  },
  "despues": {
   "nombre": "Funda para arcada de hierro",
   "precio": 22000,
   "descripcion": "Funda con elástico para arcada o semiarcada de hierro.",
   "medidas": "0,95 × 2 m",
   "variantes": [],
   "categoria": "fundas-y-telas"
  }
 },
 {
  "slug": "alajero-mdf-c-u",
  "antes": {
   "nombre": "Alajero mdf C/u",
   "precio": 15000,
   "descripcion": "15% de recargo x link Mercado pago Colores a elección",
   "medidas": null
  },
  "despues": {
   "nombre": "Alajero MDF C/u",
   "precio": 15000,
   "descripcion": "Colores a elección",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "alzadas-p-torta-de-mdf",
  "antes": {
   "nombre": "Alzadas p torta de mdf",
   "precio": null,
   "descripcion": "Alzadas p torta de mdf De 10cm $7.000 De 15cm $11.000 De 20cm $13.000 De 25cm $15.000 15% de recargo x link de mercado pago Colores a elección",
   "medidas": null
  },
  "despues": {
   "nombre": "Alzadas para torta de MDF",
   "precio": 7000,
   "descripcion": "Alzadas para torta de MDF.\nColores: a elección.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "10 cm",
     "precio": 7000
    },
    {
     "etiqueta": "15 cm",
     "precio": 11000
    },
    {
     "etiqueta": "20 cm",
     "precio": 13000
    },
    {
     "etiqueta": "25 cm",
     "precio": 15000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "estructura-telonera",
  "antes": {
   "nombre": "Estructura Telonera",
   "precio": 217000,
   "descripcion": "Estructura de hierro en forma de S Medidas : De 2.40m de alto x 4m de largo $217.000 De 2m de alto x 2m de largo $198.000 Desarmable Hierro 15-15 Hierro 20-20 $255.000 Para abonar con tarjeta de credito x medio de mecado pago 15% de recargo",
   "medidas": null
  },
  "despues": {
   "nombre": "Estructura telonera",
   "precio": 198000,
   "descripcion": "Estructura de hierro en forma de S, desarmable.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "2 × 2 m",
     "precio": 198000
    },
    {
     "etiqueta": "2,40 × 4 m",
     "precio": 217000
    },
    {
     "etiqueta": "En caño 20-20",
     "precio": 255000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "cilindro-x-3",
  "antes": {
   "nombre": "Cilindro x 3",
   "precio": 150000,
   "descripcion": "Cilindros hierro Combo x 3 sin maderas $150.000 con maderas $225.000 Medidas 50x75 $55.000 sin madera $85.000 con madera 40x65 $52.000 sin madera $77.000 con madera 30x55 $48.000 sin madera $68.000 con madera La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold Colores rosa celeste verde amarillo etc a cotizar",
   "medidas": null
  },
  "despues": {
   "nombre": "Cilindros de hierro",
   "precio": 48000,
   "descripcion": "Cilindros de hierro, en combo de 3 o por unidad (diámetro × alto, en cm).\nColores: blanco, negro, dorado, plateado o rosa gold.\nOtros colores (rosa, celeste, verde, amarillo…): a cotizar.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "Combo x3 sin maderas",
     "precio": 150000
    },
    {
     "etiqueta": "Combo x3 con maderas",
     "precio": 225000
    },
    {
     "etiqueta": "50 × 75 sin madera",
     "precio": 55000
    },
    {
     "etiqueta": "50 × 75 con madera",
     "precio": 85000
    },
    {
     "etiqueta": "40 × 65 sin madera",
     "precio": 52000
    },
    {
     "etiqueta": "40 × 65 con madera",
     "precio": 77000
    },
    {
     "etiqueta": "30 × 55 sin madera",
     "precio": 48000
    },
    {
     "etiqueta": "30 × 55 con madera",
     "precio": 68000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesa-triangulo-x-unidad",
  "antes": {
   "nombre": "Mesa triángulo x unidad",
   "precio": 122000,
   "descripcion": "Mesa triangulo sin madera c/u $122.000 Medidas 40x75 40x65",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa triángulo (por unidad)",
   "precio": 122000,
   "descripcion": "Mesa triángulo de hierro, sin madera. Precio por unidad.",
   "medidas": "40 × 75 o 40 × 65 cm",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "tela-rectangular",
  "antes": {
   "nombre": "Tela rectangular",
   "precio": 25000,
   "descripcion": "Tela rectangular sin elastico horizontal o vertical 1.50 x 2m Consultar otras medidas!! CATALOGO DE FUNDAS",
   "medidas": null
  },
  "despues": {
   "nombre": "Tela rectangular",
   "precio": 25000,
   "descripcion": "Tela sin elástico, para usar en horizontal o vertical. Consultanos por otras medidas.",
   "medidas": "1,50 × 2 m",
   "variantes": [],
   "categoria": "fundas-y-telas"
  }
 },
 {
  "slug": "paneles-x-2-ondas",
  "antes": {
   "nombre": "Paneles x 2 ondas",
   "precio": 81000,
   "descripcion": "Paneles x 2 ondas de mdf Desarmable o fijos Medidas 1.80 x 70 1.50 x 70 Pintado $125.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Paneles x 2 ondas",
   "precio": 81000,
   "descripcion": "Paneles x 2 ondas de MDF Desarmable o fijos Medidas 1.80 x 70 1.50 x 70 Pintado $125.000",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "arcada-entrada-semi-circulo",
  "antes": {
   "nombre": "Arcada entrada semi Círculo",
   "precio": 137000,
   "descripcion": "Arcada de hierro para entradas con base pesada Medidas: 2.50m de ancho x 2m de alto La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Arcada de entrada semicírculo",
   "precio": 137000,
   "descripcion": "Arcada de hierro para entradas, con base pesada.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "2,50 m de ancho × 2 m de alto",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "estanteria-eclipse",
  "antes": {
   "nombre": "Estanteria Eclipse",
   "precio": 49000,
   "descripcion": "Estanteria Eclipse Medidas: 60cm diametro x 15cm $57.000 (C/madera $77.000 ) 45cm diametro x 15cm $49.000 (C/madera $69.000)",
   "medidas": null
  },
  "despues": {
   "nombre": "Estantería Eclipse",
   "precio": 49000,
   "descripcion": "Estantería Eclipse de hierro (diámetro × alto).",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "45 × 15 cm",
     "precio": 49000
    },
    {
     "etiqueta": "45 × 15 cm con madera",
     "precio": 69000
    },
    {
     "etiqueta": "60 × 15 cm",
     "precio": 57000
    },
    {
     "etiqueta": "60 × 15 cm con madera",
     "precio": 77000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "panel-con-malla-1x2",
  "antes": {
   "nombre": "Panel con malla 1x2",
   "precio": 152000,
   "descripcion": "Panel con malla desarmable Recto o Arcada Medidas: 2m x 1m $152.000 2.50m x 1.20m $195.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Panel con malla",
   "precio": 152000,
   "descripcion": "Panel con malla desarmable, recto o arcada.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "2 × 1 m",
     "precio": 152000
    },
    {
     "etiqueta": "2,50 × 1,20 m",
     "precio": 195000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "columnas-centro-de-mesa",
  "antes": {
   "nombre": "Columnas centro de mesa",
   "precio": 28000,
   "descripcion": "Columnas para centros de mesa 15x15x50 Unidad $28.000 X 10 unidades $252.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Columnas para centro de mesa",
   "precio": 28000,
   "descripcion": "Columnas de hierro para centros de mesa.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "15 × 15 × 50 cm",
   "variantes": [
    {
     "etiqueta": "Unidad",
     "precio": 28000
    },
    {
     "etiqueta": "Pack x10",
     "precio": 252000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "estructura-cartel-bienvenida",
  "antes": {
   "nombre": "Estructura Cartel Bienvenida",
   "precio": 91000,
   "descripcion": "Estructura Cartel Bienvenida 1.60x95 Colores a eleccion",
   "medidas": null
  },
  "despues": {
   "nombre": "Estructura para cartel de bienvenida",
   "precio": 91000,
   "descripcion": "Estructura de hierro para cartel de bienvenida.\nColores: a elección.",
   "medidas": "1,60 × 0,95 m",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "funda-cilindros-xl",
  "antes": {
   "nombre": "Funda Cilindros XL",
   "precio": 45000,
   "descripcion": "Fundas con elastico para los tres cilindros XL Medidas (diametro x alto) 60x1m 50x90 40x80 CATALOGO DE FUNDAS",
   "medidas": null
  },
  "despues": {
   "nombre": "Fundas para cilindros XL",
   "precio": 45000,
   "descripcion": "Fundas con elástico para los tres cilindros XL.",
   "medidas": "60 × 100 · 50 × 90 · 40 × 80 cm (diámetro × alto)",
   "variantes": [],
   "categoria": "fundas-y-telas"
  }
 },
 {
  "slug": "mesa-diamante",
  "antes": {
   "nombre": "Mesa diamante",
   "precio": 105000,
   "descripcion": "Mesa diamante de hierro Medidas: 50x75x90 Solo armazón $105.000 Con madera $135.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa diamante",
   "precio": 105000,
   "descripcion": "Mesa diamante de hierro.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "50 × 75 × 90 cm",
   "variantes": [
    {
     "etiqueta": "Solo armazón",
     "precio": 105000
    },
    {
     "etiqueta": "Con madera",
     "precio": 135000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "televisor-70-mdf",
  "antes": {
   "nombre": "Televisor ‘70 Mdf",
   "precio": 18000,
   "descripcion": "Sin pintar $9000 Pintado $15000 15% de recargo x link mercado pago Color a elección",
   "medidas": null
  },
  "despues": {
   "nombre": "Televisor ‘70 MDF",
   "precio": 18000,
   "descripcion": "Sin pintar $9000 Pintado $15000 Color a elección",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "base-espiralada-redonda-mdf-20cm-de-diametro",
  "antes": {
   "nombre": "Base espiralada redonda mdf 20cm de diámetro",
   "precio": 8000,
   "descripcion": "Base espiralada redonda Medida 20cm de diámetro Colores a elección 15% de recargo x link de mercado pago",
   "medidas": null
  },
  "despues": {
   "nombre": "Base espiralada redonda MDF 20cm de diámetro",
   "precio": 8000,
   "descripcion": "Base espiralada redonda Medida 20cm de diámetro Colores a elección",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "panel-abejita-3d-mdf-desarmable",
  "antes": {
   "nombre": "Panel Abejita 3D mdf desarmable",
   "precio": 82000,
   "descripcion": "Panel abejita 3D mdf desarmable 1.80 x 1 Sin pintar $82.000 Pintado 1 color $112.000 Puntado 2 colores $122.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Panel Abejita 3D MDF desarmable",
   "precio": 82000,
   "descripcion": "Panel abejita 3D MDF desarmable 1.80 x 1 Sin pintar $82.000 Pintado 1 color $112.000 Puntado 2 colores $122.000",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "panel-espiralado-1-80x80",
  "antes": {
   "nombre": "Panel espiralado 1.80x80",
   "precio": 74000,
   "descripcion": "Panel espiralado desarmable Ranurado o liso Podes usarlo de los dos lados Medidas 1.80x80 Pintado $99.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Panel espiralado 1.80x80",
   "precio": 74000,
   "descripcion": "Panel espiralado desarmable Ranurado o liso Podes usarlo de los dos lados Medidas 1.80x80 Pintado $99.000",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "panel-arcada-liso",
  "antes": {
   "nombre": "Panel arcada liso",
   "precio": 60000,
   "descripcion": "Panel arcada liso desarmable Medida 1.80x80 Pintado $80.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Panel arcada liso",
   "precio": 60000,
   "descripcion": "Panel arcada liso, desarmable.",
   "medidas": "1,80 × 0,80 m",
   "variantes": [
    {
     "etiqueta": "Sin pintar",
     "precio": 60000
    },
    {
     "etiqueta": "Pintado",
     "precio": 80000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesa-torta",
  "antes": {
   "nombre": "Mesa Torta",
   "precio": 75000,
   "descripcion": "Mesa torta Medidas: 50x28 40x28 30x35 15% de recargo por link de mp",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa Torta",
   "precio": 75000,
   "descripcion": "Mesa torta Medidas: 50x28 40x28 30x35 15% de recargo por link de mp",
   "medidas": null,
   "variantes": [],
   "categoria": "madera"
  }
 },
 {
  "slug": "bases-de-3-o-4-pisos",
  "antes": {
   "nombre": "Bases de 3 o 4 pisos",
   "precio": null,
   "descripcion": "Base de 3 pisos colores a elección $18.000 Base de 4 pisos colores a elección $20.000 Base de 3 pisos circular color a elección $30.000 15% de recargo x link mercado pago",
   "medidas": null
  },
  "despues": {
   "nombre": "Bases de 3 o 4 pisos",
   "precio": 18000,
   "descripcion": "Bases de pisos.\nColores: a elección.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "3 pisos",
     "precio": 18000
    },
    {
     "etiqueta": "4 pisos",
     "precio": 20000
    },
    {
     "etiqueta": "3 pisos circular",
     "precio": 30000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "extensible-3x3-cano-cuadrado",
  "antes": {
   "nombre": "Extensible 3x3 caño cuadrado",
   "precio": 138000,
   "descripcion": "Arxo extensible 3x3 caño 20-20 Se extiende hacia arriba desde 1.40 a 3 Se extiende horizontal desde 1.50 a 3",
   "medidas": null
  },
  "despues": {
   "nombre": "Arco extensible 3 × 3 de caño cuadrado",
   "precio": 138000,
   "descripcion": "Arco extensible de caño 20-20. En alto va de 1,40 a 3 m y en ancho de 1,50 a 3 m.",
   "medidas": null,
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "combo-mesas-reloj",
  "antes": {
   "nombre": "Combo mesas reloj",
   "precio": 242000,
   "descripcion": "Combo x3 mesitas reloj de hierro Medidas: Solo armazon $242.000 Con maderas $312.000 Abonando por transferencia/efectivo tenes descuento en hierro!",
   "medidas": null
  },
  "despues": {
   "nombre": "Combo mesas reloj",
   "precio": 242000,
   "descripcion": "Tres mesitas reloj de hierro.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "Solo armazón",
     "precio": 242000
    },
    {
     "etiqueta": "Con maderas",
     "precio": 312000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "torre-eiffel",
  "antes": {
   "nombre": "Torre EIFFEL",
   "precio": 472000,
   "descripcion": "Torre EIFFEL De 1.50 a 2m Color a elección La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Torre Eiffel",
   "precio": 472000,
   "descripcion": "Torre Eiffel de hierro.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "De 1,50 a 2 m",
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "arboles",
  "antes": {
   "nombre": "Árboles",
   "precio": 27500,
   "descripcion": "Árbol mdf c/u Altura 1.40 Pintado $57.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Árboles",
   "precio": 27500,
   "descripcion": "Árbol MDF c/u Altura 1.40 Pintado $57.000",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "arco-con-rombo",
  "antes": {
   "nombre": "Arco con rombo",
   "precio": 145000,
   "descripcion": "Aro de hierro con rombo desarmable 2x2 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Arco con rombo",
   "precio": 145000,
   "descripcion": "Aro de hierro con rombo, desarmable.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "2 × 2 m",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesa-s",
  "antes": {
   "nombre": "Mesa S",
   "precio": 122000,
   "descripcion": "Mesa S Medidas En S 1m x 40 de alto En circular 50cm Valor solo armazon $122.000 En S 1.20m x 80 de alto En circulras 60cm Valor solo armazón $138.000 En S 2.20m x 80 de alto En circulat 1.10m Valor solo armazón $160.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa S",
   "precio": 122000,
   "descripcion": "Mesa de hierro en S, que también se arma en círculo. Precio solo armazón.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "En S 1 m · 40 cm de alto (círculo 50 cm)",
     "precio": 122000
    },
    {
     "etiqueta": "En S 1,20 m · 80 cm de alto (círculo 60 cm)",
     "precio": 138000
    },
    {
     "etiqueta": "En S 2,20 m · 80 cm de alto (círculo 1,10 m)",
     "precio": 160000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesas-espiraladas-x3",
  "antes": {
   "nombre": "Mesas espiraladas x3",
   "precio": 205000,
   "descripcion": "Combo x 3 mesas de hierro espiraladas Medidas: 40x65 40x75 40x90 Solo armazon $205.000 Con las maderas $244.000 Valores individuales Mesa 40x65 solo armazón $75.000 Con madera $90.000 Mesa 40x75 solo armazón $80.000 Con madera $95.000 Mesa 40x90 solo armazón $85.000 Con madera $100.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesas espiraladas",
   "precio": 75000,
   "descripcion": "Mesas de hierro espiraladas, en combo de 3 o por unidad (diámetro × alto, en cm).\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "40 × 65 · 40 × 75 · 40 × 90 cm",
   "variantes": [
    {
     "etiqueta": "Combo x3 solo armazón",
     "precio": 205000
    },
    {
     "etiqueta": "Combo x3 con maderas",
     "precio": 244000
    },
    {
     "etiqueta": "40 × 65 solo armazón",
     "precio": 75000
    },
    {
     "etiqueta": "40 × 65 con madera",
     "precio": 90000
    },
    {
     "etiqueta": "40 × 75 solo armazón",
     "precio": 80000
    },
    {
     "etiqueta": "40 × 75 con madera",
     "precio": 95000
    },
    {
     "etiqueta": "40 × 90 solo armazón",
     "precio": 85000
    },
    {
     "etiqueta": "40 × 90 con madera",
     "precio": 100000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "base-organica",
  "antes": {
   "nombre": "Base Organica",
   "precio": 12000,
   "descripcion": "Bandeja de mdf Organica Medidas: 20x30 aproximadamente Pintada!",
   "medidas": null
  },
  "despues": {
   "nombre": "Base Organica",
   "precio": 12000,
   "descripcion": "Bandeja de MDF Organica Medidas: 20x30 aproximadamente Pintada!",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "panel-monitos",
  "antes": {
   "nombre": "Panel Moñitos",
   "precio": 74000,
   "descripcion": "Panel moñitos 3D mdf 4 moñitos encastrables directamente en la estructura Medidas: 1.80 de alto x 1m de ancho Sin pintar $74.000 Pintado en 1 color $104.000 Pintado en 2 colores $114.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Panel Moñitos",
   "precio": 74000,
   "descripcion": "Panel moñitos 3D MDF 4 moñitos encastrables directamente en la estructura Medidas: 1.80 de alto x 1m de ancho Sin pintar $74.000 Pintado en 1 color $104.000 Pintado en 2 colores $114.000",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "arcada-arcoiris",
  "antes": {
   "nombre": "Arcada arcoiris",
   "precio": 70000,
   "descripcion": "Arcada arcoiris de mdf Pintado $120.000 Mide 1.80x80",
   "medidas": null
  },
  "despues": {
   "nombre": "Arcada arcoiris",
   "precio": 70000,
   "descripcion": "Arcada arcoiris de MDF Pintado $120.000 Mide 1.80x80",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "sillon-circular",
  "antes": {
   "nombre": "Sillón circular",
   "precio": 174000,
   "descripcion": "Sillón circular solo armazón Desarmable 2m de diámetro $174.000 1.50 de diámetro $162.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Sillón circular",
   "precio": 162000,
   "descripcion": "Sillón circular de hierro, solo armazón y desarmable.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "1,50 m de diámetro",
     "precio": 162000
    },
    {
     "etiqueta": "2 m de diámetro",
     "precio": 174000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "cubo-estructura",
  "antes": {
   "nombre": "Cubo estructura",
   "precio": 164000,
   "descripcion": "Cubo rectangular 2m ancho x 2m de alto x 50cm de profundidad caño 15-15 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Cubo estructura",
   "precio": 164000,
   "descripcion": "Cubo rectangular de hierro, caño 15-15.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "2 m de ancho × 2 m de alto × 50 cm de profundidad",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "bases-mdf-35cm-aprox-color-a-eleccion",
  "antes": {
   "nombre": "Bases mdf 35cm aprox color a elección",
   "precio": 12000,
   "descripcion": "15% de recargo x link Mercado pago Colores a elección",
   "medidas": null
  },
  "despues": {
   "nombre": "Bases de MDF de 35 cm",
   "precio": 12000,
   "descripcion": "Bases de MDF.\nColores: a elección.",
   "medidas": "35 cm aprox.",
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "cabina-espejada-estructura",
  "antes": {
   "nombre": "Cabina Espejada Estructura",
   "precio": 213000,
   "descripcion": "ESTRUCTURA CABINA ESPEJADA 2x2x2 caño 15-15 $213.000 2x2x2 caño 20-20 $251.000 2x2x3 caño 15-15 $296.000 2x2x3 caño 20-20 $346.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Estructura cabina espejada",
   "precio": 213000,
   "descripcion": "Estructura de hierro para cabina espejada.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "2×2×2 m · caño 15-15",
     "precio": 213000
    },
    {
     "etiqueta": "2×2×2 m · caño 20-20",
     "precio": 251000
    },
    {
     "etiqueta": "2×2×3 m · caño 15-15",
     "precio": 296000
    },
    {
     "etiqueta": "2×2×3 m · caño 20-20",
     "precio": 346000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "panel-mariposa",
  "antes": {
   "nombre": "Panel mariposa",
   "precio": 77500,
   "descripcion": "Panel mariposa 3d mdf 4 mariposas encastrables directamente en la estructura Medidas: 1.80 de alto x 1m de ancho Sin pintar $77.500 Pintado en 1 color $107.500 Pintado en 2 colores $115.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Panel mariposa",
   "precio": 77500,
   "descripcion": "Panel mariposa 3d MDF 4 mariposas encastrables directamente en la estructura Medidas: 1.80 de alto x 1m de ancho Sin pintar $77.500 Pintado en 1 color $107.500 Pintado en 2 colores $115.000",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "arcada-mickey",
  "antes": {
   "nombre": "Arcada Mickey",
   "precio": 55000,
   "descripcion": "Arcada mickey mdf Medidas 1.80 de alto x 80 de ancho Pintado $79.000 con los moños de Minnie $69.000 $99.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Arcada Mickey",
   "precio": 55000,
   "descripcion": "Arcada mickey MDF Medidas 1.80 de alto x 80 de ancho Pintado $79.000 con los moños de Minnie $69.000 $99.000",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "arco-pentagono-doble",
  "antes": {
   "nombre": "Arco pentagono doble",
   "precio": 152000,
   "descripcion": "Arco de hierro hexagonal doble Medidas: 2m de alto x 2m de ancho",
   "medidas": null
  },
  "despues": {
   "nombre": "Arco pentágono doble",
   "precio": 152000,
   "descripcion": "Arco doble de hierro.",
   "medidas": "2 m de alto × 2 m de ancho",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "panel-arcada-recto-desarmable-2x1",
  "antes": {
   "nombre": "Panel arcada RECTO desarmable 2x1",
   "precio": 152000,
   "descripcion": "Panel con malla desarmable Recto o Arcada Medidas: 1.60m x 50cm $113.000 2m x 1m $132.000 2.50m x 1.20m $166.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Panel arcada recto desarmable",
   "precio": 152000,
   "descripcion": "Panel con malla desarmable, recto o arcada. Medidas y precios publicados: 1,60 m × 50 cm, $113.000 · 2 × 1 m, $132.000 · 2,50 × 1,20 m, $166.000.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesa-copa",
  "antes": {
   "nombre": "Mesa copa",
   "precio": 99000,
   "descripcion": "Mesa Copa base hierro con madera 50x75 $99.000 sin madera $124.000 con madera pintada y barnizada",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa copa",
   "precio": 99000,
   "descripcion": "Mesa copa con base de hierro. La madera va pintada y barnizada.",
   "medidas": "50 × 75 cm",
   "variantes": [
    {
     "etiqueta": "Sin madera",
     "precio": 99000
    },
    {
     "etiqueta": "Con madera",
     "precio": 124000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "funda-arcada-recta-hierro",
  "antes": {
   "nombre": "Funda Arcada Recta hierro",
   "precio": 22000,
   "descripcion": "Funda con elastico para arcada RECTA de hierro 95x2m CATALOGO DE FUNDAS",
   "medidas": null
  },
  "despues": {
   "nombre": "Funda para arcada recta de hierro",
   "precio": 22000,
   "descripcion": "Funda con elástico para arcada recta de hierro.",
   "medidas": "0,95 × 2 m",
   "variantes": [],
   "categoria": "fundas-y-telas"
  }
 },
 {
  "slug": "estanteria-sweet",
  "antes": {
   "nombre": "Estanteria Sweet",
   "precio": 57000,
   "descripcion": "Estanteria Sweet Con madera $77.000 Medida 60cm Color a eleccion",
   "medidas": null
  },
  "despues": {
   "nombre": "Estantería Sweet",
   "precio": 57000,
   "descripcion": "Estantería Sweet de hierro.\nColores: a elección.",
   "medidas": "60 cm",
   "variantes": [
    {
     "etiqueta": "Sin madera",
     "precio": 57000
    },
    {
     "etiqueta": "Con madera",
     "precio": 77000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "combo-x-3-alzadas-hierro",
  "antes": {
   "nombre": "Combo x 3 alzadas hierro",
   "precio": 40000,
   "descripcion": "Combo x 3 alzadas hierro plato de 27cm de diámetro aprox Alto 16cm, 13cm y 10cm La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Combo x3 alzadas de hierro",
   "precio": 40000,
   "descripcion": "Tres alzadas de hierro con plato de 27 cm de diámetro aprox.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "16, 13 y 10 cm de alto",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "luna-de-hierro",
  "antes": {
   "nombre": "Luna de hierro",
   "precio": 99000,
   "descripcion": "Luna de hierro desarmable 2m de alto La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Luna de hierro",
   "precio": 99000,
   "descripcion": "Luna de hierro desarmable.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "2 m de alto",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "arcada-recta-de-hierro-95x2",
  "antes": {
   "nombre": "Arcada recta de hierro 95x2",
   "precio": 95000,
   "descripcion": "Arcada recta 95x2 Combo x3 $256.000 (cualquier formato) La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Arcada recta de hierro 95 × 2",
   "precio": 95000,
   "descripcion": "Arcada recta de hierro. En combo x3 la combinás con arcadas y semiarcadas, en el formato que quieras.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "0,95 × 2 m",
   "variantes": [
    {
     "etiqueta": "Unidad",
     "precio": 95000
    },
    {
     "etiqueta": "Combo x3",
     "precio": 256000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "panel-margarita-3d-mdf-desarmable",
  "antes": {
   "nombre": "Panel margarita 3D mdf desarmable",
   "precio": 82000,
   "descripcion": "Panel mdf margarita 3d Sin pintar $82.000 Pintado $122.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Panel margarita 3D MDF desarmable",
   "precio": 82000,
   "descripcion": "Panel MDF margarita 3d Sin pintar $82.000 Pintado $122.000",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "combo-x-3-cubos-mas-barril",
  "antes": {
   "nombre": "Combo x 3 cubos más barril",
   "precio": 248000,
   "descripcion": "Combo x 3 cubos desarmable más 1 barril 3 cubos 1 barril Medidas 40x40x75 40x40x65 40x40x50 Barril 40x65 Con maderas $328.000 La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Combo x3 cubos más barril",
   "precio": 248000,
   "descripcion": "Tres cubos desarmables más 1 barril.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "Cubos 40 × 40 × 75, 40 × 40 × 65 y 40 × 40 × 50 · barril 40 × 65 cm",
   "variantes": [
    {
     "etiqueta": "Sin maderas",
     "precio": 248000
    },
    {
     "etiqueta": "Con maderas",
     "precio": 328000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesa-volados",
  "antes": {
   "nombre": "Mesa volados",
   "precio": 60500,
   "descripcion": "Mesa de mdf ranurada con volados desarmable Medidas: 1x80x40 Pintado $90.500 Tapa cajón $70.500 Pintado $105.500",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa volados",
   "precio": 60500,
   "descripcion": "Mesa de MDF ranurada con volados desarmable Medidas: 1x80x40 Pintado $90.500 Tapa cajón $70.500 Pintado $105.500",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "panel-organico",
  "antes": {
   "nombre": "Panel Organico",
   "precio": 55000,
   "descripcion": "Panel Organico mdf Medidas: 1.80m de alto x 80cm de ancho Desarmable",
   "medidas": null
  },
  "despues": {
   "nombre": "Panel Organico",
   "precio": 55000,
   "descripcion": "Panel Organico MDF Medidas: 1.80m de alto x 80cm de ancho Desarmable",
   "medidas": null,
   "variantes": [],
   "categoria": "mdf"
  }
 },
 {
  "slug": "combo-x-3-arcada-semiarcada-arcada-recta",
  "antes": {
   "nombre": "Combo x 3 arcada/semiarcada/arcada recta",
   "precio": 256000,
   "descripcion": "Combo x 3 Podes elegir todas iguales 2 iguales y 1 distinta 3 diferentes Como quieras Las pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Combo x3 arcada, semiarcada y arcada recta",
   "precio": 256000,
   "descripcion": "Elegí las tres iguales, dos iguales y una distinta, o las tres diferentes.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "mesa-escandinava",
  "antes": {
   "nombre": "Mesa escandinava",
   "precio": 106000,
   "descripcion": "Mesa escandinava con maderas Precio por unidad Medidas: 50cm diametro x 75cm de alto 40cm diametro x 65cm de alto La pedis en Blanco, Negro, Dorado, Plateado o Rosa Gold",
   "medidas": null
  },
  "despues": {
   "nombre": "Mesa escandinava",
   "precio": 106000,
   "descripcion": "Mesa escandinava de hierro con maderas. Precio por unidad.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": "50 cm de diámetro × 75 cm de alto, o 40 × 65 cm",
   "variantes": [],
   "categoria": "hierro"
  }
 },
 {
  "slug": "arco-extensible-esencial",
  "antes": {
   "nombre": "Arco extensible ESENCIAL",
   "precio": 99000,
   "descripcion": "Medidas: Alto 2.10m Ancho 1.50 extensible hasta 3 metros AGREGARLE ALTURA (opcional) Soporte hasta 3m $22.000 Soporte hasta 4m $32.000",
   "medidas": null
  },
  "despues": {
   "nombre": "Arco extensible Esencial",
   "precio": 99000,
   "descripcion": "Arco extensible de hierro. Si necesitás más altura, sumale el soporte.",
   "medidas": "2,10 m de alto · 1,50 m de ancho, extensible hasta 3 m",
   "variantes": [
    {
     "etiqueta": "Sin soporte",
     "precio": 99000
    },
    {
     "etiqueta": "Con soporte hasta 3 m",
     "precio": 121000
    },
    {
     "etiqueta": "Con soporte hasta 4 m",
     "precio": 131000
    }
   ],
   "categoria": "hierro"
  }
 },
 {
  "slug": "torre-nativa-60cm",
  "antes": {
   "nombre": "Torre nativa 60cm",
   "precio": 77000,
   "descripcion": "Exhibidor de hierro con bandejas de madera, ideal para finger food, coffee breaks y estaciones gourmet. Alto 60cm. Precio con maderas.",
   "medidas": null
  },
  "despues": {
   "nombre": "Torre Nativa 60 cm",
   "precio": 77000,
   "descripcion": "Exhibidor de hierro con bandejas de madera, ideal para finger food, coffee breaks y estaciones gourmet. Precio con maderas.",
   "medidas": "60 cm de alto",
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "prisma-x4",
  "antes": {
   "nombre": "Prisma x4",
   "precio": 98000,
   "descripcion": "Set de 4 prismas de hierro con tapa de madera. Cada cuadrado mide 25x25cm (ancho y profundidad). Alturas: 1 de 25cm, 2 de 20cm y 1 de 15cm. Precio con maderas.",
   "medidas": "25x25cm · alturas 25, 20, 20 y 15cm"
  },
  "despues": {
   "nombre": "Prisma x4",
   "precio": 98000,
   "descripcion": "Set de 4 prismas de hierro con tapa de madera. Precio con maderas.",
   "medidas": "25x25cm · alturas 25, 20, 20 y 15cm",
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "orbita-x3",
  "antes": {
   "nombre": "Órbita x3",
   "precio": 125000,
   "descripcion": "Combo de 3 alzadas circulares de hierro. Medidas: 30x25, 25x20 y 20x15cm. Sin maderas $125.000 · Con maderas $160.000.",
   "medidas": "30x25 · 25x20 · 20x15cm"
  },
  "despues": {
   "nombre": "Órbita x3",
   "precio": 125000,
   "descripcion": "Combo de 3 alzadas circulares de hierro.",
   "medidas": "30x25 · 25x20 · 20x15cm",
   "variantes": [
    {
     "etiqueta": "Sin maderas",
     "precio": 125000
    },
    {
     "etiqueta": "Con maderas",
     "precio": 160000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "estanteria-capsula-60cm",
  "antes": {
   "nombre": "Estantería cápsula 60cm",
   "precio": 57000,
   "descripcion": "Estantería cápsula de hierro de 60cm. Sin maderas $57.000 · Con maderas $77.000.",
   "medidas": null
  },
  "despues": {
   "nombre": "Estantería Cápsula 60 cm",
   "precio": 57000,
   "descripcion": "Estantería cápsula de hierro.",
   "medidas": "60 cm",
   "variantes": [
    {
     "etiqueta": "Sin maderas",
     "precio": 57000
    },
    {
     "etiqueta": "Con maderas",
     "precio": 77000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "estanteria-capsula-xl",
  "antes": {
   "nombre": "Estantería cápsula XL",
   "precio": 72000,
   "descripcion": "Estantería cápsula XL de hierro. Sin maderas $72.000 · Con estantes $120.000.",
   "medidas": null
  },
  "despues": {
   "nombre": "Estantería Cápsula XL",
   "precio": 72000,
   "descripcion": "Estantería cápsula XL de hierro.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "Sin maderas",
     "precio": 72000
    },
    {
     "etiqueta": "Con estantes",
     "precio": 120000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "estanteria-s-60cm",
  "antes": {
   "nombre": "Estantería S 60cm",
   "precio": 57000,
   "descripcion": "Estantería en S de hierro de 60cm. Sin estantes $57.000 · Con estantes $77.000.",
   "medidas": null
  },
  "despues": {
   "nombre": "Estantería S 60 cm",
   "precio": 57000,
   "descripcion": "Estantería en S de hierro.",
   "medidas": "60 cm",
   "variantes": [
    {
     "etiqueta": "Sin estantes",
     "precio": 57000
    },
    {
     "etiqueta": "Con estantes",
     "precio": 77000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "arcoiris-4-estantes",
  "antes": {
   "nombre": "Arcoíris con 4 estantes",
   "precio": null,
   "descripcion": "Estructura arcoíris de 1,10m x 50cm con 4 estantes. Con o sin maderas.",
   "medidas": "1,10m x 50cm"
  },
  "despues": {
   "nombre": "Arcoíris con 4 estantes",
   "precio": null,
   "descripcion": "Estructura arcoíris con 4 estantes, con o sin maderas.",
   "medidas": "1,10m x 50cm",
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "alzada-separada",
  "antes": {
   "nombre": "Alzada separada",
   "precio": null,
   "descripcion": "Alzada de hierro. Precio sin madera. Colores a elección: Blanco, Negro, Dorado, Plateado o Rosa Gold.",
   "medidas": null
  },
  "despues": {
   "nombre": "Alzada separada",
   "precio": null,
   "descripcion": "Alzada de hierro. Precio sin madera.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "alzada-triangular",
  "antes": {
   "nombre": "Alzada triangular",
   "precio": null,
   "descripcion": "Alzada de hierro con tapa de madera. Colores a elección: Blanco, Negro, Dorado, Plateado o Rosa Gold.",
   "medidas": null
  },
  "despues": {
   "nombre": "Alzada triangular",
   "precio": null,
   "descripcion": "Alzada de hierro con tapa de madera.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "bandeja-circular",
  "antes": {
   "nombre": "Bandeja circular",
   "precio": 19500,
   "descripcion": "Bandeja circular de hierro. Precio sin maderas. Colores a elección: Blanco, Negro, Dorado, Plateado o Rosa Gold.",
   "medidas": null
  },
  "despues": {
   "nombre": "Bandeja circular",
   "precio": 19500,
   "descripcion": "Bandeja circular de hierro. Precio sin maderas.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [],
   "categoria": "catering"
  }
 },
 {
  "slug": "gota",
  "antes": {
   "nombre": "Gota",
   "precio": 65000,
   "descripcion": "Gota de hierro. Solo estructura $65.000 · Con maderas $89.000. Colores a elección: Blanco, Negro, Dorado, Plateado o Rosa Gold.",
   "medidas": null
  },
  "despues": {
   "nombre": "Gota",
   "precio": 65000,
   "descripcion": "Gota de hierro.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "Solo estructura",
     "precio": 65000
    },
    {
     "etiqueta": "Con maderas",
     "precio": 89000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "luna-nova",
  "antes": {
   "nombre": "Luna Nova",
   "precio": 70000,
   "descripcion": "Luna Nova de hierro. Solo estructura $70.000 · Con maderas $130.000. Colores a elección: Blanco, Negro, Dorado, Plateado o Rosa Gold.",
   "medidas": null
  },
  "despues": {
   "nombre": "Luna Nova",
   "precio": 70000,
   "descripcion": "Luna Nova de hierro.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "Solo estructura",
     "precio": 70000
    },
    {
     "etiqueta": "Con maderas",
     "precio": 130000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "torre-verona",
  "antes": {
   "nombre": "Torre Verona",
   "precio": 65000,
   "descripcion": "Torre Verona de hierro. Solo estructura $65.000 · Con maderas $120.000. Colores a elección: Blanco, Negro, Dorado, Plateado o Rosa Gold.",
   "medidas": null
  },
  "despues": {
   "nombre": "Torre Verona",
   "precio": 65000,
   "descripcion": "Torre Verona de hierro.\nColores: blanco, negro, dorado, plateado o rosa gold.",
   "medidas": null,
   "variantes": [
    {
     "etiqueta": "Solo estructura",
     "precio": 65000
    },
    {
     "etiqueta": "Con maderas",
     "precio": 120000
    }
   ],
   "categoria": "catering"
  }
 },
 {
  "slug": "estanteria-s-xl",
  "antes": {
   "nombre": "Estantería S XL",
   "precio": 72000,
   "descripcion": "Estantería en S de hierro, 1m x 40cm. Sin estantes $72.000 · Con estantes $192.000.",
   "medidas": "1m x 40cm"
  },
  "despues": {
   "nombre": "Estantería S XL",
   "precio": 72000,
   "descripcion": "Estantería en S de hierro.",
   "medidas": "1m x 40cm",
   "variantes": [
    {
     "etiqueta": "Sin estantes",
     "precio": 72000
    },
    {
     "etiqueta": "Con estantes",
     "precio": 192000
    }
   ],
   "categoria": "catering"
  }
 }
];
