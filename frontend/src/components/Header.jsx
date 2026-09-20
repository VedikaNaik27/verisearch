import React from "react";

export default function Header({ page, setPage, darkMode, setDarkMode, sidebarOpen, setSidebarOpen }) {
  const navItem = (key, label) => (
    <button
      onClick={() => setPage(key)}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        page === key
          ? "bg-brand-500 text-white"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
      aria-current={page === key ? "page" : undefined}
    >
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle history sidebar"
          >
            ☰
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage("home")}>
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">
              V
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-slate-800 dark:text-slate-100">VeriSearch</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 -mt-0.5">
                AI-powered search. Verified by sources.
              </p>
            </div>
          </div>
        </div>

        <nav className="hidden sm:flex items-center gap-1" aria-label="Main navigation">
          {navItem("home", "Home")}
          {navItem("history", "History")}
          {navItem("about", "About")}
        </nav>

        <button
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
          className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
