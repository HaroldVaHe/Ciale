"use client";

import { deleteOrder, setOrderStatus } from "@/app/admin/orders/actions";
import type { Database } from "@/lib/supabase/types";

type OrderStatus = Database["public"]["Tables"]["orders"]["Row"]["status"];

interface OrderStatusControlsProps {
  id: string;
  status: OrderStatus;
}

const NEXT_ACTION: Partial<
  Record<OrderStatus, { next: OrderStatus; label: string }>
> = {
  nuevo: { next: "confirmado", label: "Confirmar" },
  confirmado: { next: "enviado", label: "Marcar enviado" },
  enviado: { next: "entregado", label: "Marcar entregado" },
};

export default function OrderStatusControls({
  id,
  status,
}: OrderStatusControlsProps) {
  function runAction(
    action: (formData: FormData) => Promise<void>,
    extra?: Record<string, string>,
    confirmMessage?: string
  ) {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    const formData = new FormData();
    formData.set("id", id);
    if (extra) {
      for (const [key, value] of Object.entries(extra)) {
        formData.set(key, value);
      }
    }
    void action(formData);
  }

  const transition = NEXT_ACTION[status];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {transition && (
        <button
          type="button"
          onClick={() =>
            runAction(setOrderStatus, { status: transition.next })
          }
          className="px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-medium border border-coffee/30 bg-coffee/5 text-coffee hover:bg-coffee hover:text-white transition-colors duration-200"
        >
          {transition.label}
        </button>
      )}

      {(status === "nuevo" || status === "confirmado") && (
        <button
          type="button"
          onClick={() =>
            runAction(
              setOrderStatus,
              { status: "cancelado" },
              `¿Cancelar este pedido?`
            )
          }
          className="px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-medium border border-border text-gray-soft hover:text-red-600 hover:border-red-300 transition-colors duration-200"
        >
          Cancelar
        </button>
      )}

      <button
        type="button"
        onClick={() =>
          runAction(deleteOrder, undefined, `¿Eliminar este pedido definitivamente? Los artículos se borran con él.`)
        }
        aria-label="Eliminar pedido"
        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-gray-soft hover:text-red-600 hover:border-red-300 transition-colors duration-200 ml-auto"
      >
        ✕
      </button>
    </div>
  );
}
