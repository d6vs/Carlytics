"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, ArrowRight, BrainCircuit, Camera, BarChart3 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#080B12] flex flex-col justify-center overflow-hidden pt-20">
      {/* Background Image & Overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080B12] via-[#080B12]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-transparent to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl pt-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-[#0C1A16] border border-[#143627] text-[#22C55E] text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-wider uppercase"
            >
              AI-Powered Vehicle Valuation
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold text-white leading-[1.1] mb-6">
              Get the True <br />
              Value of <span className="text-[#22C55E]">Your Car</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-lg leading-relaxed font-medium">
              AI-powered valuation with market insights,
              visual analysis & intelligent reasoning.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/valuate"
                  className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-medium px-8 py-3.5 rounded-lg transition-colors text-base"
                >
                  Sell My Car
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 text-white bg-transparent border border-zinc-700 hover:border-zinc-500 hover:bg-white/5 font-medium px-8 py-3.5 rounded-lg transition-all text-base"
                >
                  <Play className="w-5 h-5" />
                  How It Works
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* 3 Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mt-16 pb-12"
        >
          {[
            {
              icon: <BrainCircuit className="w-6 h-6 text-[#22C55E]" />,
              title: "AI-Powered Valuation",
              desc: "Advanced machine learning models analyze thousands of data points to deliver accurate pricing."
            },
            {
              icon: <Camera className="w-6 h-6 text-[#22C55E]" />,
              title: "Visual Inspection",
              desc: "Our AI analyzes your car images to assess condition, damage & overall quality."
            },
            {
              icon: <BarChart3 className="w-6 h-6 text-[#22C55E]" />,
              title: "Smart Insights",
              desc: "Get detailed reports with market analysis, price trends & expert recommendations."
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-start gap-5 bg-[#0F141E]/80 backdrop-blur-md border border-zinc-800/50 hover:border-zinc-700 rounded-2xl p-6 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-[#0C1A16] border border-[#143627] rounded-xl flex items-center justify-center">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
