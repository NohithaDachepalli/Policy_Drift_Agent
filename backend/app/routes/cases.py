from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.schemas.case import CaseSubmission, HumanDecisionPayload
from app.services.analysis_service import analysis_service
from app.services.hindsight_service import hindsight_service
from app.models.database import db

router = APIRouter()

@router.post("/cases/analyze")
async def analyze_case(payload: CaseSubmission):
    try:
        result = await analysis_service.analyze_case(payload.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/cases/{case_id}/decision")
async def record_human_decision(case_id: str, payload: HumanDecisionPayload):
    # Construct complete experience object to retain into Hindsight
    experience = {
        "case_id": case_id,
        "policy_id": "pol_onboarding_001",
        "title": f"Operational Decision for {case_id}",
        "situation": f"Decision: {payload.decision_type}. Notes: {payload.outcome_notes or 'N/A'}",
        "expected_process": [],
        "actual_process": [],
        "deviation": payload.custom_decision_text or payload.decision_type,
        "deviation_type": "Human Decision",
        "reason": payload.outcome_notes or "Human operator decision",
        "risk_level": "Medium",
        "human_decision": payload.decision_type,
        "outcome": payload.outcome,
        "outcome_quality": "Positive" if payload.outcome == "Successful" else "Negative" if payload.outcome == "Unsuccessful" else "Neutral",
        "learned_lesson": payload.learned_lesson or f"Human decision '{payload.decision_type}' yielded '{payload.outcome}' outcome."
    }

    res = await hindsight_service.retain_experience(experience)
    return {
        "status": "success",
        "message": "Human decision and outcome retained in Hindsight organizational memory.",
        "memory_result": res
    }
