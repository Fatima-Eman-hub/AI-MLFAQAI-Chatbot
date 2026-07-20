"""
Evaluation dataset for the FAQAI matching engine.

- CORE_CASES: one realistic paraphrase per FAQ (not the exact stored question),
  used to measure whether the matcher generalizes beyond literal text.
- OUT_OF_DOMAIN_CASES: queries with no relevant FAQ; the matcher should
  return matched=False for every one of these.
- KNOWN_LIMITATION_CASES: queries expected to fail given TF-IDF's lexical
  (non-semantic) nature — tracked separately, not counted against accuracy.
"""

CORE_CASES = [
    (1, "can you explain what AI is"),
    (2, "what's the difference between ai ml and deep learning"),
    (3, "where is AI actually used in real life"),
    (4, "why do AI systems have bias"),
    (5, "explain machine learning to me"),
    (6, "what does supervised learning mean"),
    (7, "how does unsupervised learning work"),
    (8, "what is reinforcement learning used for"),
    (9, "what's semi supervised learning"),
    (10, "why does my model overfit"),
    (11, "what causes underfitting"),
    (12, "how can i stop my model from overfitting"),
    (13, "what is cross validation used for"),
    (14, "explain a confusion matrix"),
    (15, "difference between precision and recall"),
    (16, "how does gradient descent work"),
    (17, "what exactly is deep learning"),
    (18, "how does a neural network work"),
    (19, "what's a convolutional neural network used for"),
    (20, "explain recurrent neural networks"),
    (21, "why do we need activation functions"),
    (22, "how does backpropagation work"),
    (23, "what is natural language processing"),
    (24, "what does tokenization mean in nlp"),
    (25, "explain tf idf to me"),
    (26, "how does cosine similarity work"),
    (27, "what is lemmatization used for"),
    (28, "what does computer vision do"),
    (29, "explain image segmentation"),
    (30, "how does object detection work"),
    (31, "what is generative ai"),
    (32, "explain generative adversarial networks"),
    (33, "how do diffusion models work"),
    (34, "what is a large language model"),
    (35, "explain the transformer architecture"),
    (36, "what does RAG mean in AI"),
    (37, "what is prompt engineering"),
    (38, "why do people use python for machine learning"),
    (39, "what is numpy used for"),
    (40, "what does pandas do in python"),
    (41, "what is data science"),
    (42, "what is exploratory data analysis"),
    (43, "what does feature engineering mean"),
]

OUT_OF_DOMAIN_CASES = [
    "what's the weather today",
    "tell me a joke about pizza",
    "who won the cricket match yesterday",
    "how do i cook biryani",
    "what's your favorite movie",
    "translate this sentence to french",
    "what's the capital of pakistan",
    "recommend a good book to read",
]

# These are expected to fail with pure TF-IDF (no synonym/acronym expansion).
# Tracked separately to document the known limitation with real numbers.
KNOWN_LIMITATION_CASES = [
    (23, "what is nlp"),           # acronym vs spelled-out FAQ question
    (17, "what's dl"),             # acronym for Deep Learning
    (5, "what's ml"),              # acronym for Machine Learning
    (34, "what's an llm"),         # acronym vs "Large Language Model"
]
