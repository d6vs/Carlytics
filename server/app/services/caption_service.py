"""Caption generation business service.

Orchestrates ImageProcessor and BLIPService to generate structured
multi-aspect visual inspection reports using pure local BLIP.
"""

from app.core.logging import get_logger
from app.vision.blip_service import get_blip_service
from app.vision.image_processor import ImageProcessor

logger = get_logger(__name__)


class CaptionService:
    """Business service for vehicle image visual inspection."""

    def __init__(self) -> None:
        self._processor = ImageProcessor()
        self._blip = get_blip_service()

    def inspect_from_urls(self, image_urls: list[str]) -> dict[str, str]:
        """Download images and generate captions for exactly 4 views.

        Args:
            image_urls: List of exactly 4 public URLs [Front, Rear, Side, Interior].

        Returns:
            Dict mapping view names to their captions.
        """
        logger.info("CaptionService: inspecting %d images", len(image_urls))
        if not image_urls or len(image_urls) != 4:
            raise ValueError(f"Expected exactly 4 images, got {len(image_urls) if image_urls else 0}")
            
        import concurrent.futures

        views = ["front", "rear", "side", "interior"]
        results = {}
        
        def process_view(view: str, url: str) -> tuple[str, str]:
            try:
                pil_image = self._processor.load_from_url(url)
                caption = self._blip.generate_caption(pil_image)
                return view, caption
            except Exception as exc:
                logger.error("Failed to inspect %s view: %s", view, exc)
                return view, f"Inspection failed: {exc}"

        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
            future_to_view = {
                executor.submit(process_view, view, url): view 
                for view, url in zip(views, image_urls)
            }
            for future in concurrent.futures.as_completed(future_to_view):
                view = future_to_view[future]
                try:
                    v, caption = future.result()
                    results[v] = caption
                except Exception as exc:
                    results[view] = f"Inspection failed: {exc}"
                
        return results
