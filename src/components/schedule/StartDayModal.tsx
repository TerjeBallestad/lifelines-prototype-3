import { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useGameStore } from '../../stores/GameStore';

export const StartDayModal = observer(function StartDayModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const gameStore = useGameStore();

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  const handleConfirm = () => {
    gameStore.captureStartEnergy(); // Snapshot energy values before day starts
    gameStore.setMode('observe');
    close();
  };

  return (
    <>
      <button className="btn btn-primary btn-lg" onClick={open}>
        Start Day {gameStore.currentDay}
      </button>

      <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Start Day {gameStore.currentDay}?</h3>
          <p className="py-4">
            Once started, you cannot change the schedule until the day ends.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Cancel</button>
            </form>
            <button className="btn btn-primary" onClick={handleConfirm}>
              Start Day
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
});
