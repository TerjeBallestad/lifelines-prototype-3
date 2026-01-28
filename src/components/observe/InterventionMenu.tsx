import { observer } from 'mobx-react-lite';
import { X, BedDouble } from 'lucide-react';
import { useGameStore } from '../../stores/GameStore';
import { useSimulationStore } from '../../stores/SimulationStore';
import clsx from 'clsx';

export const InterventionMenu = observer(function InterventionMenu() {
  const gameStore = useGameStore();
  const simStore = useSimulationStore();

  const patientId = simStore.interveningPatientId;
  if (!patientId) return null;

  const patient = gameStore.patients.find(p => p.id === patientId);
  if (!patient) return null;

  const currentActivity = gameStore.getAssignment(patientId, simStore.currentSlot);

  // Get Rest activity for "send to rest" option
  const restActivity = gameStore.activities.find(a => a.name === 'Rest');

  // Available activities (excluding current one)
  const availableActivities = gameStore.activities.filter(
    a => a.id !== currentActivity?.id
  );

  function handleSelectActivity(activityId: string | null) {
    simStore.applyIntervention(activityId);
  }

  function handleCancel() {
    simStore.cancelIntervention();
  }

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Menu */}
      <div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <div>
            <h2 className="text-lg font-bold">Intervene: {patient.name}</h2>
            <p className="text-sm text-base-content/60">
              Currently: {currentActivity?.name || 'Free time'} ({simStore.currentSlot})
            </p>
          </div>
          <button
            className="btn btn-ghost btn-circle btn-sm"
            onClick={handleCancel}
            aria-label="Cancel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick action: Send to rest */}
        {restActivity && currentActivity?.id !== restActivity.id && (
          <div className="p-4 border-b border-base-300">
            <button
              className="btn btn-success btn-block gap-2"
              onClick={() => handleSelectActivity(restActivity.id)}
            >
              <BedDouble size={20} />
              Send to Rest (+{restActivity.energyCost} energy)
            </button>
          </div>
        )}

        {/* Activity list */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-base-content/60 mb-2">
            Swap to different activity:
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableActivities.map(activity => (
              <button
                key={activity.id}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-colors text-left"
                onClick={() => handleSelectActivity(activity.id)}
              >
                <span className="font-medium">{activity.name}</span>
                <span className={clsx(
                  'font-semibold',
                  activity.energyCost > 0 ? 'text-success' : 'text-error'
                )}>
                  {activity.formattedCost}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer with token info */}
        <div className="p-4 bg-base-200 text-center text-sm text-base-content/60">
          Using 1 intervention token ({simStore.interventionTokens - 1} remaining after this)
        </div>
      </div>
    </div>
  );
});
