import React, { useState } from 'react';
import { Brain, BookOpen, Layers, BarChart3, PlusCircle, RefreshCw, Menu, X, Cloud, CloudOff } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Theme } from '../hooks/useTheme';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  memoryCount: number;
  hindsightConfigured?: boolean;
  onResetMemory?: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  memoryCount,
  hindsightConfigured = false,
  onResetMemory,
  theme,
  toggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Clean 5 primary navbar items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'policies', label: 'Policies', icon: BookOpen },
    { id: 'analyze', label: 'Analyze Case', icon: PlusCircle },
    { id: 'memory', label: 'Memory', icon: Layers },
    { id: 'insights', label: 'Insights', icon: Brain }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* BRAND LOGO - Compact flex element with shrink-0 to prevent compression */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer shrink-0 select-none"
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                Policy Drift Agent
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                Decision Support System
              </span>
            </div>
          </div>

          {/* PRIMARY NAVIGATION - Visible on Desktop/Laptop (lg >= 1024px) */}
          <nav className="hidden lg:flex items-center space-x-1 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT SIDE UTILITIES - Hindsight Status, Memory Count, Theme Toggle */}
          <div className="flex items-center space-x-2.5 shrink-0">
            
            {/* Status Badge */}
            <div className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md border text-xs font-mono font-medium ${
              hindsightConfigured
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400'
                : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400'
            }`}>
              {hindsightConfigured ? <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <CloudOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
              <span>{hindsightConfigured ? 'HINDSIGHT: READY' : 'HINDSIGHT: UNCONFIGURED'}</span>
            </div>

            {/* Memory Count */}
            <div className="hidden xl:flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
              <span className="text-slate-500 dark:text-slate-400">Memories:</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white">{memoryCount}</span>
            </div>

            {/* Reset Memory Button */}
            {onResetMemory && (
              <button
                type="button"
                onClick={onResetMemory}
                title="Clear / Reset Hindsight memory bank"
                aria-label="Reset memory bank"
                className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            {/* Mobile Toggle (< 1024px) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET NAV DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-4 space-y-2 shadow-lg">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>Memories in Hindsight: <strong className="text-slate-900 dark:text-white font-mono">{memoryCount}</strong></span>
            <span className={`font-mono font-medium ${hindsightConfigured ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {hindsightConfigured ? 'HINDSIGHT: READY' : 'UNCONFIGURED'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors w-full text-left ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
