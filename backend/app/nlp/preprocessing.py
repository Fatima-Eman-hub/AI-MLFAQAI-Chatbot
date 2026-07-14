"""
Text preprocessing utilities for the FAQ chatbot.

Pipeline: lowercase -> tokenize -> remove punctuation -> remove stopwords -> lemmatize
"""
import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize


def ensure_nltk_data() -> None:
    """Download required NLTK corpora if not already present (idempotent)."""
    required = [
        ("tokenizers/punkt", "punkt"),
        ("tokenizers/punkt_tab", "punkt_tab"),
        ("corpora/stopwords", "stopwords"),
        ("corpora/wordnet", "wordnet"),
        ("corpora/omw-1.4", "omw-1.4"),
    ]
    for path, package in required:
        try:
            nltk.data.find(path)
        except LookupError:
            nltk.download(package, quiet=True)


ensure_nltk_data()

_LEMMATIZER = WordNetLemmatizer()
_STOP_WORDS = set(stopwords.words("english"))
_PUNCT_TABLE = str.maketrans("", "", string.punctuation)


def clean_text(text: str) -> str:
    """Lowercase, strip punctuation/extra whitespace from raw text."""
    text = text.lower().strip()
    text = text.translate(_PUNCT_TABLE)
    text = re.sub(r"\s+", " ", text)
    return text


def preprocess(text: str) -> str:
    """
    Full preprocessing pipeline used before vectorization:
    lowercase -> tokenize -> remove punctuation -> remove stopwords -> lemmatize.

    Returns a single space-joined string of processed tokens, ready for TF-IDF.
    """
    if not text:
        return ""

    cleaned = clean_text(text)
    tokens = word_tokenize(cleaned)

    processed_tokens = [
        _LEMMATIZER.lemmatize(token)
        for token in tokens
        if token not in _STOP_WORDS and token.strip()
    ]

    return " ".join(processed_tokens)
