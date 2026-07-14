<div align="center">

# FAQAI
### AI & Machine Learning FAQ Chatbot

**An NLP-powered chatbot that understands natural-language questions using TF-IDF vectorization and Cosine Similarity — no keyword matching, no hardcoded rules, no LLM API calls.**

Built as **Task 2** of the CodeAlpha AI Internship.

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Scikit-learn](https://img.shields.io/badge/Scikit--learn-TF--IDF-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![NLTK](https://img.shields.io/badge/NLTK-NLP-green?style=flat-square)](https://www.nltk.org/)

</div>

---

> Ask a question in your own words → the backend preprocesses it with NLTK, vectorizes it with Scikit-learn's TF-IDF, and returns the most similar FAQ answer along with a confidence score.

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Environment Variables](#%EF%B8%8F-environment-variables)
- [How the Matching Works](#-how-the-matching-works)
- [Deployment](#%EF%B8%8F-deployment)
- [Documentation](#-documentation)
- [Acknowledgments](#-acknowledgments)

---

## ✨ Features

**Core (internship requirements)**

| | |
|---|---|
| ✅ | FAQ collection stored in JSON — not hardcoded in source |
| ✅ | Full NLP preprocessing pipeline: lowercasing → tokenization → punctuation removal → stopword removal → lemmatization (NLTK) |
| ✅ | TF-IDF vectorization + Cosine Similarity matching (Scikit-learn) |
| ✅ | Smart fallback — never guesses an answer when confidence is too low |
| ✅ | Clean, fully responsive chat interface (React + Tailwind CSS) |

**Extras**

| | | | |
|---|---|---|---|
| 🌗 Dark / light mode | 📂 Category sidebar (9 categories, 43 FAQs) | 🔥 Trending questions | 💬 Session-persisted history |
| 🎤 Voice input (STT) | 🔊 Text-to-Speech answers | 📋 Copy-to-clipboard | 📄 Export chat (TXT / PDF) |
| 🔍 Keyword search | ⭐ Bookmark / favorite FAQs | 📊 Confidence score per answer | — |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion, Axios, React Router |
| **Backend** | Python, FastAPI, Uvicorn |
| **NLP** | NLTK (tokenization, stopwords, lemmatization) |
| **ML** | Scikit-learn (TF-IDF Vectorizer, Cosine Similarity) |
| **Data** | JSON (FAQ store) |
| **PDF Export** | jsPDF |

---

## 📁 Project Structure

```
faq-chatbot/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app entrypoint, CORS setup
│   │   ├── config.py               # Environment-based settings
│   │   ├── models.py               # Pydantic request/response schemas
│   │   ├── data/
│   │   │   └── faqs.json           # 43 FAQs across 9 categories
│   │   ├── nlp/
│   │   │   ├── preprocessing.py    # NLTK text preprocessing pipeline
│   │   │   └── matcher.py          # TF-IDF + Cosine Similarity engine
│   │   ├── services/
│   │   │   └── faq_service.py      # Business logic: loading, filtering, matching
│   │   └── routers/
│   │       └── chat.py             # API routes
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/             # Navbar, Hero, ChatWindow, ChatBubble, etc.
│   │   ├── pages/                  # Home.jsx, Chatbot.jsx
│   │   ├── hooks/                  # useChat.js, useBookmarks.js
│   │   ├── context/                # ThemeContext.jsx (dark/light mode)
│   │   ├── services/               # api.js (Axios client)
│   │   ├── utils/                  # exportChat.js (TXT/PDF export)
│   │   └── App.jsx
│   ├── package.json
│   └── .env.example
│
└── docs/
    └── screenshots/                # Project screenshots
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Activate the virtual environment
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS / Linux

pip install -r requirements.txt
cp .env.example .env         # Windows: copy .env.example .env

uvicorn app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000` — interactive API docs at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup

Open a **second terminal**:

```bash
cd frontend
npm install
cp .env.example .env         # Windows: copy .env.example .env

npm run dev
```

Frontend runs at `http://localhost:5173`.

> ⚠️ Both servers must be running simultaneously for the chatbot to work.

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check, returns FAQ count |
| `GET` | `/api/faqs` | All FAQs (optional `?category=` filter) |
| `GET` | `/api/faqs/categories` | Categories with FAQ counts |
| `GET` | `/api/faqs/popular` | Trending / popular FAQs |
| `GET` | `/api/faqs/suggested` | One suggested question per category |
| `POST` | `/api/chat` | Send `{ "message": "..." }`, get matched answer + confidence |

<details>
<summary><strong>Example request / response</strong></summary>

**Request**
```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "what is overfitting"}'
```

**Response**
```json
{
  "matched": true,
  "answer": "Overfitting occurs when a model learns the training data too well, including its noise and outliers, causing it to perform poorly on new, unseen data.",
  "question": "What is overfitting?",
  "category": "Machine Learning",
  "confidence": 1.0
}
```
</details>

---

## ⚙️ Environment Variables

**`backend/.env`**
```env
ENV=development
ALLOWED_ORIGINS=http://localhost:5173
SIMILARITY_THRESHOLD=0.25
```

**`frontend/.env`**
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## 🧠 How the Matching Works

1. All FAQ questions are preprocessed once at startup and vectorized into a TF-IDF matrix.
2. An incoming user message goes through the same preprocessing pipeline (lowercase → tokenize → remove punctuation → remove stopwords → lemmatize).
3. The processed query is vectorized using the same fitted TF-IDF vectorizer.
4. Cosine similarity is computed between the query vector and every FAQ vector.
5. The highest-scoring FAQ is returned **only if** its similarity clears the configured threshold (default `0.25`) — otherwise the chatbot responds with a fallback message instead of guessing.

---

## ☁️ Deployment

| Service | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |

Full step-by-step deployment instructions are included in [`FAQAI_Documentation.pdf`](FAQAI_Documentation.pdf).

---

## 📄 Documentation

A complete project write-up — architecture, NLP matching design, API reference, error handling, known limitations, and future improvements — is available in [`FAQAI_Documentation.pdf`](FAQAI_Documentation.pdf).

---

## 🙏 Acknowledgments

Built for the **CodeAlpha AI Internship — Task 2 (FAQ Chatbot)**.

<div align="center">
<sub>Made with TF-IDF, Cosine Similarity, and a lot of debugging 💜</sub>
</div>
