import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-24">
      <p className="text-xs tracking-[0.4em] uppercase font-medium text-coral mb-3">
        Error 404
      </p>
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-coffee mb-4">
        Página no encontrada
      </h1>
      <p className="text-sm text-gray-soft max-w-md mb-8 leading-relaxed">
        Parece que esta página se perdió como un arete en el sofá. Volvamos a
        la tienda para que encuentres tu pieza perfecta.
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-full bg-coffee text-white text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-coral transition-colors duration-300"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}
