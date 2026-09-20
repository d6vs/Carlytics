"""LangGraph state definition for the valuation workflow.

Defines the typed state container that flows through each node
in the 3-node LangGraph pipeline:
    predict_price -> inspect_image -> generate_report
"""

from dataclasses import dataclass, field
from typing import Any, Optional


@dataclass
class ValuationState:
    """Typed state passed through each node of the LangGraph workflow."""

    # ── Input Data ───────────────────────────────────────────
    vehicle_data: dict[str, Any] = field(default_factory=dict)
    images: Optional[list[str]] = None
    generate_report: bool = False

    # ── Node 1: Price Prediction ──────────────────────────────
    predicted_price: Optional[float] = None
    confidence_low: Optional[float] = None
    confidence_high: Optional[float] = None
    vehicle_summary: Optional[str] = None

    # ── Node 2: BLIP Visual Inspection ───────────────────────
    visual_report: Optional[dict[str, str]] = None

    # ── Node 3: LLM Valuation Report ─────────────────────────
    analysis_context: Optional[dict[str, Any]] = None
    valuation_report: Optional[dict[str, Any]] = None
    adjusted_price: Optional[float] = None

    # ── Pipeline Metadata ────────────────────────────────────
    errors: list[str] = field(default_factory=list)
