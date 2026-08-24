"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-24">
      <p className="text-xs tracking-[0.4em] uppercase font-medium text-coral mb-3">
        Ups
      </p>
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-coffee mb-4">
        Algo salió mal
      </h1>
      <p className="text-sm text-gray-soft max-w-md mb-8 leading-relaxed">
        No pudimos cargar esta vista. No te preocupes, tu carrito está a
        salvo. Intenta de nuevo en unos segundos.
      </p>
      <button
        onClick={reset}
        className="px-8 py-3 rounded-full bg-coffee text-white text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-coral transition-colors duration-300"
      >
        Reintentar
      </button>
    </div>
  );
}
