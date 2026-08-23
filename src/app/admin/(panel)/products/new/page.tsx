import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const supabase = await createSupabaseServerClient();
  const [{ data: categories }, { data: tagRows }] = await Promise.all([
    supabase.from("categories").select("id, label").order("sort_order"),
    supabase.from("products").select("tags"),
  ]);

  const allTags = [
    ...new Set((tagRows ?? []).flatMap((row) => row.tags ?? [])),
  ].sort();

  return (
    <section className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-xs tracking-[0.4em] uppercase font-medium text-coral mb-2">
          Catálogo
        </p>
        <h1 className="font-serif text-3xl font-semibold text-coffee">
          Nuevo producto
        </h1>
        <p className="text-sm text-charcoal/60 mt-1">
          Al crearlo aparecerá en la tienda si está marcado como visible.
        </p>
      </div>

      <ProductForm mode="create" categories={categories ?? []} allTags={allTags} />
    </section>
  );
}
