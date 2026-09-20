"""Application settings and environment configuration.

Loads configuration from environment variables and .env file
using pydantic-settings. Provides a cached singleton accessor.
"""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralised application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ── Application ──────────────────────────────────────────
    app_name: str = "Carlytics"
    app_version: str = "1.0.0"
    app_description: str = "AI-Based Vehicle Resale Intelligence"
    debug: bool = False

    # ── Server ───────────────────────────────────────────────
    host: str = "0.0.0.0"
    port: int = 8000

    # ── CORS ─────────────────────────────────────────────────
    cors_origins: list[str] = ["*"]

    # ── Paths ────────────────────────────────────────────────
    base_dir: Path = Path(__file__).resolve().parent.parent.parent
    model_dir: Path = base_dir / "trained_models"
    data_dir: Path = base_dir / "data"

    # ── Model Artifacts ──────────────────────────────────────────
    pipeline_path: str = "trained_models/pipeline.pkl"       # Primary — full sklearn pipeline
    model_path: str = "trained_models/best_model.pkl"        # Standalone SVR model
    preprocessor_path: str = "trained_models/preprocessor.pkl"
    encoder_path: str = "trained_models/encoder.pkl"
    scaler_path: str = "trained_models/scaler.pkl"
    shap_explainer_path: str = "trained_models/shap_explainer.pkl"

    # ── LLM Configuration ──────────────────────────────────────────
    llm_api_key: str = ""
    llm_base_url: str = "https://api.cerebras.ai/v1"
    llm_model: str = "gpt-oss-120b"
    llm_temperature: float = 0.3

    # ── Logging ──────────────────────────────────────────────
    log_level: str = "INFO"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached application settings singleton."""
    return Settings()
