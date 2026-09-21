\# VeriSearch



\### AI-powered search. Answers grounded in web sources.



VeriSearch is an AI-powered search engine that searches the live web,

analyzes multiple sources, and generates concise, source-grounded answers

with citations.



Instead of relying only on an LLM's internal knowledge, VeriSearch retrieves

relevant web information first and uses that information to generate its

answer.



> \*\*Note:\*\* VeriSearch is a standalone AI search engine. It is separate from

> ResearchPilot, which is an independent AI agent project.



\---



\## 1. What VeriSearch Does



A user enters a question such as:



\- `Explain quantum computing`

\- `What are the latest developments in artificial intelligence?`

\- `Compare Flutter and React Native`



The VeriSearch pipeline then:



1\. Analyzes the user's query using Google Gemini.

2\. Determines the appropriate search query and source count.

3\. Searches the live web using the Tavily Search API.

4\. Selects relevant sources.

5\. Fetches and extracts useful page content.

6\. Cleans and limits the retrieved content.

7\. Sends the source context to Gemini.

8\. Generates a source-grounded answer with citations.

9\. Returns the answer and source information to the React frontend.

10\. Generates suggested follow-up questions.



The frontend displays the final answer, citations, source cards,

research progress, and follow-up questions.



\---



\## 2. Features



\### Search \& Research



\- Live web search using Tavily

\- Real webpage retrieval and content extraction

\- Query analysis using Google Gemini

\- Detection of queries requiring current information

\- Multi-source research

\- Source ranking with lightweight domain-quality preferences

\- Source-grounded AI answers

\- Inline citations such as `\[1]`, `\[2]`, and `\[3]`



\### User Experience



\- Animated research progress

\- Research process panel

\- Source cards with title, domain, snippet, and original source link

\- "You might also ask" follow-up suggestions

\- Local search history

\- View, reopen, delete, and clear search history

\- Dark mode

\- Responsive desktop, tablet, and mobile layout

\- Collapsible history sidebar



\### Reliability



\- Graceful handling of missing API keys

\- Graceful handling of failed searches

\- Graceful handling of webpage scraping failures

\- Graceful handling of LLM failures

\- No fabricated search results when external services fail

\- Backend tests using mocked external services



\---



\## 3. Architecture



```text

&#x20;                        USER QUERY

&#x20;                             │

&#x20;                             ▼

&#x20;             ┌──────────────────────────┐

&#x20;             │   VeriSearch Frontend    │

&#x20;             │ React + Vite + Tailwind  │

&#x20;             └────────────┬─────────────┘

&#x20;                          │

&#x20;                          │ POST /api/search

&#x20;                          ▼

&#x20;             ┌──────────────────────────┐

&#x20;             │    FastAPI Backend       │

&#x20;             │     VeriSearch API       │

&#x20;             └────────────┬─────────────┘

&#x20;                          │

&#x20;            ┌─────────────┼──────────────┐

&#x20;            │             │              │

&#x20;            ▼             ▼              ▼

&#x20;       Query Analysis   Web Search    Web Scraping

&#x20;         Gemini          Tavily       httpx +

&#x20;                                     BeautifulSoup

&#x20;            │             │              │

&#x20;            └─────────────┼──────────────┘

&#x20;                          │

&#x20;                          ▼

&#x20;                 Source Context

&#x20;                          │

&#x20;                          ▼

&#x20;             ┌──────────────────────────┐

&#x20;             │       Gemini LLM        │

&#x20;             │ Source-grounded answer  │

&#x20;             └────────────┬─────────────┘

&#x20;                          │

&#x20;                          ▼

&#x20;                JSON API Response

&#x20;                          │

&#x20;                          ▼

&#x20;             ┌──────────────────────────┐

&#x20;             │      VeriSearch UI       │

&#x20;             │                          │

&#x20;             │ AI Answer                │

&#x20;             │ Citations                │

&#x20;             │ Source Cards             │

&#x20;             │ Research Process         │

&#x20;             │ Follow-up Questions      │

&#x20;             └──────────────────────────┘

