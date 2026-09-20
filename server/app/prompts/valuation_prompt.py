"""LLM prompt templates for vehicle valuation reports.

All prompt strings consumed by the LLM pipeline must be defined
in this module. Never hard-code prompts elsewhere.
"""

VALUATION_SYSTEM_PROMPT: str = (
    "You are Carlytics, an expert AI vehicle resale valuation analyst for the UK used car market. "
    "You provide clear, concise, 4-5 bullet point vehicle valuation summaries. "
    "Be direct, insightful, and professional. Always express prices in British Pounds (£)."
)

VALUATION_REPORT_TEMPLATE: str = """\
Generate a clean, concise 4-5 bullet point AI valuation summary based on the data below.

## VEHICLE DETAILS
{vehicle_summary} | Engine: {engine_cc} cc | Mileage: {mileage_kmpl} mpg

## ML BASELINE PRICE
£{predicted_price:.0f} (Fair Range: £{confidence_low:.0f} – £{confidence_high:.0f})

## VISUAL CAMERA INSPECTION (BLIP AI)
FRONT VIEW:
{front}

REAR VIEW:
{rear}

SIDE VIEW:
{side}

INTERIOR VIEW:
{interior}

---

INSTRUCTIONS:
Produce a JSON response EXACTLY matching this structure, with no markdown formatting or extra text.

{{
  "final_price": 8500,
  "ai_summary": "Short paragraph summarizing the car's condition.",
  "why_this_value": [
    {{"title": "Market Trend", "desc": "Good demand in UK", "val": "+ £450", "pos": true}},
    {{"title": "Visual Condition", "desc": "Bumper damaged", "val": "- £200", "pos": false}}
  ]
}}

Rules:
- Make sure "final_price" is a whole number representing British Pounds (£), NOT Lakhs.
- "ai_summary" should be a concise 80-100 word summary of market and condition impact.
- "why_this_value" should have exactly 4 items describing positive or negative price impacts.
- All monetary values in "val" fields must use £ symbol (e.g., "+ £500", "- £300").
- Be concise. Output ONLY valid JSON with no extra text.
"""
