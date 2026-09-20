"""Vehicle intelligence agent — assembles context for LLM report generation.

Combines vehicle details, predicted price, and 7-dimension BLIP
visual inspection report into a structured prompt context for LLM consumption.
"""

from typing import Any

from app.core.logging import get_logger
from app.prompts.valuation_prompt import (
    VALUATION_REPORT_TEMPLATE,
    VALUATION_SYSTEM_PROMPT,
)
from app.schemas.vehicle import VehicleDetails

logger = get_logger(__name__)

# Approximate conversion rate: 1 Indian Lakh (INR 1,00,000) → GBP
# Based on 1 INR ≈ £0.00955, so 1 Lakh ≈ £955
_LAKH_TO_GBP: float = 955.0


class VehicleIntelligenceAgent:
    """Prepares structured context for downstream LLM report generation."""

    def build_context(
        self,
        vehicle: VehicleDetails,
        vehicle_summary: str,
        predicted_price: float,
        confidence_low: float,
        confidence_high: float,
        visual_report: dict[str, str],
    ) -> dict[str, Any]:
        """Assemble all analysis results into a rendered prompt context.

        Args:
            vehicle: Raw VehicleDetails model instance.
            vehicle_summary: Human-readable vehicle summary string.
            predicted_price: ML predicted resale value in Lakhs (INR).
            confidence_low: Lower bound of confidence interval (90%).
            confidence_high: Upper bound of confidence interval (110%).
            visual_report: 7-dimension BLIP VQA inspection report dict.

        Returns:
            Dict containing system_prompt, user_prompt, and metadata.
        """
        logger.info("Building intelligence context for LLM valuation report.")

        # Convert from Indian Lakhs (INR) → British Pounds (GBP) for UK market display
        price_gbp = round(predicted_price * _LAKH_TO_GBP)
        low_gbp = round(confidence_low * _LAKH_TO_GBP)
        high_gbp = round(confidence_high * _LAKH_TO_GBP)

        logger.info(
            "Price conversion: %.2f Lakhs → £%d (low: £%d, high: £%d)",
            predicted_price, price_gbp, low_gbp, high_gbp,
        )

        user_prompt = VALUATION_REPORT_TEMPLATE.format(
            vehicle_summary=vehicle_summary,
            engine_cc=vehicle.engine_cc,
            mileage_kmpl=vehicle.mileage_kmpl,
            seats=vehicle.seats,
            predicted_price=price_gbp,
            confidence_low=low_gbp,
            confidence_high=high_gbp,
            front=visual_report.get("front", "No issues observed."),
            rear=visual_report.get("rear", "No issues observed."),
            side=visual_report.get("side", "No issues observed."),
            interior=visual_report.get("interior", "Clean and well maintained."),
        )

        return {
            "system_prompt": VALUATION_SYSTEM_PROMPT,
            "user_prompt": user_prompt,
        }
