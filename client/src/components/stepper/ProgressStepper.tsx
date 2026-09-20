"use client";

import { motion } from "framer-motion";
import { 
  Calendar, Car, CarFront, Droplet, Fuel, Gauge, 
  Users, Settings2, Camera, FileText, UserCircle
} from "lucide-react";
import React from "react";

const STEPS = [
  { label: "Year", icon: Calendar },
  { label: "Make", icon: Car },
  { label: "Model", icon: CarFront },
  { label: "Fuel", icon: Droplet },
  { label: "Transmission", icon: Settings2 },
  { label: "Ownership", icon: UserCircle },
  { label: "Mileage", icon: Gauge },
  { label: "Seats", icon: Users },
  { label: "Engine", icon: Fuel },
  { label: "Images", icon: Camera },
  { label: "Review", icon: FileText },
];

interface ProgressStepperProps {
  currentStep: number; // 0-indexed
}

export default function ProgressStepper({ currentStep }: ProgressStepperProps) {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center justify-between min-w-max relative">
        {/* Background connecting line */}
        <div className="absolute top-6 left-6 right-6 h-[2px] bg-zinc-200 -z-10" />

        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          const isFuture = i > currentStep;

          return (
            <div key={step.label} className="flex flex-col items-center gap-3 relative px-2">
              {/* Dynamic connecting line segment for completed steps */}
              {i > 0 && isDone && (
                <div 
                  className="absolute top-6 right-1/2 w-full h-[2px] bg-[#16A34A] -z-10" 
                  style={{ transform: "translateX(-50%)" }}
                />
              )}
              {i > 0 && isActive && (
                <div 
                  className="absolute top-6 right-1/2 w-full h-[2px] bg-[#16A34A] -z-10" 
                  style={{ transform: "translateX(-50%)" }}
                />
              )}

              {/* Icon Circle */}
              <div
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white
                  ${isActive 
                    ? "border-[#16A34A] text-[#16A34A]" 
                    : isDone 
                      ? "border-[#16A34A] text-[#16A34A]" 
                      : "border-zinc-200 text-zinc-400"
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive && "fill-emerald-50/50"}`} />
              </div>

              {/* Label */}
              <span
                className={`text-xs font-semibold transition-colors duration-300
                  ${isActive ? "text-[#16A34A]" : isDone ? "text-zinc-700" : "text-zinc-400"}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
