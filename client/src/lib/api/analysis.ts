// Vehicle analysis API calls.

import { apiFetch, uploadToImgbb } from "./client";
import type { PredictionRequest, PredictionResponse, VehicleDetails } from "./types";

export async function analyseVehicle(
  vehicle: VehicleDetails,
  files: File[],
  generateReport = true
): Promise<PredictionResponse> {
  // 1. Upload all 4 images to imgbb → get public URLs
  const imageUrls = await Promise.all(files.map(file => uploadToImgbb(file)));

  // 2. Build exact backend request payload
  const payload: PredictionRequest = {
    vehicle,
    images: imageUrls,
    generate_report: generateReport,
  };

  // 3. POST to FastAPI /api/v1/analyse
  return apiFetch<PredictionResponse>("/api/v1/analyse", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
