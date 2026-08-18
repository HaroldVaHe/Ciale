"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, MessageCircle, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCOP } from "@/lib/utils";
import type { Product } from "@/data/products";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [initial, setInitial] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);

  if (!product) return null;

  const variant = product.variants.find((v) => v.id === selectedVariant) || product.variants[0];

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        variantId: variant.id,
        variantName: variant.name,
        variantHex: variant.hex,
        initial: product.customizable ? initial : undefined,
        image: product.image,
      });
    }
    setShowAdded(true);
    setTimeout(() => {
      setShowAdded(false);
      onClose();
    }, 1200);
  };

  const waLink = `https://wa.me/573203039847?text=${encodeURIComponent(
    `Hola CIALÉ! Me interesa el collar "${product.name}" en color ${variant.name}${
      product.customizable && initial ? ` con inicial "${initial}"` : ""
    }. Cantidad: ${quantity}. ¿Está disponible?`
  )}`;

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl overflow-hidden md:max-w-3xl md:w-full md:max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-charcoal hover:text-coral transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div
                className={`aspect-[4/5] md:aspect-auto md:h-full bg-gradient-to-br ${product.gradient} relative overflow-hidden`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.customizable && (
                  <div className="absolute top-4 left-4 bg-gold/90 text-white text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium">
                    Personalizable
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6 md:p-8 flex flex-col">
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-coffee mb-2">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-soft mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Variants */}
                <div className="mb-5">
                  <label className="text-[10px] tracking-widest uppercase text-gray-soft font-medium block mb-2">
                    Color / Material
                  </label>
                  <div className="flex items-center gap-3">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v.id)}
                        title={v.name}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          variant.id === v.id
                            ? "border-coffee scale-110 ring-2 ring-coffee/20"
                            : "border-border hover:border-gray-light"
                        }`}
                        style={{ backgroundColor: v.hex }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-soft mt-1.5">
                    Seleccionado: {variant.name}
                  </p>
                </div>

                {/* Customizable */}
                {product.customizable && (
                  <div className="mb-5">
                    <label className="text-[10px] tracking-widest uppercase text-gray-soft font-medium block mb-1.5">
                      {product.customizableLabel || "Inicial"}
                    </label>
                    <input
                      type="text"
                      maxLength={1}
                      value={initial}
                      onChange={(e) => setInitial(e.target.value.toUpperCase())}
                      placeholder="Escribe una letra"
                      className="w-20 h-11 text-center border border-border rounded-lg text-lg font-serif text-coffee focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 transition-all"
                    />
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <label className="text-[10px] tracking-widest uppercase text-gray-soft font-medium block mb-1.5">
                    Cantidad
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 border border-border rounded-md flex items-center justify-center text-charcoal hover:border-coral hover:text-coral transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-medium text-coffee">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 border border-border rounded-md flex items-center justify-center text-charcoal hover:border-coral hover:text-coral transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <p className="font-serif text-2xl font-semibold text-coffee mb-6">
                  {formatCOP(product.price)}
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-3 mt-auto">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAdd}
                    className="w-full bg-coffee text-white py-3.5 rounded-md text-xs tracking-[0.2em] uppercase font-medium hover:bg-charcoal transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    {showAdded ? (
                      <span>✓ Agregado al carrito</span>
                    ) : (
                      <>
                        <ShoppingBag size={16} />
                        Agregar al carrito
                      </>
                    )}
                  </motion.button>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-sage/80 text-white py-3.5 rounded-md text-xs tracking-[0.2em] uppercase font-medium hover:bg-sage transition-colors duration-300 flex items-center justify-center gap-2 text-center"
                  >
                    <MessageCircle size={16} />
                    Comprar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
