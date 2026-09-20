// Strict TypeScript types mirroring all Pydantic backend schemas exactly.

export interface VehicleDetails {
  make: string;
  model: string;
  registration_year: number;
  fuel_type: string;
  transmission: string;
  ownsership: string; // intentional typo — matches backend schema
  kms_driven: number;
  seats: number;
  mileage_kmpl: number;
  engine_cc: number;
}

export interface PredictionRequest {
  vehicle: VehicleDetails;
  images: string[];
  generate_report: boolean;
}

export interface CarVisualReport {
  front: string;
  rear: string;
  side: string;
  interior: string;
  condition?: string; // Add optional condition, summary so the frontend ResultPage doesn't break entirely if referenced
  summary?: string;
  bumper?: string;
  damage?: string;
  cleanliness?: string;
  wheels?: string;
}

export interface ConfidenceBand {
  low: number;
  high: number;
}

export interface ValuationWhyThisValue {
  title: string;
  desc: string;
  val: string;
  pos: boolean;
}

export interface ValuationImageInsights {
  front: string;
  rear: string;
  side: string;
  interior: string;
}

export interface ValuationReport {
  final_price: number;
  ai_summary: string;
  why_this_value: ValuationWhyThisValue[];
  image_insights: ValuationImageInsights;
}

export interface PredictionResponse {
  predicted_price: number;
  currency: string;
  confidence_band: ConfidenceBand | null;
  vehicle_summary: string;
  visual_report: CarVisualReport;
  valuation_report: ValuationReport | null;
  timestamp: string;
}

// Catalogue types
export interface CatalogueModel {
  make: string;
  models: string[];
}

export interface CatalogueYear {
  year: number;
  makes: CatalogueModel[];
}

export interface VehicleCatalogue {
  version: string;
  source: string;
  generated_at: string;
  total_combinations: number;
  years: CatalogueYear[];
}

// Form state type used in the wizard
export interface ValuationFormState {
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
  // Image handling
  uploadedFiles: File[];
  primaryImageUrl: string | null; // the imgbb-hosted URL sent to backend
}

export type AnalysisStatus = "idle" | "uploading" | "analysing" | "done" | "error";
