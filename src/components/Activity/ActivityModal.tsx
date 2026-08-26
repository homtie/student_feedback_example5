import React from 'react';
import { useApp } from '../../context/AppContext';

export const ActivityModal: React.FC = () => {
  const { isActivityModalOpen, setIsActivityModalOpen, activities, submissions, startFeedback } = useApp();

  if (!isActivityModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181445]/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#fcf8ff] rounded-2xl border border-[#181445]/[0.08] shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#181445]/[0.08] bg-[#f6f2ff]/60">
          <div>
            <h3 className="font-epilogue text-xl font-bold text-[#181445]">Academic Feedback Activity</h3>
            <p className="font-manrope text-xs text-[#464555] mt-0.5">
              Chronological log of your feedback drafts and completed submissions.
            </p>
          </div>
          <button
            onClick={() => setIsActivityModalOpen(false)}
            className="p-2 text-[#464555] hover:text-[#181445] rounded-full hover:bg-[#efebff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-3">
            <h4 className="font-jetbrains text-[11px] uppercase tracking-wider text-[#777587]">
              Recent Events & Submissions
            </h4>
            {activities.length === 0 ? (
              <p className="font-manrope text-sm text-[#464555] py-4 text-center">No activity records yet.</p>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/70 border border-[#181445]/[0.06] hover:bg-white transition-colors"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      act.type === 'submitted'
                        ? 'bg-[#dcfce7] text-[#166534]'
                        : act.type === 'draft_saved'
                        ? 'bg-[#e2dfff] text-[#3525cd]'
                        : 'bg-[#ffedd5] text-[#9a3412]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {act.type === 'submitted' ? 'check_circle' : act.type === 'draft_saved' ? 'drafts' : 'schedule'}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-epilogue font-semibold text-sm text-[#181445]">{act.title}</p>
                      <span className="font-jetbrains text-[11px] text-[#777587]">{act.courseCode}</span>
                    </div>
                    <p className="font-manrope text-xs text-[#464555] mt-0.5">{act.timeAgo}</p>
                  </div>

                  {act.type === 'draft_saved' && (
                    <button
                      onClick={() => {
                        setIsActivityModalOpen(false);
                        startFeedback('cs410', 1);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#3525cd]/10 text-[#3525cd] hover:bg-[#3525cd] hover:text-white font-jetbrains text-xs font-medium transition-all"
                    >
                      Resume
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Submissions summary */}
          {submissions.length > 0 && (
            <div className="pt-4 border-t border-[#181445]/[0.08] space-y-3">
              <h4 className="font-jetbrains text-[11px] uppercase tracking-wider text-[#777587]">
                Completed Anonymous Submissions ({submissions.length})
              </h4>
              <div className="space-y-2">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl bg-[#efebff]/50 border border-[#3525cd]/15 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-epilogue font-bold text-[#181445]">{sub.courseName}</span>
                      <span className="text-[#464555] ml-2">({sub.courseCode})</span>
                      <div className="text-[11px] text-[#777587] mt-0.5">Submitted: {sub.submittedAt}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#dcfce7] text-[#166534] font-jetbrains text-[11px] font-medium">
                      {sub.overallSentiment}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#181445]/[0.08] bg-[#f6f2ff]/60 flex justify-end">
          <button
            onClick={() => setIsActivityModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-[#3525cd] text-white font-jetbrains text-xs font-medium hover:bg-[#4f46e5] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
