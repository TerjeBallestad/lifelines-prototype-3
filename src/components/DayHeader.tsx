import { observer } from 'mobx-react-lite';
import { useGameStore } from '../stores/GameStore';

const modeColors: Record<string, string> = {
  schedule: 'badge-primary',
  observe: 'badge-secondary',
  summary: 'badge-accent',
};

const modeLabels: Record<string, string> = {
  schedule: 'Schedule Mode',
  observe: 'Observe Mode',
  summary: 'Summary',
};

const timeSlotLabels: Record<string, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
};

export const DayHeader = observer(function DayHeader() {
  const gameStore = useGameStore();

  return (
    <header className="bg-base-200 border-b border-base-300 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <span className={`badge ${modeColors[gameStore.currentMode]} badge-lg font-semibold`}>
            {modeLabels[gameStore.currentMode]}
          </span>
        </div>

        <div className="flex items-center gap-6 text-lg">
          <span className="font-bold text-primary">
            Day {gameStore.currentDay}
          </span>
          <span className="text-base-content/70">
            {timeSlotLabels[gameStore.currentTimeSlot]}
          </span>
        </div>
      </div>
    </header>
  );
});
