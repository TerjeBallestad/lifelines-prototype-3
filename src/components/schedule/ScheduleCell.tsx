import { observer } from 'mobx-react-lite';
import { useGameStore } from '../../stores/GameStore';
import type { TimeSlot } from '../../models/types';

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

  return (
    <div
      className="min-h-16 rounded-lg border-2 border-dashed border-base-300 bg-base-100 p-2 flex items-center justify-center"
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
