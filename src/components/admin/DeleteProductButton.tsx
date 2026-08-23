"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteProduct } from "@/app/admin/products/actions";

interface DeleteProductButtonProps {
  id: string;
  name: string;
}

export default function DeleteProductButton({
  id,
  name,
}: DeleteProductButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const confirmed = window.confirm(
      `¿Eliminar "${name}" (${id})? Esta acción borra también su imagen y no se puede deshacer.`
    );
    if (!confirmed) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", id);
      await deleteProduct(formData);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={`Eliminar ${name}`}
      title="Eliminar producto"
      className="p-2 rounded-lg border border-border text-charcoal hover:border-red-400 hover:text-red-600 transition-colors duration-300 disabled:opacity-50"
    >
      <Trash2 size={14} />
    </button>
  );
}
