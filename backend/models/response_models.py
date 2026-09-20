"""
Pydantic models describing API responses returned to the frontend.
"""
from typing import List, Optional
from pydantic import BaseModel


class Source(BaseModel):
    """A single web source used to build the answer."""

    title: str
    url: str
    domain: str
    snippet: str = ""
    published_date: Optional[str] = None


class SearchResponse(BaseModel):
    """Response returned by POST /api/search."""

    query: str
    answer: str
    sources: List[Source] = []
    research_steps: List[str] = []
    follow_up_questions: List[str] = []
    warning: Optional[str] = None


class FollowUpResponse(BaseModel):
    """Response returned by POST /api/follow-up."""

    questions: List[str] = []


class ErrorResponse(BaseModel):
    """Standard shape for error responses returned to the frontend."""

    detail: str
