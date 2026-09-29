import React, { useState } from 'react';
import { RetainedExperience } from '../types';
import { Badge } from '../components/Badge';
import { Brain, Search, Filter } from 'lucide-react';

interface MemoryTimelinePageProps {
  stats: {
    total_retained_experiences: number;
    recurring_patterns_discovered: number;
    policy_review_candidates: number;
    successful_exception_rate: number;
  };
  experiences: RetainedExperience[];
  hindsightConfigured?: boolean;
}

export const MemoryTimelinePage: React.FC<MemoryTimelinePageProps> = ({ stats, experiences }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');

  const filtered = experiences.filter((exp) => {
    const titleMatch = exp.title ? exp.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const sitMatch = exp.situation ? exp.situation.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const lessonMatch = exp.learned_lesson ? exp.learned_lesson.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const matchesSearch = titleMatch || sitMatch || lessonMatch;
    const matchesRisk = filterRisk === 'all' || (exp.risk_level && exp.risk_level.toLowerCase() === filterRisk.toLowerCase());
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Experience Memory</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Experiences stored in Hindsight that inform future case analysis.
        </p>
      </div>

      {/* OVERVIEW STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Total Experiences</span>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {stats.total_retained_experiences}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Recurring Patterns</span>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {stats.recurring_patterns_discovered}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Policy Review Candidates</span>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {stats.policy_review_candidates}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Exception Success Rate</span>
          <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {stats.total_retained_experiences > 0 ? `${stats.successful_exception_rate}%` : '—'}
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search memory stream..."
            className="w-full pl-9 pr-4 py-2 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600 dark:text-slate-400 font-medium">Risk Filter:</span>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
          >
            <option value="all">All Risk Tiers</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>
      </div>

      {/* MEMORY ITEMS LIST */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((exp, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">{exp.case_id}</span>
                    {exp.risk_level && <Badge type="risk" value={exp.risk_level} />}
                    {exp.timestamp && <span className="text-xs text-slate-400">{new Date(exp.timestamp).toLocaleDateString()}</span>}
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{exp.title || 'Operational Experience'}</h2>
                </div>

                {exp.outcome && <Badge type="outcome" value={exp.outcome} />}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Situation:</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{exp.situation}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Deviation</span>
                  <p className="text-slate-600 dark:text-slate-400">{exp.deviation || 'Alternative Verification'}</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Reason</span>
                  <p className="text-slate-600 dark:text-slate-400">{exp.reason || 'Operational necessity'}</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Human Decision</span>
                  <p className="text-slate-600 dark:text-slate-400">{exp.human_decision || 'N/A'}</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Lesson Learned</span>
                  <p className="text-slate-600 dark:text-slate-400">{exp.learned_lesson || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-lg border border-slate-200 dark:border-slate-800 text-center space-y-2 shadow-sm">
          <Brain className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">No experiences have been stored yet.</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Use "Analyze Case" or "Run Learning Demo" to retain operational case decisions into Hindsight memory.
          </p>
        </div>
      )}
    </div>
  );
};
