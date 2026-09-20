"use client";

import { motion } from "framer-motion";
import type { ConfidenceBand } from "@/lib/api/types";

interface ValuationCardProps {
  predictedPrice: number;
  currency: string;
  confidenceBand: ConfidenceBand | null;
  vehicleSummary: string;
}

export default function ValuationCard({
  predictedPrice,
  currency,
  confidenceBand,
  vehicleSummary,
}: ValuationCardProps) {
  const formatLakh = (v: number) =>
    `₹${v.toFixed(2)} Lakhs`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-zinc-500 mb-1">Estimated Market Value</p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-5xl font-black text-zinc-900 tracking-tight"
          >
            {formatLakh(predictedPrice)}
          </motion.div>

          {confidenceBand && (
            <div className="mt-3">
              <p className="text-xs text-zinc-400 font-medium mb-1.5">Confidence Band (±10%)</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-600">
                  {formatLakh(confidenceBand.low)}
                </span>
                <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden max-w-[120px]">
                  <div className="h-full w-2/3 bg-emerald-400 rounded-full" />
                </div>
                <span className="text-sm font-semibold text-zinc-600">
                  {formatLakh(confidenceBand.high)}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">Fair negotiation range</p>
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">
            <div className="text-4xl mb-2">🚗</div>
            <p className="text-xs text-zinc-500 font-medium max-w-[160px] leading-snug">{vehicleSummary}</p>
          </div>
        </div>
      </div>

      {/* Currency note */}
      <div className="mt-6 pt-6 border-t border-zinc-100 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <p className="text-xs text-zinc-400">
          All prices in Indian Rupees (INR) · Lakhs
        </p>
      </div>
    </motion.div>
  );
}
