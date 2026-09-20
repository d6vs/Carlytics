"""BLIP Visual Condition Inspector (Comprehensive BLIP VQA Feature Inspection).

Uses Salesforce/blip-vqa-base (Visual Question Answering) to inspect
vehicle images across 7 critical visual dimensions:

  1. damage          — bodywork damage, dents, crash impacts, or scratches
  2. rust            — rust, corrosion, or paint peeling
  3. bumper          — front bumper, grille, and headlights condition
  4. windshield      — windshield and window glass condition
  5. wheels          — wheels and tires condition
  6. cleanliness     — exterior cleanliness & maintenance level
  7. paint_condition — exterior paint finish quality

100% free local BLIP model. Zero external API calls or LLM dependencies.
"""

from typing import Any, Optional

from PIL import Image

from app.core.exceptions import ImageProcessingError
from app.core.logging import get_logger

logger = get_logger(__name__)

_BLIP_VQA_MODEL_ID = "Salesforce/blip-vqa-base"

VQA_QUESTIONS: dict[str, str] = {
    "damage": "is there any dent, crash, scratch, or body damage on this car?",
    "rust": "is there any rust or paint damage on this car?",
    "bumper": "is the front bumper damaged or intact?",
    "windshield": "is the windshield or window glass cracked or broken?",
    "wheels": "are the tires or wheels damaged or clean?",
    "cleanliness": "is this car clean or dirty?",
    "paint_condition": "is the paint shiny, smooth, or scratched?",
    "condition_vqa": "is this car damaged or clean?",
}

# Module-level singleton — shared by CaptionService AND the startup warm-up
_blip_instance: "BLIPService | None" = None


def get_blip_service() -> "BLIPService":
    """Return the shared BLIPService singleton, creating it on first call."""
    global _blip_instance
    if _blip_instance is None:
        _blip_instance = BLIPService()
    return _blip_instance


class BLIPService:
    """Generates comprehensive visual inspection reports using BLIP VQA."""

    def __init__(self) -> None:
        self._model: Optional[Any] = None
        self._processor: Optional[Any] = None
        self._is_loaded: bool = False

    def _load_model(self) -> None:
        """Lazy-load the BLIP VQA model and processor."""
        if self._is_loaded:
            return

        logger.info("Loading BLIP VQA model (%s)...", _BLIP_VQA_MODEL_ID)

        try:
            from transformers import BlipForQuestionAnswering, BlipProcessor

            self._processor = BlipProcessor.from_pretrained(_BLIP_VQA_MODEL_ID)
            self._model = BlipForQuestionAnswering.from_pretrained(_BLIP_VQA_MODEL_ID)
            self._model.eval()
            self._is_loaded = True
            logger.info("BLIP VQA model loaded successfully.")

        except Exception as exc:
            raise ImageProcessingError(f"Failed to load BLIP VQA model: {exc}") from exc

    def _ask_question(self, image: Image.Image, question: str) -> str:
        """Run a single VQA question pass on the image."""
        import torch

        inputs = self._processor(image, question, return_tensors="pt")

        with torch.no_grad():
            output_ids = self._model.generate(**inputs, max_new_tokens=20)

        answer: str = self._processor.decode(
            output_ids[0], skip_special_tokens=True
        ).strip().lower()
        return answer

    def generate_caption(self, image: Image.Image, prompt: Optional[str] = None) -> str:
        """Generate a natural-language visual description using VQA."""
        report = self.inspect(image)
        return report["summary"]

    def inspect(self, image: Image.Image) -> dict[str, str]:
        """Run comprehensive VQA inspection and return structured visual condition fields.

        Args:
            image: PIL Image pre-processed by ImageProcessor (384x384, RGB).

        Returns:
            Dict containing damage, rust, bumper, windshield, wheels, cleanliness,
            paint_condition, condition, and summary.

        Raises:
            ImageProcessingError: If inspection fails.
        """
        self._load_model()

        try:
            raw_vqa: dict[str, str] = {}
            for field, q in VQA_QUESTIONS.items():
                ans = self._ask_question(image, q)
                raw_vqa[field] = ans
                logger.info("  VQA [%s] -> '%s'", field, ans)

            # Evaluate visual evidence flags
            has_damage = any(
                w in raw_vqa["damage"] for w in ["yes", "dent", "scratch", "damage", "crack", "bent", "crash", "wreck"]
            ) or ("damaged" in raw_vqa["bumper"]) or ("damaged" in raw_vqa["condition_vqa"])

            has_rust = any(
                w in raw_vqa["rust"] for w in ["yes", "rust", "corrosion", "peeling"]
            )

            has_glass_damage = any(
                w in raw_vqa["windshield"] for w in ["yes", "crack", "cracked", "broken"]
            )

            # Formulate human-readable inspection statements
            damage_text = (
                "Visible bodywork damage, dent, or scratch detected on the vehicle."
                if has_damage
                else "No visible bodywork damage or dents detected."
            )

            rust_text = (
                "Rust or paint corrosion visible on body panels."
                if has_rust
                else "No rust or paint corrosion visible."
            )

            bumper_text = (
                "Front bumper or headlights show signs of wear/damage."
                if "damaged" in raw_vqa["bumper"]
                else "Front bumper, grille, and headlights appear intact."
            )

            windshield_text = (
                "Windshield or window glass appears cracked/damaged."
                if has_glass_damage
                else "Windshield and window glass appear intact."
            )

            wheels_text = (
                "Tires and wheels show signs of wear/damage."
                if "damaged" in raw_vqa["wheels"]
                else "Wheels and tires appear in good condition."
            )

            cleanliness_text = (
                "Exterior appears dirty or dusty."
                if "dirty" in raw_vqa["cleanliness"]
                else "Exterior appears clean and well maintained."
            )

            paint_text = (
                "Exterior paint finish appears smooth and intact."
                if any(w in raw_vqa["paint_condition"] for w in ["shiny", "smooth", "good", "clean"])
                else "Exterior paint finish shows signs of surface wear."
            )

            # Dynamically derive condition rating
            if has_damage and (has_rust or has_glass_damage):
                condition = "Poor"
            elif has_damage:
                is_severe = any(w in raw_vqa["damage"] for w in ["crash", "wreck", "bent", "yes"])
                condition = "Poor" if is_severe else "Fair"
            elif has_rust or has_glass_damage:
                condition = "Fair"
            else:
                condition = "Excellent" if "clean" in raw_vqa["condition_vqa"] or "new" in raw_vqa["bumper"] else "Good"

            summary = (
                f"Overall condition: {condition}. "
                f"{damage_text} {rust_text} {bumper_text} {windshield_text} {cleanliness_text}"
            )

            results = {
                "damage": damage_text,
                "rust": rust_text,
                "bumper": bumper_text,
                "windshield": windshield_text,
                "wheels": wheels_text,
                "cleanliness": cleanliness_text,
                "paint_condition": paint_text,
                "condition": condition,
                "summary": summary,
            }

            logger.info("Comprehensive BLIP VQA inspection complete: %s", results)
            return results

        except Exception as exc:
            logger.exception("BLIP VQA inspection failed.")
            raise ImageProcessingError(f"BLIP VQA inspection error: {exc}") from exc
