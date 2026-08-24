import {
  createSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import type { CartItem } from "@/context/CartContext";

export interface OrderDeliveryInfo {
  address: string;
  city: string;
  department: string;
  notes?: string;
}

/**
 * Crea el pedido en Supabase y devuelve el id para poder referenciarlo
 * en el mensaje de WhatsApp. Si Supabase no está configurado o falla,
 * devuelve null — el checkout por WhatsApp nunca se bloquea.
 */
export async function saveOrder(
  items: CartItem[],
  total: number,
  delivery?: OrderDeliveryInfo
): Promise<string | null> {
  if (!isSupabaseConfigured() || items.length === 0) return null;

  const supabase = createSupabaseBrowserClient();

  try {
    const fullAddress = delivery
      ? `${delivery.address}, ${delivery.city}, ${delivery.department}`
      : null;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        total,
        delivery_address: fullAddress,
        notes: delivery?.notes?.trim() ? delivery.notes.trim() : null,
      })
      .select("id")
      .single();

    if (error || !data) return null;

    const { error: itemsError } = await supabase.from("order_items").insert(
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

    // El pedido ya existe; si los ítems fallan igual devolvemos el id.
    return itemsError ? null : data.id;
  } catch {
    return null;
  }
}

/** Referencia corta y legible del pedido (ej. "CL-3F9C2E1"). */
export function orderRef(id: string): string {
  return `CL-${id.slice(0, 8).toUpperCase()}`;
}
