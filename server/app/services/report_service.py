"""Valuation report generation service.

Auto-selects between the Cerebras SDK and a generic OpenAI-compatible
client based on the configured LLM_BASE_URL, so switching providers
is purely a .env change with no code edits required.
"""

import re
import json
from typing import Any, Optional

from app.core.logging import get_logger
from app.core.settings import get_settings

logger = get_logger(__name__)


class ReportService:
    """Generates AI-powered valuation reports using the configured LLM provider."""

    def generate(self, context: dict[str, Any]) -> dict[str, Any]:
        """Invoke the configured LLM to produce a valuation report.

        Args:
            context: Dict containing system_prompt and user_prompt strings.

        Returns:
            Dict containing:
                - report_text (Optional[dict])
                - adjusted_price (Optional[float])
        """
        settings = get_settings()

        api_key = settings.llm_api_key
        if not api_key:
            logger.warning("LLM_API_KEY is not set — skipping LLM report generation.")
            return {"report_text": None, "adjusted_price": None}

        system_prompt = context.get("system_prompt", "")
        user_prompt = context.get("user_prompt", "")

        # Auto-detect provider from base URL
        base_url_lower = (settings.llm_base_url or "").lower()
        is_cerebras = "cerebras" in base_url_lower
        is_google = "googleapis" in base_url_lower

        try:
            if is_cerebras:
                from cerebras.cloud.sdk import Cerebras
                client = Cerebras(api_key=api_key)
                provider_name = "Cerebras"
            else:
                from openai import OpenAI
                client = OpenAI(base_url=settings.llm_base_url, api_key=api_key)
                provider_name = "Gemini" if is_google else "OpenRouter"

            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ]

            logger.info("Invoking %s LLM (%s)...", provider_name, settings.llm_model)

            create_kwargs: dict[str, Any] = dict(
                model=settings.llm_model,
                messages=messages,
                temperature=settings.llm_temperature,
            )
            # json_object mode is supported by OpenRouter but not Cerebras
            if not is_cerebras:
                create_kwargs["response_format"] = {"type": "json_object"}

            response = client.chat.completions.create(**create_kwargs)

            assistant_msg = response.choices[0].message
            content = (assistant_msg.content or "").strip()

            # Attempt to parse JSON (handle markdown-wrapped responses)
            try:
                json_match = re.search(r"\{.*\}", content, re.DOTALL)
                if json_match:
                    content = json_match.group(0)

                report_data = json.loads(content)
                adjusted_price = report_data.get("final_price")
                logger.info("%s LLM report generation successful. Adjusted price: %s", provider_name, adjusted_price)
                return {
                    "report_text": report_data,
                    "adjusted_price": adjusted_price,
                }
            except json.JSONDecodeError as exc:
                logger.error("Failed to decode JSON from LLM: %s\nContent: %s", exc, content)
                return {"report_text": None, "adjusted_price": None}

        except Exception as exc:
            logger.exception("LLM report generation failed: %s", exc)
            return {"report_text": None, "adjusted_price": None}
