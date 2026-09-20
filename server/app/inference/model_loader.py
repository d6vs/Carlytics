"""Singleton model artifact loader using Joblib.

Artifacts are loaded once at application startup and reused
for all subsequent inference requests.
"""

from pathlib import Path
from typing import Any, Optional

import joblib

from app.core.exceptions import ModelNotLoadedError
from app.core.logging import get_logger
from app.core.settings import get_settings

logger = get_logger(__name__)


class ModelLoader:
    """Loads and caches ML artifacts from disk.

    Artifacts are loaded once during the application lifespan
    startup event and held in memory for the lifetime of the process.
    """

    def __init__(self) -> None:
        self._pipeline: Optional[Any] = None      # Full sklearn pipeline (primary)
        self._model: Optional[Any] = None
        self._preprocessor: Optional[Any] = None
        self._encoder: Optional[Any] = None
        self._scaler: Optional[Any] = None
        self._shap_explainer: Optional[Any] = None
        self._is_loaded: bool = False

    # ── Properties ───────────────────────────────────────────

    @property
    def is_loaded(self) -> bool:
        """Whether the required model artifacts have been loaded."""
        return self._is_loaded

    @property
    def pipeline(self) -> Any:
        """Return the full sklearn inference pipeline.

        Raises:
            ModelNotLoadedError: If the pipeline has not been loaded.
        """
        if self._pipeline is None:
            raise ModelNotLoadedError("pipeline.pkl")
        return self._pipeline

    @property
    def model(self) -> Any:
        """Return the trained ML model.

        Raises:
            ModelNotLoadedError: If the model has not been loaded.
        """
        if self._model is None:
            raise ModelNotLoadedError("best_model.pkl")
        return self._model

    @property
    def preprocessor(self) -> Any:
        """Return the fitted preprocessor.

        Raises:
            ModelNotLoadedError: If the preprocessor has not been loaded.
        """
        if self._preprocessor is None:
            raise ModelNotLoadedError("preprocessor.pkl")
        return self._preprocessor

    @property
    def encoder(self) -> Any:
        """Return the fitted encoder.

        Raises:
            ModelNotLoadedError: If the encoder has not been loaded.
        """
        if self._encoder is None:
            raise ModelNotLoadedError("encoder.pkl")
        return self._encoder

    @property
    def scaler(self) -> Optional[Any]:
        """Return the fitted scaler, if available."""
        return self._scaler

    @property
    def shap_explainer(self) -> Optional[Any]:
        """Return the SHAP explainer, if available."""
        return self._shap_explainer

    # ── Loading ──────────────────────────────────────────────

    def load_artifacts(self) -> None:
        """Load all model artifacts from the configured directory.

        Required artifacts (model, preprocessor, encoder) raise
        ``FileNotFoundError`` if missing. Optional artifacts
        (scaler, shap_explainer) log a warning and continue.

        Raises:
            FileNotFoundError: If a required artifact is missing.
        """
        settings = get_settings()
        base_dir = settings.base_dir

        # Full sklearn pipeline — primary inference artifact
        self._pipeline = self._load_artifact(
            base_dir / settings.pipeline_path, required=True
        )
        # Individual artifacts — retained for SHAP and explainability
        self._model = self._load_artifact(
            base_dir / settings.model_path, required=False
        )
        self._preprocessor = self._load_artifact(
            base_dir / settings.preprocessor_path, required=False
        )
        self._encoder = self._load_artifact(
            base_dir / settings.encoder_path, required=False
        )
        self._scaler = self._load_artifact(
            base_dir / settings.scaler_path, required=False
        )
        self._shap_explainer = self._load_artifact(
            base_dir / settings.shap_explainer_path, required=False
        )

        self._is_loaded = True
        logger.info("All model artifacts loaded successfully.")

    @staticmethod
    def _load_artifact(path: Path, *, required: bool) -> Optional[Any]:
        """Load a single artifact from disk via Joblib.

        Args:
            path: Absolute path to the artifact file.
            required: If True, raise when the file is missing.

        Returns:
            Deserialised artifact object, or None if optional and missing.

        Raises:
            FileNotFoundError: If a required artifact does not exist.
        """
        if not path.exists():
            if required:
                logger.error("Required artifact not found: %s", path)
                raise FileNotFoundError(
                    f"Required artifact not found: {path}"
                )
            logger.warning(
                "Optional artifact not found: %s — skipping.", path
            )
            return None

        artifact = joblib.load(path)
        logger.info("Loaded artifact: %s", path.name)
        return artifact


# Module-level singleton
model_loader = ModelLoader()
