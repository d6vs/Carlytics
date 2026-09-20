"use client";

import { CheckCircle2, User, Users } from "lucide-react";
import StepLayout from "@/components/shared/StepLayout";

const SEAT_OPTIONS = [
  { value: 2, label: "2 Seats", desc: "Coupes and sports cars" },
  { value: 4, label: "4 Seats", desc: "Compact cars and some luxury sedans" },
  { value: 5, label: "5 Seats", desc: "Standard sedans, hatchbacks, and SUVs" },
  { value: 6, label: "6 Seats", desc: "SUVs with captain seats" },
  { value: 7, label: "7 Seats", desc: "Large SUVs and MPVs" },
  { value: 8, label: "8+ Seats", desc: "Vans and large utility vehicles" },
];

interface SeatsStepProps {
  value: number | null;
  onChange: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SeatsStep({ value, onChange, onNext, onBack }: SeatsStepProps) {
  const leftFooterSeats = (
    <div className="absolute bottom-0 left-0 hidden md:block opacity-20 pointer-events-none w-full max-w-[200px]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-auto">
        <path d="M19 13v-2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2" />
        <path d="M5 13h14v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5Z" />
        <path d="M8 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
      </svg>
    </div>
  );

  return (
    <StepLayout
      stepNumber={8}
      totalSteps={11}
      title="Seating Capacity"
      subtitle="How many seats does your vehicle have?"
      description="The seating capacity affects the vehicle's category and practical utility, which influences its market demand."
      tip="Check your RC for the exact approved seating capacity."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!value}
      leftFooter={leftFooterSeats}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full content-start pr-2">
        {SEAT_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`relative flex flex-col items-center p-5 rounded-2xl border transition-all duration-200 text-center
                ${isSelected
                  ? "border-[#16A34A] bg-[#F0FDF4] shadow-[0_0_0_1px_#16A34A]"
                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm"
                }`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors
                ${isSelected ? "bg-[#16A34A] text-white" : "bg-zinc-50 text-zinc-400"}
              `}>
                {opt.value <= 2 ? <User className="w-6 h-6" /> : <Users className="w-6 h-6" />}
              </div>
              
              <span className={`font-bold text-lg mb-1 ${isSelected ? "text-[#16A34A]" : "text-zinc-900"}`}>
                {opt.label}
              </span>
              
              <span className="text-xs text-zinc-500 leading-snug">
                {opt.desc}
              </span>

              {isSelected && (
                <div className="absolute top-3 right-3 bg-white rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] fill-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </StepLayout>
  );
}
