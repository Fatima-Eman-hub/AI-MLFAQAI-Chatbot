"""
Service layer that loads FAQ data from disk and exposes matching functionality.
Keeping this separate from the router keeps the API layer thin and testable.
"""
import json
from pathlib import Path
from typing import List, Optional

from app.nlp.matcher import FAQMatcher, MatchResult

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "faqs.json"


class FAQService:
    def __init__(self, data_path: Path = DATA_PATH, similarity_threshold: float = 0.25):
        self.data_path = data_path
        self.faqs: List[dict] = self._load_faqs()
        self.matcher = FAQMatcher(self.faqs, similarity_threshold=similarity_threshold)

    def _load_faqs(self) -> List[dict]:
        if not self.data_path.exists():
            raise FileNotFoundError(f"FAQ data file not found at {self.data_path}")
        with open(self.data_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def get_all_faqs(self, category: Optional[str] = None) -> List[dict]:
        if category:
            return [faq for faq in self.faqs if faq.get("category", "").lower() == category.lower()]
        return self.faqs

    def get_categories(self) -> List[dict]:
        """Return categories with their FAQ counts, in a stable, curated order."""
        counts: dict = {}
        for faq in self.faqs:
            cat = faq.get("category", "General")
            counts[cat] = counts.get(cat, 0) + 1

        preferred_order = [
            "Artificial Intelligence", "Machine Learning", "Deep Learning", "NLP",
            "Computer Vision", "Generative AI", "LLMs", "Python", "Data Science",
        ]
        ordered = [c for c in preferred_order if c in counts]
        ordered += [c for c in counts if c not in ordered]

        return [{"name": cat, "count": counts[cat]} for cat in ordered]

    def get_popular_faqs(self) -> List[dict]:
        popular = [faq for faq in self.faqs if faq.get("popular")]
        return popular if popular else self.faqs[:4]

    def get_suggested_questions(self, limit: int = 6) -> List[str]:
        # One representative question per category, up to `limit`
        seen_categories = set()
        suggestions = []
        for faq in self.faqs:
            cat = faq.get("category")
            if cat not in seen_categories:
                suggestions.append(faq["question"])
                seen_categories.add(cat)
            if len(suggestions) >= limit:
                break
        return suggestions

    def ask(self, query: str) -> MatchResult:
        return self.matcher.match(query)


# Singleton instance used across the app
faq_service = FAQService()
