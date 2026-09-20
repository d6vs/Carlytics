"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { UploadCloud, Zap, Search } from "lucide-react";

const steps = [
  { 
    icon: <UploadCloud className="w-8 h-8 text-[#22C55E]" />,
    title: "1. Upload Your Details", 
    desc: "Enter your car's year, make, model and key specifications. Then upload up to 8 photos for our AI to inspect." 
  },
  { 
    icon: <Search className="w-8 h-8 text-[#22C55E]" />,
    title: "2. Visual AI Inspection", 
    desc: "Our BLIP vision model scans your primary image for body damage, rust, glass condition and paint quality." 
  },
  { 
    icon: <Zap className="w-8 h-8 text-[#22C55E]" />,
    title: "3. Market Valuation", 
    desc: "Our machine learning engine crunches market data and visual condition to give you an accurate, adjusted price." 
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-[#080B12] border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[#22C55E] text-sm font-bold tracking-widest uppercase mb-3 block">
            The Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How Carlytics <span className="text-zinc-500">Works</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            A seamless, AI-driven process that eliminates guesswork and gives you the true market value of your vehicle in seconds.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-12 left-24 right-24 h-px bg-zinc-800/50 z-0" />

          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative z-10 bg-[#0C111A] border border-zinc-800/60 rounded-3xl p-10 hover:border-[#22C55E]/40 hover:bg-[#0F1622] transition-all duration-300 group"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#14231C] border border-[#1C3E2D] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{s.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Link
            href="/valuate"
            className="inline-flex items-center gap-2 bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 font-semibold px-10 py-4 rounded-xl transition-all"
          >
            Start Your Valuation Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
