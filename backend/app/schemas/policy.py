from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class PolicyStep(BaseModel):
    step_number: int
    name: str
    description: str
    is_mandatory: bool = True
    required_condition: Optional[str] = None

class Policy(BaseModel):
    id: str
    name: str
    code: str
    version: str
    category: str
    description: str
    steps: List[PolicyStep]
    total_cases: int = 0
    deviations_count: int = 0
    recurring_exceptions_count: int = 0
    last_analyzed: str
    drift_status: str  # "Compliant", "Minor Drift", "Review Suggested", "High Risk Drift"
    summary_notes: Optional[str] = None

class PolicyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    steps: Optional[List[PolicyStep]] = None
