import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';

interface TopBarProps {
  variant?: 'standard' | 'task_focused' | 'review';
  onClose?: () => void;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  variant = 'standard',
  onClose,
  onBack,
  title,
}) => {
  const { currentView, setCurrentView, userRole, setUserRole, showToast } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  // If in review step, match Image 4: Top bar with "Lumina Academy", "Back to Edit", notification, settings, avatar
  if (variant === 'review') {
    return (
      <header
        id="top-bar-review"
        className="fixed top-0 left-0 w-full z-50 bg-[#fcf8ff]/90 backdrop-blur-xl border-b border-[#181445]/[0.08] flex justify-between items-center px-4 md:px-10 h-20 transition-all duration-300"
      >
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentView('home')}
            className="font-epilogue text-xl md:text-2xl font-bold text-[#3525cd] tracking-tight hover:opacity-90 transition-opacity"
          >
            Lumina Academy
          </button>
        </div>

        <nav className="hidden md:flex gap-6 items-center">
          <button
            id="btn-back-to-edit"
            onClick={onBack || (() => setCurrentView('feedback'))}
            className="flex items-center gap-2 text-[#464555] hover:text-[#181445] transition-colors py-1.5 px-3 rounded-lg hover:bg-[#efebff]"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span className="font-jetbrains text-[13px] font-medium tracking-wide">Back to Edit</span>
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            id="btn-topbar-notify"
            onClick={() => showToast('Notifications', 'You have no unread notifications.', 'info')}
            className="text-[#464555] hover:text-[#181445] hover:scale-105 transition-all p-2 rounded-full hover:bg-[#efebff]"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>

          <button
            id="btn-topbar-settings"
            onClick={() => showToast('Settings', 'Preferences: Dark mode, anonymity tokens, notification frequencies.', 'info')}
            className="text-[#464555] hover:text-[#181445] hover:scale-105 transition-all p-2 rounded-full hover:bg-[#efebff]"
            title="Settings"
          >
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </button>

          <div
            onClick={() => setCurrentView('profile')}
            className="w-9 h-9 rounded-full bg-[#efebff] overflow-hidden border border-[#181445]/[0.08] ml-1 cursor-pointer hover:ring-2 hover:ring-[#3525cd]/30 transition-all flex items-center justify-center"
            title="Student Profile: Alex"
          >
            <span className="material-symbols-outlined text-[#3525cd] text-[20px]">person</span>
          </div>
        </div>
      </header>
    );
  }

  // If task focused (Feedback space step 1-4, matching Image 2)
  if (variant === 'task_focused') {
    return (
      <header
        id="top-bar-task-focused"
        className="w-full h-20 bg-[#fcf8ff]/90 backdrop-blur-xl border-b border-[#181445]/[0.08] sticky top-0 z-50 flex justify-between items-center px-4 md:px-10"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('home')}
            className="font-epilogue text-xl md:text-2xl font-bold text-[#3525cd] tracking-tight hover:opacity-90"
          >
            Lumina Academy
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-close-feedback"
            onClick={onClose || (() => setCurrentView('home'))}
            className="flex items-center justify-center p-2 rounded-full text-[#464555] hover:text-[#181445] hover:bg-[#efebff] transition-colors"
            title="Close feedback and return home"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>
      </header>
    );
  }

  // Mobile Top Bar (default standard view)
  return (
    <>
      <header
        id="mobile-header"
        className="md:hidden flex justify-between items-center w-full px-5 h-16 bg-[#fcf8ff]/90 backdrop-blur-xl border-b border-[#181445]/[0.08] sticky top-0 z-50"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('home')}
            className="font-epilogue text-lg font-bold text-[#3525cd] tracking-tight"
          >
            Student Pulse
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Notifications', 'Feedback for Computer Networks closes in 3 days.', 'info')}
            className="text-[#3525cd] p-1.5 rounded-lg hover:bg-[#efebff]"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#3525cd] p-1.5 rounded-lg hover:bg-[#efebff]"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-[#fcf8ff] border-b border-[#181445]/[0.08] p-4 z-40 shadow-xl space-y-2 animate-fadeIn">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-jetbrains text-sm ${
              currentView === 'home' ? 'bg-[#e2dfff] text-[#3525cd] font-bold' : 'text-[#464555]'
            }`}
          >
            <span className="material-symbols-outlined">grid_view</span> Home
          </button>
          <button
            onClick={() => handleNavClick('courses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-jetbrains text-sm ${
              currentView === 'courses' ? 'bg-[#e2dfff] text-[#3525cd] font-bold' : 'text-[#464555]'
            }`}
          >
            <span className="material-symbols-outlined">auto_stories</span> Courses
          </button>
          <button
            onClick={() => handleNavClick('feedback')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-jetbrains text-sm ${
              currentView === 'feedback' ? 'bg-[#e2dfff] text-[#3525cd] font-bold' : 'text-[#464555]'
            }`}
          >
            <span className="material-symbols-outlined">rate_review</span> Feedback
          </button>
          <button
            onClick={() => handleNavClick('insights')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-jetbrains text-sm ${
              currentView === 'insights' ? 'bg-[#e2dfff] text-[#3525cd] font-bold' : 'text-[#464555]'
            }`}
          >
            <span className="material-symbols-outlined">monitoring</span> Insights (Faculty)
          </button>
          <button
            onClick={() => handleNavClick('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-jetbrains text-sm ${
              currentView === 'profile' ? 'bg-[#e2dfff] text-[#3525cd] font-bold' : 'text-[#464555]'
            }`}
          >
            <span className="material-symbols-outlined">account_circle</span> Profile
          </button>
        </div>
      )}
    </>
  );
};
