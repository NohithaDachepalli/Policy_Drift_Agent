import React from 'react';
import { PatternInsight } from '../types';
import { Brain, AlertTriangle } from 'lucide-react';

interface LearningInsightsPageProps {
  insights: PatternInsight[];
}

export const LearningInsightsPage: React.FC<LearningInsightsPageProps> = ({ insights }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Learning Insights</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Discovered patterns and recurring drift across accumulated operational experiences.
        </p>
      </div>

      <div className="space-y-4">
        {insights.length > 0 ? (
          insights.map((pattern) => (
            <div
              key={pattern.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {pattern.pattern_type}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{pattern.policy_name}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{pattern.title}</h2>
                </div>

                <div className="flex items-center space-x-4 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Evidence Cases</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{pattern.evidence_count}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Success Rate</span>
                    <span className={`text-sm font-bold ${pattern.success_rate >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {pattern.success_rate}%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{pattern.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-300 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Risk Assessment</span>
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{pattern.risk_assessment}</p>
                </div>

                <div className="p-3 rounded-md bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-1">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center space-x-1">
                    <Brain className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Policy Recommendation</span>
                  </span>
                  <p className="text-indigo-900 dark:text-indigo-200 leading-relaxed">{pattern.recommendation}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>Affected Step: <strong className="text-slate-700 dark:text-slate-300">{pattern.affected_step}</strong></span>
                <span>Cases: <span className="font-mono">{pattern.historical_case_ids.join(', ')}</span></span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-lg border border-slate-200 dark:border-slate-800 text-center space-y-2 shadow-sm">
            <Brain className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">No recurring patterns detected yet.</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              As operational experiences accumulate in Hindsight memory, pattern insights will surface here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
