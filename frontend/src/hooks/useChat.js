import { useCallback, useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../services/api";

const STORAGE_KEY = "faqai-chat-history";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${Date.now()}-${idCounter}`;
}

function makeWelcomeMessage() {
  return {
    id: "welcome",
    role: "bot",
    text: "Hi! I'm FAQAI 👋 Ask me anything about AI or Machine Learning — I'll find the most relevant answer using TF-IDF and Cosine Similarity.",
    timestamp: new Date().toISOString(),
    matched: true,
  };
}

function loadStoredMessages() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function useChat() {
  const [messages, setMessages] = useState(() => loadStoredMessages() || [makeWelcomeMessage()]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFirstRender = useRef(true);

  // Persist conversation history for the current browser session (no login required)
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // sessionStorage unavailable (e.g. private mode) — fail silently, chat still works in-memory
    }
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage = {
      id: nextId(),
      role: "user",
      text: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(trimmed);
      const botMessage = {
        id: nextId(),
        role: "bot",
        text: response.answer,
        matched: response.matched,
        confidence: response.confidence,
        category: response.category,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const isNetworkError = !err.response;
      const errorMessage = {
        id: nextId(),
        role: "bot",
        text: isNetworkError
          ? "Couldn't reach the server. Make sure the backend is running, then try again."
          : "Something went wrong on my end. Please try again in a moment.",
        matched: false,
        isError: true,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearChat = useCallback(() => {
    const fresh = [makeWelcomeMessage()];
    setMessages(fresh);
    setError(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}
