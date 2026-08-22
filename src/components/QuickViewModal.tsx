"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { X, ShoppingBag, MessageCircle, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { WHATSAPP_NUMBER, formatCOP } from "@/lib/utils";
import type { Product } from "@/data/products";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  if (!product) return null;

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        variantId: product.variants[0]?.id || "",
        variantName: product.variants[0]?.name || "",
        variantHex: product.variants[0]?.hex || "",
        image: product.image,
      });
    }
    setShowAdded(true);
    setTimeout(() => {
      setShowAdded(false);
      onClose();
    }, 1200);
  };

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola CIALÉ! Me interesa el collar "${product.name}". Cantidad: ${quantity}. ¿Está disponible?`
  )}`;

  return (
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
            ref={imgRef}
            className={`aspect-[4/5] md:aspect-auto md:h-full bg-gradient-to-br ${product.gradient} relative overflow-hidden cursor-crosshair`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-200 ease-out"
              style={{
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                transform: isZooming ? "scale(2)" : "scale(1)",
              }}
            />
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-coffee mb-2">
              {product.name}
            </h2>
            <p className="text-sm text-gray-soft mb-6 leading-relaxed">
              {product.description}
            </p>

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
  );
}
