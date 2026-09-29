import os
from pathlib import Path
from dotenv import load_dotenv

# Find .env in backend directory or root directory
env_path = Path(__file__).resolve().parent.parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).resolve().parent.parent.parent / ".env"

load_dotenv(dotenv_path=env_path)

class Settings:
    APP_MODE: str = os.getenv("APP_MODE", "production").lower()
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Groq API Configuration
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "").strip()
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile").strip()
    
    # Hindsight Memory Configuration (Vectorize.io Hindsight Cloud API)
    HINDSIGHT_API_KEY: str = os.getenv("HINDSIGHT_API_KEY", "").strip()
    HINDSIGHT_API_URL: str = os.getenv("HINDSIGHT_API_URL", "https://api.hindsight.vectorize.io").strip()
    HINDSIGHT_BANK_ID: str = os.getenv("HINDSIGHT_BANK_ID", "policy-drift-memory-bank-01").strip()

    @property
    def is_hindsight_configured(self) -> bool:
        return bool(self.HINDSIGHT_API_KEY and self.HINDSIGHT_BANK_ID)

    @property
    def is_groq_configured(self) -> bool:
        return bool(self.GROQ_API_KEY)

settings = Settings()
