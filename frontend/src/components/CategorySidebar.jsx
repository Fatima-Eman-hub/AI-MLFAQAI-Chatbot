import { useEffect, useMemo, useState } from "react";
import { Layers, TrendingUp, ChevronDown, Search, Star, X } from "lucide-react";
import { fetchCategories, fetchPopularFaqs, fetchAllFaqs } from "../services/api";
import { useBookmarks } from "../hooks/useBookmarks";

function QuestionRow({ faq, onSelectQuestion, isBookmarked, onToggleBookmark }) {
  return (
    <div className="group flex items-center gap-1 rounded-lg pr-1 hover:bg-[var(--bg-subtle)]">
      <button
        onClick={() => onSelectQuestion(faq.question)}
        className="flex-1 truncate px-3 py-2 text-left text-sm text-secondary hover:text-brand-500"
      >
        {faq.question}
      </button>
      <button
        onClick={() => onToggleBookmark(faq)}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded transition-opacity ${
          isBookmarked ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <Star
          className={`h-3.5 w-3.5 ${isBookmarked ? "fill-brand-500 text-brand-500" : "text-muted"}`}
        />
      </button>
    </div>
  );
}

export default function CategorySidebar({ activeCategory, onSelectCategory, onSelectQuestion }) {
  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);
  const [allFaqs, setAllFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { bookmarks, isBookmarked, toggleBookmark } = useBookmarks();

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    fetchPopularFaqs().then(setPopular).catch(() => setPopular([]));
    fetchAllFaqs().then(setAllFaqs).catch(() => setAllFaqs([]));
  }, []);

  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return allFaqs.filter((f) => f.question.toLowerCase().includes(term)).slice(0, 10);
  }, [searchTerm, allFaqs]);

  const isSearching = searchTerm.trim().length > 0;

  const content = (
    <div className="space-y-7">
      {/* Search */}
      <div>
        <div
          className="flex items-center gap-2 rounded-lg border px-3 py-2"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)" }}
        >
          <Search className="h-3.5 w-3.5 shrink-0 text-muted" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search FAQs…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} aria-label="Clear search">
              <X className="h-3.5 w-3.5 text-muted hover:text-brand-500" />
            </button>
          )}
        </div>

        {isSearching && (
          <div className="mt-2 flex flex-col gap-0.5">
            {searchResults.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted">No matching FAQs.</p>
            ) : (
              searchResults.map((faq) => (
                <QuestionRow
                  key={faq.id}
                  faq={faq}
                  onSelectQuestion={onSelectQuestion}
                  isBookmarked={isBookmarked(faq.id)}
                  onToggleBookmark={toggleBookmark}
                />
              ))
            )}
          </div>
        )}
      </div>

      {!isSearching && (
        <>
          {/* Categories */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
              <Layers className="h-3.5 w-3.5" />
              Categories
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => onSelectCategory(null)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  !activeCategory
                    ? "bg-gradient-to-br from-brand-500 to-brand-700 font-semibold text-white"
                    : "text-secondary hover:bg-[var(--bg-subtle)]"
                }`}
              >
                All Questions
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => onSelectCategory(cat.name)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    activeCategory === cat.name
                      ? "bg-gradient-to-br from-brand-500 to-brand-700 font-semibold text-white"
                      : "text-secondary hover:bg-[var(--bg-subtle)]"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                      activeCategory === cat.name ? "bg-white/20" : "text-muted"
                    }`}
                    style={activeCategory === cat.name ? {} : { backgroundColor: "var(--bg-subtle)" }}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Popular / Trending */}
          {popular.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
                <TrendingUp className="h-3.5 w-3.5" />
                Trending Questions
              </div>
              <div className="flex flex-col gap-0.5">
                {popular.map((faq) => (
                  <QuestionRow
                    key={faq.id}
                    faq={faq}
                    onSelectQuestion={onSelectQuestion}
                    isBookmarked={isBookmarked(faq.id)}
                    onToggleBookmark={toggleBookmark}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bookmarks */}
          {bookmarks.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
                <Star className="h-3.5 w-3.5" />
                Bookmarked
              </div>
              <div className="flex flex-col gap-1">
                {bookmarks.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onSelectQuestion(b.question)}
                    className="truncate rounded-lg px-3 py-2 text-left text-sm text-secondary hover:bg-[var(--bg-subtle)] hover:text-brand-500"
                  >
                    {b.question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="surface-card sticky top-24 hidden h-fit max-h-[75vh] shrink-0 overflow-y-auto rounded-2xl p-5 lg:block lg:w-72">
        {content}
      </aside>

      {/* Mobile dropdown */}
      <div className="surface-card mb-4 rounded-2xl lg:hidden">
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="flex w-full items-center justify-between px-5 py-4 text-sm font-semibold"
        >
          <span className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-brand-500" />
            Browse categories, search &amp; trending
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
        </button>
        {mobileOpen && (
          <div className="max-h-96 overflow-y-auto border-t px-5 py-4" style={{ borderColor: "var(--border-subtle)" }}>
            {content}
          </div>
        )}
      </div>
    </>
  );
}
