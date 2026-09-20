# Carlytics — AI-Based Vehicle Resale Intelligence

**Carlytics** is an AI-powered vehicle resale intelligence system designed to improve the accuracy and transparency of vehicle resale valuation in the UK market. By integrating structured tabular vehicle attributes with 4-perspective computer vision analysis, Carlytics eliminates valuation subjectivities and generates explainable appraisal reports.

---

## 🏗️ System Architecture

<img width="1422" height="702" alt="Image" src="https://github.com/user-attachments/assets/6bb81751-eb19-4f86-9db5-e71d006688a9" />

### End-to-End Workflow & Pipeline Nodes

1. **Client Request**: The Next.js frontend sends vehicle details and multi-angle images to the FastAPI server endpoint (`POST /api/v1/predict`).
2. **Prediction Node**: A serialized `scikit-learn` Support Vector Regression (SVR) pipeline predicts the baseline resale price based on vehicle attributes.
3. **Explainability Node**: Computes **SHAP** (SHapley Additive exPlanations) values to extract the top positive and negative price-influencing factors.
4. **Captioning Node**: A **Salesforce BLIP** Visual Question Answering (VQA) model via Hugging Face Transformers analyzes front, rear, side, and interior exterior photos to detect cosmetic damage.
5. **Vehicle Intelligence Node**: Combines predicted baseline price, SHAP feature impact, and BLIP visual inspection output into a structured prompt for the LLM.
6. **LLM Analysis Node**: Processes the combined inputs within a **LangGraph** deterministic state graph to generate human-readable valuation reasoning.
7. **Final Report Node**: Delivers a comprehensive valuation report containing market value, confidence band (±10%), condition breakdown, and explainable AI summary.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend API**: FastAPI, Pydantic, Uvicorn
- **Machine Learning & Analytics**: scikit-learn, pandas, NumPy, MLflow, SHAP, matplotlib
- **Computer Vision & AI**: Salesforce BLIP (Hugging Face Transformers), LangGraph

---

## 📁 Repository Structure

```
Carlytics/
├── client/                     # Next.js 14 Frontend Application
│   ├── public/                 # Static assets & vehicle catalogue JSON
│   ├── src/                    # Application source code
│   │   ├── app/                # Next.js App Router pages (valuate, result)
│   │   ├── components/         # UI components, layout, and wizard steps
│   │   └── lib/                # API clients, store, and utilities
│   ├── package.json
│   └── tsconfig.json
├── server/                     # FastAPI Backend Microservice
│   ├── app/                    # FastAPI application & LangGraph pipeline
│   │   ├── agents/             # Vehicle intelligence agent
│   │   ├── api/                # REST API endpoints (predict, vision, graph)
│   │   ├── graph/              # LangGraph nodes, state, and workflow builder
│   │   ├── inference/          # Scikit-learn SVR predictor & preprocessor
│   │   ├── services/           # Prediction, BLIP captioning & report services
│   │   └── vision/             # BLIP VQA model service & image processor
│   ├── data/                   # Raw & processed UK automotive datasets
│   ├── trained_models/         # Serialized SVR pipeline & encoders (.pkl)
│   ├── training/               # Model evaluation notebooks & MLflow artifacts
│   ├── run.bat                 # Windows execution script
│   ├── run.sh                  # macOS / Linux execution script
│   ├── main.py                 # FastAPI server entry point
│   └── requirements.txt        # Python dependencies
├── docs/                       # System documentation & diagrams
│   └── assets/
│       └── system_architecture.png
└── README.md                   # Project documentation
```

---

## 🚀 How to Run

### 1. Backend Setup (`server`)

Navigate to the `server` directory and run the startup script for your operating system:

#### **Windows**
```cmd
cd server
run.bat
```

#### **macOS / Linux**
```bash
cd server
chmod +x run.sh
./run.sh
```

*The FastAPI server will start automatically at `http://localhost:8000` (Interactive API docs available at `http://localhost:8000/docs`).*

---

### 2. Frontend Setup (`client`)

Open a new terminal, navigate to the `client` directory, install dependencies, and start the development server:

```bash
cd client
npm install
npm run dev
```
-
