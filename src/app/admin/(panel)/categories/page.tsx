import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCategory } from "@/app/admin/categories/actions";
import CategoryRow from "@/components/admin/CategoryRow";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, supabase] = await Promise.all([
    searchParams,
    createSupabaseServerClient(),
  ]);

  const [{ data: categories }, { data: productCategories }] = await Promise.all([
    supabase.from("categories").select("id, label").order("sort_order"),
    supabase.from("products").select("category_id"),
  ]);

  const counts = new Map<string, number>();
  for (const row of productCategories ?? []) {
    const categoryId = row.category_id;
    if (!categoryId) continue;
    counts.set(categoryId, (counts.get(categoryId) ?? 0) + 1);
  }

  return (
    <section className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-coffee">
          Categorías
        </h1>
        <p className="text-sm text-charcoal/60 mt-1">
          El orden aquí define las pestañas del catálogo en la tienda.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <form
        action={createCategory}
        className="flex items-center gap-3 mb-8 bg-white rounded-2xl border border-border p-4"
      >
        <input
          name="label"
          required
          placeholder="Nombre de la nueva categoría, ej. Pulseras"
          aria-label="Nombre de la nueva categoría"
          className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-white text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-full bg-coffee text-white text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-coral transition-colors duration-300 shrink-0"
        >
          Crear
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-widest uppercase text-charcoal/50 border-b border-border bg-stone-50">
              <th className="px-4 py-3 font-medium w-12">Orden</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Productos</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(categories ?? []).map((category, index) => (
              <CategoryRow
                key={category.id}
                id={category.id}
                label={category.label}
                productCount={counts.get(category.id) ?? 0}
                isFirst={index === 0}
                isLast={index === (categories?.length ?? 1) - 1}
              />
            ))}
            {(categories ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-charcoal/50">
                  No hay categorías todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
