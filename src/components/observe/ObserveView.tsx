import { observer } from 'mobx-react-lite';
import { useSimulation } from '../../hooks/useSimulation';
import { TimeControls } from './TimeControls';
import { Timeline } from './Timeline';

export const ObserveView = observer(function ObserveView() {
  // Start the game loop
  useSimulation();

  return (
    <div className="flex-1 flex flex-col">
      {/* Time controls and timeline at top center per CONTEXT */}
      <div className="flex flex-col items-center gap-4 py-4 border-b border-base-300">
        <Timeline />
        <TimeControls />
      </div>

      {/* Patient observation area - will be implemented in 03-03 */}
      <div className="flex-1 flex items-center justify-center text-base-content/40">
        Patient observation area (03-03)
      </div>
    </div>
  );
});
