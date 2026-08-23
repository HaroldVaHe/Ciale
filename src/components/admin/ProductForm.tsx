"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
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
  allTags?: string[];
  product?: ProductFormValues;
}

interface VariantRow {
  key: number;
  name: string;
  hex: string;
}

/**
 * Gradientes predefinidos. Deben quedar como literales en este archivo
 * para que el escáner de Tailwind genere las clases correspondientes.
 */
const GRADIENT_PRESETS: Array<{ label: string; value: string }> = [
  { label: "Coral", value: "from-orange-200 via-rose-100 to-amber-50" },
  { label: "Rosa", value: "from-pink-200 via-rose-100 to-pink-50" },
  { label: "Marino", value: "from-blue-200 via-cyan-100 to-teal-50" },
  { label: "Nácar", value: "from-amber-50 via-rose-50 to-blue-50" },
  { label: "Ohana", value: "from-rose-200 via-orange-100 to-yellow-50" },
  { label: "Arena", value: "from-stone-200 via-amber-50 to-stone-100" },
  { label: "Aurora", value: "from-violet-200 via-pink-100 to-amber-50" },
  { label: "Salvia", value: "from-green-100 via-amber-50 to-rose-50" },
  { label: "Cora", value: "from-rose-200 via-red-100 to-pink-50" },
  { label: "Perla", value: "from-gray-100 via-amber-50 to-gray-50" },
  { label: "Miel", value: "from-amber-200 via-orange-100 to-yellow-50" },
  { label: "Nude", value: "from-stone-100 via-stone-50 to-white" },
];

