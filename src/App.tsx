import { Activity } from 'lucide-react'
import { useGameStore } from './stores/GameStore'

function App() {
  const gameStore = useGameStore()

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 shadow-xl max-w-md w-full">
        <div className="card-body items-center text-center">
          <Activity className="w-16 h-16 text-primary mb-4" />
          <h1 className="card-title text-3xl font-bold">Lifelines Prototype</h1>
          <p className="text-base-content/70">
            Schedule-observe loop simulation game
          </p>

          {/* Store verification display */}
          <div className="mt-4 text-left text-sm w-full">
            <div className="bg-base-300 p-3 rounded-lg">
              <p><strong>Day:</strong> {gameStore.currentDay}</p>
              <p><strong>Mode:</strong> {gameStore.currentMode}</p>
              <p><strong>Patients:</strong> {gameStore.patients.length}</p>
              <ul className="ml-4 mt-1">
                {gameStore.patients.map(p => (
                  <li key={p.id}>
                    {p.name}: {p.energy}/{p.maxEnergy} ({p.energyStatus})
                  </li>
                ))}
              </ul>
              <p className="mt-2"><strong>Activities:</strong> {gameStore.activities.length}</p>
              <ul className="ml-4 mt-1">
                {gameStore.activities.map(a => (
                  <li key={a.id}>
                    {a.name}: {a.formattedCost} energy
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card-actions mt-6">
            <button className="btn btn-primary">Start Game</button>
            <button className="btn btn-ghost">Settings</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
