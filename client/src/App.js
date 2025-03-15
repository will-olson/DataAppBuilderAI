// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/common/Layout';

// Existing imports
import Dashboard from './components/pages/Dashboard';
import SegmentationPage from './components/pages/Segmentation';
import UserJourneyPage from './components/pages/UserJourney';
import PersonalizationPage from './components/pages/PersonalizationPage';
import ChurnPredictionPage from './components/pages/ChurnPredictionPage';
import FeatureUsagePage from './components/pages/FeatureUsagePage';
import ReferralGrowthPage from './components/pages/ReferralGrowthPage';
import DataExplorationPage from './components/pages/DataExplorationPage';

// New AI-Driven Insight Pages
import StrategicAnalysisPage from './components/pages/StrategicAnalysisPage';
import ABTestingPage from './components/pages/ABTestingPage';
import PredictiveInsightsPage from './components/pages/PredictiveInsightsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Existing Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/segmentation" element={<SegmentationPage />} />
          <Route path="/user-journey" element={<UserJourneyPage />} />
          <Route path="/personalization" element={<PersonalizationPage />} />
          <Route path="/churn-prediction" element={<ChurnPredictionPage />} />
          <Route path="/referral-insights" element={<ReferralGrowthPage />} />
          <Route path="/feature-usage" element={<FeatureUsagePage />} />
          <Route path="/data-exploration" element={<DataExplorationPage />} />

          {/* New AI-Driven Insight Routes */}
          <Route path="/strategic-analysis" element={<StrategicAnalysisPage />} />
          <Route path="/ab-testing" element={<ABTestingPage />} />
          <Route path="/predictive-insights" element={<PredictiveInsightsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;