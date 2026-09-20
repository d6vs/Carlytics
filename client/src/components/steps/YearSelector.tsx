"use client";

import { useState } from "react";
import { Search, CheckCircle2, ChevronDown } from "lucide-react";
import StepLayout from "@/components/shared/StepLayout";

interface YearSelectorProps {
  years: number[];
  selected: number | null;
  onSelect: (year: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function YearSelector({ years, selected, onSelect, onNext, onBack }: YearSelectorProps) {
  const [query, setQuery] = useState("");

  const filteredYears = years.filter((y) => y.toString().includes(query));
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  return (
    <StepLayout
      stepNumber={1}
      totalSteps={11}
      title="Select Your Vehicle Year"
      subtitle="Choose the year of your vehicle"
      description="Select the year your vehicle was first registered to get the most accurate valuation."
      tip="You can find this on your RC (Registration Certificate)."
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
              placeholder="Search year..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
            Sort <ChevronDown className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Grid of years */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 overflow-y-auto pr-2 pb-4 max-h-[400px] custom-scrollbar">
          {filteredYears.map((year) => {
            const isSelected = selected === year;
            return (
              <button
                key={year}
                onClick={() => onSelect(year)}
                className={`relative h-16 rounded-xl border flex items-center justify-center font-bold text-base transition-all duration-200
                  ${isSelected
                    ? "border-[#16A34A] bg-[#F0FDF4] text-[#166534] shadow-[0_0_0_1px_#16A34A]"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
              >
                {year}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-white rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-[#16A34A] fill-white" />
                  </div>
                )}
              </button>
            );
          })}
          
          {/* Mocked older years for UI purposes */}
          {[2001, 2000].filter(y => y.toString().includes(query)).map(year => {
            const isSelected = selected === year;
            return (
              <button
                key={year}
                onClick={() => onSelect(year)}
                className={`relative h-16 rounded-xl border flex items-center justify-center font-bold text-base transition-all duration-200
                  ${isSelected
                    ? "border-[#16A34A] bg-[#F0FDF4] text-[#166534] shadow-[0_0_0_1px_#16A34A]"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
              >
                {year}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-white rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-[#16A34A] fill-white" />
                  </div>
                )}
              </button>
            )
          })}

          <button
            onClick={() => onSelect(1999)}
            className={`relative h-16 rounded-xl border flex flex-col items-center justify-center transition-all duration-200
              ${selected === 1999
                ? "border-[#16A34A] bg-[#F0FDF4] text-[#166534] shadow-[0_0_0_1px_#16A34A]"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
              }`}
          >
            <span className="font-bold text-sm">Older</span>
            <span className="text-[10px] text-zinc-500">Before 2000</span>
            {selected === 1999 && (
              <div className="absolute -top-2 -right-2 bg-white rounded-full">
                <CheckCircle2 className="w-5 h-5 text-[#16A34A] fill-white" />
              </div>
            )}
          </button>
        </div>

      </div>
    </StepLayout>
  );
}
