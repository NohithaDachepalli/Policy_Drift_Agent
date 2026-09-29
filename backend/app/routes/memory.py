from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
from app.services.hindsight_service import hindsight_service
from app.models.database import db

router = APIRouter()

@router.post("/memory/retain")
async def retain_experience(payload: Dict[str, Any]):
    """
    Retains an operational case experience directly into Hindsight Cloud persistent memory.
    """
    res = await hindsight_service.retain_experience(payload)
    return res

@router.post("/memory/recall")
async def recall_memory(payload: Dict[str, Any]):
    """
    Queries Hindsight Cloud persistent memory for relevant historical experiences.
    """
    query = payload.get("query", "")
    policy_id = payload.get("policy_id")
    risk_level = payload.get("risk_level")
    results = await hindsight_service.recall_experiences(
        query=query,
        policy_id=policy_id,
        risk_level=risk_level
    )
    return {
        "query": query,
        "results_count": len(results),
        "memories": results
    }

@router.get("/memory/timeline")
async def get_memory_timeline():
    """
    Retrieves stored experiences directly from Hindsight Cloud memory bank.
    Calculates dynamic stats based strictly on Hindsight data.
    """
    memories = await hindsight_service.get_all_memories()
    insights = db.get_all_insights()

    successful_count = sum(1 for c in memories if c.get("outcome") == "Successful")
    success_rate = round((successful_count / len(memories)) * 100.0, 1) if memories else 0.0

    return {
        "hindsight_configured": hindsight_service.is_configured,
        "bank_id": hindsight_service.bank_id,
        "stats": {
            "total_retained_experiences": len(memories),
            "recurring_patterns_discovered": len(insights) if memories else 0,
            "policy_review_candidates": sum(1 for i in insights if i.get("status") == "Active Drift") if memories else 0,
            "successful_exception_rate": success_rate
        },
        "experiences": memories
    }

@router.post("/memory/reset")
async def reset_memory_store():
    """
    Resets Hindsight Cloud memory bank.
    """
    res = await hindsight_service.clear_bank()
    return res
