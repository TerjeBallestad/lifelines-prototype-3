import { Activity } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 shadow-xl max-w-md w-full">
        <div className="card-body items-center text-center">
          <Activity className="w-16 h-16 text-primary mb-4" />
          <h1 className="card-title text-3xl font-bold">Lifelines Prototype</h1>
          <p className="text-base-content/70">
            Schedule-observe loop simulation game
          </p>
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
