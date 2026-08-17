"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, MessageCircle, Eye, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCOP } from "@/lib/utils";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [initial, setInitial] = useState("");
  const [showAdded, setShowAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      variantHex: selectedVariant.hex,
      initial: product.customizable ? initial : undefined,
      image: product.image,
    });
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 1500);
  };

  const waLink = `https://wa.me/573203039847?text=${encodeURIComponent(
    `Hola CIALÉ! Me interesa el collar "${product.name}" en color ${selectedVariant.name}${
      product.customizable && initial ? ` con inicial "${initial}"` : ""
    }. ¿Está disponible?`
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
        {/* Placeholder jewelry icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-white/40 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center">
              <span className="font-serif text-3xl text-white/60 italic">
                {product.name[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-300 flex items-center justify-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs tracking-widest uppercase font-medium text-coffee flex items-center gap-2"
          >
            <Eye size={14} />
            Vista rápida
          </motion.button>
        </div>

        {/* Quick view badge */}
        {product.customizable && (
          <div className="absolute top-3 left-3 bg-gold/90 text-white text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium">
            Personalizable
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-coffee mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-soft mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Color swatches */}
        <div className="flex items-center gap-2 mb-3">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariant(v)}
              title={v.name}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                selectedVariant.id === v.id
                  ? "border-coffee scale-110 ring-1 ring-coffee/20"
                  : "border-border hover:border-gray-light"
              }`}
              style={{ backgroundColor: v.hex }}
            />
          ))}
          <span className="text-[10px] text-gray-soft ml-1">{selectedVariant.name}</span>
        </div>

        {/* Customizable input */}
        {product.customizable && (
          <div className="mb-3">
            <label className="text-[10px] tracking-widest uppercase text-gray-soft font-medium block mb-1">
              {product.customizableLabel || "Inicial"}
            </label>
            <input
              type="text"
              maxLength={1}
              value={initial}
              onChange={(e) => setInitial(e.target.value.toUpperCase())}
              placeholder="A"
              className="w-12 h-9 text-center border border-border rounded-md text-sm font-serif text-coffee focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral/20 transition-all"
            />
          </div>
        )}

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
