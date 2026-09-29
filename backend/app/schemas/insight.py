from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class PatternInsight(BaseModel):
    id: str
    pattern_type: str  # "Recurring Exception", "Risky Deviation", "Procedural Bottleneck", "Role Confusion"
    title: str
    description: str
    policy_id: str
    policy_name: str
    affected_step: str
    evidence_count: int
    successful_cases: int
    unsuccessful_cases: int
    success_rate: float
    risk_assessment: str
    recommendation: str
    status: str  # "Active Drift", "Under Review", "Resolved"
    historical_case_ids: List[str]
    timestamp: str

class DashboardOverview(BaseModel):
    total_cases: int
    policies_tracked: int
    exceptions_detected: int
    policy_drift_patterns: int
    successful_exception_rate: float
    recent_learning_activities: List[Dict[str, Any]]
