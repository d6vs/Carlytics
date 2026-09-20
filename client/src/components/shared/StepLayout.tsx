"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";

interface StepLayoutProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  description: string;
  tip?: string;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  hideBack?: boolean;
  isLoading?: boolean;
  leftFooter?: ReactNode;
}

export default function StepLayout({
  stepNumber,
  totalSteps,
  title,
  subtitle,
  description,
  tip,
  children,
  onBack,
  onNext,
  nextLabel = "Next",
  nextDisabled = false,
  hideBack = false,
  isLoading = false,
  leftFooter,
}: StepLayoutProps) {
  return (
    <div className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col min-h-fit overflow-hidden">
      <div className="flex flex-col md:flex-row flex-1 p-6 md:p-10 gap-10 md:gap-16">
        
        {/* Left Column: Context */}
        <div className="w-full md:w-1/3 flex flex-col relative h-full">
          <div className="inline-flex items-center justify-center bg-emerald-50 text-emerald-700 font-semibold text-xs px-3 py-1.5 rounded-full w-max mb-8">
            Step {stepNumber} of {totalSteps}
          </div>
          
          <h1 className="text-4xl font-bold text-zinc-900 leading-tight mb-4">
            {title}
          </h1>
          
          <h3 className="text-lg font-semibold text-zinc-800 mb-2">
            {subtitle}
          </h3>
          
          <p className="text-zinc-500 text-sm leading-relaxed mb-8">
            {description}
          </p>
          
          {tip && (
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex gap-3 mt-8">
              <Lightbulb className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-sm text-emerald-800 leading-relaxed">
                <span className="font-semibold">Tip:</span> {tip}
              </p>
            </div>
          )}

          <div className="mt-auto pt-8">
            {leftFooter}
          </div>
        </div>

        {/* Right Column: Interactive Content */}
        <div className="w-full md:w-2/3 flex flex-col">
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-10 bg-white border-t border-zinc-100 p-6 md:px-10 flex items-center justify-between">
        {!hideBack ? (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-200 rounded-xl text-zinc-600 font-semibold hover:bg-zinc-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : (
          <div />
        )}
        
        <button
          onClick={onNext}
          disabled={nextDisabled || isLoading}
          className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-colors
            ${nextDisabled || isLoading
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : "bg-[#16A34A] hover:bg-[#15803D] text-white"
            }`}
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {nextLabel} <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
