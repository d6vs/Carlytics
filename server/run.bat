@echo off
REM Run script for development mode (Windows)
REM Uses uv to manage environment automatically

setlocal enabledelayedexpansion
set PYTHONUNBUFFERED=1

echo ===================================================
echo   Installing dependencies with uv...
echo ===================================================
uv sync

echo ===================================================
echo   Starting Carlytics Backend Server (FastAPI)...
echo   API Docs: http://localhost:8000/docs
echo ===================================================
uv run python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

pause
