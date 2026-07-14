from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import chat

app = FastAPI(
    title=settings.APP_NAME,
    description="An AI & ML FAQ chatbot API using TF-IDF and Cosine Similarity for intent matching.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api", tags=["chat"])


@app.get("/")
def root():
    return {"message": f"{settings.APP_NAME} is running.", "docs": "/docs"}
