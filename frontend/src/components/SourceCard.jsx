import React from "react";

export default function SourceCard({ index, source }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold text-brand-500 bg-brand-50 dark:bg-brand-500/10 rounded-full px-2 py-0.5">
          [{index}]
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 truncate">{source.domain}</span>
      </div>
      <h3 className="font-medium text-slate-800 dark:text-slate-100 text-sm leading-snug mb-1 line-clamp-2">
        {source.title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 flex-1">
        {source.snippet}
      </p>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
      >
        Open source →
      </a>
    </div>
  );
}
