# VeriSearch

**AI-powered search. Verified by sources.**

VeriSearch is an AI-powered search engine. You ask a question, and it
actually searches the live web, reads the top pages, and asks an LLM to
write a clear, **source-grounded** answer with citations — instead of
just answering from memory.

> Note: VeriSearch is a standalone AI *search engine*. It is a separate
> product from **ResearchPilot** (a different, independent AI agent project)
> and shares no branding, UI, or naming with it.

---

## 1. What it does

1. You ask a question ("Explain quantum computing", "Latest AI trends"...).
2. The backend analyzes the query (does it need current info? how many
   sources does it need?).
3. It searches the web via the **Tavily Search API**.
4. It fetches and cleans the text of the top result pages (httpx + BeautifulSoup4).
5. It sends the cleaned source text to an **LLM (OpenAI)**, instructed to
   answer only from the sources and cite them as `[1]`, `[2]`, etc.
6. The React frontend renders the answer, source cards (clickable, open in
   a new tab), a "Research process" panel, and follow-up question suggestions.
7. Your last 30 searches are kept in `localStorage` as history.

---

## 2. Features

- Real web search (Tavily) + real page scraping — no mock/fake data.
- Source-grounded answers with inline citation numbers.
- Query analysis (detects "needs current info" queries like "latest ...").
- Animated multi-step progress UI while searching.
- Source cards with domain, title, snippet, and an "Open source →" link.
- Collapsible "Research process" panel (high-level status only — no
  internal chain-of-thought is ever exposed).
- "You might also ask" follow-up question suggestions.
- Local search history (view, reopen, delete, clear all).
- Dark mode toggle (persisted).
- Responsive layout (desktop → tablet → mobile, collapsible sidebar).
- Graceful errors: missing API keys, no sources found, scrape/LLM failures
  never crash the app or fabricate fake results.
- Backend unit tests with mocked external APIs (no paid calls needed to test).

---

## 3. Architecture

```
User Query
    ↓
VeriSearch Frontend (React, Vite, Tailwind)
    │  POST /api/search  { query }
    ▼
FastAPI backend ("VeriSearch API")
    │
    ├─ services/llm_service.py       -> query analysis, answer + follow-ups (OpenAI)
    ├─ services/search_service.py    -> web search (Tavily), provider abstraction
    ├─ services/scraper_service.py   -> httpx + BeautifulSoup4 page scraping
    └─ services/research_service.py  -> orchestrates the full pipeline
    │
    ▼
JSON response: { answer, sources[], research_steps[], follow_up_questions[] }
    │
    ▼
VeriSearch UI: AI answer -> source cards -> research process -> follow-ups
```

The frontend **never** calls Tavily or OpenAI directly — only the FastAPI
backend does, so API keys stay server-side in `.env` and are never exposed
to the browser.

### Folder structure

```
verisearch/
├── backend/
│   ├── main.py                  FastAPI app ("VeriSearch API"), CORS, routers
│   ├── requirements.txt
│   ├── .env.example
│   ├── api/                     search.py, health.py  (HTTP layer only)
│   ├── models/                  Pydantic request/response models
│   ├── services/                search, scraper, llm, research pipeline
│   ├── utils/                   config.py, text_utils.py
│   └── tests/                   pytest tests (external APIs mocked)
└── frontend/
    ├── src/
    │   ├── App.jsx               page routing, state, history
    │   ├── components/           SearchBar, SearchResults, SourceCard, ...
    │   └── services/api.js       fetch wrapper around the backend
    └── ... (Vite + Tailwind config)
```

---

## 4. Requirements

- Python 3.10+
- Node.js 18+
- npm
- A **Tavily** API key (free tier available): https://app.tavily.com
- An **OpenAI** API key: https://platform.openai.com/api-keys
  (optional — without it VeriSearch still runs and shows source snippets
  instead of an AI-generated summary)

---

## 5. Installation & running (Windows-friendly)

### Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Open `backend\.env` and paste in your keys:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
TAVILY_API_KEY=tvly-...
FRONTEND_ORIGIN=http://localhost:5173
```

Run the server:

```powershell
uvicorn main:app --reload
```

Backend now runs at **http://localhost:8000** (interactive API docs at
`http://localhost:8000/docs`, which will show `VeriSearch API`).
Press `Ctrl+C` in that terminal to stop it.

(macOS/Linux: use `source venv/bin/activate` instead of `venv\Scripts\activate`,
and `cp .env.example .env` instead of `copy`.)

### Frontend

Open a **second** terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL it prints — normally **http://localhost:5173** — in your browser.
Press `Ctrl+C` in that terminal to stop it.

> Both servers must be running at the same time (backend on :8000,
> frontend on :5173) for search to work.

---

## 6. Where to get the API keys

- **Tavily** (search): sign up free at https://app.tavily.com → dashboard →
  copy your API key into `TAVILY_API_KEY`.
- **OpenAI** (LLM): https://platform.openai.com/api-keys → create a new
  secret key → copy into `OPENAI_API_KEY`. Any chat model works; `gpt-4o-mini`
  is a good cheap default.

If a key is missing, the backend does **not** crash — it returns a clear
configuration message explaining what's missing, and the UI displays it
instead of fabricating results.

### Using a different search provider

`services/search_service.py` defines an abstract `SearchProvider` class.
To add SerpAPI/Bing/Google CSE, implement a new class with the same
`search()` method and swap it in `get_search_provider()`.

---

## 7. Example searches

1. `Explain quantum computing` — general/definitional, fewer sources.
2. `What are the latest developments in artificial intelligence?` — tests
   the "needs current info" detection and fresh search results.
3. `Compare Flutter and React Native` — tests multi-source synthesis and
   comparison-style answers.
4. `Best IoT projects for engineering students` — tests source ranking
   toward technical/educational domains.
5. `Advantages of ESP32` — a focused technical query, good for showing
   inline citations `[1]`, `[2]` mapped to source cards.

---

## 8. Troubleshooting

| Symptom | Fix |
|---|---|
| "Search service is not configured" | Add `TAVILY_API_KEY` to `backend/.env` and restart uvicorn. |
| Answer is just snippets, no real summary | Add `OPENAI_API_KEY` to `backend/.env` and restart uvicorn. |
| "Unable to search right now" in the UI | Make sure the backend is running on :8000 and reachable — check the terminal running `uvicorn` for errors. |
| Frontend shows a network/CORS error | Make sure `FRONTEND_ORIGIN` in `backend/.env` matches the frontend URL (`http://localhost:5173`). |
| `ModuleNotFoundError` on backend start | Activate the venv and re-run `pip install -r requirements.txt`. |
| Port already in use | Stop the other process, or run uvicorn with `--port 8001` and update `VITE_BACKEND_URL` in `frontend/.env` accordingly. |

---

## 9. Security notes

- All API keys (`OPENAI_API_KEY`, `TAVILY_API_KEY`) live only in
  `backend/.env`, which is git-ignored, and are only ever read server-side
  by `backend/utils/config.py`. The frontend has no access to them.
- The frontend only ever calls the FastAPI backend (`/api/search`,
  `/api/follow-up`, `/health`) — never Tavily or OpenAI directly.
- Every outbound scrape request uses a timeout and is wrapped in a
  try/except, so a slow or malicious page can't hang or crash the server.
- No user input is ever executed as code; scraped HTML is parsed with
  BeautifulSoup, not evaluated.

---

## 10. Future improvements

Authentication · database-backed history · vector database / semantic
search · retrieval-augmented generation (RAG) · PDF/document upload
research · multi-agent research · source credibility scoring ·
persistent conversation memory · voice search · browser extension ·
mobile app · richer inline citation UI.

These were intentionally left out to keep VeriSearch simple, working, and
easy to run — new capabilities can be layered on without restructuring the
existing architecture.
