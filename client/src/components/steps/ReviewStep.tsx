"use client";

import { motion } from "framer-motion";
import { Edit2, Calendar, Car, Tag, Droplet, Settings, User, GaugeCircle, Users, PenTool, CheckCircle2, ArrowRight, ArrowLeft, Lock } from "lucide-react";

interface ReviewStepProps {
  year: number | null;
  make: string | null;
  model: string | null;
  fuelType: string | null;
  transmission: string | null;
  ownsership: string | null;
  kmsDriven: number | null;
  seats: number | null;
  mileageKmpl: number | null;
  engineCc: number | null;
  files: File[];
  onEdit: (step: number) => void;
  onGetQuote: () => void;
  isLoading: boolean;
}

const VIEW_LABELS = ["Front View", "Rear View", "Side View", "Interior View"];

export default function ReviewStep({
  year, make, model, fuelType, transmission, ownsership,
  kmsDriven, seats, mileageKmpl, engineCc, files, onEdit, onGetQuote, isLoading,
}: ReviewStepProps) {
  
  const DETAILS = [
    { label: "Year", value: year, icon: <Calendar className="w-5 h-5 text-emerald-600" />, step: 0 },
    { label: "Transmission", value: transmission, icon: <Settings className="w-5 h-5 text-emerald-600" />, step: 4 },
    { label: "Make", value: make, icon: <Car className="w-5 h-5 text-emerald-600" />, step: 1 },
    { label: "Ownership", value: ownsership, icon: <User className="w-5 h-5 text-emerald-600" />, step: 5 },
    { label: "Model", value: model, icon: <Tag className="w-5 h-5 text-emerald-600" />, step: 2 },
    { label: "Mileage", value: kmsDriven ? `${kmsDriven.toLocaleString("en-IN")} km` : null, icon: <GaugeCircle className="w-5 h-5 text-emerald-600" />, step: 6 },
    { label: "Fuel Type", value: fuelType, icon: <Droplet className="w-5 h-5 text-emerald-600" />, step: 3 },
    { label: "Seats", value: seats ? `${seats} Seater` : null, icon: <Users className="w-5 h-5 text-emerald-600" />, step: 7 },
    { label: "Engine", value: engineCc ? `${engineCc} cc` : null, icon: <PenTool className="w-5 h-5 text-emerald-600" />, step: 8 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 flex flex-col min-h-[600px] p-8 md:p-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">Review & Get Quote</h2>
          <p className="text-zinc-500 mt-2 text-sm leading-relaxed max-w-xl">
            Review your details before getting the quote.<br/>
            Please verify your information. You can edit any detail if needed.
          </p>
        </div>
        <button
          onClick={() => onEdit(0)}
          className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          <Edit2 className="w-4 h-4" /> Edit Details
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Vehicle Details */}
        <div className="border border-zinc-100 rounded-2xl p-6 bg-zinc-50/50">
          <h3 className="font-bold text-zinc-900 mb-6">Vehicle Details</h3>
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            {DETAILS.map((detail, idx) => (
              <div key={idx} className="flex items-start gap-3 group cursor-pointer" onClick={() => onEdit(detail.step)}>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                  {detail.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500">{detail.label}</p>
                  <p className="text-sm font-bold text-zinc-900 mt-0.5">{detail.value ?? "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Uploaded Images */}
        <div className="border border-zinc-100 rounded-2xl p-6 bg-zinc-50/50">
          <h3 className="font-bold text-zinc-900 mb-6 flex items-center justify-between">
            Uploaded Images ({files.length})
            <button onClick={() => onEdit(9)} className="text-xs text-emerald-600 font-semibold hover:underline">
              Edit
            </button>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {files.slice(0, 4).map((f, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-200 border border-zinc-200">
                  <img src={URL.createObjectURL(f)} alt={VIEW_LABELS[i]} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-semibold text-zinc-600 px-1">{VIEW_LABELS[i] || `View ${i+1}`}</span>
              </div>
            ))}
            {/* Fallback if less than 4 */}
            {Array.from({ length: Math.max(0, 4 - files.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="flex flex-col gap-2">
                <div className="aspect-[4/3] rounded-xl bg-zinc-100 border border-zinc-200 border-dashed flex items-center justify-center">
                  <span className="text-xs font-semibold text-zinc-400">Missing</span>
                </div>
                <span className="text-xs font-semibold text-zinc-400 px-1">{VIEW_LABELS[files.length + i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4 flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
        </div>
        <div>
          <p className="font-bold text-[#166534] text-sm">All details look good!</p>
          <p className="text-xs text-[#166534]/80 mt-0.5">Click "Get Quote" to let our AI analyze your vehicle and provide the best valuation.</p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-auto pt-6 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <button
          onClick={() => onEdit(9)}
          className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-200 rounded-xl text-zinc-600 font-semibold hover:bg-zinc-50 transition-colors w-full md:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
          <Lock className="w-3.5 h-3.5" />
          Your information is safe and secure with us
        </div>

        <button
          onClick={onGetQuote}
          disabled={isLoading}
          className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition-colors w-full md:w-auto
            ${isLoading
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
              Get Quote <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </div>
  );
}
