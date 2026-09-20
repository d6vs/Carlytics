"""Model inference — runs predictions on processed features."""

from typing import Any

import pandas as pd

from app.core.exceptions import PredictionError
from app.core.logging import get_logger
from app.utils.helpers import safe_round

logger = get_logger(__name__)


class Predictor:
    """Executes model inference on preprocessed feature vectors."""

    def __init__(self, model: Any) -> None:
        self._model = model

    def predict(self, features: pd.DataFrame) -> float:
        """Run a prediction on the provided feature DataFrame.

        Args:
            features: A preprocessed, model-ready DataFrame (single row).

        Returns:
            Predicted resale price as a float.

        Raises:
            PredictionError: If model inference fails.
        """
        try:
            raw_prediction = self._model.predict(features)
            predicted_value = safe_round(float(raw_prediction[0]), decimals=2)
            logger.info("Prediction completed: £%.2f", predicted_value)
            return predicted_value
        except Exception as exc:
            logger.exception("Model prediction failed.")
            raise PredictionError(str(exc)) from exc
