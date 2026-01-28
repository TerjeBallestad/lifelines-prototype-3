import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { observer } from 'mobx-react-lite';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useUIStore } from '../../stores/UIStore';
import type { Activity } from '../../models/Activity';
import clsx from 'clsx';

// MTG color to subtle background tint
const colorToTint: Record<string, string> = {
  white: 'bg-amber-900/10',
  blue: 'bg-blue-900/20',
  black: 'bg-gray-900/30',
  red: 'bg-red-900/20',
  green: 'bg-green-900/20',
};

interface DraggableActivityProps {
  activity: Activity;
}

export const DraggableActivity = observer(function DraggableActivity({
  activity,
}: DraggableActivityProps) {
  const uiStore = useUIStore();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `activity-${activity.id}`,
    data: { type: 'activity', activity },
  });

  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
      }
    : undefined;

  const tint = colorToTint[activity.color] || '';
  const isRestoring = activity.isRestoring;
  const isSelected = uiStore.selectedActivityId === activity.id;

  function handleClick() {
    // Toggle selection - click again to deselect
    if (isSelected) {
      uiStore.clearSelection();
    } else {
      uiStore.selectActivity(activity.id);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={clsx(
        'px-4 py-3 border-b border-base-300 last:border-b-0 cursor-grab active:cursor-grabbing',
        tint,
        isDragging && 'opacity-50 scale-105 z-50',
        isSelected && 'ring-2 ring-primary ring-inset bg-primary/10'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{activity.name}</span>
        <div className="flex items-center gap-1">
          {isRestoring ? (
            <>
              <ArrowUp className="w-4 h-4 text-success" />
              <span className="text-success font-semibold">
                {activity.formattedCost}
              </span>
            </>
          ) : (
            <>
              <ArrowDown className="w-4 h-4 text-error" />
              <span className="text-error font-semibold">
                {activity.formattedCost}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
