"""General-purpose helper utilities."""

from datetime import datetime, timezone

from app.schemas.vehicle import VehicleDetails


def build_vehicle_summary(vehicle: VehicleDetails) -> str:
    """Construct a human-readable one-line vehicle summary.

    Args:
        vehicle: Validated vehicle details.

    Returns:
        Formatted summary string.
    """
    return (
        f"{vehicle.registration_year} {vehicle.make} {vehicle.model} | "
        f"{vehicle.fuel_type} {vehicle.transmission} | "
        f"{vehicle.kms_driven:,.0f} km | "
        f"{vehicle.ownsership}"
    )


def current_iso_timestamp() -> str:
    """Return the current UTC timestamp in ISO 8601 format.

    Returns:
        ISO-formatted UTC timestamp string.
    """
    return datetime.now(timezone.utc).isoformat()


def safe_round(value: float, decimals: int = 2) -> float:
    """Round a numeric value safely, returning 0.0 on failure.

    Args:
        value: The number to round.
        decimals: Number of decimal places.

    Returns:
        Rounded float, or 0.0 if the input is invalid.
    """
    try:
        return round(float(value), decimals)
    except (TypeError, ValueError):
        return 0.0
