import React from 'react';
import { Policy } from '../types';
import { Badge } from '../components/Badge';
import { BookOpen, ArrowRight } from 'lucide-react';

interface PolicyLibraryPageProps {
  policies: Policy[];
  onSelectPolicy: (policy: Policy) => void;
}

export const PolicyLibraryPage: React.FC<PolicyLibraryPageProps> = ({ policies, onSelectPolicy }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Policies</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The written rules and procedures used when evaluating operational decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((policy) => (
          <div
            key={policy.id}
            onClick={() => onSelectPolicy(policy)}
            className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-between cursor-pointer space-y-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                  <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <Badge type="status" value={policy.drift_status} />
              </div>

              <div>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {policy.code} • v{policy.version}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {policy.name}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {policy.description}
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Category:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-200">{policy.category}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Defined Steps:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-200">{policy.steps?.length || 0} Steps</span>
                </div>
              </div>

              {policy.summary_notes && (
                <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <span className="font-semibold text-slate-900 dark:text-white">Summary Notes:</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{policy.summary_notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
              <span>View Policy Workflow</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
