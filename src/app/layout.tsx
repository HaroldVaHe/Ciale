import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

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
  title: "CIALÉ | Joyería Artesanal",
  description:
    "Cada pieza es única. Como quién la lleva. Joyería artesanal creada con amor para acompañar tus mejores momentos.",
  keywords: [
    "joyería artesanal",
    "collares",
    "dijes",
    "hecho a mano",
    "Colombia",
    "CIALÉ",
  ],
  openGraph: {
    title: "CIALÉ | Joyería Artesanal",
    description:
      "Detalles que cuentan historias. Joyería artesanal creada con amor.",
    url: "https://ciale.online",
    siteName: "CIALÉ Jewelry",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" style={{ colorScheme: "light" }} className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
