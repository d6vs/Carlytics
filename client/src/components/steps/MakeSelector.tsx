"use client";

import { useState } from "react";
import { Search, CheckCircle2, ChevronDown } from "lucide-react";
import StepLayout from "@/components/shared/StepLayout";

// Brand logos map for display (using brand names as placeholders if no logo is provided)
const BRAND_LOGOS: Record<string, string> = {
  "Maruti Suzuki": "MS",
  "Hyundai": "HY",
  "Honda": "HO",
  "Tata": "TA",
  "Mahindra": "MA",
  "Toyota": "TO",
  "Kia": "KI",
  "BMW": "BM",
  "Mercedes-Benz": "MB",
  "Audi": "AU",
  "Volkswagen": "VW",
};

interface MakeSelectorProps {
  makes: string[];
  selected: string | null;
  selectedYear: number | null;
  onSelect: (make: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function MakeSelector({
  makes, selected, selectedYear, onSelect, onNext, onBack,
}: MakeSelectorProps) {
  const [query, setQuery] = useState("");

  const filteredMakes = makes.filter((m) => m.toLowerCase().includes(query.toLowerCase()));

  return (
    <StepLayout
      stepNumber={2}
      totalSteps={11}
      title="Select Your Make"
      subtitle={`Brands available for ${selectedYear}`}
      description="Select the manufacturer of your vehicle. We only show brands that have models available in your selected registration year."
      tip="The brand is usually the largest logo on your car's steering wheel or grille."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!selected}
    >
      <div className="flex flex-col h-full">
        {/* Top bar: Search & Sort */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search make..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
            Popular <ChevronDown className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Grid of Makes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-4 max-h-[400px] custom-scrollbar">
          {filteredMakes.map((make) => {
            const isSelected = selected === make;

            
            return (
              <button
                key={make}
                onClick={() => onSelect(make)}
                className={`relative flex flex-col items-center justify-between p-4 rounded-2xl border transition-all duration-200 h-48
                  ${isSelected
                    ? "border-[#16A34A] bg-[#F0FDF4] text-[#166534] shadow-[0_0_0_1px_#16A34A]"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm"
                  }`}
              >
                {/* Brand Logo or Text Fallback */}
                <div className="h-8 mb-2 w-full flex justify-center items-center">
                  <img
                    src={`/assets/brands/${make}.png`}
                    alt={`${make} logo`}
                    className="h-full object-contain opacity-80"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.endsWith(".png")) {
                        target.src = `/assets/brands/${make}.webp`;
                      } else if (target.src.endsWith(".webp")) {
                        target.src = `/assets/brands/${make}.jpg`;
                      } else {
                        // Hide broken image and show the span fallback using CSS
                        target.style.display = "none";
                        const nextSibling = target.nextElementSibling as HTMLElement;
                        if (nextSibling) nextSibling.style.display = "block";
                      }
                    }}
                  />
                  <span className="font-black text-zinc-300 tracking-wider uppercase text-lg hidden">
                    {make.substring(0, 3)}
                  </span>
                </div>
                
                {/* Car Image */}
                <div className="flex-1 w-full relative mb-2 flex items-center justify-center">
                  <img
                    src={`/assets/makes/${make}.png`}
                    alt={make}
                    className="w-full h-full object-contain mix-blend-multiply max-h-20"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.endsWith(".png")) {
                        target.src = `/assets/makes/${make}.webp`;
                      } else if (target.src.endsWith(".webp")) {
                        target.src = `/assets/makes/${make}.jpg`;
                      } else {
                        target.src = "/assets/car-placeholder.svg";
                        target.className = "w-16 h-16 opacity-30 object-contain";
                      }
                    }}
                  />
                </div>
                
                <span className="font-semibold text-sm text-center">{make}</span>

                {isSelected && (
                  <div className="absolute top-3 right-3 bg-white rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-[#16A34A] fill-white" />
                  </div>
                )}
              </button>
            );
          })}
          
          {filteredMakes.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-400 text-sm">
              No brands found matching "{query}" for {selectedYear}
            </div>
          )}
        </div>
      </div>
    </StepLayout>
  );
}
