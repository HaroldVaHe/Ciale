"use client";

import { motion } from "framer-motion";

export default function AnnouncementBar() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-coffee text-white text-center py-2 px-4 text-xs tracking-widest font-medium"
    >
      Envíos a toda Colombia | Cada pieza es única, hecha a mano con dedicación ✨
    </motion.div>
  );
}
