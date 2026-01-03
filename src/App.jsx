import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { HealthProvider } from './context/HealthContext';
import AppLayout from './components/AppLayout';
import HomeDashboard from './pages/HomeDashboard';
import HealthAssessmentWizard from './pages/HealthAssessmentWizard';
import HealthScoreDashboard from './pages/HealthScoreDashboard';
import HealthPlanPage from './pages/HealthPlanPage';
import ProgressTracker from './pages/ProgressTracker';
import AIChatAssistant from './pages/AIChatAssistant';
import BMICalculator from './pages/BMICalculator';
import BPChecker from './pages/BPChecker';
import HealthAdvisor from './pages/HealthAdvisor';
import YogaLibrary from './pages/YogaLibrary';
import PricingPage from './pages/PricingPage';
import ExpertListingPage from './pages/ExpertListingPage';
import './App.css';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2d6a4f',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#ff4d4f',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, sans-serif",
        },
        components: {
          Card: {
            boxShadowTertiary: '0 4px 12px rgba(0,0,0,0.03)',
          },
          Button: {
            borderRadius: 6,
            fontWeight: 500,
          }
        }
      }}
    >
      <HealthProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* Main Wellness Flow */}
              <Route path="/" element={<HomeDashboard />} />
              <Route path="/assessment" element={<HealthAssessmentWizard />} />
              <Route path="/score-dashboard" element={<HealthScoreDashboard />} />
              <Route path="/health-plan" element={<HealthPlanPage />} />
              <Route path="/tracker" element={<ProgressTracker />} />
              <Route path="/chat" element={<AIChatAssistant />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/experts/:type" element={<ExpertListingPage />} />
              
              {/* Core Health Tools (from previous version) */}
              <Route path="/bmi" element={<BMICalculator />} />
              <Route path="/bp" element={<BPChecker />} />
              <Route path="/advisor" element={<HealthAdvisor />} />
              <Route path="/library" element={<YogaLibrary />} />
            </Routes>
          </AppLayout>
        </Router>
      </HealthProvider>
    </ConfigProvider>
  );
};

export default App;
