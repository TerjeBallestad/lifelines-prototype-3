import { useState } from 'react';
import { observer } from 'mobx-react-lite';

type SummaryStep = 'energy' | 'xp' | 'discoveries' | 'interventions' | 'complete';

const STEPS: SummaryStep[] = ['energy', 'xp', 'discoveries', 'interventions', 'complete'];

const STEP_LABELS: Record<SummaryStep, string> = {
  energy: 'Energy',
  xp: 'XP Gains',
  discoveries: 'Discoveries',
  interventions: 'Interventions',
  complete: 'Complete',
};

export const SummaryView = observer(function SummaryView() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = STEPS[currentStepIndex];

  const nextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const skipToEnd = () => {
    setCurrentStepIndex(STEPS.length - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'energy':
        return (
          <div className="text-center text-base-content/60">
            <p>Energy changes will appear here</p>
            <p className="text-sm mt-2">Shows start vs end energy for each patient</p>
          </div>
        );
      case 'xp':
        return (
          <div className="text-center text-base-content/60">
            <p>XP gains will appear here</p>
            <p className="text-sm mt-2">Lists each activity with XP earned</p>
          </div>
        );
      case 'discoveries':
        return (
          <div className="text-center text-base-content/60">
            <p>Discoveries will appear here</p>
            <p className="text-sm mt-2">Card flip reveals for new insights</p>
          </div>
        );
      case 'interventions':
        return (
          <div className="text-center text-base-content/60">
            <p>Intervention usage will appear here</p>
            <p className="text-sm mt-2">Shows tokens used during the day</p>
          </div>
        );
      case 'complete':
        return (
          <div className="text-center">
            <p className="text-lg font-semibold text-success">Day Complete!</p>
            <p className="text-sm text-base-content/60 mt-2">Ready to advance to the next day</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="card bg-base-200 shadow-xl w-full max-w-2xl">
        <div className="card-body gap-6">
          {/* Step indicator */}
          <ul className="steps steps-horizontal w-full">
            {STEPS.map((step, index) => (
              <li
                key={step}
                className={`step ${index <= currentStepIndex ? 'step-primary' : ''}`}
              >
                {STEP_LABELS[step]}
              </li>
            ))}
          </ul>

          {/* Step content */}
          <div className="min-h-40 flex items-center justify-center">
            {renderStepContent()}
          </div>

          {/* Navigation buttons */}
          <div className="card-actions justify-between">
            <button className="btn btn-ghost" onClick={skipToEnd}>
              Skip
            </button>
            {currentStep !== 'complete' && (
              <button className="btn btn-primary" onClick={nextStep}>
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
