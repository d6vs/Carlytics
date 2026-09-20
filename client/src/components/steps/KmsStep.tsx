"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, CarFront } from "lucide-react";
import StepLayout from "@/components/shared/StepLayout";

interface KmsStepProps {
  value: number | null;
  onChange: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const CATEGORIES = [
  {
    id: "low",
    title: "Low Mileage",
    range: "0 - 40,000 km",
    desc: "Well maintained and less wear.",
    color: "bg-emerald-50 text-emerald-600",
    max: 40000,
  },
  {
    id: "avg",
    title: "Average Mileage",
    range: "40,001 - 80,000 km",
    desc: "Moderate usage and condition.",
    color: "bg-yellow-50 text-yellow-600",
    max: 80000,
  },
  {
    id: "high",
    title: "High Mileage",
    range: "80,001 - 1,50,000 km",
    desc: "Higher usage, more wear.",
    color: "bg-orange-50 text-orange-600",
    max: 150000,
  },
  {
    id: "very-high",
    title: "Very High Mileage",
    range: "1,50,000+ km",
    desc: "Significant wear, may need attention.",
    color: "bg-red-50 text-red-600",
    max: Infinity,
  },
];

export default function KmsStep({ value, onChange, onNext, onBack }: KmsStepProps) {
  const [raw, setRaw] = useState(value?.toString() ?? "35000");

  useEffect(() => {
    if (value === null) {
      onChange(35000); // Default to mockup value
    }
  }, []);

  const numValue = Number(raw.replace(/\D/g, ""));
  const formatted = raw ? numValue.toLocaleString("en-IN") : "";

  function handleChange(v: string) {
    const digits = v.replace(/\D/g, "");
    if (digits.length > 7) return; // limit to 9,999,999
    setRaw(digits);
    if (digits) onChange(Number(digits));
  }

  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setRaw(v);
    onChange(Number(v));
  }

  // Determine active category
  let activeCategoryId = "low";
  if (numValue > 150000) activeCategoryId = "very-high";
  else if (numValue > 80000) activeCategoryId = "high";
  else if (numValue > 40000) activeCategoryId = "avg";

  const isValid = numValue > 0 && numValue <= 9999999;

  const leftFooterGauge = (
    <div className="absolute bottom-0 left-0 hidden md:block opacity-20 pointer-events-none w-full max-w-[200px]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-auto">
        <path d="M12 20a8 8 0 1 0-8-8" />
        <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="m12 12 3.5-3.5" />
      </svg>
    </div>
  );

  return (
    <StepLayout
      stepNumber={7}
      totalSteps={11}
      title="Enter Mileage"
      subtitle="Add the total kilometers driven by your vehicle"
      description="Accurate mileage helps us analyze wear and tear, maintenance and overall value better."
      tip="Check your odometer or RC document for the exact reading."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!isValid}
      leftFooter={leftFooterGauge}
    >
      <div className="flex flex-col h-full">
        {/* Input Section */}
        <div className="mb-10">
          <span className="text-zinc-500 font-medium text-sm mb-3 block">Total Kilometers Driven</span>
          
          <div className="relative mb-6">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="12" x="3" y="6" rx="2" />
                <path d="M7 12h.01M11 12h.01M15 12h.01" />
              </svg>
            </div>
            
            <input
              type="text"
              inputMode="numeric"
              value={formatted}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full text-zinc-900 text-4xl font-bold py-6 pl-16 pr-16 border border-zinc-200 rounded-2xl focus:outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10 transition-all text-center"
            />
            
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-lg">km</span>
          </div>

          <span className="text-zinc-400 text-sm mb-6 block">Use the slider or input field to set the mileage</span>

          <div className="relative px-2">
            <input
              type="range"
              min="1000"
              max="500000"
              step="1000"
              value={Math.min(numValue, 500000)}
              onChange={handleSliderChange}
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#16A34A]"
            />
            <div className="flex justify-between mt-3 text-xs text-zinc-400 font-medium">
              <span>1,000 km</span>
              <span>5,00,000+ km</span>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <span className="text-zinc-500 font-medium text-sm mb-4 block">Mileage Category (AI Reference)</span>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              
              return (
                <div
                  key={cat.id}
                  className={`relative flex flex-col items-center p-4 rounded-xl border transition-all duration-300 text-center
                    ${isActive 
                      ? "border-[#16A34A] bg-[#F0FDF4] shadow-[0_0_0_1px_#16A34A]" 
                      : "border-zinc-100 bg-white opacity-60"
                    }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${cat.color}`}>
                    <CarFront className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  
                  <span className={`font-bold text-sm mb-1 ${isActive ? "text-[#16A34A]" : "text-zinc-800"}`}>
                    {cat.title}
                  </span>
                  
                  <span className="text-xs font-semibold text-zinc-500 mb-2">
                    {cat.range}
                  </span>
                  
                  <span className="text-[10px] leading-relaxed text-zinc-400">
                    {cat.desc}
                  </span>

                  {isActive && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-[#16A34A] fill-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </StepLayout>
  );
}
