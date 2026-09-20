"use client";

import { useState } from "react";
import { Search, CheckCircle2, ChevronDown } from "lucide-react";
import StepLayout from "@/components/shared/StepLayout";

interface ModelSelectorProps {
  models: string[];
  selected: string | null;
  selectedYear: number | null;
  selectedMake: string | null;
  onSelect: (model: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ModelSelector({
  models, selected, selectedYear, selectedMake, onSelect, onNext, onBack,
}: ModelSelectorProps) {
  const [query, setQuery] = useState("");

  const filteredModels = query.trim()
    ? models.filter((m) => m.toLowerCase().includes(query.toLowerCase()))
    : models;

  return (
    <StepLayout
      stepNumber={3}
      totalSteps={11}
      title="Select Your Model"
      subtitle={`${selectedMake} models from ${selectedYear}`}
      description="Choose the specific model of your vehicle. The exact model significantly impacts the final resale valuation."
      tip="Check the badge on the rear of your car (e.g. Swift, City, Creta)."
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
              placeholder="Search model..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
            A-Z <ChevronDown className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Grid of Models */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-4 max-h-[400px] custom-scrollbar">
          {filteredModels.map((model) => {
            const isSelected = selected === model;
            const carUrl = `/assets/models/${model.replace(/ /g, "_")}.jpg`;
            
            return (
              <button
                key={model}
                onClick={() => onSelect(model)}
                className={`relative flex flex-col items-center justify-between p-4 rounded-2xl border transition-all duration-200 h-40
                  ${isSelected
                    ? "border-[#16A34A] bg-[#F0FDF4] text-[#166534] shadow-[0_0_0_1px_#16A34A]"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm"
                  }`}
              >
                {/* Car Image */}
                <div className="flex-1 w-full relative mb-3 flex items-center justify-center">
                  <img
                    src={`/assets/models/${encodeURIComponent(model === "3" || model === "5" ? (selectedMake === "Mini" ? `#${model}` : model) : model)}.png`}
                    alt={model}
                    className="w-full h-full object-contain mix-blend-multiply max-h-24 transition-opacity duration-300"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const fileBase = encodeURIComponent(model === "3" || model === "5" ? (selectedMake === "Mini" ? `#${model}` : model) : model);
                      if (target.src.endsWith(".png")) {
                        target.src = `/assets/models/${fileBase}.webp`;
                      } else if (target.src.endsWith(".webp")) {
                        target.src = `/assets/models/${fileBase}.jpg`;
                      } else if (target.src.endsWith(".jpg")) {
                        // Fallback to make logo
                        target.src = `/assets/brands/${selectedMake}.png`;
                      } else if (target.src.includes("brands") && target.src.endsWith(".png")) {
                         target.src = `/assets/brands/${selectedMake}.webp`;
                      } else if (target.src.includes("brands") && target.src.endsWith(".webp")) {
                         target.src = `/assets/brands/${selectedMake}.jpg`;
                      } else {
                        target.src = "/assets/car-placeholder.svg";
                        target.className = "w-16 h-16 opacity-30 object-contain";
                      }
                    }}
                  />
                </div>
                
                <span className="font-semibold text-sm text-center px-2">{model}</span>

                {isSelected && (
                  <div className="absolute top-3 right-3 bg-white rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-[#16A34A] fill-white" />
                  </div>
                )}
              </button>
            );
          })}
          
          {filteredModels.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-400 text-sm">
              No models found matching "{query}"
            </div>
          )}
        </div>
      </div>
    </StepLayout>
  );
}
