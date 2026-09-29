from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ProcessStepDetail(BaseModel):
    step_number: int
    step_name: str
    expected_action: str
    actual_action: str
    was_followed: bool
    notes: Optional[str] = None

class CaseSubmission(BaseModel):
    policy_id: str
    title: str
    description: str
    risk_level: str  # "Low", "Medium", "High", "Critical"
    customer_tier: Optional[str] = "Standard"
    expected_process: List[str]
    actual_process: List[str]
    reason_for_deviation: Optional[str] = None
    additional_context: Optional[str] = None

class HumanDecisionPayload(BaseModel):
    case_id: str
    decision_type: str  # "Approve Recommendation", "Override Recommendation", "Escalate", "Custom"
    custom_decision_text: Optional[str] = None
    decided_by: str = "Policy Administrator"
    outcome: str  # "Successful", "Partially Successful", "Unsuccessful", "Pending / Unknown"
    outcome_notes: Optional[str] = None
    learned_lesson: Optional[str] = None

class RetainExperienceResponse(BaseModel):
    case_id: str
    memory_id: str
    status: str
    message: str
    timestamp: str

class AnalysisResult(BaseModel):
    case_id: str
    policy_id: str
    policy_name: str
    policy_version: str
    case_title: str
    risk_level: str
    has_deviation: bool
    deviation_type: str  # "None", "Step Omission", "Sequence Modification", "Alternative Verification", "Unauthorized Waiver"
    detected_deviations: List[str]
    policy_status: str
    recommendation: str  # "Approve Exception", "Escalate for Manager Review", "Reject Deviation / Enforce SOP", "Require Additional Verification"
    confidence_score: float  # 0.0 to 1.0
    reasoning_summary: str
    historical_evidence: List[Dict[str, Any]]
    learned_patterns: List[str]
    risk_considerations: List[str]
    suggested_actions: List[str]
    policy_review_warranted: bool
    review_recommendation_reason: Optional[str] = None
    memory_count_influencing: int
