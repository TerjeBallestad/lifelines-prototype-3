import { observer } from 'mobx-react-lite';
import { useGameStore } from '../stores/GameStore';
import { PatientCard } from './PatientCard';

export const PatientGrid = observer(function PatientGrid() {
  const gameStore = useGameStore();

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {gameStore.patients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
});
