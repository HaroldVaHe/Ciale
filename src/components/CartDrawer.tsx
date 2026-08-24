"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { WHATSAPP_NUMBER, formatCOP, generateWhatsAppLink } from "@/lib/utils";
import { saveOrder, orderRef } from "@/lib/orders";
import { DEPARTAMENTOS } from "@/data/colombia";
import { useDialog } from "@/hooks/useDialog";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, total } = useCart();
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [fallbackLink, setFallbackLink] = useState<string | null>(null);
  const dialogRef = useDialog(isOpen, closeCart);

  const cities = useMemo(
    () => DEPARTAMENTOS.find((d) => d.nombre === department)?.ciudades ?? [],
    [department]
  );

  function buildWaLink(orderId?: string | null): string {
    return generateWhatsAppLink(WHATSAPP_NUMBER, {
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        variant: item.variantName || undefined,
        initial: item.initial,
      })),
      total,
      address: `${address}, ${city}, ${department}`,
      orderRef: orderId ? orderRef(orderId) : undefined,
      notes: notes.trim() || undefined,
    });
  }

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;

    setSaving(true);
    setFallbackLink(null);
    try {
      const orderId = await saveOrder(items, total, {
        address,
        city,
        department,
        notes: notes.trim() || undefined,
      });
      const link = buildWaLink(orderId);
      const win = window.open(link, "_blank", "noopener,noreferrer");
      if (!win) setFallbackLink(link);
    } catch {
      // Nunca bloqueamos el checkout por un error del guardado.
      const win = window.open(buildWaLink(), "_blank", "noopener,noreferrer");
      if (!win) setFallbackLink(buildWaLink());
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            aria-hidden="true"
            className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-cream shadow-2xl flex flex-col outline-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-coffee" />
                <h2 className="font-serif text-xl font-semibold text-coffee">
                  Tu Carrito
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-charcoal hover:text-coral transition-colors rounded-full hover:bg-nude/30"
                aria-label="Cerrar carrito"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-nude mb-4" />
                  <p className="font-serif text-lg text-coffee mb-2">
                    Tu carrito está vacío
                  </p>
                  <p className="text-sm text-gray-soft">
                    Explora nuestra colección y encuentra tu pieza perfecta.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.productId}-${item.variantId}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4 bg-white rounded-lg border border-border p-3"
                      >
                        {/* Mini image */}
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gradient-to-br from-nude to-coral/20 relative">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-serif text-sm font-semibold text-coffee truncate">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span
                                  className="w-3 h-3 rounded-full border border-border"
                                  style={{ backgroundColor: item.variantHex }}
                                />
                                <span className="text-[10px] text-gray-soft">
                                  {item.variantName}
                                </span>
                                {item.initial && (
                                  <span className="text-[10px] text-gold font-medium">
                                    | Inicial: {item.initial}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId, item.variantId)}
                              className="p-1 text-gray-soft hover:text-coral transition-colors"
                              aria-label="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.variantId,
                                    item.quantity - 1
                                  )
                                }
                                className="w-6 h-6 border border-border rounded flex items-center justify-center text-charcoal hover:border-coral transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-medium text-coffee w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.variantId,
                                    item.quantity + 1
                                  )
                                }
                                className="w-6 h-6 border border-border rounded flex items-center justify-center text-charcoal hover:border-coral transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-sm font-serif font-semibold text-coffee">
                              {formatCOP(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5 bg-white max-h-[55%] overflow-y-auto">
                <form onSubmit={handleCheckout} noValidate={false}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-charcoal">Subtotal</span>
                    <span className="font-serif text-xl font-semibold text-coffee">
                      {formatCOP(total)}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-soft mb-3 text-center">
                    El envío se calcula según tu ubicación
                  </p>

                  <div className="space-y-3 mb-4">
                    <div>
                      <label htmlFor="dir-departamento" className={checkoutLabel}>
                        Departamento *
                      </label>
                      <select
                        id="dir-departamento"
                        value={department}
                        onChange={(e) => {
                          setDepartment(e.target.value);
                          setCity("");
                        }}
                        required
                        className={checkoutInput}
                      >
                        <option value="" disabled>
                          Selecciona…
                        </option>
                        {DEPARTAMENTOS.map((dept) => (
                          <option key={dept.nombre} value={dept.nombre}>
                            {dept.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="dir-ciudad" className={checkoutLabel}>
                        Ciudad *
                      </label>
                      <select
                        id="dir-ciudad"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        disabled={!department}
                        className={`${checkoutInput} disabled:bg-nude/20 disabled:text-gray-soft`}
                      >
                        <option value="" disabled>
                          {department ? "Selecciona…" : "Elige un departamento primero"}
                        </option>
                        {cities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="dir-direccion" className={checkoutLabel}>
                        Dirección de entrega *
                      </label>
                      <input
                        id="dir-direccion"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Calle 123 #45-67, Barrio"
                        required
                        minLength={8}
                        className={checkoutInput}
                      />
                    </div>

                    <div>
                      <label htmlFor="dir-notas" className={checkoutLabel}>
                        Detalles adicionales (opcional)
                      </label>
                      <textarea
                        id="dir-notas"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Referencias para la entrega, embalaje para regalo…"
                        className={`${checkoutInput} resize-none`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-sage text-white py-3.5 rounded-md text-xs tracking-[0.2em] uppercase font-medium hover:bg-sage/90 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
                  >
                    <MessageCircle size={16} />
                    {saving ? "Preparando pedido…" : "Finalizar Pedido vía WhatsApp"}
                  </button>

                  {fallbackLink && (
                    <p className="mt-3 text-center text-xs text-gray-soft">
                      Si WhatsApp no se abrió,{" "}
                      <a
                        href={fallbackLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-coffee font-medium"
                      >
                        toca este enlace
                      </a>
                      .
                    </p>
                  )}
                </form>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const checkoutInput =
  "w-full px-3 py-2.5 bg-cream border border-border rounded-md text-sm text-charcoal placeholder:text-gray-light focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral/20 transition-all";

const checkoutLabel =
  "block text-[10px] tracking-widest uppercase text-gray-soft font-medium mb-1.5";
