import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NetworkBackground } from './components/NetworkBackground';
import { DashboardPage } from './pages/DashboardPage';
import { PolicyLibraryPage } from './pages/PolicyLibraryPage';
import { PolicyDetailPage } from './pages/PolicyDetailPage';
import { AnalyzeCasePage } from './pages/AnalyzeCasePage';
import { MemoryTimelinePage } from './pages/MemoryTimelinePage';
import { LearningInsightsPage } from './pages/LearningInsightsPage';
import { DemoLearningJourneyPage } from './pages/DemoLearningJourneyPage';
import { api } from './services/api';
import { useTheme } from './hooks/useTheme';
import { Policy, RetainedExperience, PatternInsight, DashboardOverview, HealthCheckResponse } from './types';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null);

  const [timelineData, setTimelineData] = useState<{
    hindsight_configured: boolean;
    bank_id: string;
    stats: {
      total_retained_experiences: number;
      recurring_patterns_discovered: number;
      policy_review_candidates: number;
      successful_exception_rate: number;
    };
    experiences: RetainedExperience[];
  }>({
    hindsight_configured: false,
    bank_id: 'policy-drift-memory-bank-01',
    stats: {
      total_retained_experiences: 0,
      recurring_patterns_discovered: 0,
      policy_review_candidates: 0,
      successful_exception_rate: 0.0
    },
    experiences: []
  });

  const [insights, setInsights] = useState<PatternInsight[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);

  const fetchAllData = async () => {
    try {
      const [health, polData, timeData, insData, dashData] = await Promise.all([
        api.getHealth().catch(() => null),
        api.getPolicies().catch(() => []),
        api.getMemoryTimeline().catch(() => ({
          hindsight_configured: false,
          bank_id: 'policy-drift-memory-bank-01',
          stats: {
            total_retained_experiences: 0,
            recurring_patterns_discovered: 0,
            policy_review_candidates: 0,
            successful_exception_rate: 0.0
          },
          experiences: []
        })),
        api.getInsights().catch(() => []),
        api.getDashboard().catch(() => null)
      ]);

      if (health) setHealthStatus(health);
      if (polData.length) setPolicies(polData);
      if (timeData) setTimelineData(timeData);
      if (insData) setInsights(insData);
      if (dashData) setDashboardData(dashData);
    } catch (err) {
      console.error('Data fetch error:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleResetMemory = async () => {
    try {
      await api.resetMemory();
      await fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectPolicy = (pol: Policy) => {
    setSelectedPolicy(pol);
    setActiveTab('policy_detail');
  };

  const isHindsightConfigured = healthStatus?.hindsight_configured ?? timelineData.hindsight_configured;

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Background Container */}
      <NetworkBackground theme={theme} />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'policy_detail') setSelectedPolicy(null);
        }}
        memoryCount={timelineData.stats.total_retained_experiences}
        hindsightConfigured={isHindsightConfigured}
        onResetMemory={handleResetMemory}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {activeTab === 'dashboard' && (
          <DashboardPage
            data={dashboardData}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'policies' && (
          <PolicyLibraryPage
            policies={policies}
            onSelectPolicy={handleSelectPolicy}
          />
        )}

        {activeTab === 'policy_detail' && selectedPolicy && (
          <PolicyDetailPage
            policy={selectedPolicy}
            historicalCases={timelineData.experiences}
            onBack={() => setActiveTab('policies')}
            onAnalyzeCase={() => setActiveTab('analyze')}
          />
        )}

        {activeTab === 'analyze' && (
          <AnalyzeCasePage
            policies={policies}
            initialPolicyId={selectedPolicy?.id}
            onExperienceSaved={fetchAllData}
          />
        )}

        {activeTab === 'memory' && (
          <MemoryTimelinePage
            stats={timelineData.stats}
            experiences={timelineData.experiences}
            hindsightConfigured={isHindsightConfigured}
          />
        )}

        {activeTab === 'insights' && (
          <LearningInsightsPage insights={insights} />
        )}

        {activeTab === 'demo_journey' && (
          <DemoLearningJourneyPage
            onRefreshMemoryCount={fetchAllData}
            hindsightConfigured={isHindsightConfigured}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
