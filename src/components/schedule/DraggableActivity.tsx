import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { observer } from 'mobx-react-lite';
import { ArrowUp, ArrowDown } from 'lucide-react';
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={clsx(
        'px-4 py-3 border-b border-base-300 last:border-b-0 cursor-grab active:cursor-grabbing',
        tint,
        isDragging && 'opacity-50 scale-105 z-50'
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
