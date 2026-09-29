from fastapi import APIRouter
from app.services.insight_service import insight_service

router = APIRouter()

@router.get("/insights")
def get_insights():
    return insight_service.get_learning_insights()
