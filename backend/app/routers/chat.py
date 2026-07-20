import time
from typing import Optional

from fastapi import APIRouter, HTTPException, Query, Request

from app.limiter import limiter
from app.logging_config import logger
from app.models import ChatRequest, ChatResponse, FAQItem, HealthResponse
from app.services.faq_service import faq_service

router = APIRouter()

FALLBACK_MESSAGE = "Sorry, I couldn't find a relevant answer. Please try asking differently."


@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(status="ok", faqs_loaded=len(faq_service.get_all_faqs()))


@router.get("/stats")
def get_stats():
    """Lightweight in-memory usage metrics — resets on server restart."""
    return faq_service.get_metrics()


@router.get("/faqs", response_model=list[FAQItem])
def get_all_faqs(category: Optional[str] = Query(default=None, description="Filter FAQs by category name")):
    return faq_service.get_all_faqs(category=category)


@router.get("/faqs/categories")
def get_categories():
    return {"categories": faq_service.get_categories()}


@router.get("/faqs/popular", response_model=list[FAQItem])
def get_popular_faqs():
    return faq_service.get_popular_faqs()


@router.get("/faqs/suggested")
def get_suggested_questions():
    return {"suggestions": faq_service.get_suggested_questions()}


@router.post("/chat", response_model=ChatResponse)
@limiter.limit("20/minute")
def chat(request: Request, chat_request: ChatRequest):
    start = time.perf_counter()
    try:
        result = faq_service.ask(chat_request.message)
        related = faq_service.get_related_questions(chat_request.message, exclude_id=result.faq_id, top_n=3)
    except Exception as exc:  # defensive: never let matching errors leak as 500 without context
        logger.error(f"Error processing message '{chat_request.message[:80]}': {exc}")
        raise HTTPException(status_code=500, detail=f"Error processing message: {exc}")

    elapsed_ms = (time.perf_counter() - start) * 1000
    logger.info(
        f"chat query='{chat_request.message[:80]}' matched={result.matched} "
        f"confidence={result.confidence:.3f} time={elapsed_ms:.1f}ms"
    )

    if not result.matched:
        return ChatResponse(
            matched=False,
            answer=FALLBACK_MESSAGE,
            question=None,
            category=None,
            confidence=result.confidence,
            related_questions=related,
        )

    return ChatResponse(
        matched=True,
        answer=result.answer,
        question=result.question,
        category=result.category,
        confidence=result.confidence,
        related_questions=related,
    )
