"use client";

import { useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import {
  deleteCategory,
  moveCategory,
  renameCategory,
} from "@/app/admin/categories/actions";
import ReorderButtons from "./ReorderButtons";

interface CategoryRowProps {
  id: string;
  label: string;
  productCount: number;
  isFirst: boolean;
  isLast: boolean;
}

export default function CategoryRow({
  id,
  label,
  productCount,
  isFirst,
  isLast,
}: CategoryRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(label);

  function handleDelete() {
    const confirmed = window.confirm(
      productCount > 0
        ? `"${label}" tiene ${productCount} producto(s). La base de datos bloqueará el borrado hasta reasignarlos. ¿Intentar de todas formas?`
        : `¿Eliminar la categoría "${label}"?`
    );
    if (!confirmed) return;

    const formData = new FormData();
    formData.set("id", id);
    void deleteCategory(formData);
  }

  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className="px-4 py-3">
        <ReorderButtons
          id={id}
          canUp={!isFirst}
          canDown={!isLast}
          action={moveCategory}
        />
      </td>

      <td className="px-4 py-3">
        {editing ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              formData.set("id", id);
              void renameCategory(formData).then(() => setEditing(false));
            }}
            className="flex items-center gap-2"
          >
            <input
              name="label"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              required
              autoFocus
              className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border border-border bg-white text-charcoal text-sm focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20"
            />
            <button
              type="submit"
              aria-label={`Guardar nombre para ${id}`}
              className="p-2 rounded-lg border border-border text-charcoal hover:border-coral hover:text-coral transition-colors duration-300"
            >
              <Check size={14} />
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setDraft(label);
              }}
              aria-label="Cancelar renombrado"
              className="p-2 rounded-lg border border-border text-charcoal hover:border-red-400 hover:text-red-600 transition-colors duration-300"
            >
              <X size={14} />
            </button>
          </form>
        ) : (
          <div>
            <p className="font-medium text-charcoal">{label}</p>
            <p className="text-xs text-charcoal/40 font-mono">{id}</p>
          </div>
        )}
      </td>

      <td className="px-4 py-3 text-charcoal/70 tabular-nums">
        {productCount}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setEditing(true)}
            disabled={editing}
            aria-label={`Renombrar ${label}`}
            title="Renombrar"
            className="p-2 rounded-lg border border-border text-charcoal hover:border-coral hover:text-coral transition-colors duration-300 disabled:opacity-40"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            aria-label={`Eliminar ${label}`}
            title="Eliminar categoría"
            className="p-2 rounded-lg border border-border text-charcoal hover:border-red-400 hover:text-red-600 transition-colors duration-300"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
