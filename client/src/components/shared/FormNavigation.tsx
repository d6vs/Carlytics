"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface FormNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  isLoading?: boolean;
  hideBack?: boolean;
}

export default function FormNavigation({
  onBack,
  onNext,
  nextLabel = "Next",
  backLabel = "Back",
  nextDisabled = false,
  isLoading = false,
  hideBack = false,
}: FormNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-8 border-t border-zinc-100 mt-8">
      {!hideBack ? (
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-medium px-4 py-2.5 rounded-xl hover:bg-zinc-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </motion.button>
      ) : (
        <div />
      )}

      <motion.button
        whileHover={{ scale: nextDisabled ? 1 : 1.02 }}
        whileTap={{ scale: nextDisabled ? 1 : 0.97 }}
        onClick={onNext}
        disabled={nextDisabled || isLoading}
        className={`inline-flex items-center gap-2 font-semibold px-6 py-2.5 rounded-full transition-all
          ${nextDisabled || isLoading
            ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
            : "bg-emerald-500 hover:bg-emerald-400 text-white shadow-sm"
          }`}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            {nextLabel}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>
    </div>
  );
}
