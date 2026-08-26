import React from 'react';
import { useApp } from '../../context/AppContext';

export const ProfileView: React.FC = () => {
  const { userRole, setUserRole, submissions, comments, setCurrentView, startFeedback, showToast } = useApp();

  const savedComments = comments.filter((c) => c.isSaved);

  const handleResetData = () => {
    localStorage.clear();
    showToast('Reset Complete', 'Local storage data has been restored to default demo state.', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <div id="profile-view" className="space-y-10 animate-fadeIn pb-20 max-w-5xl">
      {/* Profile Header */}
      <div className="glass-panel p-8 md:p-10 rounded-2xl border border-[#181445]/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ambient-shadow">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#3525cd] to-[#674bb5] flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {userRole === 'student' ? 'school' : 'psychology'}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-epilogue text-2xl md:text-3xl font-bold text-[#181445]">
                {userRole === 'student' ? 'Alex Vance' : 'Dr. Evelyn Vance'}
              </h1>
              <span className="font-jetbrains text-xs uppercase px-2.5 py-1 rounded-full bg-[#efebff] text-[#3525cd] font-bold border border-[#3525cd]/15">
                {userRole === 'student' ? 'Student' : 'Faculty Lead'}
              </span>
            </div>
            <p className="font-manrope text-sm text-[#464555] mt-1">
              {userRole === 'student'
                ? 'Computer Science Undergraduate • Class of 2025'
                : 'Department of Computer Science & Engineering • Lumina Academy'}
            </p>
            <p className="font-jetbrains text-xs text-[#777587] mt-1">
              ID: LUM-8492019 • Anonymity Token Active
            </p>
          </div>
        </div>

        {/* Role switcher toggle */}
        <div className="flex flex-col gap-2">
          <label className="font-jetbrains text-xs text-[#777587] uppercase tracking-wider">
            Demo Persona Switcher
          </label>
          <div className="inline-flex rounded-xl bg-[#efebff] p-1 border border-[#3525cd]/15">
            <button
              onClick={() => {
                setUserRole('student');
                showToast('Switched to Student Mode', 'Viewing as student Alex', 'info');
              }}
              className={`px-4 py-1.5 rounded-lg font-jetbrains text-xs font-semibold transition-all ${
                userRole === 'student' ? 'bg-[#3525cd] text-white shadow-xs' : 'text-[#464555] hover:text-[#181445]'
              }`}
            >
              Student Mode
            </button>
            <button
              onClick={() => {
                setUserRole('faculty');
                showToast('Switched to Faculty Mode', 'Viewing as faculty instructor', 'info');
              }}
              className={`px-4 py-1.5 rounded-lg font-jetbrains text-xs font-semibold transition-all ${
                userRole === 'faculty' ? 'bg-[#3525cd] text-white shadow-xs' : 'text-[#464555] hover:text-[#181445]'
              }`}
            >
              Faculty Mode
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Submissions & Bookmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your Feedback Submissions */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-[#181445]/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-epilogue text-xl font-bold text-[#181445]">Submitted Feedbacks</h2>
              <span className="font-jetbrains text-xs font-bold text-[#3525cd] bg-[#e2dfff] px-2.5 py-0.5 rounded-full">
                {submissions.length} completed
              </span>
            </div>

            {submissions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="font-manrope text-sm text-[#464555]">No completed submissions yet.</p>
                <button
                  onClick={() => startFeedback('cs410', 1)}
                  className="mt-3 text-xs font-jetbrains font-semibold text-[#3525cd] hover:underline"
                >
                  Start Feedback for Computer Networks →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl bg-white/70 border border-[#181445]/[0.06] flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-epilogue font-bold text-sm text-[#181445]">{sub.courseName}</h4>
                      <p className="font-jetbrains text-xs text-[#777587] mt-0.5">{sub.submittedAt}</p>
                    </div>
                    <span className="font-jetbrains text-xs px-2.5 py-1 rounded-full bg-[#dcfce7] text-[#166534] font-medium">
                      {sub.overallSentiment}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bookmarked Insights */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-[#181445]/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-epilogue text-xl font-bold text-[#181445]">Saved Comments</h2>
              <span className="font-jetbrains text-xs font-bold text-[#674bb5] bg-[#e8ddff] px-2.5 py-0.5 rounded-full">
                {savedComments.length} saved
              </span>
            </div>

            {savedComments.length === 0 ? (
              <div className="py-8 text-center">
                <p className="font-manrope text-sm text-[#464555]">No bookmarked feedback items yet.</p>
                <p className="font-manrope text-xs text-[#777587] mt-1">
                  You can bookmark student quotes in the Faculty Intelligence Center.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedComments.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white/70 border border-[#181445]/[0.06] text-xs space-y-1.5"
                  >
                    <div className="flex justify-between text-[#777587] font-jetbrains text-[11px]">
                      <span className="font-medium text-[#3525cd]">{item.category} • {item.tag}</span>
                      <span>{item.date}</span>
                    </div>
                    <p className="font-manrope text-[#181445] italic">"{item.content}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setCurrentView('insights')}
            className="mt-6 w-full py-2.5 rounded-xl border border-[#674bb5] text-[#674bb5] font-jetbrains text-xs font-medium hover:bg-[#674bb5]/5 transition-colors text-center"
          >
            Explore Intelligence Center
          </button>
        </div>
      </div>

      {/* College Project Demo Utilities */}
      <div className="glass-panel p-6 rounded-2xl border border-[#181445]/[0.08] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-epilogue font-bold text-base text-[#181445]">Local Demo Storage Controls</h3>
          <p className="font-manrope text-xs text-[#464555] mt-0.5">
            This project runs entirely on React + Vite + localStorage with zero backend overhead.
          </p>
        </div>

        <button
          id="btn-reset-demo-storage"
          onClick={handleResetData}
          className="px-4 py-2.5 rounded-xl border border-[#ba1a1a] text-[#ba1a1a] font-jetbrains text-xs font-medium hover:bg-[#ba1a1a]/10 transition-colors"
        >
          Reset Demo Data
        </button>
      </div>
    </div>
  );
};
