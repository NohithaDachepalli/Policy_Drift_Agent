from fastapi import APIRouter
from app.services.insight_service import insight_service

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_data():
    return await insight_service.get_dashboard_overview()
