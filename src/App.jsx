import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { HealthProvider } from './context/HealthContext';
import { SearchProvider } from './context/SearchContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
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
import ActivePlanPage from './pages/ActivePlanPage';
import TotalCarePlanPage from './pages/TotalCarePlanPage';
import ExpertListingPage from './pages/ExpertListingPage';
import SearchResultsPage from './pages/SearchResultsPage';
import BookConsultationPage from './pages/BookConsultationPage';
import TrainerConsultationPage from './pages/TrainerConsultationPage';
import PaymentPage from './pages/PaymentPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SettingsPage from './pages/SettingsPage';
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
      <AuthProvider>
        <SettingsProvider>
          <HealthProvider>
            <SearchProvider>
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
              <Route path="/pricing/active" element={<ActivePlanPage />} />
              <Route path="/pricing/total" element={<TotalCarePlanPage />} />
              <Route path="/experts/:type" element={<ExpertListingPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/book/:trainerId" element={<BookConsultationPage />} />
              <Route path="/trainer-dashboard/:trainerId" element={<TrainerConsultationPage />} />
              <Route path="/payment" element={<PaymentPage />} />

              {/* Core Health Tools (from previous version) */}
              <Route path="/bmi" element={<BMICalculator />} />
              <Route path="/bp" element={<BPChecker />} />
              <Route path="/advisor" element={<HealthAdvisor />} />
              <Route path="/library" element={<YogaLibrary />} />

              {/* Auth Pages */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />

              {/* Settings */}
              <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </AppLayout>
            </Router>
            </SearchProvider>
          </HealthProvider>
        </SettingsProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