const SWATCH_COLORS = [
  "#E79C88",
  "#D4AF37",
  "#C0C0C0",
  "#B87333",
  "#A3B18A",
  "#F2B5D4",
  "#B8D4E3",
  "#2D2926",
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildUniqueSlug(name: string, existing: Set<string>): string {
  const base = slugify(name) || "variante";
  let slug = base;
  let counter = 2;
  while (existing.has(slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  existing.add(slug);
  return slug;
}

export default function ProductForm({
  mode,
  categories,
  allTags = [],
  product,
}: ProductFormProps) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(
    mode === "create" ? createProduct : updateProduct,
    { error: null }
  );

  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image ?? null
  );

  const initialGradient =
    product?.gradient ?? GRADIENT_PRESETS[0].value;
  const [gradient, setGradient] = useState(initialGradient);

  const gradientOptions = GRADIENT_PRESETS.some(
    (preset) => preset.value === initialGradient
  )
    ? GRADIENT_PRESETS
    : [...GRADIENT_PRESETS, { label: "Actual", value: initialGradient }];

  const [variants, setVariants] = useState<VariantRow[]>(() =>
    (product?.variants ?? []).map((variant, index) => ({
      key: index,
      name: variant.name ?? "",
      hex: variant.hex ?? SWATCH_COLORS[index % SWATCH_COLORS.length],
    }))
  );

  const [variantKeyCounter, setVariantKeyCounter] = useState(variants.length);

  const [tags, setTags] = useState<string[]>(product?.tags ?? []);
  const [tagDraft, setTagDraft] = useState("");

  const tagSuggestions = allTags
    .filter((tag) => !tags.includes(tag))
    .filter(
      (tag) =>
        tagDraft.trim() === "" ||
        tag.includes(tagDraft.trim().toLowerCase())
    )
    .slice(0, 8);

  function addTag(raw: string) {
    const tag = raw
      .trim()
      .toLowerCase()
      .replace(/,/g, "");
    if (tag === "") return;
    setTags((current) => (current.includes(tag) ? current : [...current, tag]));
    setTagDraft("");
  }

  function removeTag(tag: string) {
    setTags((current) => current.filter((item) => item !== tag));
  }

  function handleTagKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(tagDraft);
    } else if (
      event.key === "Backspace" &&
      tagDraft === "" &&
      tags.length > 0
    ) {
      setTags((current) => current.slice(0, -1));
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setImagePreview(file ? URL.createObjectURL(file) : product?.image ?? null);
  }

  function addVariant() {
    setVariants((rows) => [
      ...rows,
      {
        key: variantKeyCounter,
        name: "",
        hex: SWATCH_COLORS[variantKeyCounter % SWATCH_COLORS.length],
      },
    ]);
    setVariantKeyCounter((count) => count + 1);
  }

  function updateVariant(key: number, patch: Partial<VariantRow>) {
    setVariants((rows) =>
      rows.map((row) => (row.key === key ? { ...row, ...patch } : row))
    );
  }

  function removeVariant(key: number) {
    setVariants((rows) => rows.filter((row) => row.key !== key));
  }

  function serializeVariants(): string {
    const seen = new Set<string>();
    const cleaned = variants
      .filter((row) => row.name.trim() !== "")
      .map((row) => ({
        id: buildUniqueSlug(row.name.trim(), seen),
        name: row.name.trim(),
        color: row.name.trim(),
        hex: row.hex,
      }));
    return JSON.stringify(cleaned);
  }

  return (
    <form action={formAction} className="space-y-8">
      {mode === "edit" && <input type="hidden" name="id" value={product?.id} />}
      <input type="hidden" name="gradient" value={gradient} />
      <input type="hidden" name="variants" value={serializeVariants()} />

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
                : "Se usa internamente; no puede cambiarse después."}
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
          <span className="block text-xs tracking-widest uppercase font-medium text-coffee mb-2">
            Tags
          </span>
          <input type="hidden" name="tags" value={tags.join(", ")} />
          <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-white focus-within:border-coral focus-within:ring-2 focus-within:ring-coral/20 transition-all duration-300">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-nude/50 text-coffee text-xs font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Quitar tag ${tag}`}
                  className="p-0.5 rounded-full hover:bg-coffee hover:text-white transition-colors duration-200"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
            <input
              value={tagDraft}
              onChange={(event) => setTagDraft(event.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => addTag(tagDraft)}
              placeholder={tags.length === 0 ? "Escribe y presiona Enter…" : ""}
              aria-label="Agregar tag"
              className="flex-1 min-w-32 bg-transparent py-1 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none"
            />
          </div>
          {tagSuggestions.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-charcoal/40 mr-1">
                Sugeridos:
              </span>
              {tagSuggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="px-2.5 py-0.5 rounded-full border border-border bg-white text-charcoal/70 text-xs hover:border-coral hover:text-coral transition-colors duration-200"
                >
                  + {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </fieldset>

      {/* Apariencia e imagen */}
      <fieldset className="bg-white rounded-2xl border border-border p-6 space-y-6">
        <legend className="px-2 text-[11px] tracking-[0.25em] uppercase font-medium text-coral">
          Apariencia
        </legend>

        <div>
          <span className="block text-xs tracking-widest uppercase font-medium text-coffee mb-3">
            Color de fondo *
          </span>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {gradientOptions.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setGradient(preset.value)}
                title={preset.label}
                aria-pressed={gradient === preset.value}
                aria-label={`Fondo ${preset.label}`}
                className={`h-12 rounded-xl bg-gradient-to-br ${preset.value} border transition-all duration-200 ${
                  gradient === preset.value
                    ? "ring-2 ring-coffee ring-offset-2 border-transparent"
                    : "border-border hover:border-coral"
                }`}
              />
            ))}
          </div>
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
            <div>
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleImageChange}
                required={mode === "create"}
                className="text-sm text-charcoal/70 file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-coffee file:text-white file:text-xs file:tracking-widest file:uppercase hover:file:bg-coral file:cursor-pointer"
              />
              <p className="text-[11px] text-charcoal/40 mt-2">
                JPG, PNG, WebP o AVIF — se convierte a WebP automáticamente (máx. 1200 px).
              </p>
            </div>
          </div>
        </div>
      </fieldset>

      {/* Variantes */}
      <fieldset className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <legend className="px-2 text-[11px] tracking-[0.25em] uppercase font-medium text-coral">
          Colores disponibles
        </legend>
        <p className="text-sm text-charcoal/60 -mt-2">
          Opcional. Si el producto no tiene variaciones de color, deja la lista vacía.
        </p>

        {variants.length > 0 && (
          <ul className="space-y-3">
            {variants.map((row) => (
              <li key={row.key} className="flex items-center gap-3">
                <input
                  type="color"
                  value={row.hex}
                  onChange={(event) =>
                    updateVariant(row.key, { hex: event.target.value })
                  }
                  aria-label={`Color de la variante ${row.name || "sin nombre"}`}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-white p-1 shrink-0"
                />
                <input
                  value={row.name}
                  onChange={(event) =>
                    updateVariant(row.key, { name: event.target.value })
                  }
                  placeholder="Nombre del color, ej. Dorado"
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={() => removeVariant(row.key)}
                  aria-label={`Quitar variante ${row.name || "sin nombre"}`}
                  className="p-2.5 rounded-lg border border-border text-charcoal hover:border-red-400 hover:text-red-600 transition-colors duration-300 shrink-0"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={addVariant}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white text-charcoal text-[11px] tracking-[0.2em] uppercase font-medium hover:border-coral hover:text-coral transition-colors duration-300"
        >
          <Plus size={14} /> Agregar color
        </button>
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
