import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

/**
 * Send a user message to the FAQ chatbot backend.
 * @param {string} message
 * @returns {Promise<{matched: boolean, answer: string, question: string|null, category: string|null, confidence: number}>}
 */
export async function sendChatMessage(message) {
  const { data } = await api.post("/api/chat", { message });
  return data;
}

export async function fetchSuggestedQuestions() {
  const { data } = await api.get("/api/faqs/suggested");
  return data.suggestions;
}

export async function fetchCategories() {
  const { data } = await api.get("/api/faqs/categories");
  return data.categories;
}

export async function fetchPopularFaqs() {
  const { data } = await api.get("/api/faqs/popular");
  return data;
}

export async function fetchAllFaqs(category) {
  const { data } = await api.get("/api/faqs", { params: category ? { category } : {} });
  return data;
}

export async function checkHealth() {
  const { data } = await api.get("/api/health");
  return data;
}
