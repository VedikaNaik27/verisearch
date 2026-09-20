import React, { useState } from "react";

export default function ResearchSteps({ steps }) {
  const [open, setOpen] = useState(false);
  if (!steps || steps.length === 0) return null;

  return (
    <div className="w-full border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200"
        aria-expanded={open}
      >
        Research process
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      {open && (
        <ol className="px-4 pb-4 space-y-1.5 text-sm text-slate-600 dark:text-slate-400 list-decimal list-inside">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      )}
    </div>
  );
}
