import React from 'react';
import { useApp } from '../../context/AppContext';
import { RatingOption, RatingValue } from '../../types';

interface FeedbackStepViewProps {
  step: number; // 1, 2, or 3
  onNext: () => void;
  onPrev: () => void;
}

const RATING_OPTIONS: RatingOption[] = [
  { value: 1, label: 'Very Poor', iconName: 'sentiment_very_dissatisfied' },
  { value: 2, label: 'Poor', iconName: 'sentiment_dissatisfied' },
  { value: 3, label: 'Average', iconName: 'sentiment_neutral' },
  { value: 4, label: 'Good', iconName: 'sentiment_satisfied' },
  { value: 5, label: 'Excellent', iconName: 'sentiment_very_satisfied' },
];

export const FeedbackStepView: React.FC<FeedbackStepViewProps> = ({ step, onNext, onPrev }) => {
  const { ratings, setRating, formErrors = {}, clearFieldError } = useApp();

  const getQuestionInfo = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return {
          category: 'teaching' as const,
          stepLabel: 'Question 1 of 4 • Teaching Quality',
          question: 'How effectively did the instructor explain difficult concepts?',
          currentRating: ratings?.teaching || 3,
          description: 'Evaluate pedagogical clarity, responsiveness to student questions, and pacing.',
        };
      case 2:
        return {
          category: 'content' as const,
          stepLabel: 'Question 2 of 4 • Course Content',
          question: 'How well-structured and relevant were the course materials & lab assignments?',
          currentRating: ratings?.content || 4,
          description: 'Evaluate curriculum relevance, homework alignment, and laboratory utility.',
        };
      case 3:
        return {
          category: 'engagement' as const,
          stepLabel: 'Question 3 of 4 • Engagement',
          question: 'How engaging and interactive were the lectures, discussions, and class exercises?',
          currentRating: ratings?.engagement || 4,
          description: 'Evaluate classroom environment, collaborative activities, and interactive discussions.',
        };
      default:
        return {
          category: 'teaching' as const,
          stepLabel: 'Question 1 of 4 • Teaching Quality',
          question: 'How effectively did the instructor explain difficult concepts?',
          currentRating: ratings?.teaching || 3,
          description: 'Evaluate pedagogical clarity, responsiveness to student questions, and pacing.',
        };
    }
  };

  const { category, stepLabel, question, currentRating, description } = getQuestionInfo(step);
  const errorMessage = formErrors?.[category];

  const handleSelectRating = (value: RatingValue) => {
    setRating(category, value);
    if (clearFieldError) {
      clearFieldError(category);
    }
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Question & Interaction Card */}
      <section
        className={`bg-[#f6f2ff]/80 rounded-2xl border p-8 md:p-14 shadow-[0_10px_30px_rgba(30,27,75,0.02)] relative overflow-hidden backdrop-blur-[20px] transition-all duration-300 ${
          errorMessage
            ? 'border-[#ba1a1a]/50 ring-2 ring-[#ba1a1a]/20 shadow-[0_10px_30px_rgba(186,26,26,0.08)]'
            : 'border-[#181445]/[0.08]'
        }`}
      >
        {/* Ambient decorative gradient blob */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ab8ffe]/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#3525cd]/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 space-y-8">
          {/* Step eyebrow & required badge */}
          <div className="flex items-center justify-between">
            <span className="font-jetbrains text-xs font-semibold text-[#674bb5] uppercase tracking-wider">
              {stepLabel}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-jetbrains font-semibold px-2.5 py-0.5 rounded-full bg-[#fee2e2] text-[#991b1b] border border-[#991b1b]/15">
              <span className="text-[#dc2626] font-bold">*</span> Required
            </span>
          </div>

          <div className="text-center space-y-2">
            <h2 className="font-epilogue text-2xl md:text-3xl lg:text-4xl font-bold text-[#181445] leading-snug max-w-2xl mx-auto">
              {question}
            </h2>
            <p className="font-manrope text-sm text-[#464555] max-w-lg mx-auto">
              {description}
            </p>
          </div>

          {/* Validation Error Message Alert */}
          {errorMessage && (
            <div
              id={`error-banner-${category}`}
              className="max-w-xl mx-auto p-4 bg-[#fee2e2] border border-[#ef4444]/40 rounded-xl flex items-center gap-3 text-[#991b1b] animate-bounce"
            >
              <span className="material-symbols-outlined text-[22px] shrink-0 text-[#dc2626]">
                error
              </span>
              <p className="font-manrope text-xs sm:text-sm font-semibold leading-tight">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Response Controls (5 Rating Options) */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-2">
            {RATING_OPTIONS.map((option) => {
              const isSelected = currentRating === option.value;

              return (
                <button
                  key={option.value}
                  id={`rating-opt-${step}-${option.value}`}
                  type="button"
                  onClick={() => handleSelectRating(option.value)}
                  className={`group flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-[#674bb5] bg-[#e8ddff] text-[#21005e] shadow-[0_10px_30px_rgba(103,75,181,0.15)] -translate-y-1 ring-2 ring-[#674bb5]/20 ring-offset-2 ring-offset-[#fcf8ff]'
                      : 'border-[#c7c4d8]/40 bg-white/60 hover:bg-[#efebff] hover:border-[#3525cd]/30 hover:-translate-y-1 hover:shadow-sm'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-4xl mb-4 transition-colors ${
                      isSelected
                        ? 'text-[#674bb5]'
                        : 'text-[#464555]/50 group-hover:text-[#3525cd]'
                    }`}
                    style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {option.iconName}
                  </span>

                  <span
                    className={`font-manrope text-sm font-medium ${
                      isSelected
                        ? 'font-bold text-[#674bb5]'
                        : 'text-[#464555] group-hover:text-[#181445]'
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center pt-6">
        <button
          id="btn-feedback-prev"
          type="button"
          onClick={onPrev}
          disabled={step === 1}
          className={`px-6 py-3.5 rounded-xl border border-[#c7c4d8] font-manrope text-sm font-semibold flex items-center gap-2 transition-all ${
            step === 1
              ? 'opacity-40 cursor-not-allowed text-[#777587] border-[#c7c4d8]/40'
              : 'text-[#464555] hover:bg-[#efebff] hover:text-[#181445] cursor-pointer'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Previous</span>
        </button>

        <button
          id="btn-feedback-next"
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 rounded-xl bg-[#3525cd] text-white font-manrope text-sm font-semibold hover:bg-[#4f46e5] hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_10px_30px_rgba(53,37,205,0.25)] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <span>Next Step</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
