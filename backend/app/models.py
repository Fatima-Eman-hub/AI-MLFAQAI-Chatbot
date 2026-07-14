from typing import Optional
from pydantic import BaseModel, Field, field_validator


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=500)

    @field_validator("message")
    @classmethod
    def message_must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Message cannot be empty or whitespace only.")
        return v.strip()


class ChatResponse(BaseModel):
    matched: bool
    answer: str
    question: Optional[str] = None
    category: Optional[str] = None
    confidence: float


class FAQItem(BaseModel):
    id: int
    category: str
    question: str
    answer: str


class HealthResponse(BaseModel):
    status: str
    faqs_loaded: int
