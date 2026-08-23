import Link from "next/link";
import { Pencil } from "lucide-react";
import { formatCOP } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { moveProduct } from "@/app/admin/products/actions";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ToggleActiveButton from "@/components/admin/ToggleActiveButton";
import ReorderButtons from "@/components/admin/ReorderButtons";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export default async function AdminProductsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order");

  if (error) {
    return (
      <p role="alert" className="text-sm text-red-600">
        Error cargando productos: {error.message}
      </p>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-coffee">
            Productos
          </h1>
          <p className="text-sm text-charcoal/60 mt-1">
            {products?.length ?? 0} en catálogo
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 rounded-full bg-coffee text-white text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-coral transition-colors duration-300"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-widest uppercase text-charcoal/50 border-b border-border bg-stone-50">
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Categoría</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Precio</th>
              <th className="px-4 py-3 font-medium hidden lg:table-cell">Orden</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((product: ProductRow, index: number) => (
              <tr
                key={product.id}
                className={`border-b border-border/60 last:border-0 ${
                  product.is_active ? "" : "opacity-50"
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element -- miniatura simple; evita optimización por imagen */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-nude/40"
                    />
                    <div>
                      <p className="font-medium text-charcoal">{product.name}</p>
                      <p className="text-xs text-charcoal/40 font-mono">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-charcoal/70">
                  {product.category_id}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-charcoal/70">
                  {formatCOP(product.price)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-charcoal/40 tabular-nums w-4">
                      {product.sort_order}
                    </span>
                    <ReorderButtons
                      id={product.id}
                      canUp={index > 0}
                      canDown={index < (products?.length ?? 1) - 1}
                      action={moveProduct}
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] tracking-widest uppercase font-medium ${
                      product.is_active
                        ? "bg-sage/20 text-coffee"
                        : "bg-nude/40 text-charcoal/60"
                    }`}
                  >
                    {product.is_active ? "Activo" : "Oculto"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <ToggleActiveButton id={product.id} active={product.is_active} />
                    <Link
                      href={`/admin/products/${product.id}`}
                      aria-label={`Editar ${product.name}`}
                      className="p-2 rounded-lg border border-border text-charcoal hover:border-coral hover:text-coral transition-colors duration-300"
                    >
                      <Pencil size={14} />
                    </Link>
                    <DeleteProductButton id={product.id} name={product.name} />
                  </div>
                </td>
              </tr>
            ))}
            {(products ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-charcoal/50">
                  No hay productos todavía. Crea el primero con “+ Nuevo producto”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
