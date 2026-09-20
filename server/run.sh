#!/bin/bash
# Run script for development mode

export PYTHONUNBUFFERED=1

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Install/update dependencies using uv
echo "Installing dependencies with uv..."
uv sync

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Run the application
echo "Starting Carlytics Backend Server..."
echo "API Docs: http://localhost:8000/docs"
uv run python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
