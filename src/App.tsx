import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { useInitialData } from './hooks/useInitialData';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Portfolio from './components/Portfolio';
import Journal from './components/Journal';
import Onboarding from './components/Onboarding';

const AppContent: React.FC = () => {
  const { state } = useApp();
  
  // Initialize sample data
  useInitialData();

  // Show onboarding for new users
  if (!state.user || state.currentView === 'onboarding') {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.currentView === 'dashboard' && <Dashboard />}
        {state.currentView === 'projects' && <Projects />}
        {state.currentView === 'portfolio' && <Portfolio />}
        {state.currentView === 'journal' && <Journal />}
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
