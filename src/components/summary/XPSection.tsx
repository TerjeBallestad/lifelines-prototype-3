import { observer } from 'mobx-react-lite';
import { useGameStore } from '../../stores/GameStore';
import type { XPGain, TimeSlot } from '../../models/types';

const TIME_SLOTS: TimeSlot[] = ['morning', 'afternoon', 'evening'];

// Mock XP gains based on patient's scheduled activities
// Phase 5 will implement real XP tracking and formulas
function getMockXPGains(
  patientId: string,
  gameStore: ReturnType<typeof useGameStore>
): XPGain[] {
  const gains: XPGain[] = [];

  for (const slot of TIME_SLOTS) {
    const activity = gameStore.getAssignment(patientId, slot);
    if (activity) {
      gains.push({
        activityId: activity.id,
        activityName: activity.name,
        xp: 15, // Fixed mock value - Phase 5 implements real formula
      });
    }
  }

  return gains;
}

export const XPSection = observer(function XPSection() {
  const gameStore = useGameStore();

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h3 className="text-lg font-semibold">Skills Practiced</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {gameStore.patients.map((patient) => {
          const xpGains = getMockXPGains(patient.id, gameStore);

          return (
            <div key={patient.id} className="card bg-base-200 p-4">
              <h4 className="mb-2 font-medium">{patient.name}</h4>
              {xpGains.length > 0 ? (
                <ul className="space-y-1 text-sm">
                  {xpGains.map((gain) => (
                    <li key={gain.activityId} className="flex justify-between">
                      <span>{gain.activityName}</span>
                      <span className="text-success">+{gain.xp} XP</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-base-content/60">No activities today</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
