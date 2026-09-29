import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  label: string;
  description: string;
  icon: LucideIcon;
  color: 'indigo' | 'purple' | 'amber' | 'emerald';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  label,
  description,
  icon: Icon,
  color
}) => {
  const colorMap = {
    indigo: {
      bgIcon: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20',
      textValue: 'text-indigo-600 dark:text-indigo-400',
      badge: 'text-indigo-600 dark:text-indigo-300'
    },
    purple: {
      bgIcon: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
      textValue: 'text-purple-600 dark:text-purple-400',
      badge: 'text-purple-600 dark:text-purple-300'
    },
    amber: {
      bgIcon: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
      textValue: 'text-amber-600 dark:text-amber-400',
      badge: 'text-amber-600 dark:text-amber-300'
    },
    emerald: {
      bgIcon: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
      textValue: 'text-emerald-600 dark:text-emerald-400',
      badge: 'text-emerald-600 dark:text-emerald-400'
    }
  };

  const currentTheme = colorMap[color];

  return (
    <div className="glass-card glass-card-hover p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${currentTheme.bgIcon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
            {value}
          </span>
          <span className={`text-xs font-bold ${currentTheme.badge}`}>{label}</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-normal">
          {description}
        </p>
      </div>
    </div>
  );
};
