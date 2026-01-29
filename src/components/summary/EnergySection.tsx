import { observer } from 'mobx-react-lite';
import { useGameStore } from '../../stores/GameStore';

interface EnergyBarProps {
  patientName: string;
  startEnergy: number;
  endEnergy: number;
  maxEnergy?: number;
}

// Wrap with observer to prevent babel plugin from adding duplicate import
const EnergyBar = observer(function EnergyBar({
  patientName,
  startEnergy,
  endEnergy,
  maxEnergy = 10,
}: EnergyBarProps) {
  const startPercent = (startEnergy / maxEnergy) * 100;
  const endPercent = (Math.max(0, endEnergy) / maxEnergy) * 100;
  const change = endEnergy - startEnergy;

  return (
    <div className="card bg-base-300 p-4">
      <h4 className="mb-3 font-medium">{patientName}</h4>

      {/* Start bar */}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-12 text-xs text-base-content/60">Start</span>
        <div className="h-3 flex-1 rounded-full bg-base-200">
          <div
            className="h-full rounded-full bg-info transition-all"
            style={{ width: `${startPercent}%` }}
          />
        </div>
        <span className="w-8 text-right text-sm tabular-nums">{startEnergy}</span>
      </div>

      {/* End bar */}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-12 text-xs text-base-content/60">End</span>
        <div className="h-3 flex-1 rounded-full bg-base-200">
          <div
            className={`h-full rounded-full transition-all ${
              endEnergy >= startEnergy ? 'bg-success' : 'bg-error'
            }`}
            style={{ width: `${endPercent}%` }}
          />
        </div>
        <span className="w-8 text-right text-sm tabular-nums">{endEnergy}</span>
      </div>

      {/* Change indicator */}
      <div
        className={`text-center text-sm font-semibold ${
          change > 0 ? 'text-success' : change < 0 ? 'text-error' : 'text-base-content'
        }`}
      >
        {change > 0 ? '+' : ''}
        {change}
      </div>
    </div>
  );
});

export const EnergySection = observer(function EnergySection() {
  const gameStore = useGameStore();

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h3 className="text-lg font-semibold">Overskudd Changes</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {gameStore.patients.map((patient) => {
          const startEnergy =
            gameStore.startEnergySnapshot.get(patient.id) ?? patient.energy;
          const endEnergy = patient.energy;

          return (
            <EnergyBar
              key={patient.id}
              patientName={patient.name}
              startEnergy={startEnergy}
              endEnergy={endEnergy}
            />
          );
        })}
      </div>
    </div>
  );
});
