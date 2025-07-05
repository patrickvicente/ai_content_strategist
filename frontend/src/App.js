import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Platforms from './pages/Platforms.jsx';
import ContentPillars from './pages/ContentPillars.jsx';
import ContentIdeas from './pages/ContentIdeas.jsx';
import ContentManager from './pages/ContentManager.jsx';
import Tasks from './pages/Tasks.jsx';
import Analytics from './pages/Analytics.jsx';
import AIStrategy from './pages/AIStrategy.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 