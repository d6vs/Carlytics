"""Prediction router — Fast-path inference endpoint.

Pipeline:
    1. ML model predicts resale price in Lakhs (INR)
    2. BLIP model generates 7-dimension visual condition report
    3. Returns immediate prediction result without requiring LLM graph orchestration.
"""

from datetime import datetime, timezone

from fastapi import APIRouter, status

from app.core.logging import get_logger
from app.inference.pipeline import InferencePipeline
from app.schemas.request import PredictionRequest
from app.schemas.response import CarVisualReport, PredictionResponse
from app.services.caption_service import CaptionService
from app.services.prediction_service import PredictionService
from app.utils.helpers import safe_round

logger = get_logger(__name__)

router = APIRouter(prefix="/predict", tags=["Prediction"])

_inference_pipeline = InferencePipeline()
_prediction_service = PredictionService(pipeline=_inference_pipeline)
_caption_service = CaptionService()


@router.post(
    "",
    response_model=PredictionResponse,
    summary="Fast-path resale value prediction with BLIP visual inspection",
    description=(
        "Accepts vehicle form details and required car image URL. "
        "Returns ML predicted price in Lakhs (INR) and 7-dimension BLIP visual inspection report."
    ),
    status_code=status.HTTP_200_OK,
)
async def predict_vehicle_value(
    request: PredictionRequest,
) -> PredictionResponse:
    """Fast-path ML prediction + BLIP 7-dimension visual inspection."""
    logger.info(
        "Fast-path prediction request for %s %s (reg. %d)",
        request.vehicle.make,
        request.vehicle.model,
        request.vehicle.registration_year,
    )

    # ── 1. ML Resale Price Prediction ─────────────────────────────────────
    prediction_result = _prediction_service.predict(request.vehicle)
    predicted_price: float = prediction_result["predicted_price"]
    vehicle_summary: str = prediction_result["vehicle_summary"]

    # ── 2. BLIP 4-View Visual Inspection Report ──────────────────────
    logger.info("Running BLIP visual inspection for %d images", len(request.images))
    visual_report_dict = _caption_service.inspect_from_urls(request.images)
    visual_report = CarVisualReport(**visual_report_dict)

    # ── 3. Confidence Band (±10%) ─────────────────────────────────────────
    confidence_low = safe_round(predicted_price * 0.90)
    confidence_high = safe_round(predicted_price * 1.10)
    confidence_band = {"low": confidence_low, "high": confidence_high}

    return PredictionResponse(
        predicted_price=predicted_price,
        currency="INR",
        confidence_band=confidence_band,
        vehicle_summary=vehicle_summary,
        visual_report=visual_report,
        valuation_report=None,
        timestamp=datetime.now(timezone.utc),
    )
