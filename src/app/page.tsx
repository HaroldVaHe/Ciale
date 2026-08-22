"use client";

import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import SobreNosotros from "@/components/SobreNosotros";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProductGrid />
        <SobreNosotros />
        <FaqSection />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
