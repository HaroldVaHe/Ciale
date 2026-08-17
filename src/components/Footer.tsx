"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Instagram, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contacto" className="bg-coffee text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <span className="font-serif text-2xl font-semibold tracking-[0.2em]">
              C I A L É
            </span>
            <p className="text-[9px] tracking-[0.4em] uppercase text-white/40 font-medium mt-0.5">
              Jewelry
            </p>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Cada pieza de este catálogo fue creada con dedicación y amor para
              acompañar tus mejores momentos.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] tracking-[0.3em] uppercase font-medium text-white/40 mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-white/70">
                <MapPin size={16} className="text-nude flex-shrink-0" />
                Chía, Cundinamarca, Colombia
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Phone size={16} className="text-nude flex-shrink-0" />
                <div>
                  <a href="tel:+573203039847" className="hover:text-nude transition-colors">
                    320 303 9847
                  </a>
                  <span className="mx-2 text-white/30">|</span>
                  <a href="tel:+573105609565" className="hover:text-nude transition-colors">
                    310 560 9565
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Instagram size={16} className="text-nude flex-shrink-0" />
                <a
                  href="https://instagram.com/ciale.jewelry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-nude transition-colors"
                >
                  @ciale.jewelry
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[11px] tracking-[0.3em] uppercase font-medium text-white/40 mb-4">
              Navegación
            </h4>
            <ul className="space-y-2">
              {[
                { href: "#inicio", label: "Inicio" },
                { href: "#catalogo", label: "Catálogo" },
                { href: "#personalizados", label: "Personalizados" },
                { href: "#sobre-nosotros", label: "Sobre Nosotros" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-nude transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/40 flex items-center justify-center gap-1">
            Hecho con <Heart size={12} className="text-coral" /> en Colombia
          </p>
          <p className="text-[10px] text-white/30 mt-2 tracking-wider">
            © {new Date().getFullYear()} CIALÉ Jewelry. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
