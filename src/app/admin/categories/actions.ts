"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/guard";

const CATEGORIES_PATH = "/admin/categories";

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function backWithError(error: string): never {
  redirect(`${CATEGORIES_PATH}?error=${encodeURIComponent(error)}`);
}

export async function createCategory(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const label = text(formData, "label");
  if (!label) backWithError("El nombre de la categoría es obligatorio.");

  const id = slugify(label);
  if (!id) backWithError("El nombre no produce un identificador válido.");

  const { data: last } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const { error } = await supabase.from("categories").insert({
    id,
    label,
    sort_order: (last?.[0]?.sort_order ?? 0) + 1,
  });

  if (error) {
    if (error.code === "23505") {
      backWithError(`Ya existe una categoría similar a "${label}".`);
    }
    backWithError(`No se pudo crear la categoría: ${error.message}`);
  }

  revalidatePath(CATEGORIES_PATH);
  revalidatePath("/");
}

export async function renameCategory(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  const label = text(formData, "label");
  if (!id || !label) return;

  const { error } = await supabase
    .from("categories")
    .update({ label })
    .eq("id", id);

  if (error) {
    backWithError(`No se pudo renombrar: ${error.message}`);
  }

  revalidatePath(CATEGORIES_PATH);
  revalidatePath("/");
}

/**
 * La BD bloquea borrar categorías con productos (FK en products.category_id).
 * Se verifica antes para dar un mensaje claro en lugar de un error crudo.
 */
export async function deleteCategory(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;

  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if ((count ?? 0) > 0) {
    backWithError(
      `"${id}" tiene ${count} producto(s) asociado(s). Reasígnalos antes de eliminarla.`
    );
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    backWithError(`No se pudo eliminar la categoría: ${error.message}`);
  }

  revalidatePath(CATEGORIES_PATH);
}

export async function moveCategory(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  const direction = text(formData, "direction");
  if (!id || (direction !== "up" && direction !== "down")) return;

  const { data } = await supabase
    .from("categories")
    .select("id")
    .order("sort_order");
  const list = data ?? [];
  const index = list.findIndex((row) => row.id === id);
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || targetIndex < 0 || targetIndex >= list.length) return;

  const swapped = [...list];
  [swapped[index], swapped[targetIndex]] = [
    swapped[targetIndex],
    swapped[index],
  ];

  await Promise.all([
    supabase
      .from("categories")
      .update({ sort_order: index + 1 })
      .eq("id", swapped[index].id),
    supabase
      .from("categories")
      .update({ sort_order: targetIndex + 1 })
      .eq("id", swapped[targetIndex].id),
  ]);

  revalidatePath(CATEGORIES_PATH);
  revalidatePath("/");
}
