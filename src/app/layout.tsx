import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { products } from "@/data/products";
import { faqs } from "@/data/faqs";
import "./globals.css";

const SITE_URL = "https://ciale.online";
const SITE_NAME = "CIALÉ | Joyería Artesanal";
const SITE_TAGLINE = "Detalles que cuentan historias. Joyería artesanal creada con amor.";
const SITE_DESCRIPTION =
  "Cada pieza es única. Como quién la lleva. Joyería artesanal creada con amor para acompañar tus mejores momentos.";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  keywords: [
    "joyería artesanal",
    "collares",
    "dijes",
    "hecho a mano",
    "Colombia",
    "CIALÉ",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    url: "/",
    siteName: "CIALÉ Jewelry",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/Banner.webp",
        width: 1920,
        height: 792,
        alt: "CIALÉ — Joyería artesanal colombiana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_TAGLINE,
    images: ["/Banner.webp"],
  },
  robots: { index: true, follow: true },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "@id": `${SITE_URL}/#store`,
    name: "CIALÉ",
    alternateName: "CIALÉ Jewelry",
    slogan: "Detalles que cuentan historias.",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: `${SITE_URL}/CialeMarron.webp`,
    image: `${SITE_URL}/Banner.webp`,
    telephone: "+573203039847",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chía",
      addressRegion: "Cundinamarca",
      addressCountry: "CO",
    },
    sameAs: ["https://instagram.com/ciale.jewelry"],
    priceRange: "$$",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "es-CO",
    publisher: { "@id": `${SITE_URL}/#store` },
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catálogo CIALÉ",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: `${SITE_URL}${product.image}`,
        category: product.category,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "COP",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/#catalogo`,
        },
      },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" style={{ colorScheme: "light" }} className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
