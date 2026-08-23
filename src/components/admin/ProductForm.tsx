"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  createProduct,
  updateProduct,
  type ProductFormState,
} from "@/app/admin/products/actions";

export interface ProductFormValues {
  id: string;
  name: string;
  description: string;
  category_id: string;
  price: number;
  gradient: string;
  tags: string[];
  variants: Array<Record<string, string>>;
  sort_order: number | null;
  is_active: boolean;
  image: string;
}

interface ProductFormProps {
  mode: "create" | "edit";
  categories: Array<{ id: string; label: string }>;
  product?: ProductFormValues;
}

const GRADIENT_PLACEHOLDER =
  "from-orange-200 via-rose-100 to-amber-50";

export default function ProductForm({
  mode,
  categories,
  product,
}: ProductFormProps) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(
    mode === "create" ? createProduct : updateProduct,
    { error: null }
  );

  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image ?? null
  );

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setImagePreview(file ? URL.createObjectURL(file) : product?.image ?? null);
  }

  return (
    <form action={formAction} className="space-y-8">
      {mode === "edit" && <input type="hidden" name="id" value={product?.id} />}

      {/* Identidad */}
      <fieldset className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <legend className="px-2 text-[11px] tracking-[0.25em] uppercase font-medium text-coral">
          Identidad
        </legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="pf-name" className="block text-xs tracking-widest uppercase font-medium text-coffee mb-2">
              Nombre *
            </label>
            <input
              id="pf-name"
              name="name"
              required
              defaultValue={product?.name}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="pf-id" className="block text-xs tracking-widest uppercase font-medium text-coffee mb-2">
              Identificador (slug) *
            </label>
            <input
              id="pf-id"
              name="id"
              required={mode === "create"}
              defaultValue={product?.id}
              disabled={mode === "edit"}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              placeholder="coral"
              title="Minúsculas, números y guiones"
              className={`${inputClass} ${mode === "edit" ? "opacity-60 cursor-not-allowed bg-stone-50" : ""}`}
            />
            <p className="text-[11px] text-charcoal/40 mt-1.5">
              {mode === "edit"
                ? "Inmutable: los carritos existentes lo referencian."
                : "Se usa en el carrito y pedidos; no puede cambiarse después."}
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="pf-description" className="block text-xs tracking-widest uppercase font-medium text-coffee mb-2">
            Descripción *
          </label>
          <textarea
            id="pf-description"
            name="description"
            required
            rows={3}
            defaultValue={product?.description}
            className={inputClass}
          />
        </div>
      </fieldset>

      {/* Comercial */}
      <fieldset className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <legend className="px-2 text-[11px] tracking-[0.25em] uppercase font-medium text-coral">
          Comercial
        </legend>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="pf-category" className="block text-xs tracking-widest uppercase font-medium text-coffee mb-2">
              Categoría *
            </label>
            <select
              id="pf-category"
              name="category_id"
              required
              defaultValue={product?.category_id}
              className={inputClass}
            >
              <option value="" disabled>
                Selecciona…
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label} ({cat.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pf-price" className="block text-xs tracking-widest uppercase font-medium text-coffee mb-2">
              Precio (COP) *
            </label>
            <input
              id="pf-price"
              name="price"
              type="number"
              min={0}
              step={1000}
              required
              defaultValue={product?.price}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="pf-sort-order" className="block text-xs tracking-widest uppercase font-medium text-coffee mb-2">
              Orden
            </label>
            <input
              id="pf-sort-order"
              name="sort_order"
              type="number"
              min={1}
              defaultValue={product?.sort_order ?? ""}
              placeholder="Al final"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="pf-tags" className="block text-xs tracking-widest uppercase font-medium text-coffee mb-2">
            Tags (separados por coma)
          </label>
          <input
            id="pf-tags"
            name="tags"
            defaultValue={product?.tags.join(", ")}
            placeholder="dije, marino, coral"
            className={inputClass}
          />
        </div>
      </fieldset>

      {/* Apariencia e imagen */}
      <fieldset className="bg-white rounded-2xl border border-border p-6 space-y-5">
        <legend className="px-2 text-[11px] tracking-[0.25em] uppercase font-medium text-coral">
          Apariencia
        </legend>

        <div>
          <label htmlFor="pf-gradient" className="block text-xs tracking-widest uppercase font-medium text-coffee mb-2">
            Gradiente Tailwind *
          </label>
          <input
            id="pf-gradient"
            name="gradient"
            required
            defaultValue={product?.gradient}
            placeholder={GRADIENT_PLACEHOLDER}
            className={`${inputClass} font-mono text-sm`}
          />
        </div>

        <div>
          <span className="block text-xs tracking-widest uppercase font-medium text-coffee mb-2">
            Imagen * {mode === "edit" && "(deja vacío para conservar la actual)"}
          </span>
          <div className="flex items-start gap-4">
            {imagePreview && (
              /* eslint-disable-next-line @next/next/no-img-element -- vista previa local del archivo seleccionado */
              <img
                src={imagePreview}
                alt="Vista previa"
                className="w-20 h-20 rounded-xl object-cover border border-border"
              />
            )}
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleImageChange}
              required={mode === "create"}
              className="text-sm text-charcoal/70 file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-coffee file:text-white file:text-xs file:tracking-widest file:uppercase hover:file:bg-coral file:cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-charcoal/40 mt-2">
            JPG, PNG, WebP o AVIF — se convierte a WebP automáticamente (máx. 1200 px).
          </p>
        </div>
      </fieldset>

      {/* Variantes */}
      <fieldset className="bg-white rounded-2xl border border-border p-6 space-y-2">
        <legend className="px-2 text-[11px] tracking-[0.25em] uppercase font-medium text-coral">
          Variantes (JSON)
        </legend>
        <textarea
          name="variants"
          rows={7}
          defaultValue={
            product
              ? JSON.stringify(product.variants, null, 2)
              : DEFAULT_VARIANTS
          }
          spellCheck={false}
          className={`${inputClass} font-mono text-sm`}
        />
        <p className="text-[11px] text-charcoal/40">
          Arreglo de objetos con las claves id, name, color y hex.
        </p>
      </fieldset>

      {/* Publicación */}
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-3 text-sm text-charcoal">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={product?.is_active ?? true}
            className="w-4 h-4 accent-coffee"
          />
          Visible en la tienda
        </label>

        {state.error && (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="px-6 py-3 rounded-full bg-coffee text-white text-xs tracking-[0.25em] uppercase font-medium hover:bg-coral transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending
              ? "Guardando…"
              : mode === "create"
                ? "Crear producto"
                : "Guardar cambios"}
          </button>
          <Link
            href="/admin/products"
            className="text-xs tracking-widest uppercase font-medium text-charcoal/50 hover:text-coral transition-colors duration-300"
          >
            Cancelar
          </Link>
        </div>
      </div>
    </form>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-border bg-white text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 transition-all duration-300";

const DEFAULT_VARIANTS = `[
  { "id": "variante-1", "name": "Nombre", "color": "Color", "hex": "#D4AF37" },
  { "id": "variante-2", "name": "Nombre", "color": "Color", "hex": "#C0C0C0" }
]`;
