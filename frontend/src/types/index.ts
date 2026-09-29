export interface PolicyStep {
  step_number: number;
  name: string;
  description: string;
  is_mandatory: boolean;
  required_condition?: string;
}

export interface Policy {
  id: string;
  name: string;
  code: string;
  version: string;
  category: string;
  description: string;
  steps: PolicyStep[];
  total_cases: number;
  deviations_count: number;
  recurring_exceptions_count: number;
  last_analyzed: string;
  drift_status: 'Compliant' | 'Minor Drift' | 'Review Suggested' | 'High Risk Drift';
  summary_notes?: string;
}

export interface CaseSubmissionPayload {
  policy_id: string;
  title: string;
  description: string;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  customer_tier?: string;
  expected_process: string[];
  actual_process: string[];
  reason_for_deviation?: string;
  additional_context?: string;
}

export interface RetainedExperience {
  case_id: string;
  policy_id: string;
  policy_version: string;
  title: string;
  situation: string;
  expected_process: string[];
  actual_process: string[];
  deviation: string;
  deviation_type: string;
  reason: string;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  human_decision: string;
  outcome: 'Successful' | 'Partially Successful' | 'Unsuccessful' | 'Pending / Unknown';
  outcome_quality: 'Positive' | 'Neutral' | 'Negative';
  learned_lesson: string;
  relevant_conditions: string[];
  timestamp: string;
}

export interface HistoricalEvidenceItem {
  memory_id: string;
  similarity_score: number;
  experience: RetainedExperience;
  match_reasons: string[];
}

export interface AnalysisResult {
  case_id: string;
  policy_id: string;
  policy_name: string;
  policy_version: string;
  case_title: string;
  risk_level: string;
  has_deviation: boolean;
  deviation_type: string;
  detected_deviations: string[];
  policy_status: string;
  recommendation: string;
  confidence_score: number;
  reasoning_summary: string;
  historical_evidence: HistoricalEvidenceItem[];
  learned_patterns: string[];
  risk_considerations: string[];
  suggested_actions: string[];
  policy_review_warranted: boolean;
  review_recommendation_reason?: string;
  memory_count_influencing: number;
}

export interface HumanDecisionPayload {
  case_id: string;
  decision_type: 'Approve Recommendation' | 'Override Recommendation' | 'Escalate' | 'Custom';
  custom_decision_text?: string;
  decided_by?: string;
  outcome: 'Successful' | 'Partially Successful' | 'Unsuccessful' | 'Pending / Unknown';
  outcome_notes?: string;
  learned_lesson?: string;
}

export interface PatternInsight {
  id: string;
  pattern_type: 'Recurring Exception' | 'Risky Deviation' | 'Procedural Bottleneck' | 'Role Confusion';
  title: string;
  description: string;
  policy_id: string;
  policy_name: string;
  affected_step: string;
  evidence_count: number;
  successful_cases: number;
  unsuccessful_cases: number;
  success_rate: number;
  risk_assessment: string;
  recommendation: string;
  status: 'Active Drift' | 'Under Review' | 'Resolved';
  historical_case_ids: string[];
  timestamp: string;
}

export interface DashboardOverview {
  hindsight_configured?: boolean;
  total_cases: number;
  policies_tracked: number;
  exceptions_detected: number;
  policy_drift_patterns: number;
  successful_exception_rate: number;
  recent_learning_activities: {
    case_id: string;
    title: string;
    policy_id: string;
    risk_level: string;
    human_decision: string;
    outcome: string;
    timestamp: string;
  }[];
}

export interface HealthCheckResponse {
  status: string;
  app_name: string;
  mode: string;
  hindsight_configured: boolean;
  hindsight_bank_id: string;
  groq_configured: boolean;
  groq_model: string;
  message: string;
}
