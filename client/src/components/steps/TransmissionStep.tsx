"use client";

import { CheckCircle2, CheckCircle } from "lucide-react";
import StepLayout from "@/components/shared/StepLayout";

const TRANSMISSION_OPTIONS = [
  {
    id: "Automatic",
    title: "Automatic",
    desc: "Smooth and effortless driving with automatic gear shifting. Best for city driving and comfort.",
    badge: "Common in modern cars",
    img: "/assets/transmissions/automatic.png",
  },
  {
    id: "Manual",
    title: "Manual",
    desc: "More control, better mileage and lower maintenance cost. Ideal for driving enthusiasts.",
    badge: "Better mileage",
    img: "/assets/transmissions/manual.png",
  },
  {
    id: "Semi-Automatic (AMT)",
    title: "Semi-Automatic (AMT)",
    desc: "A blend of manual control and automatic convenience. Offers easy driving with better performance.",
    badge: "Balanced performance",
    img: "/assets/transmissions/semi-automatic.png",
  },
];

interface TransmissionStepProps {
  selected: string | null;
  onSelect: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function TransmissionStep({ selected, onSelect, onNext, onBack }: TransmissionStepProps) {
  const leftFooterGear = (
    <div className="absolute bottom-0 left-0 hidden md:block opacity-20 pointer-events-none w-full max-w-[200px]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-auto">
        <path d="M12 4v16m-4-16v16m8-16v16M4 12h16" />
        <circle cx="8" cy="4" r="2" />
        <circle cx="12" cy="4" r="2" />
        <circle cx="16" cy="4" r="2" />
        <circle cx="8" cy="20" r="2" />
        <circle cx="12" cy="20" r="2" />
        <circle cx="16" cy="20" r="2" />
      </svg>
    </div>
  );

  return (
    <StepLayout
      stepNumber={5}
      totalSteps={11}
      title="Select Transmission"
      subtitle="Choose the transmission type of your vehicle"
      description="This helps us evaluate your vehicle's performance, maintenance cost and market value accurately."
      tip="Check your RC or vehicle documents if you're unsure about the transmission type."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!selected}
      leftFooter={leftFooterGear}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full content-start pr-2">
        {TRANSMISSION_OPTIONS.map((trans) => {
          // Map Semi-Automatic to Automatic for backend if selected
          const backendId = trans.id === "Semi-Automatic (AMT)" ? "Automatic" : trans.id;
          const isSelected = selected === backendId || selected === trans.id;
          
          return (
            <button
              key={trans.id}
              onClick={() => onSelect(backendId)}
              className={`relative flex flex-col items-start p-5 rounded-2xl border transition-all duration-200 text-left h-full
                ${isSelected
                  ? "border-[#16A34A] bg-[#F0FDF4] shadow-[0_0_0_1px_#16A34A]"
                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm"
                }`}
            >
              <div className="w-full h-40 bg-zinc-100 rounded-xl mb-5 relative overflow-hidden flex items-center justify-center">
                {/* Fallback icon until images are uploaded */}
                <span className="text-4xl text-zinc-300 font-bold uppercase">{trans.title.substring(0, 4)}</span>
                <img
                  src={trans.img}
                  alt={trans.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              
              <span className={`font-bold text-lg mb-2 ${isSelected ? "text-[#16A34A]" : "text-zinc-900"}`}>
                {trans.title}
              </span>
              
              <span className="text-sm text-zinc-500 mb-6 leading-relaxed flex-grow">
                {trans.desc}
              </span>

              <div className={`mt-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border
                ${isSelected 
                  ? "bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]" 
                  : "bg-zinc-50 text-zinc-600 border-zinc-200"}`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {trans.badge}
              </div>

              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-white rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-[#16A34A] fill-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </StepLayout>
  );
}
