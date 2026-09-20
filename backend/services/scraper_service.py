"""
Scraper service: fetches web pages and extracts readable text content.

Designed to never crash the overall research pipeline - every failure is
caught and results in an empty string for that particular page, so one bad
website never takes down the whole search.
"""
import httpx
from bs4 import BeautifulSoup

from utils.config import settings
from utils.text_utils import clean_whitespace, truncate_text

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0 Safari/537.36 VeriSearchBot/1.0"
    )
}

# Tags that never contain useful reading content.
UNWANTED_TAGS = ["script", "style", "nav", "footer", "header", "aside", "form", "noscript", "svg"]


async def fetch_page_text(url: str) -> str:
    """
    Download a page and return its cleaned, readable text.
    Returns an empty string on any failure (timeout, 404, non-HTML, etc.).
    """
    try:
        async with httpx.AsyncClient(
            headers=HEADERS,
            timeout=settings.SCRAPE_TIMEOUT_SECONDS,
            follow_redirects=True,
        ) as client:
            response = await client.get(url)
            response.raise_for_status()

            content_type = response.headers.get("content-type", "")
            if "text/html" not in content_type and "application/xhtml" not in content_type:
                return ""

            return _extract_readable_text(response.text)
    except Exception:
        # Any network error, timeout, parsing error, etc. results in no content
        # for this particular source - the pipeline continues with the rest.
        return ""


def _extract_readable_text(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")

    for tag_name in UNWANTED_TAGS:
        for tag in soup.find_all(tag_name):
            tag.decompose()

    # Prefer <article> or <main> if present, since they usually hold the
    # actual body copy rather than navigation/ads.
    main_content = soup.find("article") or soup.find("main") or soup.body or soup

    text = main_content.get_text(separator=" ")
    text = clean_whitespace(text)
    return truncate_text(text, settings.MAX_CONTENT_CHARS)


async def scrape_sources(urls: list[str]) -> dict[str, str]:
    """
    Scrape a list of URLs concurrently and return a mapping of url -> text.
    Failed pages simply map to an empty string.
    """
    import asyncio

    results = await asyncio.gather(*(fetch_page_text(url) for url in urls))
    return dict(zip(urls, results))
