import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface SummaryStepViewProps {
  onEditStep: (step: number) => void;
}

export const SummaryStepView: React.FC<SummaryStepViewProps> = ({ onEditStep }) => {
  const {
    activeCourse,
    ratings = { teaching: 3, content: 4, engagement: 4 },
    reflectionText = '',
    submitCurrentFeedback,
    formErrors = {},
  } = useApp();

  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
  });

  const toggleQuestion = (qNum: number) => {
    setExpandedQuestions((prev) => ({ ...prev, [qNum]: !prev[qNum] }));
  };

  // Compute calculated metrics
  const tRating = ratings?.teaching || 3;
  const cRating = ratings?.content || 4;
  const eRating = ratings?.engagement || 4;
  const avgRating = (tRating + cRating + eRating) / 3;
  const courseContentScore = Number((cRating * 0.96 + 0.4).toFixed(1));
  const teachingQualityScore = Number((tRating * 0.9 + 0.5).toFixed(1));
  const engagementScore = Number((eRating * 0.85 + 0.6).toFixed(1));

  let sentimentTitle = 'Highly Positive';
  if (avgRating < 2.8) sentimentTitle = 'Constructive';
  else if (avgRating < 3.7) sentimentTitle = 'Neutral';
  else if (avgRating < 4.5) sentimentTitle = 'Positive';

  const hasValidationErrors = Object.keys(formErrors || {}).length > 0;
  const isReflectionValid = (reflectionText || '').trim().length >= 20;

  const handleSubmit = () => {
    submitCurrentFeedback();
  };

  return (
    <div id="feedback-summary-view" className="w-full max-w-[1200px] mx-auto animate-fadeIn pb-16">
      {/* Header Section */}
      <div className="mb-8 text-center md:text-left">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="px-3.5 py-1 bg-[#e9e5ff] rounded-full font-jetbrains text-xs text-[#3525cd] uppercase tracking-wider font-semibold border border-[#3525cd]/15">
            Step 5 • Review &amp; Submit
          </span>
        </div>
        <h2 className="font-epilogue text-3xl md:text-4xl font-bold text-[#181445] mb-2 tracking-tight">
          Feedback Summary &amp; Verification
        </h2>
        <p className="font-manrope text-base md:text-lg text-[#464555] max-w-2xl">
          Review your responses for <strong>{activeCourse?.name || 'Computer Networks'} ({activeCourse?.code || 'CS410'})</strong>. All required fields must be validated before submission.
        </p>
      </div>

      {/* Validation Warning Alert Banner if any errors are flagged */}
      {hasValidationErrors && (
        <div
          id="summary-validation-error-banner"
          className="mb-8 p-6 bg-[#fee2e2] border-2 border-[#ef4444] rounded-2xl text-[#991b1b] shadow-sm animate-fadeIn"
        >
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-3xl shrink-0 text-[#dc2626] mt-0.5">
              error
            </span>
            <div className="space-y-2 flex-1">
              <h3 className="font-epilogue font-bold text-lg text-[#7f1d1d]">
                Submission Incomplete: Please fix the following required fields
              </h3>
              <ul className="space-y-1.5 font-manrope text-sm">
                {formErrors.teaching && (
                  <li className="flex items-center justify-between">
                    <span>• {formErrors.teaching}</span>
                    <button
                      type="button"
                      onClick={() => onEditStep(1)}
                      className="px-3 py-1 bg-white border border-[#dc2626]/40 rounded-lg text-xs font-jetbrains font-bold text-[#b91c1c] hover:bg-[#fee2e2] cursor-pointer"
                    >
                      Fix Question 1
                    </button>
                  </li>
                )}
                {formErrors.content && (
                  <li className="flex items-center justify-between">
                    <span>• {formErrors.content}</span>
                    <button
                      type="button"
                      onClick={() => onEditStep(2)}
                      className="px-3 py-1 bg-white border border-[#dc2626]/40 rounded-lg text-xs font-jetbrains font-bold text-[#b91c1c] hover:bg-[#fee2e2] cursor-pointer"
                    >
                      Fix Question 2
                    </button>
                  </li>
                )}
                {formErrors.engagement && (
                  <li className="flex items-center justify-between">
                    <span>• {formErrors.engagement}</span>
                    <button
                      type="button"
                      onClick={() => onEditStep(3)}
                      className="px-3 py-1 bg-white border border-[#dc2626]/40 rounded-lg text-xs font-jetbrains font-bold text-[#b91c1c] hover:bg-[#fee2e2] cursor-pointer"
                    >
                      Fix Question 3
                    </button>
                  </li>
                )}
                {formErrors.reflectionText && (
                  <li className="flex items-center justify-between">
                    <span>• {formErrors.reflectionText}</span>
                    <button
                      type="button"
                      onClick={() => onEditStep(4)}
                      className="px-3 py-1 bg-white border border-[#dc2626]/40 rounded-lg text-xs font-jetbrains font-bold text-[#b91c1c] hover:bg-[#fee2e2] cursor-pointer"
                    >
                      Fix Reflection
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sentiment & Summary (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Sentiment Card */}
          <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center ambient-shadow hover-lift border border-[#181445]/[0.08]">
            <div className="w-24 h-24 rounded-full bg-[#e9e5ff] flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-[#3525cd] opacity-20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#3525cd] border-t-transparent border-r-transparent rotate-45 animate-spin duration-3000"></div>
              <span
                className="material-symbols-outlined text-[42px] text-[#3525cd]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                mood
              </span>
            </div>
            <h3 className="font-epilogue text-2xl font-bold text-[#181445] mb-1">{sentimentTitle}</h3>
            <p className="font-jetbrains text-xs text-[#464555] uppercase tracking-wider font-semibold">
              Calculated Overall Sentiment
            </p>
          </div>

          {/* Rating Summary Bento */}
          <div className="glass-panel rounded-2xl p-6 ambient-shadow border border-[#181445]/[0.08]">
            <h4 className="font-jetbrains text-xs text-[#464555] uppercase tracking-wider mb-6 border-b border-[#181445]/[0.08] pb-2 font-semibold">
              Category Breakdown
            </h4>
            <div className="flex flex-col gap-5">
              {/* Stat 1: Teaching Quality */}
              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <span className="font-manrope text-sm font-medium text-[#181445]">Teaching Quality</span>
                  <span className="font-epilogue font-bold text-xl text-[#3525cd] leading-none">
                    {ratings.teaching} / 5
                  </span>
                </div>
                <div className="w-full bg-[#efebff] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#3525cd] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(ratings.teaching / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Stat 2: Course Content */}
              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <span className="font-manrope text-sm font-medium text-[#181445]">Course Content</span>
                  <span className="font-epilogue font-bold text-xl text-[#674bb5] leading-none">
                    {ratings.content} / 5
                  </span>
                </div>
                <div className="w-full bg-[#efebff] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#674bb5] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(ratings.content / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Stat 3: Engagement */}
              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <span className="font-manrope text-sm font-medium text-[#181445]">Engagement</span>
                  <span className="font-epilogue font-bold text-xl text-[#6e3a1b] leading-none">
                    {ratings.engagement} / 5
                  </span>
                </div>
                <div className="w-full bg-[#efebff] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#6e3a1b] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(ratings.engagement / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit CTA Area (Desktop Sidebar) */}
          <div className="hidden lg:flex flex-col gap-4 mt-2">
            <div className="flex items-center gap-2 text-[#3525cd]">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {hasValidationErrors ? 'warning' : 'verified_user'}
              </span>
              <span className="font-manrope text-sm font-semibold">
                {hasValidationErrors ? 'Validation errors present' : 'Validated & ready to submit'}
              </span>
            </div>

            <button
              id="btn-submit-feedback-main"
              type="button"
              onClick={handleSubmit}
              className="w-full py-4 px-6 bg-[#3525cd] text-white rounded-xl font-epilogue font-bold text-base hover:bg-[#4f46e5] transition-all ambient-shadow hover-lift flex items-center justify-center gap-2 cursor-pointer shadow-[0px_8px_24px_rgba(53,37,205,0.25)] active:scale-[0.98]"
            >
              <span>Submit Feedback</span>
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
            <p className="text-center font-jetbrains text-xs text-[#777587]">Your feedback is anonymous and encrypted.</p>
          </div>
        </div>

        {/* Right Column: Detail Sections (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Question 1 Item */}
          <div
            className={`glass-panel rounded-2xl overflow-hidden border transition-all ${
              formErrors.teaching ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]/30' : 'border-[#181445]/[0.08]'
            }`}
          >
            <div
              className="p-6 flex items-start justify-between cursor-pointer hover:bg-white/40 transition-colors"
              onClick={() => toggleQuestion(1)}
            >
              <div>
                <p className="font-jetbrains text-xs text-[#3525cd] mb-1.5 uppercase tracking-wider font-semibold flex items-center gap-2">
                  <span>Question 1 • Teaching Quality</span>
                  <span className="bg-[#e2dfff] text-[#3525cd] px-2 py-0.5 rounded font-bold">
                    {ratings.teaching} / 5 Stars
                  </span>
                </p>
                <h4 className="font-epilogue text-base md:text-lg text-[#181445] font-semibold pr-4">
                  How effectively did the instructor explain difficult concepts?
                </h4>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditStep(1);
                }}
                className="text-[#777587] hover:text-[#3525cd] transition-colors p-2 rounded-full hover:bg-[#efebff] cursor-pointer shrink-0"
                title="Edit response"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>

            {expandedQuestions[1] && (
              <div className="px-6 pb-6 pt-0 border-t border-[#181445]/[0.06] mt-1 animate-fadeIn">
                <div className="bg-[#f6f2ff] p-4 rounded-xl mt-4 border border-[#3525cd]/10 flex items-center justify-between">
                  <span className="font-manrope text-sm text-[#181445]">Selected Rating Score:</span>
                  <span className="font-jetbrains text-sm font-bold text-[#3525cd]">{ratings.teaching} out of 5</span>
                </div>
              </div>
            )}
          </div>

          {/* Question 2 Item */}
          <div
            className={`glass-panel rounded-2xl overflow-hidden border transition-all ${
              formErrors.content ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]/30' : 'border-[#181445]/[0.08]'
            }`}
          >
            <div
              className="p-6 flex items-start justify-between cursor-pointer hover:bg-white/40 transition-colors"
              onClick={() => toggleQuestion(2)}
            >
              <div>
                <p className="font-jetbrains text-xs text-[#674bb5] mb-1.5 uppercase tracking-wider font-semibold flex items-center gap-2">
                  <span>Question 2 • Course Content</span>
                  <span className="bg-[#e9e5ff] text-[#674bb5] px-2 py-0.5 rounded font-bold">
                    {ratings.content} / 5 Stars
                  </span>
                </p>
                <h4 className="font-epilogue text-base md:text-lg text-[#181445] font-semibold pr-4">
                  How well-structured and relevant were the course materials &amp; lab assignments?
                </h4>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditStep(2);
                }}
                className="text-[#777587] hover:text-[#3525cd] transition-colors p-2 rounded-full hover:bg-[#efebff] cursor-pointer shrink-0"
                title="Edit response"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>

            {expandedQuestions[2] && (
              <div className="px-6 pb-6 pt-0 border-t border-[#181445]/[0.06] mt-1 animate-fadeIn">
                <div className="bg-[#f6f2ff] p-4 rounded-xl mt-4 border border-[#674bb5]/15 flex items-center justify-between">
                  <span className="font-manrope text-sm text-[#181445]">Selected Rating Score:</span>
                  <span className="font-jetbrains text-sm font-bold text-[#674bb5]">{ratings.content} out of 5</span>
                </div>
              </div>
            )}
          </div>

          {/* Question 3 Item */}
          <div
            className={`glass-panel rounded-2xl overflow-hidden border transition-all ${
              formErrors.engagement ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]/30' : 'border-[#181445]/[0.08]'
            }`}
          >
            <div
              className="p-6 flex items-start justify-between cursor-pointer hover:bg-white/40 transition-colors"
              onClick={() => toggleQuestion(3)}
            >
              <div>
                <p className="font-jetbrains text-xs text-[#6e3a1b] mb-1.5 uppercase tracking-wider font-semibold flex items-center gap-2">
                  <span>Question 3 • Engagement</span>
                  <span className="bg-[#fcedeb] text-[#6e3a1b] px-2 py-0.5 rounded font-bold">
                    {ratings.engagement} / 5 Stars
                  </span>
                </p>
                <h4 className="font-epilogue text-base md:text-lg text-[#181445] font-semibold pr-4">
                  How engaging and interactive were the lectures, discussions, and class exercises?
                </h4>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditStep(3);
                }}
                className="text-[#777587] hover:text-[#3525cd] transition-colors p-2 rounded-full hover:bg-[#efebff] cursor-pointer shrink-0"
                title="Edit response"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>

            {expandedQuestions[3] && (
              <div className="px-6 pb-6 pt-0 border-t border-[#181445]/[0.06] mt-1 animate-fadeIn">
                <div className="bg-[#f6f2ff] p-4 rounded-xl mt-4 border border-[#6e3a1b]/15 flex items-center justify-between">
                  <span className="font-manrope text-sm text-[#181445]">Selected Rating Score:</span>
                  <span className="font-jetbrains text-sm font-bold text-[#6e3a1b]">{ratings.engagement} out of 5</span>
                </div>
              </div>
            )}
          </div>

          {/* Question 4 Item (Qualitative Reflection) */}
          <div
            className={`glass-panel rounded-2xl overflow-hidden border transition-all ${
              formErrors.reflectionText || !isReflectionValid
                ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]/30'
                : 'border-[#181445]/[0.08]'
            }`}
          >
            <div
              className="p-6 flex items-start justify-between cursor-pointer hover:bg-white/40 transition-colors"
              onClick={() => toggleQuestion(4)}
            >
              <div>
                <p className="font-jetbrains text-xs text-[#3525cd] mb-1.5 uppercase tracking-wider font-semibold flex items-center gap-2">
                  <span>Question 4 • Qualitative Reflection</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      isReflectionValid
                        ? 'bg-[#dcfce7] text-[#166534]'
                        : 'bg-[#fee2e2] text-[#991b1b]'
                    }`}
                  >
                    {isReflectionValid ? `${reflectionText.length} Chars (Valid)` : 'Incomplete'}
                  </span>
                </p>
                <h4 className="font-epilogue text-base md:text-lg text-[#181445] font-semibold pr-4">
                  Written Feedback &amp; Suggestions for Course Enhancement
                </h4>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditStep(4);
                }}
                className="text-[#777587] hover:text-[#3525cd] transition-colors p-2 rounded-full hover:bg-[#efebff] cursor-pointer shrink-0"
                title="Edit response"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>

            {expandedQuestions[4] && (
              <div className="px-6 pb-6 pt-0 border-t border-[#181445]/[0.06] mt-1 animate-fadeIn">
                <div className="bg-[#f6f2ff] p-4 rounded-xl mt-4 border border-[#3525cd]/15">
                  <p className="font-manrope text-sm text-[#464555] leading-relaxed whitespace-pre-wrap">
                    {reflectionText || (
                      <span className="text-[#ba1a1a] font-medium">
                        No reflection provided yet. Click edit to add your comments.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile CTA Button */}
          <div className="lg:hidden flex flex-col gap-4 mt-6 pt-6 border-t border-[#181445]/[0.08]">
            <div className="flex items-center justify-center gap-2 text-[#3525cd]">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {hasValidationErrors ? 'warning' : 'verified_user'}
              </span>
              <span className="font-manrope text-sm font-semibold">
                {hasValidationErrors ? 'Validation errors present' : 'Ready to submit'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-4 px-6 bg-[#3525cd] text-white rounded-xl font-epilogue font-bold text-base hover:bg-[#4f46e5] transition-colors ambient-shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit Feedback</span>
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
            <p className="text-center font-jetbrains text-xs text-[#777587]">Your feedback is anonymous.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
