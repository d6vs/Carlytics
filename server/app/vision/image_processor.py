"""Image pre-processing utilities for the BLIP vision pipeline.

Handles image loading from URL or raw bytes, validation, and
resizing to the 384×384 input format expected by BLIP VQA.
"""

import io
import os
from typing import Union

import requests
from PIL import Image

from app.core.exceptions import ImageProcessingError
from app.core.logging import get_logger

logger = get_logger(__name__)

# BLIP VQA expected input dimensions
_BLIP_IMAGE_SIZE = (384, 384)

# Permitted image MIME types
_ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}

_DEFAULT_HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}


from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter

class ImageProcessor:
    """Handles image loading, validation, and preparation for BLIP."""

    def __init__(self):
        self._session = requests.Session()
        retry_strategy = Retry(
            total=2,
            connect=2,
            read=0,
            backoff_factor=0.5,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self._session.mount("http://", adapter)
        self._session.mount("https://", adapter)
        self._session.headers.update(_DEFAULT_HEADERS)

    def load_from_url(self, image_url: str) -> Image.Image:
        """Download an image from a URL and prepare it for BLIP.

        Args:
            image_url: Publicly accessible URL of the vehicle image.

        Returns:
            PIL Image resized to 384×384 in RGB mode.

        Raises:
            ImageProcessingError: If the download or validation fails.
        """
        try:
            logger.info("Fetching image from URL: %s", image_url)
            
            # Local disk read optimization
            if "/static/uploads/" in image_url:
                filename = image_url.split("/static/uploads/")[-1]
                local_path = os.path.join("static", "uploads", filename)
                logger.info("Local image path detected: %s. Loading directly from disk.", local_path)
                try:
                    with open(local_path, "rb") as f:
                        content = f.read()
                    return self._process(content)
                except Exception as disk_err:
                    logger.warning("Failed to read local path directly (%s), falling back to HTTP request.", disk_err)

            response = self._session.get(image_url, timeout=5)
            response.raise_for_status()
            return self._process(response.content)
        except Exception as exc:
            raise ImageProcessingError(
                f"Failed to load image from {image_url}: {exc}"
            ) from exc

    def load_from_bytes(self, raw_bytes: bytes) -> Image.Image:
        """Prepare a vehicle image from raw bytes for BLIP.

        Args:
            raw_bytes: Raw image content (from multipart upload).

        Returns:
            PIL Image resized to 384×384 in RGB mode.

        Raises:
            ImageProcessingError: If the bytes cannot be parsed or validated.
        """
        return self._process(raw_bytes)

    def _process(self, raw_bytes: bytes) -> Image.Image:
        """Internal: validate format, convert to RGB, and resize.

        Args:
            raw_bytes: Raw image bytes.

        Returns:
            Validated, resized PIL Image in RGB mode.

        Raises:
            ImageProcessingError: If format is unsupported.
        """
        try:
            img = Image.open(io.BytesIO(raw_bytes))

            if img.format not in _ALLOWED_FORMATS:
                raise ImageProcessingError(
                    f"Unsupported image format: {img.format}. "
                    f"Allowed: {', '.join(_ALLOWED_FORMATS)}"
                )

            # Ensure RGB — drop alpha channel if present (PNG RGBA)
            if img.mode != "RGB":
                img = img.convert("RGB")

            # Resize to BLIP's expected input size
            img = img.resize(_BLIP_IMAGE_SIZE, Image.LANCZOS)

            logger.info(
                "Image processed successfully — size: %s, mode: %s",
                img.size,
                img.mode,
            )
            return img

        except ImageProcessingError:
            raise
        except Exception as exc:
            raise ImageProcessingError(
                f"Failed to decode or process image: {exc}"
            ) from exc
