// Zustand store for the full valuation wizard state.
// Dependent reset logic: changing year clears make+model, changing make clears model.

import { create } from "zustand";
import type { PredictionResponse, AnalysisStatus } from "@/lib/api/types";

interface ValuationState {
  // Step tracker
  step: number;

  // Vehicle selections
  registration_year: number | null;
  make: string | null;
  model: string | null;
  fuel_type: string | null;
  transmission: string | null;
  ownsership: string | null;
  kms_driven: number | null;
  seats: number | null;
  mileage_kmpl: number | null;
  engine_cc: number | null;

  // Images (multiple uploads — first is primary for BLIP)
  uploadedFiles: File[];
  primaryImageUrl: string | null;

  // Analysis result
  analysisStatus: AnalysisStatus;
  result: PredictionResponse | null;
  error: string | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  setYear: (year: number) => void;
  setMake: (make: string) => void;
  setModel: (model: string) => void;
  setFuelType: (fuelType: string) => void;
  setTransmission: (transmission: string) => void;
  setOwnership: (ownership: string) => void;
  setKmsDriven: (kms: number) => void;
  setSeats: (seats: number) => void;
  setMileageKmpl: (mileage: number) => void;
  setEngineCc: (engine: number) => void;

  setUploadedFiles: (files: File[]) => void;
  setPrimaryImageUrl: (url: string | null) => void;

  setAnalysisStatus: (status: AnalysisStatus) => void;
  setResult: (result: PredictionResponse) => void;
  setError: (error: string | null) => void;

  reset: () => void;
}

const initialState = {
  step: 0,
  registration_year: null,
  make: null,
  model: null,
  fuel_type: null,
  transmission: null,
  ownsership: null,
  kms_driven: null,
  seats: null,
  mileage_kmpl: null,
  engine_cc: null,
  uploadedFiles: [],
  primaryImageUrl: null,
  analysisStatus: "idle" as AnalysisStatus,
  result: null,
  error: null,
};

export const useValuationStore = create<ValuationState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: s.step + 1 })),
  prevStep: () => set((s) => ({ step: Math.max(0, s.step - 1) })),

  // Dependent reset: changing year clears make + model
  setYear: (year) =>
    set({ registration_year: year, make: null, model: null }),

  // Dependent reset: changing make clears model
  setMake: (make) => set({ make, model: null }),

  setModel: (model) => set({ model }),
  setFuelType: (fuel_type) => set({ fuel_type }),
  setTransmission: (transmission) => set({ transmission }),
  setOwnership: (ownsership) => set({ ownsership }),
  setKmsDriven: (kms_driven) => set({ kms_driven }),
  setSeats: (seats) => set({ seats }),
  setMileageKmpl: (mileage_kmpl) => set({ mileage_kmpl }),
  setEngineCc: (engine_cc) => set({ engine_cc }),

  setUploadedFiles: (uploadedFiles) => set({ uploadedFiles }),
  setPrimaryImageUrl: (primaryImageUrl) => set({ primaryImageUrl }),

  setAnalysisStatus: (analysisStatus) => set({ analysisStatus }),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));

// Selector helpers
export const selectVehicleDetails = (s: ValuationState) => ({
  make: s.make ?? "",
  model: s.model ?? "",
  registration_year: s.registration_year ?? 0,
  fuel_type: s.fuel_type ?? "",
  transmission: s.transmission ?? "",
  ownsership: s.ownsership ?? "",
  kms_driven: s.kms_driven ?? 0,
  seats: s.seats ?? 5,
  mileage_kmpl: s.mileage_kmpl ?? 0,
  engine_cc: s.engine_cc ?? 0,
});
