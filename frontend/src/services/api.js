/**
 * Thin wrapper around the VeriSearch backend API.
 * The frontend NEVER talks to search/LLM providers directly - only to
 * this FastAPI backend, which keeps API keys safely server-side.
 */
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

async function handleResponse(response) {
  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      detail = data.detail || detail;
    } catch {
      // response body wasn't JSON - keep the default message
    }
    throw new Error(detail);
  }
  return response.json();
}

export async function runSearch(query) {
  const response = await fetch(`${BASE_URL}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return handleResponse(response);
}

export async function getFollowUps(query, answer) {
  const response = await fetch(`${BASE_URL}/api/follow-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, answer }),
  });
  return handleResponse(response);
}

export async function checkHealth() {
  const response = await fetch(`${BASE_URL}/health`);
  return handleResponse(response);
}
