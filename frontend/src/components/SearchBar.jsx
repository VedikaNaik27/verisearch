import React, { useState } from "react";

const EXAMPLE_QUERIES = [
  "Latest AI trends",
  "Best IoT projects",
  "Explain quantum computing",
  "Compare React and Flutter",
];

export default function SearchBar({ onSearch, initialValue = "", loading }) {
  const [value, setValue] = useState(initialValue);

  const submit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length >= 2) onSearch(trimmed);
  };

  return (
    <div className="w-full">
      <form onSubmit={submit} className="relative">
        <label htmlFor="search-input" className="sr-only">
          Search query
        </label>
        <input
          id="search-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search the web with AI..."
          className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900
                     px-5 py-4 pr-32 text-base text-slate-800 dark:text-slate-100 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || value.trim().length < 2}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-brand-500 hover:bg-brand-600
                     disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 transition-colors"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {EXAMPLE_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => {
              setValue(q);
              onSearch(q);
            }}
            className="text-sm px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700
                       text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
