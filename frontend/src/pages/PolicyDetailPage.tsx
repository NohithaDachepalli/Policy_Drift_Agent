import React from 'react';
import { Policy, RetainedExperience } from '../types';
import { Badge } from '../components/Badge';
import { ArrowLeft, BookOpen, CheckCircle2, AlertTriangle, ShieldAlert, ArrowDown, FileText } from 'lucide-react';

interface PolicyDetailPageProps {
  policy: Policy;
  historicalCases: RetainedExperience[];
  onBack: () => void;
  onAnalyzeCase: (policyId: string) => void;
}

export const PolicyDetailPage: React.FC<PolicyDetailPageProps> = ({
  policy,
  historicalCases,
  onBack,
  onAnalyzeCase
}) => {
  const policyCases = historicalCases.filter((c) => c.policy_id === policy.id);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Back Action & Primary Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Policy Library</span>
        </button>

        <button
          type="button"
          onClick={() => onAnalyzeCase(policy.id)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
        >
          Analyze Case for this SOP
        </button>
      </div>

      {/* Policy Hero Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                {policy.code}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Version {policy.version}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">• Category: {policy.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">{policy.name}</h1>
          </div>

          <Badge type="status" value={policy.drift_status} className="text-xs sm:text-sm px-3 py-1" />
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
          {policy.description}
        </p>

        {policy.summary_notes && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs sm:text-sm text-amber-900 dark:text-amber-200 space-y-1">
            <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Observed Policy Drift Insight</span>
            </div>
            <p className="leading-relaxed">{policy.summary_notes}</p>
          </div>
        )}
      </div>

      {/* Visual Process Timeline Workflow Diagram */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-outfit">Official Workflow & Deviation Map</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visual process timeline showing step sequence and real-world deviation frequency.
          </p>
        </div>

        <div className="space-y-4">
          {policy.steps.map((step, idx) => {
            const isStep2 = step.step_number === 2;
            const isStep4 = step.step_number === 4;

            return (
              <div key={idx} className="relative">
                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isStep2
                      ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/40 glow-indigo'
                      : isStep4
                      ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-300 dark:border-purple-500/40'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 font-bold flex items-center justify-center text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shrink-0">
                        {step.step_number}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base font-outfit">{step.name}</h4>
                          {step.is_mandatory && (
                            <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              Mandatory
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{step.description}</p>
                        {step.required_condition && (
                          <p className="text-xs text-indigo-600 dark:text-indigo-300 mt-1 italic font-medium">
                            Condition: {step.required_condition}
                          </p>
                        )}
                      </div>
                    </div>

                    {isStep2 && (
                      <div className="sm:text-right shrink-0">
                        <span className="inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>6 Recurring Exceptions</span>
                        </span>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">100% Success Rate (Low Risk Tier)</p>
                      </div>
                    )}

                    {isStep4 && (
                      <div className="sm:text-right shrink-0">
                        <span className="inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-bold">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                          <span>2 Risky Bypasses</span>
                        </span>
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold mt-1">0% Success Rate (High Risk Tier)</p>
                      </div>
                    )}
                  </div>
                </div>

                {idx < policy.steps.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowDown className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Cases for this policy */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-outfit">Historical Cases for this Policy</h3>

        <div className="space-y-4">
          {policyCases.length > 0 ? (
            policyCases.map((c, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{c.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{c.situation}</p>
                  </div>
                  <Badge type="outcome" value={c.outcome} />
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Deviation: </span>
                  <span>{c.deviation}</span>
                  <div className="pt-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Learned Lesson: </span>
                    <span>{c.learned_lesson}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">No historical cases logged yet for this policy.</p>
          )}
        </div>
      </div>
    </div>
  );
};
