"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/guard";

export interface ReviewFormState {
  error: string | null;
  ok: boolean;
}

const REVIEWS_PATH = "/admin/reviews";

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createReview(
  _prev: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  let supabase;
  try {
    supabase = await requireAdmin();
  } catch {
    return { error: "Sesión expirada o sin permisos. Vuelve a iniciar sesión.", ok: false };
  }

  const productId = text(formData, "product_id");
  const authorName = text(formData, "author_name");
  const rating = Number(text(formData, "rating"));
  const comment = text(formData, "comment");

  if (!productId) return { error: "Selecciona el producto.", ok: false };
  if (!authorName) return { error: "El nombre del cliente es obligatorio.", ok: false };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "La calificación debe estar entre 1 y 5 estrellas.", ok: false };
  }

  const { error } = await supabase.from("product_reviews").insert({
    product_id: productId,
    author_name: authorName,
    rating,
    comment: comment || null,
    is_published: formData.get("is_published") === "on",
  });

  if (error) {
    if (error.code === "23503") {
      return { error: "El producto seleccionado ya no existe.", ok: false };
    }
    return { error: `No se pudo guardar la reseña: ${error.message}`, ok: false };
  }

  revalidatePath(REVIEWS_PATH);
  revalidatePath("/");
  return { error: null, ok: true };
}

export async function toggleReviewPublished(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  const published = text(formData, "published") === "true";
  if (!id) return;

  await supabase
    .from("product_reviews")
    .update({ is_published: !published })
    .eq("id", id);

  revalidatePath(REVIEWS_PATH);
  revalidatePath("/");
}

export async function deleteReview(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;

  await supabase.from("product_reviews").delete().eq("id", id);
  revalidatePath(REVIEWS_PATH);
  revalidatePath("/");
}
