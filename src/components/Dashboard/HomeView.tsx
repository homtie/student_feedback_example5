import React from 'react';
import { useApp } from '../../context/AppContext';

export const HomeView: React.FC = () => {
  const { startFeedback, setIsActivityModalOpen, setCurrentView, courses, showToast } = useApp();

  const priorityCourse = courses.find((c) => c.id === 'cs410') || courses[0];
  const pendingCount = courses.filter((c) => !c.feedbackClosed && c.draftProgress !== 100).length;

  return (
    <div id="student-home-view" className="space-y-12 md:space-y-16 animate-fadeIn pb-16">
      {/* Hero Section */}
      <section className="max-w-6xl">
        <h1 className="font-epilogue text-4xl sm:text-5xl lg:text-6xl font-bold text-[#181445] tracking-tight mb-3">
          Good afternoon, Alex.
        </h1>
        <p className="font-manrope text-lg text-[#464555] max-w-2xl font-normal">
          You have {pendingCount} feedback sessions waiting.
        </p>
      </section>

      {/* Asymmetric Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl">
        {/* Featured Feedback Card (8 cols) */}
        <div className="lg:col-span-8">
          <div className="glass-panel rounded-2xl p-7 md:p-9 ambient-shadow relative overflow-hidden h-full flex flex-col justify-between group border border-[#181445]/[0.08] hover:border-[#3525cd]/25 transition-all duration-300">
            {/* Ambient decorative gradient blur */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ab8ffe] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none"></div>

            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="font-jetbrains text-[11px] bg-[#efebff] text-[#181445] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-semibold border border-[#3525cd]/10">
                  Priority Session
                </span>
                <button
                  onClick={() => showToast('Session Options', 'Course: CS410 Computer Networks. Due in 3 days.', 'info')}
                  className="text-[#777587] hover:text-[#181445] p-1 rounded-lg hover:bg-[#efebff] transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
              </div>

              <h2 className="font-epilogue text-3xl md:text-4xl font-bold text-[#3525cd] mb-2 tracking-tight">
                {priorityCourse.name}
              </h2>
              <p className="font-manrope text-base md:text-lg text-[#464555] mb-8">
                {priorityCourse.instructor} • {priorityCourse.semester}
              </p>

              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2 text-[#464555] font-jetbrains font-medium">
                  <span>Progress</span>
                  <span className="text-[#3525cd] font-bold">{priorityCourse.draftProgress || 45}%</span>
                </div>
                <div className="w-full bg-[#e3dfff] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#674bb5] h-2 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${priorityCourse.draftProgress || 45}%` }}
                  ></div>
                </div>
                <p className="mt-3 text-sm text-[#ba1a1a] font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[17px]">schedule</span>
                  Feedback closes in {priorityCourse.deadlineDaysRemaining || 3} days
                </p>
              </div>
            </div>

            <div>
              <button
                id="btn-continue-feedback"
                onClick={() => startFeedback('cs410', 1)}
                className="bg-[#3525cd] hover:bg-[#4f46e5] text-white py-3.5 px-7 rounded-xl font-jetbrains text-xs font-semibold tracking-wider flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0px_8px_24px_rgba(53,37,205,0.2)] cursor-pointer"
              >
                <span>[ Continue Feedback</span>
                <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                <span>]</span>
              </button>
            </div>
          </div>
        </div>

        {/* Academic Pulse Section (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Progress Widget */}
          <div className="glass-panel rounded-2xl p-6 relative border border-[#181445]/[0.08]">
            <h3 className="font-epilogue text-xl font-bold text-[#181445] mb-6 tracking-tight">Pulse</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1.5 text-[#464555] font-manrope">
                  <span className="font-medium">Completion</span>
                  <span className="font-jetbrains font-bold text-[#3525cd]">82%</span>
                </div>
                <div className="w-full bg-[#e3dfff] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#3525cd] h-1.5 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1.5 text-[#464555] font-manrope">
                  <span className="font-medium">Pending Sessions</span>
                  <span className="font-jetbrains font-bold text-[#674bb5]">{pendingCount}</span>
                </div>
                <div className="w-full bg-[#e3dfff] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#ab8ffe] h-1.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-panel rounded-2xl p-6 flex-1 border border-[#181445]/[0.08] flex flex-col justify-between">
            <div>
              <h3 className="font-epilogue text-xl font-bold text-[#181445] mb-5 tracking-tight">Recent</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#efebff] flex items-center justify-center shrink-0 mt-0.5 border border-[#3525cd]/15">
                    <span className="material-symbols-outlined text-[#3525cd] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#181445] font-epilogue">Data Structures</p>
                    <p className="text-xs text-[#777587] font-manrope mt-0.5">Feedback submitted • 2d ago</p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#efebff] flex items-center justify-center shrink-0 mt-0.5 border border-[#674bb5]/15">
                    <span className="material-symbols-outlined text-[#674bb5] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      drafts
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#181445] font-epilogue">UI/UX Principles</p>
                    <p className="text-xs text-[#777587] font-manrope mt-0.5">Draft saved • 5d ago</p>
                  </div>
                </li>
              </ul>
            </div>

            <button
              id="btn-view-all-activity"
              onClick={() => setIsActivityModalOpen(true)}
              className="mt-6 w-full py-2.5 rounded-xl border border-[#3525cd] text-[#3525cd] font-jetbrains text-xs font-medium hover:bg-[#3525cd]/5 hover:scale-[1.01] active:scale-[0.99] transition-all text-center"
            >
              View All Activity
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Course Cards Row */}
      <section className="max-w-6xl pt-6">
        <div className="flex justify-between items-center mb-6 border-b border-[#181445]/[0.08] pb-3">
          <div>
            <h2 className="font-epilogue text-2xl font-bold text-[#181445]">Enrolled Courses</h2>
            <p className="font-manrope text-sm text-[#464555]">Select any course to submit anonymous feedback.</p>
          </div>
          <button
            onClick={() => setCurrentView('courses')}
            className="text-xs font-jetbrains font-medium text-[#3525cd] hover:underline flex items-center gap-1"
          >
            All Courses <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {courses.slice(1, 4).map((course) => (
            <div
              key={course.id}
              className="glass-panel p-6 rounded-xl border border-[#181445]/[0.08] hover:border-[#3525cd]/30 hover-lift flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-jetbrains text-[11px] text-[#3525cd] font-semibold bg-[#e2dfff] px-2.5 py-0.5 rounded">
                    {course.code}
                  </span>
                  <span className="font-jetbrains text-[11px] text-[#777587]">{course.semester}</span>
                </div>
                <h3 className="font-epilogue font-bold text-lg text-[#181445] mt-2">{course.name}</h3>
                <p className="font-manrope text-xs text-[#464555] mt-1">{course.instructor}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#181445]/[0.06] flex items-center justify-between">
                <span className="font-jetbrains text-[11px] text-[#464555]">
                  {course.draftProgress === 100 ? 'Submitted' : `${course.totalSubmissions} responses`}
                </span>
                <button
                  onClick={() => startFeedback(course.id, 1)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#efebff] hover:bg-[#3525cd] text-[#3525cd] hover:text-white font-jetbrains text-xs font-medium transition-colors"
                >
                  {course.draftProgress === 100 ? 'Review' : 'Give Feedback'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
