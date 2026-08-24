"use client";

import { deleteReview, toggleReviewPublished } from "@/app/admin/reviews/actions";

interface ReviewRowProps {
  id: string;
  productName: string;
  authorName: string;
  rating: number;
  comment: string | null;
  isPublished: boolean;
  createdAt: string;
}

export default function ReviewRow({
  id,
  productName,
  authorName,
  rating,
  comment,
  isPublished,
  createdAt,
}: ReviewRowProps) {
  function handleToggle() {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("published", String(isPublished));
    void toggleReviewPublished(formData);
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `¿Eliminar la reseña de ${authorName} para "${productName}"?`
    );
    if (!confirmed) return;

    const formData = new FormData();
    formData.set("id", id);
    void deleteReview(formData);
  }

  return (
    <li className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4 border-b border-border last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-coffee truncate">{productName}</p>
        <p className="text-xs text-gold leading-none mt-1" aria-label={`${rating} de 5 estrellas`}>
          {"★".repeat(rating)}
          {"☆".repeat(5 - rating)}
        </p>
        {comment && (
          <p className="text-sm text-charcoal/80 italic mt-1 line-clamp-2">
            “{comment}”
          </p>
        )}
        <p className="text-xs text-gray-soft mt-1">
          — {authorName} ·{" "}
          {new Date(createdAt).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleToggle}
          title={isPublished ? "Ocultar de la tienda" : "Publicar en la tienda"}
          className={`px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-medium border transition-colors duration-200 ${
            isPublished
              ? "bg-sage/10 text-sage border-sage/40 hover:bg-sage/20"
              : "bg-white text-gray-soft border-border hover:border-coral hover:text-coral"
          }`}
        >
          {isPublished ? "Publicada" : "Oculta"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          title="Eliminar reseña"
          aria-label={`Eliminar reseña de ${authorName}`}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-gray-soft hover:text-red-600 hover:border-red-300 transition-colors duration-200"
        >
          ✕
        </button>
      </div>
    </li>
  );
}
