"""Graph API router — full LangGraph valuation pipeline.

Endpoint: POST /api/v1/analyse
Orchestrates price prediction, 7-dimension BLIP visual inspection, and
LLM executive valuation report via the compiled 3-node LangGraph pipeline.
"""

from datetime import datetime, timezone
import os

from fastapi import APIRouter, status, BackgroundTasks

from app.core.logging import get_logger
from app.graph.builder import build_valuation_graph
from app.graph.state import ValuationState
from app.schemas.request import PredictionRequest
from app.schemas.response import CarVisualReport, PredictionResponse

logger = get_logger(__name__)

router = APIRouter(prefix="/analyse", tags=["Valuation Workflow"])

# Compile graph once at router import time
_compiled_graph = build_valuation_graph()


def delete_local_files(image_urls: list[str]) -> None:
    """Delete local uploaded images from disk to save memory storage."""
    for url in image_urls:
        if "/static/uploads/" in url:
            try:
                filename = url.split("/static/uploads/")[-1]
                file_path = os.path.join("static", "uploads", filename)
                if os.path.exists(file_path):
                    os.remove(file_path)
                    logger.info("Cleaned up uploaded file: %s", file_path)
            except Exception as e:
                logger.warning("Failed to delete local file %s: %s", url, e)


@router.post(
    "",
    response_model=PredictionResponse,
    summary="Full vehicle valuation workflow via LangGraph",
    description=(
        "Orchestrates ML price prediction, 7-dimension BLIP camera inspection, "
        "and optional LLM executive valuation report using LangGraph."
    ),
    status_code=status.HTTP_200_OK,
)
async def analyse_vehicle(
    request: PredictionRequest,
    background_tasks: BackgroundTasks,
) -> PredictionResponse:
    """Execute the full 3-node LangGraph valuation pipeline."""
    logger.info(
        "LangGraph analysis request for %s %s (reg. %d)",
        request.vehicle.make,
        request.vehicle.model,
        request.vehicle.registration_year,
    )

    # Initialise workflow state
    initial_state = ValuationState(
        vehicle_data=request.vehicle.model_dump(),
        images=request.images,
        generate_report=request.generate_report,
    )

    # Invoke compiled LangGraph workflow
    final_state: ValuationState = _compiled_graph.invoke(initial_state)

    # Override the ML predicted price with the LLM visually-adjusted price if available
    predicted_price = final_state.adjusted_price if final_state.adjusted_price is not None else (final_state.predicted_price or 0.0)
    vehicle_summary = final_state.vehicle_summary or ""

    confidence_band = None
    if predicted_price > 0:
        from app.utils.helpers import safe_round
        confidence_band = {
            "low": safe_round(predicted_price * 0.90),
            "high": safe_round(predicted_price * 1.10),
        }

    visual_report_dict = final_state.visual_report or {
        "front": "No issues observed.",
        "rear": "No issues observed.",
        "side": "No issues observed.",
        "interior": "Clean and well maintained."
    }
    visual_report = CarVisualReport(**visual_report_dict)

    # Schedule background cleanup of uploaded local images
    background_tasks.add_task(delete_local_files, request.images)

    return PredictionResponse(
        predicted_price=predicted_price,
        currency="INR",
        confidence_band=confidence_band,
        vehicle_summary=vehicle_summary,
        visual_report=visual_report,
        valuation_report=final_state.valuation_report,
        timestamp=datetime.now(timezone.utc),
    )
