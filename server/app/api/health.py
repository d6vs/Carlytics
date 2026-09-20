"""Health check router.

Provides system operational and model readiness status.
"""

from fastapi import APIRouter

from app.core.settings import get_settings
from app.inference.model_loader import model_loader
from app.schemas.response import HealthResponse

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Get service health status",
    description="Returns the current service health status and ML model loading state.",
)
async def health_check() -> HealthResponse:
    """Check health and dependencies state of the service."""
    settings = get_settings()
    return HealthResponse(
        status="healthy",
        version=settings.app_version,
        model_loaded=model_loader.is_loaded,
    )
