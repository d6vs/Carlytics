"use client";

import { useState, useEffect } from "react";
import { GaugeCircle, Settings, Leaf, Zap, Fuel, AlertCircle } from "lucide-react";
import StepLayout from "@/components/shared/StepLayout";

interface EngineStepProps {
  mileageKmpl: number | null;
  engineCc: number | null;
  onChangeMileage: (v: number) => void;
  onChangeEngine: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const ENGINE_CATEGORIES = [
  { id: "compact", title: "Compact / Hatch", range: "Up to 1200 cc", icon: <Settings className="w-5 h-5" />, color: "bg-blue-50 text-blue-600", max: 1200 },
  { id: "sedan", title: "Sedan / Standard", range: "1201 - 1600 cc", icon: <Settings className="w-5 h-5" />, color: "bg-indigo-50 text-indigo-600", max: 1600 },
  { id: "suv", title: "SUV / Premium", range: "1601 - 2500 cc", icon: <Settings className="w-5 h-5" />, color: "bg-purple-50 text-purple-600", max: 2500 },
  { id: "sport", title: "High Performance", range: "2500+ cc", icon: <Settings className="w-5 h-5" />, color: "bg-rose-50 text-rose-600", max: Infinity },
];

const MILEAGE_CATEGORIES = [
  { id: "low", title: "Low Efficiency", range: "Under 10 kmpl", icon: <Fuel className="w-5 h-5" />, color: "bg-red-50 text-red-600", max: 10 },
  { id: "avg", title: "Average", range: "10 - 15 kmpl", icon: <Fuel className="w-5 h-5" />, color: "bg-orange-50 text-orange-600", max: 15 },
  { id: "good", title: "Good", range: "15 - 20 kmpl", icon: <Leaf className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-600", max: 20 },
  { id: "excellent", title: "Excellent", range: "20+ kmpl", icon: <Zap className="w-5 h-5" />, color: "bg-teal-50 text-teal-600", max: Infinity },
];

export default function EngineStep({
  mileageKmpl, engineCc, onChangeMileage, onChangeEngine, onNext, onBack,
}: EngineStepProps) {
  const [rawMileage, setRawMileage] = useState(mileageKmpl?.toString() ?? "18.5");
  const [rawEngine, setRawEngine] = useState(engineCc?.toString() ?? "1197");

  useEffect(() => {
    if (mileageKmpl === null) onChangeMileage(18.5);
    if (engineCc === null) onChangeEngine(1197);
  }, []);

  const numMileage = parseFloat(rawMileage.replace(/[^0-9.]/g, "")) || 0;
  const numEngine = parseInt(rawEngine.replace(/[^0-9]/g, ""), 10) || 0;

  const isValid = numMileage > 0 && numEngine > 0;

  function handleMileage(v: string) {
    const digits = v.replace(/[^0-9.]/g, "");
    setRawMileage(digits);
    const n = parseFloat(digits);
    if (!isNaN(n)) onChangeMileage(n);
  }

  function handleEngine(v: string) {
    const digits = v.replace(/[^0-9]/g, "");
    setRawEngine(digits);
    const n = parseInt(digits, 10);
    if (!isNaN(n)) onChangeEngine(n);
  }

  // Determine active categories
  let activeEngineId = "compact";
  if (numEngine > 2500) activeEngineId = "sport";
  else if (numEngine > 1600) activeEngineId = "suv";
  else if (numEngine > 1200) activeEngineId = "sedan";

  let activeMileageId = "low";
  if (numMileage >= 20) activeMileageId = "excellent";
  else if (numMileage >= 15) activeMileageId = "good";
  else if (numMileage >= 10) activeMileageId = "avg";

  const leftFooterEngine = (
    <div className="absolute bottom-0 left-0 hidden md:block opacity-20 pointer-events-none w-full max-w-[200px]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-auto">
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        <circle cx="12" cy="12" r="6" />
      </svg>
    </div>
  );

  return (
    <StepLayout
      stepNumber={9}
      totalSteps={11}
      title="Engine Details"
      subtitle="Enter your vehicle's engine size and fuel efficiency"
      description="The engine's displacement (CC) and fuel efficiency (kmpl) significantly determine performance, running cost, and valuation."
      tip="You can find these details in your vehicle's RC book, insurance document, or the manufacturer's website."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!isValid}
      leftFooter={leftFooterEngine}
    >
      <div className="flex flex-col gap-10 h-full overflow-y-auto pr-2 pb-4">
        
        {/* Engine Displacement Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 font-medium text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" /> Engine Displacement (CC)
            </span>
          </div>
          
          <div className="relative mb-6">
            <input
              type="text"
              inputMode="numeric"
              value={rawEngine}
              onChange={(e) => handleEngine(e.target.value)}
              className="w-full text-4xl text-zinc-900 font-bold py-5 px-6 pr-16 border border-zinc-200 rounded-2xl focus:outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10 transition-all"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-lg">cc</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {ENGINE_CATEGORIES.map((cat) => {
              const isActive = activeEngineId === cat.id;
              return (
                <div
                  key={cat.id}
                  className={`relative flex flex-col p-4 rounded-xl border transition-all duration-300
                    ${isActive 
                      ? "border-blue-500 bg-blue-50/50 shadow-[0_0_0_1px_#3B82F6]" 
                      : "border-zinc-100 bg-white opacity-70 hover:opacity-100"
                    }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${cat.color}`}>
                    {cat.icon}
                  </div>
                  <span className={`font-bold text-xs mb-1 ${isActive ? "text-blue-700" : "text-zinc-800"}`}>
                    {cat.title}
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-500">
                    {cat.range}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-zinc-100 w-full" />

        {/* Fuel Efficiency Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 font-medium text-sm flex items-center gap-2">
              <GaugeCircle className="w-4 h-4" /> Fuel Efficiency (Mileage)
            </span>
          </div>
          
          <div className="relative mb-6">
            <input
              type="text"
              inputMode="decimal"
              value={rawMileage}
              onChange={(e) => handleMileage(e.target.value)}
              className="w-full text-4xl text-zinc-900 font-bold py-5 px-6 pr-20 border border-zinc-200 rounded-2xl focus:outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10 transition-all"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-lg">kmpl</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {MILEAGE_CATEGORIES.map((cat) => {
              const isActive = activeMileageId === cat.id;
              return (
                <div
                  key={cat.id}
                  className={`relative flex flex-col p-4 rounded-xl border transition-all duration-300
                    ${isActive 
                      ? "border-[#16A34A] bg-[#F0FDF4] shadow-[0_0_0_1px_#16A34A]" 
                      : "border-zinc-100 bg-white opacity-70 hover:opacity-100"
                    }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${cat.color}`}>
                    {cat.icon}
                  </div>
                  <span className={`font-bold text-xs mb-1 ${isActive ? "text-[#16A34A]" : "text-zinc-800"}`}>
                    {cat.title}
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-500">
                    {cat.range}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </StepLayout>
  );
}
