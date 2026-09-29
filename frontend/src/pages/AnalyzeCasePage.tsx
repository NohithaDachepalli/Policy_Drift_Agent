import React, { useState } from 'react';
import { Policy, CaseSubmissionPayload, AnalysisResult } from '../types';
import { StageLoader } from '../components/StageLoader';
import { RecommendationView } from './RecommendationView';
import { api } from '../services/api';
import { Brain, Plus, Trash2, ArrowRight } from 'lucide-react';

interface AnalyzeCasePageProps {
  policies: Policy[];
  initialPolicyId?: string;
  onExperienceSaved?: () => void;
}

export const AnalyzeCasePage: React.FC<AnalyzeCasePageProps> = ({
  policies,
  initialPolicyId,
  onExperienceSaved
}) => {
  const defaultPolicyId = initialPolicyId || (policies.length > 0 ? policies[0].id : 'pol_onboarding_001');
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(defaultPolicyId);
  const [title, setTitle] = useState<string>('Low-Risk Repeat Enterprise Account Onboarding');
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Low');
  const [description, setDescription] = useState<string>(
    'Long-standing corporate client expanding to a new subsidiary. Secondary utility bill was unavailable due to office lease delay.'
  );
  const [reason, setReason] = useState<string>('Commercial lease execution pending landlord utility account transfer.');
  const [context, setContext] = useState<string>('Client provided state corporate registry link + active bank reference.');

  const [expectedSteps, setExpectedSteps] = useState<string[]>([
    '1. Identity Verification',
    '2. Document Verification (Utility Bill)',
    '3. Risk Screening & AML Check',
    '4. Manager Approval (High-Risk Cases)',
    '5. Account Provisioning'
  ]);

  const [actualSteps, setActualSteps] = useState<string[]>([
    '1. Identity Verification completed',
    '2. Waived standard utility bill; verified state registry QR link + bank reference',
    '3. Risk Screening completed (Low Risk)',
    '4. Account Provisioned'
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadLowRiskPreset = () => {
    setSelectedPolicyId('pol_onboarding_001');
    setTitle('Low-Risk Client - Missing Utility Bill with Bank Reference');
    setRiskLevel('Low');
    setDescription('Verified low-risk corporate client. Physical address utility bill delayed by landlord.');
    setReason('Landlord utility transfer delay.');
    setContext('Provided valid state business registry QR check + active bank reference.');
    setExpectedSteps([
      '1. Identity Verification',
      '2. Document Verification (Utility Bill)',
      '3. Risk Screening',
      '4. Account Provisioning'
    ]);
    setActualSteps([
      '1. Identity Verification completed',
      '2. Substituted utility bill with verified state registry QR check + bank ref',
      '3. Risk Screening completed (Low Risk)',
      '4. Account Provisioning completed'
    ]);
    setAnalysisResult(null);
  };

  const loadHighRiskPreset = () => {
    setSelectedPolicyId('pol_onboarding_001');
    setTitle('High-Risk Foreign Entity - Skipped Manager Approval');
    setRiskLevel('High');
    setDescription('High-net-worth foreign offshore account. Sales team bypassed Manager Approval to meet timeline.');
    setReason('Client requested fast-track activation.');
    setContext('Sanctions check flagged offshore PEP association.');
    setExpectedSteps([
      '1. Identity Verification',
      '2. Document Verification',
      '3. Risk Screening (High Risk)',
      '4. Manager Approval (Mandatory Sign-off)',
      '5. Account Provisioning'
    ]);
    setActualSteps([
      '1. Identity Verification completed',
      '2. Document Verification completed',
      '3. Risk Screening flagged High Risk',
      '4. SKIPPED Manager Approval',
      '5. Account Provisioned directly'
    ]);
    setAnalysisResult(null);
  };

  const handleAddExpected = () => setExpectedSteps([...expectedSteps, '']);
  const handleRemoveExpected = (idx: number) => setExpectedSteps(expectedSteps.filter((_, i) => i !== idx));

  const handleAddActual = () => setActualSteps([...actualSteps, '']);
  const handleRemoveActual = (idx: number) => setActualSteps(actualSteps.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setErrorMsg(null);

    const payload: CaseSubmissionPayload = {
      policy_id: selectedPolicyId,
      title,
      description,
      risk_level: riskLevel,
      expected_process: expectedSteps.filter(s => s.trim() !== ''),
      actual_process: actualSteps.filter(s => s.trim() !== ''),
      reason_for_deviation: reason,
      additional_context: context
    };

    try {
      const result = await api.analyzeCase(payload);
      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to communicate with analysis server.');
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing && !analysisResult) {
    return <StageLoader />;
  }

  if (analysisResult) {
    return (
      <RecommendationView
        result={analysisResult}
        onReset={() => setAnalysisResult(null)}
        onSaved={() => {
          if (onExperienceSaved) onExperienceSaved();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER & WORKFLOW MAP */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Analyze Operational Case
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Submit a case against written policy. Hindsight persistent memory will recall relevant past experiences to inform recommendations.
          </p>
        </div>

        {/* WORKFLOW STEPS STEPER */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
              1. Current Case
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              2. Applicable Policy
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              3. Relevant Experience
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              4. Agent Analysis
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              5. Recommendation
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              6. Human Decision
            </span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* FORM & PRESETS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* CASE INPUT FORM */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Case & Policy Input
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Target Policy SOP
                </label>
                <select
                  value={selectedPolicyId}
                  onChange={(e) => setSelectedPolicyId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {policies.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code} v{p.version})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Risk Tier
                </label>
                <select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Low">Low Risk Tier</option>
                  <option value="Medium">Medium Risk Tier</option>
                  <option value="High">High Risk Tier</option>
                  <option value="Critical">Critical Risk Tier</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Case Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Low-Risk Enterprise Onboarding Utility Bill Waiver"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Situation Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe operational context and customer details..."
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Operational Process & Deviations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Expected Process (SOP)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddExpected}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Step</span>
                  </button>
                </div>
                {expectedSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => {
                        const newArr = [...expectedSteps];
                        newArr[idx] = e.target.value;
                        setExpectedSteps(newArr);
                      }}
                      className="flex-1 px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                    {expectedSteps.length > 1 && (
                      <button type="button" onClick={() => handleRemoveExpected(idx)} className="text-slate-400 hover:text-rose-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Actual Executed Process
                  </label>
                  <button
                    type="button"
                    onClick={handleAddActual}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Step</span>
                  </button>
                </div>
                {actualSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => {
                        const newArr = [...actualSteps];
                        newArr[idx] = e.target.value;
                        setActualSteps(newArr);
                      }}
                      className="flex-1 px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                    {actualSteps.length > 1 && (
                      <button type="button" onClick={() => handleRemoveActual(idx)} className="text-slate-400 hover:text-rose-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Reason for Deviation</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Utility bill delayed by landlord office"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Additional Context</label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. State corporate QR verification link provided"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center space-x-2"
          >
            <Brain className="w-4 h-4 text-white" />
            <span>Analyze Case with Hindsight Memory</span>
          </button>
        </form>

        {/* SIDEBAR PRESETS */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Sample Case Scenarios</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Load predefined cases to test how accumulated Hindsight memory alters recommendations.
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={loadLowRiskPreset}
                className="w-full p-3 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left text-xs transition-colors space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>Low-Risk Exception</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">Low</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">Waived utility bill replaced with state registry QR verification.</p>
              </button>

              <button
                type="button"
                onClick={loadHighRiskPreset}
                className="w-full p-3 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left text-xs transition-colors space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>High-Risk Bypass</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">High</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">Bypassed mandatory Manager Approval on offshore entity.</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
