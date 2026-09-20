"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, Info, TrendingUp, GaugeCircle, Shield, Calendar, BarChart3, Star, Car } from "lucide-react";
import confetti from "canvas-confetti";
import { useValuationStore, selectVehicleDetails } from "@/lib/store/valuationStore";

export default function ResultPage() {
  const router = useRouter();
  const store = useValuationStore();
  const { result, error, analysisStatus, reset, uploadedFiles } = store;
  const details = selectVehicleDetails(store);

  useEffect(() => {
    if (!result && analysisStatus !== "done") {
      router.replace("/valuate");
    }
  }, [result, analysisStatus, router]);

  useEffect(() => {
    if (result) {
      // Fire confetti blast on load!
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [result]);

  if (!result) return null;

  const LAKH_TO_GBP = 955; // 1 Lakh INR ≈ £955

  const formatPrice = (val: number | undefined) => {
    if (val === undefined || val === null) return "";
    let finalVal = val;
    // If value is less than 1000, it's in Lakhs from the ML model — convert to GBP
    if (finalVal < 1000) {
      finalVal = Math.round(finalVal * LAKH_TO_GBP);
    }
    return new Intl.NumberFormat("en-GB", { 
      style: "currency", 
      currency: "GBP", 
      maximumFractionDigits: 0 
    }).format(finalVal);
  };

  // LLM final_price comes back as full GBP (e.g. 8500), use it directly if available
  const displayPrice = result.valuation_report?.final_price
    ? new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(result.valuation_report.final_price)
    : formatPrice(result.predicted_price);

  const fmtLow = result.confidence_band ? formatPrice(result.confidence_band.low) : "";
  const fmtHigh = result.confidence_band ? formatPrice(result.confidence_band.high) : "";

  const downloadReport = () => {
    const originalTitle = document.title;
    document.title = "valuation";
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  };

  return (
    <>
    <div className="min-h-screen bg-zinc-50 font-sans pb-10 print:hidden">
      {/* Top Navbar */}
      <div className="bg-white border-b border-zinc-200 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center">
          <img src="/carlytics-logo.png" alt="Carlytics Logo" className="h-10 md:h-11 w-auto object-contain" />
        </Link>
        
        <button 
          onClick={() => { reset(); router.push("/valuate"); }}
          className="bg-[#16A34A] hover:bg-[#15803D] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
        >
          New Valuation
        </button>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 pt-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-1.5 text-[#16A34A] font-bold text-sm mb-2">
              <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
              Analysis Complete
            </div>
            <h1 className="text-3xl font-black text-zinc-900 mb-1">Here&apos;s Your Final Offer!</h1>
            <p className="text-zinc-500 text-sm">Based on our AI analysis, market data & vehicle inspection</p>
          </motion.div>

          <button 
            onClick={downloadReport}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-200 bg-white rounded-xl text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Download Full Report
          </button>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Column 1: Primary Offer & Details */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Final Offer Card */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 pb-2">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-zinc-900">Your Final Offer</span>
                  <span className="bg-[#F0FDF4] text-[#16A34A] text-[10px] uppercase tracking-wide font-bold px-2 py-1 rounded-md">
                    Best Market Price
                  </span>
                </div>
                
                <p className="text-xs text-zinc-500 font-semibold mb-1">Estimated Market Value</p>
                <div className="text-4xl font-black text-[#16A34A] tracking-tight mb-4">
                  {displayPrice}
                </div>
                
                <div className="flex items-center gap-1 text-xs font-semibold text-zinc-500 mb-1">
                  Confidence Band (10%) <Info className="w-3 h-3" />
                </div>
                <div className="text-sm font-bold text-zinc-800">
                  {fmtLow} - {fmtHigh}
                </div>
              </div>

              <div className="px-4 py-4 relative flex-grow flex items-center justify-center min-h-[160px]">
                 <img 
                   src={`/assets/models/${encodeURIComponent(details.model === "3" || details.model === "5" ? (details.make === "Mini" ? `#${details.model}` : details.model) : details.model)}.png`}
                   alt={`${details.make} ${details.model}`} 
                   className="w-full max-w-[280px] object-contain drop-shadow-xl" 
                   onError={(e) => {
                     const target = e.currentTarget;
                     const fileBase = encodeURIComponent(details.model === "3" || details.model === "5" ? (details.make === "Mini" ? `#${details.model}` : details.model) : details.model);
                     // Simple fallback chain: .png -> .webp -> .jpg -> placeholder
                     if (target.src.includes(".png")) {
                       target.src = `/assets/models/${fileBase}.webp`;
                     } else if (target.src.includes(".webp")) {
                       target.src = `/assets/models/${fileBase}.jpg`;
                     } else if (target.src.includes(".jpg")) {
                       target.src = "/assets/car-placeholder.svg";
                     }
                   }}
                 />
              </div>

              <div className="px-4 pb-4">
                <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-3 flex flex-col items-center text-center">
                  <div className="flex items-center gap-1.5 text-[#166534] font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" /> This is a fair and competitive price
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 flex-grow">
              <h3 className="font-bold text-zinc-900 mb-6 flex items-center gap-2 text-sm">
                 <div className="w-7 h-7 rounded-full bg-[#F0FDF4] flex items-center justify-center">
                   <Car className="w-4 h-4 text-[#16A34A]" />
                 </div>
                 Vehicle Details
              </h3>
              
              <div className="flex flex-col gap-3.5">
                {[
                  { label: "Year", value: details.registration_year },
                  { label: "Make", value: details.make },
                  { label: "Model", value: details.model },
                  { label: "Fuel Type", value: details.fuel_type },
                  { label: "Transmission", value: details.transmission },
                  { label: "Ownership", value: details.ownsership },
                  { label: "Mileage", value: `${details.kms_driven.toLocaleString()} km` },
                  { label: "Engine", value: `${details.engine_cc} cc` },
                  { label: "Seats", value: `${details.seats} Seater` },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-zinc-50 pb-3 last:border-0 last:pb-0">
                    <span className="text-xs font-medium text-zinc-500">{row.label}</span>
                    <span className="text-xs font-bold text-zinc-900 text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>



          </div>

          {/* Column 2: Value Breakdown & AI Summary */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* AI Summary Report */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 lg:p-8">
               <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2 text-base">
                 <div className="w-7 h-7 rounded-md bg-[#F0FDF4] flex items-center justify-center">
                   <BarChart3 className="w-4 h-4 text-[#16A34A]" />
                 </div>
                 AI Summary Report
               </h3>
               <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                 {result.valuation_report?.ai_summary || `This ${details.make} ${details.model} (${details.registration_year}) is in ${result.visual_report.condition ? result.visual_report.condition.toLowerCase() : "good"} overall condition. Based on current market trends, location data, and our comprehensive visual analysis, this is a fair and highly competitive market price.`}
               </p>
               
               <div className="bg-[#F0FDF4] rounded-xl p-4 flex items-center justify-between border border-[#BBF7D0]/50 max-w-sm">
                 <span className="flex items-center gap-2 text-sm font-bold text-[#166534]">
                   <Star className="w-5 h-5 fill-emerald-500 text-emerald-500" /> Overall Rating
                 </span>
                 <span className="font-bold text-[#166534] text-lg">
                   4.3 <span className="text-sm font-medium text-[#166534]/60">/ 5</span>
                 </span>
               </div>
            </div>
            
            {/* Why this value */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 lg:p-8">
              <h3 className="font-bold text-zinc-900 mb-8 text-xl">Why this value?</h3>
              
              <div className="grid grid-cols-1 gap-y-8">
                {result.valuation_report?.why_this_value ? (
                  result.valuation_report.why_this_value.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.pos ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        {item.pos ? (
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-bold text-zinc-900">{item.title}</h4>
                        <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className={`text-base font-bold whitespace-nowrap ${item.pos ? 'text-emerald-600' : 'text-red-600'}`}>
                        {item.val}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">Valuation insights are currently unavailable.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    {/* ── Print-Only PDF Layout (Hidden on Screen, Sibling to Screen Layout) ── */}
    <div className="hidden print:flex bg-white text-black p-[20mm] font-sans w-full h-[297mm] relative overflow-hidden flex-col justify-between box-border">
      {/* CSS print-style injector to hide browser headers/footers and set page layout */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4;
            margin: 0mm !important; /* Set margin to 0 to completely strip browser headers/footers */
          }
          body {
            background-color: white !important;
            color: black !important;
            margin: 0mm !important;
            padding: 0mm !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            height: 100%;
          }
        }
      `}} />

      {/* Subtle background watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none z-0">
        <img 
          src="/carlytics-logo.png" 
          alt="Carlytics Watermark" 
          className="w-[500px] h-auto object-contain rotate-[-15deg]" 
        />
      </div>

      <div className="relative z-10 flex-grow flex flex-col justify-between h-full">
        <div>
          {/* Letterhead Header */}
          <div className="flex items-center justify-between border-b-2 border-zinc-850 pb-4 mb-6">
            <img src="/carlytics-logo.png" alt="Carlytics Logo" className="h-10 w-auto object-contain" />
            <div className="text-right">
              <h1 className="text-lg font-black uppercase tracking-tight text-zinc-950">Vehicle Valuation Report</h1>
              <p className="text-[10px] text-zinc-500 font-medium">Generated: {new Date(result.timestamp).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Section: Overview Specifications */}
          <div className="mb-6">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-3 border-b border-zinc-200 pb-1">1. Vehicle Overview</h2>
            <div className="grid grid-cols-4 gap-y-3 gap-x-6 text-xs">
              <div><span className="text-zinc-500 text-[10px] font-medium block mb-0.5">Make / Model</span><span className="font-bold text-zinc-900">{details.make} {details.model}</span></div>
              <div><span className="text-zinc-500 text-[10px] font-medium block mb-0.5">Reg. Year</span><span className="font-bold text-zinc-900">{details.registration_year}</span></div>
              <div><span className="text-zinc-500 text-[10px] font-medium block mb-0.5">Fuel Type</span><span className="font-bold text-zinc-900">{details.fuel_type}</span></div>
              <div><span className="text-zinc-500 text-[10px] font-medium block mb-0.5">Transmission</span><span className="font-bold text-zinc-900">{details.transmission}</span></div>
              <div><span className="text-zinc-500 text-[10px] font-medium block mb-0.5">Mileage</span><span className="font-bold text-zinc-900">{details.kms_driven.toLocaleString()} km</span></div>
              <div><span className="text-zinc-500 text-[10px] font-medium block mb-0.5">Engine</span><span className="font-bold text-zinc-900">{details.engine_cc} cc</span></div>
              <div><span className="text-zinc-500 text-[10px] font-medium block mb-0.5">Ownership</span><span className="font-bold text-zinc-900">{details.ownsership}</span></div>
              <div><span className="text-zinc-500 text-[10px] font-medium block mb-0.5">Seats</span><span className="font-bold text-zinc-900">{details.seats} Seater</span></div>
            </div>
          </div>

          {/* Section: Core Valuation */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-5 mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Estimated Market Value</h2>
              <div className="text-3xl font-black text-emerald-600 tracking-tight">{displayPrice}</div>
            </div>
            <div className="text-right">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Confidence Range (10%)</h2>
              <div className="text-xs font-bold text-zinc-800">{fmtLow} – {fmtHigh}</div>
            </div>
          </div>

          {/* Section: Visual Inspection Summary */}
          <div className="mb-6">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-3 border-b border-zinc-200 pb-1">2. Visual Inspection Report</h2>
            <div className="text-xs text-zinc-800 leading-relaxed">
              <p className="mb-1.5"><strong className="text-zinc-900">Overall Condition:</strong> {result.visual_report.condition || "Good"}</p>
              <p className="text-zinc-600 italic leading-relaxed">&ldquo;{result.visual_report.summary}&rdquo;</p>
            </div>
          </div>

          {/* Section: AI Narrative Analysis */}
          <div className="mb-6">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-3 border-b border-zinc-200 pb-1">3. AI Summary & Evaluation</h2>
            <p className="text-xs text-zinc-700 leading-relaxed">
              {result.valuation_report?.ai_summary || "No summary available."}
            </p>
          </div>

          {/* Section: Key Valuation Drivers */}
          <div className="mb-6">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-4 border-b border-zinc-200 pb-1">4. Key Pricing Drivers</h2>
            <div className="space-y-4">
              {result.valuation_report?.why_this_value ? (
                result.valuation_report.why_this_value.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
                    <div className="pr-4">
                      <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                        <span className={item.pos ? "text-emerald-600" : "text-red-600"}>
                          {item.pos ? "▲" : "▼"}
                        </span>
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-1 leading-snug">{item.desc}</p>
                    </div>
                    <div className={`text-xs font-bold ${item.pos ? "text-emerald-600" : "text-red-600"}`}>
                      {item.val}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400">No driving variables listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Report Footer */}
        <div className="border-t border-zinc-200 pt-5 text-center text-[9px] text-zinc-400 font-medium">
          <p className="uppercase tracking-wider">Carlytics Resale Intelligence Report &bull; Confidential</p>
          <p className="mt-1">This report is an automated valuation estimation tool for decision support. It does not constitute a formal trade-in offer.</p>
        </div>
      </div>
    </div>
    </>
  );
}
