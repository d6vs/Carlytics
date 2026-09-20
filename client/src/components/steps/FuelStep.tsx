"use client";

import { CheckCircle2, Droplet, Leaf, Zap, Fuel, BatteryCharging } from "lucide-react";
import StepLayout from "@/components/shared/StepLayout";

const FUEL_OPTIONS = [
  {
    id: "Petrol",
    title: "Petrol",
    desc: "Most common fuel for smooth performance and efficiency",
    icon: <Fuel className="w-16 h-16 text-emerald-600 mb-2" strokeWidth={1.5} />,
  },
  {
    id: "Diesel",
    title: "Diesel",
    desc: "Better mileage and torque for long drives and highways",
    icon: <Fuel className="w-16 h-16 text-blue-600 mb-2" strokeWidth={1.5} />,
  },
  {
    id: "CNG",
    title: "CNG",
    desc: "Cost-effective and environment friendly alternative",
    icon: <Fuel className="w-16 h-16 text-red-500 mb-2" strokeWidth={1.5} />,
  },
  {
    id: "LPG",
    title: "LPG",
    desc: "Affordable fuel with good efficiency and availability",
    icon: <Fuel className="w-16 h-16 text-yellow-500 mb-2" strokeWidth={1.5} />,
  },
  {
    id: "Electric",
    title: "Electric",
    desc: "Zero emissions and low running cost vehicle",
    icon: <BatteryCharging className="w-16 h-16 text-zinc-800 mb-2" strokeWidth={1.5} />,
  },
  {
    id: "Hybrid",
    title: "Hybrid",
    desc: "Combines fuel and electric power for better efficiency",
    icon: <Leaf className="w-16 h-16 text-green-500 mb-2" strokeWidth={1.5} />,
  },
  {
    id: "Ethanol",
    title: "Ethanol",
    desc: "Renewable fuel blended with petrol (E10, E20 etc.)",
    icon: <Droplet className="w-16 h-16 text-blue-500 mb-2" fill="currentColor" strokeWidth={1.5} />,
  },
  {
    id: "Other",
    title: "Other",
    desc: "Other fuel type not listed above",
    icon: <Fuel className="w-16 h-16 text-zinc-400 mb-2" strokeWidth={1.5} />,
  },
];

interface FuelStepProps {
  selected: string | null;
  onSelect: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function FuelStep({ selected, onSelect, onNext, onBack }: FuelStepProps) {
  const leftFooterCar = (
    <div className="absolute bottom-0 left-0 hidden md:block opacity-20 pointer-events-none w-full max-w-[200px]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-auto">
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9.3a2 2 0 0 0-1.6.8L5 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0m-8 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0" />
      </svg>
    </div>
  );

  return (
    <StepLayout
      stepNumber={4}
      totalSteps={11}
      title="Select Fuel Type"
      subtitle="Choose the fuel used in your vehicle"
      description="This helps our AI understand your vehicle's performance, running cost and market value better."
      tip="Select the fuel type that matches your RC or vehicle documents."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!selected}
      leftFooter={leftFooterCar}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full content-start pr-2">
        {FUEL_OPTIONS.map((fuel) => {
          const isSelected = selected === fuel.id;
          return (
            <button
              key={fuel.id}
              onClick={() => onSelect(fuel.id)}
              className={`relative flex flex-col items-start p-5 rounded-2xl border transition-all duration-200 text-left
                ${isSelected
                  ? "border-[#16A34A] bg-[#F0FDF4] shadow-[0_0_0_1px_#16A34A]"
                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm"
                }`}
            >
              <div className="w-full flex justify-center py-2">
                {fuel.icon}
              </div>
              
              <span className={`font-bold text-sm mt-2 ${isSelected ? "text-[#16A34A]" : "text-zinc-900"}`}>
                {fuel.title}
              </span>
              
              <span className="text-xs text-zinc-500 mt-1 leading-snug">
                {fuel.desc}
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
