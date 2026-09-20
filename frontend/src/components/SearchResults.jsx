import React from "react";
import AnswerBox from "./AnswerBox.jsx";
import SourceCard from "./SourceCard.jsx";
import ResearchSteps from "./ResearchSteps.jsx";

export default function SearchResults({ result, onFollowUpClick }) {
  if (!result) return null;

  const { answer, sources = [], research_steps = [], follow_up_questions = [], warning } = result;

  const hasSources = sources.length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
      <AnswerBox answer={answer} warning={warning} />

      {hasSources ? (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
            Sources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sources.map((source, i) => (
              <SourceCard key={source.url} index={i + 1} source={source} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-slate-500 dark:text-slate-400 text-sm py-4">
          No useful sources were found. Try using different keywords or a more specific question.
        </div>
      )}

      {follow_up_questions.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
            You might also ask
          </h2>
          <div className="flex flex-wrap gap-2">
            {follow_up_questions.map((q) => (
              <button
                key={q}
                onClick={() => onFollowUpClick(q)}
                className="text-sm px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700
                           text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <ResearchSteps steps={research_steps} />
    </div>
  );
}
