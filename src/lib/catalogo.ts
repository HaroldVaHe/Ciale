import {
  createSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import {
  categories as fallbackCategories,
  products as fallbackProducts,
  type CategoryId,
  type Product,
  type ProductVariant,
} from "@/data/products";
import type { Database } from "@/lib/supabase/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export interface CatalogoCategory {
  id: CategoryId;
  label: string;
}

export interface StorefrontReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export type ReviewsByProduct = Record<string, StorefrontReview[]>;

export interface Catalogo {
  products: Product[];
  categories: CatalogoCategory[];
  reviewsByProduct: ReviewsByProduct;
}

export function getLocalCatalogo(): Catalogo {
  return {
    products: fallbackProducts,
    categories: fallbackCategories.map((c) => ({ id: c.id, label: c.label })),
    reviewsByProduct: {},
  };
}

function mapDbProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category_id ?? "coleccion",
    tags: row.tags ?? [],
    image: row.image,
    gradient: row.gradient,
    variants: Array.isArray(row.variants)
      ? (row.variants as unknown as ProductVariant[])
      : [],
  };
}

/**
 * Catálogo para la tienda: lee de Supabase si está configurado;
 * ante error, datos vacíos o falta de variables de entorno,
 * devuelve los datos hardcodeados (la tienda nunca se rompe).
 */
export async function getCatalogo(): Promise<Catalogo> {
  if (!isSupabaseConfigured()) return getLocalCatalogo();

  try {
    const supabase = createSupabaseBrowserClient();
    const [categoriesResult, productsResult] = await Promise.all([
      supabase.from("categories").select("id, label").order("sort_order"),
      supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order"),
    ]);

    if (categoriesResult.error || productsResult.error) {
      throw categoriesResult.error ?? productsResult.error;
    }

    const dbProducts = (productsResult.data ?? []).map(mapDbProduct);

    const reviewsByProduct = await getPublishedReviews(supabase);

    return {
      products: dbProducts.length > 0 ? dbProducts : fallbackProducts,
      categories: [
        { id: "all", label: "Todos" },
        ...(categoriesResult.data ?? []).map((row) => ({
          id: row.id,
          label: row.label,
        })),
      ],
      reviewsByProduct,
    };
  } catch {
    return getLocalCatalogo();
  }
}

/**
 * Reseñas publicadas agrupadas por producto. Un fallo aquí (p. ej. la tabla
 * aún no existe porque no se ejecutó reviews.sql) NO tumba el catálogo:
 * simplemente devuelve un mapa vacío.
 */
async function getPublishedReviews(
  supabase: ReturnType<typeof createSupabaseBrowserClient>
): Promise<ReviewsByProduct> {
  try {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("id, product_id, author_name, rating, comment, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) return {};

    const map: ReviewsByProduct = {};
    for (const row of data ?? []) {
      const review: StorefrontReview = {
        id: row.id,
        productId: row.product_id,
        authorName: row.author_name,
        rating: row.rating,
        comment: row.comment,
        createdAt: row.created_at,
      };
      (map[row.product_id] ??= []).push(review);
    }
    return map;
  } catch {
    return {};
  }
}
