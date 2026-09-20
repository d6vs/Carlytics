import os
import glob
import json
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
RAW_FOLDER = os.path.join(DATA_DIR, "raw")
OUTPUT_FOLDER = os.path.join(DATA_DIR, "processed")
OUTPUT_FILE = "final_dataset.csv"
SCHEMA_PATH = os.path.join(BASE_DIR, "schema_mapping.json")

MASTER_COLUMNS = [
    "car_name",
    "registration_year",
    "insurance_validity",
    "fuel_type",
    "seats",
    "kms_driven",
    "ownsership",
    "transmission",
    "manufacturing_year",
    "mileage(kmpl)",
    "engine(cc)",
    "max_power(bhp)",
    "torque(Nm)",
    "price(in lakhs)"
]

with open(SCHEMA_PATH, encoding="utf-8") as f:
    SCHEMA = json.load(f)


def normalize_column(col):
    return (
        col.lower()
        .replace(" ", "_")
        .replace("-", "_")
        .replace("(", "")
        .replace(")", "")
    )


def map_columns(df):

    rename_dict = {}

    normalized = {
        normalize_column(c): c for c in df.columns
    }

    for master_col, aliases in SCHEMA.items():

        for alias in aliases:

            alias_norm = normalize_column(alias)

            if alias_norm in normalized:

                rename_dict[normalized[alias_norm]] = master_col
                break

    df = df.rename(columns=rename_dict)

    return df


def normalize_fuel(value):

    if pd.isna(value):
        return np.nan

    value = str(value).lower()

    if "electric" in value:
        return "Electric"

    if "hybrid" in value:
        return "Hybrid"

    if "cng" in value and "petrol" in value:
        return "Petrol+CNG"

    if "cng" in value and "diesel" in value:
        return "Diesel+CNG"

    if "cng" == value.strip():
        return "CNG"

    if "lpg" in value:
        return "LPG"

    if "diesel" in value:
        return "Diesel"

    return "Petrol"


def normalize_transmission(value):

    if pd.isna(value):
        return np.nan

    value = str(value).lower()

    automatic_keywords = [
        "automatic",
        "amt",
        "cvt",
        "dct",
        "at",
        "torque converter"
    ]

    for word in automatic_keywords:
        if word in value:
            return "Automatic"

    return "Manual"


def normalize_owner(value):

    if pd.isna(value):
        return np.nan

    value = str(value).lower()

    if "1" in value or "first" in value:
        return "First Owner"

    if "2" in value or "second" in value:
        return "Second Owner"

    if "3" in value or "third" in value:
        return "Third Owner"

    return "Fourth & Above Owner"


def convert_engine(value):

    if pd.isna(value):
        return np.nan

    text = str(value).lower()

    if "l" in text:
        try:
            return float(text.replace("l", "")) * 1000
        except:
            pass

    digits = "".join(ch for ch in text if ch.isdigit() or ch == ".")

    if digits:
        return float(digits)

    return np.nan


def convert_numeric(value):

    if pd.isna(value):
        return np.nan

    digits = "".join(
        c for c in str(value)
        if c.isdigit() or c == "."
    )

    if digits == "":
        return np.nan

    return float(digits)


master = pd.DataFrame(columns=MASTER_COLUMNS)

csv_files = glob.glob(os.path.join(RAW_FOLDER, "*.csv"))

print("=" * 70)
print("Datasets Found:", len(csv_files))
print("=" * 70)

for file in csv_files:

    print(f"\nReading : {os.path.basename(file)}")

    df = pd.read_csv(file)

    df = map_columns(df)

    for col in MASTER_COLUMNS:

        if col not in df.columns:
            df[col] = np.nan

    df = df[MASTER_COLUMNS]

    df["fuel_type"] = df["fuel_type"].apply(normalize_fuel)

    df["transmission"] = df["transmission"].apply(normalize_transmission)

    df["ownsership"] = df["ownsership"].apply(normalize_owner)

    df["engine(cc)"] = df["engine(cc)"].apply(convert_engine)

    numeric_cols = [
        "mileage(kmpl)",
        "kms_driven",
        "max_power(bhp)",
        "torque(Nm)",
        "price(in lakhs)"
    ]

    for col in numeric_cols:
        df[col] = df[col].apply(convert_numeric)

    master = pd.concat([master, df], ignore_index=True)

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

master.to_csv(
    os.path.join(OUTPUT_FOLDER, OUTPUT_FILE),
    index=False
)

print("\nDone!")
print("Rows:", len(master))
print("Columns:", len(master.columns))
print("Saved to:", OUTPUT_FILE)