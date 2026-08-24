import { createSupabaseServerClient } from "@/lib/supabase/server";
import ReviewCreateForm from "@/components/admin/ReviewCreateForm";
import ReviewRow from "@/components/admin/ReviewRow";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminReviewsPage() {
  const supabase = await createSupabaseServerClient();

  const [reviewsResult, productsResult] = await Promise.all([
    supabase
      .from("product_reviews")
      .select("id, product_id, author_name, rating, comment, is_published, created_at, products(name)")
      .order("created_at", { ascending: false }),
    supabase.from("products").select("id, name").order("name"),
  ]);

  type ReviewWithProduct = {
    id: string;
    product_id: string;
    author_name: string;
    rating: number;
    comment: string | null;
    is_published: boolean;
    created_at: string;
    products: { name: string } | null;
  };

  const reviews = (reviewsResult.data ?? []) as unknown as ReviewWithProduct[];
  const products = productsResult.data ?? [];
  const publishedCount = reviews.filter((r) => r.is_published).length;

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-coffee">
          Reseñas
        </h1>
        <p className="text-sm text-gray-soft mt-1">
          Testimonios reales de clientes (recíbelos por WhatsApp y regístralos
          aquí). Solo las publicadas se muestran en la tienda y alimentan las
          calificaciones de Google.
        </p>
      </header>

      <section className="bg-white border border-border rounded-xl p-6 mb-10">
        <h2 className="text-xs tracking-widest uppercase font-medium text-coffee mb-4">
          Nueva reseña
        </h2>
        {products.length > 0 ? (
          <ReviewCreateForm
            products={products.map((p) => ({ id: p.id, name: p.name }))}
          />
        ) : (
          <p className="text-sm text-gray-soft">
            Crea un producto primero para poder registrar reseñas.
          </p>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs tracking-widest uppercase font-medium text-coffee">
            Registradas ({reviews.length})
          </h2>
          <p className="text-xs text-gray-soft">
            {publishedCount} publicadas · {reviews.length - publishedCount}{" "}
            ocultas
          </p>
        </div>

        {reviewsResult.error ? (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            No se pudieron cargar las reseñas. Si es la primera vez, ejecuta{" "}
            <code>supabase/reviews.sql</code> en el SQL Editor del proyecto.
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-gray-soft py-8 text-center">
            Aún no hay reseñas registradas.
          </p>
        ) : (
          <ul className="bg-white border border-border rounded-xl divide-y divide-border">
            {reviews.map((review) => (
              <ReviewRow
                key={review.id}
                id={review.id}
                productName={review.products?.name ?? review.product_id}
                authorName={review.author_name}
                rating={review.rating}
                comment={review.comment}
                isPublished={review.is_published}
                createdAt={review.created_at}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
