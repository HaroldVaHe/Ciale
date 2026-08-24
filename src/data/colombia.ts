export interface Departamento {
  nombre: string;
  ciudades: string[];
}

/**
 * Departamentos de Colombia con ciudades de cobertura de envío.
 * Curado (capitales + municipios principales); ampliar según cobertura real.
 */
export const DEPARTAMENTOS: Departamento[] = [
  {
    nombre: "Amazonas",
    ciudades: ["Leticia", "Puerto Nariño"],
  },
  {
    nombre: "Antioquia",
    ciudades: [
      "Medellín", "Envigado", "Itagüí", "Bello", "Sabaneta", "Rionegro",
      "La Ceja", "Apartadó", "Turbo", "Copacabana", "Girardota", "Barbosa",
      "Caldas", "Marinilla",
    ],
  },
  {
    nombre: "Arauca",
    ciudades: ["Arauca", "Saravena", "Tame", "Arauquita"],
  },
  {
    nombre: "Atlántico",
    ciudades: [
      "Barranquilla", "Soledad", "Malambo", "Baranoa", "Sabanalarga",
      "Galapa", "Puerto Colombia",
    ],
  },
  {
    nombre: "Bogotá D.C.",
    ciudades: ["Bogotá D.C."],
  },
  {
    nombre: "Bolívar",
    ciudades: [
      "Cartagena", "Magangué", "Turbaco", "Arjona", "El Carmen de Bolívar",
      "Santa Cruz de Mompox",
    ],
  },
  {
    nombre: "Boyacá",
    ciudades: [
      "Tunja", "Duitama", "Sogamoso", "Chiquinquirá", "Paipa", "Villa de Leyva",
    ],
  },
  {
    nombre: "Caldas",
    ciudades: ["Manizales", "La Dorada", "Villamaría", "Chinchiná", "Riosucio"],
  },
  {
    nombre: "Caquetá",
    ciudades: ["Florencia", "San Vicente del Caguán", "Puerto Rico"],
  },
  {
    nombre: "Casanare",
    ciudades: ["Yopal", "Aguazul", "Villanueva", "Tauramena", "Paz de Ariporo"],
  },
  {
    nombre: "Cauca",
    ciudades: [
      "Popayán", "Santander de Quilichao", "Puerto Tejada", "Miranda",
    ],
  },
  {
    nombre: "Cesar",
    ciudades: [
      "Valledupar", "Aguachica", "Agustín Codazzi", "Curumaní", "La Paz",
    ],
  },
  {
    nombre: "Chocó",
    ciudades: ["Quibdó", "Istmina", "Condoto", "Tadó", "Bahía Solano"],
  },
  {
    nombre: "Córdoba",
    ciudades: [
      "Montería", "Lorica", "Planeta Rica", "Sahagún", "Cereté", "Tierralta",
    ],
  },
  {
    nombre: "Cundinamarca",
    ciudades: [
      "Soacha", "Zipaquirá", "Chía", "Cajicá", "Fusagasugá", "Facatativá",
      "Girardot", "Mosquera", "Madrid", "Funza", "Ubaté", "Tabio", "Tenjo",
      "Cota", "Anapoima", "La Vega",
    ],
  },
  {
    nombre: "Guainía",
    ciudades: ["Inírida"],
  },
  {
    nombre: "Guaviare",
    ciudades: ["San José del Guaviare", "Miraflores", "Calamar"],
  },
  {
    nombre: "Huila",
    ciudades: ["Neiva", "Pitalito", "Garzón", "La Plata", "Campoalegre"],
  },
  {
    nombre: "La Guajira",
    ciudades: ["Riohacha", "Maicao", "Uribia", "Fonseca", "Albania"],
  },
  {
    nombre: "Magdalena",
    ciudades: [
      "Santa Marta", "Ciénaga", "Fundación", "Aracataca", "El Banco",
    ],
  },
  {
    nombre: "Meta",
    ciudades: [
      "Villavicencio", "Acacías", "Granada", "Puerto López", "Restrepo",
      "Cumaral",
    ],
  },
  {
    nombre: "Nariño",
    ciudades: ["Pasto", "Ipiales", "Túquerres", "La Unión", "Tumaco"],
  },
  {
    nombre: "Norte de Santander",
    ciudades: [
      "Cúcuta", "Ocaña", "Pamplona", "Los Patios", "Villa del Rosario",
      "Chinácota",
    ],
  },
  {
    nombre: "Putumayo",
    ciudades: ["Mocoa", "Puerto Asís", "Orito", "Villagarzón"],
  },
  {
    nombre: "Quindío",
    ciudades: [
      "Armenia", "Calarcá", "Circasia", "Montenegro", "Quimbaya", "Salento",
    ],
  },
  {
    nombre: "Risaralda",
    ciudades: [
      "Pereira", "Dosquebradas", "La Virginia", "Santa Rosa de Cabal",
    ],
  },
  {
    nombre: "San Andrés y Providencia",
    ciudades: ["San Andrés", "Providencia"],
  },
  {
    nombre: "Santander",
    ciudades: [
      "Bucaramanga", "Floridablanca", "Girón", "Piedecuesta",
      "Barrancabermeja", "Socorro", "San Gil", "Vélez",
    ],
  },
  {
    nombre: "Sucre",
    ciudades: ["Sincelejo", "Corozal", "Sampués", "Tolú", "San Marcos"],
  },
  {
    nombre: "Tolima",
    ciudades: [
      "Ibagué", "Espinal", "Melgar", "Honda", "Líbano", "Mariquita",
      "Chaparral",
    ],
  },
  {
    nombre: "Valle del Cauca",
    ciudades: [
      "Cali", "Palmira", "Buenaventura", "Tuluá", "Buga", "Jamundí",
      "Cartago", "Yumbo", "Florida", "Pradera", "Candelaria",
    ],
  },
  {
    nombre: "Vaupés",
    ciudades: ["Mitú"],
  },
  {
    nombre: "Vichada",
    ciudades: ["Puerto Carreño"],
  },
];
