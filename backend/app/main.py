from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.limiter import limiter
from app.logging_config import logger
from app.routers import chat

app = FastAPI(
    title=settings.APP_NAME,
    description="An AI & ML FAQ chatbot API using TF-IDF and Cosine Similarity for intent matching.",
    version="1.0.0",
)

app.state.limiter = limiter


@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    logger.warning(f"Rate limit exceeded for {get_remote_address(request)} on {request.url.path}")
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests. Please slow down and try again shortly."},
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api", tags=["chat"])


@app.on_event("startup")
def on_startup():
    logger.info(f"{settings.APP_NAME} starting up (env={settings.ENV})")


@app.get("/")
def root():
    return {"message": f"{settings.APP_NAME} is running.", "docs": "/docs"}
