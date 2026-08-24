"use client";

import { useState, useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import {
  getCatalogo,
  getLocalCatalogo,
  type Catalogo,
} from "@/lib/catalogo";
import type { CategoryId, Product } from "@/data/products";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";

export default function ProductGrid() {
  const [catalogo, setCatalogo] = useState<Catalogo>(getLocalCatalogo);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [search, setSearch] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    let active = true;
    getCatalogo().then((data) => {
      if (active) setCatalogo(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return catalogo.products.filter((p) => {
      const matchCategory =
        activeCategory === "all" || p.category === activeCategory;
      const matchSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [catalogo.products, activeCategory, search]);

  return (
    <>
      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] uppercase font-medium text-coral mb-3">
            Nuestra Colección
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-coffee">
            Encuentra tu pieza perfecta
          </h2>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Category tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {catalogo.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-[11px] tracking-widest uppercase font-medium rounded-full border transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-coffee text-white border-coffee"
                    : "bg-white text-charcoal border-border hover:border-coral hover:text-coral"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-soft"
            />
            <input
              id="catalogo-search"
              type="text"
              placeholder="Buscar collar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-full text-sm text-charcoal placeholder:text-gray-light focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral/20 transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-soft text-sm">
              No encontramos productos que coincidan con tu búsqueda.
            </p>
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        reviews={
          quickViewProduct
            ? (catalogo.reviewsByProduct[quickViewProduct.id] ?? [])
            : []
        }
      />
    </>
  );
}
