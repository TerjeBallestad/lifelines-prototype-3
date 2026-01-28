import { observer } from 'mobx-react-lite';
import { useGameStore } from '../stores/GameStore';
import { DayHeader } from './DayHeader';
import { PatientGrid } from './PatientGrid';
import { ActivityList } from './ActivityList';
import { ScheduleGrid } from './schedule/ScheduleGrid';

export const GameShell = observer(function GameShell() {
  const gameStore = useGameStore();
  const showSidebar = gameStore.currentMode === 'schedule';

  return (
    <div className="h-screen flex flex-col bg-base-100">
      {/* Header */}
      <DayHeader />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <PatientGrid />
          {showSidebar && <ScheduleGrid />}
        </main>

        {/* Activity sidebar - right side, only in schedule mode */}
        {showSidebar && (
          <aside className="w-72 bg-base-200 border-l border-base-300 overflow-y-auto">
            <ActivityList />
          </aside>
        )}
      </div>
    </div>
  );
});
