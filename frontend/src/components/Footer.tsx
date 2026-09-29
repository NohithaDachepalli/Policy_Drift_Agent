import React from 'react';
import { Brain, Shield, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 sm:mt-24 border-t border-slate-200 dark:border-slate-900 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2 text-center md:text-left">
            <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Policy Drift Agent</span>
            <span className="hidden sm:inline">— Persistent Hindsight Memory Hackathon Project</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <span className="flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Zero-Credential Safe Architecture</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Hindsight Persistent Memory + Groq Reasoning</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
