"""
Pydantic models describing the /api/search request and its intermediate
data structures.
"""
from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    """Incoming payload for POST /api/search."""

    query: str = Field(..., min_length=2, max_length=500, description="The user's research question")


class FollowUpRequest(BaseModel):
    """Incoming payload for POST /api/follow-up (generate follow-up questions)."""

    query: str = Field(..., min_length=2, max_length=500)
    answer: str = Field(default="", max_length=8000)


class QueryAnalysis(BaseModel):
    """Result of analyzing a user's query before searching the web."""

    original_query: str
    search_query: str
    needs_current_info: bool
    suggested_source_count: int
    intent: str
