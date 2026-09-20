"""Application-wide constants.

All magic strings and numbers used across the application should
be defined here to ensure a single source of truth.
"""

# ── API Versioning ───────────────────────────────────────────────
API_V1_PREFIX: str = "/api/v1"

# ── Model Artifact Filenames ─────────────────────────────────────
ARTIFACT_BEST_MODEL: str = "best_model.pkl"
ARTIFACT_PREPROCESSOR: str = "preprocessor.pkl"
ARTIFACT_ENCODER: str = "encoder.pkl"
ARTIFACT_SCALER: str = "scaler.pkl"
ARTIFACT_SHAP_EXPLAINER: str = "shap_explainer.pkl"

# ── Supported Categorical Values ────────────────────────────────
FUEL_TYPES: frozenset[str] = frozenset(
    {"Petrol", "Diesel", "Hybrid", "Electric"}
)
TRANSMISSION_TYPES: frozenset[str] = frozenset(
    {"Manual", "Automatic", "Semi-Automatic"}
)
BODY_TYPES: frozenset[str] = frozenset(
    {
        "Sedan", "Hatchback", "SUV", "Coupe",
        "Convertible", "Estate", "MPV", "Pickup",
    }
)

# ── SHAP ─────────────────────────────────────────────────────────
SHAP_TOP_K_FEATURES: int = 5

# ── LLM ──────────────────────────────────────────────────────────
DEFAULT_LLM_MAX_TOKENS: int = 1024
