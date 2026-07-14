# FAQAI — Backend

FastAPI backend implementing NLP-based FAQ matching using TF-IDF and Cosine Similarity.

Full project documentation (features, setup, API reference, deployment) is in the [root README](../README.md).

## Quick start

```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS / Linux

pip install -r requirements.txt
cp .env.example .env

uvicorn app.main:app --reload
```

Runs at `http://127.0.0.1:8000`. Interactive docs at `http://127.0.0.1:8000/docs`.

## Structure

```
app/
├── main.py            # FastAPI app + CORS
├── config.py           # Environment-based settings
├── models.py            # Pydantic schemas
├── data/faqs.json       # FAQ dataset
├── nlp/                 # Preprocessing + TF-IDF/Cosine matching
├── services/             # FAQ business logic
└── routers/               # API routes
```
