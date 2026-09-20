"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";

const ANALYSIS_STEPS = [
  { 
    id: 1, 
    title: "Running ML Valuation", 
    desc: "Predicting base market value",
    delay: 0,
    duration: 1.5
  },
  { 
    id: 2, 
    title: "Inspecting Images", 
    desc: "Analyzing 4 vehicle images",
    delay: 1.5,
    duration: 3.5
  },
  { 
    id: 3, 
    title: "Analyzing Market Data", 
    desc: "Comparing with similar listings",
    delay: 5.0,
    duration: 2.0
  },
  { 
    id: 4, 
    title: "Generating Report", 
    desc: "Preparing your detailed quote",
    delay: 7.0,
    duration: 3.0
  },
];

export default function AnalysisLoader() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  // Fake progress bar logic over 30s
  useEffect(() => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      let newPct = 0;
      let step = 1;
      
      if (elapsed < 2000) {
        // 0-2s: ML Prediction -> up to 25%
        newPct = Math.floor((elapsed / 2000) * 25);
        step = 1;
      } else if (elapsed < 17000) {
        // 2s-17s: Inspecting 4 images -> 25% to 75%
        newPct = 25 + Math.floor(((elapsed - 2000) / 15000) * 50);
        step = 2;
      } else if (elapsed < 18000) {
        // 17s-18s: Analyzing market data -> 75% to 80%
        newPct = 75 + Math.floor(((elapsed - 17000) / 1000) * 5);
        step = 3;
      } else {
        // 18s+: LLM Generation -> 80% to 99% max
        const llmElapsed = elapsed - 18000;
        newPct = Math.min(99, 80 + Math.floor((llmElapsed / 10000) * 19));
        step = 4;
      }
      
      setProgress(newPct);
      setCurrentStep(step);
      
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0A1118] text-white overflow-y-auto flex flex-col items-center pt-12 pb-8">
      
      {/* Background Car Image */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img 
          src="/assets/loading-bg.png" 
          alt="Background Car" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0A1118]/80" /> {/* Dark overlay to blend it cleanly */}
      </div>

      {/* Header Logo */}
      <div className="flex items-center gap-2 mb-12 relative z-10">
        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-bold text-xl tracking-wide">Carlytics</span>
      </div>

      {/* Circular Progress */}
      <div className="relative flex flex-col items-center justify-center mb-10 z-10">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Background circle */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="128" cy="128" r="120"
              stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none"
            />
            {/* Foreground circle */}
            <motion.circle
              cx="128" cy="128" r="120"
              stroke="#4ADE80" strokeWidth="12" fill="none" strokeLinecap="round"
              initial={{ strokeDasharray: 753.6, strokeDashoffset: 753.6 }}
              animate={{ strokeDashoffset: 753.6 - (753.6 * progress) / 100 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </svg>
          
          <div className="flex flex-col items-center text-center px-4">
            <span className="text-sm font-medium text-white/80 mb-1">Analyzing</span>
            <span className="text-sm font-medium text-white/80 mb-2">Your Vehicle</span>
            <motion.span 
              className="text-5xl font-bold text-[#4ADE80]"
              key={progress} // To trigger small pop if desired, though rapid updates might stutter. We'll just let it render.
            >
              {progress}%
            </motion.span>
          </div>
        </div>
      </div>

      <p className="text-white/80 text-lg max-w-sm text-center mb-10 z-10">
        Our AI is analyzing your car using market data, images & insights...
      </p>

      {/* Checklist Card */}
      <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-2xl p-6 relative z-10 backdrop-blur-md">
        <div className="flex flex-col gap-6">
          {ANALYSIS_STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isPending = currentStep < step.id;

            return (
              <div key={step.id} className={`flex items-start gap-4 transition-opacity duration-500 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                <div className="mt-1">
                  {isCompleted ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 className="w-6 h-6 text-[#4ADE80]" />
                    </motion.div>
                  ) : isCurrent ? (
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    >
                      <Loader2 className="w-6 h-6 text-[#4ADE80]" />
                    </motion.div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-white/20" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{step.title}</h4>
                  <p className="text-sm text-white/60 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 flex items-center gap-2 text-sm text-white/50 z-10">
        <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
        This process usually takes 30–60 seconds
      </div>

    </div>
  );
}
