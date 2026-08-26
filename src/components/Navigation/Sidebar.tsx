import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, userRole, setUserRole, startFeedback, showToast } = useApp();

  const navItems: { id: AppView; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'grid_view' },
    { id: 'courses', label: 'Courses', icon: 'auto_stories' },
    { id: 'feedback', label: 'Feedback', icon: 'rate_review' },
    { id: 'insights', label: 'Insights', icon: 'monitoring' },
    { id: 'profile', label: 'Profile', icon: 'account_circle' },
  ];

  const handleNavClick = (id: AppView) => {
    if (id === 'feedback') {
      startFeedback('cs410', 1);
    } else {
      setCurrentView(id);
    }
  };

  const toggleRole = () => {
    const nextRole = userRole === 'student' ? 'faculty' : 'student';
    setUserRole(nextRole);
    if (nextRole === 'faculty') {
      setCurrentView('insights');
      showToast('Switched to Faculty View', 'Viewing insights as Dr. Evelyn Vance / Dr. Rahul Mehta', 'info');
    } else {
      setCurrentView('home');
      showToast('Switched to Student View', 'Viewing portal as Alex (Student)', 'info');
    }
  };

  return (
    <nav
      id="main-sidebar"
      className="hidden md:flex flex-col py-8 fixed left-0 top-0 h-full z-40 bg-[#fcf8ff] border-r border-[#181445]/[0.08] shadow-sm w-20 hover:w-64 transition-all duration-500 overflow-hidden group select-none"
    >
      {/* Brand Header */}
      <div className="px-5 mb-8 flex items-center gap-3 whitespace-nowrap overflow-hidden">
        <div className="w-10 h-10 rounded-full bg-[#3525cd]/10 flex items-center justify-center shrink-0 border border-[#3525cd]/20">
          <span className="material-symbols-outlined text-[#3525cd] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            school
          </span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col">
          <span className="font-epilogue font-bold text-[#3525cd] text-lg leading-tight tracking-tight">
            Student Pulse
          </span>
          <span className="font-jetbrains text-[11px] text-[#464555] tracking-wide">
            Academic Year 2024
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex-1 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive =
            currentView === item.id ||
            (item.id === 'feedback' && (currentView === 'feedback' || currentView === 'summary' || currentView === 'success'));

          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 text-left ${
                isActive
                  ? 'text-[#3525cd] font-bold bg-[#e2dfff] shadow-sm translate-x-1'
                  : 'text-[#464555] hover:bg-[#e9e5ff] hover:text-[#181445]'
              }`}
            >
              <span
                className="material-symbols-outlined shrink-0 text-[24px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="ml-4 font-jetbrains text-[12px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quick Feedback CTA in Sidebar */}
      <div className="px-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          id="btn-quick-feedback-sidebar"
          onClick={() => startFeedback('cs410', 1)}
          className="w-full bg-[#3525cd] text-white py-3 px-3 rounded-xl font-jetbrains text-[12px] font-medium tracking-wider flex items-center justify-center gap-2 hover:bg-[#4f46e5] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0px_4px_16px_rgba(53,37,205,0.2)]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Quick Feedback</span>
        </button>
      </div>

      {/* Bottom Utilities: Role switcher & Help */}
      <div className="px-3 mt-auto space-y-2 border-t border-[#181445]/[0.08] pt-4">
        <button
          id="btn-sidebar-role-toggle"
          onClick={toggleRole}
          className="w-full flex items-center px-3 py-2.5 rounded-xl text-[#464555] hover:bg-[#e9e5ff] hover:text-[#181445] transition-colors text-left"
          title={`Switch to ${userRole === 'student' ? 'Faculty Mode' : 'Student Mode'}`}
        >
          <span className="material-symbols-outlined shrink-0 text-[20px]">
            {userRole === 'student' ? 'badge' : 'person'}
          </span>
          <span className="ml-4 font-jetbrains text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {userRole === 'student' ? 'Switch to Faculty' : 'Switch to Student'}
          </span>
        </button>

        <button
          id="btn-sidebar-help"
          onClick={() => showToast('Student Pulse Help', 'Feedback is anonymous and securely processed for course improvement.', 'info')}
          className="w-full flex items-center px-3 py-2 rounded-xl text-[#464555] hover:bg-[#e9e5ff] hover:text-[#181445] transition-colors text-left"
        >
          <span className="material-symbols-outlined shrink-0 text-[20px]">help_outline</span>
          <span className="ml-4 font-jetbrains text-[12px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Help
          </span>
        </button>
      </div>
    </nav>
  );
};
