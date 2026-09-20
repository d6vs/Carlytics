"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong while analysing your vehicle.",
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6"
    >
      <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>

      <h2 className="text-xl font-bold text-zinc-900 mb-3">Analysis Failed</h2>
      <p className="text-zinc-500 text-sm max-w-sm leading-relaxed mb-8">{message}</p>

      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-2.5 rounded-full transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
        <Link
          href="/valuate"
          className="inline-flex items-center gap-2 border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 font-medium px-6 py-2.5 rounded-full transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Edit Vehicle
        </Link>
      </div>
    </motion.div>
  );
}
