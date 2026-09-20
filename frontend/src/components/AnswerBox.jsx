import React from "react";
import ReactMarkdown from "react-markdown";

export default function AnswerBox({ answer, warning }) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-fade-in">
      
      <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400 mb-3">
        AI Answer
      </h2>

      {warning && (
        <div className="mb-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-sm px-3 py-2">
          {warning}
        </div>
      )}

      <div
        className="
          prose prose-slate max-w-none
          dark:prose-invert
          prose-p:leading-relaxed
          prose-headings:font-semibold
          dark:text-slate-200
          dark:prose-p:text-slate-200
          dark:prose-headings:text-white
          dark:prose-strong:text-white
          dark:prose-li:text-slate-200
          dark:prose-a:text-blue-400
          dark:prose-blockquote:text-slate-300
        "
      >
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>
    </div>
  );
}