import { useDroppable } from '@dnd-kit/core';
import { observer } from 'mobx-react-lite';
import { X } from 'lucide-react';
import { useGameStore } from '../../stores/GameStore';
import { useUIStore } from '../../stores/UIStore';
import type { TimeSlot } from '../../models/types';
import clsx from 'clsx';

interface ScheduleCellProps {
  patientId: string;
  timeSlot: TimeSlot;
}

export const ScheduleCell = observer(function ScheduleCell({
  patientId,
  timeSlot,
}: ScheduleCellProps) {
  const gameStore = useGameStore();
  const uiStore = useUIStore();
  const activity = gameStore.getAssignment(patientId, timeSlot);
  const hasSelectedActivity = uiStore.selectedActivityId !== null;

  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${patientId}-${timeSlot}`,
    data: { type: 'cell', patientId, timeSlot },
  });

  function handleCellClick() {
    // If we have a selected activity and cell is empty, assign it
    if (hasSelectedActivity && !activity) {
      gameStore.assignActivity(patientId, timeSlot, uiStore.selectedActivityId!);
      uiStore.clearSelection();
    }
  }

  function handleClearClick(e: React.MouseEvent) {
    e.stopPropagation(); // Prevent cell click from firing
    gameStore.clearAssignment(patientId, timeSlot);
  }

  // Show valid target highlight when activity selected and cell is empty
  const showValidTarget = hasSelectedActivity && !activity;

  return (
    <div
      ref={setNodeRef}
      onClick={handleCellClick}
      className={clsx(
        'relative min-h-16 rounded-lg border-2 border-dashed p-2 flex items-center justify-center transition-colors cursor-pointer',
        isOver
          ? 'bg-primary/20 border-primary border-solid'
          : showValidTarget
            ? 'bg-primary/10 border-primary/50'
            : 'border-base-300 bg-base-100'
      )}
      data-patient={patientId}
      data-slot={timeSlot}
    >
      {activity ? (
        <>
          <div className="text-center">
            <div className="font-medium text-sm">{activity.name}</div>
            <div className="text-xs text-base-content/60">
              ({activity.formattedCost})
            </div>
          </div>
          {/* Clear button */}
          <button
            onClick={handleClearClick}
            className="absolute top-1 right-1 p-0.5 rounded hover:bg-base-300 transition-colors"
            aria-label="Clear assignment"
          >
            <X className="w-4 h-4 text-base-content/40 hover:text-error" />
          </button>
        </>
      ) : (
        <span className="text-base-content/40 text-sm">Empty</span>
      )}
    </div>
  );
});
