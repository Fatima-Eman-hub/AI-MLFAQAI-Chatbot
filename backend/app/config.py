import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = "AI & ML FAQ Chatbot API"
    ENV: str = os.getenv("ENV", "development")
    ALLOWED_ORIGINS: list = os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:5173"
    ).split(",")
    SIMILARITY_THRESHOLD: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.25"))


settings = Settings()
