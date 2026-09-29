import React, { useEffect, useState } from 'react';
import { Brain, CheckCircle2, Loader2, Search, ShieldAlert, Sparkles } from 'lucide-react';

interface StageLoaderProps {
  title?: string;
  subtitle?: string;
}

export const StageLoader: React.FC<StageLoaderProps> = ({
  title = "Analyzing Operational Case",
  subtitle = "Connecting to Hindsight Persistent Memory Engine"
}) => {
  const [currentStage, setCurrentStage] = useState<number>(1);

  const stages = [
    { id: 1, label: 'Understanding Policy & Procedure', icon: Search, desc: 'Parsing written SOP step definitions...' },
    { id: 2, label: 'Detecting Operational Deviation', icon: ShieldAlert, desc: 'Comparing expected process vs actual execution...' },
    { id: 3, label: 'Recalling Hindsight Memory', icon: Brain, desc: 'Querying Hindsight Cloud persistent memory bank...' },
    { id: 4, label: 'Comparing Historical Cases', icon: Sparkles, desc: 'Evaluating human decisions, risk factors & past outcomes...' },
    { id: 5, label: 'Generating Evidence-Based Recommendation', icon: CheckCircle2, desc: 'Synthesizing organizational experience & drift detection...' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev < 5 ? prev + 1 : 5));
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-2 border border-indigo-200 dark:border-indigo-800">
          <Brain className="w-7 h-7 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">{subtitle}</p>
      </div>

      <div className="space-y-3">
        {stages.map((stage) => {
          const isDone = currentStage > stage.id;
          const isCurrent = currentStage === stage.id;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className={`flex items-start space-x-3 p-3 rounded-md transition-all ${
                isCurrent
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-slate-900 dark:text-white'
                  : isDone
                  ? 'bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  : 'bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 text-slate-400 dark:text-slate-500 opacity-60'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`font-semibold text-xs sm:text-sm truncate ${
                    isCurrent
                      ? 'text-indigo-900 dark:text-indigo-300 font-bold'
                      : isDone
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    Stage {stage.id}: {stage.label}
                  </h4>
                  {isCurrent && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono shrink-0">
                      Processing...
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-mono shrink-0">
                      Complete
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
