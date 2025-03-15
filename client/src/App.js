// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './components/pages/Dashboard';
import SegmentationPage from './components/pages/Segmentation';
import UserJourneyPage from './components/pages/UserJourney';
import PersonalizationPage from './components/pages/PersonalizationPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/segmentation" element={<SegmentationPage />} />
          <Route path="/user-journey" element={<UserJourneyPage />} />
          <Route path="/personalization" element={<PersonalizationPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;