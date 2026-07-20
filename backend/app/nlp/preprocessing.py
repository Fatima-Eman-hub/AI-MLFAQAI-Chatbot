"""
Text preprocessing utilities for the FAQ chatbot.

Pipeline: lowercase -> tokenize -> remove punctuation -> remove stopwords -> stem
"""
import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize


def ensure_nltk_data() -> None:
    """Download required NLTK corpora if not already present (idempotent)."""
    required = [
        ("tokenizers/punkt", "punkt"),
        ("tokenizers/punkt_tab", "punkt_tab"),
        ("corpora/stopwords", "stopwords"),
    ]
    for path, package in required:
        try:
            nltk.data.find(path)
        except LookupError:
            nltk.download(package, quiet=True)


ensure_nltk_data()

# PorterStemmer (rule-based suffix stripping) is used instead of WordNetLemmatizer
# (dictionary lookup) because WordNet doesn't recognize domain-specific ML jargon
# like "overfitting" -- lemmatizing it is a no-op, so "overfit" and "overfitting"
# never share a token. Stemming reduces both to "overfit" and measurably improved
# matching accuracy in evaluation (see backend/tests/evaluate_matching.py).
_STEMMER = PorterStemmer()
_STOP_WORDS = set(stopwords.words("english"))
# Map every punctuation character to a space (not deletion). Deleting punctuation
# outright can silently merge two words -- e.g. "semi-supervised" -> "semisupervised" --
# which then fails to match a user typing "semi supervised" (two separate tokens).
_PUNCT_TABLE = str.maketrans(string.punctuation, " " * len(string.punctuation))


def clean_text(text: str) -> str:
    """Lowercase, replace punctuation with spaces, collapse extra whitespace."""
    text = text.lower().strip()
    text = text.translate(_PUNCT_TABLE)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def preprocess(text: str) -> str:
    """
    Full preprocessing pipeline used before vectorization:
    lowercase -> tokenize -> remove punctuation -> remove stopwords -> stem.

    Returns a single space-joined string of processed tokens, ready for TF-IDF.
    """
    if not text:
        return ""

    cleaned = clean_text(text)
    tokens = word_tokenize(cleaned)

    processed_tokens = [
        _STEMMER.stem(token)
        for token in tokens
        if token not in _STOP_WORDS and token.strip()
    ]

    return " ".join(processed_tokens)
