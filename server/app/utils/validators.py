"""Custom validation utilities for domain-specific constraints."""

from app.utils.constants import BODY_TYPES, FUEL_TYPES, TRANSMISSION_TYPES


def validate_fuel_type(value: str) -> bool:
    """Check whether the provided fuel type is supported.

    Args:
        value: Fuel type string to validate.

    Returns:
        True if valid, False otherwise.
    """
    return value in FUEL_TYPES


def validate_transmission(value: str) -> bool:
    """Check whether the provided transmission type is supported.

    Args:
        value: Transmission type string to validate.

    Returns:
        True if valid, False otherwise.
    """
    return value in TRANSMISSION_TYPES


def validate_body_type(value: str) -> bool:
    """Check whether the provided body type is supported.

    Args:
        value: Body type string to validate.

    Returns:
        True if valid, False otherwise.
    """
    return value in BODY_TYPES
