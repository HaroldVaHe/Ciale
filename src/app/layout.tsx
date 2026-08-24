import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { products } from "@/data/products";
import { faqs } from "@/data/faqs";
import { getPublicReviewsForSeo } from "@/lib/supabase/public-reviews";
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
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CIALÉ — Joyería artesanal colombiana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_TAGLINE,
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

async function buildStructuredData() {
  const reviewsByProduct = await getPublicReviewsForSeo();

  return [
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
      itemListElement: products.map((product, index) => {
        const productReviews = reviewsByProduct[product.id] ?? [];
        const count = productReviews.length;
        const average =
          count > 0
            ? productReviews.reduce((sum, r) => sum + r.rating, 0) / count
            : 0;

        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: `${SITE_URL}${product.image}`,
            category: product.category,
            sku: product.id,
            brand: { "@type": "Brand", name: "CIALÉ" },
            itemCondition: "https://schema.org/NewCondition",
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "COP",
              availability: "https://schema.org/InStock",
              url: `${SITE_URL}/#catalogo`,
            },
            // Solo con reseñas reales registradas por el admin — nunca inventadas.
            ...(count > 0 && {
              review: productReviews.slice(0, 5).map((review) => ({
                "@type": "Review",
                author: { "@type": "Person", name: review.authorName },
                datePublished: review.datePublished.slice(0, 10),
                ...(review.comment
                  ? { reviewBody: review.comment }
                  : {}),
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: review.rating,
                  bestRating: 5,
                  worstRating: 1,
                },
              })),
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: Number(average.toFixed(1)),
                reviewCount: count,
                bestRating: 5,
                worstRating: 1,
              },
            }),
          },
        };
      }),
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
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const structuredData = await buildStructuredData();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="es" style={{ colorScheme: "light" }} className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
