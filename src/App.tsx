import React from 'react';
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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
