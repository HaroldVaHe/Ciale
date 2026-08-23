"use client";

import { Eye, EyeOff } from "lucide-react";
import { useTransition } from "react";
import { toggleProductActive } from "@/app/admin/products/actions";

interface ToggleActiveButtonProps {
  id: string;
  active: boolean;
}

export default function ToggleActiveButton({
  id,
  active,
}: ToggleActiveButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", id);
      formData.set("active", String(active));
      await toggleProductActive(formData);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={active ? `Ocultar ${id}` : `Activar ${id}`}
      title={active ? "Ocultar de la tienda" : "Mostrar en la tienda"}
      className="p-2 rounded-lg border border-border text-charcoal hover:border-coral hover:text-coral transition-colors duration-300 disabled:opacity-50"
    >
      {active ? <Eye size={14} /> : <EyeOff size={14} />}
    </button>
  );
}
