import React, { useState } from 'react';
import { api } from '../services/api';
import { AnalysisResult } from '../types';
import { StageLoader } from '../components/StageLoader';
import { RecommendationView } from './RecommendationView';
import { Brain, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';

interface DemoLearningJourneyPageProps {
  onRefreshMemoryCount: () => void;
  hindsightConfigured?: boolean;
}

export const DemoLearningJourneyPage: React.FC<DemoLearningJourneyPageProps> = ({
  onRefreshMemoryCount
}) => {
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [phaseMessage, setPhaseMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retainProgress, setRetainProgress] = useState<string | null>(null);

  const journeyCase = {
    policy_id: 'pol_onboarding_001',
    title: 'Low-Risk SME Client - Utility Bill Address Document Delay',
    description: 'A verified low-risk domestic SME client has a pending utility bill due to landlord office lease delay. Client provided verified state business registry QR check + active bank reference.',
    risk_level: 'Low' as const,
    expected_process: [
      '1. Identity Verification',
      '2. Document Verification (Collect Utility Bill)',
      '3. Risk Screening & AML Check',
      '4. Account Provisioning'
    ],
    actual_process: [
      '1. Identity Verification completed',
      '2. Substituted utility bill with verified state registry QR check + bank ref',
      '3. Risk Screening completed (Low Risk)',
      '4. Account Provisioning completed'
    ],
    reason_for_deviation: 'Landlord utility account transfer backlog.',
    additional_context: 'Digital business operating in shared corporate incubator.'
  };

  const handlePhase1ClearAndAnalyze = async () => {
    setIsProcessing(true);
    setAnalysisResult(null);
    setErrorMessage(null);
    setRetainProgress(null);

    try {
      await api.clearDemoMemory().catch(() => null);
      onRefreshMemoryCount();
      const res = await api.analyzeCase(journeyCase);
      setAnalysisResult(res);
      setPhaseMessage(
        `STAGE 1 — ZERO MEMORY: Memory bank cleared (0 prior memories). The agent conservatively enforces written SOP rules and rejects the deviation.`
      );
      setCurrentPhase(1);
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || 'Failed to execute Zero Memory analysis.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePhase2BuildMemory = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setRetainProgress('Retaining historical experiences into Hindsight Cloud persistent memory bank...');

    try {
      const res = await api.populateDemoCases();
      onRefreshMemoryCount();
      setRetainProgress(null);
      setPhaseMessage(
        `STAGE 2 — LEARN FROM EXPERIENCE: ${res.retained_count || 3} historical cases with human decisions & positive outcomes were retained into Hindsight Cloud memory bank!`
      );
      setCurrentPhase(2);
    } catch (e: any) {
      console.error(e);
      setRetainProgress(null);
      setErrorMessage(e.message || 'Failed to retain memories into Hindsight Cloud.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePhase3AnalyzeWithMemory = async () => {
    setIsProcessing(true);
    setAnalysisResult(null);
    setErrorMessage(null);
    setRetainProgress(null);

    try {
      const res = await api.analyzeCase(journeyCase);
      setAnalysisResult(res);
      setPhaseMessage(
        `STAGE 3 — USE EXPERIENCE: Hindsight Cloud recalled ${res.memory_count_influencing} historical experiences! The agent recognized the recurring successful exception pattern and recommended approving the alternative verification.`
      );
      setCurrentPhase(3);
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || 'Analysis request failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Learning Demo Journey
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Demonstrate how Policy Drift Agent evolves from a rigid written policy follower into an experienced organizational agent using Hindsight Cloud memory.
        </p>
      </div>

      {/* 3-STAGE STEPPER CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stage 1 */}
        <div className={`bg-white dark:bg-slate-900 p-5 rounded-lg border flex flex-col justify-between space-y-4 shadow-sm transition-all ${
          currentPhase === 1 ? 'border-amber-500 dark:border-amber-500/80 ring-1 ring-amber-500/30' : 'border-slate-200 dark:border-slate-800'
        }`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">Stage 01</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Zero Memory
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Zero Memory State</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Clears memory bank. Querying with zero prior experience forces the agent to conservatively enforce written SOP rules.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePhase1ClearAndAnalyze}
            disabled={isProcessing}
            className="w-full py-2.5 rounded-md font-semibold text-xs transition-colors flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white shadow-sm disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            <span>1. Test Zero-Memory State</span>
          </button>
        </div>

        {/* Stage 2 */}
        <div className={`bg-white dark:bg-slate-900 p-5 rounded-lg border flex flex-col justify-between space-y-4 shadow-sm transition-all ${
          currentPhase === 2 ? 'border-indigo-500 dark:border-indigo-500/80 ring-1 ring-indigo-500/30' : 'border-slate-200 dark:border-slate-800'
        }`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">Stage 02</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Retain Experience
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Build Memory</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Retains historical operational cases, human decisions & outcomes directly into Hindsight Cloud memory bank.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePhase2BuildMemory}
            disabled={isProcessing}
            className="w-full py-2.5 rounded-md font-semibold text-xs transition-colors flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-50"
          >
            <Brain className="w-4 h-4" />
            <span>2. Build Hindsight Memory</span>
          </button>
        </div>

        {/* Stage 3 */}
        <div className={`bg-white dark:bg-slate-900 p-5 rounded-lg border flex flex-col justify-between space-y-4 shadow-sm transition-all ${
          currentPhase === 3 ? 'border-emerald-500 dark:border-emerald-500/80 ring-1 ring-emerald-500/30' : 'border-slate-200 dark:border-slate-800'
        }`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">Stage 03</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Recall & Recommend
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Use Experience</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Recalls historical memories from Hindsight Cloud, recognizes recurring successful exception pattern, and recommends approving alternative verification.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePhase3AnalyzeWithMemory}
            disabled={isProcessing}
            className="w-full py-2.5 rounded-md font-semibold text-xs transition-colors flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>3. Test Post-Memory State</span>
          </button>
        </div>
      </div>

      {retainProgress && (
        <div className="p-4 rounded-md bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs sm:text-sm font-medium flex items-center space-x-3 shadow-sm">
          <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse shrink-0" />
          <span>{retainProgress}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-md bg-rose-50 dark:bg-rose-950/90 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm font-medium flex items-center space-x-3 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {phaseMessage && !errorMessage && (
        <div className="p-4 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium flex items-center space-x-3 shadow-sm">
          <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>{phaseMessage}</span>
        </div>
      )}

      {isProcessing && <StageLoader title="Running Learning Demo Step" subtitle="Communicating with Hindsight Cloud Persistent Memory Engine..." />}

      {analysisResult && !isProcessing && (
        <RecommendationView
          result={analysisResult}
          onReset={() => setAnalysisResult(null)}
          onSaved={() => onRefreshMemoryCount()}
        />
      )}
    </div>
  );
};
