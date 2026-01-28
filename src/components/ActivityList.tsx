import { observer } from 'mobx-react-lite';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useGameStore } from '../stores/GameStore';
import type { Activity } from '../models/Activity';
import clsx from 'clsx';

// MTG color to subtle background tint
const colorToTint: Record<string, string> = {
  white: 'bg-amber-900/10',
  blue: 'bg-blue-900/20',
  black: 'bg-gray-900/30',
  red: 'bg-red-900/20',
  green: 'bg-green-900/20',
};

interface ActivityRowProps {
  activity: Activity;
}

const ActivityRow = observer(function ActivityRow({ activity }: ActivityRowProps) {
  const tint = colorToTint[activity.color] || '';
  const isRestoring = activity.isRestoring;

  return (
    <div
      className={clsx(
        'px-4 py-3 border-b border-base-300 last:border-b-0',
        tint
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

export const ActivityList = observer(function ActivityList() {
  const gameStore = useGameStore();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-base-300 bg-base-300/50">
        <h2 className="font-bold text-lg">Activities</h2>
      </div>

      {/* Activity list - scrollable */}
      <div className="flex-1 overflow-y-auto">
        {gameStore.activities.map((activity) => (
          <ActivityRow key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
});
