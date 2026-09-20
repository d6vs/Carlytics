"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import type { CarVisualReport } from "@/lib/api/types";

const CONDITION_COLORS: Record<string, string> = {
  Excellent: "text-emerald-600 bg-emerald-50 border-emerald-200",
  Good:      "text-blue-600 bg-blue-50 border-blue-200",
  Fair:      "text-yellow-600 bg-yellow-50 border-yellow-200",
  Poor:      "text-red-600 bg-red-50 border-red-200",
};

const DIMENSION_LABELS: Record<keyof Omit<CarVisualReport, "condition" | "summary">, string> = {
  damage:          "Bodywork Damage",
  rust:            "Rust & Corrosion",
  bumper:          "Bumper & Headlights",
  windshield:      "Windshield & Glass",
  wheels:          "Wheels & Tyres",
  cleanliness:     "Cleanliness",
  paint_condition: "Paint Condition",
};

function isPositive(text: string): "good" | "warn" | "info" {
  const lowerText = text.toLowerCase();
  if (
    lowerText.includes("no ") ||
    lowerText.includes("intact") ||
    lowerText.includes("clean") ||
    lowerText.includes("good") ||
    lowerText.includes("smooth") ||
    lowerText.includes("well main")
  )
    return "good";
  if (
    lowerText.includes("damage") ||
    lowerText.includes("crack") ||
    lowerText.includes("dent") ||
    lowerText.includes("rust") ||
    lowerText.includes("wear") ||
    lowerText.includes("dirty")
  )
    return "warn";
  return "info";
}

const StatusIcon = ({ status }: { status: "good" | "warn" | "info" }) => {
  if (status === "good") return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
  if (status === "warn") return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
  return <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />;
};

interface VisualInspectionCardProps {
  report: CarVisualReport;
}

export default function VisualInspectionCard({ report }: VisualInspectionCardProps) {
  const conditionClass = CONDITION_COLORS[report.condition] ?? CONDITION_COLORS["Fair"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">AI Visual Inspection</h2>
          <p className="text-sm text-zinc-500 mt-0.5">BLIP camera analysis · 7-dimension assessment</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full border text-sm font-bold ${conditionClass}`}>
          {report.condition}
        </div>
      </div>

      <div className="space-y-4">
        {(Object.keys(DIMENSION_LABELS) as Array<keyof typeof DIMENSION_LABELS>).map((key, i) => {
          const text = report[key] as string;
          const status = isPositive(text);
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-100"
            >
              <StatusIcon status={status} />
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                  {DIMENSION_LABELS[key]}
                </p>
                <p className="text-sm text-zinc-700 leading-relaxed">{text}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-zinc-900 rounded-2xl">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">Overall Summary</p>
        <p className="text-sm text-white leading-relaxed">{report.summary}</p>
      </div>
    </motion.div>
  );
}
