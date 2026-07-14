"""
FAQ matching engine: TF-IDF vectorization + Cosine Similarity.
"""
from dataclasses import dataclass
from typing import List, Optional

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.nlp.preprocessing import preprocess


@dataclass
class MatchResult:
    faq_id: Optional[int]
    question: Optional[str]
    answer: Optional[str]
    category: Optional[str]
    confidence: float
    matched: bool


class FAQMatcher:
    """
    Builds a TF-IDF matrix over preprocessed FAQ questions and matches
    incoming user queries against it using cosine similarity.
    """

    def __init__(self, faqs: List[dict], similarity_threshold: float = 0.25):
        self.faqs = faqs
        self.similarity_threshold = similarity_threshold
        self._vectorizer = TfidfVectorizer()
        self._faq_matrix = None
        self._build_index()

    def _build_index(self) -> None:
        processed_questions = [preprocess(faq["question"]) for faq in self.faqs]
        self._faq_matrix = self._vectorizer.fit_transform(processed_questions)

    def reload(self, faqs: List[dict]) -> None:
        """Rebuild the TF-IDF index, e.g. after FAQs are updated."""
        self.faqs = faqs
        self._vectorizer = TfidfVectorizer()
        self._build_index()

    def match(self, user_query: str) -> MatchResult:
        if not user_query or not user_query.strip():
            return MatchResult(None, None, None, None, 0.0, False)

        processed_query = preprocess(user_query)
        if not processed_query:
            return MatchResult(None, None, None, None, 0.0, False)

        query_vector = self._vectorizer.transform([processed_query])
        similarities = cosine_similarity(query_vector, self._faq_matrix).flatten()

        best_idx = similarities.argmax()
        best_score = float(similarities[best_idx])

        if best_score < self.similarity_threshold:
            return MatchResult(None, None, None, None, round(best_score, 4), False)

        best_faq = self.faqs[best_idx]
        return MatchResult(
            faq_id=best_faq["id"],
            question=best_faq["question"],
            answer=best_faq["answer"],
            category=best_faq.get("category"),
            confidence=round(best_score, 4),
            matched=True,
        )

    def top_matches(self, user_query: str, top_n: int = 3) -> List[MatchResult]:
        """Return the top-N candidate matches, regardless of threshold (used for suggestions/debugging)."""
        processed_query = preprocess(user_query)
        if not processed_query:
            return []

        query_vector = self._vectorizer.transform([processed_query])
        similarities = cosine_similarity(query_vector, self._faq_matrix).flatten()
        ranked_indices = similarities.argsort()[::-1][:top_n]

        results = []
        for idx in ranked_indices:
            faq = self.faqs[idx]
            results.append(
                MatchResult(
                    faq_id=faq["id"],
                    question=faq["question"],
                    answer=faq["answer"],
                    category=faq.get("category"),
                    confidence=round(float(similarities[idx]), 4),
                    matched=similarities[idx] >= self.similarity_threshold,
                )
            )
        return results
