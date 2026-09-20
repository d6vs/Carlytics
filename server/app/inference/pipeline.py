"""End-to-end inference pipeline orchestrating preprocessing and prediction.

Uses the full sklearn pipeline.pkl artifact which already contains
the ColumnTransformer, encoder, and model — so inference is a single
pipeline.predict() call on the correctly-named raw DataFrame.
"""

from app.core.logging import get_logger
from app.inference.model_loader import model_loader
from app.inference.preprocessor import FeaturePreprocessor
from app.schemas.vehicle import VehicleDetails

logger = get_logger(__name__)


class InferencePipeline:
    """Orchestrates the full inference flow: preprocess → pipeline.predict.

    Uses pipeline.pkl (the full sklearn pipeline) which encapsulates
    all preprocessing steps trained alongside the model.
    """

    def __init__(self) -> None:
        self._preprocessor = FeaturePreprocessor()

    def run(self, vehicle: VehicleDetails) -> float:
        """Execute the inference pipeline for a single vehicle.

        Args:
            vehicle: Validated vehicle details.

        Returns:
            Predicted resale price in Lakhs (INR).
        """
        logger.info(
            "Running inference for %s %s (reg. %d).",
            vehicle.make,
            vehicle.model,
            vehicle.registration_year,
        )
        # Build training-schema-aligned DataFrame
        features_df = self._preprocessor.transform(vehicle)

        # Run through the full sklearn pipeline (handles encoding + model)
        pipeline = model_loader.pipeline
        raw_prediction = pipeline.predict(features_df)
        predicted_price = float(raw_prediction[0])

        logger.info("Predicted price: %.2f Lakhs", predicted_price)
        return predicted_price
