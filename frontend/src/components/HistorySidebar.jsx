import React from "react";

const STORAGE_KEY = "verisearch_history";

export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistoryEntry(query) {
  const history = loadHistory();
  const entry = { query, timestamp: new Date().toISOString() };
  const updated = [entry, ...history.filter((h) => h.query !== query)].slice(0, 30);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}

export function deleteHistoryEntry(query, history) {
  const updated = history.filter((h) => h.query !== query);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export default function HistorySidebar({ history, onSelect, onDelete, onClear, open }) {
  return (
    <aside
      className={`${
        open ? "block" : "hidden"
      } md:block w-full md:w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 md:min-h-[calc(100vh-57px)] p-4`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Recent searches</h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-red-500 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Your recent searches will appear here.
        </p>
      ) : (
        <ul className="space-y-1">
          {history.map((h) => (
            <li key={h.query + h.timestamp} className="group flex items-center justify-between gap-1">
              <button
                onClick={() => onSelect(h.query)}
                className="flex-1 text-left text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md px-2 py-1.5 truncate"
                title={h.query}
              >
                {h.query}
              </button>
              <button
                onClick={() => onDelete(h.query)}
                aria-label={`Delete "${h.query}" from history`}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 text-xs px-1"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
