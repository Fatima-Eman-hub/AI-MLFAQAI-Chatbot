import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "faqai-bookmarks";

function loadBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(loadBookmarks);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch {
      // localStorage unavailable — bookmarks stay in-memory for this session
    }
  }, [bookmarks]);

  const isBookmarked = useCallback(
    (id) => bookmarks.some((b) => b.id === id),
    [bookmarks]
  );

  const toggleBookmark = useCallback((faq) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === faq.id);
      if (exists) return prev.filter((b) => b.id !== faq.id);
      return [...prev, { id: faq.id, question: faq.question }];
    });
  }, []);

  return { bookmarks, isBookmarked, toggleBookmark };
}
