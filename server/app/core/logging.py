"""Centralised logging configuration.

Provides structured logging with a consistent format across
all application modules.
"""

import logging
import sys

from app.core.settings import get_settings


def configure_logging() -> None:
    """Configure application-wide logging with a structured format.

    Should be called once during application startup.
    """
    settings = get_settings()

    log_format = (
        "%(asctime)s | %(levelname)-8s | "
        "%(name)s:%(funcName)s:%(lineno)d | %(message)s"
    )

    logging.basicConfig(
        level=getattr(logging, settings.log_level.upper(), logging.INFO),
        format=log_format,
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True,
    )

    # Suppress noisy third-party loggers
    for logger_name in ("uvicorn.access", "httpx", "httpcore"):
        logging.getLogger(logger_name).setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Return a named logger instance.

    Args:
        name: Logger name, typically ``__name__`` of the calling module.

    Returns:
        Configured logger instance.
    """
    return logging.getLogger(name)
