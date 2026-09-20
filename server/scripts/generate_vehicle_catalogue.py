"""
Carlytics Vehicle Catalogue Generator
======================================
Generates public/data/vehicle-catalogue.json from final_dataset.csv
using the EXACT same make/model parsing logic as model.ipynb.

Usage:
    python scripts/generate_vehicle_catalogue.py

Output:
    ../client/public/data/vehicle-catalogue.json
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime

try:
    import pandas as pd
except ImportError:
    print("ERROR: pandas not installed. Run: pip install pandas")
    sys.exit(1)

# ── Exact KNOWN_BRANDS list from model.ipynb ──────────────────────────────────
KNOWN_BRANDS = [
    "Maruti Suzuki", "Mercedes-Benz", "Land Rover", "Rolls Royce",
    "Aston Martin", "Alfa Romeo", "Force Motors", "MG", "BMW",
    "Audi", "Volkswagen", "Toyota", "Honda", "Hyundai", "Kia",
    "Tata", "Mahindra", "Nissan", "Ford", "Renault", "Skoda",
    "Jeep", "Volvo", "Porsche", "Jaguar", "Lexus", "Mini",
    "Mitsubishi", "Fiat", "Datsun", "Citroen", "BYD", "Isuzu",
]

# Always match the longest brand name first (exact logic from model.ipynb)
KNOWN_BRANDS_SORTED = sorted(KNOWN_BRANDS, key=len, reverse=True)


def parse_make_model(car_name: str) -> tuple[str, str]:
    """
    Exact replica of parse_make_model() from model.ipynb.
    Strips leading year, matches brand, returns (make, model).
    """
    car_name = str(car_name).strip()
    # Strip leading 4-digit year if present
    car_name_clean = re.sub(r"^\d{4}\s+", "", car_name)

    matched_brand = None
    for brand in KNOWN_BRANDS_SORTED:
        if car_name_clean.lower().startswith(brand.lower()):
            matched_brand = brand
            break

    if matched_brand:
        make = matched_brand
        remaining = car_name_clean[len(matched_brand):].strip()
    else:
        parts = car_name_clean.split()
        make = parts[0] if parts else "Unknown"
        remaining = " ".join(parts[1:]) if len(parts) > 1 else ""

    model_parts = remaining.split()
    model = model_parts[0] if model_parts else "Unknown"

    return make, model


def generate_catalogue(
    csv_path: Path,
    output_path: Path,
) -> dict:
    print(f"\nCarlytics Vehicle Catalogue Generator")
    print("=" * 50)
    print(f"Reading: {csv_path}")

    df = pd.read_csv(csv_path)
    print(f"Rows loaded: {len(df):,}")

    # Drop rows missing car_name or registration_year
    df = df.dropna(subset=["car_name", "registration_year"])
    print(f"Rows after dropna: {len(df):,}")

    # Parse make and model using exact notebook logic
    parsed = df["car_name"].apply(lambda x: parse_make_model(x))
    df["make"] = parsed.apply(lambda x: x[0])
    df["model"] = parsed.apply(lambda x: x[1])

    # Coerce registration_year to int (it's stored as string in the CSV)
    df["registration_year"] = pd.to_numeric(
        df["registration_year"], errors="coerce"
    )
    df = df.dropna(subset=["registration_year"])
    df["registration_year"] = df["registration_year"].astype(int)

    # Remove unknowns
    df = df[df["make"] != "Unknown"]
    df = df[df["model"] != "Unknown"]
    df = df[df["make"].str.strip() != ""]
    df = df[df["model"].str.strip() != ""]

    # Deduplicate year + make + model combinations
    df_unique = (
        df[["registration_year", "make", "model"]]
        .drop_duplicates()
        .sort_values(["registration_year", "make", "model"])
    )

    print(f"Unique year/make/model combos: {len(df_unique):,}")

    # Build catalogue structure
    years_dict: dict[int, dict[str, list[str]]] = {}
    for _, row in df_unique.iterrows():
        year = int(row["registration_year"])
        make = row["make"]
        model = row["model"]
        if year not in years_dict:
            years_dict[year] = {}
        if make not in years_dict[year]:
            years_dict[year][make] = []
        if model not in years_dict[year][make]:
            years_dict[year][make].append(model)

    # Sort: years descending, makes & models alphabetically
    years_list = []
    for year in sorted(years_dict.keys(), reverse=True):
        makes_list = []
        for make in sorted(years_dict[year].keys()):
            models_sorted = sorted(years_dict[year][make])
            makes_list.append({"make": make, "models": models_sorted})
        years_list.append({"year": year, "makes": makes_list})

    catalogue = {
        "version": "1.0",
        "source": "final_dataset.csv",
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "total_combinations": len(df_unique),
        "years": years_list,
    }

    # Write output
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(catalogue, f, indent=2, ensure_ascii=False)

    print(f"\nCatalogue saved to: {output_path}")
    print(f"Years: {len(years_list)}")
    unique_makes = {m['make'] for y in years_list for m in y['makes']}
    unique_models = {mdl for y in years_list for m in y['makes'] for mdl in m['models']}
    print(f"Unique makes: {len(unique_makes)}")
    print(f"Unique models: {len(unique_models)}")

    return catalogue


if __name__ == "__main__":
    ROOT = Path(__file__).parent.parent
    CSV_PATH = ROOT / "data" / "raw" / "final_dataset.csv"
    OUTPUT_PATH = ROOT.parent / "client" / "public" / "data" / "vehicle-catalogue.json"

    if not CSV_PATH.exists():
        print(f"ERROR: Dataset not found at {CSV_PATH}")
        sys.exit(1)

    generate_catalogue(CSV_PATH, OUTPUT_PATH)
    print("\nDone!")
