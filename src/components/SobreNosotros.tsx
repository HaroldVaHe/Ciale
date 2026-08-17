"use client";

import { motion } from "framer-motion";
import { Heart, Shield, Truck, Gift } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Hecho a mano",
    description: "Cada pieza es elaborada artesanalmente con dedicación y amor.",
  },
  {
    icon: Shield,
    title: "Materiales premium",
    description: "Utilizamos materiales de alta calidad resistentes al paso del tiempo.",
  },
  {
    icon: Truck,
    title: "Envío a toda Colombia",
    description: "Recibe tu joya cómodamente en tu puerta donde quiera que estés.",
  },
  {
    icon: Gift,
    title: "Empaque especial",
    description: "Cada pieza llega en un emaque elegante, listo para regalar.",
  },
];

export default function SobreNosotros() {
  return (
    <section id="sobre-nosotros" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.4em] uppercase font-medium text-coral mb-3">
            Sobre Nosotros
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-coffee mb-4">
            Cada pieza es única. Como quién la lleva.
          </h2>
          <p className="text-gray-soft max-w-2xl mx-auto leading-relaxed">
            En CIALÉ creemos que las joyas son más que accesorios: son portadoras de
            historias, momentos y emociones. Por eso cada una de nuestras piezas es
            creada a mano, pensando en la persona que la llevará.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 bg-nude/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon size={22} className="text-coral" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-coffee mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-soft leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
