import { useDroppable } from '@dnd-kit/core';
import { observer } from 'mobx-react-lite';
import { useGameStore } from '../../stores/GameStore';
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
  const activity = gameStore.getAssignment(patientId, timeSlot);

  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${patientId}-${timeSlot}`,
    data: { type: 'cell', patientId, timeSlot },
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'min-h-16 rounded-lg border-2 border-dashed p-2 flex items-center justify-center transition-colors',
        isOver
          ? 'bg-primary/20 border-primary border-solid'
          : 'border-base-300 bg-base-100'
      )}
      data-patient={patientId}
      data-slot={timeSlot}
    >
      {activity ? (
        <div className="text-center">
          <div className="font-medium text-sm">{activity.name}</div>
          <div className="text-xs text-base-content/60">
            ({activity.formattedCost})
          </div>
        </div>
      ) : (
        <span className="text-base-content/40 text-sm">Empty</span>
      )}
    </div>
  );
});
