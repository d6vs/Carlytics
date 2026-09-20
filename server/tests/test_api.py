"""API integration and endpoint verification tests."""

import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture
def client() -> TestClient:
    """Fixture providing a FastAPI TestClient."""
    return TestClient(app)


class TestHealthEndpoint:
    """Test health check routing and output structure."""

    def test_health_check_returns_200(self, client: TestClient) -> None:
        """Endpoint should respond with HTTP 200."""
        response = client.get("/health")
        assert response.status_code == 200

    def test_health_check_payload_structure(self, client: TestClient) -> None:
        """Endpoint should return status, version and model loaded flag."""
        data = response_json = client.get("/health").json()
        assert "status" in data
        assert "version" in data
        assert "model_loaded" in data
        assert data["status"] == "healthy"


class TestPredictionEndpoint:
    """Test prediction API route handling, payload constraints and outputs."""

    @pytest.fixture
    def valid_request_payload(self) -> dict:
        """Provide a valid payload matching Pydantic expectations."""
        return {
            "vehicle": {
                "make": "Toyota",
                "model": "Camry",
                "year": 2020,
                "mileage": 45000.0,
                "fuel_type": "Petrol",
                "transmission": "Automatic",
                "engine_size": 2.5,
                "body_type": "Sedan",
                "colour": "White",
                "doors": 4,
                "seats": 5,
                "owners": 1,
            },
            "generate_report": False,
        }

    def test_predict_returns_200(
        self, client: TestClient, valid_request_payload: dict
    ) -> None:
        """Valid prediction payload should result in 200 OK."""
        response = client.post("/api/v1/predict", json=valid_request_payload)
        assert response.status_code == 200

    def test_predict_response_payload_details(
        self, client: TestClient, valid_request_payload: dict
    ) -> None:
        """Prediction payload should contain expected summary and value format."""
        data = client.post("/api/v1/predict", json=valid_request_payload).json()
        assert "predicted_price" in data
        assert isinstance(data["predicted_price"], float)
        assert "vehicle_summary" in data
        assert "Toyota" in data["vehicle_summary"]
        assert "confidence_band" in data

    def test_predict_validates_required_fields(self, client: TestClient) -> None:
        """Invalid or empty payload structure should cause a 422 validation error."""
        response = client.post("/api/v1/predict", json={"vehicle": {}})
        assert response.status_code == 422
