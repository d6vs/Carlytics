"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

import ProgressStepper from "@/components/stepper/ProgressStepper";
import YearSelector from "@/components/steps/YearSelector";
import MakeSelector from "@/components/steps/MakeSelector";
import ModelSelector from "@/components/steps/ModelSelector";
import FuelStep from "@/components/steps/FuelStep";
import TransmissionStep from "@/components/steps/TransmissionStep";
import OwnershipStep from "@/components/steps/OwnershipStep";
import KmsStep from "@/components/steps/KmsStep";
import SeatsStep from "@/components/steps/SeatsStep";
import EngineStep from "@/components/steps/EngineStep";
import ImageUploadStep from "@/components/steps/ImageUploadStep";
import ReviewStep from "@/components/steps/ReviewStep";
import AnalysisLoader from "@/components/result/AnalysisLoader";
import ErrorState from "@/components/shared/ErrorState";

import { useValuationStore, selectVehicleDetails } from "@/lib/store/valuationStore";
import { getCatalogue, getYears, getMakesForYear, getModelsForYearMake } from "@/lib/catalogue";
import { analyseVehicle } from "@/lib/api/analysis";
import type { VehicleCatalogue } from "@/lib/api/types";

const STEP_COUNT = 11; // 0=Year … 10=Review

export default function ValuatePage() {
  const router = useRouter();
  const store = useValuationStore();
  const [catalogue, setCatalogue] = useState<VehicleCatalogue | null>(null);
  const [catError, setCatError] = useState(false);

  // Load catalogue once
  useEffect(() => {
    getCatalogue()
      .then(setCatalogue)
      .catch(() => setCatError(true));
  }, []);

  // Derived catalogue slices
  const years = catalogue ? getYears(catalogue) : [];
  const makes = catalogue && store.registration_year
    ? getMakesForYear(catalogue, store.registration_year)
    : [];
  const models = catalogue && store.registration_year && store.make
    ? getModelsForYearMake(catalogue, store.registration_year, store.make)
    : [];

  async function handleGetQuote() {
    if (store.uploadedFiles.length < 4) {
      store.setError("Please upload exactly 4 images.");
      return;
    }
    store.setAnalysisStatus("uploading");

    try {
      const vehicleDetails = selectVehicleDetails(store);
      const result = await analyseVehicle(vehicleDetails, store.uploadedFiles, true);
      store.setResult(result);
      store.setAnalysisStatus("done");
      router.push("/result");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error occurred.";
      store.setError(message);
      store.setAnalysisStatus("error");
    }
  }

  const isLoading = store.analysisStatus === "uploading" || store.analysisStatus === "analysing";

  // Step animation variants
  const variants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  const stepContent = () => {
    if (store.analysisStatus === "uploading" || store.analysisStatus === "analysing") {
      return <AnalysisLoader />;
    }
    if (store.analysisStatus === "error") {
      return (
        <ErrorState
          message={store.error ?? undefined}
          onRetry={() => { store.setAnalysisStatus("idle"); store.setStep(10); }}
        />
      );
    }

    switch (store.step) {
      case 0:
        return (
          <YearSelector
            years={years}
            selected={store.registration_year}
            onSelect={store.setYear}
            onNext={store.nextStep}
            onBack={() => router.push("/")}
          />
        );
      case 1:
        return (
          <MakeSelector
            makes={makes}
            selected={store.make}
            selectedYear={store.registration_year}
            onSelect={store.setMake}
            onNext={store.nextStep}
            onBack={store.prevStep}
          />
        );
      case 2:
        return (
          <ModelSelector
            models={models}
            selected={store.model}
            selectedYear={store.registration_year}
            selectedMake={store.make}
            onSelect={store.setModel}
            onNext={store.nextStep}
            onBack={store.prevStep}
          />
        );
      case 3:
        return (
          <FuelStep
            selected={store.fuel_type}
            onSelect={store.setFuelType}
            onNext={store.nextStep}
            onBack={store.prevStep}
          />
        );
      case 4:
        return (
          <TransmissionStep
            selected={store.transmission}
            onSelect={store.setTransmission}
            onNext={store.nextStep}
            onBack={store.prevStep}
          />
        );
      case 5:
        return (
          <OwnershipStep
            selected={store.ownsership}
            onSelect={store.setOwnership}
            onNext={store.nextStep}
            onBack={store.prevStep}
          />
        );
      case 6:
        return (
          <KmsStep
            value={store.kms_driven}
            onChange={store.setKmsDriven}
            onNext={store.nextStep}
            onBack={store.prevStep}
          />
        );
      case 7:
        return (
          <SeatsStep
            value={store.seats}
            onChange={store.setSeats}
            onNext={store.nextStep}
            onBack={store.prevStep}
          />
        );
      case 8:
        return (
          <EngineStep
            mileageKmpl={store.mileage_kmpl}
            engineCc={store.engine_cc}
            onChangeMileage={store.setMileageKmpl}
            onChangeEngine={store.setEngineCc}
            onNext={store.nextStep}
            onBack={store.prevStep}
          />
        );
      case 9:
        return (
          <ImageUploadStep
            files={store.uploadedFiles}
            onFilesChange={store.setUploadedFiles}
            onNext={store.nextStep}
            onBack={store.prevStep}
          />
        );
      case 10:
        return (
          <ReviewStep
            year={store.registration_year}
            make={store.make}
            model={store.model}
            fuelType={store.fuel_type}
            transmission={store.transmission}
            ownsership={store.ownsership}
            kmsDriven={store.kms_driven}
            seats={store.seats}
            mileageKmpl={store.mileage_kmpl}
            engineCc={store.engine_cc}
            files={store.uploadedFiles}
            onEdit={store.setStep}
            onGetQuote={handleGetQuote}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  if (catError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState message="Failed to load vehicle catalogue. Please refresh the page." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top bar */}
      <div className="bg-white border-b border-zinc-200 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center">
          <img src="/carlytics-logo.png" alt="Carlytics Logo" className="h-10 md:h-11 w-auto object-contain" />
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-zinc-200 rounded-lg text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Exit & Start Over
        </Link>
      </div>

      {/* Progress stepper */}
      {!isLoading && store.analysisStatus !== "error" && (
        <div className="bg-white border-b border-zinc-100 px-6 py-4">
          <ProgressStepper currentStep={store.step} />
        </div>
      )}

      {/* Step content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${store.step}-${store.analysisStatus}`}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full"
          >
            {stepContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
