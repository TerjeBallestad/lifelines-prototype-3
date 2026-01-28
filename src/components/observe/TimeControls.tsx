import { observer } from 'mobx-react-lite';
import { Play, Pause, FastForward, Sparkles } from 'lucide-react';
import { useSimulationStore } from '../../stores/SimulationStore';

export const TimeControls = observer(function TimeControls() {
  const store = useSimulationStore();

  return (
    <div className="flex items-center gap-2">
      {/* Play/Pause button */}
      <button
        className="btn btn-circle btn-primary"
        onClick={() => store.isPlaying ? store.pause() : store.play()}
        aria-label={store.isPlaying ? 'Pause' : 'Play'}
      >
        {store.isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      {/* Speed selector - DaisyUI join for grouped buttons */}
      <div className="join">
        <button
          className={`btn join-item ${store.speed === 1 ? 'btn-active' : ''}`}
          onClick={() => store.setSpeed(1)}
        >
          1x
        </button>
        <button
          className={`btn join-item ${store.speed === 4 ? 'btn-active' : ''}`}
          onClick={() => store.setSpeed(4)}
        >
          4x
        </button>
      </div>

      {/* Skip to end button */}
      <button
        className="btn btn-square"
        onClick={() => store.skipToEnd()}
        aria-label="Skip to end"
      >
        <FastForward size={20} />
      </button>

      {/* Intervention tokens */}
      <div className="flex items-center gap-1 ml-2 text-base-content/60">
        <Sparkles size={16} className="text-warning" />
        <span className="text-sm font-medium">{store.interventionTokens}</span>
      </div>
    </div>
  );
});
