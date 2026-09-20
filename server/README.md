# Carlytics — AI-Based Vehicle Resale Intelligence Backend

This repository contains the production-grade backend architecture for **Carlytics**, an AI-Based Vehicle Resale Intelligence platform.

---

## 📌 Architecture Overview

Carlytics predictions are generated using a supervised Machine Learning model (SVR) and AI computer vision:
1. **Machine Learning (ML) Prediction** (scikit-learn SVR Pipeline predicting in INR Lakhs)
2. **Computer Vision (CV)** (Salesforce BLIP VQA local 7-dimension image inspection)
3. **Workflow Orchestration** (Valuation State Graph workflow runner)
4. **Large Language Models (LLM)** (OpenRouter AI Valuation Report & Price Refinement)

---

## 🚀 Quick Start — Running the Server

### Windows:
```cmd
run.bat
```

### Linux / Mac:
```bash
chmod +x run.sh
./run.sh
```

### Or Manually:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🌐 API Documentation & Interactive Docs

Once the server is running:
- **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 📡 Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server and ML model health check |
| `POST` | `/api/v1/predict` | Fast path: ML price + 7-dim BLIP visual inspection |
| `POST` | `/api/v1/analyse` | Full state graph: ML price + BLIP visual + OpenRouter LLM report + adjusted price |
| `POST` | `/api/v1/vision/inspect` | Standalone multipart car image upload visual inspection |

---

## 📂 Project Structure

```
backend/
├── app/
│   ├── api/             # FastAPI routers (health, predict, graph, vision)
│   ├── graph/           # Valuation state graph workflow orchestration
│   ├── agents/          # AI Agent context assemblers
│   ├── services/        # Business layer (prediction, caption, report)
│   ├── inference/       # Sklearn ML model pipeline loader and preprocessor
│   ├── vision/          # Computer vision (BLIP VQA) services
│   ├── prompts/         # LLM prompt templates
│   ├── schemas/         # Pydantic v2 request and response models
│   ├── utils/           # Shared helper functions and constants
│   └── core/            # Logging, settings configuration, and exceptions
├── data/
├── trained_models/      # Scikit-learn trained pipeline artifacts (pipeline.pkl, best_model.pkl)
├── .env                 # Environment variables (OpenRouter API key & configuration)
├── run.bat              # 1-click launch script for Windows
├── run.sh               # 1-click launch script for Linux/Mac
├── main.py              # Application factory entry point
└── README.md
```
