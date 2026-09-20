"""Application configuration entrypoint.

Exposes the global settings object and application configuration helpers.
"""

from app.core.settings import get_settings

settings = get_settings()

__all__ = ["settings"]
