"""LangGraph node definitions for the valuation workflow.

Each node is a pure function that receives the ValuationState,
performs one step, and returns the updated state.

3-Node Workflow:
    predict_price -> inspect_image -> generate_report
"""

from app.agents.vehicle_intelligence_agent import VehicleIntelligenceAgent
from app.core.logging import get_logger
from app.graph.state import ValuationState
from app.inference.pipeline import InferencePipeline
from app.schemas.vehicle import VehicleDetails
from app.services.caption_service import CaptionService
from app.services.prediction_service import PredictionService
from app.services.report_service import ReportService
from app.utils.helpers import safe_round

logger = get_logger(__name__)

# Instantiate services for node execution
_inference_pipeline = InferencePipeline()
_prediction_service = PredictionService(pipeline=_inference_pipeline)
_caption_service = CaptionService()
_intelligence_agent = VehicleIntelligenceAgent()
_report_service = ReportService()


def predict_price_node(state: ValuationState) -> ValuationState:
    """Node 1: Run ML inference to predict vehicle resale price.

    Args:
        state: Current workflow state containing raw vehicle_data.

    Returns:
        Updated state with predicted_price, confidence_low, confidence_high, vehicle_summary.
    """
    logger.info("Node [predict_price]: Running ML price prediction.")
    try:
        vehicle = VehicleDetails(**state.vehicle_data)
        prediction_result = _prediction_service.predict(vehicle)

        predicted_price: float = prediction_result["predicted_price"]
        state.predicted_price = predicted_price
        state.vehicle_summary = prediction_result["vehicle_summary"]
        state.confidence_low = safe_round(predicted_price * 0.90)
        state.confidence_high = safe_round(predicted_price * 1.10)

    except Exception as exc:
        logger.exception("Node [predict_price] failed: %s", exc)
        state.errors.append(f"predict_price error: {exc}")

    return state


def inspect_image_node(state: ValuationState) -> ValuationState:
    """Node 2: Run BLIP VQA inspection on all 4 vehicle views.

    Args:
        state: Current workflow state with images list.

    Returns:
        Updated state with visual_report dict containing 4 view captions.
    """
    logger.info("Node [inspect_image]: Running BLIP inspection on 4 images.")
    try:
        if state.images and len(state.images) == 4:
            visual_report = _caption_service.inspect_from_urls(state.images)
        else:
            visual_report = {
                "front": "No image provided.",
                "rear": "No image provided.",
                "side": "No image provided.",
                "interior": "No image provided."
            }
        state.visual_report = visual_report

    except Exception as exc:
        logger.exception("Node [inspect_image] failed: %s", exc)
        state.errors.append(f"inspect_image error: {exc}")
        state.visual_report = {
            "front": "Inspection unavailable.",
            "rear": "Inspection unavailable.",
            "side": "Inspection unavailable.",
            "interior": "Inspection unavailable."
        }

    return state


def generate_report_node(state: ValuationState) -> ValuationState:
    """Node 3: Assemble context and invoke LLM for executive valuation report.

    Args:
        state: Current workflow state with prediction & visual inspection results.

    Returns:
        Updated state with valuation_report text and adjusted_price.
    """
    if not state.generate_report:
        logger.info("Node [generate_report]: generate_report=False — skipping LLM.")
        return state

    logger.info("Node [generate_report]: Generating AI valuation report.")
    try:
        vehicle = VehicleDetails(**state.vehicle_data)

        context = _intelligence_agent.build_context(
            vehicle=vehicle,
            vehicle_summary=state.vehicle_summary or "",
            predicted_price=state.predicted_price or 0.0,
            confidence_low=state.confidence_low or 0.0,
            confidence_high=state.confidence_high or 0.0,
            visual_report=state.visual_report or {},
        )

        state.analysis_context = context

        report_result = _report_service.generate(context)
        state.valuation_report = report_result["report_text"]
        state.adjusted_price = report_result["adjusted_price"]

    except Exception as exc:
        logger.exception("Node [generate_report] failed: %s", exc)
        state.errors.append(f"generate_report error: {exc}")

    return state
