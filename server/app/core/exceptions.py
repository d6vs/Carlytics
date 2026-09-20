"""Global exception definitions and FastAPI exception handlers.

All domain-specific exceptions inherit from CarlyticsException
so they can be handled uniformly at the API boundary.
"""

from typing import Any

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from app.core.logging import get_logger

logger = get_logger(__name__)


# ── Base Exception ───────────────────────────────────────────────


class CarlyticsException(Exception):
    """Base exception for all Carlytics application errors."""

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Any = None,
    ) -> None:
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(self.message)


# ── Domain Exceptions ────────────────────────────────────────────


class ModelNotLoadedError(CarlyticsException):
    """Raised when an ML artifact is not loaded or unavailable."""

    def __init__(self, artifact_name: str) -> None:
        super().__init__(
            message=f"Model artifact not loaded: {artifact_name}",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        )


class PreprocessingError(CarlyticsException):
    """Raised when feature preprocessing fails."""

    def __init__(self, detail: str) -> None:
        super().__init__(
            message=f"Preprocessing failed: {detail}",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )


class PredictionError(CarlyticsException):
    """Raised when model inference fails."""

    def __init__(self, detail: str) -> None:
        super().__init__(
            message=f"Prediction failed: {detail}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


class ImageProcessingError(CarlyticsException):
    """Raised when image captioning or processing fails."""

    def __init__(self, detail: str) -> None:
        super().__init__(
            message=f"Image processing failed: {detail}",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )


class ReportGenerationError(CarlyticsException):
    """Raised when LLM report generation fails."""

    def __init__(self, detail: str) -> None:
        super().__init__(
            message=f"Report generation failed: {detail}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# ── Handler Registration ────────────────────────────────────────


def register_exception_handlers(app: FastAPI) -> None:
    """Register global exception handlers on the FastAPI application.

    Args:
        app: The FastAPI application instance.
    """

    @app.exception_handler(CarlyticsException)
    async def carlytics_exception_handler(
        request: Request, exc: CarlyticsException
    ) -> JSONResponse:
        """Handle all domain-specific Carlytics exceptions."""
        logger.error(
            "CarlyticsException: %s | details=%s", exc.message, exc.details
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.message, "details": exc.details},
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        """Catch-all handler for unexpected errors."""
        logger.exception("Unhandled exception: %s", str(exc))
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "An unexpected internal error occurred.",
                "details": None,
            },
        )
