"""
Search API router - the main /api/search and /api/follow-up endpoints.

Kept intentionally thin: request validation happens via Pydantic models,
and all real logic lives in services/research_service.py and
services/llm_service.py.
"""
import logging

from fastapi import APIRouter, HTTPException

from models.response_models import FollowUpResponse, SearchResponse
from models.search_models import FollowUpRequest, SearchRequest
from services import llm_service
from services.research_service import run_research_pipeline

logger = logging.getLogger("verisearch")

router = APIRouter(prefix="/api")


@router.post("/search", response_model=SearchResponse)
async def search(payload: SearchRequest):
    """
    Run the full research pipeline for a user query:
    analyze -> search -> scrape -> summarize -> return sources + answer.
    """
    query = payload.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query must not be empty.")

    try:
        return await run_research_pipeline(query)
    except Exception as exc:  # Defensive: never let an unexpected error crash the API
        logger.exception("Research pipeline failed for query=%r", query)
        raise HTTPException(
            status_code=502,
            detail=f"Research pipeline failed unexpectedly: {exc}",
        ) from exc


@router.post("/follow-up", response_model=FollowUpResponse)
async def follow_up(payload: FollowUpRequest):
    """Generate follow-up question suggestions for a given query/answer pair."""
    try:
        questions = await llm_service.generate_follow_up_questions(payload.query, payload.answer)
        return FollowUpResponse(questions=questions)
    except Exception as exc:
        logger.exception("Follow-up generation failed")
        raise HTTPException(status_code=502, detail=f"Follow-up generation failed: {exc}") from exc
