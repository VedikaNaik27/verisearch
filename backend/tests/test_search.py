"""
Tests for the /api/search endpoint.

External services (search + LLM) are mocked so these tests never require
paid API keys and never make real network calls.
"""
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_search_rejects_empty_query():
    response = client.post("/api/search", json={"query": ""})
    # Pydantic's min_length=2 validation rejects this before it reaches our code.
    assert response.status_code == 422


def test_search_rejects_missing_query_field():
    response = client.post("/api/search", json={})
    assert response.status_code == 422


@patch("services.research_service.settings")
def test_search_returns_warning_when_search_not_configured(mock_settings):
    mock_settings.search_configured.return_value = False
    mock_settings.llm_configured.return_value = False

    response = client.post("/api/search", json={"query": "what is an operating system"})
    assert response.status_code == 200
    data = response.json()
    assert data["warning"] is not None
    assert "TAVILY_API_KEY" in data["warning"]


@patch("services.research_service.get_search_provider")
@patch("services.research_service.settings")
def test_search_handles_no_results_gracefully(mock_settings, mock_get_provider):
    mock_settings.search_configured.return_value = True
    mock_settings.llm_configured.return_value = True
    mock_settings.MAX_SOURCES = 6

    mock_provider = AsyncMock()
    mock_provider.search.return_value = []
    mock_get_provider.return_value = mock_provider

    with patch("services.llm_service.analyze_query", new=AsyncMock(return_value=_fake_analysis())):
        response = client.post("/api/search", json={"query": "a very obscure query"})

    assert response.status_code == 200
    data = response.json()
    assert data["sources"] == []
    assert "No useful sources" in data["answer"]


def _fake_analysis():
    from models.search_models import QueryAnalysis

    return QueryAnalysis(
        original_query="a very obscure query",
        search_query="a very obscure query",
        needs_current_info=False,
        suggested_source_count=4,
        intent="general",
    )
