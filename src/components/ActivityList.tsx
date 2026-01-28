import { observer } from 'mobx-react-lite';
import { useGameStore } from '../stores/GameStore';
import { DraggableActivity } from './schedule/DraggableActivity';

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
          <DraggableActivity key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
});
