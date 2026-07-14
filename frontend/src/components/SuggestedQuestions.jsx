import { useEffect, useState } from "react";
import { fetchSuggestedQuestions, fetchAllFaqs } from "../services/api";

export default function SuggestedQuestions({ onSelect, disabled, category }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadError(false);

    const load = category
      ? fetchAllFaqs(category).then((faqs) => faqs.slice(0, 6).map((f) => f.question))
      : fetchSuggestedQuestions();

    load
      .then((data) => {
        if (!cancelled) setSuggestions(data || []);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [category]);

  if (loadError || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-1">
      {suggestions.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onSelect(q)}
          disabled={disabled}
          className="rounded-full border px-3.5 py-1.5 text-xs font-medium text-secondary transition-colors hover:border-brand-400 hover:text-brand-500 disabled:opacity-50"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-subtle)" }}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
