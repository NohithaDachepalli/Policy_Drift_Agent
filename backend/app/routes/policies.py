from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.services.policy_service import policy_service

router = APIRouter()

@router.get("/policies")
def list_policies():
    return policy_service.list_policies()

@router.get("/policies/{policy_id}")
def get_policy(policy_id: str):
    pol = policy_service.get_policy(policy_id)
    if not pol:
        raise HTTPException(status_code=404, detail="Policy not found")
    return pol
