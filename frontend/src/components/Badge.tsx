import React from 'react';

interface BadgeProps {
  type: 'risk' | 'status' | 'outcome' | 'deviation';
  value: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, value, className = '' }) => {
  let colorStyle = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  if (type === 'risk') {
    const valLower = value.toLowerCase();
    if (valLower === 'low') {
      colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-800/60';
    } else if (valLower === 'medium') {
      colorStyle = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-800/60';
    } else if (valLower === 'high' || valLower === 'critical') {
      colorStyle = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-800/60';
    }
  } else if (type === 'status') {
    const valLower = value.toLowerCase();
    if (valLower.includes('compliant') || valLower.includes('stable')) {
      colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-800/60';
    } else if (valLower.includes('minor') || valLower.includes('pattern') || valLower.includes('monitoring')) {
      colorStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800/60';
    } else if (valLower.includes('review') || valLower.includes('suggested')) {
      colorStyle = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-800/60';
    } else if (valLower.includes('risk') || valLower.includes('breach') || valLower.includes('drift')) {
      colorStyle = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-800/60';
    }
  } else if (type === 'outcome') {
    const valLower = value.toLowerCase();
    if (valLower === 'successful' || valLower === 'positive') {
      colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-800/60';
    } else if (valLower.includes('partially')) {
      colorStyle = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-800/60';
    } else if (valLower === 'unsuccessful' || valLower === 'negative') {
      colorStyle = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-800/60';
    }
  } else if (type === 'deviation') {
    colorStyle = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800/60';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorStyle} ${className}`}>
      {value}
    </span>
  );
};
