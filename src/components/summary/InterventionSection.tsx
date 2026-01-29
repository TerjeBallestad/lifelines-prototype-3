import { observer } from 'mobx-react-lite';
import { useSimulationStore } from '../../stores/SimulationStore';

export const InterventionSection = observer(function InterventionSection() {
  const simulationStore = useSimulationStore();

  // Calculate tokens used: initial (3) minus remaining
  const tokensUsed = 3 - simulationStore.interventionTokens;

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">Interventions</h3>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Tokens Used</div>
          <div className="stat-value">{tokensUsed}/3</div>
          <div className="stat-desc">
            {tokensUsed === 0
              ? 'No interventions needed!'
              : `Redirected ${tokensUsed} ${tokensUsed === 1 ? 'activity' : 'activities'}`}
          </div>
        </div>
      </div>
    </div>
  );
});
