"""API request schemas."""

from pydantic import BaseModel, Field

from app.schemas.vehicle import VehicleDetails


class PredictionRequest(BaseModel):
    """Incoming prediction request payload.

    Image URL is required — visual condition assessment via BLIP
    is a core part of every valuation, not an optional add-on.
    """

    vehicle: VehicleDetails
    images: list[str] = Field(
        ...,
        description="List of exactly 4 image URLs: [Front, Rear, Side, Interior]",
        min_length=4,
        max_length=4,
    )
    generate_report: bool = Field(
        False,
        description="Whether to generate a full AI valuation report",
    )
