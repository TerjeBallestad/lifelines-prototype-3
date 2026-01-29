import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { EnergySection } from './EnergySection';
import { XPSection } from './XPSection';
import { DiscoverySection } from './DiscoverySection';
import { InterventionSection } from './InterventionSection';
import { ContinueButton } from './ContinueButton';
import { DaySplash } from './DaySplash';
import { useGameStore } from '../../stores/GameStore';

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
  const gameStore = useGameStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(false);
  const [nextDay, setNextDay] = useState(1);

  // Reset step to 0 when SummaryView mounts (prevents stale state from previous day)
  useEffect(() => {
    setCurrentStepIndex(0);
  }, []);

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
        return <EnergySection />;
      case 'xp':
        return <XPSection />;
      case 'discoveries':
        return <DiscoverySection />;
      case 'interventions':
        return <InterventionSection />;
      case 'complete':
        return (
          <ContinueButton
            onContinue={() => {
              setNextDay(gameStore.currentDay + 1);
              setShowSplash(true);
              gameStore.advanceToNextDay();
            }}
          />
        );
    }
  };

  // Show day splash overlay when transitioning
  if (showSplash) {
    return (
      <DaySplash day={nextDay} onComplete={() => setShowSplash(false)} />
    );
  }

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
