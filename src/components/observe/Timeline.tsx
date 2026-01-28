import { observer } from 'mobx-react-lite';
import { useSimulationStore } from '../../stores/SimulationStore';

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'] as const;

export const Timeline = observer(function Timeline() {
  const store = useSimulationStore();

  // Convert progress (0-1) to clock time (8 AM to 8 PM = 12 hours)
  const hours = 8 + store.progress * 12;
  const hour = Math.floor(hours);
  const minutes = Math.floor((hours % 1) * 60);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Clock display */}
      <div className="text-xl font-mono tabular-nums">
        {displayHour}:{minutes.toString().padStart(2, '0')} {ampm}
      </div>

      {/* Timeline bar */}
      <div className="flex w-80 h-2 bg-base-300 rounded-full overflow-hidden">
        {TIME_SLOTS.map((slot, i) => {
          // Each slot is 1/3 of the day
          // Fill percentage: how much of this slot is complete
          const slotStart = i / 3;
          const slotEnd = (i + 1) / 3;
          const slotProgress = store.progress;

          let fillPercent = 0;
          if (slotProgress >= slotEnd) {
            fillPercent = 100;
          } else if (slotProgress > slotStart) {
            fillPercent = ((slotProgress - slotStart) / (slotEnd - slotStart)) * 100;
          }

          return (
            <div key={slot} className="flex-1 relative">
              <div
                className="absolute inset-0 bg-primary transition-all duration-100"
                style={{ width: `${fillPercent}%` }}
              />
              {/* Slot divider (except last) */}
              {i < TIME_SLOTS.length - 1 && (
                <div className="absolute right-0 top-0 bottom-0 w-px bg-base-100" />
              )}
            </div>
          );
        })}
      </div>

      {/* Slot labels */}
      <div className="flex w-80 justify-between text-xs text-base-content/60">
        {TIME_SLOTS.map((slot) => (
          <span
            key={slot}
            className={store.currentSlot === slot.toLowerCase() ? 'text-primary font-medium' : ''}
          >
            {slot}
          </span>
        ))}
      </div>
    </div>
  );
});
