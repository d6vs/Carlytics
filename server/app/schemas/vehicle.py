"""Vehicle domain models.

Defines the core vehicle attributes used across the application
for prediction, explainability, and report generation.

These fields exactly match the training features used in model.ipynb:
    make, model, registration_year, fuel_type, transmission,
    ownsership, kms_driven, seats, mileage(kmpl), engine(cc)
"""

from pydantic import BaseModel, Field


class VehicleDetails(BaseModel):
    """Core vehicle attributes submitted for valuation.

    All 10 fields correspond directly to the columns the ML pipeline
    was trained on. Python-safe field names (mileage_kmpl, engine_cc)
    are mapped to their training column equivalents
    (mileage(kmpl), engine(cc)) inside the preprocessor.
    """

    make: str = Field(
        ...,
        description="Vehicle manufacturer / brand",
        examples=["Maruti Suzuki"],
    )
    model: str = Field(
        ...,
        description="Vehicle model name",
        examples=["Swift"],
    )
    registration_year: int = Field(
        ...,
        ge=1980,
        le=2026,
        description="Year the vehicle was registered",
        examples=[2018],
    )
    fuel_type: str = Field(
        ...,
        description="Fuel type: Petrol, Diesel, Electric, CNG, Hybrid",
        examples=["Petrol"],
    )
    transmission: str = Field(
        ...,
        description="Transmission type: Manual or Automatic",
        examples=["Manual"],
    )
    ownsership: str = Field(
        ...,
        description="Ownership history: First Owner, Second Owner, Third Owner",
        examples=["First Owner"],
    )
    kms_driven: float = Field(
        ...,
        ge=0,
        description="Total kilometres driven (odometer reading)",
        examples=[45000.0],
    )
    seats: int = Field(
        ...,
        ge=1,
        le=12,
        description="Number of seats in the vehicle",
        examples=[5],
    )
    mileage_kmpl: float = Field(
        ...,
        gt=0,
        description="Fuel efficiency in kilometres per litre (maps to mileage(kmpl))",
        examples=[18.9],
    )
    engine_cc: float = Field(
        ...,
        gt=0,
        description="Engine displacement in cubic centimetres (maps to engine(cc))",
        examples=[1197.0],
    )

    model_config = {"str_strip_whitespace": True}
