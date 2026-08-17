"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-b from-cream via-cream-dark to-nude/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 lg:py-40">
        <div className="text-center max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs tracking-[0.4em] uppercase font-medium text-coral mb-6"
          >
            Artesanal &hecho a mano
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-coffee leading-tight"
          >
            Detalles que cuentan
            <br />
            <span className="italic text-coral">historias</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-base md:text-lg text-gray-soft font-light max-w-xl mx-auto leading-relaxed"
          >
            Joyería artesanal creada con amor para acompañar tus mejores momentos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10"
          >
            <Link
              href="#catalogo"
              className="inline-block bg-coffee text-white px-10 py-3.5 text-xs tracking-[0.3em] uppercase font-medium hover:bg-charcoal transition-colors duration-300 rounded-sm"
            >
              Explorar Colección
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex items-center justify-center gap-8 text-[11px] tracking-widest uppercase text-gray-soft"
          >
            <span className="flex items-center gap-2">
              <span className="w-8 h-px bg-nude" /> Hecho a mano
            </span>
            <span className="flex items-center gap-2">
              <span className="w-8 h-px bg-nude" /> Envío gratis
            </span>
            <span className="flex items-center gap-2">
              <span className="w-8 h-px bg-nude" /> Piezas únicas
            </span>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-nude/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-coral/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-sage/10 rounded-full blur-2xl" />
    </section>
  );
}
