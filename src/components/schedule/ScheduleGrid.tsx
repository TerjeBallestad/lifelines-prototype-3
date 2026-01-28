import { observer } from 'mobx-react-lite';
import { useGameStore } from '../../stores/GameStore';
import { TimeSlotRow } from './TimeSlotRow';
import type { TimeSlot } from '../../models/types';

const TIME_SLOTS: TimeSlot[] = ['morning', 'afternoon', 'evening'];

export const ScheduleGrid = observer(function ScheduleGrid() {
  const gameStore = useGameStore();
  const { patients } = gameStore;

  // Generate grid columns based on number of patients
  // First column for time slot labels, then one column per patient
  const gridColsClass = `grid grid-cols-[100px_repeat(${patients.length},1fr)] gap-2`;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Schedule</h2>
      <div className={gridColsClass}>
        {/* Header row with patient names */}
        <div className="text-center font-medium text-base-content/50 text-sm">
          Time
        </div>
        {patients.map((patient) => {
          const currentEnergy = patient.energy;
          const predictedEnergy = gameStore.getPredictedEnergy(patient.id);
          const energyDiff = predictedEnergy - currentEnergy;
          // Color: green if higher, red if lower, neutral if same
          const energyColorClass =
            energyDiff > 0
              ? 'text-success'
              : energyDiff < 0
                ? 'text-error'
                : 'text-base-content';

          return (
            <div
              key={patient.id}
              className="text-center font-medium text-sm"
            >
              <span>{patient.name}</span>
              <span className={`ml-1 ${energyColorClass}`}>
                ({currentEnergy} &rarr; {predictedEnergy})
              </span>
            </div>
          );
        })}

        {/* Time slot rows */}
        {TIME_SLOTS.map((slot) => (
          <TimeSlotRow key={slot} timeSlot={slot} patients={patients} />
        ))}
      </div>
    </div>
  );
});
