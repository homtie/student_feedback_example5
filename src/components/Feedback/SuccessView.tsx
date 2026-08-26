import React from 'react';
import { useApp } from '../../context/AppContext';

export const SuccessView: React.FC = () => {
  const { latestSubmission, setCurrentView, resetFeedbackState } = useApp();

  const formattedTimestamp = latestSubmission?.submittedAt || 'Oct 24, 2024 at 10:42 AM';

  const handleReturnHome = () => {
    resetFeedbackState();
    setCurrentView('home');
  };

  const handleViewFacultyInsights = () => {
    resetFeedbackState();
    setCurrentView('insights');
  };

  return (
    <div id="submission-success-view" className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-fadeIn">
      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-10">
        {/* Radiant Glowing Hero Visual */}
        <div className="relative flex items-center justify-center">
          {/* Outer diffuse glow */}
          <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-[#e9e5ff] via-[#c3c0ff] to-[#ab8ffe] opacity-90 blur-xl flex items-center justify-center animate-pulse duration-1000"></div>

          {/* Central elevated gradient disc */}
          <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-[#3525cd] to-[#674bb5] flex items-center justify-center shadow-[0px_16px_40px_rgba(53,37,205,0.3)] transition-transform hover:scale-105">
            <span
              className="material-symbols-outlined text-white text-6xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check
            </span>
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-3 pt-2">
          <h1 className="font-epilogue text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3525cd] tracking-tight">
            Your perspective has been heard.
          </h1>
          <p className="font-manrope text-lg text-[#464555] max-w-lg mx-auto leading-relaxed">
            Thank you for helping improve the learning experience.
          </p>
        </div>

        {/* Details & Actions */}
        <div className="space-y-6 w-full flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#e9e5ff]/70 rounded-full px-5 py-2.5 border border-[#c7c4d8]/40 shadow-sm">
            <span className="material-symbols-outlined text-[#777587] text-[18px]">schedule</span>
            <span className="font-jetbrains text-xs text-[#464555] font-medium tracking-wide">
              Submitted: {formattedTimestamp}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full max-w-md">
            <button
              id="btn-return-dashboard"
              onClick={handleReturnHome}
              className="w-full sm:w-auto bg-[#3525cd] hover:bg-[#4f46e5] text-white font-jetbrains text-xs uppercase tracking-wider font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0px_10px_30px_rgba(53,37,205,0.25)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Return to Dashboard</span>
            </button>

            <button
              id="btn-view-insights-post-submit"
              onClick={handleViewFacultyInsights}
              className="w-full sm:w-auto py-4 px-7 rounded-full border border-[#3525cd] text-[#3525cd] font-jetbrains text-xs uppercase tracking-wider font-semibold hover:bg-[#3525cd]/5 transition-all text-center"
            >
              Faculty Intelligence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
