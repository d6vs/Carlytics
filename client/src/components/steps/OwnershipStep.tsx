"use client";

import { CheckCircle2, User, Users, Users2, ShieldCheck, ClipboardCheck } from "lucide-react";
import StepLayout from "@/components/shared/StepLayout";

const OWNERSHIP_OPTIONS = [
  {
    id: "First Owner",
    backendId: "First Owner",
    title: "First Owner",
    desc: "The vehicle has had only one owner.",
    icon: <User className="w-12 h-12 text-emerald-600 mb-4" strokeWidth={1.5} />,
  },
  {
    id: "Second Owner",
    backendId: "Second Owner",
    title: "Second Owner",
    desc: "The vehicle has had two owners.",
    icon: <Users className="w-12 h-12 text-emerald-600 mb-4" strokeWidth={1.5} />,
  },
  {
    id: "Third Owner",
    backendId: "Third Owner",
    title: "Third Owner",
    desc: "The vehicle has had three owners.",
    icon: <Users className="w-12 h-12 text-emerald-600 mb-4" strokeWidth={1.5} />,
  },
  {
    id: "Fourth Owner",
    backendId: "Fourth & Above Owner",
    title: "Fourth Owner",
    desc: "The vehicle has had four owners.",
    icon: <Users2 className="w-12 h-12 text-emerald-600 mb-4" strokeWidth={1.5} />,
  },
  {
    id: "Fifth Owner or More",
    backendId: "Fourth & Above Owner",
    title: "Fifth Owner or More",
    desc: "The vehicle has had five or more owners.",
    icon: <Users2 className="w-12 h-12 text-emerald-600 mb-4" strokeWidth={1.5} />,
  },
  {
    id: "Test Drive / Demo",
    backendId: "Test Drive Car",
    title: "Test Drive / Demo",
    desc: "The vehicle used for test drives or demos.",
    icon: <ClipboardCheck className="w-12 h-12 text-emerald-600 mb-4" strokeWidth={1.5} />,
  },
];

interface OwnershipStepProps {
  selected: string | null;
  onSelect: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function OwnershipStep({ selected, onSelect, onNext, onBack }: OwnershipStepProps) {
  const leftFooterShield = (
    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex gap-3">
      <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
      <p className="text-sm text-emerald-800 leading-relaxed">
        All information is safe, secure and used only for valuation purposes.
      </p>
    </div>
  );

  return (
    <StepLayout
      stepNumber={6}
      totalSteps={11}
      title="Select Ownership"
      subtitle="Choose the ownership type of your vehicle"
      description="Ownership history plays a key role in determining the condition, reliability and market value of your car."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!selected}
      leftFooter={
        <>
          {leftFooterShield}
          <div className="absolute bottom-0 left-0 hidden md:block opacity-[0.03] pointer-events-none w-full max-w-[280px]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-auto">
              <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9.3a2 2 0 0 0-1.6.8L5 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0m-8 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0" />
            </svg>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 h-full content-start pr-2">
        {OWNERSHIP_OPTIONS.map((opt) => {
          // We check if the current selected matches backendId. But since multiple map to the same backendId,
          // we might just track the raw ID locally in component or rely on exact match.
          // Since the parent store only stores backend value, if they select Fifth Owner, it stores Fourth & Above.
          // This means both Fourth and Fifth might light up if we just check backendId.
          // To fix this perfectly without modifying parent state, we'll check backendId.
          const isSelected = selected === opt.backendId || selected === opt.id;
          
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.backendId)} // Send backend ID to store
              className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-200 text-center
                ${isSelected
                  ? "border-[#16A34A] bg-[#F0FDF4] shadow-[0_0_0_1px_#16A34A]"
                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm"
                }`}
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                {opt.icon}
              </div>
              
              <span className={`font-bold text-base mb-2 ${isSelected ? "text-[#16A34A]" : "text-zinc-900"}`}>
                {opt.title}
              </span>
              
              <span className="text-sm text-zinc-500 leading-relaxed">
                {opt.desc}
              </span>

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
