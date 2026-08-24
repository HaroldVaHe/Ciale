import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCOP } from "@/lib/utils";
import OrderStatusControls from "@/components/admin/OrderStatusControls";

export const metadata = { robots: { index: false, follow: false } };

type OrderStatus = "nuevo" | "confirmado" | "enviado" | "entregado" | "cancelado";
type OrderRow = {
  id: string;
  status: OrderStatus;
  customer_name: string | null;
  customer_phone: string | null;
  delivery_address: string | null;
  notes: string | null;
  total: number;
  created_at: string;
};
type ItemRow = {
  id: string;
  order_id: string;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  nuevo: "bg-coral/10 text-coral border-coral/40",
  confirmado: "bg-gold/15 text-coffee border-gold/50",
  enviado: "bg-coffee/5 text-coffee border-coffee/30",
  entregado: "bg-sage/10 text-sage border-sage/40",
  cancelado: "bg-charcoal/5 text-charcoal/50 border-border line-through",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  nuevo: "Nuevo",
  confirmado: "Confirmado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminOrdersPage() {
  const supabase = await createSupabaseServerClient();

  const [ordersResult, itemsResult] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("order_items").select("*"),
  ]);

  const orders = (ordersResult.data ?? []) as unknown as OrderRow[];
  const itemsByOrder = new Map<string, ItemRow[]>();
  for (const item of (itemsResult.data ?? []) as unknown as ItemRow[]) {
    (itemsByOrder.get(item.order_id) ??
      itemsByOrder.set(item.order_id, []).get(item.order_id))!.push(item);
  }

  const counts = orders.reduce<Record<OrderStatus | "total", number>>(
    (acc, order) => {
      acc[order.status] = (acc[order.status] ?? 0) + 1;
      acc.total += 1;
      return acc;
    },
    { total: 0, nuevo: 0, confirmado: 0, enviado: 0, entregado: 0, cancelado: 0 }
  );

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-coffee">
          Pedidos
        </h1>
        <p className="text-sm text-gray-soft mt-1">
          Cada checkout por WhatsApp queda registrado aquí. Avanza el estado a
          medida que gestionas el pedido; cancela si no se concretó.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-3 py-1.5 rounded-full text-[11px] tracking-widest uppercase font-medium bg-white border border-border text-charcoal">
          Total: {counts.total}
        </span>
        {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((status) => (
          <span
            key={status}
            className={`px-3 py-1.5 rounded-full text-[11px] tracking-widest uppercase font-medium border ${STATUS_BADGE[status]} ${status === "cancelado" ? "" : ""}`}
          >
            {STATUS_LABEL[status]}: {counts[status]}
          </span>
        ))}
      </div>

      {ordersResult.error ? (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          No se pudieron cargar los pedidos: {ordersResult.error.message}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-soft py-12 text-center">
          Aún no hay pedidos registrados. Cuando alguien finalice una compra por
          WhatsApp aparecerá aquí automáticamente.
        </p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const items = itemsByOrder.get(order.id) ?? [];
            return (
              <li
                key={order.id}
                className="bg-white border border-border rounded-xl p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-medium border ${STATUS_BADGE[order.status]}`}
                    >
                      {STATUS_LABEL[order.status]}
                    </span>
                    <span className="text-xs text-gray-soft">
                      CL-{order.id.slice(0, 8).toUpperCase()} ·{" "}
                      {dateFormatter.format(new Date(order.created_at))}
                    </span>
                  </div>
                  <span className="font-serif text-lg font-semibold text-coffee">
                    {formatCOP(Number(order.total))}
                  </span>
                </div>

                {(order.customer_name || order.customer_phone || order.delivery_address || order.notes) && (
                  <div className="text-xs text-charcoal/70 space-y-0.5 mb-3">
                    {order.customer_name && <p>Cliente: {order.customer_name}</p>}
                    {order.customer_phone && <p>Tel: {order.customer_phone}</p>}
                    {order.delivery_address && <p>Dirección: {order.delivery_address}</p>}
                    {order.notes && <p className="italic">Nota: {order.notes}</p>}
                  </div>
                )}

                <ul className="border-t border-dashed border-border pt-3 mb-4 space-y-1">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-baseline justify-between gap-4 text-sm">
                      <span className="text-charcoal min-w-0 truncate">
                        {item.product_name}
                        {item.variant_name && (
                          <span className="text-gray-soft"> · {item.variant_name}</span>
                        )}
                        <span className="text-gray-soft"> x{item.quantity}</span>
                      </span>
                      <span className="text-charcoal/70 shrink-0 tabular-nums">
                        {formatCOP(item.unit_price * item.quantity)}
                      </span>
                    </li>
                  ))}
                  {items.length === 0 && (
                    <li className="text-xs text-gray-soft italic">
                      Sin artículos registrados.
                    </li>
                  )}
                </ul>

                <OrderStatusControls id={order.id} status={order.status} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
