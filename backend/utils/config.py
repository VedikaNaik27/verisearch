"""
Centralized application configuration.

Reads all settings from environment variables loaded from .env.
Never hard-code secrets here.
"""

import os
from dotenv import load_dotenv

# Load variables from backend/.env
load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    # --- LLM configuration ---
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    # --- Search provider configuration ---
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")

    # --- CORS ---
    FRONTEND_ORIGIN: str = os.getenv(
        "FRONTEND_ORIGIN",
        "http://localhost:5173"
    )

    # --- General app settings ---
    APP_NAME: str = "VeriSearch"

    MAX_SOURCES: int = int(
        os.getenv("MAX_SOURCES", "6")
    )

    MAX_CONTENT_CHARS: int = int(
        os.getenv("MAX_CONTENT_CHARS", "4000")
    )

    SCRAPE_TIMEOUT_SECONDS: float = float(
        os.getenv("SCRAPE_TIMEOUT_SECONDS", "8")
    )

    def llm_configured(self) -> bool:
        """Return True when the Gemini API key is configured."""
        return bool(self.GEMINI_API_KEY)

    def search_configured(self) -> bool:
        """Return True when the Tavily API key is configured."""
        return bool(self.TAVILY_API_KEY)


settings = Settings()