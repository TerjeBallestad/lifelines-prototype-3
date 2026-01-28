import { observer } from 'mobx-react-lite';
import { useSimulation } from '../../hooks/useSimulation';
import { useGameStore } from '../../stores/GameStore';
import { TimeControls } from './TimeControls';
import { Timeline } from './Timeline';
import { PatientObserve } from './PatientObserve';

export const ObserveView = observer(function ObserveView() {
  const gameStore = useGameStore();

  // Start the game loop
  useSimulation();

  return (
    <div className="flex flex-1 flex-col">
      {/* Time controls and timeline at top center per CONTEXT */}
      <div className="flex flex-col items-center gap-4 border-b border-base-300 py-4">
        <Timeline />
        <TimeControls />
      </div>

      {/* Patient observation grid */}
      <div className="flex-1 p-4">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4">
          {gameStore.patients.map((patient) => (
            <PatientObserve key={patient.id} patient={patient} />
          ))}
        </div>
      </div>
    </div>
  );
});
