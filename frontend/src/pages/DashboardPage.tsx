import React from 'react';
import { DashboardOverview } from '../types';
import { MetricCard } from '../components/MetricCard';
import {
  Brain,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Activity,
  FileText,
  Play
} from 'lucide-react';

interface DashboardPageProps {
  data: DashboardOverview | null;
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ data, onNavigate }) => {
  const stats = data || {
    total_cases: 0,
    policies_tracked: 3,
    exceptions_detected: 0,
    policy_drift_patterns: 0,
    successful_exception_rate: 0,
    recent_learning_activities: []
  };

  return (
    <div className="space-y-8">
      
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Hindsight Persistent Memory System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Policy Drift Agent
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Identify where real-world decisions differ from written policy and learn from previous outcomes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('analyze')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm transition-colors"
            >
              <span>Analyze New Case</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('demo_journey')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Play className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Run Learning Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* OVERVIEW METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Memory / Experiences"
          value={stats.total_cases}
          label="Hindsight Cloud"
          description="Retained operational cases with human decisions"
          icon={Activity}
          color="indigo"
        />

        <MetricCard
          title="Policies Tracked"
          value={stats.policies_tracked}
          label="Active SOPs"
          description="Monitored operating procedures"
          icon={FileText}
          color="purple"
        />

        <MetricCard
          title="Exceptions Detected"
          value={stats.exceptions_detected}
          label="Process Deviations"
          description="Real-world cases diverging from policy"
          icon={AlertTriangle}
          color="amber"
        />

        <MetricCard
          title="Drift Patterns"
          value={stats.policy_drift_patterns}
          label="Learned Insights"
          description="Detected recurring drift trends"
          icon={ShieldCheck}
          color="emerald"
        />
      </div>

      {/* RECENT LEARNING ACTIVITY */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Organizational Learning
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Accumulated operational experiences stored in Hindsight memory.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('memory')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View Memory Stream →
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {stats.recent_learning_activities && stats.recent_learning_activities.length > 0 ? (
            stats.recent_learning_activities.map((item, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Decision: <span className="font-medium text-slate-700 dark:text-slate-300">{item.human_decision}</span>
                  </p>
                </div>
                <div className="shrink-0">
                  <span className={`inline-flex px-2.5 py-0.5 text-xs rounded font-medium border ${
                    item.outcome === 'Successful'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800'
                      : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800'
                  }`}>
                    {item.outcome}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No recent experiences recorded. Run the Learning Demo or Analyze a Case to populate memory.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
