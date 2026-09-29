from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class RetainedExperience(BaseModel):
    case_id: str
    policy_id: str
    policy_version: str
    title: str
    situation: str
    expected_process: List[str]
    actual_process: List[str]
    deviation: str
    deviation_type: str
    reason: str
    risk_level: str
    human_decision: str
    outcome: str  # "Successful", "Partially Successful", "Unsuccessful"
    outcome_quality: str  # "Positive", "Neutral", "Negative"
    learned_lesson: str
    relevant_conditions: List[str]
    timestamp: str

class MemoryQueryResult(BaseModel):
    memory_id: str
    similarity_score: float
    experience: RetainedExperience
    match_reasons: List[str]

class MemoryTimelineStats(BaseModel):
    total_retained_experiences: int
    recurring_patterns_discovered: int
    policy_review_candidates: int
    successful_exception_rate: float
