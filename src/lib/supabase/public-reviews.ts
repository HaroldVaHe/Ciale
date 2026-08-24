import { createClient } from "@supabase/supabase-js";

/**
 * Reseñas públicas SOLO para el JSON-LD del servidor.
 * Usa un cliente plano de supabase-js (sin cookies) para que el root
 * layout siga siendo estático: las reseñas se leen en el prerender y
 * se actualizan con cada deploy. Ante cualquier fallo devuelve {} —
 * el markup de ratings simplemente no aparece (nunca se inventa nada).
 */
export interface SeoReview {
  authorName: string;
  rating: number;
  comment: string | null;
  datePublished: string;
}

export type SeoReviewsByProduct = Record<string, SeoReview[]>;

export async function getPublicReviewsForSeo(): Promise<SeoReviewsByProduct> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return {};

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("product_reviews")
      .select("product_id, author_name, rating, comment, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(500);

    if (error || !data) return {};

    const map: SeoReviewsByProduct = {};
    for (const row of data) {
      (map[row.product_id] ??= []).push({
        authorName: row.author_name,
        rating: row.rating,
        comment: row.comment,
        datePublished: row.created_at,
      });
    }
    return map;
  } catch {
    return {};
  }
}
