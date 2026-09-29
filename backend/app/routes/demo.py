import logging
from fastapi import APIRouter, HTTPException
from app.services.hindsight_service import hindsight_service
from app.demo.seed_data import get_initial_historical_cases

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/demo/clear_memory")
async def clear_all_memory():
    """
    Clears memories in Hindsight Cloud bank to demonstrate Stage 1 (Zero Memory State).
    """
    if not hindsight_service.is_configured:
        raise HTTPException(
            status_code=503,
            detail="Hindsight Cloud is not configured. Please add HINDSIGHT_API_KEY and HINDSIGHT_BANK_ID to backend/.env."
        )

    res = await hindsight_service.clear_bank()
    return {
        "status": "success",
        "message": f"Hindsight Cloud memory bank '{hindsight_service.bank_id}' cleared. Agent is now in Stage 1 (Zero Memory State).",
        "details": res
    }

@router.post("/demo/populate_cases")
async def populate_cases():
    """
    Retains demonstration historical operational cases into Hindsight Cloud persistent memory bank
    one-by-one to demonstrate Stage 2 (Build Memory State).
    """
    if not hindsight_service.is_configured:
        raise HTTPException(
            status_code=503,
            detail="Hindsight Cloud is not configured. Please add HINDSIGHT_API_KEY and HINDSIGHT_BANK_ID to backend/.env to retain memories into Hindsight Cloud."
        )

    seed_cases = get_initial_historical_cases()
    retained_results = []
    failed_count = 0

    for idx, case in enumerate(seed_cases, 1):
        try:
            res = await hindsight_service.retain_experience(case)
            retained_results.append({
                "index": idx,
                "title": case.get("title"),
                "case_id": case.get("case_id"),
                "status": "success",
                "hindsight_response": res
            })
        except Exception as e:
            failed_count += 1
            logger.error(f"Failed to retain seed case {case.get('case_id')} in Hindsight Cloud: {e}")
            retained_results.append({
                "index": idx,
                "title": case.get("title"),
                "case_id": case.get("case_id"),
                "status": "failed",
                "error": str(e)
            })

    successful_count = len(seed_cases) - failed_count

    return {
        "status": "success" if failed_count == 0 else "partial_success",
        "message": f"Retained {successful_count}/{len(seed_cases)} demonstration experiences directly into Hindsight Cloud memory bank '{hindsight_service.bank_id}'.",
        "retained_count": successful_count,
        "failed_count": failed_count,
        "details": retained_results
    }
