import React from "react";

const STEPS = [
  "Understanding your question",
  "Searching the web",
  "Reading sources",
  "Analyzing information",
  "Generating answer",
];

export default function LoadingState({ activeStepIndex = 0 }) {
  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-4">
        <span className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
        </span>
        Searching the web...
      </div>

      <ul className="space-y-2 mb-6">
        {STEPS.map((step, i) => {
          const state = i < activeStepIndex ? "done" : i === activeStepIndex ? "active" : "pending";
          return (
            <li key={step} className="flex items-center gap-2 text-sm">
              <span
                className={
                  state === "done"
                    ? "text-green-500"
                    : state === "active"
                    ? "text-brand-500"
                    : "text-slate-300 dark:text-slate-600"
                }
              >
                {state === "done" ? "✓" : state === "active" ? "●" : "○"}
              </span>
              <span
                className={
                  state === "pending"
                    ? "text-slate-400 dark:text-slate-600"
                    : "text-slate-700 dark:text-slate-200"
                }
              >
                {step}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
