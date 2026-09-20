"""
Search service: a provider-agnostic abstraction for web search.

The rest of the application only depends on `SearchProvider` and the
`SearchResultItem` shape, so a new provider (SerpAPI, Bing, Google CSE, ...)
can be added later without touching any other file.
"""
from abc import ABC, abstractmethod
from typing import List, TypedDict

import httpx

from utils.config import settings
from utils.text_utils import extract_domain, clean_whitespace


class SearchResultItem(TypedDict):
    title: str
    url: str
    snippet: str
    domain: str
    published_date: str | None


class SearchProvider(ABC):
    """Abstract base class every search provider must implement."""

    @abstractmethod
    async def search(self, query: str, max_results: int) -> List[SearchResultItem]:
        ...

    @abstractmethod
    def is_configured(self) -> bool:
        ...


class TavilySearchProvider(SearchProvider):
    """
    Search provider backed by the Tavily Search API
    (https://tavily.com) - purpose-built for AI research agents.
    """

    API_URL = "https://api.tavily.com/search"

    def __init__(self, api_key: str):
        self.api_key = api_key

    def is_configured(self) -> bool:
        return bool(self.api_key)

    async def search(self, query: str, max_results: int = 6) -> List[SearchResultItem]:
        if not self.is_configured():
            raise RuntimeError("Tavily search provider is not configured (missing TAVILY_API_KEY)")

        payload = {
            "api_key": self.api_key,
            "query": query,
            "search_depth": "advanced",
            "include_answer": False,
            "max_results": max_results,
        }

        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(self.API_URL, json=payload)
            response.raise_for_status()
            data = response.json()

        results: List[SearchResultItem] = []
        for item in data.get("results", []):
            url = item.get("url", "")
            if not url:
                continue
            results.append(
                SearchResultItem(
                    title=clean_whitespace(item.get("title", "") or url),
                    url=url,
                    snippet=clean_whitespace(item.get("content", ""))[:400],
                    domain=extract_domain(url),
                    published_date=item.get("published_date"),
                )
            )
        return results


def get_search_provider() -> SearchProvider:
    """Factory returning the currently configured search provider."""
    return TavilySearchProvider(api_key=settings.TAVILY_API_KEY)
