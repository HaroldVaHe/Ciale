import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProductForm, {
  type ProductFormValues,
} from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [{ data: product }, { data: categories }, { data: tagRows }] =
    await Promise.all([
      supabase.from("products").select("*").eq("id", id).single(),
      supabase.from("categories").select("id, label").order("sort_order"),
      supabase.from("products").select("tags"),
    ]);

  if (!product) {
    notFound();
  }

  const allTags = [
    ...new Set((tagRows ?? []).flatMap((row) => row.tags ?? [])),
  ].sort();

  const values: ProductFormValues = {
    id: product.id,
    name: product.name,
    description: product.description,
    category_id: product.category_id ?? "",
    price: Number(product.price),
    gradient: product.gradient ?? "",
    tags: product.tags ?? [],
    variants: Array.isArray(product.variants)
      ? (product.variants as unknown as Array<Record<string, string>>)
      : [],
    sort_order: product.sort_order,
    is_active: product.is_active,
    image: product.image ?? "",
  };

  return (
    <section className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-xs tracking-[0.4em] uppercase font-medium text-coral mb-2">
          Catálogo
        </p>
        <h1 className="font-serif text-3xl font-semibold text-coffee">
          Editar: {values.name}
        </h1>
      </div>

      <ProductForm
        mode="edit"
        categories={categories ?? []}
        allTags={allTags}
        product={values}
      />
    </section>
  );
}
