import httpx
import json
import logging
from typing import List, Dict, Any, Optional
from fastapi import HTTPException
from app.config import settings

logger = logging.getLogger(__name__)

class GroqService:
    """
    Dedicated production service for Groq LLM API reasoning.
    Reads GROQ_API_KEY and GROQ_MODEL dynamically from environment configuration.
    """
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key)

    async def generate_reasoning(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2
    ) -> Optional[str]:
        """
        Executes LLM completion via Groq API.
        """
        if not self.is_configured:
            logger.warning("Groq API key is missing.")
            return None

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": temperature,
                "response_format": {"type": "json_object"}
            }
            async with httpx.AsyncClient(timeout=20.0) as client:
                res = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    json=payload,
                    headers=headers
                )
                if res.status_code == 200:
                    data = res.json()
                    return data["choices"][0]["message"]["content"]
                else:
                    logger.error(f"Groq API error ({res.status_code}): {res.text}")
                    raise HTTPException(
                        status_code=502,
                        detail=f"Groq API returned status {res.status_code}: {res.text}"
                    )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Groq API connection exception: {e}")
            raise HTTPException(
                status_code=503,
                detail=f"Failed to communicate with Groq API: {str(e)}"
            )

groq_service = GroqService()
