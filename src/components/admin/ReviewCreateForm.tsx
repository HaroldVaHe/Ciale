"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createReview,
  type ReviewFormState,
} from "@/app/admin/reviews/actions";

interface ReviewCreateFormProps {
  products: Array<{ id: string; name: string }>;
}

const INITIAL_STATE: ReviewFormState = { error: null, ok: false };

export default function ReviewCreateForm({ products }: ReviewCreateFormProps) {
  const [state, formAction, pending] = useActionState(
    createReview,
    INITIAL_STATE
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rf-product" className="block text-xs tracking-widest uppercase font-medium text-coffee mb-2">
            Producto *
          </label>
          <select
            id="rf-product"
            name="product_id"
            required
            className={inputClass}
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona…
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rf-rating" className="block text-xs tracking-widest uppercase font-medium text-coffee mb-2">
            Calificación *
          </label>
          <select id="rf-rating" name="rating" required defaultValue="5" className={inputClass}>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {"★".repeat(value)}{"☆".repeat(5 - value)} ({value})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="rf-author" className="block text-xs tracking-widest uppercase font-medium text-coffee mb-2">
          Cliente *
        </label>
        <input
          id="rf-author"
          name="author_name"
          required
          placeholder="Nombre de quien dejó el testimonio"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="rf-comment" className="block text-xs tracking-widest uppercase font-medium text-coffee mb-2">
          Testimonio
        </label>
        <textarea
          id="rf-comment"
          name="comment"
          rows={3}
          placeholder="Lo que contó la cliente por WhatsApp, con sus palabras"
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-charcoal">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked
          className="w-4 h-4 accent-coffee"
        />
        Publicada (visible en la tienda)
      </label>

      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="status" className="text-sm text-green-700">
          Reseña guardada.
        </p>
      )}

      <button
        type="submit"
        disabled={pending || products.length === 0}
        className="px-6 py-2.5 rounded-full bg-coffee text-white text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-coral transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Guardando…" : "Registrar reseña"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-border bg-white text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 transition-all duration-300";
