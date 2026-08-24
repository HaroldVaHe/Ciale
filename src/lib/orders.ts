import {
  createSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import type { CartItem } from "@/context/CartContext";

/**
 * Guarda el pedido en Supabase ANTES/AL MISMO TIEMPO de abrir WhatsApp.
 * Fire-and-forget: nunca bloquea ni rompe el checkout. Sin env vars o
 * ante error, simplemente no se guarda (el pedido sigue llegando por
 * WhatsApp, que es el canal fuente de la verdad).
 */
export function saveOrder(
  items: CartItem[],
  total: number,
  deliveryAddress?: string
): void {
  if (!isSupabaseConfigured() || items.length === 0) return;

  const supabase = createSupabaseBrowserClient();

  void (async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          total,
          delivery_address: deliveryAddress ?? null,
        })
        .select("id")
        .single();

      if (error || !data) return;

      await supabase.from("order_items").insert(
        items.map((item) => ({
          order_id: data.id,
          product_slug: item.productId,
          product_name: item.name,
          variant_name:
            item.variantName && item.variantName.trim() !== ""
              ? item.variantName
              : null,
          quantity: item.quantity,
          unit_price: item.price,
        }))
      );
    } catch {
      // El checkout por WhatsApp es lo importante; el guardado es best-effort.
    }
  })();
}
