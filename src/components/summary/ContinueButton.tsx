import { observer } from 'mobx-react-lite';
import { useGameStore } from '../../stores/GameStore';

interface ContinueButtonProps {
  onContinue: () => void;
}

export const ContinueButton = observer(function ContinueButton({
  onContinue,
}: ContinueButtonProps) {
  const gameStore = useGameStore();

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-base-content/70">Ready for the next day?</p>
      <button className="btn btn-primary btn-lg" onClick={onContinue}>
        Continue to Day {gameStore.currentDay + 1}
      </button>
    </div>
  );
});
