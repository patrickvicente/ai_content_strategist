import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserIcon, 
  DevicePhoneMobileIcon, 
  LightBulbIcon, 
  DocumentTextIcon, 
  ClipboardDocumentListIcon, 
  CheckCircleIcon, 
  ChartBarIcon, 
  CpuChipIcon 
} from '@heroicons/react/24/outline';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: '🏠 Dashboard', icon: '🏠' },
    { path: '/profile', label: '👤 Profile', icon: '👤' },
    { path: '/platforms', label: '📱 Platforms', icon: '📱' },
    { path: '/content-pillars', label: '🏛️ Content Pillars', icon: '🏛️' },
    { path: '/content-ideas', label: '💡 Content Ideas', icon: '💡' },
    { path: '/content-manager', label: '📋 Content Manager', icon: '📋' },
    { path: '/tasks', label: '✅ Tasks', icon: '✅' },
    { path: '/analytics', label: '📊 Analytics', icon: '📊' },
    { path: '/trend-analytics', label: '📈 Trend Analytics', icon: '📈' },
    { path: '/ai-strategy', label: '🤖 AI Strategy', icon: '🤖' },
  ];

  return (
    <nav className="bg-dark-card border-b border-dark-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center px-4 py-2 text-accent-gold font-bold text-xl hover:text-accent-red transition-colors"
            >
              🎯 AI Content Strategist
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-accent-green text-text-primary shadow-md transform scale-105'
                    : 'text-text-primary hover:bg-dark-hover hover:text-accent-gold'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label.split(' ').slice(1).join(' ')}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-primary hover:text-accent-gold hover:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-accent-gold transition-colors"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-card border-t border-dark-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-accent-green text-text-primary shadow-md'
                    : 'text-text-primary hover:bg-dark-hover hover:text-accent-gold'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label.split(' ').slice(1).join(' ')}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation; 