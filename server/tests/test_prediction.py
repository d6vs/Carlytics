"""Unit tests verifying core prediction domain and validation helpers."""

import pytest

from app.schemas.vehicle import VehicleDetails
from app.utils.helpers import build_vehicle_summary, safe_round


@pytest.fixture
def test_vehicle() -> VehicleDetails:
    """Fixture providing a standard VehicleDetails dataclass instance."""
    return VehicleDetails(
        make="BMW",
        model="3 Series",
        year=2019,
        mileage=62000.0,
        fuel_type="Diesel",
        transmission="Automatic",
        engine_size=2.0,
        body_type="Sedan",
        colour="Black",
        doors=4,
        seats=5,
        owners=2,
    )


class TestHelpers:
    """Verifies that internal logic and validation helpers perform correctly."""

    def test_build_vehicle_summary(self, test_vehicle: VehicleDetails) -> None:
        """Helper should construct a well-formatted descriptive string."""
        summary = build_vehicle_summary(test_vehicle)
        assert "BMW" in summary
        assert "3 Series" in summary
        assert "2019" in summary
        assert "2 owners" in summary

    def test_safe_round_handles_floats(self) -> None:
        """Helper should round standard floats correctly."""
        assert safe_round(15750.456, 2) == 15750.46

    def test_safe_round_handles_invalid_types(self) -> None:
        """Helper should recover from invalid types by returning 0.0."""
        assert safe_round(None) == 0.0  # type: ignore
        assert safe_round("invalid_numeric") == 0.0  # type: ignore


class TestVehicleDetailsValidation:
    """Test constraints validation on Pydantic schemas."""

    def test_valid_instantiation(self, test_vehicle: VehicleDetails) -> None:
        """A valid vehicle parameters set should construct without errors."""
        assert test_vehicle.make == "BMW"

    def test_invalid_year_constraint(self) -> None:
        """Year ranges outside constraints should trigger validation errors."""
        with pytest.raises(Exception):
            VehicleDetails(
                make="BMW",
                model="3 Series",
                year=1800,  # invalid year
                mileage=62000.0,
                fuel_type="Diesel",
                transmission="Automatic",
                engine_size=2.0,
                body_type="Sedan",
                colour="Black",
                doors=4,
                seats=5,
                owners=2,
            )

    def test_negative_mileage_constraint(self) -> None:
        """Negative mileage input should trigger validation errors."""
        with pytest.raises(Exception):
            VehicleDetails(
                make="BMW",
                model="3 Series",
                year=2020,
                mileage=-500.0,  # invalid mileage
                fuel_type="Diesel",
                transmission="Automatic",
                engine_size=2.0,
                body_type="Sedan",
                colour="Black",
                doors=4,
                seats=5,
                owners=2,
            )
