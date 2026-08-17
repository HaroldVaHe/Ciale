"use client";

import { motion } from "framer-motion";
import { Sparkles, PenTool } from "lucide-react";

export default function PersonalizaSection() {
  return (
    <section
      id="personalizados"
      className="relative overflow-hidden bg-gradient-to-br from-nude/30 via-cream to-coral/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-nude via-coral/20 to-gold/10 rounded-2xl flex items-center justify-center relative">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <PenTool size={32} className="text-coral" />
                </div>
                <div className="flex items-center justify-center gap-1">
                  {["A", "B", "C", "D", "E", "F"].map((letter, i) => (
                    <motion.span
                      key={letter}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="font-serif text-2xl md:text-3xl text-coffee/30"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
              </div>
              {/* Decorative dots */}
              <div className="absolute top-6 right-6 w-3 h-3 bg-gold/40 rounded-full" />
              <div className="absolute bottom-8 left-8 w-4 h-4 bg-coral/30 rounded-full" />
              <div className="absolute top-1/3 left-6 w-2 h-2 bg-sage/40 rounded-full" />
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-gold" />
              <span className="text-[11px] tracking-[0.3em] uppercase font-medium text-coral">
                Hecho para ti
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-coffee leading-tight mb-4">
              Personaliza tu joya
            </h2>
            <p className="text-gray-soft leading-relaxed mb-6">
              Cada pieza puede ser única como quien la lleva. Elige tu collar favorito,
              personalízalo con una inicial, y nosotros lo creamos especialmente para ti.
              Un regalo inolvidable, o una joya que cuente tu historia.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Iniciales grabadas a mano",
                "Selección de materiales y colores",
                "Cada pieza es única e irrepetible",
                "Empaque regalo incluido",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-charcoal"
                >
                  <span className="w-1.5 h-1.5 bg-coral rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#catalogo"
              className="inline-block bg-coffee text-white px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-charcoal transition-colors duration-300 rounded-sm"
            >
              Ver Personalizables
            </a>
          </motion.div>
        </div>
      </div>

      {/* Decorative */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-coral/10 rounded-full blur-3xl" />
    </section>
  );
}
