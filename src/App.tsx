import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Navigation/Sidebar';
import { TopBar } from './components/Navigation/TopBar';
import { HomeView } from './components/Dashboard/HomeView';
import { FeedbackContainer } from './components/Feedback/FeedbackContainer';
import { FacultyIntelligenceView } from './components/Faculty/FacultyIntelligenceView';
import { CoursesView } from './components/Courses/CoursesView';
import { ProfileView } from './components/Profile/ProfileView';
import { Toast } from './components/Shared/Toast';
import { ActivityModal } from './components/Activity/ActivityModal';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application caught error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('sp_courses_v2');
    localStorage.removeItem('sp_submissions_v1');
    localStorage.removeItem('sp_activities_v1');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fcf8ff] flex items-center justify-center p-6 text-[#181445]">
          <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-[#ba1a1a]/20 shadow-lg text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">error_outline</span>
            </div>
            <h2 className="font-epilogue text-2xl font-bold">Something went wrong</h2>
            <p className="font-manrope text-sm text-[#464555]">
              {this.state.error?.message || 'An unexpected render error occurred.'}
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-[#3525cd] text-white py-3 rounded-xl font-jetbrains text-xs font-semibold hover:bg-[#4f46e5] transition-all"
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  const isFeedbackFlow = currentView === 'feedback' || currentView === 'summary' || currentView === 'success';

  // For the focused multi-step feedback experience, render the full-canvas container
  if (isFeedbackFlow) {
    return (
      <div className="min-h-screen bg-[#fcf8ff] text-[#181445] font-['Manrope',sans-serif]">
        <FeedbackContainer />
        <Toast />
        <ActivityModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf8ff] text-[#181445] font-['Manrope',sans-serif] flex flex-col md:flex-row">
      {/* Expanding Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-20 min-h-screen flex flex-col">
        {/* Top bar on mobile */}
        <TopBar variant="standard" />

        {/* Dynamic Desktop Header if needed */}
        <header className="hidden md:flex justify-between items-center px-8 lg:px-12 py-6 border-b border-[#181445]/[0.05]">
          <div>
            <span className="font-jetbrains text-xs text-[#674bb5] font-bold uppercase tracking-wider">
              Lumina Academy • Student Pulse
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-jetbrains text-xs text-[#777587]">Spring Semester 2024</span>
          </div>
        </header>

        {/* Dynamic Main View */}
        <main className="flex-1 p-5 sm:p-8 md:p-12 lg:px-16 overflow-y-auto">
          {currentView === 'home' && <HomeView />}
          {currentView === 'insights' && <FacultyIntelligenceView />}
          {currentView === 'courses' && <CoursesView />}
          {currentView === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Global Notifications & Modals */}
      <Toast />
      <ActivityModal />
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
