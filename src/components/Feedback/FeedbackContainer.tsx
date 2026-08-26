import React from 'react';
import { useApp } from '../../context/AppContext';
import { FeedbackStepView } from './FeedbackStepView';
import { QualitativeStepView } from './QualitativeStepView';
import { SummaryStepView } from './SummaryStepView';
import { SuccessView } from './SuccessView';
import { TopBar } from '../Navigation/TopBar';

export const FeedbackContainer: React.FC = () => {
  const {
    activeCourse,
    activeStep,
    setActiveStep,
    currentView,
    setCurrentView,
    validateStep,
    validateAllFeedback,
    showToast,
  } = useApp();

  // If in Success state
  if (currentView === 'success') {
    return <SuccessView />;
  }

  // If in Summary (Step 5)
  if (activeStep === 5 || currentView === 'summary') {
    return (
      <div className="min-h-screen flex flex-col bg-[#fcf8ff]">
        <TopBar
          variant="review"
          onBack={() => setActiveStep(4)}
          title="Review Feedback"
        />
        <main className="flex-1 pt-24 px-4 md:px-10 pb-20">
          <SummaryStepView onEditStep={(step) => setActiveStep(step)} />
        </main>
      </div>
    );
  }

  const stepsList = [
    { num: 1, label: 'Teaching', id: '01' },
    { num: 2, label: 'Content', id: '02' },
    { num: 3, label: 'Engagement', id: '03' },
    { num: 4, label: 'Reflection', id: '04' },
    { num: 5, label: 'Review', id: '05' },
  ];

  const handleNext = () => {
    // Validate current active step
    const isValid = validateStep(activeStep);
    if (!isValid) {
      return;
    }

    if (activeStep < 5) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleStepNodeClick = (targetStep: number) => {
    if (targetStep < activeStep) {
      // Going backwards is always allowed
      setActiveStep(targetStep);
      return;
    }

    if (targetStep === activeStep) {
      return;
    }

    // If trying to jump forward, validate current step first
    const isCurrentValid = validateStep(activeStep);
    if (!isCurrentValid) {
      return;
    }

    // If trying to jump directly to Step 5 (Summary), check if all are valid
    if (targetStep === 5) {
      const allValidation = validateAllFeedback();
      if (!allValidation.isValid) {
        showToast('Incomplete Sections', 'Please complete all intermediate questions before viewing summary.', 'warning');
        return;
      }
    }

    setActiveStep(targetStep);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf8ff]">
      {/* Top Navbar */}
      <TopBar variant="task_focused" onClose={() => setCurrentView('home')} />

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-12 lg:px-[12%] pb-28">
        <div className="w-full max-w-4xl space-y-10">
          {/* Header & Course Context */}
          <header className="text-center space-y-3 pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ab8ffe]/20 text-[#674bb5] border border-[#674bb5]/20 mb-2">
              <span className="material-symbols-outlined text-[17px]">lan</span>
              <span className="font-jetbrains text-xs font-bold uppercase tracking-wider">
                {activeCourse?.name || 'Computer Networks'} ({activeCourse?.code || 'CS410'})
              </span>
            </div>

            <h1 className="font-epilogue text-3xl sm:text-4xl lg:text-5xl font-bold text-[#181445] tracking-tight">
              Feedback on your learning experience
            </h1>
            <p className="font-manrope text-base sm:text-lg text-[#464555] max-w-2xl mx-auto">
              Your insights help shape the future of this course. All ratings and reflection text are required.
            </p>
          </header>

          {/* Stepper Progress System */}
          <div className="w-full py-2">
            <div className="flex justify-between items-center relative before:content-[''] before:absolute before:top-1/2 before:left-6 before:right-6 before:h-[1.5px] before:bg-[#c7c4d8]/40 before:-z-0">
              {stepsList.map((st) => {
                const isActive = activeStep === st.num;
                const isPassed = activeStep > st.num;

                return (
                  <button
                    key={st.num}
                    id={`stepper-node-${st.num}`}
                    type="button"
                    onClick={() => handleStepNodeClick(st.num)}
                    className="flex flex-col items-center gap-2 relative z-10 group cursor-pointer focus:outline-none"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-jetbrains text-xs font-bold transition-all duration-300 ${
                        isActive
                          ? 'bg-[#3525cd] text-white shadow-[0_10px_25px_rgba(53,37,205,0.3)] scale-110 ring-4 ring-[#3525cd]/15'
                          : isPassed
                          ? 'bg-[#e2dfff] text-[#3525cd] border border-[#3525cd]/30'
                          : 'bg-[#efebff] border border-[#c7c4d8]/50 text-[#777587]'
                      }`}
                    >
                      {isPassed ? (
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      ) : (
                        st.id
                      )}
                    </div>
                    <span
                      className={`font-jetbrains text-xs transition-colors tracking-wide ${
                        isActive
                          ? 'text-[#3525cd] font-bold'
                          : isPassed
                          ? 'text-[#181445] font-medium'
                          : 'text-[#777587]'
                      }`}
                    >
                      {st.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Content */}
          {activeStep <= 3 && (
            <FeedbackStepView
              step={activeStep}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}

          {activeStep === 4 && (
            <QualitativeStepView
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}
        </div>
      </main>
    </div>
  );
};
