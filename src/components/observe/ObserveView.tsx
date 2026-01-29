import { observer } from 'mobx-react-lite';
import { useSimulation } from '../../hooks/useSimulation';
import { useGameStore } from '../../stores/GameStore';
import { useSimulationStore } from '../../stores/SimulationStore';
import { TimeControls } from './TimeControls';
import { Timeline } from './Timeline';
import { PatientObserve } from './PatientObserve';
import { InterventionMenu } from './InterventionMenu';

export const ObserveView = observer(function ObserveView() {
  const gameStore = useGameStore();
  const simulationStore = useSimulationStore();

  // Start the game loop
  useSimulation();

  const handleViewSummary = () => {
    gameStore.setMode('summary');
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Time controls and timeline at top center per CONTEXT */}
      <div className="flex flex-col items-center gap-4 border-b border-base-300 py-4">
        <Timeline />
        {simulationStore.isDayComplete ? (
          <button className="btn btn-primary btn-lg" onClick={handleViewSummary}>
            View Summary
          </button>
        ) : (
          <TimeControls />
        )}
      </div>

      {/* Patient observation grid */}
      <div className="flex-1 p-4">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4">
          {gameStore.patients.map((patient) => (
            <PatientObserve key={patient.id} patient={patient} />
          ))}
        </div>
      </div>

      {/* Intervention menu overlay */}
      <InterventionMenu />
    </div>
  );
});
