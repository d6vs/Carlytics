"""Prediction business service.

Serves as the bridge between API routes and the inference pipeline.
Routes should only call this service, never the inference layer directly.
"""

from app.core.logging import get_logger
from app.inference.pipeline import InferencePipeline
from app.schemas.vehicle import VehicleDetails
from app.utils.helpers import build_vehicle_summary, safe_round

logger = get_logger(__name__)


class PredictionService:
    """Encapsulates prediction business logic."""

    def __init__(self, pipeline: InferencePipeline) -> None:
        self._pipeline = pipeline

    def predict(self, vehicle: VehicleDetails) -> dict:
        """Run a price prediction for the given vehicle.

        Args:
            vehicle: Validated vehicle details.

        Returns:
            Dict containing:
                - predicted_price (float): price in Lakhs (INR)
                - vehicle_summary (str): human-readable summary
        """
        logger.info(
            "PredictionService invoked for %s %s.",
            vehicle.make,
            vehicle.model,
        )
        predicted_price = self._pipeline.run(vehicle)
        vehicle_summary = build_vehicle_summary(vehicle)

        return {
            "predicted_price": safe_round(predicted_price, decimals=2),
            "vehicle_summary": vehicle_summary,
        }
