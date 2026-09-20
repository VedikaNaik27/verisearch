"""
VeriSearch backend entry point.

Run with:
    uvicorn main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import health, search
from utils.config import settings

app = FastAPI(
    title="VeriSearch API",
    description="AI-powered search engine: searches the web, analyzes multiple sources, and produces concise, source-grounded answers.",
    version="1.0.0",
)

# CORS: allow the configured frontend origin (defaults to Vite's dev server).
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(search.router)


@app.get("/")
async def root():
    return {
        "message": "VeriSearch API is running.",
        "docs": "/docs",
        "health": "/health",
    }
