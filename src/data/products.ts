export interface ProductVariant {
  id: string;
  name: string;
  color: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  image: string;
  gradient: string;
  variants: ProductVariant[];
}

export const products: Product[] = [
  {
    id: "coral",
    name: "Coral",
    description:
      "Dije de coral marino auténtico, cada pieza con tonalidades únicas que recuerdan a las profundidades del océano.",
    price: 50000,
    category: "marina",
    tags: ["dije", "marino", "coral"],
    image: "/products/Coral.webp",
    gradient: "from-orange-200 via-rose-100 to-amber-50",
    variants: [
      { id: "coral-natural", name: "Coral Natural", color: "Coral", hex: "#E79C88" },
      { id: "coral-rojo", name: "Coral Rojo", color: "Rojo", hex: "#C75B39" },
      { id: "coral-rosado", name: "Coral Rosado", color: "Rosado", hex: "#F2B5A0" },
    ],
  },
  {
    id: "aura-rosa",
    name: "Aura Rosa",
    description:
      "Dije delicado con acabado en rosa empolvado. Una pieza suave y elegante, hecha a mano con dedicación.",
    price: 50000,
    category: "dijes",
    tags: ["dije", "rosa", "delicado"],
    image: "/products/AuraRosa.webp",
    gradient: "from-pink-200 via-rose-100 to-pink-50",
    variants: [
      { id: "aura-rosa-oro", name: "Rosa Dorado", color: "Rosa", hex: "#E8D3C8" },
      { id: "aura-rosa-plata", name: "Rosa Plata", color: "Plata", hex: "#C0C0C0" },
      { id: "aura-rosa-oro-24k", name: "Rosa Oro 24K", color: "Oro", hex: "#D4AF37" },
    ],
  },
  {
    id: "nemo",
    name: "Nemo",
    description:
      "Dije temático marino con acabado texturizado inspirado en las corrientes del océano.",
    price: 50000,
    category: "marina",
    tags: ["dije", "marino", "texturizado"],
    image: "/products/Nemo.webp",
    gradient: "from-blue-200 via-cyan-100 to-teal-50",
    variants: [
      { id: "nemo-plata", name: "Plata", color: "Plata", hex: "#C0C0C0" },
      { id: "nemo-oro", name: "Oro", color: "Oro", hex: "#D4AF37" },
      { id: "nemo-cobre", name: "Cobre", color: "Cobre", hex: "#B87333" },
    ],
  },
  {
    id: "nacar",
    name: "Nácar",
    description:
      "Dije de nácar natural con reflejos iridiscentes que cambian con la luz. Una pieza verdaderamente única.",
    price: 50000,
    category: "dijes",
    tags: ["dije", "nácar", "iridiscente"],
    image: "/products/Nacar.webp",
    gradient: "from-amber-50 via-rose-50 to-blue-50",
    variants: [
      { id: "nacar-natural", name: "Nácar Natural", color: "Nácar", hex: "#F5E6D3" },
      { id: "nacar-rosa", name: "Nácar Rosa", color: "Rosa", hex: "#F2C4C4" },
      { id: "nacar-azul", name: "Nácar Azul", color: "Azul", hex: "#B8D4E3" },
    ],
  },
  {
    id: "ohana",
    name: "Ohana",
    description:
      "Inspirado en la unión y la familia. 'Ohana significa familia, y la familia no te abandona jamás.'",
    price: 50000,
    category: "coleccion",
    tags: ["dije", "familia", "unión"],
    image: "/products/Ohana.webp",
    gradient: "from-rose-200 via-orange-100 to-yellow-50",
    variants: [
      { id: "ohana-oro", name: "Oro", color: "Oro", hex: "#D4AF37" },
      { id: "ohana-plata", name: "Plata", color: "Plata", hex: "#C0C0C0" },
      { id: "ohana-rosa", name: "Rosa Dorado", color: "Rosa", hex: "#E8D3C8" },
    ],
  },
  {
    id: "lula",
    name: "Lula",
    description:
      "Dije geométrico con líneas modernas y acabado artesanal. La fusión perfecta entre lo contemporáneo y lo hecho a mano.",
    price: 50000,
    category: "dijes",
    tags: ["dije", "geométrico", "moderno"],
    image: "/products/Lula.webp",
    gradient: "from-stone-200 via-amber-50 to-stone-100",
    variants: [
      { id: "lula-negro", name: "Negro Mate", color: "Negro", hex: "#2D2926" },
      { id: "lula-dorado", name: "Dorado", color: "Dorado", hex: "#D4AF37" },
      { id: "lula-plata", name: "Plata", color: "Plata", hex: "#C0C0C0" },
    ],
  },
  {
    id: "aurora",
    name: "Aurora",
    description:
      "Dije con destellos de color y piedras translúcidas que capturan la luz del amanecer.",
    price: 50000,
    category: "dijes",
    tags: ["dije", "piedras", "translúcido", "destellos"],
    image: "/products/Aurora.webp",
    gradient: "from-violet-200 via-pink-100 to-amber-50",
    variants: [
      { id: "aurora-rosa", name: "Rosa Aurora", color: "Rosa", hex: "#F2B5D4" },
      { id: "aurora-lila", name: "Lila", color: "Lila", hex: "#C8A2C8" },
      { id: "aurora-dorado", name: "Dorado", color: "Dorado", hex: "#D4AF37" },
    ],
  },
  {
    id: "maia",
    name: "Maia",
    description:
      "Collar con detalles sutiles y cuentas seleccionadas a mano. Cada cuenta cuenta una historia.",
    price: 50000,
    category: "coleccion",
    tags: ["collar", "cuentas", "detalles"],
    image: "/products/Maia.webp",
    gradient: "from-green-100 via-amber-50 to-rose-50",
    variants: [
      { id: "maia-salvia", name: "Salvia", color: "Salvia", hex: "#A3B18A" },
      { id: "maia-arena", name: "Arena", color: "Arena", hex: "#E8D3C8" },
      { id: "maia-coral", name: "Coral", color: "Coral", hex: "#E79C88" },
    ],
  },
  {
    id: "cora",
    name: "Cora",
    description:
      "Dije de corazón artesanal, hecho con amor y dedicación. El regalo perfecto para quien llevas en el corazón.",
    price: 50000,
    category: "dijes",
    tags: ["dije", "corazón", "amor"],
    image: "/products/Cora.webp",
    gradient: "from-rose-200 via-red-100 to-pink-50",
    variants: [
      { id: "cora-rosa", name: "Rosa", color: "Rosa", hex: "#E79C88" },
      { id: "cora-rojo", name: "Rojo", color: "Rojo", hex: "#C75B39" },
      { id: "cora-oro", name: "Dorado", color: "Oro", hex: "#D4AF37" },
    ],
  },
  {
    id: "margot",
    name: "Margot",
    description:
      "Collar clásico elegante con acentos brillantes. Para quienes aprecian el lujo en los detalles.",
    price: 50000,
    category: "coleccion",
    tags: ["collar", "clásico", "elegante", "brillantes"],
    image: "/products/Margot.webp",
    gradient: "from-gray-100 via-amber-50 to-gray-50",
    variants: [
      { id: "margot-plata", name: "Plata", color: "Plata", hex: "#C0C0C0" },
      { id: "margot-oro", name: "Oro", color: "Oro", hex: "#D4AF37" },
      { id: "margot-rosegold", name: "Rose Gold", color: "Rosa", hex: "#E8D3C8" },
    ],
  },
  {
    id: "greta",
    name: "Greta",
    description:
      "Dije vintage chic con engaste artesanal. Inspirado en la elegancia atemporal de las épocas pasadas.",
    price: 50000,
    category: "dijes",
    tags: ["dije", "vintage", "chic", "engaste"],
    image: "/products/Greta.webp",
    gradient: "from-amber-200 via-orange-100 to-yellow-50",
    variants: [
      { id: "greta-antiguo", name: "Oro Antiguo", color: "Antiguo", hex: "#B8860B" },
      { id: "greta-plata", name: "Plata Vieja", color: "Plata", hex: "#A9A9A9" },
      { id: "greta-cobre", name: "Cobre", color: "Cobre", hex: "#B87333" },
    ],
  },
  {
    id: "elle",
    name: "Elle",
    description:
      "Collar minimalista contemporáneo. Menos es más: una pieza limpia y sofisticada para el día a día.",
    price: 50000,
    category: "coleccion",
    tags: ["collar", "minimalista", "contemporáneo"],
    image: "/products/Elle.webp",
    gradient: "from-stone-100 via-stone-50 to-white",
    variants: [
      { id: "elle-plata", name: "Plata", color: "Plata", hex: "#C0C0C0" },
      { id: "elle-oro", name: "Dorado", color: "Oro", hex: "#D4AF37" },
      { id: "elle-rosa", name: "Rose Gold", color: "Rosa", hex: "#E8D3C8" },
    ],
  },
];

export const categories = [
  { id: "all", label: "Todos" },
  { id: "dijes", label: "Dijes" },
  { id: "marina", label: "Colección Marina" },
  { id: "coleccion", label: "Colección" },
] as const;

export type CategoryId = string;
