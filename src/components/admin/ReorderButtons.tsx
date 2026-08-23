"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useTransition } from "react";

interface ReorderButtonsProps {
  id: string;
  canUp: boolean;
  canDown: boolean;
  action: (formData: FormData) => Promise<void>;
}

export default function ReorderButtons({
  id,
  canUp,
  canDown,
  action,
}: ReorderButtonsProps) {
  const [pending, startTransition] = useTransition();

  function move(direction: "up" | "down") {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", id);
      formData.set("direction", direction);
      await action(formData);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => move("up")}
        disabled={!canUp || pending}
        aria-label="Subir"
        title="Subir"
        className="p-1 rounded border border-border text-charcoal hover:border-coral hover:text-coral transition-colors duration-300 disabled:opacity-25 disabled:hover:border-border disabled:hover:text-charcoal"
      >
        <ChevronUp size={14} />
      </button>
      <button
        type="button"
        onClick={() => move("down")}
        disabled={!canDown || pending}
        aria-label="Bajar"
        title="Bajar"
        className="p-1 rounded border border-border text-charcoal hover:border-coral hover:text-coral transition-colors duration-300 disabled:opacity-25 disabled:hover:border-border disabled:hover:text-charcoal"
      >
        <ChevronDown size={14} />
      </button>
    </div>
  );
}
