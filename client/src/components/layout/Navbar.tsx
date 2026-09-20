"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-gradient-to-b from-black/80 to-transparent">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <img src="/carlytics-logo.png" alt="Carlytics Logo" className="h-10 md:h-11 w-auto object-contain" />
      </Link>

      {/* CTA */}
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Link
          href="/valuate"
          className="bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          Get Valuation
        </Link>
      </motion.div>
    </nav>
  );
}
