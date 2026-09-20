"""
Basic tests for the health endpoint. Run with: pytest
"""
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_check_returns_ok():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "search_configured" in data
    assert "llm_configured" in data


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
