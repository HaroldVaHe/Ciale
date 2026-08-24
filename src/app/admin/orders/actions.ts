"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/guard";
import type { Database } from "@/lib/supabase/types";

type OrderStatus = Database["public"]["Tables"]["orders"]["Row"]["status"];

const VALID_STATUSES: OrderStatus[] = [
  "nuevo",
  "confirmado",
  "enviado",
  "entregado",
  "cancelado",
];

const ORDERS_PATH = "/admin/orders";

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function setOrderStatus(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status") as OrderStatus;
  if (!id || !VALID_STATUSES.includes(status)) return;

  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath(ORDERS_PATH);
}

export async function deleteOrder(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;

  await supabase.from("orders").delete().eq("id", id);
  revalidatePath(ORDERS_PATH);
}
