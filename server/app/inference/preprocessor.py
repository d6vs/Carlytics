"""Feature preprocessing for model-ready transformation.

Transforms raw VehicleDetails into a DataFrame with column names that
exactly match the training features from model.ipynb:

    make, model, registration_year, fuel_type, transmission,
    ownsership, kms_driven, seats, mileage(kmpl), engine(cc)

The full sklearn pipeline (pipeline.pkl) is used directly for inference,
so no manual encoding or scaling is needed here — the pipeline handles it.
"""

import pandas as pd

from app.core.exceptions import PreprocessingError
from app.core.logging import get_logger
from app.schemas.vehicle import VehicleDetails

logger = get_logger(__name__)

# Exact column name mapping: API field → training column name
_COLUMN_MAP: dict[str, str] = {
    "make": "make",
    "model": "model",
    "registration_year": "registration_year",
    "fuel_type": "fuel_type",
    "transmission": "transmission",
    "ownsership": "ownsership",
    "kms_driven": "kms_driven",
    "seats": "seats",
    "mileage_kmpl": "mileage(kmpl)",   # Python-safe → training column
    "engine_cc": "engine(cc)",          # Python-safe → training column
}

# Exact order of training features as passed to the pipeline
TRAINING_FEATURES: list[str] = [
    "make",
    "model",
    "registration_year",
    "fuel_type",
    "transmission",
    "ownsership",
    "kms_driven",
    "seats",
    "mileage(kmpl)",
    "engine(cc)",
]


class FeaturePreprocessor:
    """Transforms raw VehicleDetails into a model-ready DataFrame.

    The sklearn pipeline (pipeline.pkl) is self-contained and handles
    all encoding, scaling, and transformation internally. This class
    only builds the correctly named raw DataFrame that the pipeline expects.
    """

    def transform(self, vehicle: VehicleDetails) -> pd.DataFrame:
        """Convert VehicleDetails into a training-schema-aligned DataFrame.

        Args:
            vehicle: Validated vehicle details from the API request.

        Returns:
            A single-row DataFrame with columns matching the training schema.

        Raises:
            PreprocessingError: If mapping or DataFrame construction fails.
        """
        try:
            raw = vehicle.model_dump()

            # Remap Python-safe field names to exact training column names
            aligned: dict[str, object] = {
                training_col: raw[api_field]
                for api_field, training_col in _COLUMN_MAP.items()
            }

            df = pd.DataFrame([aligned], columns=TRAINING_FEATURES)

            logger.info(
                "Preprocessing complete for %s %s — shape: %s",
                vehicle.make,
                vehicle.model,
                df.shape,
            )
            return df

        except Exception as exc:
            logger.exception("Preprocessing failed.")
            raise PreprocessingError(str(exc)) from exc
