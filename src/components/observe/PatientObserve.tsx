import { observer } from 'mobx-react-lite';
import { AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { Patient } from '../../models/Patient';
import { useGameStore } from '../../stores/GameStore';
import { useSimulationStore } from '../../stores/SimulationStore';
import { EnergyChange } from './EnergyChange';

interface PatientObserveProps {
  patient: Patient;
}

// Map MTG colors to Tailwind border colors (matching PatientCard)
const colorMap: Record<string, string> = {
  white: 'border-l-amber-100',
  blue: 'border-l-blue-500',
  black: 'border-l-gray-800',
  red: 'border-l-red-500',
  green: 'border-l-green-500',
};

// Map energy status to glow classes
const glowMap: Record<string, string> = {
  high: 'patient-glow-high',
  medium: 'patient-glow-medium',
  low: 'patient-glow-low',
};

export const PatientObserve = observer(function PatientObserve({
  patient,
}: PatientObserveProps) {
  const gameStore = useGameStore();
  const simStore = useSimulationStore();

  // Get current activity based on simulation slot
  const currentActivity = gameStore.getAssignment(patient.id, simStore.currentSlot);

  function handleClick() {
    if (simStore.canIntervene(patient.id)) {
      simStore.startIntervention(patient.id);
    }
  }

  // Get energy changes for this patient
  const patientEnergyChanges = simStore.energyChanges.filter(
    (c) => c.patientId === patient.id,
  );

  // Calculate activity progress within current slot
  const slotIndex = ['morning', 'afternoon', 'evening'].indexOf(
    simStore.currentSlot,
  );
  const slotStart = slotIndex / 3;
  const slotEnd = (slotIndex + 1) / 3;
  const slotProgress = Math.min(
    1,
    Math.max(0, (simStore.progress - slotStart) / (slotEnd - slotStart)),
  );

  return (
    <div
      onClick={handleClick}
      className={clsx(
        'card relative border-l-4 bg-base-200 p-4 transition-shadow cursor-pointer hover:bg-base-300',
        colorMap[patient.primaryColor] || 'border-l-gray-400',
        glowMap[patient.energyStatus],
        // Dim if no tokens available
        !simStore.canIntervene(patient.id) && 'opacity-75 cursor-not-allowed',
      )}
    >
      {/* Floating energy changes */}
      <AnimatePresence>
        {patientEnergyChanges.map((change) => (
          <EnergyChange
            key={change.id}
            id={change.id}
            value={change.value}
            onComplete={() => simStore.removeEnergyChange(change.id)}
          />
        ))}
      </AnimatePresence>

      {/* Patient name */}
      <h3 className="mb-2 text-lg font-bold">{patient.name}</h3>

      {/* Energy bar */}
      <div className="mb-3">
        <div className="mb-1 flex justify-between text-xs">
          <span>Overskudd</span>
          <span>
            {patient.energy}/{patient.maxEnergy}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-base-300">
          <div
            className={clsx(
              'h-full transition-all duration-300',
              patient.energyStatus === 'high'
                ? 'bg-success'
                : patient.energyStatus === 'medium'
                  ? 'bg-warning'
                  : 'bg-error',
            )}
            style={{ width: `${Math.max(0, patient.energyPercent)}%` }}
          />
        </div>
      </div>

      {/* Current activity with progress */}
      {currentActivity ? (
        <div className="rounded-lg bg-base-300 p-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium">{currentActivity.name}</span>
            <span
              className={clsx(
                'text-xs font-medium',
                currentActivity.energyCost > 0 ? 'text-success' : 'text-error',
              )}
            >
              {currentActivity.formattedCost}
            </span>
          </div>
          {/* Progress bar for activity */}
          <div className="h-1 overflow-hidden rounded-full bg-base-100">
            <div
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${slotProgress * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-base-300 p-2 text-center text-sm text-base-content/40">
          Free time
        </div>
      )}
    </div>
  );
});
