import React from "react";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-slate-700 dark:text-slate-300">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
        About VeriSearch
      </h1>

      <p className="mb-4 text-lg text-slate-600 dark:text-slate-400 italic">
        AI-powered search. Answers grounded in web sources.
      </p>

      <p className="mb-4">
        VeriSearch is an AI-powered search engine that searches the live web,
        analyzes multiple sources, and produces concise, source-grounded
        answers with citations. Instead of relying only on a language model's
        internal knowledge, VeriSearch retrieves relevant web information
        before generating an answer.
      </p>

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-2">
        Objective
      </h2>

      <p className="mb-4">
        The goal of VeriSearch is to combine web search, AI-powered synthesis,
        and transparent source citations into one research experience. The
        system understands the user's question, searches for relevant
        information, reads selected sources, and generates an answer grounded
        in the retrieved content.
      </p>

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-2">
        Technology Stack
      </h2>

      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Frontend: React, Vite, Tailwind CSS</li>
        <li>Backend: FastAPI, Uvicorn, Pydantic, httpx, BeautifulSoup4</li>
        <li>Web Search: Tavily Search API</li>
        <li>AI / LLM: Google Gemini API - Gemini 3.5 Flash</li>
        <li>Configuration: Environment variables with python-dotenv</li>
      </ul>

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-2">
        How It Works
      </h2>

      <p className="mb-4">
        The React frontend does not communicate directly with external AI or
        search providers. It sends the user's query to the FastAPI backend.
        The backend analyzes the query using Gemini, searches the live web
        through Tavily, retrieves relevant source content, cleans the
        retrieved information, and sends the source context to Gemini 3.5
        Flash for grounded answer generation. The backend then returns the
        answer, citations, source information, research steps, and suggested
        follow-up questions to the frontend.
      </p>

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-2">
        Source-Grounded Answers
      </h2>

      <p className="mb-4">
        VeriSearch is designed to keep generated answers connected to the
        retrieved sources. Citations such as [1], [2], and [3] point to the
        corresponding source cards, allowing users to open the original web
        pages and inspect the information themselves.
      </p>

      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-2">
        Future Improvements
      </h2>

      <ul className="list-disc list-inside space-y-1">
        <li>User accounts and persistent search history</li>
        <li>Retrieval-Augmented Generation (RAG) with a vector database</li>
        <li>PDF and document upload for research</li>
        <li>Source quality and credibility signals</li>
        <li>Multi-turn research conversations</li>
        <li>Improved freshness detection for current-event queries</li>
        <li>Voice search and browser extension support</li>
      </ul>
    </div>
  );
}