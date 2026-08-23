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

export interface Catalogo {
  products: Product[];
  categories: CatalogoCategory[];
}

export function getLocalCatalogo(): Catalogo {
  return {
    products: fallbackProducts,
    categories: fallbackCategories.map((c) => ({ id: c.id, label: c.label })),
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

    return {
      products: dbProducts.length > 0 ? dbProducts : fallbackProducts,
      categories: [
        { id: "all", label: "Todos" },
        ...(categoriesResult.data ?? []).map((row) => ({
          id: row.id,
          label: row.label,
        })),
      ],
    };
  } catch {
    return getLocalCatalogo();
  }
}
