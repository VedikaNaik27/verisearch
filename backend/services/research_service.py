"""
Research service: orchestrates the full research pipeline.

    USER QUERY
        -> QUERY ANALYSIS
        -> SEARCH WEB
        -> GET TOP RESULTS
        -> FETCH RELEVANT PAGES
        -> EXTRACT TEXT
        -> CLEAN / TRIM TEXT
        -> SEND CONTEXT TO LLM
        -> GENERATE ANSWER
        -> ATTACH SOURCES
        -> RETURN RESPONSE

This is the only place that wires the search, scraper and LLM services
together, so `api/search.py` stays a thin HTTP layer.
"""

from models.response_models import SearchResponse, Source
from services import llm_service
from services.scraper_service import scrape_sources
from services.search_service import get_search_provider
from utils.config import settings
from utils.text_utils import dedupe_by_url


# Domains that generally indicate higher-quality, more authoritative content.
# Used only as a light-touch ranking boost, never as a hard filter.
PREFERRED_DOMAIN_HINTS = (
    "wikipedia.org",
    "github.com",
    "stackoverflow.com",
    ".gov",
    ".edu",
    "arxiv.org",
    "nature.com",
    "ieee.org",
    "reuters.com",
    "apnews.com",
    "bbc.com",
    "techcrunch.com",
    "developer.mozilla.org",
    "docs.python.org",
)


def _rank_results(results: list[dict]) -> list[dict]:
    """Sort search results with a small preference boost for known-good domains."""

    def score(item: dict) -> int:
        domain = item.get("domain", "")

        base = (
            1
            if any(hint in domain for hint in PREFERRED_DOMAIN_HINTS)
            else 0
        )

        has_snippet = 1 if item.get("snippet") else 0

        return base * 2 + has_snippet

    return sorted(results, key=score, reverse=True)


async def run_research_pipeline(query: str) -> SearchResponse:
    """Execute the full pipeline for a single user query and build the response."""

    steps: list[str] = []

    # 1. Understand the query
    analysis = await llm_service.analyze_query(query)
    steps.append("Understanding your question")

    # Check whether Tavily search is configured.
    if not settings.search_configured():
        return SearchResponse(
            query=query,
            answer="",
            sources=[],
            research_steps=steps,
            warning=(
                "Search service is not configured. "
                "Please add TAVILY_API_KEY to backend/.env."
            ),
        )

    # 2. Search the web
    provider = get_search_provider()

    raw_results = await provider.search(
        analysis.search_query,
        max_results=max(analysis.suggested_source_count, 4),
    )

    raw_results = dedupe_by_url(raw_results)

    steps.append(
        f"Searching the web ({len(raw_results)} results found)"
    )

    # If no sources were found.
    if not raw_results:
        return SearchResponse(
            query=query,
            answer=(
                "No useful sources were found.\n\n"
                "Try using different keywords or a more specific question."
            ),
            sources=[],
            research_steps=steps,
        )

    # 3. Rank and select the top sources
    ranked = _rank_results(raw_results)

    selected = ranked[: settings.MAX_SOURCES]

    steps.append(
        f"Reading {len(selected)} selected sources"
    )

    # 4. Fetch and extract page content
    urls = [item["url"] for item in selected]

    scraped_text_by_url = await scrape_sources(urls)

    enriched_sources = []

    for item in selected:
        content = scraped_text_by_url.get(item["url"], "")

        enriched_sources.append(
            {
                **item,
                "content": content or item.get("snippet", ""),
            }
        )

    # 5. Analyze information and generate final answer
    steps.append("Analyzing information from sources")

    answer = await llm_service.generate_answer(
        query,
        enriched_sources,
    )

    steps.append("Generating final answer")

    # Generate suggested follow-up questions.
    follow_ups = await llm_service.generate_follow_up_questions(
        query,
        answer,
    )

    # 6. Attach sources and return
    sources = [
        Source(
            title=item["title"],
            url=item["url"],
            domain=item["domain"],
            snippet=item.get("snippet", ""),
            published_date=item.get("published_date"),
        )
        for item in enriched_sources
    ]

    # Show a warning only when Gemini is not configured.
    warning = None

    if not settings.llm_configured():
        warning = (
            "GEMINI_API_KEY is not configured, so the answer below is a direct "
            "compilation of source snippets rather than an AI-generated summary."
        )

    return SearchResponse(
        query=query,
        answer=answer,
        sources=sources,
        research_steps=steps,
        follow_up_questions=follow_ups,
        warning=warning,
    )