"""
Health-check endpoint - useful for uptime checks and for the demo/viva
("show that the backend is alive").
"""
from fastapi import APIRouter

from utils.config import settings

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "search_configured": settings.search_configured(),
        "llm_configured": settings.llm_configured(),
    }
