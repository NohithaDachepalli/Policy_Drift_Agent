from fastapi import APIRouter
from app.config import settings
from app.services.hindsight_service import hindsight_service
from app.services.groq_service import groq_service

router = APIRouter()

@router.get("/health")
async def get_health():
    hindsight_ok = hindsight_service.is_configured
    groq_ok = groq_service.is_configured

    msg_parts = []
    if not hindsight_ok:
        msg_parts.append("Hindsight Cloud API is not configured (HINDSIGHT_API_KEY missing)")
    if not groq_ok:
        msg_parts.append("Groq API is not configured (GROQ_API_KEY missing)")

    message = "; ".join(msg_parts) if msg_parts else "All AI & Memory services configured and operational."

    return {
        "status": "online",
        "app_name": "Policy Drift Agent",
        "mode": settings.APP_MODE,
        "hindsight_configured": hindsight_ok,
        "hindsight_bank_id": settings.HINDSIGHT_BANK_ID,
        "groq_configured": groq_ok,
        "groq_model": settings.GROQ_MODEL,
        "message": message
    }
