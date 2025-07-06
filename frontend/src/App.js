import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Platforms from './pages/Platforms';
import ContentPillars from './pages/ContentPillars';
import ContentIdeas from './pages/ContentIdeas';
import ContentManager from './pages/ContentManager';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import AIStrategy from './pages/AIStrategy';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import './App.css';

function App() {
  useEffect(() => {
    // Apply dark mode class to html element
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }, []);

  return (
    <div className="App dark bg-dark-bg min-h-screen text-text-primary">
      <Router>
        <div className="min-h-screen bg-dark-bg">
          <Navigation />
          <main className="bg-dark-bg text-text-primary">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/platforms" element={<Platforms />} />
              <Route path="/content-pillars" element={<ContentPillars />} />
              <Route path="/content-ideas" element={<ContentIdeas />} />
              <Route path="/content-manager" element={<ContentManager />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/ai-strategy" element={<AIStrategy />} />
              <Route path="/trend-analytics" element={<AnalyticsDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App; 