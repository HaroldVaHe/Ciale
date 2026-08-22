"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MessageCircle, Eye, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { WHATSAPP_NUMBER, formatCOP } from "@/lib/utils";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const [showAdded, setShowAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      variantId: product.variants[0]?.id || "",
      variantName: product.variants[0]?.name || "",
      variantHex: product.variants[0]?.hex || "",
      image: product.image,
    });
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 1500);
  };

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola CIALÉ! Me interesa el collar "${product.name}". ¿Está disponible?`
  )}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="group bg-white rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Image area */}
      <div
        className={`relative aspect-[4/5] bg-gradient-to-br ${product.gradient} overflow-hidden cursor-pointer`}
        onClick={() => onQuickView(product)}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-300 flex items-center justify-center pointer-events-none">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs tracking-widest uppercase font-medium text-coffee flex items-center gap-2 pointer-events-auto"
          >
            <Eye size={14} />
            Vista rápida
          </motion.button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-coffee mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-soft mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <p className="font-serif text-xl font-semibold text-coffee mb-3">
          {formatCOP(product.price)}
        </p>

        {/* Action buttons */}
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex-1 bg-coffee text-white py-2.5 rounded-md text-xs tracking-wider uppercase font-medium hover:bg-charcoal transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <AnimatePresence mode="wait">
              {showAdded ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  ✓ Agregado
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2"
                >
                  <Plus size={14} />
                  Agregar
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sage/80 text-white py-2.5 px-3 rounded-md hover:bg-sage transition-colors duration-300 flex items-center justify-center"
            title="Comprar por WhatsApp"
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
