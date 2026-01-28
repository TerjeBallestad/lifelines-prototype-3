import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useGameStore } from '../stores/GameStore';
import { useUIStore } from '../stores/UIStore';
import { DayHeader } from './DayHeader';
import { PatientGrid } from './PatientGrid';
import { ActivityList } from './ActivityList';
import { ScheduleGrid } from './schedule/ScheduleGrid';
import type { Activity } from '../models/Activity';
import type { TimeSlot } from '../models/types';

export const GameShell = observer(function GameShell() {
  const gameStore = useGameStore();
  const uiStore = useUIStore();
  const showSidebar = gameStore.currentMode === 'schedule';
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);

  // Activation constraint prevents click from triggering drag
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const activityData = event.active.data.current as { type: string; activity: Activity } | undefined;
    if (activityData?.type === 'activity') {
      setActiveActivity(activityData.activity);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveActivity(null);
    const { active, over } = event;
    if (!over) return;

    const activityData = active.data.current as { type: string; activity: Activity } | undefined;
    const cellData = over.data.current as { type: string; patientId: string; timeSlot: TimeSlot } | undefined;

    if (activityData?.type === 'activity' && cellData?.type === 'cell') {
      gameStore.assignActivity(
        cellData.patientId,
        cellData.timeSlot,
        activityData.activity.id
      );
      // Clear selection after drag-drop as well
      uiStore.clearSelection();
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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

      {/* Drag overlay renders in portal - always on top */}
      <DragOverlay dropAnimation={null}>
        {activeActivity ? (
          <div className="px-4 py-3 bg-base-200 border border-base-300 rounded-lg shadow-lg cursor-grabbing">
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium">{activeActivity.name}</span>
              <span className={activeActivity.isRestoring ? 'text-success font-semibold' : 'text-error font-semibold'}>
                {activeActivity.formattedCost}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
});
