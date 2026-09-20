"""Carlytics — FastAPI application entry point.

Provides the application factory, CORS middleware registration,
versioned routing, lifespan startup/shutdown, and global error registration.
"""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.graph import router as graph_router
from app.api.health import router as health_router
from app.api.prediction import router as prediction_router
from app.api.vision import router as vision_router
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging, get_logger
from app.core.settings import get_settings
from app.utils.constants import API_V1_PREFIX

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Application lifespan handler — runs startup and shutdown logic."""
    configure_logging()
    logger.info("Initializing Carlytics Inference Server...")

    # Load ML models and pipelines
    try:
        from app.inference.model_loader import model_loader

        model_loader.load_artifacts()
        logger.info("ML model and artifacts successfully loaded.")
    except Exception as exc:
        logger.warning(
            "Model artifacts could not be loaded: %s. "
            "Server running in degraded mode (mock predictions only).",
            exc,
        )

    # Warm-up the BLIP VQA model in the background immediately at startup.
    # This prevents the first real user request from paying the cold-start penalty
    # (downloading + loading the model can take 30-60s on first run).
    import asyncio
    import threading

    def _warmup_blip() -> None:
        try:
            logger.info("Background warm-up: Loading BLIP VQA model into memory...")
            from app.vision.blip_service import get_blip_service
            get_blip_service()._load_model()
            logger.info("Background warm-up: BLIP VQA model is ready.")
        except Exception as exc:
            logger.warning("Background warm-up: BLIP model could not be preloaded: %s", exc)

    threading.Thread(target=_warmup_blip, daemon=True, name="blip-warmup").start()

    yield

    logger.info("Shutting down Carlytics Inference Server...")



def create_app() -> FastAPI:
    """FastAPI Application Factory."""
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=settings.app_description,
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # ── CORS Middleware ───────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Global Exception Handling ──────────────────────────────────
    register_exception_handlers(app)

    # ── Router Registration ────────────────────────────────────────
    app.include_router(health_router)
    app.include_router(prediction_router, prefix=API_V1_PREFIX)
    app.include_router(graph_router, prefix=API_V1_PREFIX)
    app.include_router(vision_router, prefix=API_V1_PREFIX)

    # ── Mount static files for local uploads ───────────────────────
    import os
    from fastapi.staticfiles import StaticFiles
    os.makedirs("static/uploads", exist_ok=True)
    app.mount("/static", StaticFiles(directory="static"), name="static")

    return app


app = create_app()
