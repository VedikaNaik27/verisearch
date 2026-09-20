"""
Small, dependency-light text-processing helpers shared across services.
"""
import re
from urllib.parse import urlparse


def clean_whitespace(text: str) -> str:
    """Collapse repeated whitespace/newlines into single spaces."""
    if not text:
        return ""
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def truncate_text(text: str, max_chars: int) -> str:
    """Trim text to a maximum number of characters without cutting mid-word."""
    if not text or len(text) <= max_chars:
        return text
    trimmed = text[:max_chars]
    last_space = trimmed.rfind(" ")
    if last_space > 0:
        trimmed = trimmed[:last_space]
    return trimmed.rstrip() + "..."


def extract_domain(url: str) -> str:
    """Return a human-friendly domain name for a URL, e.g. 'example.com'."""
    try:
        netloc = urlparse(url).netloc
        return netloc.replace("www.", "") if netloc else url
    except Exception:
        return url


def looks_like_current_events_query(query: str) -> bool:
    """
    Very lightweight heuristic to decide whether a query needs fresh,
    time-sensitive information (as opposed to timeless/definitional facts).
    """
    keywords = [
        "latest", "recent", "new", "newest", "today", "this year", "this week",
        "2024", "2025", "2026", "current", "trend", "trends", "update", "updates",
        "news", "upcoming", "now",
    ]
    q = query.lower()
    return any(k in q for k in keywords)


def dedupe_by_url(items: list) -> list:
    """Remove duplicate search results that share the same URL."""
    seen = set()
    result = []
    for item in items:
        url = item.get("url") if isinstance(item, dict) else getattr(item, "url", None)
        if not url or url in seen:
            continue
        seen.add(url)
        result.append(item)
    return result
