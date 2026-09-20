// Catalogue loader and dataset-derived helpers.
import type { VehicleCatalogue, CatalogueYear } from "@/lib/api/types";

let _catalogue: VehicleCatalogue | null = null;

export async function getCatalogue(): Promise<VehicleCatalogue> {
  if (_catalogue) return _catalogue;
  const res = await fetch("/data/vehicle-catalogue.json");
  if (!res.ok) throw new Error("Failed to load vehicle catalogue");
  _catalogue = (await res.json()) as VehicleCatalogue;
  return _catalogue;
}

export function getYears(catalogue: VehicleCatalogue): number[] {
  return catalogue.years.map((y) => y.year);
}

export function getMakesForYear(
  catalogue: VehicleCatalogue,
  year: number
): string[] {
  // If year is older than our dataset (2002), just show the makes from 2002 so the UI doesn't break
  const effectiveYear = year < 2002 ? 2002 : year;
  const yearData = catalogue.years.find((y) => y.year === effectiveYear);
  if (!yearData) return [];
  return yearData.makes.map((m) => m.make).sort();
}

export function getModelsForYearMake(
  catalogue: VehicleCatalogue,
  year: number,
  make: string
): string[] {
  const effectiveYear = year < 2002 ? 2002 : year;
  const yearData = catalogue.years.find((y) => y.year === effectiveYear);
  if (!yearData) return [];
  const makeData = yearData.makes.find((m) => m.make === make);
  if (!makeData) return [];
  return makeData.models.sort();
}

// Fuel types from actual dataset
export const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"] as const;

// Transmission options
export const TRANSMISSION_TYPES = ["Manual", "Automatic"] as const;

// Ownership options from dataset
export const OWNERSHIP_OPTIONS = [
  "First Owner",
  "Second Owner",
  "Third Owner",
  "Fourth & Above Owner",
  "Test Drive Car",
] as const;

// Seat options commonly found in dataset
export const SEAT_OPTIONS = [2, 4, 5, 6, 7, 8, 9, 10] as const;
