import { observer } from 'mobx-react-lite';
import { useSimulation } from '../../hooks/useSimulation';
import { useSimulationStore } from '../../stores/SimulationStore';

export const ObserveView = observer(function ObserveView() {
  const store = useSimulationStore();

  // Start the game loop
  useSimulation();

  return (
    <div className="flex-1 flex flex-col p-4">
      {/* Temporary debug display - will be replaced by TimeControls in 03-02 */}
      <div className="text-center mb-4">
        <div className="text-2xl font-bold">
          {store.currentSlot.charAt(0).toUpperCase() + store.currentSlot.slice(1)}
        </div>
        <div className="text-sm text-base-content/60">
          Progress: {(store.progress * 100).toFixed(1)}% | Speed: {store.speed}x
        </div>
        <div className="flex justify-center gap-2 mt-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => store.isPlaying ? store.pause() : store.play()}
          >
            {store.isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            className="btn btn-sm"
            onClick={() => store.setSpeed(store.speed === 1 ? 4 : 1)}
          >
            {store.speed}x
          </button>
        </div>
      </div>

      {/* Placeholder for patient observation area */}
      <div className="flex-1 flex items-center justify-center text-base-content/40">
        Patient observation area (03-03)
      </div>
    </div>
  );
});
