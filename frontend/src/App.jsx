import React, { useEffect, useRef, useState } from "react";
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import SearchResults from "./components/SearchResults.jsx";
import LoadingState from "./components/LoadingState.jsx";
import HistorySidebar, {
  loadHistory,
  saveHistoryEntry,
  clearHistory,
  deleteHistoryEntry,
} from "./components/HistorySidebar.jsx";
import AboutPage from "./components/AboutPage.jsx";
import { runSearch } from "./services/api.js";

export default function App() {
  const [page, setPage] = useState("home"); // home | history | about
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("verisearch_dark") === "true");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const stepTimerRef = useRef(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("verisearch_dark", String(darkMode));
  }, [darkMode]);

  const startStepAnimation = () => {
    setActiveStep(0);
    let step = 0;
    stepTimerRef.current = setInterval(() => {
      step += 1;
      if (step <= 4) setActiveStep(step);
    }, 700);
  };

  const stopStepAnimation = () => {
    clearInterval(stepTimerRef.current);
  };

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    setPage("home");
    setLoading(true);
    setError(null);
    setResult(null);
    startStepAnimation();

    try {
      const data = await runSearch(searchQuery);
      setResult(data);
      setHistory(saveHistoryEntry(searchQuery));
    } catch (err) {
      const isNetworkError = err instanceof TypeError; // fetch() throws TypeError on network failure
      setError(
        isNetworkError || !err.message
          ? "Unable to search right now. Please check your search configuration and try again."
          : err.message
      );
    } finally {
      stopStepAnimation();
      setLoading(false);
    }
  };

  const handleSelectHistory = (q) => {
    setPage("home");
    handleSearch(q);
  };

  const handleDeleteHistory = (q) => {
    setHistory(deleteHistoryEntry(q, history));
  };

  const handleClearHistory = () => {
    setHistory(clearHistory());
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header
        page={page}
        setPage={setPage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1">
        {(page === "home" || page === "history") && (
          <HistorySidebar
            history={history}
            onSelect={handleSelectHistory}
            onDelete={handleDeleteHistory}
            onClear={handleClearHistory}
            open={sidebarOpen}
          />
        )}

        <main className="flex-1 px-4 py-10">
          {page === "about" && <AboutPage />}

          {page !== "about" && (
            <div className="max-w-3xl mx-auto">
              {!result && !loading && (
                <div className="text-center mb-8 mt-6">
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                    What do you want to know?
                  </h1>
                </div>
              )}

              <SearchBar onSearch={handleSearch} initialValue={query} loading={loading} />

              <div className="mt-10">
                {loading && <LoadingState activeStepIndex={activeStep} />}

                {!loading && error && (
                  <div className="max-w-xl mx-auto text-center bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-xl px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                {!loading && !error && result && (
                  <SearchResults result={result} onFollowUpClick={handleSearch} />
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
