import React, { useState } from 'react';
import { AnalysisResult, HumanDecisionPayload } from '../types';
import { Badge } from '../components/Badge';
import { api } from '../services/api';
import {
  Brain,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Save,
  ArrowLeft,
  Layers,
  FileCheck
} from 'lucide-react';

interface RecommendationViewProps {
  result: AnalysisResult;
  onReset: () => void;
  onSaved: () => void;
}

export const RecommendationView: React.FC<RecommendationViewProps> = ({
  result,
  onReset,
  onSaved
}) => {
  const [decisionType, setDecisionType] = useState<
    'Approve Recommendation' | 'Override Recommendation' | 'Escalate' | 'Custom'
  >('Approve Recommendation');

  const [customText, setCustomText] = useState<string>('');
  const [outcome, setOutcome] = useState<'Successful' | 'Partially Successful' | 'Unsuccessful' | 'Pending / Unknown'>('Successful');
  const [outcomeNotes, setOutcomeNotes] = useState<string>('Operational exception completed smoothly with verified documentation.');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Safe defaults for all properties to prevent rendering crashes
  const caseId = result?.case_id || `case_${Date.now()}`;
  const policyName = result?.policy_name || 'Customer Onboarding Procedure';
  const policyVersion = result?.policy_version || '2.1';
  const recommendation = result?.recommendation || 'No Recommendation Available';
  const riskLevel = result?.risk_level || 'Low';
  const confidenceScore = result?.confidence_score ?? 0.85;
  const reasoningSummary = result?.reasoning_summary || '';
  const memoryCountInfluencing = result?.memory_count_influencing ?? 0;
  const historicalEvidence = Array.isArray(result?.historical_evidence) ? result.historical_evidence : [];
  const learnedPatterns = Array.isArray(result?.learned_patterns) ? result.learned_patterns : [];
  const riskConsiderations = Array.isArray(result?.risk_considerations) ? result.risk_considerations : [];

  const handleSaveDecision = async () => {
    setIsSaving(true);
    const payload: HumanDecisionPayload = {
      case_id: caseId,
      decision_type: decisionType,
      custom_decision_text: customText || undefined,
      outcome: outcome,
      outcome_notes: outcomeNotes,
      learned_lesson: `${decisionType} outcome '${outcome}': ${outcomeNotes}`
    };

    try {
      await api.saveHumanDecision(caseId, payload);
      setIsSaving(false);
      setIsSaved(true);
      onSaved();
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* HEADER & BACK ACTION */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Analyze Another Case</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Case ID: <span className="font-mono text-slate-900 dark:text-white font-bold">{caseId}</span></span>
        </div>
      </div>

      {/* SECTION 1: APPLICABLE POLICY & RECOMMENDATION */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
              Policy: {policyName} (v{policyVersion})
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {recommendation}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Badge type="risk" value={riskLevel} />
            <div className="text-right">
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Confidence Score</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {Math.round(confidenceScore * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* AGENT ANALYSIS REASONING */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Agent Reasoning Summary
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-md border border-slate-200 dark:border-slate-700">
            {reasoningSummary}
          </p>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2 pt-1">
          <span>Informed by <strong className="font-mono text-indigo-600 dark:text-indigo-400">{memoryCountInfluencing} historical experiences</strong> recalled from Hindsight Cloud.</span>
        </div>
      </div>

      {/* SECTION 2: RELEVANT EXPERIENCE FROM HINDSIGHT */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Relevant Past Experience from Hindsight</span>
          </h2>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {historicalEvidence.length} Memories Recalled
          </span>
        </div>

        <div className="space-y-3">
          {historicalEvidence.length > 0 ? (
            historicalEvidence.map((evidence, idx) => {
              const exp = evidence?.experience || {};
              const simScore = evidence?.similarity_score ?? 0.85;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{exp.title || 'Retrieved Experience'}</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                          {Math.round(simScore * 100)}% Match
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{exp.situation || ''}</p>
                    </div>

                    <Badge type="outcome" value={exp.outcome || 'Successful'} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300 block">Deviation / Human Decision:</span>
                      <p className="text-slate-600 dark:text-slate-400">{exp.deviation || exp.human_decision || 'N/A'}</p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300 block">Lesson Learned:</span>
                      <p className="text-slate-600 dark:text-slate-400">{exp.learned_lesson || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
              No historical experiences found in Hindsight persistent memory for this specific scenario.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: PATTERNS & RISKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm">Learned Exception Patterns</h2>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            {learnedPatterns.length > 0 ? (
              learnedPatterns.map((p, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400">No specific exception pattern logged yet.</li>
            )}
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm">Risk Considerations</h2>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            {riskConsiderations.length > 0 ? (
              riskConsiderations.map((r, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400">No high-risk considerations flagged for this tier.</li>
            )}
          </ul>
        </div>
      </div>

      {/* SECTION 4: HUMAN DECISION & OUTCOME RECORDER */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Human Decision & Outcome</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            The human operator makes the final decision. Record the outcome to retain this experience into Hindsight Cloud memory.
          </p>
        </div>

        {isSaved ? (
          <div className="p-6 rounded-md bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Experience Retained in Hindsight Memory</h3>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
              This case experience has been saved to organizational memory. Future cases will use this experience!
            </p>
            <button
              type="button"
              onClick={onReset}
              className="mt-2 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-colors"
            >
              Analyze Next Case
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                Human Operator Decision
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  'Approve Recommendation',
                  'Override Recommendation',
                  'Escalate',
                  'Custom'
                ].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDecisionType(opt as any)}
                    className={`p-2.5 rounded-md border text-xs font-medium text-left transition-colors ${
                      decisionType === opt
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {decisionType === 'Custom' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Custom Decision Details
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                  placeholder="Specify custom decision..."
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Operational Outcome
                </label>
                <select
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Successful">Successful (Positive Outcome)</option>
                  <option value="Partially Successful">Partially Successful (Minor Friction)</option>
                  <option value="Unsuccessful">Unsuccessful (Negative Outcome)</option>
                  <option value="Pending / Unknown">Pending / Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Outcome Notes & Retained Lesson
                </label>
                <input
                  type="text"
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                  placeholder="Notes on outcome and key lessons..."
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveDecision}
              disabled={isSaving}
              className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4 text-white" />
              <span>{isSaving ? 'Retaining Experience in Hindsight...' : 'Save Experience to Organizational Memory'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
