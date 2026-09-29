import {
  HealthCheckResponse,
  Policy,
  CaseSubmissionPayload,
  AnalysisResult,
  HumanDecisionPayload,
  PatternInsight,
  DashboardOverview,
  RetainedExperience
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const errJson = await response.json();
      if (errJson.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      const text = await response.text();
      if (text) errorDetail = text;
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

export const api = {
  // Health & Configuration Status
  getHealth: async (): Promise<HealthCheckResponse> => {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    return handleResponse<HealthCheckResponse>(res);
  },

  // Dashboard Overview
  getDashboard: async (): Promise<DashboardOverview> => {
    const res = await fetch(`${API_BASE_URL}/api/dashboard`);
    return handleResponse<DashboardOverview>(res);
  },

  // Policies
  getPolicies: async (): Promise<Policy[]> => {
    const res = await fetch(`${API_BASE_URL}/api/policies`);
    return handleResponse<Policy[]>(res);
  },

  getPolicyById: async (id: string): Promise<Policy> => {
    const res = await fetch(`${API_BASE_URL}/api/policies/${id}`);
    return handleResponse<Policy>(res);
  },

  // Case Analysis
  analyzeCase: async (payload: CaseSubmissionPayload): Promise<AnalysisResult> => {
    const res = await fetch(`${API_BASE_URL}/api/cases/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse<AnalysisResult>(res);
  },

  // Human Decision & Memory Retention
  saveHumanDecision: async (caseId: string, payload: HumanDecisionPayload): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/api/cases/${caseId}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse<any>(res);
  },

  // Memory & Timeline (Hindsight Cloud)
  getMemoryTimeline: async (): Promise<{
    hindsight_configured: boolean;
    bank_id: string;
    stats: {
      total_retained_experiences: number;
      recurring_patterns_discovered: number;
      policy_review_candidates: number;
      successful_exception_rate: number;
    };
    experiences: RetainedExperience[];
  }> => {
    const res = await fetch(`${API_BASE_URL}/api/memory/timeline`);
    return handleResponse(res);
  },

  retainMemory: async (payload: any): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/api/memory/retain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse<any>(res);
  },

  resetMemory: async (): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/api/memory/reset`, {
      method: 'POST'
    });
    return handleResponse<any>(res);
  },

  // Insights
  getInsights: async (): Promise<PatternInsight[]> => {
    const res = await fetch(`${API_BASE_URL}/api/insights`);
    return handleResponse<PatternInsight[]>(res);
  },

  // Real Hindsight Demo Controllers
  clearDemoMemory: async (): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/api/demo/clear_memory`, {
      method: 'POST'
    });
    return handleResponse<any>(res);
  },

  populateDemoCases: async (): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/api/demo/populate_cases`, {
      method: 'POST'
    });
    return handleResponse<any>(res);
  }
};
