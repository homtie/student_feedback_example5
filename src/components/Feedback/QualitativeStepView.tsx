import React from 'react';
import { useApp } from '../../context/AppContext';

interface QualitativeStepViewProps {
  onNext: () => void;
  onPrev: () => void;
}

export const QualitativeStepView: React.FC<QualitativeStepViewProps> = ({ onNext, onPrev }) => {
  const {
    reflectionText,
    setReflectionText,
    lastSavedTime,
    saveDraft,
    formErrors,
    clearFieldError,
  } = useApp();

  const errorMessage = formErrors.reflectionText;
  const charCount = reflectionText.length;
  const isMinMet = reflectionText.trim().length >= 20;

  const handleThoughtStarter = (promptText: string) => {
    let newText = '';
    if (reflectionText.trim().length > 0) {
      newText = `${reflectionText}\n\n${promptText} `;
    } else {
      newText = `${promptText} `;
    }
    setReflectionText(newText);
    if (newText.trim().length >= 20) {
      clearFieldError('reflectionText');
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 2000);
    setReflectionText(val);
    if (val.trim().length >= 20) {
      clearFieldError('reflectionText');
    }
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Breadcrumb & Status Indicator */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <button
          type="button"
          onClick={onPrev}
          className="text-[#464555] flex items-center gap-2 hover:text-[#3525cd] transition-colors group font-jetbrains text-xs font-medium cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          <span>Previous Questions</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 font-jetbrains text-xs text-[#464555]">
            <span className="w-2 h-2 rounded-full bg-[#674bb5] animate-pulse"></span>
            Auto-saved {lastSavedTime}
          </span>

          <div className="px-3.5 py-1.5 rounded-full bg-[#e9e5ff] border border-[#c7c4d8]/30 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#464555]">visibility_off</span>
            <span className="font-jetbrains text-xs text-[#464555]">Your feedback is anonymous</span>
          </div>
        </div>
      </div>

      {/* Main Copy & Required Indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-jetbrains text-xs font-semibold text-[#674bb5] uppercase tracking-wider">
            Question 4 of 4 • Qualitative Reflection
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-jetbrains font-semibold px-2.5 py-0.5 rounded-full bg-[#fee2e2] text-[#991b1b] border border-[#991b1b]/15">
            <span className="text-[#dc2626] font-bold">*</span> Required (Min 20 chars)
          </span>
        </div>

        <h2 className="font-epilogue text-3xl md:text-4xl font-bold text-[#181445] tracking-tight">
          Tell us more about your experience.
        </h2>
        <p className="font-manrope text-base md:text-lg text-[#464555] max-w-2xl leading-relaxed">
          Your qualitative insights directly shape curriculum improvements and lecture formats. Please provide specific, constructive thoughts.
        </p>
      </div>

      {/* Validation Error Message Alert */}
      {errorMessage && (
        <div
          id="error-banner-reflectionText"
          className="p-4 bg-[#fee2e2] border border-[#ef4444]/40 rounded-xl flex items-center gap-3 text-[#991b1b] animate-bounce"
        >
          <span className="material-symbols-outlined text-[22px] shrink-0 text-[#dc2626]">
            error
          </span>
          <p className="font-manrope text-xs sm:text-sm font-semibold leading-tight">
            {errorMessage}
          </p>
        </div>
      )}

      {/* Expansive Text Area Container */}
      <div className="relative group">
        <div className="glass-panel rounded-[24px] p-2 relative overflow-hidden border border-[#181445]/[0.08] shadow-sm transition-all duration-300">
          <textarea
            id="qualitative-feedback-input"
            value={reflectionText}
            onChange={handleTextChange}
            rows={8}
            placeholder="Please write at least 20 characters describing what worked well, what should be improved, or suggestions for the professor..."
            className={`w-full min-h-[260px] rounded-[18px] p-6 font-manrope text-base md:text-lg text-[#181445] resize-none leading-relaxed placeholder:text-[#464555]/40 bg-transparent border focus:outline-none transition-all ${
              errorMessage
                ? 'border-[#ba1a1a] focus:ring-2 focus:ring-[#ba1a1a]/20 bg-[#fff5f5]'
                : 'border-transparent focus:ring-2 focus:ring-[#3525cd]/20'
            }`}
          ></textarea>

          {/* Floating Character & Requirement Count */}
          <div className="absolute bottom-5 right-6 flex items-center gap-2">
            {!isMinMet && (
              <span className="font-jetbrains text-[11px] text-[#ba1a1a] bg-[#fee2e2] px-2.5 py-0.5 rounded-full font-medium">
                {20 - reflectionText.trim().length} more characters needed
              </span>
            )}
            <div
              className={`font-jetbrains text-xs px-2.5 py-1 rounded-full border ${
                isMinMet
                  ? 'text-[#166534] bg-[#dcfce7] border-[#166534]/20'
                  : 'text-[#777587] bg-[#fcf8ff]/80 border-[#181445]/[0.06]'
              }`}
            >
              <span>{charCount}</span> / 2000 chars
            </div>
          </div>
        </div>
      </div>

      {/* Smart Prompts Section (Thought Starters) */}
      <div className="pt-2">
        <h3 className="font-jetbrains text-xs text-[#464555] mb-3 uppercase tracking-widest font-semibold">
          Thought Starters
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleThoughtStarter('What helped me learn best:')}
            className="px-4 py-2.5 rounded-full border border-[#c7c4d8]/50 bg-white/70 hover:bg-[#efebff] hover:border-[#3525cd]/30 text-[#181445] font-manrope text-sm transition-all flex items-center gap-2 group cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-[#674bb5] group-hover:scale-110 transition-transform">
              lightbulb
            </span>
            <span>What helped you learn best?</span>
          </button>

          <button
            type="button"
            onClick={() => handleThoughtStarter('Areas that could be improved:')}
            className="px-4 py-2.5 rounded-full border border-[#c7c4d8]/50 bg-white/70 hover:bg-[#efebff] hover:border-[#3525cd]/30 text-[#181445] font-manrope text-sm transition-all flex items-center gap-2 group cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-[#8b5130] group-hover:scale-110 transition-transform">
              construction
            </span>
            <span>What should be improved?</span>
          </button>

          <button
            type="button"
            onClick={() => handleThoughtStarter('What I would like to see covered next:')}
            className="px-4 py-2.5 rounded-full border border-[#c7c4d8]/50 bg-white/70 hover:bg-[#efebff] hover:border-[#3525cd]/30 text-[#181445] font-manrope text-sm transition-all flex items-center gap-2 group cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-[#3525cd] group-hover:scale-110 transition-transform">
              rocket_launch
            </span>
            <span>What would you like to see next?</span>
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-8 border-t border-[#181445]/[0.08]">
        <button
          id="btn-save-draft"
          type="button"
          onClick={saveDraft}
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-[#777587] text-[#181445] font-manrope text-sm font-semibold hover:bg-[#e9e5ff] transition-colors cursor-pointer"
        >
          Save Draft
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            id="btn-review-summary"
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#674bb5] text-white font-manrope text-sm font-semibold shadow-[0px_10px_30px_rgba(30,27,75,0.05)] hover:scale-[1.02] active:scale-[0.98] hover:bg-[#4f319c] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Review &amp; Summary</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
